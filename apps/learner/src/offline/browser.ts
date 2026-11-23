import type { DownloadProgress, OfflineAssetManager, OfflineInfo, OfflineManifest, OfflineStatus } from './contracts';

const workerPath = '/smartlingo-sw.js';
const empty: OfflineStatus = { state: 'empty', bytes: 0 };
const hash = /^[a-f0-9]{64}$/;
const maxPackBytes = 100 * 1024 * 1024;

/** Validate the display estimate as well as the worker's independent integrity checks. */
export function parseOfflineManifest(input: unknown): OfflineManifest {
  const manifest = input as OfflineManifest | null;
  if (!manifest || manifest.formatVersion !== 1 || !hash.test(manifest.buildId) ||
    !Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 2000) throw new Error('The offline download information is invalid. Refresh the page and try again.');
  const paths = new Set<string>();
  let bytes = 0;
  for (const file of manifest.files) {
    if (!file || typeof file.url !== 'string' || !/^\/(?!\/)[^?#\\]+$/.test(file.url) ||
      file.url.split('/').some(segment => segment === '.' || segment === '..') ||
      paths.has(file.url) || !Number.isSafeInteger(file.size) || file.size < 0 || file.size > 32 * 1024 * 1024 || !hash.test(file.sha256)) throw new Error('The offline file list is invalid. Refresh the page and try again.');
    paths.add(file.url); bytes += file.size;
  }
  if (!paths.has('/index.html') || bytes !== manifest.totalBytes || bytes > maxPackBytes) throw new Error('The offline download size is invalid. Refresh the page and try again.');
  return manifest;
}

function supported(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext &&
    typeof navigator !== 'undefined' && 'serviceWorker' in navigator &&
    typeof navigator.locks?.request === 'function' && typeof MessageChannel !== 'undefined';
}

function statusFrom(input: unknown): OfflineStatus {
  const status = input as OfflineStatus | null;
  if (!status || !['empty', 'ready', 'incomplete'].includes(status.state) || !Number.isSafeInteger(status.bytes) || status.bytes < 0 ||
    (status.state === 'ready' && (typeof status.buildId !== 'string' || !hash.test(status.buildId) || typeof status.downloadedAt !== 'string' || !Number.isFinite(Date.parse(status.downloadedAt))))) throw new Error('Offline status could not be confirmed. Refresh the status and try again.');
  return status;
}

function command(worker: ServiceWorker, type: 'STATUS' | 'DOWNLOAD' | 'REMOVE', expectedBuildId?: string,
  onProgress?: (progress: DownloadProgress) => void): Promise<OfflineStatus> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => finish(new Error('The offline operation timed out. Refresh the status before retrying.')), type === 'DOWNLOAD' ? 120000 : 15000);
    function finish(error?: Error, status?: OfflineStatus) {
      clearTimeout(timer); channel.port1.close(); channel.port2.close();
      if (error) reject(error); else resolve(status!);
    }
    channel.port1.onmessage = event => {
      const message = event.data;
      try {
        if (message?.type === 'PROGRESS') {
          const progress = message.progress as DownloadProgress;
          if (progress && [progress.completed, progress.total, progress.bytes].every(Number.isSafeInteger) && progress.completed >= 0 && progress.completed <= progress.total && progress.bytes >= 0) onProgress?.(progress);
        } else if (message?.type === 'RESULT') finish(undefined, statusFrom(message.status));
        else if (message?.type === 'ERROR') finish(new Error(typeof message.message === 'string' ? message.message : 'The offline operation failed. You can retry.'));
      } catch (error) { finish(error instanceof Error ? error : new Error('Offline status could not be read.')); }
    };
    channel.port1.onmessageerror = () => finish(new Error('The offline operation could not be read. Refresh the status and retry.'));
    try { worker.postMessage({ type, expectedBuildId }, [channel.port2]); }
    catch { finish(new Error('The offline copy could not be reached. Refresh the page and retry.')); }
  });
}

async function ownedRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  const registration = await navigator.serviceWorker.getRegistration('/');
  if (!registration) return undefined;
  const workers = [registration.active, registration.waiting, registration.installing].filter((worker): worker is ServiceWorker => !!worker);
  if (workers.some(worker => new URL(worker.scriptURL).pathname !== workerPath)) throw new Error('Another app manages offline access at this address. Use SmartLingo at its own local address.');
  return registration;
}

async function activeWorker(registration: ServiceWorkerRegistration): Promise<ServiceWorker> {
  const worker = registration.installing ?? registration.waiting ?? registration.active;
  if (!worker) throw new Error('Offline access could not start. Retry the download.');
  if (worker.state === 'activated') return worker;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => finish(new Error('Offline access did not start. Retry the download.')), 15000);
    function finish(error?: Error) {
      clearTimeout(timer); worker!.removeEventListener('statechange', update);
      if (error) reject(error); else resolve(worker!);
    }
    function update() {
      if (worker!.state === 'activated') finish();
      else if (worker!.state === 'redundant') finish(new Error('Offline access was replaced. Retry the download.'));
    }
    worker.addEventListener('statechange', update); update();
  });
}

async function fetchManifest(): Promise<OfflineManifest> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('/offline-manifest.json', { cache: 'no-store', credentials: 'omit', redirect: 'error', signal: controller.signal });
    if (!response.ok) throw new Error('Offline downloads are not available in this preview.');
    const text = await response.text();
    if (text.length > 1024 * 1024) throw new Error('The offline download information is too large.');
    return parseOfflineManifest(JSON.parse(text));
  } finally { clearTimeout(timer); }
}

export const offlineAssets: OfflineAssetManager = {
  async inspect(): Promise<OfflineInfo> {
    if (!supported()) return { canDownload: false, reason: 'Offline downloads need a supported browser at a secure address.', saved: empty };
    const registration = await ownedRegistration();
    const saved = registration ? await command(await activeWorker(registration), 'STATUS') : empty;
    try { return { canDownload: true, manifest: await fetchManifest(), saved }; }
    catch { return { canDownload: false, reason: saved.state === 'ready' ? 'Your saved copy is available. Connect to check for a newer download.' : 'Offline downloads are not available here right now. Open the offline-ready preview while connected, then refresh the status.', saved }; }
  },
  async download(onProgress) {
    if (!supported()) throw new Error('Offline downloads are unavailable in this browser.');
    await ownedRegistration(); // Do not replace another app's worker.
    const manifest = await fetchManifest();
    const registration = await navigator.serviceWorker.register(workerPath, { scope: '/', updateViaCache: 'none' });
    return command(await activeWorker(registration), 'DOWNLOAD', manifest.buildId, onProgress);
  },
  async remove() {
    if (!supported()) throw new Error('Offline assets cannot be managed in this browser.');
    const registration = await ownedRegistration();
    if (!registration) return empty;
    return command(await activeWorker(registration), 'REMOVE');
  },
};
