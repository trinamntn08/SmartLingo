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
  url(bytes: Uint8Array): string;
  revoke(url: string): void;
}
const browserAudio: ClipEnvironment = {
  create: () => typeof globalThis.Audio === 'undefined' ? undefined : new Audio() as unknown as ClipAudio,
  url: bytes => URL.createObjectURL(new Blob([new Uint8Array(bytes).buffer], { type: 'audio/mpeg' })),
  revoke: url => URL.revokeObjectURL(url),
};
export class BrowserClipPlayer {
  private cancel?: () => void;
  constructor(private readonly environment: ClipEnvironment = browserAudio) {}
  play(bytes: Uint8Array): Promise<void> {
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
        url = this.environment.url(bytes); clip.src = url;
        clip.onended = () => finish();
        clip.onerror = () => finish(new Error('Saved audio could not play. Device speech is used when available.'));
        timer = setTimeout(() => finish(new Error('Saved audio timed out. Device speech is used when available.')), 120000);
        void clip.play().catch(() => finish(new Error('Saved audio could not play. Device speech is used when available.')));
      } catch { finish(new Error('Saved audio playback is unavailable. Device speech is used when available.')); }
    });
  }
  stop() { this.cancel?.(); this.cancel = undefined; }
}
