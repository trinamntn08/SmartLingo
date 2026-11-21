import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';
import { JapaneseSpeechError, JapaneseSpeechService } from '../src/japanese-speech/service';
import { maxJapaneseAudioBytes, validPcmWave } from '../src/japanese-speech/audio';

const input = { text: 'こんにちは', rate: 0.85 };
const headers = { origin: 'http://localhost:8081', 'x-smartlingo-speech': '1', 'content-type': 'application/json' };
function wave(dataSize = 4): Buffer {
  const bytes = Buffer.alloc(44 + dataSize);
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8); bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22); bytes.writeUInt32LE(24000, 24); bytes.writeUInt32LE(48000, 28);
  bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34); bytes.write('data', 36); bytes.writeUInt32LE(dataSize, 40);
  return bytes;
}
const json = (value: unknown) => new Response(JSON.stringify(value), { headers: { 'content-type': 'application/json' } });
const wav = (bytes = wave(), extraHeaders = {}) => new Response(new Uint8Array(bytes), { headers: { 'content-type': 'audio/wav', ...extraHeaders } });
function engine(onCall?: (url: URL, init?: RequestInit) => Response | Promise<Response>): typeof fetch {
  return (async (value, init) => {
    const url = new URL(String(value));
    assert.equal(url.origin, 'http://127.0.0.1:50021'); assert.equal(init?.redirect, 'error'); assert.ok(init?.signal);
    if (onCall) return onCall(url, init);
    if (url.pathname === '/speakers') return json([{ name: '四国めたん', styles: [{ id: 2 }] }]);
    if (url.pathname === '/audio_query') return json({ accent_phrases: [], speedScale: 1 });
    return wav();
  }) as typeof fetch;
}

test('Japanese status verifies fixed voice without synthesis and tolerates unavailable/malformed engines', async () => {
  const responses = [json([{ name: '四国めたん', styles: [{ id: 2 }] }]), json([{ name: 'Other', styles: [{ id: 2 }] }]), json({}), new Response('invalid', { headers: { 'content-type': 'application/json' } }), new Response('private payload', { status: 500 })];
  for (const [index, response] of responses.entries()) {
    let calls = 0;
    const service = new JapaneseSpeechService({ fetcher: engine(url => { calls++; assert.equal(url.pathname, '/speakers'); return response; }) });
    try {
      assert.deepEqual(await service.status(), { available: index === 0, voice: 'Shikoku Metan', credit: 'VOICEVOX:四国めたん' });
      assert.equal(calls, 1);
    } finally { service.close(); }
  }
  const available = new JapaneseSpeechService({ fetcher: engine() });
  assert.equal((await available.status()).available, true); available.close();
  const stopped = new JapaneseSpeechService({ fetcher: engine(() => { throw new Error('private localhost failure'); }) });
  assert.equal((await stopped.status()).available, false); stopped.close();
  assert.equal((await stopped.status()).available, false);
});

test('Japanese synthesis uses query style 2 and requested pace, trims text, caches independent rates and copies bytes', async () => {
  const calls: string[] = [];
  const service = new JapaneseSpeechService({ fetcher: engine((url, init) => {
    calls.push(url.pathname); assert.equal(url.searchParams.get('speaker'), '2'); assert.equal(init?.method, 'POST');
    if (url.pathname === '/audio_query') { assert.equal(url.searchParams.get('text'), input.text); return json({ accent_phrases: [], speedScale: 1 }); }
    assert.ok([0.7, 0.85, 1].includes(JSON.parse(String(init?.body)).speedScale)); return wav();
  }) });
  try {
    const first = await service.play({ ...input, text: ` ${input.text} ` }); assert.deepEqual(first, new Uint8Array(wave())); first[0] = 0;
    assert.deepEqual(await service.play(input), new Uint8Array(wave())); assert.equal(calls.length, 2);
    await service.play({ ...input, rate: 0.7 }); assert.equal(calls.length, 4);
  } finally { service.close(); }
});

test('Japanese requests reject invalid input before engine access', async () => {
  let calls = 0;
  const service = new JapaneseSpeechService({ fetcher: engine(() => { calls++; return wav(); }) });
  try {
    for (const invalid of [null, {}, { ...input, extra: true }, { ...input, text: ' ' }, { ...input, text: 'a'.repeat(501) }, { ...input, text: 'a\u0000' }, { ...input, rate: '0.85' }, { ...input, rate: 0.9 }]) await assert.rejects(service.play(invalid), error => error instanceof JapaneseSpeechError && error.statusCode === 400);
    assert.equal(calls, 0);
  } finally { service.close(); }
});

test('Japanese engine responses are bounded and validated without leaking errors or retrying', async () => {
  const malformed = wave(); malformed.writeUInt32LE(7, 28);
  const cases = [() => new Response('secret', { status: 500 }), () => json({}), () => json({ accent_phrases: [], speedScale: 1 })];
  for (const synthesis of [() => wav(Buffer.alloc(48)), () => wav(malformed), () => wav(wave(), { 'content-length': String(maxJapaneseAudioBytes + 1) }), () => wav(Buffer.alloc(maxJapaneseAudioBytes + 1)), () => new Response('secret')]) {
    cases.push(synthesis);
  }
  for (const [index, response] of cases.entries()) {
    let calls = 0;
    const service = new JapaneseSpeechService({ fetcher: engine(url => { calls++; return url.pathname === '/audio_query' && index >= 3 ? json({ accent_phrases: [], speedScale: 1 }) : response(); }) });
    try {
      // Case 2 passes query shape but its JSON synthesis response still cannot become audio.
      await assert.rejects(service.play(input), error => error instanceof JapaneseSpeechError && error.statusCode === 503 && !/secret|accent_phrases/.test(error.message));
      assert.equal(calls, index >= 2 ? 2 : 1);
    } finally { service.close(); }
  }
  const oversizedJson = new JapaneseSpeechService({ fetcher: engine(() => new Response(' '.repeat(262145), { headers: { 'content-type': 'application/json' } })) });
  await assert.rejects(oversizedJson.play(input), /unavailable/); oversizedJson.close();
  assert.equal(validPcmWave(wave()), true);
});

test('Japanese timeout, caller cancellation, shutdown and single-flight release do not cache late results', async () => {
  let calls = 0, signal: AbortSignal | undefined, finish: ((response: Response) => void) | undefined;
  const service = new JapaneseSpeechService({ timeoutMs: 15, statusTimeoutMs: 10, fetcher: engine((_url, init) => {
    calls++; signal = init?.signal ?? undefined; return new Promise(resolve => { finish = resolve; });
  }) });
  assert.equal((await service.status()).available, false); assert.equal(signal?.aborted, true);
  const pending = service.play(input);
  await assert.rejects(service.play(input), error => error instanceof JapaneseSpeechError && error.statusCode === 429);
  await assert.rejects(pending, error => error instanceof JapaneseSpeechError && error.statusCode === 504); assert.equal(signal?.aborted, true);
  finish!(json({ accent_phrases: [], speedScale: 1 })); await new Promise(resolve => setImmediate(resolve));
  const controller = new AbortController(), cancelled = service.play(input, controller.signal); controller.abort();
  await assert.rejects(cancelled, /cancelled/); assert.equal(signal?.aborted, true);
  const closing = service.play(input); service.close(); await assert.rejects(closing, /cancelled/);
  assert.equal(signal?.aborted, true); assert.equal(calls, 4); await assert.rejects(service.play(input), /cancelled/);
});

test('Japanese cache evicts oldest entries at 100 and total bytes at 32 MiB; cache hits work during synthesis', async () => {
  for (const large of [false, true]) {
    let calls = 0;
    const service = new JapaneseSpeechService({ fetcher: engine(url => { calls++; return url.pathname === '/audio_query' ? json({ accent_phrases: [], speedScale: 1 }) : wav(wave(large ? 5 * 1024 * 1024 - 44 : 4)); }) });
    try {
      const count = large ? 7 : 101;
      for (let i = 0; i < count; i++) await service.play({ ...input, text: `word${i}` });
      assert.equal(calls, count * 2);
      await service.play({ ...input, text: `word${count - 1}` }); assert.equal(calls, count * 2);
      await service.play({ ...input, text: 'word0' }); assert.equal(calls, count * 2 + 2);
    } finally { service.close(); }
  }
  let hold = false, finish!: (response: Response) => void;
  const service = new JapaneseSpeechService({ fetcher: engine(url => url.pathname === '/audio_query' ? json({ accent_phrases: [], speedScale: 1 }) : hold ? new Promise(resolve => { finish = resolve; }) : wav()) });
  try {
    await service.play(input); hold = true; const pending = service.play({ ...input, text: '別の言葉' });
    await new Promise(resolve => setImmediate(resolve)); assert.deepEqual(await service.play(input), new Uint8Array(wave())); finish(wav()); await pending;
  } finally { service.close(); }
});

test('Japanese API returns binary wave and enforces speech origin, headers, strict input and preflight', async () => {
  let calls = 0;
  const fake = engine(), app = createApp(new SqliteLessonRepository(':memory:'), { japaneseSpeech: { fetcher: (async (...args) => { calls++; return fake(...args); }) as typeof fetch } });
  try {
    const status = await app.inject({ url: '/speech/japanese/status', headers: { origin: headers.origin } });
    assert.equal(status.statusCode, 200); assert.equal(status.json().available, true); assert.equal(status.headers['cache-control'], 'no-store');
    const post = (payload: unknown, requestHeaders = headers) => app.inject({ method: 'POST', url: '/speech/japanese/play', headers: requestHeaders, payload: JSON.stringify(payload) });
    for (const badHeaders of [{ ...headers, origin: 'https://evil.example' }, { ...headers, 'x-smartlingo-speech': '0' }, { 'content-type': 'application/json' }, { ...headers, host: 'evil.example' }]) assert.equal((await post(input, badHeaders as typeof headers)).statusCode, 403);
    assert.equal((await post({ ...input, extra: true })).statusCode, 400); assert.equal(calls, 1);
    const result = await post(input); assert.equal(result.statusCode, 200); assert.equal(result.headers['content-type'], 'audio/wav'); assert.deepEqual(result.rawPayload, wave());
    for (const path of ['/speech/japanese/play', '/speech/japanese/status']) {
      const read = path.endsWith('status');
      const preflight = await app.inject({ method: 'OPTIONS', url: path, headers: { origin: headers.origin, 'access-control-request-method': read ? 'GET' : 'POST', ...(read ? {} : { 'access-control-request-headers': 'content-type,x-smartlingo-speech' }) } });
      assert.equal(preflight.statusCode, 204);
      assert.equal((await app.inject({ method: 'OPTIONS', url: path, headers: { origin: headers.origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type,x-smartlingo-editor' } })).statusCode, 403);
    }
  } finally { await app.close(); }
});

test('Japanese API reports engine failures as sanitized JSON and shutdown aborts active work', async () => {
  let hang = false, signal: AbortSignal | undefined, started!: () => void;
  const ready = new Promise<void>(resolve => { started = resolve; });
  const app = createApp(new SqliteLessonRepository(':memory:'), { japaneseSpeech: { fetcher: engine((_url, init) => {
    if (!hang) throw new Error('private text and engine details');
    signal = init?.signal ?? undefined; started(); return new Promise(() => {});
  }) } });
  try {
    const failed = await app.inject({ method: 'POST', url: '/speech/japanese/play', headers, payload: input });
    assert.equal(failed.statusCode, 503); assert.match(failed.headers['content-type']!, /application\/json/);
    assert.match(failed.json().error, /Start the local VOICEVOX engine/); assert.doesNotMatch(failed.body, /private text/);
    hang = true;
    const pending = app.inject({ method: 'POST', url: '/speech/japanese/play', headers, payload: input });
    await ready;
    const closing = app.close();
    assert.equal((await pending).statusCode, 503); await closing; assert.equal(signal?.aborted, true);
  } finally { await app.close(); }
});
