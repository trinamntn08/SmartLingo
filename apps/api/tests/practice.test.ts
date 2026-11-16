import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createApp } from '../src/app';
import { SqliteLessonRepository } from '../src/repository';
import { PracticeError, PracticeService, type PracticeProvider } from '../src/practice/service';
import { createOpenAIPracticeProvider, readPracticeOptions } from '../src/practice/provider';

const context = { topic: 'Bakery', role: 'Customer', level: 'A1' as const };
const reply = { french: 'Bonjour !', english: 'Hello!', feedback: 'Good start.', phrase: { target: 'Bonjour', meaning: 'Hello' } };
const result = { reply, inputTokens: 12, outputTokens: 8 };
const headers = { origin: 'http://localhost:8081', 'x-smartlingo-practice': '1', 'content-type': 'application/json' };
function request(sessionId: string) { return { sessionId, requestId: randomUUID(), text: 'Bonjour', englishHelp: false }; }

test('practice requires configuration, guarded JSON POST and exact preflight without spending', async () => {
  let calls = 0;
  const app = createApp(new SqliteLessonRepository(':memory:'), { practice: { provider: { async respond() { calls++; return result; } } } });
  const disabled = createApp(new SqliteLessonRepository(':memory:'));
  try {
    assert.equal((await disabled.inject('/ai/practice/status')).json().available, false);
    assert.equal((await disabled.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context } })).statusCode, 503);
    for (const origin of [undefined, 'null', 'http://attacker.test', 'http://localhost:8081.attacker.test']) {
      const h: Record<string, string> = { 'x-smartlingo-practice': '1', 'content-type': 'application/json' };
      if (origin) h.origin = origin;
      assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers: h, payload: { context } })).statusCode, 403);
    }
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers: { ...headers, 'x-smartlingo-practice': '0' }, payload: { context } })).statusCode, 403);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers: { ...headers, 'content-type': 'text/plain' }, payload: '{}' })).statusCode, 415);
    for (const requested of ['content-type,x-smartlingo-practice', 'content-type,x-smartlingo-editor', 'content-type,x-smartlingo-practice,authorization']) {
      const res = await app.inject({ method: 'OPTIONS', url: '/ai/practice/turns', headers: { origin: headers.origin, 'access-control-request-method': 'POST', 'access-control-request-headers': requested } });
      assert.equal(res.statusCode, requested === 'content-type,x-smartlingo-practice' ? 204 : 403);
    }
    assert.equal((await app.inject('/ai/practice/status')).statusCode, 200);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context: { ...context, extra: true } } })).statusCode, 400);
    const session = (await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context } })).json();
    assert.equal(calls, 0);
    const turn = request(session.sessionId);
    const response = await app.inject({ method: 'POST', url: '/ai/practice/turns', headers, payload: turn });
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json().reply, reply);
    assert.equal((await app.inject({ method: 'POST', url: '/ai/practice/stop', headers, payload: { sessionId: session.sessionId } })).statusCode, 200);
    assert.equal(calls, 1);
  } finally { await app.close(); await disabled.close(); }
  assert.equal(readPracticeOptions({ OPENAI_API_KEY: 'secret' }).provider, undefined);
  assert.equal(readPracticeOptions({ OPENAI_TEXT_MODEL: 'model' }).provider, undefined);
  for (const value of ['0', '201', 'abc', '1.5']) assert.throws(() => readPracticeOptions({ SMARTLINGO_AI_DAILY_LIMIT: value }));
});

test('replay never spends again, changed request conflicts and daily allowance reserves attempts', async () => {
  let calls = 0;
  let clock = Date.UTC(2026, 10, 15);
  const service = new PracticeService({ now: () => clock, dailyLimit: 1, provider: { async respond() { calls++; return result; } } });
  const turn = request(service.create(context).sessionId);
  const first = await service.turn(turn);
  assert.deepEqual(await service.turn(turn), first);
  await assert.rejects(service.turn({ ...turn, text: 'Salut' }), /different text/);
  await assert.rejects(service.turn(request(turn.sessionId)), /Daily/);
  assert.equal(calls, 1);
  assert.deepEqual(first.usage, { usedToday: 1, dailyLimit: 1, inputTokens: 12, outputTokens: 8 });
  clock += 24 * 60 * 60_000;
  assert.equal(service.status().usage.usedToday, 0);
  await assert.rejects(service.turn(turn), /expired/);
  service.close();
});

test('session memory expires, caps concurrent sessions and caps successful turns', async () => {
  let clock = 0;
  const service = new PracticeService({ now: () => clock, provider: { async respond() { return result; } } });
  const session = service.create(context);
  for (let i = 1; i < 16; i++) service.create(context);
  assert.throws(() => service.create(context), /Too many/);
  for (let i = 0; i < 8; i++) await service.turn(request(session.sessionId));
  await assert.rejects(service.turn(request(session.sessionId)), /Session limit/);
  clock = 30 * 60_000;
  assert.ok(service.create(context));
  await assert.rejects(service.turn(request(session.sessionId)), /expired/);
  service.close();
});

test('idle expiry deletes transcripts without any intervening request', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const service = new PracticeService({ now: () => 0, provider: { async respond() { return result; } } });
  const sessionId = service.create(context).sessionId;
  await service.turn(request(sessionId));
  t.mock.timers.tick(30 * 60_000);
  // The injected clock stays at zero, so request-time sweeping cannot remove it.
  await assert.rejects(service.turn(request(sessionId)), /expired or stopped/);
  service.close();
});

test('closing Fastify aborts a pending turn before waiting for its response', async () => {
  let started!: () => void;
  const ready = new Promise<void>(resolve => { started = resolve; });
  let signal: AbortSignal | undefined;
  const app = createApp(new SqliteLessonRepository(':memory:'), { practice: { provider: { respond(input) { signal = input.signal; started(); return new Promise(() => {}); } } } });
  const session = (await app.inject({ method: 'POST', url: '/ai/practice/sessions', headers, payload: { context } })).json();
  const pending = app.inject({ method: 'POST', url: '/ai/practice/turns', headers, payload: request(session.sessionId) });
  const responsePromise = Promise.resolve(pending);
  await ready;
  await app.close();
  const response = await responsePromise;
  assert.equal(signal?.aborted, true);
  assert.equal(response.statusCode, 409);
  assert.equal(response.json().code, 'attempt_ended');
  assert.equal(response.headers['cache-control'], 'no-store');
});

test('timeout and stop abort provider, release global flight and retain failed request tombstones', async () => {
  let calls = 0;
  let providerSignal: AbortSignal | undefined;
  const provider: PracticeProvider = { respond(input) { calls++; providerSignal = input.signal; return new Promise(() => {}); } };
  const service = new PracticeService({ provider, timeoutMs: 15 });
  const first = request(service.create(context).sessionId), other = request(service.create(context).sessionId);
  const pending = service.turn(first);
  await assert.rejects(service.turn(other), /in progress/);
  await assert.rejects(pending, /timed out/);
  assert.equal(providerSignal?.aborted, true);
  await assert.rejects(service.turn(first), error => error instanceof PracticeError && error.terminal && /timed out/.test(error.message));
  assert.equal(calls, 1);
  const stopped = service.turn(other);
  service.stop(other.sessionId);
  await assert.rejects(stopped, /cancelled/);
  await assert.rejects(service.turn(other), /expired or stopped/);
  const closing = service.turn(request(first.sessionId));
  service.close();
  await assert.rejects(closing, /cancelled/);
  assert.equal(service.status().available, false);
});

test('disconnected request cancellation is terminal on replay and never spends twice', async () => {
  let calls = 0;
  const service = new PracticeService({ provider: { respond() { calls++; return new Promise(() => {}); } } });
  const turn = request(service.create(context).sessionId);
  const controller = new AbortController();
  const pending = service.turn(turn, controller.signal);
  controller.abort();
  const terminal = (error: unknown) => error instanceof PracticeError && error.statusCode === 409 && error.terminal;
  await assert.rejects(pending, terminal);
  await assert.rejects(service.turn(turn), terminal);
  assert.equal(calls, 1);
  service.close();
});

test('invalid provider replies and errors are sanitized, bounded, and cannot retry the same ID', async () => {
  for (const fail of [async () => ({ ...result, reply: { french: 'Only French' } }), async () => { throw new Error('secret transcript api-key'); }]) {
    let calls = 0;
    const service = new PracticeService({ dailyLimit: 200, provider: { async respond() { calls++; return fail(); } } });
    const sessionId = service.create(context).sessionId;
    const turn = request(sessionId);
    await assert.rejects(service.turn(turn), error => error instanceof Error && error.message.includes('unavailable') && !error.message.includes('secret'));
    await assert.rejects(service.turn(turn), /unavailable/);
    assert.equal(calls, 1);
    for (let i = 1; i < 16; i++) await assert.rejects(service.turn(request(sessionId)), /unavailable/);
    await assert.rejects(service.turn(request(sessionId)), /Session limit/);
    assert.equal(calls, 16);
    service.close();
  }
});

test('OpenAI wire request keeps credentials in headers, disables storage, supplies no tools and parses structured output', async () => {
  let body: Record<string, unknown> = {};
  const provider = createOpenAIPracticeProvider('private-test-key', 'configured-model', async (url, init) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer private-test-key');
    body = JSON.parse(String(init?.body));
    assert.equal(body.store, false);
    assert.equal(body.model, 'configured-model');
    assert.equal(body.tools, undefined);
    assert.equal(JSON.stringify(body).includes('private-test-key'), false);
    return new Response(JSON.stringify({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(reply) }] }], usage: { input_tokens: 12, output_tokens: 8 } }));
  });
  const input = { context, history: [], text: 'Bonjour', englishHelp: false, signal: new AbortController().signal };
  assert.deepEqual(await provider.respond(input), result);
  for (const payload of [
    { status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }], usage: {} },
    { status: 'incomplete', output: [], usage: {} },
    { status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'bad json' }] }], usage: {} },
  ]) {
    const invalid = createOpenAIPracticeProvider('key', 'model', async () => new Response(JSON.stringify(payload)));
    await assert.rejects(invalid.respond(input));
  }
  const failed = createOpenAIPracticeProvider('key', 'model', async () => new Response('private upstream message', { status: 429 }));
  await assert.rejects(failed.respond(input), /Provider request failed/);
});
