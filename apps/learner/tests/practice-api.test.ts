import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practiceApi, PracticeApiError } from '../src/practice/api';

const sessionId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820401';
const requestId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820402';
const command = { sessionId, requestId, text: 'Bonjour', englishHelp: false };
const usage = { usedToday: 1, dailyLimit: 40, inputTokens: 12, outputTokens: 20 };
const reply = { requestId, reply: { french: 'Bonjour !', english: 'Hello!', feedback: '', phrase: null }, usedTurns: 1, maxTurns: 8, usage };

test('practice client validates commands, uses explicit safe POST and checks response identity', async context => {
  const calls: RequestInit[] = [];
  context.mock.method(globalThis, 'fetch', async (_url: string, options: RequestInit) => { calls.push(options); return Response.json(reply); });
  assert.equal((await practiceApi.turn(command)).reply.english, 'Hello!');
  assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].credentials, 'omit');
  assert.equal(calls[0].redirect, 'error');
  assert.equal((calls[0].headers as Record<string, string>)['X-SmartLingo-Practice'], '1');
  assert.deepEqual(JSON.parse(calls[0].body as string), command);
  await assert.rejects(practiceApi.turn({ ...command, text: '' }));
  assert.equal(calls.length, 1);
  context.mock.restoreAll();
  context.mock.method(globalThis, 'fetch', async () => Response.json({ ...reply, requestId: sessionId }));
  await assert.rejects(practiceApi.turn(command), /mismatched/);
});

test('practice rejects malformed replies and maps setup, expired and limit failures without automatic retry', async context => {
  context.mock.method(globalThis, 'fetch', async () => Response.json({ available: true }));
  await assert.rejects(practiceApi.status(), /invalid reply/);
  context.mock.restoreAll();
  for (const status of [503, 410, 429, 403, 409, 500, 502, 504]) {
    const fetch = context.mock.method(globalThis, 'fetch', async () => Response.json({}, { status }));
    await assert.rejects(practiceApi.turn(command), error => error instanceof PracticeApiError && error.status === status);
    assert.equal(fetch.mock.callCount(), 1);
    context.mock.restoreAll();
  }
});

test('practice has a bounded timeout and honors external cancellation', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  context.mock.method(globalThis, 'fetch', (_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const timed = assert.rejects(practiceApi.turn(command), /timed out/);
  context.mock.timers.tick(35001); await timed;
  const controller = new AbortController();
  const cancelled = assert.rejects(practiceApi.turn(command, controller.signal), /cancelled/);
  controller.abort(); await cancelled;
  context.mock.timers.reset();
});

test('practice distinguishes an ended attempt from in-progress conflict and never displays raw provider errors', async context => {
  for (const code of ['attempt_ended', 'in_progress', undefined]) {
    context.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'secret provider detail', code }, { status: 409 }));
    await assert.rejects(practiceApi.turn(command), error => {
      assert.ok(error instanceof PracticeApiError);
      assert.equal(error.terminal, code === 'attempt_ended');
      assert.equal(error.message.includes('secret provider detail'), false);
      if (error.terminal) assert.match(error.message, /additional API credits/);
      return true;
    });
    context.mock.restoreAll();
  }
});

test('transcription adapter validates bounds, response identity and explicit no-store commands', async context => {
  const calls: RequestInit[] = [];
  context.mock.method(globalThis, 'fetch', async (_url: string, options: RequestInit) => { calls.push(options); return Response.json({ requestId, text: 'Bonjour !', usage }); });
  const command = { sessionId, requestId, mimeType: 'audio/webm' as const, audioBase64: 'Y2xpcA==' };
  assert.equal((await practiceApi.transcribe(command)).text, 'Bonjour !');
  assert.equal(calls[0].cache, 'no-store'); assert.equal(calls[0].method, 'POST'); assert.equal(calls[0].credentials, 'omit');
  assert.deepEqual(JSON.parse(calls[0].body as string), command);
  await assert.rejects(practiceApi.transcribe({ ...command, audioBase64: 'a'.repeat(2796205) }));
  assert.equal(calls.length, 1);
  context.mock.restoreAll();
  context.mock.method(globalThis, 'fetch', async () => Response.json({ requestId: sessionId, text: 'wrong', usage }));
  await assert.rejects(practiceApi.transcribe(command), /mismatched transcription/);
  context.mock.restoreAll();
  context.mock.method(globalThis, 'fetch', async () => Response.json({ requestId, text: '', usage }));
  await assert.rejects(practiceApi.transcribe(command), /invalid reply/);
});

test('transcription error paths preserve text fallback and do not display server details', async context => {
  const command = { sessionId, requestId, mimeType: 'audio/webm' as const, audioBase64: 'Y2xpcA==' };
  context.mock.method(globalThis, 'fetch', async () => Response.json({ code: 'attempt_ended', error: 'provider private detail' }, { status: 409 }));
  await assert.rejects(practiceApi.transcribe(command), error => error instanceof PracticeApiError && error.terminal && /Transcribe recording/.test(error.message));
  context.mock.restoreAll();
  context.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 503 }));
  await assert.rejects(practiceApi.transcribe(command), /Transcription is not configured/);
});
