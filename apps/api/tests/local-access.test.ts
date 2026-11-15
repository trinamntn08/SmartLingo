import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons, restaurantLesson } from '@smartlingo/content';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';

const editorUrl = `/editor/lessons/${restaurantLesson.id}/preview`;
const allowedOrigin = 'http://localhost:8081';

function fixture() {
  const repository = new SqliteLessonRepository(':memory:');
  repository.seed(lessons);
  return { repository, app: createApp(repository) };
}

test('loopback Host guard rejects DNS rebinding, malformed hosts and spoofed forwarding headers', async () => {
  const { app } = fixture();
  try {
    for (const host of ['localhost:3001', '127.0.0.1:3001', '[::1]:3001', 'localhost']) {
      assert.equal((await app.inject({ url: '/health', headers: { host } })).statusCode, 200);
    }
    for (const host of ['attacker.test:3001', '127.0.0.1.attacker.test', 'localhost@attacker.test', '192.168.1.3:3001', 'localhost:0', 'localhost:65536', 'localhost:abc', 'localhost:']) {
      const response = await app.inject({ url: '/health', headers: { host, 'x-forwarded-host': 'localhost:3001' } });
      assert.equal(response.statusCode, 403, host);
      assert.equal(response.headers['access-control-allow-origin'], undefined);
    }
  } finally { await app.close(); }
});

test('editor POST requires exact allowed Origin, custom header and JSON even for encoded route segments', async () => {
  const { app, repository } = fixture();
  try {
    for (const origin of [undefined, 'null', 'https://localhost:8081', 'http://localhost:8083', 'http://localhost:8081.attacker.test', 'http://localhost:8082.attacker.test', 'http://attacker.test']) {
      const headers: Record<string, string> = { 'x-smartlingo-editor': '1', 'content-type': 'application/json' };
      if (origin !== undefined) headers.origin = origin;
      const response = await app.inject({ method: 'POST', url: editorUrl, headers, payload: { expectedRevision: restaurantLesson.revision } });
      assert.equal(response.statusCode, 403, String(origin));
      assert.equal(response.headers['access-control-allow-origin'], undefined);
    }
    for (const header of [undefined, '0', 'true', '1, 1']) {
      const headers: Record<string, string> = { origin: allowedOrigin, 'content-type': 'application/json' };
      if (header !== undefined) headers['x-smartlingo-editor'] = header;
      assert.equal((await app.inject({ method: 'POST', url: editorUrl, headers, payload: { expectedRevision: restaurantLesson.revision } })).statusCode, 403);
    }
    for (const contentType of ['text/plain', 'application/x-www-form-urlencoded']) {
      assert.equal((await app.inject({
        method: 'POST', url: editorUrl,
        headers: { origin: allowedOrigin, 'x-smartlingo-editor': '1', 'content-type': contentType },
        payload: JSON.stringify({ expectedRevision: restaurantLesson.revision }),
      })).statusCode, 415);
    }
    assert.equal((await app.inject({
      method: 'POST', url: editorUrl.replace('fr.restaurant', '%66r.restaurant'), payload: { expectedRevision: restaurantLesson.revision },
    })).statusCode, 403);
    for (const origin of [allowedOrigin, 'http://127.0.0.1:8081', 'http://localhost:8082', 'http://127.0.0.1:8082']) {
      const response = await app.inject({
        method: 'POST', url: editorUrl,
        headers: { origin, 'x-smartlingo-editor': '1', 'content-type': 'application/json; charset=utf-8' },
        payload: { expectedRevision: restaurantLesson.revision },
      });
      assert.equal(response.statusCode, 200);
      assert.equal(response.headers['access-control-allow-origin'], origin);
      assert.equal(response.headers['access-control-allow-credentials'], undefined);
    }
    assert.equal(repository.getLesson(restaurantLesson.id)?.revision, restaurantLesson.revision);
  } finally { await app.close(); }
});

test('CORS allows only exact approved preflight routes, methods and headers', async () => {
  const { app } = fixture();
  try {
    const headers = {
      origin: allowedOrigin, 'access-control-request-method': 'POST',
      'access-control-request-headers': 'content-type, x-smartlingo-editor',
    };
    const approved = await app.inject({ method: 'OPTIONS', url: editorUrl, headers });
    assert.equal(approved.statusCode, 204);
    assert.equal(approved.headers['access-control-allow-origin'], allowedOrigin);
    assert.equal(approved.headers['access-control-allow-methods'], 'POST');
    assert.equal(approved.headers['access-control-allow-headers'], 'Content-Type, X-SmartLingo-Editor');
    for (const change of [
      { origin: 'http://attacker.test' }, { origin: 'null' }, { origin: '' },
      { 'access-control-request-method': 'DELETE' },
      { 'access-control-request-headers': 'content-type, x-smartlingo-editor, authorization' },
      { 'access-control-request-headers': 'content-type' },
    ]) {
      const response = await app.inject({ method: 'OPTIONS', url: editorUrl, headers: { ...headers, ...change } });
      assert.equal(response.statusCode, 403);
      assert.equal(response.headers['access-control-allow-origin'], undefined);
      assert.equal(response.headers['access-control-allow-methods'], undefined);
    }
    assert.equal((await app.inject({ method: 'OPTIONS', url: '/unknown', headers })).statusCode, 403);
    assert.equal((await app.inject({ method: 'OPTIONS', url: editorUrl, headers: { origin: allowedOrigin } })).statusCode, 403);
    const readPreflight = await app.inject({ method: 'OPTIONS', url: '/published-lessons', headers: {
      origin: allowedOrigin, 'access-control-request-method': 'GET',
    } });
    assert.equal(readPreflight.statusCode, 204);
    const read = await app.inject({ url: '/published-lessons', headers: { origin: allowedOrigin } });
    assert.equal(read.headers['access-control-allow-origin'], allowedOrigin);
    assert.equal((await app.inject({ url: '/lessons', headers: { origin: 'http://attacker.test' } })).statusCode, 403);
  } finally { await app.close(); }
});
