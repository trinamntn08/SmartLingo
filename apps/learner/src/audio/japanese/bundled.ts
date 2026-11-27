import clips from '../../../public/japanese-audio/manifest.json';
import recordings from '../../../public/japanese-audio/human-recordings.json';
import type { AudioRate } from '../preferences';

const files: Readonly<Record<string, { file: string }>> = clips;

export interface RecordingCredit {
  author: string;
  source: string;
  license: string;
  licenseUrl: string;
  changes?: string;
}

export const humanRecordings: Readonly<Record<string, RecordingCredit>> = recordings;

export class BundledJapanesePlayer {
  private cancel?: () => void;

  play(text: string, rate: AudioRate): Promise<void> | undefined {
    if (!Object.hasOwn(files, text) || typeof globalThis.Audio === 'undefined') return;
    this.stop();
    return new Promise((resolve, reject) => {
      const clip = new Audio(`/japanese-audio/${files[text].file}`);
      clip.playbackRate = rate;
      const finish = (error?: Error) => {
        if (this.cancel !== cancel) return;
        clearTimeout(timer);
        this.cancel = undefined;
        clip.onended = null;
        clip.onerror = null;
        clip.pause();
        clip.removeAttribute('src');
        clip.load();
        if (error) reject(error);
        else resolve();
      };
      const failed = () => finish(new Error('The bundled Japanese audio could not play.'));
      const cancel = () => finish();
      const timer = setTimeout(failed, 45000);
      this.cancel = cancel;
      clip.onended = cancel;
      clip.onerror = failed;
      try { void clip.play().catch(failed); }
      catch { failed(); }
    });
  }

  stop(): void {
    this.cancel?.();
  }
}
