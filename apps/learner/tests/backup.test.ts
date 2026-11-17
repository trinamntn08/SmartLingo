import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { restaurantLesson } from '@smartlingo/content';
import { parseBackupText, serializeBackup, maximumBackupBytes, type LearningBackup } from '@smartlingo/domain';
import { openLearningRepository } from '../src/persistence';
import { readBackupFile } from '../src/backup/files';

const backup: LearningBackup = {
  format: 'smartlingo-learning-backup', version: 3, createdAt: '2026-11-14T12:00:00Z',
  events: [{ id: '77777777-7777-4777-8777-777777777777', lessonId: restaurantLesson.id, revision: 1, itemId: 'fr.cafe', activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: '2026-11-14T12:00:00Z' }],
  notebook: [{ id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'my coffee note', example: '', updatedAt: '2026-11-14T12:00:00Z' }],
  publishedLessons: [{ ...restaurantLesson, revision: 3, status: 'published' }],
  reviewEvents: [{ id: '99999999-9999-4999-8999-999999999999', notebookId: 'notebook.fr.cafe', entryUpdatedAt: '2026-11-14T12:00:00Z', skill: 'recognition', source: 'manual', algorithmVersion: 1, rating: 'remembered', occurredAt: '2026-11-14T12:00:00Z', studyDate: '2026-11-14', timeZone: 'UTC' }],
  courseEvents: [{ id: '66666666-6666-4666-8666-666666666666', courseId: 'fr.daily', courseRevision: 1, dayId: 'fr.daily.day1', blockId: 'fr.daily.day1.study', kind: 'navigation', occurredAt: '2026-11-14T12:00:00Z' }],
};

test('download-format backup round-trips all learner stores; repeat merge keeps edits and deduplicates', async () => {
  const factory = new IDBFactory();
  const source = await openLearningRepository({ factory, name: 'source' });
  await source.restoreBackup(backup);
  const exported = await source.exportBackup();
  const text = serializeBackup(exported);
  const restored = await openLearningRepository({ factory, name: 'restored' });
  const report = await restored.restoreBackup(parseBackupText(text));
  assert.deepEqual(report, { eventsAdded: 1, eventsKept: 0, notesAdded: 1, notesKept: 0, lessonsUpdated: 1, lessonsKept: 0, reviewsAdded: 1, reviewsKept: 0, courseEventsAdded: 1, courseEventsKept: 0 });
  await restored.saveNotebook({ ...backup.notebook[0], meaning: 'Keep my later edit' });
  const repeat = await restored.restoreBackup(parseBackupText(text));
  assert.deepEqual(repeat, { eventsAdded: 0, eventsKept: 1, notesAdded: 0, notesKept: 1, lessonsUpdated: 0, lessonsKept: 1, reviewsAdded: 0, reviewsKept: 1, courseEventsAdded: 0, courseEventsKept: 1 });
  assert.deepEqual(await restored.listEvents(), backup.events);
  assert.equal((await restored.listNotebook())[0].meaning, 'Keep my later edit');
  assert.deepEqual(await restored.listPublishedLessons(), backup.publishedLessons);
  assert.deepEqual(await restored.listReviewEvents(), backup.reviewEvents);
  assert.equal(exported.version, 3);
  assert.deepEqual(await restored.listCourseEvents(), backup.courseEvents);
  source.close(); restored.close();
});

test('conflicting immutable events or lessons abort every store in a restore', async () => {
  const store = await openLearningRepository({ factory: new IDBFactory() });
  await store.restoreBackup(backup);
  const newNote = { ...backup.notebook[0], id: 'notebook.new', sourceEntryId: 'fr.new' };
  const newEvent = { ...backup.events[0], id: '88888888-8888-4888-8888-888888888888' };
  await assert.rejects(store.restoreBackup({ ...backup, events: [{ ...backup.events[0], hints: 1 }], notebook: [newNote] }), /conflicts/);
  assert.deepEqual(await store.listNotebook(), backup.notebook);
  await assert.rejects(store.restoreBackup({ ...backup, events: [newEvent], reviewEvents: [{ ...backup.reviewEvents[0], rating: 'again' }] }), /conflicts/);
  assert.deepEqual(await store.listEvents(), backup.events);
  await assert.rejects(store.restoreBackup({ ...backup, events: [newEvent], publishedLessons: [{ ...backup.publishedLessons[0], title: 'Conflict' }] }), /conflicts/);
  assert.deepEqual(await store.listEvents(), backup.events);
  assert.deepEqual(await store.listPublishedLessons(), backup.publishedLessons);
  const invalid = { ...backup, notebook: [{ ...newNote, meaning: '' }] };
  await assert.rejects(store.restoreBackup(invalid));
  assert.deepEqual(await store.listNotebook(), backup.notebook);
  store.close();
});

test('backup parsing rejects unknown versions, duplicate IDs, draft caches, corrupt and oversized files', async () => {
  assert.throws(() => parseBackupText('{broken'), /not a supported/);
  assert.throws(() => parseBackupText(JSON.stringify({ ...backup, version: 99 })), /not a supported/);
  assert.throws(() => parseBackupText(JSON.stringify({ ...backup, events: [backup.events[0], backup.events[0]] })), /not a supported/);
  assert.throws(() => parseBackupText(JSON.stringify({ ...backup, publishedLessons: [restaurantLesson] })), /not a supported/);
  assert.throws(() => parseBackupText('é'.repeat(maximumBackupBytes / 2 + 1)), /5 MB/);
  const oversized = { size: maximumBackupBytes + 1, text: async () => { throw new Error('Must not read an oversized file'); } } as unknown as File;
  await assert.rejects(readBackupFile(oversized), /5 MB/);
  assert.deepEqual(await readBackupFile(new File([JSON.stringify(backup)], 'backup.json')), backup);
  const bytes = new TextEncoder().encode(JSON.stringify(backup));
  const accent = bytes.indexOf(0xc3);
  assert.ok(accent >= 0);
  bytes[accent] = 0xff;
  await assert.rejects(readBackupFile(new File([bytes], 'corrupt-encoding.json')), /not valid UTF-8/);
});

test('version1 learning backups migrate to version3 without inventing review or course history', async () => {
  const { reviewEvents: _ratings, courseEvents: _course, ...legacy } = backup;
  const migrated = parseBackupText(JSON.stringify({ ...legacy, version: 1 }));
  assert.equal(migrated.version, 3);
  assert.deepEqual(migrated.reviewEvents, []);
  assert.deepEqual(migrated.courseEvents, []);
  assert.deepEqual(migrated.events, backup.events);
  assert.deepEqual(migrated.notebook, backup.notebook);
  assert.throws(() => parseBackupText(JSON.stringify({ ...legacy, version: 1, events: [backup.events[0], backup.events[0]] })), /not a supported/);
  const store = await openLearningRepository({ factory: new IDBFactory() });
  await store.restoreBackup(migrated);
  assert.deepEqual(await store.listEvents(), backup.events);
  assert.deepEqual(await store.listNotebook(), backup.notebook);
  assert.deepEqual(await store.listPublishedLessons(), backup.publishedLessons);
  assert.deepEqual(await store.listReviewEvents(), []);
  assert.deepEqual(await store.listCourseEvents(), []);
  store.close();
});

test('version2 backups preserve reviews and restore with no invented course history', async () => {
  const { courseEvents: _course, ...legacy } = backup;
  const migrated = parseBackupText(JSON.stringify({ ...legacy, version: 2 }));
  assert.equal(migrated.version, 3);
  assert.deepEqual(migrated.courseEvents, []);
  assert.deepEqual(migrated.reviewEvents, backup.reviewEvents);
  const store = await openLearningRepository({ factory: new IDBFactory() });
  await store.recordCourseEvent(backup.courseEvents[0]);
  const report = await store.restoreBackup(migrated);
  assert.equal(report.courseEventsAdded, 0);
  assert.equal(report.courseEventsKept, 0);
  assert.deepEqual(await store.listCourseEvents(), backup.courseEvents);
  assert.deepEqual(await store.listReviewEvents(), backup.reviewEvents);
  store.close();
});

test('course event conflicts roll back every store, and a corrected retry is idempotent', async () => {
  const store = await openLearningRepository({ factory: new IDBFactory() });
  await store.restoreBackup(backup);
  const incoming: LearningBackup = {
    ...backup,
    events: [{ ...backup.events[0], id: '88888888-8888-4888-8888-888888888888' }],
    notebook: [{ ...backup.notebook[0], id: 'notebook.new' }],
    publishedLessons: [{ ...backup.publishedLessons[0], revision: 4 }],
    reviewEvents: [{ ...backup.reviewEvents[0], id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }],
    courseEvents: [{ ...backup.courseEvents[0], kind: 'study' }],
  };
  await assert.rejects(store.restoreBackup(incoming), /course event conflicts/);
  assert.deepEqual(await store.listEvents(), backup.events);
  assert.deepEqual(await store.listNotebook(), backup.notebook);
  assert.deepEqual(await store.listPublishedLessons(), backup.publishedLessons);
  assert.deepEqual(await store.listReviewEvents(), backup.reviewEvents);
  assert.deepEqual(await store.listCourseEvents(), backup.courseEvents);
  const corrected = { ...incoming, courseEvents: [{ ...incoming.courseEvents[0], id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' }] };
  assert.equal((await store.restoreBackup(corrected)).courseEventsAdded, 1);
  assert.equal((await store.restoreBackup(corrected)).courseEventsKept, 1);
  assert.equal((await store.listCourseEvents()).length, 2);
  store.close();
});

test('course backup validation rejects invalid, duplicate and excessive history before writes', async () => {
  const store = await openLearningRepository({ factory: new IDBFactory() });
  for (const courseEvents of [
    [{ ...backup.courseEvents[0], courseRevision: 0 }],
    [backup.courseEvents[0], backup.courseEvents[0]],
    Array.from({ length: 20001 }, () => backup.courseEvents[0]),
  ]) {
    await assert.rejects(store.restoreBackup({ ...backup, courseEvents }));
    assert.throws(() => parseBackupText(JSON.stringify({ ...backup, courseEvents })));
    assert.deepEqual(await store.listEvents(), []);
    assert.deepEqual(await store.listNotebook(), []);
    assert.deepEqual(await store.listCourseEvents(), []);
  }
  store.close();
});
