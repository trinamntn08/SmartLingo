import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';
import { PracticeError, PracticeService, type PracticeOptions } from '../src/practice/service';
import { createOpenAIPracticeTranscriber, readPracticeOptions } from '../src/practice/provider';

const context = { topic: 'Bakery', role: 'Customer', level: 'A1' as const };
const provider = { async respond() { return { reply: { french: 'Bonjour', english: 'Hello', feedback: '', phrase: null }, inputTokens: 10, outputTokens: 5 }; } };
const headers = { origin: 'http://localhost:8081', 'x-smartlingo-practice': '1', 'content-type': 'application/json' };
const audioRequest = (sessionId: string) => ({ sessionId, requestId: randomUUID(), mimeType: 'audio/webm' as const, audioBase64: Buffer.from('clip').toString('base64') });
function service(options: PracticeOptions = {}) { return new PracticeService({ provider, transcriber: { async transcribe() { return { text: ' Bonjour ' }; } }, ...options }); }

test('transcription replays validated text, clears raw buffer and keeps history/turns/token totals separate', async () => {
  let calls = 0;
  let bytes: Uint8Array | undefined;
  const api = service({ transcriber: { async transcribe(input) { calls++; bytes = input.audio; assert.equal(Buffer.from(input.audio).toString(), 'clip'); return { text: ' Bonjour ' }; } },
    provider: { async respond(input) { assert.equal(input.history.length, 0); return provider.respond(); } } });
  try {
    assert.equal(api.status().transcriptionAvailable, true);
    const audio = audioRequest(api.create(context).sessionId);
    const first = await api.transcribe(audio);
    assert.equal(first.text, 'Bonjour');
    assert.equal(first.usage.usedToday, 1);
    assert.equal(first.usage.inputTokens, 0);
    assert.ok(bytes?.every(value => value === 0));
    assert.deepEqual(await api.transcribe(audio), first);
    assert.equal(calls, 1);
    await assert.rejects(api.transcribe({ ...audio, mimeType: 'audio/ogg' }), /different text/);
    await assert.rejects(api.transcribe({ ...audio, audioBase64: Buffer.from('changed').toString('base64') }), /different text/);
    await assert.rejects(api.turn({ sessionId: audio.sessionId, requestId: audio.requestId, text: 'Bonjour', englishHelp: false }), /already used/);
    const turn = await api.turn({ sessionId: audio.sessionId, requestId: randomUUID(), text: first.text, englishHelp: false });
    assert.equal(turn.usedTurns, 1);
    assert.equal(turn.usage.usedToday, 2);
    assert.equal(turn.usage.inputTokens, 10);
  } finally { api.close(); }
});

test('transcription requires optional configuration, exact Origin/header/JSON and approved preflight', async () => {
  const app = createApp(new SqliteLessonRepository(':memory:'), { practice: { provider } });
  try {
    assert.equal((await app.inject('/ai/practice/status')).json().transcriptionAvailable, false);
    const sessionId = (await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context } })).json().sessionId;
    const payload = audioRequest(sessionId);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers, payload })).statusCode, 503);
    for (const h of [{ ...headers, origin: 'http://evil.test' }, { ...headers, origin: '' }, { ...headers, 'x-smartlingo-practice': '' }]) {
      const denied = await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers: h, payload });
      assert.equal(denied.statusCode, 403);
      assert.equal(denied.headers['cache-control'], 'no-store');
    }
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers: { ...headers, 'content-type': 'text/plain' }, payload: 'audio' })).statusCode, 415);
    for (const header of ['content-type,x-smartlingo-practice', 'content-type,x-smartlingo-editor']) {
      assert.equal((await app.inject({ method: 'OPTIONS', url: '/ai/practice/transcribe', headers: { origin: headers.origin, 'access-control-request-method': 'POST', 'access-control-request-headers': header } })).statusCode, header.endsWith('practice') ? 204 : 403);
    }
  } finally { await app.close(); }
  assert.equal(readPracticeOptions({ OPENAI_TRANSCRIPTION_MODEL: 'configured' }).transcriber, undefined);
  assert.equal(readPracticeOptions({ OPENAI_API_KEY: 'private' }).transcriber, undefined);
  assert.ok(readPracticeOptions({ OPENAI_API_KEY: 'private', OPENAI_TRANSCRIPTION_MODEL: 'configured' }).transcriber);
});

test('transcription validates canonical encoding/MIME and accepts only bounded decoded bytes before spending', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), { practice: { provider, transcriber: { async transcribe() { calls++; return { text: 'Bonjour' }; } } } });
  try {
    const sessionId = (await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context } })).json().sessionId;
    const audio = audioRequest(sessionId);
    for (const audioBase64 of ['', '!!!!', 'YQ', 'YR==', 'YQ==\n', Buffer.alloc(2_097_153).toString('base64')]) {
      assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers, payload: { ...audio, audioBase64 } })).statusCode, 400);
    }
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers, payload: { ...audio, mimeType: 'audio/mpeg' } })).statusCode, 400);
    assert.equal(calls, 0);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers, payload: { ...audio, audioBase64: Buffer.alloc(2_097_152).toString('base64') } })).statusCode, 200);
    assert.equal(calls, 1);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/transcribe', headers, payload: { ...audio, audioBase64: 'a'.repeat(2_900_000) } })).statusCode, 413);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/turns', headers, payload: { text: 'a'.repeat(140_000) } })).statusCode, 413);
  } finally { await app.close(); }
});

test('transcription shares daily/session attempt limits and global flight with conversation', async () => {
  const api = service({ dailyLimit: 1 });
  try {
    const audio = audioRequest(api.create(context).sessionId);
    await api.transcribe(audio);
    await assert.rejects(api.turn({ sessionId: audio.sessionId, requestId: randomUUID(), text: 'Bonjour', englishHelp: false }), /Daily/);
    await assert.rejects(api.transcribe({ ...audio, requestId: randomUUID() }), /Daily/);
    assert.equal((await api.transcribe(audio)).usage.usedToday, 1);
  } finally { api.close(); }
  const bounded = service({ dailyLimit: 200 });
  try {
    const sessionId = bounded.create(context).sessionId;
    for (let i = 0; i < 16; i++) await bounded.transcribe(audioRequest(sessionId));
    await assert.rejects(bounded.transcribe(audioRequest(sessionId)), /Session limit/);
  } finally { bounded.close(); }
});

test('invalid/error transcription attempts are terminal and cannot spend again', async () => {
  for (const text of ['', 'a'.repeat(1001), null]) {
    let calls = 0;
    const api = service({ transcriber: { async transcribe() { calls++; return { text }; } } });
    try {
      const audio = audioRequest(api.create(context).sessionId);
      const terminal = (error: unknown) => error instanceof PracticeError && error.terminal && error.statusCode === 502;
      await assert.rejects(api.transcribe(audio), terminal);
      await assert.rejects(api.transcribe(audio), terminal);
      assert.equal(calls, 1);
    } finally { api.close(); }
  }
  const failed = service({ transcriber: { async transcribe() { throw new Error('private-key raw audio'); } } });
  try { await assert.rejects(failed.transcribe(audioRequest(failed.create(context).sessionId)), error => error instanceof Error && !error.message.includes('private')); }
  finally { failed.close(); }
});

test('transcription timeout/stop aborts, erases decoded bytes and keeps replay terminal', async () => {
  let signal: AbortSignal | undefined;
  let bytes: Uint8Array | undefined;
  const api = service({ timeoutMs: 10, transcriber: { transcribe(input) { signal = input.signal; bytes = input.audio; return new Promise(() => {}); } } });
  try {
    const audio = audioRequest(api.create(context).sessionId);
    const pending = api.transcribe(audio);
    await assert.rejects(api.turn({ sessionId: audio.sessionId, requestId: randomUUID(), text: 'Bonjour', englishHelp: false }), /in progress/);
    await assert.rejects(pending, /timed out/);
    assert.equal(signal?.aborted, true);
    assert.ok(bytes?.every(value => value === 0));
    await assert.rejects(api.transcribe(audio), error => error instanceof PracticeError && error.terminal);
    const stopped = api.transcribe({ ...audio, requestId: randomUUID() });
    api.stop(audio.sessionId);
    await assert.rejects(stopped, /cancelled/);
    assert.equal(signal?.aborted, true);
    await assert.rejects(api.transcribe(audio), /expired or stopped/);
  } finally { api.close(); }
});

test('transcription adapter uses multipart file/model and server-only key, without unsupported store option', async () => {
  for (const [mimeType, extension] of [['audio/webm', 'webm'], ['audio/mp4', 'mp4'], ['audio/ogg', 'ogg'], ['audio/wav', 'wav']] as const) {
    const adapter = createOpenAIPracticeTranscriber('server-secret', 'configured-transcription', async (url, init) => {
      assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions');
      assert.deepEqual(init?.headers, { Authorization: 'Bearer server-secret' });
      assert.ok(init?.body instanceof FormData);
      const form = init.body;
      assert.equal(form.get('model'), 'configured-transcription');
      assert.equal(form.get('store'), null);
      const file = form.get('file') as File;
      assert.equal(file.name, `recording.${extension}`);
      assert.equal(file.type, mimeType);
      assert.equal(await file.text(), 'clip');
      return new Response(JSON.stringify({ text: 'Bonjour' }));
    });
    assert.deepEqual(await adapter.transcribe({ audio: new Uint8Array(Buffer.from('clip')), mimeType, signal: new AbortController().signal }), { text: 'Bonjour' });
  }
  const rejected = createOpenAIPracticeTranscriber('key', 'model', async () => new Response('upstream private detail', { status: 400 }));
  await assert.rejects(rejected.transcribe({ audio: new Uint8Array([1]), mimeType: 'audio/wav', signal: new AbortController().signal }), /Transcription request failed/);
});
