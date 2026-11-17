import {
  learningBackupSchema, learningEventSchema, notebookEntrySchema, lessonSchema, reviewEventSchema, courseEventSchema,
  type LearningBackup, type RestoreReport, type LearningEvent, type NotebookEntry, type Lesson, type ReviewEvent, type CourseEvent,
} from '@smartlingo/domain';
import { requestResult, transactionDone } from './transactions';

const stores = ['events', 'notebook', 'publishedLessons', 'reviewEvents', 'courseEvents'];

export async function exportLearningBackup(database: IDBDatabase): Promise<LearningBackup> {
  const transaction = database.transaction(stores, 'readonly');
  const done = transactionDone(transaction);
  const [rows] = await Promise.all([
    Promise.all(stores.map(name => requestResult(transaction.objectStore(name).getAll()))), done,
  ]);
  return learningBackupSchema.parse({
    format: 'smartlingo-learning-backup', version: 3, createdAt: new Date().toISOString(),
    events: rows[0], notebook: rows[1], publishedLessons: rows[2], reviewEvents: rows[3], courseEvents: rows[4],
  });
}

function mergeStored(store: IDBObjectStore, id: string, apply: (existing: unknown) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      try { apply(request.result); resolve(); }
      catch (error) { reject(error); store.transaction.abort(); }
    };
  });
}

function mergeEvent(store: IDBObjectStore, event: LearningEvent, report: RestoreReport): Promise<void> {
  return mergeStored(store, event.id, existing => {
    if (existing === undefined) { store.add(event); report.eventsAdded++; return; }
    if (JSON.stringify(learningEventSchema.parse(existing)) !== JSON.stringify(event)) {
      throw new Error('A backup attempt conflicts with an existing event ID. Nothing was restored.');
    }
    report.eventsKept++;
  });
}

function mergeNote(store: IDBObjectStore, note: NotebookEntry, report: RestoreReport): Promise<void> {
  return mergeStored(store, note.id, existing => {
    if (existing === undefined) { store.add(note); report.notesAdded++; }
    else { notebookEntrySchema.parse(existing); report.notesKept++; }
  });
}

function mergeLesson(store: IDBObjectStore, lesson: Lesson, report: RestoreReport): Promise<void> {
  return mergeStored(store, lesson.id, existing => {
    const current = existing === undefined ? undefined : lessonSchema.parse(existing);
    if (current && current.status !== 'published') throw new Error('Existing cached content is invalid. Nothing was restored.');
    if (current?.revision === lesson.revision && JSON.stringify(current) !== JSON.stringify(lesson)) {
      throw new Error('A backup lesson conflicts with an immutable cached revision. Nothing was restored.');
    }
    if (!current || lesson.revision > current.revision) { store.put(lesson); report.lessonsUpdated++; }
    else report.lessonsKept++;
  });
}

function mergeReview(store: IDBObjectStore, event: ReviewEvent, report: RestoreReport): Promise<void> {
  return mergeStored(store, event.id, existing => {
    if (existing === undefined) { store.add(event); report.reviewsAdded++; return; }
    if (JSON.stringify(reviewEventSchema.parse(existing)) !== JSON.stringify(event)) throw new Error('A backup rating conflicts with an immutable review ID. Nothing was restored.');
    report.reviewsKept++;
  });
}

export async function restoreLearningBackup(database: IDBDatabase, input: LearningBackup): Promise<RestoreReport> {
  const backup = learningBackupSchema.parse(input);
  const transaction = database.transaction(stores, 'readwrite');
  const done = transactionDone(transaction);
  const report: RestoreReport = { eventsAdded: 0, eventsKept: 0, notesAdded: 0, notesKept: 0, lessonsUpdated: 0, lessonsKept: 0, reviewsAdded: 0, reviewsKept: 0, courseEventsAdded: 0, courseEventsKept: 0 };
  const operations = [
    ...backup.events.map(event => mergeEvent(transaction.objectStore('events'), event, report)),
    ...backup.notebook.map(note => mergeNote(transaction.objectStore('notebook'), note, report)),
    ...backup.publishedLessons.map(lesson => mergeLesson(transaction.objectStore('publishedLessons'), lesson, report)),
    ...backup.reviewEvents.map(event => mergeReview(transaction.objectStore('reviewEvents'), event, report)),
    ...backup.courseEvents.map(event => mergeCourseEvent(transaction.objectStore('courseEvents'), event, report)),
  ];
  await Promise.all([...operations, done]);
  return report;
}

function mergeCourseEvent(store: IDBObjectStore, event: CourseEvent, report: RestoreReport): Promise<void> {
  return mergeStored(store, event.id, existing => {
    if (existing === undefined) { store.add(event); report.courseEventsAdded++; return; }
    if (JSON.stringify(courseEventSchema.parse(existing)) !== JSON.stringify(event)) {
      throw new Error('A backup course event conflicts with an immutable event ID. Nothing was restored.');
    }
    report.courseEventsKept++;
  });
}
