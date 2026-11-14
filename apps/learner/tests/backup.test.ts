import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { restaurantLesson } from '@smartlingo/content';
import { parseBackupText, serializeBackup, maximumBackupBytes, type LearningBackup } from '@smartlingo/domain';
import { openLearningRepository } from '../src/persistence';
import { readBackupFile } from '../src/backup/files';

const backup: LearningBackup = {
  format: 'smartlingo-learning-backup', version: 1, createdAt: '2026-11-14T12:00:00Z',
  events: [{ id: '77777777-7777-4777-8777-777777777777', lessonId: restaurantLesson.id, revision: 1, itemId: 'fr.cafe', activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: '2026-11-14T12:00:00Z' }],
  notebook: [{ id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'my coffee note', example: '', updatedAt: '2026-11-14T12:00:00Z' }],
  publishedLessons: [{ ...restaurantLesson, revision: 3, status: 'published' }],
};

test('download-format backup round-trips all learner stores; repeat merge keeps edits and deduplicates', async () => {
  const factory = new IDBFactory();
  const source = await openLearningRepository({ factory, name: 'source' });
  await source.restoreBackup(backup);
  const exported = await source.exportBackup();
  const text = serializeBackup(exported);
  const restored = await openLearningRepository({ factory, name: 'restored' });
  const report = await restored.restoreBackup(parseBackupText(text));
  assert.deepEqual(report, { eventsAdded: 1, eventsKept: 0, notesAdded: 1, notesKept: 0, lessonsUpdated: 1, lessonsKept: 0 });
  await restored.saveNotebook({ ...backup.notebook[0], meaning: 'Keep my later edit' });
  const repeat = await restored.restoreBackup(parseBackupText(text));
  assert.deepEqual(repeat, { eventsAdded: 0, eventsKept: 1, notesAdded: 0, notesKept: 1, lessonsUpdated: 0, lessonsKept: 1 });
  assert.deepEqual(await restored.listEvents(), backup.events);
  assert.equal((await restored.listNotebook())[0].meaning, 'Keep my later edit');
  assert.deepEqual(await restored.listPublishedLessons(), backup.publishedLessons);
  source.close(); restored.close();
});

test('conflicting immutable events or lessons abort every store in a restore', async () => {
  const store = await openLearningRepository({ factory: new IDBFactory() });
  await store.restoreBackup(backup);
  const newNote = { ...backup.notebook[0], id: 'notebook.new', sourceEntryId: 'fr.new' };
  await assert.rejects(store.restoreBackup({ ...backup, events: [{ ...backup.events[0], hints: 1 }], notebook: [newNote] }), /conflicts/);
  assert.deepEqual(await store.listNotebook(), backup.notebook);
  const newEvent = { ...backup.events[0], id: '88888888-8888-4888-8888-888888888888' };
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
  assert.throws(() => parseBackupText(JSON.stringify({ ...backup, version: 2 })), /not a supported/);
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
