import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import type { LearningEvent } from '@smartlingo/domain';
import { openLearningRepository } from '../src/persistence/index';

const attempt: LearningEvent = {
  id: '77777777-7777-4777-8777-777777777777', lessonId: 'fr.restaurant.customer', revision: 1,
  itemId: 'fr.cafe', activity: 'vocabulary', result: 'viewed', hints: 0,
  occurredAt: '2026-11-14T12:00:00.000Z',
};

test('attempt retries are idempotent and notebook edits persist across reopen', async () => {
  const factory = new IDBFactory();
  const first = await openLearningRepository({ factory });
  await first.recordEvent(attempt);
  await first.recordEvent(attempt);
  await assert.rejects(first.recordEvent({ ...attempt, hints: 1 }), /different attempt/);
  const entry = { id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'a coffee', example: '', updatedAt: attempt.occurredAt };
  await first.saveNotebook(entry);
  await first.saveNotebook({ ...entry, meaning: 'an espresso' });
  first.close();
  const second = await openLearningRepository({ factory });
  assert.deepEqual(await second.listEvents(), [attempt]);
  assert.equal((await second.listNotebook()).length, 1);
  assert.equal((await second.listNotebook())[0].meaning, 'an espresso');
  second.close();
});

test('independent tabs append without losing each other’s attempts', async () => {
  const factory = new IDBFactory();
  const first = await openLearningRepository({ factory });
  const second = await openLearningRepository({ factory });
  await Promise.all([
    first.recordEvent(attempt),
    second.recordEvent({ ...attempt, id: '88888888-8888-4888-8888-888888888888', hints: 1 }),
  ]);
  assert.equal((await first.listEvents()).length, 2);
  first.close(); second.close();
});

test('a stale lesson capture cannot overwrite personal edits from another tab', async () => {
  const factory = new IDBFactory();
  const first = await openLearningRepository({ factory });
  const stale = await openLearningRepository({ factory });
  const entry = { id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'a coffee', example: '', updatedAt: attempt.occurredAt };
  assert.deepEqual(await stale.listNotebook(), []);
  await first.captureNotebook(entry);
  await first.saveNotebook({ ...entry, meaning: 'My morning espresso' });
  const captured = await stale.captureNotebook(entry);
  assert.equal(captured.meaning, 'My morning espresso');
  assert.equal((await first.listNotebook())[0].meaning, 'My morning espresso');
  first.close(); stale.close();
});

test('unavailable, closed and invalid storage writes fail visibly', async () => {
  await assert.rejects(openLearningRepository(), /unavailable/);
  const repository = await openLearningRepository({ factory: new IDBFactory() });
  await assert.rejects(repository.saveNotebook({ id: 'x', sourceEntryId: 'fr.cafe', target: ' ', meaning: 'x', example: '', updatedAt: attempt.occurredAt }));
  repository.close();
  await assert.rejects(repository.recordEvent(attempt));
});
