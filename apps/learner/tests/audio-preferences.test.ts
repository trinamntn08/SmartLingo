import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAudioPreferenceStore, type AudioPreferences, type PreferenceStorage } from '../src/audio/preferences';
import { DeviceSpeechPlayer, type SpeechEnvironment } from '../src/audio/index';
import { frenchVoices, selectFrenchVoice, subscribeVoiceChanges, voiceId } from '../src/audio/voices';

function voice(name: string, lang: string, localService = true): SpeechSynthesisVoice {
  return { name, lang, localService, voiceURI: `test:${name}`, default: false };
}

test('French choice honors an explicit voice, prefers local France French, and falls back if it disappears', () => {
  const canadian = voice('Canada', 'fr-CA');
  const remote = voice('France network', 'fr-FR', false);
  const local = voice('France device', 'fr-FR');
  const english = voice('English', 'en-US');
  const voices = [english, canadian, remote, local];
  assert.deepEqual(frenchVoices(voices), [canadian, remote, local]);
  assert.equal(selectFrenchVoice(voices), local);
  assert.equal(selectFrenchVoice(voices, voiceId(remote)), remote);
  assert.equal(selectFrenchVoice([canadian, remote], voiceId(local)), remote);
  assert.equal(selectFrenchVoice([canadian]), canadian);
  assert.equal(selectFrenchVoice([english]), undefined);
  assert.equal(selectFrenchVoice([voice('France underscore', 'fr_FR'), canadian])?.name, 'France underscore');
});

test('Japanese starts at natural speed and preserves a previously saved learning speed', () => {
  const key = 'smartlingo.audio-preferences.ja-JP.v1';
  let raw: string | null = null;
  const storage: PreferenceStorage = { getItem: () => raw, setItem: (_, value) => { raw = value; } };
  const fresh = createAudioPreferenceStore(() => storage, key, 1);
  assert.equal(fresh.get().rate, 1);
  fresh.save({ voiceId: '', rate: 0.85 });
  assert.equal(createAudioPreferenceStore(() => storage, key, 1).get().rate, 0.85);
});

test('audio preferences persist separately and reject corrupt or unsupported saved values', () => {
  let raw: string | null = null;
  const storage: PreferenceStorage = { getItem: () => raw, setItem: (key, value) => { assert.equal(key, 'smartlingo.audio-preferences.v1'); raw = value; } };
  const store = createAudioPreferenceStore(() => storage);
  assert.deepEqual(store.get(), { voiceId: '', rate: 0.85 });
  const chosen: AudioPreferences = { voiceId: voiceId(voice('France', 'fr-FR')), rate: 1 };
  assert.equal(store.save(chosen), true);
  assert.deepEqual(createAudioPreferenceStore(() => storage).get(), chosen);
  const copy = store.get(); copy.voiceId = 'mutated';
  assert.deepEqual(store.get(), chosen);
  raw = '{broken';
  assert.deepEqual(createAudioPreferenceStore(() => storage).get(), { voiceId: '', rate: 0.85 });
  raw = JSON.stringify({ voiceId: 23, rate: 10, unrelated: 'ignored' });
  assert.deepEqual(createAudioPreferenceStore(() => storage).get(), { voiceId: '', rate: 0.85 });
});

test('blocked preference storage keeps the explicit choice usable for this visit', () => {
  const blocked = createAudioPreferenceStore(() => { throw new Error('denied'); });
  assert.deepEqual(blocked.get(), { voiceId: '', rate: 0.85 });
  assert.equal(blocked.save({ voiceId: 'chosen', rate: 0.7 }), false);
  assert.deepEqual(blocked.get(), { voiceId: 'chosen', rate: 0.7 });
  const unavailable = createAudioPreferenceStore(() => undefined);
  assert.equal(unavailable.save({ voiceId: '', rate: 1 }), false);
});

test('playback rereads voices and preferences, uses the selected locale, and recovers from a synchronous engine failure', async () => {
  const canada = voice('Canada', 'fr-CA');
  const france = voice('France', 'fr-FR');
  let voices: SpeechSynthesisVoice[] = [];
  let spoken: SpeechSynthesisUtterance | undefined;
  let throwOnSpeak = false;
  const preferences = createAudioPreferenceStore(() => undefined);
  const environment: SpeechEnvironment = {
    synthesis: () => ({ getVoices: () => voices, cancel: () => {}, speak: utterance => { if (throwOnSpeak) throw new Error('engine'); spoken = utterance; } }),
    utterance: text => ({ text, onend: null, onerror: null }) as SpeechSynthesisUtterance,
  };
  const player = new DeviceSpeechPlayer(environment, preferences);
  assert.equal(player.available(), false);
  await assert.rejects(player.speak('Bonjour'), /No French device voice/);
  voices = [france, canada];
  assert.equal(player.available(), true);
  preferences.save({ voiceId: voiceId(canada), rate: 0.7 });
  const playing = player.speak('Bonjour');
  assert.equal(spoken?.voice, canada);
  assert.equal(spoken?.lang, 'fr-CA');
  assert.equal(spoken?.rate, 0.7);
  player.stop(); await playing;
  voices = [france];
  const fallback = player.speak('Merci');
  assert.equal(spoken?.voice, france);
  player.stop(); await fallback;
  throwOnSpeak = true;
  await assert.rejects(player.speak('Bonjour'), /could not play/);
  player.stop();
});

test('the first speaker click waits for a French voice and stopping cancels pending discovery', async () => {
  const france = voice('France', 'fr-FR');
  let voices: SpeechSynthesisVoice[] = [];
  const spoken: SpeechSynthesisUtterance[] = [];
  const synthesis = Object.assign(new EventTarget(), {
    getVoices: () => voices,
    speak: (utterance: SpeechSynthesisUtterance) => { spoken.push(utterance); },
    cancel: () => {},
  });
  const player = new DeviceSpeechPlayer({
    synthesis: () => synthesis,
    utterance: text => ({ text, onend: null, onerror: null }) as SpeechSynthesisUtterance,
  });

  const cancelled = player.speak('Bonjour');
  player.stop();
  await cancelled;
  voices = [france];
  synthesis.dispatchEvent(new Event('voiceschanged'));
  assert.equal(spoken.length, 0);

  voices = [];
  const playing = player.speak('Merci');
  voices = [voice('English', 'en-US')];
  synthesis.dispatchEvent(new Event('voiceschanged'));
  assert.equal(spoken.length, 0);
  voices = [france];
  synthesis.dispatchEvent(new Event('voiceschanged'));
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0]?.text, 'Merci');
  assert.equal(spoken[0]?.voice, france);
  player.stop();
  await playing;
});

test('voice discovery subscribes and removes its own listener without overwriting other listeners', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'speechSynthesis');
  const events = new EventTarget();
  Object.defineProperty(globalThis, 'speechSynthesis', { configurable: true, value: events });
  let ownCalls = 0; let otherCalls = 0;
  events.addEventListener('voiceschanged', () => otherCalls++);
  try {
    const unsubscribe = subscribeVoiceChanges(() => ownCalls++);
    events.dispatchEvent(new Event('voiceschanged'));
    assert.equal(ownCalls, 1);
    unsubscribe();
    events.dispatchEvent(new Event('voiceschanged'));
    assert.equal(ownCalls, 1); assert.equal(otherCalls, 2);
  } finally {
    if (original) Object.defineProperty(globalThis, 'speechSynthesis', original);
    else Reflect.deleteProperty(globalThis, 'speechSynthesis');
  }
});
