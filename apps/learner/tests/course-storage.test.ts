import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import type { CourseEvent, LearningEvent, NotebookEntry, ReviewEvent } from '@smartlingo/domain';
import { restaurantLesson } from '@smartlingo/content';
import { openLearningRepository } from '../src/persistence';

const navigation: CourseEvent = {
  id: '11111111-1111-4111-8111-111111111111', courseId: 'fr.daily', courseRevision: 1,
  dayId: 'fr.daily.day1', blockId: 'fr.daily.day1.study', kind: 'navigation', occurredAt: '2026-11-17T12:00:00Z',
};

test('course events persist every kind across reopen, deduplicate retries, and reject conflicting IDs', async () => {
  const factory = new IDBFactory();
  const first = await openLearningRepository({ factory });
  const events: CourseEvent[] = [
    navigation,
    { ...navigation, id: '22222222-2222-4222-8222-222222222222', kind: 'study' },
    { ...navigation, id: '33333333-3333-4333-8333-333333333333', kind: 'support' },
    { ...navigation, id: '44444444-4444-4444-8444-444444444444', kind: 'choice', choiceId: 'answer.hello', result: 'correct', supported: true },
    { ...navigation, id: '55555555-5555-4555-8555-555555555555', kind: 'reflection' },
    { ...navigation, id: '66666666-6666-4666-8666-666666666666', kind: 'completion' },
  ];
  for (const event of events) { await first.recordCourseEvent(event); await first.recordCourseEvent(event); }
  await assert.rejects(first.recordCourseEvent({ ...navigation, courseRevision: 2 }), /different attempt/);
  assert.deepEqual(await first.listEvents(), []);
  first.close();
  const reopened = await openLearningRepository({ factory });
  assert.deepEqual(await reopened.listCourseEvents(), events);
  assert.deepEqual((await reopened.exportBackup()).courseEvents, events);
  reopened.close();
});

test('independent tabs serialize course writes and immutable retries without losing history', async () => {
  const factory = new IDBFactory();
  const first = await openLearningRepository({ factory });
  const second = await openLearningRepository({ factory });
  const other = { ...navigation, id: '22222222-2222-4222-8222-222222222222' };
  await Promise.all([first.recordCourseEvent(navigation), second.recordCourseEvent(navigation), second.recordCourseEvent(other)]);
  assert.deepEqual(await first.listCourseEvents(), [navigation, other]);
  first.close(); second.close();
});

test('invalid course writes and corrupt stored course data fail visibly', async () => {
  const factory = new IDBFactory();
  const repository = await openLearningRepository({ factory });
  await assert.rejects(repository.recordCourseEvent({ ...navigation, courseRevision: 0 }));
  await assert.rejects(repository.recordCourseEvent({ ...navigation, kind: 'choice' } as CourseEvent));
  assert.deepEqual(await repository.listCourseEvents(), []);
  repository.close();
  await assert.rejects(repository.recordCourseEvent(navigation));
  await new Promise<void>((resolve, reject) => {
    const request = factory.open('smartlingo-learning');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('courseEvents', 'readwrite');
      transaction.objectStore('courseEvents').put({ ...navigation, kind: 'unknown' });
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onabort = () => { database.close(); reject(transaction.error); };
    };
  });
  const reopened = await openLearningRepository({ factory });
  await assert.rejects(reopened.listCourseEvents());
  await assert.rejects(reopened.exportBackup());
  await assert.rejects(reopened.recordCourseEvent(navigation));
  reopened.close();
});

test('v3 upgrade adds course history while preserving notebook, attempts, reviews and publications', async () => {
  const factory = new IDBFactory();
  const attempt: LearningEvent = { id: navigation.id, lessonId: restaurantLesson.id, revision: 1, itemId: 'fr.cafe', activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: navigation.occurredAt };
  const note: NotebookEntry = { id: 'notebook.fr.cafe', sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'My coffee note', example: '', updatedAt: navigation.occurredAt };
  const rating: ReviewEvent = { id: navigation.id, notebookId: note.id, entryUpdatedAt: note.updatedAt, skill: 'recognition', source: 'manual', algorithmVersion: 1, rating: 'helped', occurredAt: navigation.occurredAt, studyDate: '2026-11-17', timeZone: 'UTC' };
  const publication = { ...restaurantLesson, revision: 3, status: 'published' as const };
  await new Promise<void>((resolve, reject) => {
    const request = factory.open('smartlingo-learning', 3);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('events', { keyPath: 'id' }).put(attempt);
      request.result.createObjectStore('notebook', { keyPath: 'id' }).put(note);
      request.result.createObjectStore('reviewEvents', { keyPath: 'id' }).put(rating);
      request.result.createObjectStore('publishedLessons', { keyPath: 'id' }).put(publication);
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { request.result.close(); resolve(); };
  });
  const repository = await openLearningRepository({ factory });
  assert.deepEqual(await repository.listCourseEvents(), []);
  await repository.recordCourseEvent(navigation);
  assert.deepEqual(await repository.listEvents(), [attempt]);
  assert.deepEqual(await repository.listNotebook(), [note]);
  assert.deepEqual(await repository.listReviewEvents(), [rating]);
  assert.deepEqual(await repository.listPublishedLessons(), [publication]);
  repository.close();
  const reopened = await openLearningRepository({ factory });
  const backup = await reopened.exportBackup();
  assert.deepEqual(backup.courseEvents, [navigation]);
  assert.deepEqual(backup.events, [attempt]);
  assert.deepEqual(backup.notebook, [note]);
  assert.deepEqual(backup.reviewEvents, [rating]);
  assert.deepEqual(backup.publishedLessons, [publication]);
  reopened.close();
});
