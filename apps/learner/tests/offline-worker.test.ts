import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';
import type { OfflineManifest, OfflineStatus } from '../src/offline/contracts';

const source = readFileSync(new URL('../public/smartlingo-sw.js', import.meta.url), 'utf8');
const origin = 'http://localhost:8082';
const prefix = 'smartlingo-assets-v1-';
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
type Reply = { type: string; status?: OfflineStatus; message?: string; progress?: { completed: number; total: number; bytes: number } };
type WorkerEvent = { data?: unknown; ports?: { postMessage(value: Reply): void }[]; request?: unknown; waitUntil?(value: Promise<unknown>): void; respondWith?(value: Promise<Response>): void };

class MemoryCache {
  readonly entries = new Map<string, Response>();
  private key(value: string) { return new URL(value, origin).href; }
  async match(value: string) { return this.entries.get(this.key(value))?.clone(); }
  async put(value: string, response: Response) { this.entries.set(this.key(value), response.clone()); }
  async delete(value: string) { return this.entries.delete(this.key(value)); }
}

class MemoryCaches {
  readonly entries = new Map<string, MemoryCache>();
  async keys() { return [...this.entries.keys()]; }
  async open(name: string) {
    let cache = this.entries.get(name);
    if (!cache) { cache = new MemoryCache(); this.entries.set(name, cache); }
    return cache;
  }
  async match(value: string, options: { cacheName: string }) { return this.entries.get(options.cacheName)?.match(value); }
  async delete(name: string) { return this.entries.delete(name); }
}

type MutationLocks = { request(name: string, options: { mode: string }, run: () => Promise<unknown>): Promise<unknown> };
type WorkerTimers = { setTimeout(callback: () => void, delay: number): unknown; clearTimeout(handle: unknown): void };

function harness(options: { caches?: MemoryCaches; locks?: MutationLocks; timers?: WorkerTimers } = {}) {
  const listeners = new Map<string, (event: WorkerEvent) => void>();
  const caches = options.caches ?? new MemoryCaches();
  const network = new Map<string, () => Promise<Response>>();
  const requests: string[] = [];
  const signals: (AbortSignal | undefined)[] = [];
  let claims = 0;
  let skipped = 0;
  const self = {
    location: { origin },
    addEventListener: (type: string, callback: (event: WorkerEvent) => void) => listeners.set(type, callback),
    skipWaiting: async () => { skipped++; },
    clients: { claim: async () => { claims++; } },
  };
  vm.runInNewContext(source, {
    self, caches, navigator: { locks: options.locks }, crypto: webcrypto, URL, Headers, Response, TextDecoder, Uint8Array, AbortController,
    setTimeout: options.timers?.setTimeout ?? setTimeout, clearTimeout: options.timers?.clearTimeout ?? clearTimeout,
    fetch: async (request: string | { url: string }, init?: { signal?: AbortSignal }) => {
      const url = typeof request === 'string' ? request : request.url;
      requests.push(url);
      signals.push(init?.signal);
      const handler = network.get(url);
      if (!handler) throw new Error('Network unavailable');
      return handler();
    },
  });
  const dispatch = async (type: string, event: WorkerEvent = {}) => {
    let pending: Promise<unknown> | undefined;
    listeners.get(type)!({ ...event, waitUntil: value => { pending = value; } });
    await pending;
  };
  const command = async (data: unknown, onReply?: (value: Reply) => void) => {
    const replies: Reply[] = [];
    await dispatch('message', { data, ports: [{ postMessage: value => { replies.push(value); onReply?.(value); } }] });
    return replies;
  };
  const status = async () => (await command({ type: 'STATUS' })).at(-1)!.status!;
  const setPack = (version: string) => {
    const contents = new Map([['/index.html', `<html>${version}</html>`], [`/assets/${version}.js`, `app('${version}')`]]);
    const files = [...contents].map(([url, body]) => ({ url, size: Buffer.byteLength(body), sha256: digest(body) }));
    const manifest: OfflineManifest = { formatVersion: 1, buildId: digest(JSON.stringify(files)), totalBytes: files.reduce((sum, file) => sum + file.size, 0), files };
    network.set(`${origin}/offline-manifest.json`, async () => Response.json(manifest));
    network.set(`${origin}/`, async () => new Response(contents.get('/index.html')));
    for (const [path, body] of contents) {
      if (path !== '/index.html') network.set(`${origin}${path}`, async () => new Response(body));
    }
    return { manifest, contents };
  };
  const fetchAsset = async (path: string, options: { method?: string; mode?: string } = {}) => {
    let response: Promise<Response> | undefined;
    listeners.get('fetch')!({ request: { url: new URL(path, origin).href, method: options.method ?? 'GET', mode: options.mode ?? 'cors' }, respondWith: value => { response = value; } });
    return response;
  };
  return { caches, network, requests, signals, dispatch, command, status, setPack, fetchAsset, lifecycle: () => ({ claims, skipped }) };
}

function fakeWorkerTimers() {
  const pending = new Map<object, { callback: () => void; delay: number }>();
  const timers: WorkerTimers = {
    setTimeout(callback, delay) { const handle = {}; pending.set(handle, { callback, delay }); return handle; },
    clearTimeout(handle) { pending.delete(handle as object); },
  };
  const expire = (delay: number) => {
    for (const [handle, timer] of pending) {
      if (timer.delay === delay) { pending.delete(handle); timer.callback(); }
    }
  };
  return { timers, pending, expire };
}

test('worker lifecycle never downloads; explicit download verifies and publishes a complete pack', async () => {
  const worker = harness();
  await worker.dispatch('install');
  await worker.dispatch('activate');
  assert.deepEqual(worker.lifecycle(), { claims: 1, skipped: 1 });
  assert.equal(worker.requests.length, 0);
  assert.equal((await worker.status()).state, 'empty');
  const { manifest } = worker.setPack('one');
  const replies = await worker.command({ type: 'DOWNLOAD', expectedBuildId: manifest.buildId });
  assert.equal(replies.at(-1)?.type, 'RESULT');
  assert.equal(replies.at(-1)?.status?.buildId, manifest.buildId);
  assert.equal(replies.at(-1)?.status?.bytes, manifest.totalBytes);
  assert.equal(replies.filter(reply => reply.type === 'PROGRESS').length, 3);
  assert.equal(replies.at(-2)?.progress?.completed, 2);
  const before = worker.requests.length;
  assert.match(await (await worker.fetchAsset('/assets/one.js'))!.text(), /one/);
  assert.equal(worker.requests.length, before);
  worker.network.clear();
  assert.match(await (await worker.fetchAsset('/', { mode: 'navigate' }))!.text(), /one/);
});

test('host-shaped download fetches root for the exact index entry and caches it under /index.html', async () => {
  const worker = harness();
  const { manifest, contents } = worker.setPack('hosted');
  assert.equal((await worker.command({ type: 'DOWNLOAD', expectedBuildId: manifest.buildId })).at(-1)?.type, 'RESULT');
  assert.equal(worker.requests.includes(`${origin}/`), true);
  assert.equal(worker.requests.includes(`${origin}/index.html`), false);
  assert.equal(worker.requests.includes(`${origin}/assets/hosted.js`), true);
  const cache = await worker.caches.open((await worker.caches.keys()).find(name => name.startsWith(prefix))!);
  assert.equal(await (await cache.match('/index.html'))!.text(), contents.get('/index.html'));
  assert.equal(await cache.match('/'), undefined);
});

test('hash failure leaves first attempt incomplete and retry publishes; no staged assets are served', async () => {
  const worker = harness();
  const { manifest } = worker.setPack('one');
  worker.network.set(`${origin}/assets/one.js`, async () => new Response('bad body'));
  const failed = await worker.command({ type: 'DOWNLOAD' });
  assert.equal(failed.at(-1)?.type, 'ERROR');
  assert.equal((await worker.status()).state, 'incomplete');
  worker.network.clear();
  await assert.rejects(worker.fetchAsset('/index.html'), /Network unavailable/);
  worker.setPack('one');
  assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.status?.buildId, manifest.buildId);
  assert.equal((await worker.caches.keys()).length, 1);
});

test('failed update retains previous pack, successful update keeps old hashed assets and aggregate bytes', async () => {
  const worker = harness();
  const first = worker.setPack('one');
  await worker.command({ type: 'DOWNLOAD' });
  const second = worker.setPack('two');
  worker.network.set(`${origin}/assets/two.js`, async () => { throw new Error('Connection lost'); });
  assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.type, 'ERROR');
  assert.equal((await worker.status()).buildId, first.manifest.buildId);
  assert.equal((await worker.status()).bytes, first.manifest.totalBytes);
  worker.setPack('two');
  const updated = (await worker.command({ type: 'DOWNLOAD' })).at(-1)?.status;
  assert.equal(updated?.buildId, second.manifest.buildId);
  assert.equal(updated?.bytes, first.manifest.totalBytes + second.manifest.totalBytes);
  worker.network.clear();
  assert.match(await (await worker.fetchAsset('/', { mode: 'navigate' }))!.text(), /two/);
  assert.match(await (await worker.fetchAsset('/assets/one.js'))!.text(), /one/);
});

test('evicted pack is incomplete and is never selected as document fallback', async () => {
  const worker = harness();
  worker.setPack('one');
  await worker.command({ type: 'DOWNLOAD' });
  const name = (await worker.caches.keys())[0]!;
  await (await worker.caches.open(name)).delete('/assets/one.js');
  assert.equal((await worker.status()).state, 'incomplete');
  worker.network.clear();
  await assert.rejects(worker.fetchAsset('/', { mode: 'navigate' }), /Network unavailable/);
  worker.setPack('one');
  assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.status?.state, 'ready');
});

test('invalid manifests and mismatched expected build are rejected before creating cache', async () => {
  const worker = harness();
  const { manifest } = worker.setPack('one');
  const invalid = [
    { ...manifest, totalBytes: manifest.totalBytes + 1 },
    { ...manifest, buildId: 'version-one' },
    { ...manifest, files: [...manifest.files, manifest.files[0]] },
    ...['https://elsewhere.test/x', '//elsewhere.test/x', '/api/x', '/ai/practice/status', '/speech/status', '/editor/x', '/health', '/lessons', '/published-lessons/example', '/smartlingo-sw.js', '/offline-manifest.json', '/__smartlingo_offline_complete__', '/x?query=1', '/x#fragment', '/assets/../index.html', '/%61pi/x', '/x\\file', '/x%2ffile'].map(url => ({
      ...manifest, files: [{ ...manifest.files[0], url }, manifest.files[1]],
    })),
    { ...manifest, files: manifest.files.map(file => ({ ...file, size: 101 * 1024 * 1024 })) },
  ];
  for (const value of invalid) {
    worker.network.set(`${origin}/offline-manifest.json`, async () => Response.json(value));
    assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.type, 'ERROR', JSON.stringify(value));
    assert.equal((await worker.caches.keys()).length, 0);
  }
  worker.setPack('one');
  const mismatch = await worker.command({ type: 'DOWNLOAD', expectedBuildId: digest('another build') });
  assert.match(mismatch.at(-1)?.message ?? '', /changed/);
  assert.equal((await worker.caches.keys()).length, 0);
});

test('HTTP errors, redirects, excessive bodies and quota failures never publish readiness', async () => {
  for (const kind of ['http', 'redirect', 'oversize', 'hash', 'quota']) {
    const worker = harness();
    const { contents } = worker.setPack('one');
    if (kind === 'quota') {
      const original = worker.caches.open.bind(worker.caches);
      worker.caches.open = async name => {
        const cache = await original(name);
        cache.put = async () => { throw new Error('Quota exceeded'); };
        return cache;
      };
    } else {
      worker.network.set(`${origin}/`, async () => {
        if (kind === 'http') return new Response('not found', { status: 404 });
        if (kind === 'redirect') { const response = new Response(contents.get('/index.html')); Object.defineProperty(response, 'redirected', { value: true }); return response; }
        if (kind === 'hash') return new Response('x'.repeat(contents.get('/index.html')!.length));
        return new Response('x'.repeat(1000));
      });
    }
    assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.type, 'ERROR', kind);
    assert.equal((await worker.status()).state, 'incomplete', kind);
  }
});

test('non-root assets retain exact-path redirect and integrity rejection', async () => {
  for (const kind of ['redirect', 'hash']) {
    const worker = harness();
    const { contents } = worker.setPack('strict');
    worker.network.set(`${origin}/assets/strict.js`, async () => {
      if (kind === 'hash') return new Response('x'.repeat(contents.get('/assets/strict.js')!.length));
      const response = new Response(contents.get('/assets/strict.js'));
      Object.defineProperty(response, 'redirected', { value: true });
      return response;
    });
    assert.equal((await worker.command({ type: 'DOWNLOAD' })).at(-1)?.type, 'ERROR', kind);
    assert.equal(worker.requests.includes(`${origin}/assets/strict.js`), true, kind);
    assert.equal((await worker.status()).state, 'incomplete', kind);
  }
});

test('mutating commands serialize; status during staging is incomplete and removal affects owned assets only', async () => {
  const worker = harness();
  worker.setPack('one');
  const unrelated = await worker.caches.open('another-app-cache');
  await unrelated.put('/private', new Response('retained'));
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  worker.network.set(`${origin}/`, async () => { await gate; return new Response('<html>one</html>'); });
  let downloading = false;
  const started = new Promise<void>(resolve => {
    void worker.command({ type: 'DOWNLOAD' }, reply => { if (reply.type === 'PROGRESS' && !downloading) { downloading = true; resolve(); } });
  });
  await started;
  assert.equal((await worker.status()).state, 'incomplete');
  const removing = worker.command({ type: 'REMOVE' });
  assert.equal((await worker.caches.keys()).some(name => name.startsWith(prefix)), true);
  release();
  assert.equal((await removing).at(-1)?.status?.state, 'empty');
  assert.deepEqual(await worker.caches.keys(), ['another-app-cache']);
  assert.equal(await (await unrelated.match('/private'))!.text(), 'retained');
});

test('API/editor/cross-origin/non-GET and query requests bypass worker; online document wins', async () => {
  const worker = harness();
  worker.setPack('one');
  await worker.command({ type: 'DOWNLOAD' });
  for (const path of ['/api/catalogue', '/editor/lessons', '/health', '/lessons', '/lessons/example', '/published-lessons', '/published-lessons/example', 'https://elsewhere.test/x', '/assets/one.js?x=1', '/smartlingo-sw.js']) {
    assert.equal(await worker.fetchAsset(path), undefined, path);
  }
  assert.equal(await worker.fetchAsset('/assets/one.js', { method: 'POST' }), undefined);
  worker.network.set(`${origin}/`, async () => new Response('online document'));
  assert.equal(await (await worker.fetchAsset('/', { mode: 'navigate' }))!.text(), 'online document');
  assert.equal((await worker.command({ type: 'NO_SUCH_COMMAND' })).at(-1)?.type, 'ERROR');
});

test('Web Locks serialize downloads and removal across worker generations', async () => {
  let queue: Promise<unknown> = Promise.resolve();
  const names: string[] = [];
  const locks: MutationLocks = {
    request(name, options, run) {
      names.push(name);
      assert.equal(options.mode, 'exclusive');
      const next = queue.then(run);
      queue = next.catch(() => {});
      return next;
    },
  };
  const caches = new MemoryCaches();
  const oldWorker = harness({ caches, locks });
  const newWorker = harness({ caches, locks });
  oldWorker.setPack('one');
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  oldWorker.network.set(`${origin}/`, async () => { await gate; return new Response('<html>one</html>'); });
  let started!: () => void;
  const staging = new Promise<void>(resolve => { started = resolve; });
  const download = oldWorker.command({ type: 'DOWNLOAD' }, reply => { if (reply.type === 'PROGRESS') started(); });
  await staging;
  let removed = false;
  const remove = newWorker.command({ type: 'REMOVE' }).then(result => { removed = true; return result; });
  // Let the second worker enter its lock request while the first worker is blocked.
  await new Promise<void>(resolve => setImmediate(resolve));
  assert.equal(removed, false);
  assert.equal((await newWorker.status()).state, 'incomplete');
  release();
  assert.equal((await download).at(-1)?.status?.state, 'ready');
  assert.equal((await remove).at(-1)?.status?.state, 'empty');
  assert.deepEqual(await caches.keys(), []);
  assert.equal(names.length, 2);
  assert.equal(names[0], names[1]);
});

test('stalled document fetch aborts at deadline and uses saved index including navigation query', async () => {
  const clock = fakeWorkerTimers();
  const worker = harness({ timers: clock.timers });
  worker.setPack('one');
  await worker.command({ type: 'DOWNLOAD' });
  assert.equal(clock.pending.size, 0);
  let rejectLate!: (reason: Error) => void;
  worker.network.set(`${origin}/?screen=profile`, () => new Promise<Response>((resolve, reject) => { rejectLate = reject; }));
  const pending = worker.fetchAsset('/?screen=profile', { mode: 'navigate' });
  assert.equal(clock.pending.size, 1);
  clock.expire(3000);
  assert.match(await (await pending)!.text(), /one/);
  assert.equal(worker.signals.at(-1)?.aborted, true);
  assert.equal(clock.pending.size, 0);
  // A late rejected fetch remains handled by the deadline race.
  rejectLate(new Error('Late network failure after timeout'));
  await new Promise<void>(resolve => setImmediate(resolve));
  assert.equal(await worker.fetchAsset('/assets/one.js?screen=profile'), undefined);
});

test('document deadline preserves failures without saved copy and clears timer on online success or HTTP fallback', async () => {
  const clock = fakeWorkerTimers();
  const worker = harness({ timers: clock.timers });
  worker.network.set(`${origin}/`, () => new Promise<Response>(() => {}));
  const failed = assert.rejects(worker.fetchAsset('/', { mode: 'navigate' }), /document request timed out/);
  clock.expire(3000);
  await failed;
  assert.equal(clock.pending.size, 0);
  worker.network.set(`${origin}/`, async () => new Response('online'));
  assert.equal(await (await worker.fetchAsset('/', { mode: 'navigate' }))!.text(), 'online');
  assert.equal(clock.pending.size, 0);
  worker.network.set(`${origin}/`, async () => new Response('server error', { status: 503 }));
  assert.equal((await worker.fetchAsset('/', { mode: 'navigate' }))!.status, 503);
  worker.setPack('one');
  await worker.command({ type: 'DOWNLOAD' });
  assert.match(await (await worker.fetchAsset('/', { mode: 'navigate' }))!.text(), /one/);
  assert.equal(clock.pending.size, 0);
});
