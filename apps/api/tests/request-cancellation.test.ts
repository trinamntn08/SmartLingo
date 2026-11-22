import assert from 'node:assert/strict';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { test } from 'node:test';
import { withRequestCancellation } from '../src/request-cancellation';

function response(): ServerResponse { return new ServerResponse(new IncomingMessage(new Socket())); }

test('disconnect aborts pending work and releases the response listener', async () => {
  const raw = response();
  const pending = withRequestCancellation(raw, signal => new Promise<string>(resolve => {
    signal.addEventListener('abort', () => resolve('cancelled'), { once: true });
  }));
  raw.emit('close');
  assert.equal(await pending, 'cancelled');
  assert.equal(raw.listenerCount('close'), 0);
});

test('a completed response does not cancel work and a returned result removes its listener', async () => {
  const raw = response();
  let operationSignal!: AbortSignal;
  const result = await withRequestCancellation(raw, async signal => {
    operationSignal = signal;
    raw.end();
    raw.emit('close');
    assert.equal(signal.aborted, false);
    return 'done';
  });
  assert.equal(result, 'done');
  assert.equal(raw.listenerCount('close'), 0);
  raw.emit('close');
  assert.equal(operationSignal.aborted, false);
});

test('both synchronous and asynchronous failures retain their error and release the listener', async () => {
  const failure = new Error('operation failed');
  for (const run of [() => { throw failure; }, async () => { throw failure; }]) {
    const raw = response();
    await assert.rejects(withRequestCancellation(raw, run), error => error === failure);
    assert.equal(raw.listenerCount('close'), 0);
  }
});

test('an already disconnected response gives the operation an aborted signal', async () => {
  const raw = response();
  raw.destroy();
  assert.equal(raw.destroyed, true);
  await assert.rejects(withRequestCancellation(raw, async signal => {
    signal.throwIfAborted();
  }), { name: 'AbortError' });
  assert.equal(raw.listenerCount('close'), 0);
});
