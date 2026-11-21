import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJapaneseSpeechClient, japaneseCredit, japaneseVoice, maxJapaneseBytes, readBoundedAudio, validateJapaneseWav } from '../src/audio/japanese/client';
import { JapaneseSpeechPlayer, type JapaneseClipStore } from '../src/audio/japanese/player';
import { JapaneseAudioStore, japaneseClipKey, type JapaneseCacheEnvironment } from '../src/audio/japanese/store';
import { createJapaneseSourceStore, type JapaneseSource } from '../src/audio/japanese/preferences';
import { DeviceSpeechPlayer, type AudioPlayer, type SpeechEnvironment } from '../src/audio';
import { selectTargetVoice } from '../src/audio/voices';
import { HybridSpeechPlayer } from '../src/audio/generated/hybrid';
import { BrowserClipPlayer, type ClipAudio } from '../src/audio/generated/player';
import type { AudioCache } from '../src/audio/generated/store';

function wav(): Uint8Array {
  const bytes = new Uint8Array(48);
  const view = new DataView(bytes.buffer);
  const label = (value: string, offset: number) => bytes.set(new TextEncoder().encode(value), offset);
  label('RIFF', 0); view.setUint32(4, 40, true); label('WAVEfmt ', 8);
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true); view.setUint32(28, 48000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  label('data', 36); view.setUint32(40, 4, true);
  return bytes;
}
function memoryCache() {
  const values = new Map<string, Response>();
  const cache: AudioCache = {
    match: async key => values.get(key)?.clone(),
    put: async (key, response) => { values.set(key, response.clone()); },
    keys: async () => [...values.keys()].map(url => ({ url })),
    delete: async key => values.delete(key),
  };
  let queue = Promise.resolve();
  const environment: JapaneseCacheEnvironment = {
    supported: () => true, open: async () => cache,
    lock: operation => {
      const result = queue.then(operation);
      queue = result.then(() => {}, () => {});
      return result;
    },
  };
  return { values, cache, environment };
}
const tick = () => new Promise<void>(resolve => setImmediate(resolve));

function voice(lang: string): SpeechSynthesisVoice {
  return { lang, name: lang, voiceURI: lang, default: false, localService: true };
}

test('Japanese playback selects Japanese and never falls back to a French or English voice', async () => {
  const french = voice('fr-FR'); const japanese = voice('ja-JP'); const english = voice('en-US');
  assert.equal(selectTargetVoice([french, japanese], 'ja-JP'), japanese);
  assert.equal(selectTargetVoice([french, english], 'ja-JP'), undefined);
  let voices = [french, japanese];
  let spoken: SpeechSynthesisUtterance | undefined;
  const environment: SpeechEnvironment = {
    synthesis: () => ({ getVoices: () => voices, cancel() {}, speak: utterance => { spoken = utterance; } }),
    utterance: text => ({ text, onend: null, onerror: null }) as SpeechSynthesisUtterance,
  };
  const player = new DeviceSpeechPlayer(environment);
  const pending = player.speak('こんにちは', 'ja-JP');
  assert.equal(spoken?.voice, japanese);
  assert.equal(spoken?.lang, 'ja-JP');
  player.stop(); await pending;
  voices = [french, english];
  assert.equal(player.available('ja-JP'), false);
  await assert.rejects(player.speak('こんにちは', 'ja-JP'), /No Japanese device voice/);
});

test('Japanese playback bypasses French saved audio even when neural preferences are enabled', async () => {
  let language = ''; let lookups = 0;
  const player = new HybridSpeechPlayer(
    { available: target => target === 'fr-FR', speak: async (_text, target) => { language = target ?? ''; }, stop() {} },
    { get: async () => { lookups++; throw new Error('Japanese must not query French cache'); } },
    { play: async () => { throw new Error('Unexpected French clip'); }, stop() {} },
    { get: () => ({ enabled: true, voice: 'fr-FR-DeniseNeural', pace: 'gentle' }) },
  );
  assert.equal(player.available('ja-JP'), false);
  await player.speak('こんにちは', 'ja-JP');
  assert.equal(language, 'ja-JP'); assert.equal(lookups, 0);
});

test('Japanese local client sends only explicit bounded requests and validates WAV/status', async () => {
  const requests: { url: string; init?: RequestInit }[] = [];
  const client = createJapaneseSpeechClient(async (url, init) => {
    requests.push({ url: String(url), init });
    return String(url).endsWith('status') ? Response.json({ available: true, voice: japaneseVoice, credit: japaneseCredit })
      : new Response(wav().buffer as ArrayBuffer, { headers: { 'Content-Type': 'audio/wav' } });
  });
  assert.equal(requests.length, 0);
  assert.equal((await client.status()).available, true);
  assert.deepEqual(await client.play('こんにちは', 0.7), wav());
  assert.equal(requests[1].url, 'http://127.0.0.1:3001/speech/japanese/play');
  assert.deepEqual(JSON.parse(requests[1].init!.body as string), { text: 'こんにちは', rate: 0.7 });
  assert.deepEqual(requests[1].init!.headers, { 'Content-Type': 'application/json', 'X-SmartLingo-Speech': '1' });
  assert.equal(requests[1].init!.credentials, 'omit');
  assert.equal(requests[1].init!.redirect, 'error');
  assert.throws(() => client.play('a'.repeat(501), 1), /1–500/);
  assert.throws(() => client.play(' ', 1), /1–500/);
  assert.equal(requests.length, 2);
  const malformed = createJapaneseSpeechClient(async () => new Response('not audio', { headers: { 'Content-Type': 'audio/wav' } }));
  await assert.rejects(malformed.play('こんにちは', 1), /Start the local API/);
  const wrongVoice = createJapaneseSpeechClient(async () => Response.json({ available: true, voice: 'Other', credit: japaneseCredit }));
  await assert.rejects(wrongVoice.status(), /Start the local API/);
  const wrongType = createJapaneseSpeechClient(async () => new Response(wav().buffer as ArrayBuffer, { headers: { 'Content-Type': 'audio/mpeg' } }));
  await assert.rejects(wrongType.play('こんにちは', 1), /Start the local API/);
});

test('WAV and streamed response bounds reject damaged or oversized data', async () => {
  assert.deepEqual(validateJapaneseWav(wav()), wav());
  const damaged = wav(); damaged[4] = 0;
  assert.throws(() => validateJapaneseWav(damaged), /incomplete/);
  const noData = wav(); noData[40] = 0;
  assert.throws(() => validateJapaneseWav(noData), /incomplete/);
  await assert.rejects(readBoundedAudio(new Response(new Uint8Array(maxJapaneseBytes + 1))), /too large/);
  await assert.rejects(readBoundedAudio(new Response('small', { headers: { 'Content-Length': String(maxJapaneseBytes + 1) } })), /too large/);
});

test('local source preferences validate persisted versions and survive storage failures for this visit', () => {
  let raw = JSON.stringify({ version: 1, source: 'voicevox' });
  const store = createJapaneseSourceStore(() => ({ getItem: () => raw, setItem: (_, value) => { raw = value; } }));
  assert.equal(store.get(), 'voicevox');
  assert.equal(store.save('device'), true);
  assert.deepEqual(JSON.parse(raw), { version: 1, source: 'device' });
  assert.equal(createJapaneseSourceStore(() => ({ getItem: () => '{broken', setItem() {} })).get(), 'auto');
  const unavailable = createJapaneseSourceStore(() => { throw new Error('Private browser'); });
  assert.equal(unavailable.get(), 'auto');
  assert.equal(unavailable.save('voicevox'), false);
  assert.equal(unavailable.get(), 'voicevox');
});

test('cache keys keep exact Japanese text/rate, bound entries and reject pre-removal writes across instances', async () => {
  const memory = memoryCache();
  const first = new JapaneseAudioStore(memory.environment);
  const second = new JapaneseAudioStore(memory.environment);
  const epoch = await first.begin();
  assert.notEqual(await japaneseClipKey('橋', 1), await japaneseClipKey('箸', 1));
  assert.notEqual(await japaneseClipKey('橋', 1), await japaneseClipKey('橋', 0.7));
  await first.put('橋', 1, wav(), epoch);
  assert.deepEqual(await second.get('橋', 1), wav());
  assert.equal(await second.get('箸', 1), undefined);
  await second.clear();
  await first.put('橋', 1, wav(), epoch);
  assert.equal(await first.get('橋', 1), undefined);
  const fresh = await first.begin();
  for (let index = 0; index < 103; index++) await first.put(`日本語${index}`, 1, wav(), fresh);
  assert.equal(memory.values.size, 101); // 100 clips plus the removal epoch.
  assert.equal(await first.get('日本語0', 1), undefined);
  assert.deepEqual(await first.get('日本語102', 1), wav());
  const key = await japaneseClipKey('日本語102', 1);
  await memory.cache.put(key, new Response('corrupt'));
  assert.equal(await first.get('日本語102', 1), undefined);
  const unavailable = new JapaneseAudioStore({ supported: () => false, open: memory.environment.open, lock: memory.environment.lock });
  assert.equal(await unavailable.begin(), undefined);
  assert.equal(await unavailable.get('橋', 1), undefined);
  await unavailable.put('橋', 1, wav(), undefined);
});

test('Japanese wrapper preserves French, prefers Japanese device and can force local/cache without device voices', async () => {
  const calls: string[] = [];
  let hasDevice = true;
  let source: JapaneseSource = 'auto';
  let saved: Uint8Array | undefined;
  const other: AudioPlayer = { available: () => false, speak: async (_, language) => { calls.push(`other:${language}`); }, stop() {} };
  const device: AudioPlayer = { available: () => hasDevice, speak: async (_, language) => { calls.push(`device:${language}`); }, stop() {} };
  const store: JapaneseClipStore = { begin: async () => undefined, get: async () => saved, put: async () => { calls.push('save'); } };
  const player = new JapaneseSpeechPlayer(other, device, {
    status: async () => ({ available: true, voice: japaneseVoice, credit: japaneseCredit }),
    play: async (_, rate) => { calls.push(`local:${rate}`); return wav(); },
  }, store, { play: async (_, mime) => { calls.push(`clip:${mime}`); }, stop() {} }, { get: () => source }, () => 0.7);
  await player.speak('bonjour');
  await player.speak('橋', 'ja-JP');
  assert.deepEqual(calls, ['other:fr-FR', 'device:ja-JP']);
  source = 'voicevox';
  await player.speak('橋', 'ja-JP');
  assert.deepEqual(calls.slice(2), ['local:0.7', 'clip:audio/wav', 'save']);
  hasDevice = false; source = 'auto'; saved = wav(); calls.length = 0;
  assert.equal(player.available('ja-JP'), true);
  await player.speak('橋', 'ja-JP');
  assert.deepEqual(calls, ['clip:audio/wav']); // Offline replay makes no API request.
  player.stop();
});

test('stopping or superseding a pending Japanese request aborts it and never plays late bytes', async () => {
  const signals: AbortSignal[] = [];
  const completions: ((bytes: Uint8Array) => void)[] = [];
  const played: Uint8Array[] = [];
  const silent: AudioPlayer = { available: () => false, speak: async () => {}, stop() {} };
  const player = new JapaneseSpeechPlayer(silent, silent, {
    status: async () => ({ available: true, voice: japaneseVoice, credit: japaneseCredit }),
    play: async (_, __, signal) => { signals.push(signal!); return new Promise(resolve => completions.push(resolve)); },
  }, { get: async () => undefined, begin: async () => undefined, put: async () => {} },
  { play: async bytes => { played.push(bytes); }, stop() {} }, { get: () => 'voicevox' }, () => 1);
  const first = player.speak('橋', 'ja-JP'); await tick();
  const second = player.speak('箸', 'ja-JP'); await tick();
  assert.equal(signals[0].aborted, true);
  completions[0](wav()); await first;
  assert.equal(played.length, 0);
  player.stop(); assert.equal(signals[1].aborted, true);
  completions[1](wav()); await second;
  assert.equal(played.length, 0);
});

test('Japanese browser playback rejection offers retry or text without claiming a device fallback', async () => {
  let deviceAttempts = 0;
  const revoked: string[] = [];
  const clip: ClipAudio = {
    onended: null, onerror: null, src: '',
    play: async () => { throw new Error('Browser playback blocked'); },
    pause() {}, load() {},
  };
  const clips = new BrowserClipPlayer({ create: () => clip, url: () => 'blob:japanese-audio', revoke: url => { revoked.push(url); } });
  const device: AudioPlayer = { available: () => false, speak: async () => { deviceAttempts++; }, stop() {} };
  const player = new JapaneseSpeechPlayer(device, device, {
    status: async () => ({ available: true, voice: japaneseVoice, credit: japaneseCredit }),
    play: async () => wav(),
  }, { get: async () => wav(), begin: async () => undefined, put: async () => {} }, clips, { get: () => 'voicevox' }, () => 1);
  await assert.rejects(player.speak('橋', 'ja-JP'), { message: 'Audio could not play. Try again or continue with text.' });
  assert.equal(deviceAttempts, 0);
  assert.deepEqual(revoked, ['blob:japanese-audio']);
  assert.equal(clip.src, '');
  assert.equal(clip.onerror, null);
  player.stop();
});
