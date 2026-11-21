import type { AudioRate } from '../preferences';
import type { AudioCache } from '../generated/store';
import { maxJapaneseBytes, readBoundedAudio, validateJapaneseWav, validateJapaneseInput } from './client';

export const japaneseCacheName = 'smartlingo-japanese-speech-v1';
const prefix = 'https://smartlingo.invalid/japanese-speech/v1/';
const epochKey = prefix + 'epoch';
const maximumEntries = 100;
const maximumBytes = 32 * 1024 * 1024;
export interface JapaneseCacheEnvironment {
  supported(): boolean;
  open(): Promise<AudioCache>;
  lock<T>(operation: () => Promise<T>): Promise<T>;
}
const browserCache: JapaneseCacheEnvironment = {
  supported: () => { try { return !!globalThis.caches && !!globalThis.crypto?.subtle && !!globalThis.navigator?.locks; } catch { return false; } },
  open: () => globalThis.caches.open(japaneseCacheName),
  lock: operation => globalThis.navigator.locks.request(japaneseCacheName + '-mutation', { mode: 'exclusive' }, operation),
};
export async function japaneseClipKey(text: string, rate: AudioRate): Promise<string> {
  validateJapaneseInput(text, rate);
  const bytes = new TextEncoder().encode(JSON.stringify(['ja-JP', 'voicevox-shikoku-metan-normal-v1', text, rate]));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return prefix + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Separate best-effort cache. Storage failures never prevent a requested free playback. */
export class JapaneseAudioStore {
  private generation = 0;
  constructor(private readonly environment: JapaneseCacheEnvironment = browserCache) {}
  supported() { return this.environment.supported(); }
  async begin(): Promise<string | undefined> {
    if (!this.supported()) return undefined;
    try {
      return await this.environment.lock(async () => {
        const cache = await this.environment.open();
        const existing = await cache.match(epochKey);
        if (existing) {
          const epoch = await existing.text();
          if (/^[a-f0-9-]{36}$/.test(epoch)) return epoch;
        }
        const epoch = globalThis.crypto.randomUUID();
        await cache.put(epochKey, new Response(epoch));
        return epoch;
      });
    } catch { return undefined; }
  }
  async get(text: string, rate: AudioRate): Promise<Uint8Array | undefined> {
    if (!this.supported()) return undefined;
    try {
      const key = await japaneseClipKey(text, rate);
      return await this.environment.lock(async () => {
        const cache = await this.environment.open();
        const response = await cache.match(key);
        if (!response) return undefined;
        try { return validateJapaneseWav(await readBoundedAudio(response)); }
        catch { await cache.delete(key); return undefined; }
      });
    } catch { return undefined; }
  }
  async put(text: string, rate: AudioRate, bytes: Uint8Array, epoch: string | undefined, signal?: AbortSignal): Promise<void> {
    if (!epoch || !this.supported()) return;
    const generation = this.generation;
    try {
      validateJapaneseWav(bytes);
      const key = await japaneseClipKey(text, rate);
      await this.environment.lock(async () => {
        if (signal?.aborted || generation !== this.generation) return;
        const cache = await this.environment.open();
        if (await (await cache.match(epochKey))?.text() !== epoch) return;
        const entries = (await cache.keys()).filter(entry => entry.url !== epochKey && entry.url !== key);
        let total = bytes.length;
        const sizes = new Map<string, number>();
        for (const entry of entries) {
          const size = Number((await cache.match(entry.url))?.headers.get('Content-Length'));
          const boundedSize = Number.isFinite(size) && size > 0 && size <= maxJapaneseBytes ? size : maxJapaneseBytes;
          sizes.set(entry.url, boundedSize); total += boundedSize;
        }
        while (entries.length >= maximumEntries || total > maximumBytes) {
          const oldest = entries.shift();
          if (!oldest) return;
          total -= sizes.get(oldest.url)!;
          await cache.delete(oldest.url);
        }
        if (signal?.aborted || generation !== this.generation) return;
        await cache.delete(key);
        await cache.put(key, new Response(new Uint8Array(bytes).buffer, { headers: { 'Content-Type': 'audio/wav', 'Content-Length': String(bytes.length) } }));
      });
    } catch { /* Full/private/unsupported storage must not break free audio. */ }
  }
  async clear(): Promise<void> {
    this.generation++;
    if (!this.supported()) throw new Error('Japanese audio storage is unavailable in this browser.');
    await this.environment.lock(async () => {
      const cache = await this.environment.open();
      // Rotate first: even a partially failed removal cannot allow old requests to save again.
      await cache.put(epochKey, new Response(globalThis.crypto.randomUUID()));
      for (const entry of await cache.keys()) if (entry.url !== epochKey) await cache.delete(entry.url);
    });
  }
}
