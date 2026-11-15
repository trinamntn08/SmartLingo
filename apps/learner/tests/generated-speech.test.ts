import { test } from 'node:test';
import assert from 'node:assert/strict';
import { speechKey, type SpeechAsset, type SpeechInput, type SpeechResponse } from '@smartlingo/domain';
import { GeneratedAudioStore, type AudioCache, type AudioCacheEnvironment } from '../src/audio/generated/store';
import { sha256, verifyAsset } from '../src/audio/generated/validation';
import { createGeneratedPreferences, generatedPreferenceKey } from '../src/audio/generated/preferences';
import { createSpeechClient, SpeechApiError, type SpeechClient } from '../src/audio/generated/client';
import { SpeechGeneration } from '../src/audio/generated/generation';
import { BrowserClipPlayer, type ClipAudio } from '../src/audio/generated/player';
import { HybridSpeechPlayer } from '../src/audio/generated/hybrid';

test('long study text falls back to device speech without a saved-clip schema error or lookup', async () => {
  const text = 'x'.repeat(501);
  let spoken = ''; const notices: string[] = [];
  const player = new HybridSpeechPlayer(
    { available: () => true, speak: async value => { spoken = value; }, stop() {} },
    { get: async () => { throw new Error('Long text must not enter the bounded clip cache'); } },
    { play: async () => { throw new Error('Unexpected clip'); }, stop() {} },
    { get: () => ({ enabled: true, voice: 'fr-FR-DeniseNeural', pace: 'gentle' }) },
    message => notices.push(message),
  );
  await player.speak(text);
  assert.equal(spoken, text);
  assert.deepEqual(notices, []);
});

const input: SpeechInput = { text: 'Bonjour !', voice: 'fr-FR-DeniseNeural', pace: 'gentle' };
const id = '0ea802a9-e021-4b97-8de8-994fa96764f9';
const otherId = '3e29b4c2-ceaa-4bd5-9e92-7146e1b640c2';
const prefix = 'https://smartlingo.invalid/generated-speech/v1/';
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }
async function assetFor(value = input): Promise<SpeechAsset> {
  const bytes = new TextEncoder().encode('ID3-fake-provider-independent-audio');
  return { key: await speechKey(value), input: value, mimeType: 'audio/mpeg', byteLength: bytes.byteLength, sha256: await sha256(bytes), audioBase64: btoa(String.fromCharCode(...bytes)) };
}
async function replyFor(value = input): Promise<SpeechResponse> { return { requestId: id, asset: await assetFor(value), cacheHit: false, usage: { usedToday: 1, dailyLimit: 10 } }; }
function memoryCache() {
  let entries = new Map<string, Response>();
  const unrelated = new Map([['learner-app', 'keep'], ['other-site', 'keep']]);
  let tail: Promise<unknown> = Promise.resolve();
  let writes = 0;
  let failWrites = false;
  let afterPut: (() => void) | undefined;
  const cache: AudioCache = {
    match: async key => entries.get(key)?.clone(),
    put: async (key, value) => { writes++; if (failWrites) throw new Error('QuotaExceededError'); entries.set(key, value.clone()); afterPut?.(); },
    keys: async () => [...entries.keys()].map(url => ({ url })),
    delete: async key => entries.delete(key),
  };
  const environment: AudioCacheEnvironment = {
    open: async () => cache,
    remove: async () => { entries = new Map(); return true; },
    supported: () => true,
    lock: operation => { const next = tail.then(operation); tail = next.catch(() => {}); return next; },
  };
  return { environment, cache, unrelated, writes: () => writes, quota: (value: boolean) => { failWrites = value; }, afterPut: (callback?: () => void) => { afterPut = callback; } };
}

test('production read-only cache lookup does not open or create absent storage and reads existing clips', async () => {
  const originalCaches = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  let exists = false; let opens = 0; let locks = 0;
  const asset = await assetFor();
  Object.defineProperty(globalThis, 'caches', { configurable: true, value: {
    has: async (name: string) => { assert.equal(name, 'smartlingo-generated-speech-v1'); assert.equal(locks, 1); return exists; },
    open: async (name: string) => { opens++; assert.equal(name, 'smartlingo-generated-speech-v1'); return { match: async (key: string) => { assert.equal(key, prefix + asset.key); return Response.json(asset); } }; },
  } });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: {
    request: async (_name: string, _options: unknown, operation: () => Promise<unknown>) => { locks++; try { return await operation(); } finally { locks--; } },
  } } });
  try {
    const store = new GeneratedAudioStore();
    assert.equal(await store.get(input), undefined); assert.equal(opens, 0);
    exists = true;
    assert.equal((await store.get(input))?.asset.key, asset.key); assert.equal(opens, 1);
  } finally {
    if (originalCaches) Object.defineProperty(globalThis, 'caches', originalCaches); else Reflect.deleteProperty(globalThis, 'caches');
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator); else Reflect.deleteProperty(globalThis, 'navigator');
  }
});

test('saved audio survives a new store instance, validates exact identity and removes only owned audio', async () => {
  const fake = memoryCache(); const store = new GeneratedAudioStore(fake.environment);
  assert.equal(await store.get(input), undefined);
  const epoch = await store.begin();
  await store.put(await assetFor(), input, undefined, epoch);
  const reloaded = new GeneratedAudioStore(fake.environment);
  assert.deepEqual((await reloaded.get(input))?.asset.input, input);
  assert.equal(await reloaded.get({ ...input, text: 'Merci' }), undefined);
  assert.equal(await reloaded.get({ ...input, pace: 'normal' }), undefined);
  assert.equal(await reloaded.get({ ...input, voice: 'fr-FR-HenriNeural' }), undefined);
  await reloaded.remove();
  assert.equal(await store.get(input), undefined);
  assert.deepEqual([...fake.unrelated.keys()], ['learner-app', 'other-site']);
  assert.equal((await fake.cache.keys()).length, 1); // Removal retains a non-audio epoch only.
});

test('cross-tab removal invalidates requests begun before removal and serializes concurrent saves', async () => {
  const fake = memoryCache(); const first = new GeneratedAudioStore(fake.environment); const second = new GeneratedAudioStore(fake.environment);
  const epoch = await first.begin();
  await second.remove();
  await assert.rejects(first.put(await assetFor(), input, undefined, epoch), /removed/);
  assert.equal(await first.get(input), undefined);
  const fresh = await first.begin(); const asset = await assetFor();
  await Promise.all([first.put(asset, input, undefined, fresh), second.put(asset, input, undefined, fresh)]);
  assert.equal((await fake.cache.keys()).filter(key => /[a-f0-9]{64}$/.test(key.url)).length, 1);
});

test('corrupt cache data is rejected before playback; explicit save repairs a damaged exact entry', async () => {
  const fake = memoryCache(); const store = new GeneratedAudioStore(fake.environment); const asset = await assetFor();
  await fake.cache.put(prefix + asset.key, new Response(JSON.stringify({ ...asset, sha256: '0'.repeat(64) })));
  await assert.rejects(store.get(input), /damaged/);
  await store.put(asset, input);
  assert.ok(await store.get(input));
  await fake.cache.put(prefix + asset.key, new Response('x'.repeat(710001)));
  await assert.rejects(store.get(input), /damaged/);
});

test('audio validation rejects changed text, key, digest, MIME, noncanonical base64 and oversized clips', async () => {
  const valid = await assetFor();
  for (const altered of [
    { ...valid, key: '0'.repeat(64) }, { ...valid, input: { ...input, text: 'Other' } },
    { ...valid, sha256: '0'.repeat(64) }, { ...valid, mimeType: 'text/html' },
    { ...valid, audioBase64: valid.audioBase64 + '\n' }, { ...valid, byteLength: 524289 },
  ]) await assert.rejects(verifyAsset(altered, input));
});

test('missing browser capabilities, quota and write verification failure never report a saved clip', async () => {
  const fake = memoryCache();
  const unavailable = new GeneratedAudioStore({ ...fake.environment, supported: () => false });
  await assert.rejects(unavailable.get(input), /Web Locks/);
  await assert.rejects(unavailable.put(await assetFor(), input), /Web Locks/);
  const store = new GeneratedAudioStore(fake.environment); fake.quota(true);
  await assert.rejects(store.put(await assetFor(), input), /could not be saved/);
  assert.equal(await store.get(input), undefined);
  fake.quota(false);
  const dropWrites = new GeneratedAudioStore({ ...fake.environment, open: async () => ({ ...fake.cache, put: async () => {} }) });
  await assert.rejects(dropWrites.put(await assetFor(), input), /could not be confirmed/);
});

test('cancellation during a new cache write removes the new clip and preserves a previously verified exact clip', async () => {
  const fake = memoryCache(); const store = new GeneratedAudioStore(fake.environment); const asset = await assetFor();
  const cancelled = new AbortController(); fake.afterPut(() => cancelled.abort());
  await assert.rejects(store.put(asset, input, cancelled.signal), /cancelled/);
  assert.equal(await store.get(input), undefined);
  fake.afterPut(); await store.put(asset, input);
  const writesBefore = fake.writes();
  const second = new AbortController(); fake.afterPut(() => second.abort());
  await store.put(asset, input, second.signal);
  assert.equal(fake.writes(), writesBefore); assert.ok(await store.get(input));
});

test('cache refuses a 513th audio clip without evicting existing clips', async () => {
  const fake = memoryCache(); const store = new GeneratedAudioStore(fake.environment);
  const assets = await Promise.all(Array.from({ length: 512 }, (_, index) => assetFor({ ...input, text: `mot ${index}` })));
  for (const asset of assets) await fake.cache.put(prefix + asset.key, new Response(JSON.stringify(asset)));
  await assert.rejects(store.put(await assetFor(), input), /512 clips/);
  assert.equal((await fake.cache.keys()).length, 512);
});

test('guarded versioned preferences persist separately, honor other-tab changes and keep visit-only settings on write failure', () => {
  let raw: string | null = null; let fail = false;
  const storage = { getItem: (key: string) => { assert.equal(key, generatedPreferenceKey); return raw; }, setItem: (_key: string, value: string) => { if (fail) throw new Error('blocked'); raw = value; } };
  const store = createGeneratedPreferences(() => storage);
  assert.equal(store.get().enabled, false);
  const selected = { enabled: true, voice: 'fr-FR-HenriNeural', pace: 'normal' } as const;
  assert.equal(store.save(selected), true); assert.deepEqual(createGeneratedPreferences(() => storage).get(), selected);
  fail = true; const visit = { ...selected, pace: 'gentle' } as const;
  assert.equal(store.save(visit), false); assert.deepEqual(store.get(), visit);
  raw = JSON.stringify({ version: 1, ...selected }); // Same persisted value retains the visit-only override.
  assert.deepEqual(store.get(), visit);
  raw = JSON.stringify({ version: 1, ...selected, enabled: false }); assert.equal(store.get().enabled, false);
  const blocked = createGeneratedPreferences(() => { throw new Error('denied'); });
  assert.equal(blocked.save(selected), false); assert.deepEqual(blocked.get(), selected);
  raw = '{bad'; assert.equal(createGeneratedPreferences(() => storage).get().enabled, false);
});

test('explicit client sends bounded local protocol and verifies request, hash and identity before returning', async () => {
  const response = await replyFor(); let calls = 0;
  const client = createSpeechClient(async (url, options) => {
    calls++; assert.equal(url, 'http://127.0.0.1:3001/speech/generate'); assert.equal(options?.method, 'POST');
    assert.equal(options?.cache, 'no-store'); assert.equal(options?.credentials, 'omit');
    assert.equal((options?.headers as Record<string, string>)['X-SmartLingo-Speech'], '1');
    assert.deepEqual(JSON.parse(String(options?.body)), { requestId: id, input });
    return Response.json(response);
  });
  assert.equal((await client.generate({ requestId: id, input })).asset.key, response.asset.key); assert.equal(calls, 1);
  const wrongId = createSpeechClient(async () => Response.json({ ...response, requestId: otherId }));
  await assert.rejects(wrongId.generate({ requestId: id, input }), /different request/);
  const oversized = createSpeechClient(async () => new Response('x'.repeat(720001)));
  await assert.rejects(oversized.generate({ requestId: id, input }), /invalid response/);
  const mismatched = createSpeechClient(async () => Response.json({ ...response, asset: { ...response.asset, sha256: '0'.repeat(64) } }));
  await assert.rejects(mismatched.generate({ requestId: id, input }), /verification failed/);
});

test('client rejects late cancelled responses and marks only confirmed terminal protocol failures', async () => {
  const pending = deferred<Response>(); const controller = new AbortController();
  const client = createSpeechClient(async () => pending.promise);
  const result = assert.rejects(client.generate({ requestId: id, input }, controller.signal), /cancelled/);
  controller.abort(); pending.resolve(Response.json(await replyFor())); await result;
  const terminal = createSpeechClient(async () => Response.json({ code: 'attempt_ended' }, { status: 502 }));
  await assert.rejects(terminal.generate({ requestId: id, input }), (failure: unknown) => failure instanceof SpeechApiError && failure.terminal);
  const unknown = createSpeechClient(async () => { throw new Error('network'); });
  await assert.rejects(unknown.generate({ requestId: id, input }), (failure: unknown) => failure instanceof SpeechApiError && !failure.terminal);
});

test('generation retries uncertain outcomes with the same UUID, starts new only after terminal failure and retains responses on save failure', async () => {
  const response = await replyFor(); const ids: string[] = []; let mode = 'unknown'; let saves = 0; let failSave = false; let uuids = 0;
  const client: SpeechClient = { status: async () => ({ available: true, usage: response.usage }), generate: async request => {
    ids.push(request.requestId);
    if (mode === 'unknown') throw new SpeechApiError('network');
    if (mode === 'terminal') throw new SpeechApiError('ended', true);
    return { ...response, requestId: request.requestId };
  } };
  const session = new SpeechGeneration(client, { begin: async () => 'epoch', put: async () => { saves++; if (failSave) throw new Error('quota'); } }, () => ++uuids === 1 ? id : otherId);
  await assert.rejects(session.save(input)); await assert.rejects(session.save(input)); assert.deepEqual(ids, [id, id]);
  mode = 'terminal'; await assert.rejects(session.save(input));
  mode = 'success'; failSave = true; await assert.rejects(session.save(input), /quota/); assert.equal(ids.at(-1), otherId);
  failSave = false; await session.save(input); assert.equal(ids.length, 4); assert.equal(saves, 2);
});

test('generation cancels late provider results before any browser write and capability failure occurs before any provider request', async () => {
  const pending = deferred<SpeechResponse>(); let calls = 0; let writes = 0;
  const client: SpeechClient = { status: async () => ({ available: true, usage: { usedToday: 0, dailyLimit: 10 } }), generate: async () => { calls++; return pending.promise; } };
  const session = new SpeechGeneration(client, { begin: async () => 'epoch', put: async () => { writes++; } }, () => id);
  const run = assert.rejects(session.save(input), /cancelled/);
  await new Promise(resolve => setImmediate(resolve)); session.cancel(); pending.resolve(await replyFor()); await run;
  assert.equal(writes, 0); assert.equal(calls, 1);
  const blocked = new SpeechGeneration(client, { begin: async () => { throw new Error('Unavailable'); }, put: async () => {} }, () => id);
  await assert.rejects(blocked.save(input), /Unavailable/); assert.equal(calls, 1);
});

test('a deliberate save after cross-tab removal reacquires the epoch and reuses the generated response without spending again', async () => {
  const fake = memoryCache(); const first = new GeneratedAudioStore(fake.environment); const otherTab = new GeneratedAudioStore(fake.environment);
  let calls = 0;
  const client: SpeechClient = { status: async () => ({ available: true, usage: { usedToday: 0, dailyLimit: 10 } }), generate: async () => {
    calls++; await otherTab.remove(); return replyFor();
  } };
  const session = new SpeechGeneration(client, first, () => id);
  await assert.rejects(session.save(input), /removed/);
  assert.equal(await first.get(input), undefined);
  await session.save(input);
  assert.equal(calls, 1); assert.ok(await first.get(input));
});

test('MP3 player cleans up completion, cancellation, rejection, missing engine and timeout', async context => {
  let current: ClipAudio | undefined; const revoked: string[] = [];
  let missing = false; let fail = false;
  const player = new BrowserClipPlayer({ create: () => {
    if (missing) return undefined;
    current = { src: '', onended: null, onerror: null, play: async () => { if (fail) throw new Error('blocked'); }, pause: () => {}, load: () => {} }; return current;
  }, url: () => 'blob:clip', revoke: url => { revoked.push(url); } });
  context.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const done = player.play(new Uint8Array([1])); current?.onended?.(); await done;
    const cancelled = player.play(new Uint8Array([1])); player.stop(); await cancelled;
    fail = true; await assert.rejects(player.play(new Uint8Array([1])), /could not play/);
    fail = false; const timed = assert.rejects(player.play(new Uint8Array([1])), /timed out/); context.mock.timers.tick(120001); await timed;
    assert.equal(revoked.length, 4); assert.equal(current?.src, '');
    missing = true; await assert.rejects(player.play(new Uint8Array([1])), /unavailable/);
  } finally { player.stop(); context.mock.timers.reset(); }
});

test('ordinary speech uses local exact clips only when enabled, falls back honestly and ignores late cancelled lookups', async () => {
  let spoken = 0; let played = 0; let lookups = 0; let enabled = false; let fail = false; const notices: string[] = [];
  const pending = deferred<{ bytes: Uint8Array } | undefined>(); let delay = false;
  const hybrid = new HybridSpeechPlayer({ available: () => true, speak: async () => { spoken++; }, stop: () => {} },
    { get: async value => { lookups++; assert.deepEqual(value, input); if (delay) return pending.promise; if (fail) throw new Error('Damaged saved audio'); return { bytes: new Uint8Array([1]) }; } },
    { play: async () => { played++; }, stop: () => {} }, { get: () => ({ enabled, voice: input.voice, pace: input.pace }) }, message => notices.push(message));
  await hybrid.speak(input.text); assert.equal(lookups, 0); assert.equal(spoken, 1);
  enabled = true; await hybrid.speak(input.text); assert.equal(played, 1); assert.equal(spoken, 1);
  fail = true; await hybrid.speak(input.text); assert.equal(spoken, 2); assert.match(notices[0], /Damaged/);
  fail = false; delay = true; const cancelled = hybrid.speak(input.text); hybrid.stop(); pending.resolve({ bytes: new Uint8Array([1]) }); await cancelled;
  assert.equal(played, 1); assert.equal(spoken, 2);
});

test('missing local clip and failed MP3 playback use device speech; absent device engine retains text fallback', async () => {
  let clips: { bytes: Uint8Array } | undefined; let fallbackCalls = 0; let missingDevice = false; const notices: string[] = [];
  const hybrid = new HybridSpeechPlayer({ available: () => !missingDevice, speak: async () => { fallbackCalls++; if (missingDevice) throw new Error('Read the French text instead.'); }, stop: () => {} },
    { get: async () => clips }, { play: async () => { throw new Error('MP3 unsupported'); }, stop: () => {} },
    { get: () => ({ enabled: true, voice: input.voice, pace: input.pace }) }, message => notices.push(message));
  await hybrid.speak(input.text); assert.equal(fallbackCalls, 1);
  clips = { bytes: new Uint8Array([1]) }; await hybrid.speak(input.text); assert.equal(fallbackCalls, 2); assert.match(notices[0], /MP3 unsupported/);
  missingDevice = true; await assert.rejects(hybrid.speak(input.text), /Read the French text/);
});
