import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audio } from '../src/audio/index';

test('missing speech support rejects while text study remains possible', async () => {
  assert.equal(audio.available(), false);
  await assert.rejects(audio.speak('bonjour'), /No French device voice/);
  audio.stop();
});

test('device speech uses French and settles playback, replacement, cancellation, errors and timeout', async context => {
  const originalSpeech = Object.getOwnPropertyDescriptor(globalThis, 'speechSynthesis');
  const originalUtterance = Object.getOwnPropertyDescriptor(globalThis, 'SpeechSynthesisUtterance');
  let frenchAvailable = false;
  let current: SpeechSynthesisUtterance | undefined;
  class Utterance {
    constructor(public text: string) {}
    voice?: SpeechSynthesisVoice;
    lang = '';
    rate = 1;
    onend?: () => void;
    onerror?: () => void;
  }
  Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { configurable: true, value: Utterance });
  Object.defineProperty(globalThis, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: () => frenchAvailable ? [{ lang: 'fr-FR' }] : [],
      speak: (utterance: SpeechSynthesisUtterance) => { current = utterance; },
      cancel: () => {},
    },
  });
  context.mock.timers.enable({ apis: ['setTimeout'] });
  try {
    assert.equal(audio.available(), false);
    await assert.rejects(audio.speak('bonjour'));
    frenchAvailable = true;
    assert.equal(audio.available(), true);
    const playing = audio.speak('bonjour');
    assert.equal(current?.lang, 'fr-FR');
    assert.equal(current?.rate, 0.85);
    const replacement = audio.speak('merci');
    await playing;
    audio.stop();
    await replacement;
    const finished = audio.speak('un café');
    current?.onend?.({} as SpeechSynthesisEvent);
    await finished;
    const failed = assert.rejects(audio.speak('de l’eau'), /could not play/);
    current?.onerror?.({} as SpeechSynthesisErrorEvent);
    await failed;
    const timeout = assert.rejects(audio.speak('bonjour'), /did not finish/);
    context.mock.timers.tick(20001);
    await timeout;
  } finally {
    audio.stop();
    context.mock.timers.reset();
    if (originalSpeech) Object.defineProperty(globalThis, 'speechSynthesis', originalSpeech);
    else Reflect.deleteProperty(globalThis, 'speechSynthesis');
    if (originalUtterance) Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', originalUtterance);
    else Reflect.deleteProperty(globalThis, 'SpeechSynthesisUtterance');
  }
});
