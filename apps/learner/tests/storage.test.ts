import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import type { LearningEvent } from '@smartlingo/domain';
import { openLearningRepository } from '../src/persistence/index';
import { lessons, restaurantLesson } from '@smartlingo/content';

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

test('v1 browser data migrates to v2 without removing attempts or notes', async () => {
  const factory = new IDBFactory();
  const note = { id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'My existing note', example: '', updatedAt: attempt.occurredAt };
  await new Promise<void>((resolve, reject) => {
    const request = factory.open('smartlingo-learning', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('events', { keyPath: 'id' }).put(attempt);
      request.result.createObjectStore('notebook', { keyPath: 'id' }).put(note);
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { request.result.close(); resolve(); };
  });
  const store = await openLearningRepository({ factory });
  assert.deepEqual(await store.listEvents(), [attempt]);
  assert.deepEqual(await store.listNotebook(), [note]);
  assert.deepEqual(await store.listPublishedLessons(), []);
  await store.cachePublishedLessons([{ ...restaurantLesson, revision: 3, status: 'published' }]);
  store.close();
  const reopened = await openLearningRepository({ factory });
  assert.equal((await reopened.listPublishedLessons())[0].revision, 3);
  assert.deepEqual(await reopened.listEvents(), [attempt]);
  assert.deepEqual(await reopened.listNotebook(), [note]);
  reopened.close();
});

test('published cache rejects drafts and conflicting immutable revisions atomically', async () => {
  const store = await openLearningRepository({ factory: new IDBFactory() });
  const published = { ...restaurantLesson, revision: 3, status: 'published' as const };
  await store.cachePublishedLessons([published]);
  await assert.rejects(store.cachePublishedLessons([restaurantLesson]), /Draft/);
  await assert.rejects(store.cachePublishedLessons([
    { ...lessons[1], revision: 3, status: 'published' }, { ...published, title: 'Conflicting title' },
  ]), /immutable/);
  assert.deepEqual(await store.listPublishedLessons(), [published]);
  assert.deepEqual(await store.cachePublishedLessons([{ ...published, revision: 2 }]), [published]);
  store.close();
});

test('v2 cached publications survive v3 review-store migration; manual rating retries stay idempotent', async () => {
  const factory = new IDBFactory();
  await new Promise<void>((resolve, reject) => {
    const request = factory.open('smartlingo-learning', 2);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('events', { keyPath: 'id' }).put(attempt);
      request.result.createObjectStore('notebook', { keyPath: 'id' });
      request.result.createObjectStore('publishedLessons', { keyPath: 'id' }).put({ ...restaurantLesson, revision: 3, status: 'published' });
    };
    request.onsuccess = () => { request.result.close(); resolve(); };
    request.onerror = () => reject(request.error);
  });
  const store = await openLearningRepository({ factory });
  assert.equal((await store.listPublishedLessons())[0].revision, 3);
  const rating = { id: '99999999-9999-4999-8999-999999999999', notebookId: 'notebook.fr.cafe', entryUpdatedAt: '2026-11-14T12:00:00Z', skill: 'recognition' as const, source: 'manual' as const, algorithmVersion: 1 as const, rating: 'helped' as const, occurredAt: '2026-11-14T12:00:00Z', studyDate: '2026-11-14', timeZone: 'UTC' };
  await store.recordReview(rating);
  await store.recordReview(rating);
  await assert.rejects(store.recordReview({ ...rating, rating: 'remembered' }), /different attempt/);
  await assert.rejects(store.recordReview({ ...rating, studyDate: '2026-11-13' }));
  store.close();
  const reopened = await openLearningRepository({ factory });
  assert.deepEqual(await reopened.listReviewEvents(), [rating]);
  assert.deepEqual(await reopened.listEvents(), [attempt]);
  reopened.close();
});
