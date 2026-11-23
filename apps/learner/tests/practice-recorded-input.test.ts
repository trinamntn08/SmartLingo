import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { PracticeTranscriptionRequest, PracticeTranscriptionResponse } from '@smartlingo/domain';
import { PracticeApiError, type PracticeApi } from '../src/practice/api';
import { RecordedInput, recordingBusy, type RecordedInputState } from '../src/practice/recorded-input';
import type { RecordingPlatform } from '../src/practice/recorder';

const sessionId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820401';
const requestId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820402';
const usage = { usedToday: 1, dailyLimit: 40, inputTokens: 0, outputTokens: 0 };
function platform(): RecordingPlatform {
  return { mimeType: () => 'audio/webm', stream: async () => ({ getTracks: () => [{ stop() {} }] }),
    recorder(_stream, mimeType, handlers) {
      let active = true;
      return { mimeType, start() {}, stop() { if (active) { active = false; handlers.data(new Blob(['clip'])); handlers.stop(); } }, detach() {} };
    } };
}
function api(transcribe: PracticeApi['transcribe']): PracticeApi {
  return { status: async () => ({ available: true, transcriptionAvailable: true, maxTurns: 8, usage }),
    start: async () => ({ sessionId, maxTurns: 8, expiresAt: '2026-11-15T12:00:00Z' }),
    turn: async () => { throw new Error('Transcription must never send a conversation turn.'); }, stop: async () => {}, transcribe };
}

test('recording stays local and explicit transcription returns editable text, usage and clears the clip', async () => {
  const requests: PracticeTranscriptionRequest[] = [];
  let state: RecordedInputState | undefined;
  let completed: PracticeTranscriptionResponse | undefined;
  const input = new RecordedInput(next => { state = next; }, result => { completed = result; }, api(async command => {
    requests.push(command); return { requestId: command.requestId, text: 'Bonjour !', usage };
  }), platform(), () => requestId);
  await input.record(); assert.equal(recordingBusy(state!), true);
  input.stop(); assert.equal(recordingBusy(state!), false); assert.equal(requests.length, 0);
  await input.transcribe(sessionId);
  assert.equal(requests.length, 1); assert.equal(requests[0].audioBase64, 'Y2xpcA==');
  assert.equal(completed?.text, 'Bonjour !'); assert.deepEqual(completed?.usage, usage);
  assert.equal(state?.recording.clip, undefined); assert.equal(state?.canRetry, false);
});

test('transcription has one synchronous flight and unknown failure retries the same recording identity', async () => {
  let resolve!: (value: PracticeTranscriptionResponse) => void;
  const requests: PracticeTranscriptionRequest[] = [];
  let state: RecordedInputState | undefined;
  const input = new RecordedInput(next => { state = next; }, () => {}, api(async command => {
    requests.push(command);
    if (requests.length === 1) throw new Error('offline');
    return new Promise(done => { resolve = done; });
  }), platform(), () => requestId);
  await input.record(); input.stop(); await input.transcribe(sessionId);
  assert.equal(state?.canRetry, true);
  const pending = input.retry(); await input.retry();
  assert.equal(requests.length, 2); assert.deepEqual(requests[0], requests[1]);
  resolve({ requestId, text: 'Bonjour', usage }); await pending;
  assert.equal(state?.canRetry, false);
});

test('known terminal transcription failures permit an explicitly paid fresh attempt', async () => {
  for (const terminal of [true, false]) {
    let count = 0; let state: RecordedInputState | undefined;
    const requests: PracticeTranscriptionRequest[] = [];
    const input = new RecordedInput(next => { state = next; }, () => {}, api(async command => {
      requests.push(command); throw new PracticeApiError('New attempt may use credits', 409, terminal);
    }), platform(), () => `${requestId.slice(0, -1)}${++count}`);
    await input.record(); input.stop(); await input.transcribe(sessionId);
    assert.equal(state?.canRetry, !terminal);
    if (terminal) assert.match(state?.error ?? '', /Press Transcribe recording.*additional API credits/);
    if (terminal) { await input.transcribe(sessionId); assert.notEqual(requests[0].requestId, requests[1].requestId); }
    else { await input.retry(); assert.deepEqual(requests[0], requests[1]); }
    input.clear();
  }
});

test('discard/navigation aborts transcription and ignores a late result without repopulating text', async () => {
  let resolve!: (value: PracticeTranscriptionResponse) => void;
  let aborted = false; let completions = 0; let state: RecordedInputState | undefined;
  const input = new RecordedInput(next => { state = next; }, () => { completions++; }, api(async (_command, signal) => {
    signal?.addEventListener('abort', () => { aborted = true; });
    return new Promise(done => { resolve = done; });
  }), platform(), () => requestId);
  await input.record(); input.stop(); const pending = input.transcribe(sessionId);
  await new Promise(done => setImmediate(done));
  input.clear(); assert.equal(aborted, true);
  resolve({ requestId, text: 'late transcript', usage }); await pending;
  assert.equal(completions, 0); assert.equal(state?.recording.clip, undefined); assert.equal(state?.transcribing, false);
});

test('discard during base64 conversion prevents any transcription request', async () => {
  let resolve!: (encoded: string) => void; let requests = 0;
  const input = new RecordedInput(() => {}, () => {}, api(async () => { requests++; return { requestId, text: 'late', usage }; }), platform(), () => requestId,
    () => new Promise(done => { resolve = done; }));
  await input.record(); input.stop(); const pending = input.transcribe(sessionId);
  input.clear(); resolve('Y2xpcA=='); await pending;
  assert.equal(requests, 0);
});
