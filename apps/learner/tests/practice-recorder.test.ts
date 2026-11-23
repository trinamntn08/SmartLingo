import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LocalRecorder, maxRecordingBytes, normalizeRecordingMime, recordingBase64, type RecordingPlatform, type RecordingState } from '../src/practice/recorder';

export function fakeRecording() {
  let handlers!: Parameters<RecordingPlatform['recorder']>[2];
  let stopped = 0;
  let detached = 0;
  let captureStops = 0;
  let permissionCalls = 0;
  const stream = { getTracks: () => [{ stop: () => { stopped++; } }] };
  const platform: RecordingPlatform = {
    mimeType: () => 'audio/webm', stream: async () => { permissionCalls++; return stream; },
    recorder(_stream, _mime, next) {
      handlers = next;
      return { mimeType: 'audio/webm;codecs=opus', start() {}, stop() { captureStops++; }, detach() { detached++; } };
    },
  };
  return { platform, stream, get handlers() { return handlers; }, get stopped() { return stopped; }, get detached() { return detached; }, get captureStops() { return captureStops; }, get permissionCalls() { return permissionCalls; } };
}

test('recording is explicit, yields only a local clip, normalizes MIME and releases tracks on stop/discard', async () => {
  const fake = fakeRecording();
  let state: RecordingState | undefined;
  const recorder = new LocalRecorder(next => { state = next; }, fake.platform);
  assert.equal(fake.permissionCalls, 0);
  await recorder.start(); await recorder.start();
  assert.equal(fake.permissionCalls, 1); assert.equal(state?.phase, 'recording');
  fake.handlers.data(new Blob(['local audio']));
  recorder.stop(); assert.equal(fake.stopped, 1);
  fake.handlers.stop(); assert.equal(state?.phase, 'ready');
  assert.equal(state?.clip?.size, 11); assert.equal(state?.mimeType, 'audio/webm');
  recorder.clear(); assert.equal(state?.clip, undefined); assert.equal(state?.phase, 'idle');
  assert.ok(fake.detached > 0);
});

test('late microphone permission is released after cancellation without creating a recorder', async () => {
  const fake = fakeRecording();
  let resolve!: (value: typeof fake.stream) => void;
  fake.platform.stream = () => new Promise(done => { resolve = done; });
  let creates = 0; fake.platform.recorder = () => { creates++; throw new Error('should not create'); };
  let state: RecordingState | undefined;
  const recorder = new LocalRecorder(next => { state = next; }, fake.platform);
  const pending = recorder.start(); assert.equal(state?.phase, 'permission');
  recorder.clear(); resolve(fake.stream); await pending;
  assert.equal(fake.stopped, 1); assert.equal(creates, 0); assert.equal(state?.phase, 'idle');
});

test('automatic 30-second stop and 2 MiB overflow release the microphone', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const fake = fakeRecording(); let state: RecordingState | undefined;
  const recorder = new LocalRecorder(next => { state = next; }, fake.platform);
  await recorder.start(); fake.handlers.data(new Blob(['short clip']));
  context.mock.timers.tick(30000);
  assert.equal(fake.stopped, 1); assert.equal(state?.phase, 'stopping');
  fake.handlers.stop(); assert.equal(state?.phase, 'ready'); assert.match(state?.notice ?? '', /30-second/);
  recorder.clear(); await recorder.start();
  fake.handlers.data(new Blob([new Uint8Array(maxRecordingBytes + 1)]));
  assert.equal(state?.phase, 'idle'); assert.equal(state?.clip, undefined); assert.match(state?.error ?? '', /2 MiB/);
  assert.equal(fake.stopped, 2);
  context.mock.timers.reset();
});

test('unsupported, denied, empty and recording-error states preserve text fallback', async () => {
  const fake = fakeRecording(); let state: RecordingState | undefined;
  const recorder = new LocalRecorder(next => { state = next; }, fake.platform);
  fake.platform.mimeType = () => undefined;
  await recorder.start(); assert.match(state?.error ?? '', /unsupported/); assert.equal(fake.permissionCalls, 0);
  fake.platform.mimeType = () => 'audio/webm'; fake.platform.stream = async () => { throw new Error('denied'); };
  await recorder.start(); assert.match(state?.error ?? '', /denied/);
  fake.platform.stream = async () => fake.stream;
  await recorder.start(); recorder.stop(); fake.handlers.stop(); assert.match(state?.error ?? '', /No usable audio/);
  await recorder.start(); fake.handlers.error(); assert.match(state?.error ?? '', /recording failed/); assert.equal(state?.clip, undefined);
});

test('base64 conversion is bounded and retains the exact bytes without persistence', async () => {
  assert.equal(normalizeRecordingMime('Audio/MP4;codecs=aac'), 'audio/mp4');
  assert.equal(normalizeRecordingMime('video/webm'), undefined);
  assert.equal(await recordingBase64(new Blob([new Uint8Array([0, 1, 2, 255])])), 'AAEC/w==');
  await assert.rejects(recordingBase64(new Blob([])), /between 1 byte/);
  await assert.rejects(recordingBase64(new Blob([new Uint8Array(maxRecordingBytes + 1)])), /2 MiB/);
});
