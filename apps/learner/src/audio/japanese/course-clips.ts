import clips from '../../../public/japanese-audio/manifest.json';
import recordings from '../../../public/japanese-audio/human-recordings.json';
import { preferencesForLanguage } from '../preferences';

const files: Readonly<Record<string, { file: string; sha256: string; speed: number }>> = clips;
export type RecordingCredit = { author: string; source: string; license: string; licenseUrl: string; changes?: string };
export const humanRecordings: Readonly<Record<string, RecordingCredit>> = recordings;

export function hasHumanRecording(text: string) {
  return Object.hasOwn(humanRecordings, text);
}

export function japaneseCourseVoiceCredit(text: string) {
  return hasHumanRecording(text) ? `Recording · ${humanRecordings[text].author}` : 'Synthetic audio · VOICEVOX:四国めたん';
}

export function hasJapaneseCourseClip(text: string) {
  return Object.hasOwn(files, text);
}

export class JapaneseCourseClipPlayer {
  private cancel?: () => void;

  play(text: string): Promise<boolean> | undefined {
    if (!hasJapaneseCourseClip(text) || typeof globalThis.Audio === 'undefined') return;
    this.stop();
    const clip = new Audio(`/japanese-audio/${files[text].file}`);
    clip.playbackRate = preferencesForLanguage('ja-JP').get().rate;
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (outcome: 'ended' | 'stopped' | 'failed') => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        this.cancel = undefined;
        clip.onended = null;
        clip.onerror = null;
        clip.pause();
        clip.removeAttribute('src');
        clip.load();
        if (outcome === 'failed') reject(new Error('Course audio could not play. Try again or use the transcript.'));
        else resolve(outcome === 'ended');
      };
      const timer = setTimeout(() => finish('failed'), 45000);
      this.cancel = () => finish('stopped');
      clip.onended = () => finish('ended');
      clip.onerror = () => finish('failed');
      try { void clip.play().catch(() => finish('failed')); }
      catch { finish('failed'); }
    });
  }

  stop() {
    this.cancel?.();
  }
}
