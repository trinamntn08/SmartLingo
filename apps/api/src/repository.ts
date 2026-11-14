import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { lessonSchema, type Lesson } from '@smartlingo/domain';
import { migrateContentDatabase } from './migrations';

export interface LessonRepository {
  listLessons(): Lesson[];
  getLesson(id: string): Lesson | undefined;
  close(): void;
}

export class InvalidStoredLessonError extends Error {
  constructor() {
    // Do not include stored payloads in logs or HTTP errors.
    super('Stored lesson failed validation');
    this.name = 'InvalidStoredLessonError';
  }
}

function readLesson(row: Record<string, unknown>): Lesson {
  try {
    if (typeof row.payload !== 'string') throw new Error('Missing payload');
    const lesson = lessonSchema.parse(JSON.parse(row.payload));
    if (lesson.id !== row.id || lesson.revision !== row.revision) throw new Error('Revision mismatch');
    return lesson;
  } catch {
    throw new InvalidStoredLessonError();
  }
}

export class SqliteLessonRepository implements LessonRepository {
  private readonly database: DatabaseSync;
  private closed = false;

  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.database = new DatabaseSync(path, { timeout: 2000 });
    try {
      migrateContentDatabase(this.database);
    } catch (error) {
      this.database.close();
      throw error;
    }
  }

  listLessons(): Lesson[] {
    return this.database.prepare(`
      SELECT id, revision, payload FROM lesson_revisions AS current
      WHERE revision = (SELECT MAX(revision) FROM lesson_revisions WHERE id = current.id)
      ORDER BY id
    `).all().map(readLesson);
  }

  getLesson(id: string): Lesson | undefined {
    const row = this.database.prepare(`
      SELECT id, revision, payload FROM lesson_revisions WHERE id = ? ORDER BY revision DESC LIMIT 1
    `).get(id);
    return row ? readLesson(row) : undefined;
  }

  /** Append an explicit revision. Existing revisions are immutable. No HTTP write route is exposed. */
  saveLesson(input: unknown): void {
    const lesson = lessonSchema.parse(input);
    this.transaction(() => {
      const existing = this.getLesson(lesson.id);
      if (existing && lesson.revision <= existing.revision) {
        if (lesson.revision === existing.revision && JSON.stringify(existing) === JSON.stringify(lesson)) return;
        throw new Error('A new lesson revision must be higher than the existing revision');
      }
      this.insertLesson(lesson);
    });
  }

  /** Seed only absent IDs: startup never replaces local content, even with a newer bundled seed. */
  seed(inputs: readonly unknown[]): void {
    const lessons = inputs.map(input => lessonSchema.parse(input));
    if (lessons.some(lesson => lesson.status !== 'draft')) throw new Error('Preview seeds must be drafts');
    this.transaction(() => {
      for (const lesson of lessons) {
        if (!this.getLesson(lesson.id)) this.insertLesson(lesson);
      }
    });
  }

  close(): void {
    if (this.closed) return;
    this.database.close();
    this.closed = true;
  }

  private insertLesson(lesson: Lesson): void {
    this.database.prepare('INSERT INTO lesson_revisions (id, revision, payload) VALUES (?, ?, ?)')
      .run(lesson.id, lesson.revision, JSON.stringify(lesson));
  }

  private transaction(operation: () => void): void {
    this.database.exec('BEGIN IMMEDIATE');
    try {
      operation();
      this.database.exec('COMMIT');
    } catch (error) {
      this.database.exec('ROLLBACK');
      throw error;
    }
  }
}
