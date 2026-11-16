import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';

test('speech calls require the exact local origin, feature header and JSON, including encoded paths', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: { async synthesize() {
    calls++; return new Uint8Array([73, 68, 51, 4, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  } } } });
  const payload = { requestId: randomUUID(), input: { text: 'Bonjour !', voice: 'fr-FR-DeniseNeural', pace: 'gentle' } };
  const valid = { origin: 'http://localhost:8081', 'x-smartlingo-speech': '1', 'content-type': 'application/json' };
  try {
    for (const headers of [
      { ...valid, origin: undefined }, { ...valid, origin: 'https://attacker.test' },
      { ...valid, 'x-smartlingo-speech': undefined }, { ...valid, 'x-smartlingo-speech': '0' },
      { ...valid, host: 'attacker.test' },
    ]) assert.equal((await app.inject({ method: 'POST', url: '/speech/generate', headers: Object.fromEntries(Object.entries(headers).filter(([, value]) => value !== undefined)), payload })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url: '/speech/generate', headers: { ...valid, 'content-type': 'text/plain' }, payload: JSON.stringify(payload) })).statusCode, 415);
    const encoded = await app.inject({ method: 'POST', url: '/speech/%67enerate', headers: { 'content-type': 'application/json' }, payload });
    assert.ok([403, 404].includes(encoded.statusCode));
    assert.equal(calls, 0);
    assert.equal((await app.inject({ url: '/speech/status', headers: { origin: 'http://127.0.0.1:8084' } })).statusCode, 200);
    assert.equal((await app.inject({ url: '/speech/status', headers: { origin: 'http://127.0.0.1:8085' } })).statusCode, 403);
    const status = await app.inject({ url: '/speech/status', headers: { origin: valid.origin } });
    assert.equal(status.statusCode, 200);
    assert.equal(status.headers['cache-control'], 'no-store');
    assert.equal(status.headers['access-control-allow-origin'], valid.origin);
    const allowed = await app.inject({ method: 'OPTIONS', url: '/speech/generate', headers: {
      origin: valid.origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type,x-smartlingo-speech',
    } });
    assert.equal(allowed.statusCode, 204);
    assert.equal(allowed.headers['access-control-allow-headers'], 'Content-Type, X-SmartLingo-Speech');
    const wrong = await app.inject({ method: 'OPTIONS', url: '/speech/generate', headers: {
      origin: valid.origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type,x-smartlingo-editor',
    } });
    assert.equal(wrong.statusCode, 403);
    assert.equal(calls, 0);
    assert.equal((await app.inject({ method: 'POST', url: '/speech/generate', headers: valid, payload })).statusCode, 200);
    assert.equal(calls, 1);
  } finally { await app.close(); }
});

test('HTTP socket deadline outlasts speech generation and a successful request remains reusable', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: { async synthesize() {
    calls++; await new Promise(resolve => setTimeout(resolve, 30));
    return new Uint8Array([73, 68, 51, 4, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  } } } });
  try {
    await app.listen({ host: '127.0.0.1', port: 0 });
    assert.ok(app.server.timeout > 30_000, 'The real Node HTTP idle socket permits the full speech deadline');
    const port = (app.server.address() as AddressInfo).port;
    const command = { requestId: randomUUID(), input: { text: 'Bonjour.', voice: 'fr-FR-HenriNeural', pace: 'gentle' } };
    const options = { method: 'POST', headers: { Origin: 'http://localhost:8081', 'Content-Type': 'application/json', 'X-SmartLingo-Speech': '1' }, body: JSON.stringify(command) };
    assert.equal((await fetch(`http://127.0.0.1:${port}/speech/generate`, options)).status, 200);
    assert.equal((await fetch(`http://127.0.0.1:${port}/speech/generate`, options)).status, 200);
    assert.equal(calls, 1);
  } finally { await app.close(); }
});
