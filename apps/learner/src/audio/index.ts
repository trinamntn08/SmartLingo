import { preferencesForLanguage, type AudioPreferenceStore } from './preferences';
import { selectTargetVoice } from './voices';
import { languageNames, type TargetLanguage } from '@smartlingo/domain';
import { HybridSpeechPlayer } from './generated/hybrid';
import { generatedPreferences } from './generated/preferences';
import { generatedAudioStore } from './generated/store';
import { reportAudioNotice, savedClipPlayer } from './generated/runtime';
import { BrowserClipPlayer } from './generated/player';
import { JapaneseSpeechPlayer } from './japanese/player';
import { japaneseSource } from './japanese/preferences';
import { japaneseAudioStore, japaneseSpeechClient } from './japanese/runtime';
import { JapaneseCourseClipPlayer } from './japanese/course-clips';
import { isAndroidApp } from '../platform/runtime';
import { AndroidSpeechPlayer, hasSelectedAndroidVoice } from './android';

export interface AudioPlayer {
  available(language?: TargetLanguage): boolean;
  speak(text: string, language?: TargetLanguage): Promise<void>;
  stop(): void;
}

type DeviceSynthesis = Pick<SpeechSynthesis, 'getVoices' | 'speak' | 'cancel'>
  & Partial<Pick<SpeechSynthesis, 'addEventListener' | 'removeEventListener'>>;

export interface SpeechEnvironment {
  synthesis(): DeviceSynthesis | undefined;
  utterance(text: string): SpeechSynthesisUtterance | undefined;
}

const browserSpeech: SpeechEnvironment = {
  synthesis: () => globalThis.speechSynthesis,
  utterance: text => typeof globalThis.SpeechSynthesisUtterance === 'undefined' ? undefined : new SpeechSynthesisUtterance(text),
};
const voiceDiscoveryTimeout = 1500;

export class DeviceSpeechPlayer implements AudioPlayer {
  private cancelPending?: () => void;
  constructor(private readonly environment: SpeechEnvironment = browserSpeech, private readonly preferences?: AudioPreferenceStore) {}
  available(language: TargetLanguage = 'fr-FR'): boolean {
    try { return !!this.environment.utterance('') && !!selectTargetVoice(this.environment.synthesis()?.getVoices() ?? [], language, (this.preferences ?? preferencesForLanguage(language)).get().voiceId); }
    catch { return false; }
  }
  speak(text: string, language: TargetLanguage = 'fr-FR'): Promise<void> {
    this.stop();
    const synthesis = this.environment.synthesis();
    let utterance: SpeechSynthesisUtterance | undefined;
    const preferences = (this.preferences ?? preferencesForLanguage(language)).get();
    try { utterance = this.environment.utterance(text); } catch { /* Unsupported speech falls back to visible text. */ }
    const unavailable = () => new Error(language === 'fr-FR'
      ? 'No French device voice is available. Go to Profile → Audio & pronunciation → French audio and refresh the voice list.'
      : `No ${languageNames[language]} device voice is available. You can continue using the text.`);
    if (!utterance || !synthesis) return Promise.reject(unavailable());
    const speech = utterance;
    const findVoice = () => {
      try { return selectTargetVoice(synthesis.getVoices(), language, preferences.voiceId); }
      catch { return undefined; }
    };
    const play = (voice: SpeechSynthesisVoice) => this.play(synthesis, speech, voice, preferences.rate);
    const voice = findVoice();
    if (voice) return play(voice);
    if (!synthesis.addEventListener || !synthesis.removeEventListener) return Promise.reject(unavailable());

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout);
        synthesis.removeEventListener?.('voiceschanged', voicesChanged);
        this.cancelPending = undefined;
      };
      const cancel = () => { cleanup(); resolve(); };
      const check = (expired: boolean) => {
        const discovered = findVoice();
        if (!discovered && !expired) return;
        cleanup();
        if (discovered) resolve(play(discovered));
        else reject(unavailable());
      };
      const voicesChanged = () => check(false);
      const timeout = setTimeout(() => check(true), voiceDiscoveryTimeout);
      this.cancelPending = cancel;
      synthesis.addEventListener?.('voiceschanged', voicesChanged);
      voicesChanged();
    });
  }

  private play(synthesis: DeviceSynthesis, utterance: SpeechSynthesisUtterance, voice: SpeechSynthesisVoice, rate: number): Promise<void> {
    return new Promise((resolve, reject) => {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = rate;
      let settled = false;
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (this.cancelPending === cancel) this.cancelPending = undefined;
        utterance.onend = null;
        utterance.onerror = null;
        if (error) reject(error); else resolve();
      };
      const cancel = () => finish();
      const timeout = setTimeout(() => {
        finish(new Error('Device speech did not finish. You can retry or continue with text.'));
        try { synthesis.cancel(); } catch { /* Playback has already settled. */ }
      }, 20000);
      this.cancelPending = cancel;
      utterance.onend = () => finish();
      utterance.onerror = () => finish(new Error('Device speech could not play. You can continue with text.'));
      try { synthesis.speak(utterance); }
      catch { finish(new Error('Device speech could not play. You can continue with text.')); }
    });
  }
  stop(): void {
    this.cancelPending?.();
    this.cancelPending = undefined;
    try { this.environment.synthesis()?.cancel(); } catch { /* Text study remains available. */ }
  }
}

export const deviceAudio: AudioPlayer = isAndroidApp() ? new AndroidSpeechPlayer() : new DeviceSpeechPlayer();
const frenchAudio = new HybridSpeechPlayer(deviceAudio, generatedAudioStore, savedClipPlayer, generatedPreferences, reportAudioNotice);
const preferredAudio: AudioPlayer = isAndroidApp() ? deviceAudio : new JapaneseSpeechPlayer(frenchAudio, deviceAudio, japaneseSpeechClient, japaneseAudioStore,
  new BrowserClipPlayer(), japaneseSource, () => preferencesForLanguage('ja-JP').get().rate);

const courseClips = new JapaneseCourseClipPlayer();
let playbackSequence = 0;
export const audio: AudioPlayer = {
  available: language => preferredAudio.available(language),
  speak(text, language) {
    playbackSequence++;
    courseClips.stop();
    return preferredAudio.speak(text, language);
  },
  stop() {
    playbackSequence++;
    courseClips.stop();
    preferredAudio.stop();
  },
};

export async function speakCourseAudio(text: string, language: TargetLanguage): Promise<boolean> {
  audio.stop();
  const sequence = playbackSequence;
  // Use the same isolated vowel model in study and sound recognition.
  const vowel = language === 'ja-JP' && /^[アイウエオ]$/u.test(text);
  const useCourseClip = language === 'ja-JP' && (vowel || !(isAndroidApp() && hasSelectedAndroidVoice(language)));
  const clip = useCourseClip ? courseClips.play(text) : undefined;
  if (clip) {
    try { return await clip; }
    catch (error) {
      if (sequence !== playbackSequence) return false;
      if (!vowel || !deviceAudio.available(language)) throw error;
      await deviceAudio.speak(text, language);
      return sequence === playbackSequence;
    }
  }
  await preferredAudio.speak(text, language);
  return sequence === playbackSequence;
}
