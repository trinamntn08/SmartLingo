import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { speechKey, speechResponseSchema, type SpeechInput } from '@smartlingo/domain';
import { SpeechError, SpeechService, type SpeechProvider } from '../src/speech/service';
import { createAzureSpeechProvider, readSpeechOptions, speechSsml } from '../src/speech/provider';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';

const input: SpeechInput = { text: 'Bonjour !', voice: 'fr-FR-DeniseNeural', pace: 'gentle' };
const audio = new Uint8Array([73, 68, 51, 4, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const headers = { origin: 'http://localhost:8081', 'x-smartlingo-speech': '1', 'content-type': 'application/json' };
const request = (text = input.text) => ({ requestId: randomUUID(), input: { ...input, text } });
const fake: SpeechProvider = { async synthesize() { return audio; } };
function temporaryDatabase(t: { after(fn: () => void): void }): string {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-speech-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return join(directory, 'speech.sqlite');
}

test('speech is unavailable by default and status never invokes a provider', async () => {
  let calls = 0;
  const disabled = new SpeechService(), enabled = new SpeechService({ provider: { async synthesize() { calls++; return audio; } } });
  try {
    assert.deepEqual(disabled.status(), { available: false, usage: { usedToday: 0, dailyLimit: 40 } });
    await assert.rejects(disabled.generate(request()), /unavailable/);
    assert.equal(enabled.status().available, true);
    assert.equal(enabled.status().usage.usedToday, 0);
    assert.equal(calls, 0);
  } finally { disabled.close(); enabled.close(); }
  for (const value of ['0', '201', '1.5', '-1', 'abc']) assert.throws(() => readSpeechOptions({ SMARTLINGO_SPEECH_DAILY_LIMIT: value }));
  for (const dailyLimit of [0, 201, 1.5]) assert.throws(() => new SpeechService({ dailyLimit }));
  for (const timeoutMs of [0, 30_001, NaN]) assert.throws(() => new SpeechService({ timeoutMs }));
  assert.equal(readSpeechOptions({ AZURE_SPEECH_KEY: 'secret' }).provider, undefined);
  assert.equal(readSpeechOptions({ AZURE_SPEECH_REGION: 'francecentral' }).provider, undefined);
});

test('generation validates identity, replays immutable IDs, and caches before daily/config checks across restarts', async t => {
  const databasePath = temporaryDatabase(t), firstRequest = request();
  let calls = 0;
  const provider: SpeechProvider = { async synthesize() { calls++; return audio; } };
  const service = new SpeechService({ databasePath, provider, dailyLimit: 1 });
  const first = await service.generate(firstRequest);
  assert.ok(speechResponseSchema.safeParse(first).success);
  assert.equal(first.asset.key, await speechKey(input));
  assert.equal(first.cacheHit, false);
  assert.equal(first.usage.usedToday, 1);
  assert.deepEqual(await service.generate(firstRequest), first);
  await assert.rejects(service.generate({ ...firstRequest, input: { ...input, text: 'Salut' } }), /already used/);
  assert.equal((await service.generate(request())).cacheHit, true);
  await assert.rejects(service.generate(request('Autre phrase')), /Daily/);
  service.close();
  const restarted = new SpeechService({ databasePath, dailyLimit: 1 });
  try {
    assert.equal(restarted.status().available, false);
    assert.equal(restarted.status().usage.usedToday, 1);
    assert.deepEqual(await restarted.generate(firstRequest), first);
    assert.equal((await restarted.generate(request())).cacheHit, true);
    await assert.rejects(restarted.generate(request('Autre phrase')), /unavailable/);
  } finally { restarted.close(); }
  assert.equal(calls, 1);
});

test('UTC daily attempts persist, include failure and reset only at the next UTC day', async t => {
  let clock = Date.UTC(2026, 10, 15, 23, 59, 59), calls = 0;
  const databasePath = temporaryDatabase(t);
  const provider: SpeechProvider = { async synthesize() { calls++; throw new Error('private provider payload'); } };
  const service = new SpeechService({ databasePath, provider, now: () => clock, dailyLimit: 1 });
  const failed = request();
  await assert.rejects(service.generate(failed), /generation failed/);
  await assert.rejects(service.generate(failed), error => error instanceof SpeechError && error.terminal);
  await assert.rejects(service.generate(request()), /Daily/);
  service.close();
  const restarted = new SpeechService({ databasePath, provider, now: () => clock, dailyLimit: 1 });
  try {
    assert.equal(restarted.status().usage.usedToday, 1);
    clock += 1000;
    assert.equal(restarted.status().usage.usedToday, 0);
    await assert.rejects(restarted.generate(failed), /generation failed/);
    assert.equal(calls, 1);
    await assert.rejects(restarted.generate(request()), /generation failed/);
    assert.equal(calls, 2);
    assert.equal(restarted.status().usage.usedToday, 1);
  } finally { restarted.close(); }
});

test('SQLite single-flight guards independent connections and starting another service preserves live calls', async t => {
  const databasePath = temporaryDatabase(t);
  let finish!: (value: Uint8Array) => void, calls = 0;
  const provider: SpeechProvider = { synthesize() { calls++; return new Promise(resolve => { finish = resolve; }); } };
  const first = new SpeechService({ databasePath, provider });
  const pendingRequest = request(), pending = first.generate(pendingRequest);
  const second = new SpeechService({ databasePath, provider });
  try {
    await assert.rejects(first.generate(pendingRequest), /already in progress/);
    await assert.rejects(second.generate(pendingRequest), /already in progress/);
    await assert.rejects(second.generate(request('Deuxième')), /Another speech/);
    await assert.rejects(second.generate({ ...pendingRequest, input: { ...input, text: 'Différent' } }), /already used/);
    assert.equal(second.status().usage.usedToday, 1);
    finish(audio);
    await pending;
    assert.equal((await second.generate(request())).cacheHit, true);
    assert.equal(calls, 1);
  } finally { first.close(); second.close(); }
});

test('unknown interrupted attempts become durable terminal tombstones without restarting paid work', async t => {
  const databasePath = temporaryDatabase(t);
  let clock = 0, calls = 0;
  const provider: SpeechProvider = { synthesize() { calls++; return new Promise(() => {}); } };
  const first = new SpeechService({ databasePath, provider, now: () => clock, timeoutMs: 1000 });
  const unknown = request(), pending = first.generate(unknown);
  const rejection = assert.rejects(pending, /cancelled/);
  clock = 6000;
  const second = new SpeechService({ databasePath, provider: fake, now: () => clock });
  try {
    await assert.rejects(second.generate(unknown), error => error instanceof SpeechError && error.terminal && /without a confirmed result/.test(error.message));
    assert.equal(second.status().usage.usedToday, 1);
    await second.generate(request());
    await assert.rejects(second.generate(unknown), /without a confirmed result/);
    assert.equal(calls, 1);
  } finally { first.close(); await rejection; second.close(); }
});

test('disconnect, timeout and shutdown abort the provider, release flight and do not retry failed IDs', async () => {
  let calls = 0, providerSignal: AbortSignal | undefined;
  const provider: SpeechProvider = { synthesize({ signal }) { calls++; providerSignal = signal; return new Promise(() => {}); } };
  const service = new SpeechService({ provider, timeoutMs: 15 });
  const timed = request();
  await assert.rejects(service.generate(timed), /timed out/);
  assert.equal(providerSignal?.aborted, true);
  await assert.rejects(service.generate(timed), error => error instanceof SpeechError && error.statusCode === 504 && error.terminal);
  const controller = new AbortController(), disconnected = request('Déconnexion');
  const pending = service.generate(disconnected, controller.signal);
  controller.abort();
  await assert.rejects(pending, /cancelled/);
  await assert.rejects(service.generate(disconnected), /cancelled/);
  assert.equal(providerSignal?.aborted, true);
  const stopped = request('Arrêt'), closing = service.generate(stopped);
  service.close();
  await assert.rejects(closing, /cancelled/);
  assert.equal(providerSignal?.aborted, true);
  assert.equal(service.status().available, false);
  assert.equal(calls, 3);
  service.close();
});

test('late provider resolution after cancellation cannot write audio or spend on replay', async t => {
  const databasePath = temporaryDatabase(t);
  let finish!: (value: Uint8Array) => void;
  const service = new SpeechService({ databasePath, provider: { synthesize() { return new Promise(resolve => { finish = resolve; }); } } });
  const cancelled = request(), controller = new AbortController(), pending = service.generate(cancelled, controller.signal);
  controller.abort();
  await assert.rejects(pending, /cancelled/);
  service.close();
  finish(audio);
  await new Promise(resolve => setImmediate(resolve));
  const restarted = new SpeechService({ databasePath, provider: fake });
  try {
    await assert.rejects(restarted.generate(cancelled), /cancelled/);
    assert.equal((await restarted.generate(request())).cacheHit, false);
  } finally { restarted.close(); }
});

test('corrupt persisted hash/bytes/input never silently generates replacement audio', async t => {
  for (const mutation of ["UPDATE speech_assets SET sha256='bad'", "UPDATE speech_assets SET audio=zeroblob(22)", "UPDATE speech_assets SET input='{}'", 'UPDATE speech_assets SET audio=zeroblob(524289)']) {
    const databasePath = temporaryDatabase(t);
    let calls = 0;
    const provider: SpeechProvider = { async synthesize() { calls++; return audio; } };
    const first = new SpeechService({ databasePath, provider });
    const original = request();
    await first.generate(original);
    first.close();
    const db = new DatabaseSync(databasePath);
    db.exec(mutation); db.close();
    const second = new SpeechService({ databasePath, provider });
    try {
      await assert.rejects(second.generate(request()), /failed validation/);
      await assert.rejects(second.generate(original), /failed validation/);
      assert.equal(calls, 1);
      assert.equal(second.status().usage.usedToday, 1);
    } finally { second.close(); }
  }
});

test('invalid provider bytes fail terminally without saving a false success', async () => {
  for (const bytes of [new Uint8Array(0), new Uint8Array(22), new Uint8Array(524289)]) {
    let calls = 0;
    const service = new SpeechService({ provider: { async synthesize() { calls++; return bytes; } } });
    const invalid = request();
    try {
      await assert.rejects(service.generate(invalid), /generation failed/);
      await assert.rejects(service.generate(invalid), /generation failed/);
      assert.equal(calls, 1);
    } finally { service.close(); }
  }
});

test('speech database refuses foreign and future SQLite without writing to their schema', t => {
  for (const schema of ['CREATE TABLE owner_data(value TEXT);', 'CREATE TABLE lesson_revisions(id TEXT); PRAGMA user_version=1;', 'PRAGMA user_version=2;', 'PRAGMA application_id=123;']) {
    const path = temporaryDatabase(t), db = new DatabaseSync(path);
    db.exec(schema);
    const before = db.prepare('SELECT * FROM sqlite_schema').all();
    const version = db.prepare('PRAGMA user_version').get();
    const applicationId = db.prepare('PRAGMA application_id').get();
    db.close();
    assert.throws(() => new SpeechService({ databasePath: path }), /database schema version|not a SmartLingo speech cache/);
    const after = new DatabaseSync(path);
    assert.deepEqual(after.prepare('SELECT * FROM sqlite_schema').all(), before);
    assert.deepEqual(after.prepare('PRAGMA user_version').get(), version);
    assert.deepEqual(after.prepare('PRAGMA application_id').get(), applicationId);
    after.close();
  }
});

test('asset and ledger capacity reject before provider spending', async t => {
  for (const kind of ['count', 'bytes', 'requests']) {
    const databasePath = temporaryDatabase(t);
    const initial = new SpeechService({ databasePath }); initial.close();
    const db = new DatabaseSync(databasePath);
    db.exec('BEGIN');
    if (kind === 'requests') {
      const statement = db.prepare(`INSERT INTO speech_requests VALUES(?,?,'failed',?,0,0,502,'Failed')`);
      for (let i = 0; i < 10_000; i++) statement.run(randomUUID(), String(i), Date.now());
    } else {
      const statement = db.prepare('INSERT INTO speech_assets VALUES(?,?,zeroblob(?),?,?)');
      const length = kind === 'bytes' ? 524288 : 10;
      for (let i = 0; i < (kind === 'bytes' ? 128 : 512); i++) statement.run(String(i), '{}', length, length, 'unused');
    }
    db.exec('COMMIT'); db.close();
    let calls = 0;
    const service = new SpeechService({ databasePath, provider: { async synthesize() { calls++; return audio; } } });
    try {
      await assert.rejects(service.generate(request()), /storage is full/);
      assert.equal(service.status().usage.usedToday, 0);
      assert.equal(calls, 0);
    } finally { service.close(); }
  }
});

test('30-day request retention is bounded while completed cache remains reusable', async t => {
  let clock = Date.UTC(2026, 10, 15);
  const databasePath = temporaryDatabase(t), service = new SpeechService({ databasePath, now: () => clock, provider: fake });
  const original = request();
  await service.generate(original);
  clock += 31 * 24 * 60 * 60_000;
  assert.equal((await service.generate(request())).cacheHit, true);
  service.close();
  const db = new DatabaseSync(databasePath);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM speech_requests').get()?.count, 1);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM speech_usage').get()?.count, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM speech_assets').get()?.count, 1);
  db.close();
});

test('Azure adapter uses a fixed HTTPS host, secret header, escaped neutral SSML and one MP3 request', async () => {
  let calls = 0;
  const special: SpeechInput = { ...input, text: `J'aime <Paris> & "Lyon".` };
  const provider = createAzureSpeechProvider('test-secret', 'francecentral', async (url, options) => {
    calls++;
    assert.equal(url, 'https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1');
    assert.equal(options?.redirect, 'error');
    const h = new Headers(options?.headers);
    assert.equal(h.get('Ocp-Apim-Subscription-Key'), 'test-secret');
    assert.equal(h.get('Content-Type'), 'application/ssml+xml');
    assert.equal(h.get('X-Microsoft-OutputFormat'), 'audio-24khz-48kbitrate-mono-mp3');
    assert.match(String(options?.body), /J&apos;aime &lt;Paris&gt; &amp; &quot;Lyon&quot;\./);
    assert.match(String(options?.body), /rate="-10%"/);
    assert.doesNotMatch(String(options?.body), /express-as|test-secret/);
    return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg' } });
  });
  assert.deepEqual(await provider.synthesize({ input: special, signal: new AbortController().signal }), audio);
  assert.equal(calls, 1);
  assert.match(speechSsml({ ...input, pace: 'normal', voice: 'fr-FR-HenriNeural' }), /HenriNeural"><prosody rate="0%"/);
  for (const region of ['https://attacker.test', 'francecentral.attacker.test', 'francecentral/path', 'FRANCECENTRAL', 'notaregion']) assert.throws(() => createAzureSpeechProvider('test-secret', region));
});

test('provider response errors, redirects, wrong formats and oversized streams do not retry', async () => {
  const responses = [
    () => new Response('private provider details', { status: 401 }),
    () => new Response('', { status: 302, headers: { location: 'https://attacker.test' } }),
    () => new Response(audio, { headers: { 'Content-Type': 'text/html' } }),
    () => new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': '524289' } }),
    () => new Response(new Uint8Array(524289), { headers: { 'Content-Type': 'audio/mpeg' } }),
  ];
  for (const response of responses) {
    let calls = 0;
    const provider = createAzureSpeechProvider('secret', 'francecentral', async () => { calls++; return response(); });
    await assert.rejects(provider.synthesize({ input, signal: new AbortController().signal }), /audio|limit/);
    assert.equal(calls, 1);
  }
});

test('speech route requires explicit valid input and reports sanitized failures', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: { async synthesize() { calls++; throw new Error('test-secret Bonjour'); } } } });
  try {
    assert.equal((await app.inject('/speech/status')).json().available, true);
    assert.equal(calls, 0);
    for (const payload of [{ ...request(), extra: true }, { ...request(), input: { ...input, text: '' } }, { ...request(), input: { ...input, text: 'x'.repeat(501) } }, { ...request(), requestId: 'unsafe' }, { ...request(), input: { ...input, text: '\u0000' } }]) {
      assert.equal((await app.inject({ method: 'POST', url: '/speech/generate', headers, payload })).statusCode, 400);
    }
    assert.equal(calls, 0);
    const response = await app.inject({ method: 'POST', url: '/speech/generate', headers, payload: request() });
    assert.equal(response.statusCode, 502);
    assert.equal(response.json().code, 'attempt_ended');
    assert.doesNotMatch(response.body, /test-secret|Bonjour/);
    assert.equal(response.headers['cache-control'], 'no-store');
  } finally { await app.close(); }
});

test('closing Fastify aborts active speech before waiting for its response', async () => {
  let started!: () => void, providerSignal: AbortSignal | undefined;
  const ready = new Promise<void>(resolve => { started = resolve; });
  const app = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: { synthesize({ signal }) { providerSignal = signal; started(); return new Promise(() => {}); } } } });
  const pending = Promise.resolve(app.inject({ method: 'POST', url: '/speech/generate', headers, payload: request() }));
  await ready;
  await app.close();
  const response = await pending;
  assert.equal(providerSignal?.aborted, true);
  assert.equal(response.statusCode, 409);
  assert.equal(response.json().code, 'attempt_ended');
});

test('an actual HTTP client disconnect cancels its provider and preserves terminal replay', async () => {
  let started!: () => void, aborted!: () => void, calls = 0;
  const ready = new Promise<void>(resolve => { started = resolve; });
  const cancelled = new Promise<void>(resolve => { aborted = resolve; });
  const app = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: { synthesize({ signal }) {
    calls++; signal.addEventListener('abort', aborted, { once: true }); started(); return new Promise(() => {});
  } } } });
  const address = await app.listen({ host: '127.0.0.1', port: 0 });
  const original = request();
  const client = httpRequest(`${address}/speech/generate`, { method: 'POST', headers });
  // ECONNRESET is the intentional client-side result of destroying this request.
  client.on('error', () => {});
  try {
    client.end(JSON.stringify(original));
    await ready;
    client.destroy();
    await cancelled;
    const replay = await app.inject({ method: 'POST', url: '/speech/generate', headers, payload: original });
    assert.equal(replay.statusCode, 409);
    assert.equal(replay.json().code, 'attempt_ended');
    assert.equal(calls, 1);
    assert.equal((await app.inject('/speech/status')).json().usage.usedToday, 1);
  } finally { client.destroy(); await app.close(); }
});

test('ordinary app instances use isolated in-memory speech caches and attempt ledgers', async () => {
  const first = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: fake } });
  const second = createApp(new SqliteLessonRepository(':memory:'), { speech: { provider: fake } });
  try {
    const original = request();
    const generated = await first.inject({ method: 'POST', url: '/speech/generate', headers, payload: original });
    assert.equal(generated.statusCode, 200);
    const independent = await second.inject({ method: 'POST', url: '/speech/generate', headers, payload: original });
    assert.equal(independent.statusCode, 200);
    assert.equal(independent.json().cacheHit, false);
    assert.equal((await first.inject('/speech/status')).json().usage.usedToday, 1);
    assert.equal((await second.inject('/speech/status')).json().usage.usedToday, 1);
  } finally { await first.close(); await second.close(); }
});
