import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { lessons, restaurantLesson } from '@smartlingo/content';
import { createApp } from '../src/app';
import { readApiAccessConfig, type AccessEnvironment, type HostedAccessOptions } from '../src/hosted-access';
import { SqliteLessonRepository } from '../src/repository';
import { readServerConfig, startServer } from '../src/server';

const adminToken = randomBytes(32).toString('hex');
const betaToken = randomBytes(32).toString('hex');
const origin = 'https://smartlingo.example';
const host = 'api.smartlingo.example';
const environment: AccessEnvironment = {
  SMARTLINGO_API_MODE: 'hosted', SMARTLINGO_ALLOWED_ORIGINS: origin,
  SMARTLINGO_PUBLIC_HOST: host, SMARTLINGO_ADMIN_TOKEN: adminToken, SMARTLINGO_BETA_TOKEN: betaToken,
};

function fixture() {
  const repository = new SqliteLessonRepository(':memory:');
  repository.seed(lessons);
  return createApp(repository, { access: readApiAccessConfig(environment) });
}

function headers(token?: string) {
  return { host, origin, ...(token ? { authorization: `Bearer ${token}` } : {}) };
}

test('hosted configuration fails closed and never permits an implicit public local API', async () => {
  assert.deepEqual(readApiAccessConfig({}), { mode: 'local' });
  assert.deepEqual(readServerConfig(environment), { host: '0.0.0.0', port: 3001 });
  for (const changes of [
    { SMARTLINGO_API_MODE: 'production' }, { SMARTLINGO_API_MODE: '' },
    { SMARTLINGO_ADMIN_TOKEN: undefined }, { SMARTLINGO_BETA_TOKEN: '' },
    { SMARTLINGO_ADMIN_TOKEN: 'short' }, { SMARTLINGO_BETA_TOKEN: adminToken },
    { SMARTLINGO_ADMIN_TOKEN: `${adminToken}\n` },
    { SMARTLINGO_ALLOWED_ORIGINS: '' }, { SMARTLINGO_ALLOWED_ORIGINS: '*' },
    { SMARTLINGO_ALLOWED_ORIGINS: 'http://smartlingo.example' },
    { SMARTLINGO_ALLOWED_ORIGINS: `${origin}/path` },
    { SMARTLINGO_ALLOWED_ORIGINS: `${origin}/` },
    { SMARTLINGO_ALLOWED_ORIGINS: 'https://user:password@smartlingo.example' },
    { SMARTLINGO_PUBLIC_HOST: '' }, { SMARTLINGO_PUBLIC_HOST: `https://${host}` },
    { SMARTLINGO_PUBLIC_HOST: `${host}/` }, { SMARTLINGO_PUBLIC_HOST: `${host}:0` },
    { SMARTLINGO_PUBLIC_HOST: `${host}@attacker.example` },
  ]) {
    const invalid = { ...environment, ...changes };
    assert.throws(() => readApiAccessConfig(invalid), JSON.stringify(Object.keys(changes)));
    await assert.rejects(startServer(invalid));
  }
  assert.throws(() => readServerConfig({ HOST: '0.0.0.0' }));
  const localOrigin = readApiAccessConfig({ ...environment, SMARTLINGO_ALLOWED_ORIGINS: 'http://localhost:8082' }) as HostedAccessOptions;
  assert.deepEqual(localOrigin.allowedOrigins, ['http://localhost:8082']);
});

test('public health/publications stay readable while drafts and paid routes require the correct bearer role', async () => {
  const app = fixture();
  try {
    for (const url of ['/health', '/published-lessons']) {
      const response = await app.inject({ url, headers: headers() });
      assert.equal(response.statusCode, 200);
      assert.equal(response.headers['access-control-allow-origin'], origin);
      assert.equal(response.headers['cache-control'], 'no-store');
      assert.equal(response.headers['access-control-allow-credentials'], undefined);
    }
    for (const url of ['/lessons', `/lessons/${restaurantLesson.id}`, '/ai/practice/status', '/speech/status']) {
      assert.equal((await app.inject({ url, headers: headers() })).statusCode, 401, url);
      assert.equal((await app.inject({ url, headers: { host } })).statusCode, 401, `${url} without Origin`);
      assert.equal((await app.inject({ url, headers: headers(adminToken) })).statusCode, 200, url);
    }
    for (const url of ['/lessons', `/lessons/${restaurantLesson.id}`]) {
      assert.equal((await app.inject({ url, headers: headers(betaToken) })).statusCode, 401);
    }
    for (const url of ['/ai/practice/status', '/speech/status']) {
      assert.equal((await app.inject({ url, headers: headers(betaToken) })).statusCode, 200);
    }
    assert.equal((await app.inject({ url: `/lessons?token=${adminToken}`, headers: headers() })).statusCode, 401);
    assert.equal((await app.inject({ url: '/lessons', headers: { ...headers(), cookie: `token=${adminToken}` } })).statusCode, 401);
    assert.equal((await app.inject({ url: '/lessons', headers: headers(randomBytes(32).toString('hex')) })).statusCode, 401);
  } finally { await app.close(); }
});

test('hosted origin and Host checks reject spoofing even with valid administrator authentication', async () => {
  const app = fixture();
  try {
    for (const invalidOrigin of ['null', 'https://attacker.example', `${origin}.attacker.example`, `${origin}/`, 'http://localhost:8081']) {
      const response = await app.inject({ url: '/lessons', headers: { ...headers(adminToken), origin: invalidOrigin } });
      assert.equal(response.statusCode, 403);
      assert.equal(response.headers['access-control-allow-origin'], undefined);
    }
    for (const invalidHost of ['localhost', `${host}.attacker.example`, `${host}@attacker.example`, `${host}:99999`, `${host}:abc`, `${host}:`, `${host}:3001`]) {
      assert.equal((await app.inject({ url: '/health', headers: {
        ...headers(adminToken), host: invalidHost, 'x-forwarded-host': host,
      } })).statusCode, 403, invalidHost);
    }
    assert.equal((await app.inject({ url: '/health', headers: { host: host.toUpperCase() } })).statusCode, 200);
  } finally { await app.close(); }
});

test('hosted editor guards matched encoded IDs and permits only administrators with JSON/feature guard', async () => {
  const app = fixture();
  const url = `/editor/lessons/${restaurantLesson.id.replace('fr.', '%66r.')}/preview`;
  const payload = { expectedRevision: restaurantLesson.revision };
  const valid = { ...headers(adminToken), 'x-smartlingo-editor': '1', 'content-type': 'application/json' };
  try {
    for (const token of [undefined, betaToken]) {
      assert.equal((await app.inject({ method: 'POST', url, headers: { ...valid, authorization: token ? `Bearer ${token}` : '' }, payload })).statusCode, 401);
    }
    assert.equal((await app.inject({ method: 'POST', url, headers: { ...valid, 'x-smartlingo-editor': '0' }, payload })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url, headers: { ...valid, 'content-type': 'text/plain' }, payload: JSON.stringify(payload) })).statusCode, 415);
    const response = await app.inject({ method: 'POST', url, headers: valid, payload });
    assert.equal(response.statusCode, 200);
    assert.equal(response.json().lesson.id, restaurantLesson.id);
  } finally { await app.close(); }
});

test('hosted CORS preflights allow explicit authorization only for known routes and permitted headers', async () => {
  const app = fixture();
  const url = '/speech/generate';
  const valid = {
    ...headers(), 'access-control-request-method': 'POST',
    'access-control-request-headers': 'authorization,content-type,x-smartlingo-speech',
  };
  try {
    const response = await app.inject({ method: 'OPTIONS', url, headers: valid });
    assert.equal(response.statusCode, 204);
    assert.equal(response.headers['access-control-allow-origin'], origin);
    assert.equal(response.headers['access-control-allow-credentials'], undefined);
    assert.match(String(response.headers['access-control-allow-headers']), /Authorization/);
    for (const changes of [
      { origin: 'https://attacker.example' }, { origin: '' },
      { 'access-control-request-method': 'DELETE' },
      { 'access-control-request-headers': 'content-type,x-smartlingo-speech' },
      { 'access-control-request-headers': 'authorization,content-type,x-smartlingo-editor' },
      { 'access-control-request-headers': 'authorization,content-type,x-smartlingo-speech,x-untrusted' },
    ]) assert.equal((await app.inject({ method: 'OPTIONS', url, headers: { ...valid, ...changes } })).statusCode, 403);
    assert.equal((await app.inject({ method: 'OPTIONS', url: '/unknown', headers: valid })).statusCode, 403);
    assert.equal((await app.inject({ method: 'OPTIONS', url: '/lessons', headers: {
      ...headers(), 'access-control-request-method': 'GET', 'access-control-request-headers': 'authorization',
    } })).statusCode, 204);
  } finally { await app.close(); }
});

test('unauthorized hosted generation is rejected before any provider call, including clients without Origin', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), {
    access: readApiAccessConfig(environment),
    speech: { provider: { async synthesize() {
      calls++;
      return new Uint8Array([73, 68, 51, 4, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    } } },
  });
  const payload = { requestId: randomUUID(), input: { text: 'Bonjour !', voice: 'fr-FR-DeniseNeural', pace: 'gentle' } };
  try {
    for (const token of [undefined, 'invalid']) {
      const response = await app.inject({ method: 'POST', url: '/speech/generate',
        headers: { host, ...(token ? { authorization: `Bearer ${token}` } : {}), 'x-smartlingo-speech': '1' }, payload });
      assert.equal(response.statusCode, 401);
    }
    assert.equal(calls, 0);
    const response = await app.inject({ method: 'POST', url: '/speech/generate',
      headers: { ...headers(betaToken), 'x-smartlingo-speech': '1' }, payload });
    assert.equal(response.statusCode, 200);
    assert.equal(calls, 1);
  } finally { await app.close(); }
});
