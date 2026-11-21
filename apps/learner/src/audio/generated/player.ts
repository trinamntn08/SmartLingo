export interface ClipAudio {
  onended: (() => void) | null;
  onerror: (() => void) | null;
  src: string;
  play(): Promise<void>;
  pause(): void;
  load(): void;
}
export interface ClipEnvironment {
  create(): ClipAudio | undefined;
  url(bytes: Uint8Array, mime?: string): string;
  revoke(url: string): void;
}
const browserAudio: ClipEnvironment = {
  create: () => typeof globalThis.Audio === 'undefined' ? undefined : new Audio() as unknown as ClipAudio,
  url: (bytes, mime = 'audio/mpeg') => URL.createObjectURL(new Blob([new Uint8Array(bytes).buffer], { type: mime })),
  revoke: url => URL.revokeObjectURL(url),
};
export class BrowserClipPlayer {
  private cancel?: () => void;
  constructor(private readonly environment: ClipEnvironment = browserAudio) {}
  play(bytes: Uint8Array, mime = 'audio/mpeg'): Promise<void> {
    this.stop();
    return new Promise((resolve, reject) => {
      let clip: ClipAudio | undefined;
      let url: string | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let settled = false;
      const finish = (error?: Error) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        if (this.cancel === cancel) this.cancel = undefined;
        if (clip) { clip.onended = null; clip.onerror = null; try { clip.pause(); clip.src = ''; clip.load(); } catch { /* Already stopped. */ } }
        if (url) this.environment.revoke(url);
        if (error) reject(error); else resolve();
      };
      const cancel = () => finish();
      this.cancel = cancel;
      try {
        clip = this.environment.create();
        if (!clip) throw new Error('Missing audio engine');
        url = this.environment.url(bytes, mime); clip.src = url;
        clip.onended = () => finish();
        clip.onerror = () => finish(new Error('Audio could not play. Try again or continue with text.'));
        timer = setTimeout(() => finish(new Error('Audio timed out. Try again or continue with text.')), 120000);
        void clip.play().catch(() => finish(new Error('Audio could not play. Try again or continue with text.')));
      } catch { finish(new Error('Audio playback is unavailable. Try again or continue with text.')); }
    });
  }
  stop() { this.cancel?.(); this.cancel = undefined; }
}
