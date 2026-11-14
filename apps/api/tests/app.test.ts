import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons, restaurantLesson } from '@smartlingo/content';
import { createApp } from '../src/app';
import { InvalidStoredLessonError, SqliteLessonRepository } from '../src/repository';
import { readServerConfig } from '../src/server';

test('local preview routes serve validated drafts and useful missing/invalid ID responses', async () => {
  const repository = new SqliteLessonRepository(':memory:');
  repository.seed(lessons);
  const app = createApp(repository);
  try {
    const health = await app.inject('/health');
    assert.equal(health.statusCode, 200);
    assert.deepEqual(health.json(), { status: 'ok' });
    const catalogue = await app.inject('/lessons');
    assert.equal(catalogue.statusCode, 200);
    assert.equal(catalogue.json().lessons.length, lessons.length);
    assert.ok(catalogue.json().lessons.every((lesson: { status: string }) => lesson.status === 'draft'));
    const detail = await app.inject(`/lessons/${restaurantLesson.id}`);
    assert.equal(detail.statusCode, 200);
    assert.deepEqual(detail.json(), { lesson: restaurantLesson });
    const missing = await app.inject('/lessons/fr.missing');
    assert.equal(missing.statusCode, 404);
    assert.deepEqual(missing.json(), { error: 'Lesson not found' });
    assert.equal((await app.inject('/lessons/INVALID')).statusCode, 400);
    assert.equal((await app.inject({ method: 'POST', url: '/lessons', payload: restaurantLesson })).statusCode, 404);
    assert.equal(catalogue.headers['access-control-allow-origin'], undefined);
  } finally { await app.close(); }
  assert.throws(() => repository.listLessons());
});

test('damaged content returns a controlled error and closes the injected repository', async () => {
  let closed = false;
  const fail = () => { throw new InvalidStoredLessonError(); };
  const app = createApp({ listLessons: fail, getLesson: fail, close() { closed = true; } });
  try {
    for (const url of ['/lessons', `/lessons/${restaurantLesson.id}`]) {
      const response = await app.inject(url);
      assert.equal(response.statusCode, 500);
      assert.deepEqual(response.json(), { error: 'Content is unavailable. Check the local content database.' });
      assert.ok(!response.body.includes('stack'));
    }
  } finally { await app.close(); }
  assert.equal(closed, true);
});

test('server configuration defaults to loopback and refuses unsafe or malformed input', () => {
  assert.deepEqual(readServerConfig({}), { host: '127.0.0.1', port: 3001 });
  assert.deepEqual(readServerConfig({ HOST: '::1', PORT: '4321' }), { host: '::1', port: 4321 });
  for (const HOST of ['0.0.0.0', '192.168.1.3', 'example.com', '']) {
    assert.throws(() => readServerConfig({ HOST }), /HOST/);
  }
  for (const PORT of ['', '0', '-1', '65536', '1.5', ' 3001', '3e3', 'abc', '9007199254740993']) {
    assert.throws(() => readServerConfig({ PORT }), /PORT/);
  }
});
