import type { PracticeTranscriptionRequest, PracticeTranscriptionResponse } from '@smartlingo/domain';
import { PracticeApiError, practiceApi, type PracticeApi } from './api';
import { LocalRecorder, recordingBase64, type RecordingPlatform, type RecordingState } from './recorder';

export type RecordedInputState = { recording: RecordingState; transcribing: boolean; canRetry: boolean; error: string; notice: string };
const empty = (): RecordedInputState => ({ recording: { phase: 'idle', error: '', notice: '' }, transcribing: false, canRetry: false, error: '', notice: '' });
export function recordingBusy(state: RecordedInputState): boolean {
  return state.transcribing || ['permission', 'recording', 'stopping'].includes(state.recording.phase);
}

/** Coordinates local capture and explicit paid transcription; never sends a chat turn. */
export class RecordedInput {
  private state = empty();
  private recorder: LocalRecorder;
  private pending?: AbortController;
  private failed?: PracticeTranscriptionRequest;
  private generation = 0;
  constructor(private changed: (state: RecordedInputState) => void, private completed: (result: PracticeTranscriptionResponse) => void,
    private api: PracticeApi = practiceApi, platform?: RecordingPlatform,
    private uuid: () => string = () => globalThis.crypto.randomUUID(), private encode = recordingBase64) {
    this.recorder = new LocalRecorder(recording => this.update({ recording }), platform);
  }
  private update(patch: Partial<RecordedInputState>) { this.state = { ...this.state, ...patch }; this.changed(this.state); }
  record() { if (!this.pending) return this.recorder.start(); return Promise.resolve(); }
  stop() { this.recorder.stop(); }
  transcribe(sessionId: string) {
    if (this.failed) return Promise.resolve();
    return this.submit(sessionId);
  }
  retry() { return this.failed ? this.submit(this.failed.sessionId, this.failed) : Promise.resolve(); }
  private async submit(sessionId: string, retry?: PracticeTranscriptionRequest) {
    const { clip, mimeType, phase } = this.state.recording;
    if (this.pending || phase !== 'ready' || !clip || !mimeType) return;
    const generation = this.generation;
    const controller = new AbortController(); this.pending = controller;
    const current = () => generation === this.generation && !controller.signal.aborted;
    this.update({ transcribing: true, error: '', notice: '' });
    try {
      const command = retry ?? { sessionId, requestId: this.uuid(), mimeType, audioBase64: await this.encode(clip) };
      if (!current()) return;
      this.failed = command;
      const response = await this.api.transcribe(command, controller.signal);
      if (!current()) return;
      this.failed = undefined; this.recorder.clear(false);
      this.update({ recording: empty().recording, canRetry: false, notice: 'Transcription added to your message. Review and edit it, then press Send message when ready.' });
      this.completed(response);
    } catch (error) {
      if (!current()) return;
      const terminal = error instanceof PracticeApiError && (error.terminal || error.status === 502 || error.status === 504);
      if (terminal) this.failed = undefined;
      this.update({ canRetry: !!this.failed, error: terminal
        ? 'The previous transcription attempt ended. Press Transcribe recording for a new attempt; it may use additional API credits.'
        : error instanceof Error ? error.message : 'Transcription failed. Retry explicitly, or type instead.' });
    } finally {
      if (current()) { this.pending = undefined; this.update({ transcribing: false }); }
    }
  }
  clear(notify = true) {
    this.generation++; this.pending?.abort(); this.pending = undefined; this.failed = undefined;
    this.recorder.clear(false); this.state = empty();
    if (notify) this.update({ notice: 'Recording discarded. You can type or record again.' });
  }
}
