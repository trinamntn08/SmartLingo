import { Capacitor, registerPlugin } from '@capacitor/core';
import type { TargetLanguage } from '@smartlingo/domain';
import type { AudioPlayer } from './index';
import { preferencesForLanguage, type AudioRate } from './preferences';

interface DeviceSpeechPlugin {
  getVoices(options: { language: TargetLanguage }): Promise<{ voices: SpeechSynthesisVoice[] }>;
  speak(options: { text: string; language: TargetLanguage; rate: AudioRate; voiceName: string }): Promise<void>;
  stop(): Promise<void>;
}

const plugin = registerPlugin<DeviceSpeechPlugin>('DeviceSpeech');
const fallbackError = 'Android text-to-speech is unavailable. Check your phone’s Text-to-speech output settings.';

export function androidSpeechAvailable(): boolean {
  return Capacitor.isPluginAvailable('DeviceSpeech');
}

export async function getAndroidVoices(language: TargetLanguage): Promise<SpeechSynthesisVoice[]> {
  return (await plugin.getVoices({ language })).voices;
}

function preferredVoiceName(voiceId: string): string {
  if (!voiceId) return '';
  try {
    const entry: unknown = JSON.parse(voiceId);
    const uri: unknown = Array.isArray(entry) ? entry[0] : undefined;
    if (typeof uri === 'string' && uri.startsWith('android:')) return uri.slice('android:'.length);
  } catch { /* Old browser voice preferences fall back to the Android default. */ }
  return '';
}

export function hasSelectedAndroidVoice(language: TargetLanguage): boolean {
  return androidSpeechAvailable() && !!preferredVoiceName(preferencesForLanguage(language).get().voiceId);
}

export class AndroidSpeechPlayer implements AudioPlayer {
  private cancelPending?: () => void;

  available(): boolean { return androidSpeechAvailable(); }

  async speak(text: string, language: TargetLanguage = 'fr-FR'): Promise<void> {
    this.cancelPending?.();
    const { rate, voiceId } = preferencesForLanguage(language).get();
    let cancel!: () => void;
    const cancelled = new Promise<void>(resolve => { cancel = resolve; });
    this.cancelPending = cancel;
    try {
      await Promise.race([plugin.speak({ text, language, rate, voiceName: preferredVoiceName(voiceId) }), cancelled]);
    } catch (failure) {
      if (this.cancelPending !== cancel) return;
      const message = failure && typeof failure === 'object' && 'message' in failure ? failure.message : undefined;
      throw new Error(typeof message === 'string' && message ? message : fallbackError);
    } finally {
      if (this.cancelPending === cancel) this.cancelPending = undefined;
    }
  }

  stop(): void {
    if (!this.cancelPending) return;
    this.cancelPending();
    this.cancelPending = undefined;
    void plugin.stop().catch(() => { /* The app may already be leaving the document. */ });
  }
}
