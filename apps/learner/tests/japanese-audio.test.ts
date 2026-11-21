import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DeviceSpeechPlayer, type SpeechEnvironment } from '../src/audio';
import { selectTargetVoice } from '../src/audio/voices';
import { HybridSpeechPlayer } from '../src/audio/generated/hybrid';

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
