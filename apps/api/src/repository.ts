import { createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { draftSaveSchema, lessonSchema, revisionRequestSchema, type Lesson } from '@smartlingo/domain';
import { migrateContentDatabase } from './migrations';
import { EditorError } from './editor-error';

type SeedBaseline = { revision: number; sha256: string; nextRevision?: number };

export interface LessonRepository {
  listLessons(): Lesson[];
  getLesson(id: string): Lesson | undefined;
  listPublishedLessons(): Lesson[];
  saveDraft(id: string, input: unknown): Lesson;
  publishDraft(id: string, expectedRevision: number): Lesson;
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

  listPublishedLessons(): Lesson[] {
    // Status is already part of the v1 payload; keep that schema and all revisions intact.
    // Validate before selecting so corruption cannot silently disappear from the catalogue.
    const revisions = this.database.prepare('SELECT id, revision, payload FROM lesson_revisions ORDER BY id, revision DESC')
      .all().map(readLesson);
    const published = new Map<string, Lesson>();
    for (const lesson of revisions) {
      if (lesson.status === 'published' && !published.has(lesson.id)) published.set(lesson.id, lesson);
    }
    return [...published.values()];
  }

  saveDraft(id: string, input: unknown): Lesson {
    const command = draftSaveSchema.safeParse(input);
    if (!command.success || command.data.lesson.id !== id) throw new EditorError(400, 'Invalid draft');
    return this.transaction(() => {
      this.requireRevision(id, command.data.expectedRevision);
      const lesson = lessonSchema.parse({ ...command.data.lesson, revision: command.data.expectedRevision + 1 });
      this.insertLesson(lesson);
      return lesson;
    });
  }

  publishDraft(id: string, expectedRevision: number): Lesson {
    if (!revisionRequestSchema.safeParse({ expectedRevision }).success) throw new EditorError(400, 'Invalid revision');
    return this.transaction(() => {
      const draft = this.requireRevision(id, expectedRevision);
      if (draft.status !== 'draft') throw new EditorError(409, 'Only the latest saved draft can be published');
      const published = lessonSchema.parse({ ...draft, revision: expectedRevision + 1, status: 'published' });
      this.insertLesson(published);
      return published;
    });
  }

  /** Internal explicit revision append. HTTP edits use the guarded draft/publication operations. */
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

  /** Append trusted seed updates only to an exact, untouched prior draft; retain every revision. */
  seed(inputs: readonly unknown[], baselines?: Readonly<Record<string, SeedBaseline | readonly SeedBaseline[]>>): void {
    const lessons = inputs.map(input => lessonSchema.parse(input));
    if (lessons.some(lesson => lesson.status !== 'draft')) throw new Error('Preview seeds must be drafts');
    this.transaction(() => {
      for (const lesson of lessons) {
        const existing = this.getLesson(lesson.id);
        if (!existing) {
          this.insertLesson(lesson);
          continue;
        }
        const baseline = baselines && Object.hasOwn(baselines, lesson.id) ? baselines[lesson.id] : undefined;
        const candidates: readonly SeedBaseline[] = !baseline ? [] : Array.isArray(baseline) ? baseline : [baseline as SeedBaseline];
        if (existing.status === 'draft' && candidates.some(candidate => existing.revision === candidate.revision &&
          lesson.revision > existing.revision && lesson.revision === (candidate.nextRevision ?? candidate.revision + 1) &&
          createHash('sha256').update(JSON.stringify(existing)).digest('hex') === candidate.sha256)) {
          this.insertLesson(lesson);
        }
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

  private requireRevision(id: string, expectedRevision: number): Lesson {
    const lesson = this.getLesson(id);
    if (!lesson) throw new EditorError(404, 'Lesson not found');
    if (lesson.revision !== expectedRevision) throw new EditorError(409, 'Lesson changed. Reload before continuing.');
    return lesson;
  }

  private transaction<T>(operation: () => T): T {
    this.database.exec('BEGIN IMMEDIATE');
    try {
      const result = operation();
      this.database.exec('COMMIT');
      return result;
    } catch (error) {
      this.database.exec('ROLLBACK');
      throw error;
    }
  }
}
