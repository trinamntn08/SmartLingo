import type { PracticeAudioMime } from '@smartlingo/domain';

export const maxRecordingBytes = 2 * 1024 * 1024;
export const maxRecordingMilliseconds = 30000;
type CaptureStream = { getTracks(): { stop(): void }[] };
type CaptureHandlers = { data(blob: Blob): void; stop(): void; error(): void };
type CaptureHandle = { readonly mimeType: string; start(): void; stop(): void; detach(): void };
export interface RecordingPlatform {
  mimeType(): PracticeAudioMime | undefined;
  stream(): Promise<CaptureStream>;
  recorder(stream: CaptureStream, mimeType: PracticeAudioMime, handlers: CaptureHandlers): CaptureHandle;
}
export type RecordingState = {
  phase: 'idle' | 'permission' | 'recording' | 'stopping' | 'ready';
  clip?: Blob; mimeType?: PracticeAudioMime; error: string; notice: string;
};
const idle = (): RecordingState => ({ phase: 'idle', error: '', notice: '' });
export function normalizeRecordingMime(mime: string): PracticeAudioMime | undefined {
  const normalized = mime.split(';')[0].trim().toLowerCase();
  return ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'].includes(normalized) ? normalized as PracticeAudioMime : undefined;
}

const browserRecording: RecordingPlatform = {
  mimeType() {
    if (!globalThis.navigator?.mediaDevices?.getUserMedia || typeof globalThis.MediaRecorder === 'undefined') return undefined;
    return (['audio/webm', 'audio/mp4', 'audio/ogg'] as const).find(mime => MediaRecorder.isTypeSupported(mime));
  },
  stream: () => navigator.mediaDevices.getUserMedia({ audio: true }),
  recorder(stream, mimeType, handlers) {
    const recorder = new MediaRecorder(stream as MediaStream, { mimeType });
    recorder.ondataavailable = event => handlers.data(event.data);
    recorder.onstop = () => handlers.stop();
    recorder.onerror = () => handlers.error();
    return {
      get mimeType() { return recorder.mimeType; },
      start: () => recorder.start(250),
      stop: () => { if (recorder.state !== 'inactive') recorder.stop(); },
      detach: () => { recorder.ondataavailable = null; recorder.onstop = null; recorder.onerror = null; },
    };
  },
};

/** Holds raw audio only in memory; permission and capture start only on Record. */
export class LocalRecorder {
  private state = idle();
  private generation = 0;
  private stream?: CaptureStream;
  private handle?: CaptureHandle;
  private chunks: Blob[] = [];
  private bytes = 0;
  private timer?: ReturnType<typeof setTimeout>;
  constructor(private changed: (state: RecordingState) => void, private platform: RecordingPlatform = browserRecording) {}
  private update(patch: Partial<RecordingState>) { this.state = { ...this.state, ...patch }; this.changed(this.state); }
  async start() {
    if (this.state.phase !== 'idle') return;
    const mimeType = this.platform.mimeType();
    if (!mimeType) { this.update({ error: 'Recording is unsupported in this browser. Use the text message instead.' }); return; }
    const generation = ++this.generation;
    this.update({ phase: 'permission', error: '', notice: '' });
    try {
      const stream = await this.platform.stream();
      if (generation !== this.generation) { stream.getTracks().forEach(track => track.stop()); return; }
      this.stream = stream; this.chunks = []; this.bytes = 0;
      const handle = this.platform.recorder(stream, mimeType, {
        data: blob => {
          if (generation !== this.generation) return;
          this.bytes += blob.size;
          if (this.bytes > maxRecordingBytes) { this.fail('Recording exceeded 2 MiB and was discarded. Try a shorter recording, or type instead.'); return; }
          if (blob.size) this.chunks.push(blob);
        },
        stop: () => {
          if (generation !== this.generation) return;
          const actualMime = normalizeRecordingMime(handle.mimeType || mimeType);
          const clip = actualMime ? new Blob(this.chunks, { type: actualMime }) : undefined;
          this.release(); this.chunks = []; this.bytes = 0;
          if (!clip?.size || !actualMime) { this.fail('No usable audio was recorded. Try again, or type instead.'); return; }
          this.update({ phase: 'ready', clip, mimeType: actualMime });
        },
        error: () => { if (generation === this.generation) this.fail('Microphone recording failed. Try again, or type instead.'); },
      });
      this.handle = handle;
      handle.start();
      this.update({ phase: 'recording', mimeType });
      this.timer = setTimeout(() => { if (generation === this.generation) this.stop('Recording stopped at the 30-second limit.'); }, maxRecordingMilliseconds);
    } catch {
      if (generation === this.generation) this.fail('Microphone access was denied or unavailable. Check browser permissions, or type your message instead.');
    }
  }
  stop(notice = 'Recording stopped. The clip stays here until you transcribe or discard it.') {
    if (this.state.phase !== 'recording') return;
    clearTimeout(this.timer);
    this.update({ phase: 'stopping', notice });
    try { this.handle?.stop(); } catch { this.fail('Recording could not finish. Try again, or type instead.'); }
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = undefined;
  }
  private release() {
    clearTimeout(this.timer); this.timer = undefined;
    this.handle?.detach();
    try { this.handle?.stop(); } catch { /* Release tracks even after recorder failure. */ }
    this.handle = undefined;
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = undefined;
  }
  private fail(error: string) { this.clear(false); this.update({ error }); }
  clear(notify = true) {
    this.generation++; this.release(); this.chunks = []; this.bytes = 0; this.state = idle();
    if (notify) this.update({ notice: 'Recording discarded. You can type or record again.' });
  }
}

export async function recordingBase64(clip: Blob): Promise<string> {
  if (!clip.size || clip.size > maxRecordingBytes) throw new Error('Recording must be between 1 byte and 2 MiB. Please record again.');
  const bytes = new Uint8Array(await clip.arrayBuffer());
  let binary = '';
  // Bounded chunks avoid spreading a large array into a function call.
  for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return btoa(binary);
}
