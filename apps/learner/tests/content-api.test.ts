import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restaurantLesson } from '@smartlingo/content';
import { ContentApiError, localContentApi } from '../src/content/api';

test('content client submits explicit editor commands and validates resulting revisions', async context => {
  const calls: { url: string; options: RequestInit | undefined }[] = [];
  context.mock.method(globalThis, 'fetch', async (url: string, options?: RequestInit) => {
    calls.push({ url, options });
    return Response.json({ lesson: { ...restaurantLesson, revision: restaurantLesson.revision + 1 } });
  });
  const saved = await localContentApi.saveDraft(restaurantLesson, restaurantLesson.revision);
  assert.equal(saved.revision, restaurantLesson.revision + 1);
  assert.equal(calls[0].options?.method, 'POST');
  assert.equal((calls[0].options?.headers as Record<string, string>)['X-SmartLingo-Editor'], '1');
  assert.equal(JSON.parse(calls[0].options?.body as string).expectedRevision, restaurantLesson.revision);
  assert.equal(calls[0].options?.credentials, 'omit');
  context.mock.restoreAll();
});

test('untrusted published content is rejected; conflicts remain recoverable and are never retried', async context => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({ lessons: [restaurantLesson] }));
  await assert.rejects(localContentApi.getPublished(), /unpublished/);
  context.mock.restoreAll();
  const fetch = context.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Conflict' }, { status: 409 }));
  await assert.rejects(localContentApi.saveDraft(restaurantLesson, restaurantLesson.revision), error => error instanceof ContentApiError && error.status === 409);
  assert.equal(fetch.mock.callCount(), 1);
  context.mock.restoreAll();
});

test('content requests time out with a text recovery path', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  context.mock.method(globalThis, 'fetch', (_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const failed = assert.rejects(localContentApi.listLessons(), /unavailable or timed out/);
  context.mock.timers.tick(8001);
  await failed;
  context.mock.restoreAll(); context.mock.timers.reset();
});
