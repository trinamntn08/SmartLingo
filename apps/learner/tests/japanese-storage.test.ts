import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { randomUUID } from 'node:crypto';
import { notebookEntrySchema, parseBackupText, serializeBackup, type NotebookEntry } from '@smartlingo/domain';
import { openLearningRepository } from '../src/persistence';

const note: NotebookEntry = {
  id: 'notebook.ja.test-reason', sourceEntryId: 'ja.test-reason', language: 'ja-JP',
  target: '理由', reading: 'りゆう', meaning: 'reason', example: '理由を説明します。',
  exampleReading: 'りゆうをせつめいします。', updatedAt: '2026-11-19T09:00:00Z',
};

test('Japanese notes, readings, edits and course cursor survive reopen and private backup restore', async () => {
  const factory = new IDBFactory();
  const source = await openLearningRepository({ factory, name: 'japanese-source' });
  await source.captureNotebook(note);
  const edited = { ...note, meaning: 'my reason', updatedAt: '2026-11-19T09:01:00Z' };
  await source.saveNotebook(edited);
  // Capture must preserve personal edits on a second lesson visit.
  assert.deepEqual(await source.captureNotebook(note), edited);
  const navigation = { id: randomUUID(), courseId: 'ja.everyday-course', courseRevision: 1,
    dayId: 'ja.everyday-course.day-10', blockId: 'ja.everyday-course.day-10.study',
    kind: 'navigation' as const, occurredAt: '2026-11-19T09:02:00Z' };
  await source.recordCourseEvent(navigation);
  source.close();
  const reopened = await openLearningRepository({ factory, name: 'japanese-source' });
  assert.deepEqual(await reopened.listNotebook(), [edited]);
  const backup = parseBackupText(serializeBackup(await reopened.exportBackup()));
  assert.equal(backup.version, 4);
  const restored = await openLearningRepository({ factory, name: 'japanese-restored' });
  await restored.restoreBackup(backup);
  assert.deepEqual(await restored.listNotebook(), [edited]);
  assert.deepEqual(await restored.listCourseEvents(), [navigation]);
  assert.deepEqual(await restored.listEvents(), []);
  assert.equal((await restored.restoreBackup(backup)).courseEventsKept, 1);
  reopened.close(); restored.close();
});

test('v3 French backups migrate without relabelling legacy notes and invalid language metadata is rejected', () => {
  const { language: _language, reading: _reading, exampleReading: _exampleReading, ...legacy } = note;
  const french = { ...legacy, id: 'notebook.fr.raison', sourceEntryId: 'fr.raison', target: 'une raison', example: '' };
  const migrated = parseBackupText(JSON.stringify({ format: 'smartlingo-learning-backup', version: 3,
    createdAt: note.updatedAt, notebook: [french], events: [], reviewEvents: [], courseEvents: [], publishedLessons: [] }));
  assert.equal(migrated.version, 4);
  assert.deepEqual(migrated.notebook, [french]);
  assert.equal(notebookEntrySchema.safeParse({ ...note, language: 'unknown' }).success, false);
  assert.equal(notebookEntrySchema.safeParse({ ...note, reading: 'a'.repeat(301) }).success, false);
});
