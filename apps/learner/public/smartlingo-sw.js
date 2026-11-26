/* Explicit, integrity-checked web assets only. Learner IndexedDB is never accessed here. */
'use strict';

importScripts('/learner-document.js');

const CACHE_PREFIX = 'smartlingo-assets-v1-';
const RECORD_PATH = '/__smartlingo_offline_complete__';
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 1024 * 1024;
const MAX_FILES = 2000;
const DOWNLOAD_BATCH_SIZE = 6;
const CACHE_CHECK_BATCH_SIZE = 32;
const REQUEST_TIMEOUT_MS = 30000;
const DOCUMENT_TIMEOUT_MS = 3000;
let mutations = Promise.resolve();

function reservedPath(path) {
  return /^\/(?:api|editor|health|lessons|published-lessons)(?:\/|$)/i.test(path)
    || path === '/smartlingo-sw.js' || path === '/offline-manifest.json'
    || path.startsWith('/__smartlingo_offline_');
}

function validateManifest(value) {
  if (!value || value.formatVersion !== 1 || !/^[a-f0-9]{64}$/.test(value.buildId)
    || !Number.isSafeInteger(value.totalBytes) || value.totalBytes < 1 || value.totalBytes > MAX_TOTAL_BYTES
    || !Array.isArray(value.files) || value.files.length < 1 || value.files.length > MAX_FILES) {
    throw new Error('The offline manifest is invalid or exceeds the download limit.');
  }
  let total = 0;
  const urls = new Set();
  const files = value.files.map(file => {
    if (!file || typeof file.url !== 'string' || !file.url.startsWith('/') || file.url.startsWith('//')
      || !Number.isSafeInteger(file.size) || file.size < 0 || file.size > MAX_FILE_BYTES
      || typeof file.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256)) {
      throw new Error('The offline manifest contains an invalid file.');
    }
    const url = new URL(file.url, self.location.origin);
    let decodedPath;
    try { decodedPath = decodeURIComponent(url.pathname); } catch { throw new Error('Invalid offline file URL.'); }
    if (url.origin !== self.location.origin || url.pathname !== file.url || url.search || url.hash
      || decodedPath !== url.pathname || reservedPath(url.pathname) || urls.has(file.url)) {
      throw new Error('The offline manifest contains an unsafe or duplicate URL.');
    }
    urls.add(file.url);
    total += file.size;
    return { url: file.url, size: file.size, sha256: file.sha256 };
  });
  if (total !== value.totalBytes || !urls.has('/index.html')) {
    throw new Error('The offline manifest has an incorrect size or no app document.');
  }
  return { formatVersion: 1, buildId: value.buildId, totalBytes: total, files };
}

async function readBounded(response, limit) {
  // Content-Length can describe compressed transport bytes; bound decoded bytes instead.
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > limit) throw new Error('An offline response exceeds its declared size.');
      chunks.push(next.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

async function fetchBytes(path, limit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(new URL(path, self.location.origin).href, {
      cache: 'no-store', redirect: 'error', credentials: 'same-origin', signal: controller.signal,
    });
    if (response.status !== 200 || response.redirected || response.type === 'opaque') {
      throw new Error('An offline file could not be downloaded (HTTP 200 required).');
    }
    const bytes = await readBounded(response, limit);
    return { bytes, headers: response.headers };
  } finally {
    clearTimeout(timer);
  }
}

async function sha256(bytes) {
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function allFilesCached(cache, files) {
  for (let start = 0; start < files.length; start += CACHE_CHECK_BATCH_SIZE) {
    const entries = await Promise.all(files.slice(start, start + CACHE_CHECK_BATCH_SIZE).map(file => cache.match(file.url)));
    if (entries.some(entry => !entry)) return false;
  }
  return true;
}

async function completeRecord(cache) {
  const response = await cache.match(RECORD_PATH);
  if (!response) return null;
  let record;
  try {
    record = JSON.parse(new TextDecoder().decode(await readBounded(response, MAX_MANIFEST_BYTES + 1024)));
    record.manifest = validateManifest(record.manifest);
    if (typeof record.downloadedAt !== 'string' || !Number.isFinite(Date.parse(record.downloadedAt))) return null;
  } catch { return null; }
  // The browser can evict individual entries after a successful download.
  return await allFilesCached(cache, record.manifest.files) ? record : null;
}

async function inspectCaches() {
  const names = (await caches.keys()).filter(name => name.startsWith(CACHE_PREFIX));
  const complete = [];
  const incomplete = [];
  for (const name of names) {
    // CacheStorage.match does not recreate a cache concurrently deleted by REMOVE.
    const cache = { match: path => caches.match(path, { cacheName: name }) };
    const record = await completeRecord(cache);
    if (record) complete.push({ name, cache, ...record });
    else incomplete.push(name);
  }
  // Stable sort keeps the most recently created cache first when timestamps tie.
  complete.reverse().sort((a, b) => Date.parse(b.downloadedAt) - Date.parse(a.downloadedAt));
  const newest = complete[0];
  return {
    complete, incomplete,
    status: newest ? {
      state: 'ready', bytes: complete.reduce((bytes, entry) => bytes + entry.manifest.totalBytes, 0),
      buildId: newest.manifest.buildId, downloadedAt: newest.downloadedAt,
    } : { state: incomplete.length ? 'incomplete' : 'empty', bytes: 0 },
  };
}

async function stageFile(cache, file) {
  const downloaded = await fetchBytes(file.url, file.size);
  if (downloaded.bytes.byteLength !== file.size || await sha256(downloaded.bytes) !== file.sha256) {
    throw new Error('An offline file failed its integrity check. Retry the download.');
  }
  // Preserve content/security headers, excluding transport details for decoded bytes.
  const headers = new Headers(downloaded.headers);
  for (const header of ['content-encoding', 'content-length', 'transfer-encoding']) headers.delete(header);
  await cache.put(file.url, new Response(downloaded.bytes, { status: 200, headers }));
}

async function download(expectedBuildId, progress) {
  if (expectedBuildId !== undefined && (typeof expectedBuildId !== 'string' || !/^[a-f0-9]{64}$/.test(expectedBuildId))) {
    throw new Error('The requested offline build is invalid.');
  }
  const fetched = await fetchBytes('/offline-manifest.json', MAX_MANIFEST_BYTES);
  let manifest;
  try { manifest = validateManifest(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(fetched.bytes))); }
  catch { throw new Error('The offline manifest is invalid. Refresh the app and retry.'); }
  if (expectedBuildId !== undefined && manifest.buildId !== expectedBuildId) {
    throw new Error('The app changed before downloading. Refresh the download information and retry.');
  }
  const previous = await inspectCaches();
  for (const name of previous.incomplete) await caches.delete(name);
  if (previous.complete.some(entry => entry.manifest.buildId === manifest.buildId)) return previous.status;

  const name = `${CACHE_PREFIX}${manifest.buildId}-${crypto.randomUUID()}`;
  const cache = await caches.open(name);
  let bytes = 0;
  let completed = 0;
  progress({ completed, total: manifest.files.length, bytes });
  for (let start = 0; start < manifest.files.length; start += DOWNLOAD_BATCH_SIZE) {
    const batch = manifest.files.slice(start, start + DOWNLOAD_BATCH_SIZE);
    // Wait for every staged write before reporting failure. A retry must never race
    // leftover writes into a cache it has already cleaned up.
    const results = await Promise.allSettled(batch.map(file => stageFile(cache, file)));
    const failed = results.find(result => result.status === 'rejected');
    if (failed) throw failed.reason;
    completed += batch.length;
    bytes += batch.reduce((total, file) => total + file.size, 0);
    progress({ completed, total: manifest.files.length, bytes });
  }
  if (!await allFilesCached(cache, manifest.files)) throw new Error('Browser storage lost an offline file. Free space and retry.');
  // This is the only publication point. Failed/terminated attempts remain incomplete.
  await cache.put(RECORD_PATH, new Response(JSON.stringify({ manifest, downloadedAt: new Date().toISOString() }), {
    headers: { 'content-type': 'application/json' },
  }));
  const result = await inspectCaches();
  if (!result.complete.some(entry => entry.name === name)) throw new Error('The offline download could not be retained.');
  return result.status;
}

async function removeAssets() {
  for (const name of await caches.keys()) {
    if (name.startsWith(CACHE_PREFIX)) await caches.delete(name);
  }
  return (await inspectCaches()).status;
}

function mutateExclusively(run) {
  // Origin-scoped locks also coordinate overlapping old/new worker generations.
  // Browsers without Web Locks retain serialization within this worker only.
  if (typeof navigator !== 'undefined' && navigator.locks && typeof navigator.locks.request === 'function') {
    return navigator.locks.request(`${CACHE_PREFIX}mutation`, { mode: 'exclusive' }, run);
  }
  return run();
}

self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('message', event => {
  const port = event.ports && event.ports[0];
  if (!port) return;
  const command = event.data;
  const send = value => port.postMessage(value);
  const run = async () => {
    if (!command || !['STATUS', 'DOWNLOAD', 'REMOVE'].includes(command.type)) throw new Error('Unknown offline command.');
    if (command.type === 'STATUS') return (await inspectCaches()).status;
    if (command.type === 'REMOVE') return removeAssets();
    return download(command.expectedBuildId, progress => send({ type: 'PROGRESS', progress }));
  };
  const task = command && command.type === 'STATUS' ? run() : mutations.then(() => mutateExclusively(run));
  if (!command || command.type !== 'STATUS') mutations = task.catch(() => {});
  event.waitUntil(task.then(status => send({ type: 'RESULT', status })).catch(error => {
    send({ type: 'ERROR', message: error instanceof Error ? error.message : 'Offline assets could not be saved. Retry.' });
  }));
});

async function fetchDocument(request) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error('The app document request timed out.'));
      controller.abort();
    }, DOCUMENT_TIMEOUT_MS);
  });
  try {
    // Race as well as abort: an unresponsive fetch implementation must not block offline fallback.
    return await Promise.race([fetch(request, { signal: controller.signal }), deadline]);
  } finally {
    clearTimeout(timer);
  }
}

async function serveAsset(request, url, document) {
  let networkResponse;
  let networkError;
  if (document) {
    try {
      networkResponse = await fetchDocument(request);
      if (networkResponse.ok) return networkResponse;
    } catch (error) { networkError = error; }
  }
  const saved = await inspectCaches();
  const nested = document && url.pathname !== '/' && url.pathname !== '/index.html';
  for (const entry of saved.complete) {
    if (nested && !entry.manifest.files.some(file => file.url === '/learner-document.js')) continue;
    const path = document ? '/index.html' : url.pathname;
    if (entry.manifest.files.some(file => file.url === path)) {
      const response = await entry.cache.match(path);
      if (response) return response;
    }
  }
  if (nested && saved.complete.length) {
    return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><title>Update offline SmartLingo</title><p>This link needs a newer offline copy.</p><p><a href="/">Open SmartLingo</a> and update the offline copy in Profile when you are online.</p></html>', {
      status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  if (networkResponse) return networkResponse;
  if (networkError) throw networkError;
  return fetch(request);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const document = request.mode === 'navigate' && isLearnerDocumentPath(url.pathname);
  if (request.method !== 'GET' || url.origin !== self.location.origin || (url.search && !document) || url.hash || (!document && reservedPath(url.pathname))) return;
  event.respondWith(serveAsset(request, url, document));
});
