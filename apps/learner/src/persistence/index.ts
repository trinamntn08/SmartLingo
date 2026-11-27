import {
  learningEventSchema, notebookEntrySchema, lessonSchema, reviewEventSchema, courseEventSchema,
  type LearningEvent, type LearningRepository, type NotebookEntry, type Lesson, type LearningBackup, type RestoreReport, type ReviewEvent, type CourseEvent,
} from '@smartlingo/domain';
import { requestResult, transactionDone, appendImmutable, appendImmutableBatch } from './transactions';
import { exportLearningBackup, restoreLearningBackup } from './backup-store';

const databaseName = 'smartlingo-learning';
const schemaVersion = 4;

export async function openLearningRepository(options: {
  factory?: IDBFactory; name?: string;
} = {}): Promise<LearningRepository> {
  const factory = options.factory ?? globalThis.indexedDB;
  if (!factory) throw new Error('Browser storage is unavailable. Allow site storage and try again.');
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open(options.name ?? databaseName, schemaVersion);
    let blocked = false;
    request.onupgradeneeded = event => {
      if (event.oldVersion < 1) {
        request.result.createObjectStore('events', { keyPath: 'id' });
        request.result.createObjectStore('notebook', { keyPath: 'id' });
      }
      if (event.oldVersion < 2) request.result.createObjectStore('publishedLessons', { keyPath: 'id' });
      if (event.oldVersion < 3) request.result.createObjectStore('reviewEvents', { keyPath: 'id' });
      if (event.oldVersion < 4) request.result.createObjectStore('courseEvents', { keyPath: 'id' });
    };
    request.onblocked = () => {
      blocked = true;
      reject(new Error('Close other SmartLingo tabs, then retry to update browser storage.'));
    };
    request.onerror = () => reject(request.error ?? new Error('Could not open browser storage.'));
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      resolve(request.result);
    };
  });
  database.onversionchange = () => database.close();
  return new IndexedDbLearningRepository(database);
}

class IndexedDbLearningRepository implements LearningRepository {
  constructor(private readonly database: IDBDatabase) {}

  private async list(storeName: 'events' | 'notebook' | 'reviewEvents' | 'courseEvents'): Promise<unknown[]> {
    const transaction = this.database.transaction(storeName, 'readonly');
    const done = transactionDone(transaction);
    const [rows] = await Promise.all([requestResult(transaction.objectStore(storeName).getAll()), done]);
    return rows;
  }

  async listEvents(): Promise<LearningEvent[]> {
    return (await this.list('events')).map(row => learningEventSchema.parse(row));
  }

  recordEvent(input: LearningEvent): Promise<void> {
    return this.recordEvents([input]);
  }

  async recordEvents(inputs: readonly LearningEvent[]): Promise<void> {
    const events = inputs.map(input => learningEventSchema.parse(input));
    await appendImmutableBatch(this.database, 'events', events, row => learningEventSchema.parse(row));
  }

  async listReviewEvents(): Promise<ReviewEvent[]> { return (await this.list('reviewEvents')).map(row => reviewEventSchema.parse(row)); }
  async recordReview(input: ReviewEvent): Promise<void> {
    const event = reviewEventSchema.parse(input);
    await appendImmutable(this.database, 'reviewEvents', event, row => reviewEventSchema.parse(row));
  }

  async listNotebook(): Promise<NotebookEntry[]> {
    return (await this.list('notebook')).map(row => notebookEntrySchema.parse(row));
  }

  async listCourseEvents(): Promise<CourseEvent[]> {
    return (await this.list('courseEvents')).map(row => courseEventSchema.parse(row));
  }

  async recordCourseEvent(input: CourseEvent): Promise<void> {
    const event = courseEventSchema.parse(input);
    await appendImmutable(this.database, 'courseEvents', event, row => courseEventSchema.parse(row));
  }

  async captureNotebook(input: NotebookEntry): Promise<NotebookEntry> {
    const entry = notebookEntrySchema.parse(input);
    const transaction = this.database.transaction('notebook', 'readwrite');
    const done = transactionDone(transaction);
    const store = transaction.objectStore('notebook');
    const capture = new Promise<NotebookEntry>((resolve, reject) => {
      const request = store.get(entry.id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        try {
          if (request.result !== undefined) resolve(notebookEntrySchema.parse(request.result));
          else { store.add(entry); resolve(entry); }
        } catch (error) { reject(error); transaction.abort(); }
      };
    });
    const [saved] = await Promise.all([capture, done]);
    return saved;
  }

  async saveNotebook(input: NotebookEntry): Promise<void> {
    const entry = notebookEntrySchema.parse(input);
    const transaction = this.database.transaction('notebook', 'readwrite');
    const done = transactionDone(transaction);
    transaction.objectStore('notebook').put(entry);
    await done;
  }

  async removeNotebookEntries(ids: readonly NotebookEntry['id'][]): Promise<void> {
    const transaction = this.database.transaction('notebook', 'readwrite');
    const done = transactionDone(transaction);
    const store = transaction.objectStore('notebook');
    for (const id of ids) store.delete(id);
    await done;
  }

  async listPublishedLessons(): Promise<Lesson[]> {
    const transaction = this.database.transaction('publishedLessons', 'readonly');
    const done = transactionDone(transaction);
    const [rows] = await Promise.all([requestResult(transaction.objectStore('publishedLessons').getAll()), done]);
    return rows.map(parsePublishedLesson);
  }

  async cachePublishedLessons(inputs: Lesson[]): Promise<Lesson[]> {
    const lessons = inputs.map(parsePublishedLesson);
    if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate lesson IDs in published catalogue.');
    const transaction = this.database.transaction('publishedLessons', 'readwrite');
    const done = transactionDone(transaction);
    const store = transaction.objectStore('publishedLessons');
    const writes = lessons.map(lesson => new Promise<void>((resolve, reject) => {
      const request = store.get(lesson.id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        try {
          const existing = request.result === undefined ? undefined : parsePublishedLesson(request.result);
          if (existing?.revision === lesson.revision && JSON.stringify(existing) !== JSON.stringify(lesson)) {
            throw new Error('The server changed an immutable published revision. Existing local content was kept.');
          }
          if (!existing || lesson.revision > existing.revision) store.put(lesson);
          resolve();
        } catch (error) { reject(error); transaction.abort(); }
      };
    }));
    await Promise.all([...writes, done]);
    return this.listPublishedLessons();
  }

  exportBackup(): Promise<LearningBackup> { return exportLearningBackup(this.database); }
  restoreBackup(backup: LearningBackup): Promise<RestoreReport> { return restoreLearningBackup(this.database, backup); }
  close(): void { this.database.close(); }
}

function parsePublishedLesson(input: unknown): Lesson {
  const lesson = lessonSchema.parse(input);
  if (lesson.status !== 'published') throw new Error('Draft lessons cannot enter the published cache.');
  return lesson;
}
