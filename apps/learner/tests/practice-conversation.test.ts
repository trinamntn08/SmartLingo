import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { PracticeTurnRequest, PracticeTurnResponse } from '@smartlingo/domain';
import { Conversation, type ConversationState } from '../src/practice/conversation';
import { PracticeApiError, type PracticeApi } from '../src/practice/api';

const sessionId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820401';
const requestId = 'e7bac4ad-0440-4dac-bfc8-02d9c2820402';
const usage = { usedToday: 1, dailyLimit: 40, inputTokens: 12, outputTokens: 20 };
const result: PracticeTurnResponse = { requestId, reply: { french: 'Bonjour !', english: 'Hello!', feedback: '', phrase: null }, usedTurns: 1, maxTurns: 8, usage };
function fake(overrides: Partial<PracticeApi> = {}): PracticeApi {
  return { status: async () => ({ available: true, transcriptionAvailable: false, maxTurns: 8, usage }),
    start: async () => ({ sessionId, maxTurns: 8, expiresAt: '2026-11-15T12:00:00Z' }),
    turn: async () => result, transcribe: async command => ({ requestId: command.requestId, text: 'Bonjour', usage }), stop: async () => {}, ...overrides };
}
const context = { topic: 'At the café', role: 'Customer', level: 'A1' as const };

test('status and starting do not send a turn; failed explicit retries retain identity; edits use a fresh identity', async () => {
  const calls: PracticeTurnRequest[] = [];
  let state: ConversationState | undefined;
  let ids = 0;
  const conversation = new Conversation(next => { state = next; }, fake({ turn: async command => {
    calls.push(command); if (calls.length === 1) throw new Error('offline'); return { ...result, requestId: command.requestId };
  } }), () => `${requestId.slice(0, -1)}${++ids}`);
  await conversation.check(); await conversation.start(context);
  assert.equal(calls.length, 0);
  await conversation.send('Bonjour', false);
  assert.equal(state?.error, 'offline');
  await conversation.retry();
  assert.deepEqual(calls[0], calls[1]);
  assert.equal(state?.exchanges.length, 1);
  await conversation.send('Merci', true);
  assert.notEqual(calls[2].requestId, calls[0].requestId);
  assert.equal(calls[2].englishHelp, true);
});

test('synchronous guard prevents two sends and stop clears memory while ignoring a late result', async () => {
  let resolve!: (value: PracticeTurnResponse) => void;
  let count = 0;
  let aborted = false;
  let stopped = '';
  let state: ConversationState | undefined;
  const conversation = new Conversation(next => { state = next; }, fake({ turn: async (_command, signal) => {
    count++; signal?.addEventListener('abort', () => { aborted = true; });
    return new Promise(done => { resolve = done; });
  }, stop: async id => { stopped = id; } }), () => requestId);
  await conversation.start(context);
  const pending = conversation.send('Bonjour', false);
  await conversation.send('duplicate', false);
  assert.equal(count, 1);
  conversation.clear();
  assert.equal(aborted, true); assert.equal(stopped, sessionId);
  resolve(result); await pending;
  assert.equal(state?.session, undefined);
  assert.deepEqual(state?.exchanges, []);
  assert.equal(state?.failed, undefined);
  assert.equal(state?.busy, false);
});

test('cancelled session creation stops a late session without restoring it', async () => {
  let resolve!: (value: Awaited<ReturnType<PracticeApi['start']>>) => void;
  let stopped = '';
  let state: ConversationState | undefined;
  const conversation = new Conversation(next => { state = next; }, fake({ start: () => new Promise(done => { resolve = done; }), stop: async id => { stopped = id; } }));
  const pending = conversation.start(context);
  conversation.clear();
  resolve({ sessionId, maxTurns: 8, expiresAt: '2026-11-15T12:00:00Z' });
  await pending;
  assert.equal(stopped, sessionId); assert.equal(state?.session, undefined);
});

test('known terminal provider failures require a new explicit send instead of retrying the cached failure', async () => {
  for (const status of [502, 504]) {
    let ids = 0;
    const requests: PracticeTurnRequest[] = [];
    let state: ConversationState | undefined;
    const conversation = new Conversation(next => { state = next; }, fake({ turn: async command => {
      requests.push(command); throw new PracticeApiError('Attempt ended; a new send may use credits.', status);
    } }), () => `${requestId.slice(0, -1)}${++ids}`);
    await conversation.start(context); await conversation.send('Bonjour', false);
    assert.equal(state?.failed, undefined);
    await conversation.retry(); assert.equal(requests.length, 1);
    await conversation.send('Bonjour', false);
    assert.equal(requests.length, 2);
    assert.notEqual(requests[0].requestId, requests[1].requestId);
  }
});

test('a late Stop failure cannot alter a new conversation', async () => {
  let rejectStop!: (error: Error) => void;
  let state: ConversationState | undefined;
  const conversation = new Conversation(next => { state = next; }, fake({ stop: () => new Promise((_resolve, reject) => { rejectStop = reject; }) }));
  await conversation.start(context); conversation.clear(); await conversation.start(context);
  rejectStop(new Error('offline')); await Promise.resolve();
  assert.equal(state?.session?.sessionId, sessionId);
  assert.equal(state?.notice, '');
});

test('ended 409 permits a new Send while in-progress 409 retains retry identity', async () => {
  for (const terminal of [true, false]) {
    let state: ConversationState | undefined;
    const requests: PracticeTurnRequest[] = [];
    const conversation = new Conversation(next => { state = next; }, fake({ turn: async command => {
      requests.push(command); throw new PracticeApiError('Conflict', 409, terminal);
    } }), () => requestId);
    await conversation.start(context); await conversation.send('Bonjour', false);
    assert.equal(!!state?.failed, !terminal);
    await conversation.retry();
    assert.equal(requests.length, terminal ? 1 : 2);
    if (!terminal) assert.deepEqual(requests[0], requests[1]);
  }
});
