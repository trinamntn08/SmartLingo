export interface AudioPlayer {
  available(): boolean;
  speak(text: string): Promise<void>;
  stop(): void;
}

function frenchVoice(): SpeechSynthesisVoice | undefined {
  return globalThis.speechSynthesis?.getVoices().find(voice => voice.lang.toLowerCase().startsWith('fr'));
}

class DeviceSpeechPlayer implements AudioPlayer {
  private cancelPending?: () => void;
  available(): boolean {
    return typeof globalThis.SpeechSynthesisUtterance !== 'undefined' && !!frenchVoice();
  }
  speak(text: string): Promise<void> {
    this.stop();
    const voice = frenchVoice();
    if (!voice || typeof globalThis.SpeechSynthesisUtterance === 'undefined') {
      return Promise.reject(new Error('No French device voice is available. You can continue using the text.'));
    }
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      const finish = (error?: Error) => {
        clearTimeout(timeout);
        if (this.cancelPending === cancel) this.cancelPending = undefined;
        utterance.onend = null;
        utterance.onerror = null;
        if (error) reject(error); else resolve();
      };
      const cancel = () => finish();
      const timeout = setTimeout(() => {
        globalThis.speechSynthesis.cancel();
        finish(new Error('Device speech did not finish. You can retry or continue with text.'));
      }, 20000);
      this.cancelPending = cancel;
      utterance.onend = () => finish();
      utterance.onerror = () => finish(new Error('Device speech could not play. You can continue with text.'));
      globalThis.speechSynthesis.speak(utterance);
    });
  }
  stop(): void {
    this.cancelPending?.();
    this.cancelPending = undefined;
    globalThis.speechSynthesis?.cancel();
  }
}

export const audio: AudioPlayer = new DeviceSpeechPlayer();
