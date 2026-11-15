import { audioPreferences, type AudioPreferenceStore } from './preferences';
import { selectFrenchVoice } from './voices';
import { HybridSpeechPlayer } from './generated/hybrid';
import { generatedPreferences } from './generated/preferences';
import { generatedAudioStore } from './generated/store';
import { reportAudioNotice, savedClipPlayer } from './generated/runtime';

export interface AudioPlayer {
  available(): boolean;
  speak(text: string): Promise<void>;
  stop(): void;
}

export interface SpeechEnvironment {
  synthesis(): Pick<SpeechSynthesis, 'getVoices' | 'speak' | 'cancel'> | undefined;
  utterance(text: string): SpeechSynthesisUtterance | undefined;
}

const browserSpeech: SpeechEnvironment = {
  synthesis: () => globalThis.speechSynthesis,
  utterance: text => typeof globalThis.SpeechSynthesisUtterance === 'undefined' ? undefined : new SpeechSynthesisUtterance(text),
};

export class DeviceSpeechPlayer implements AudioPlayer {
  private cancelPending?: () => void;
  constructor(private readonly environment: SpeechEnvironment = browserSpeech, private readonly preferences: AudioPreferenceStore = audioPreferences) {}
  available(): boolean {
    try { return !!this.environment.utterance('') && !!selectFrenchVoice(this.environment.synthesis()?.getVoices() ?? [], this.preferences.get().voiceId); }
    catch { return false; }
  }
  speak(text: string): Promise<void> {
    this.stop();
    const synthesis = this.environment.synthesis();
    let utterance: SpeechSynthesisUtterance | undefined;
    let voice: SpeechSynthesisVoice | undefined;
    const preferences = this.preferences.get();
    try {
      utterance = this.environment.utterance(text);
      voice = selectFrenchVoice(synthesis?.getVoices() ?? [], preferences.voiceId);
    } catch { /* Unsupported speech falls back to visible text. */ }
    if (!voice || !utterance || !synthesis) {
      return Promise.reject(new Error('No French device voice is available. You can continue using the text.'));
    }
    return new Promise((resolve, reject) => {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = preferences.rate;
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

export const deviceAudio: AudioPlayer = new DeviceSpeechPlayer();
export const audio: AudioPlayer = new HybridSpeechPlayer(deviceAudio, generatedAudioStore, savedClipPlayer, generatedPreferences, reportAudioNotice);
