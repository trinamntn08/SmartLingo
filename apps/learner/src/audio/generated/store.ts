import { speechInputSchema, speechKey, type SpeechAsset, type SpeechInput } from '@smartlingo/domain';
import { verifyAsset } from './validation';

export const generatedCacheName = 'smartlingo-generated-speech-v1';
export const generatedCacheLock = 'smartlingo-generated-speech-v1-mutation';
const prefix = 'https://smartlingo.invalid/generated-speech/v1/';
const epochUrl = prefix + 'epoch';
const maxEntries = 512;
const maxBytes = 64 * 1024 * 1024;
const maxRecordBytes = 710000;
export interface AudioCache {
  match(key: string): Promise<Response | undefined>;
  put(key: string, response: Response): Promise<void>;
  keys(): Promise<readonly { url: string }[]>;
  delete(key: string): Promise<boolean>;
}
export interface AudioCacheEnvironment {
  open(): Promise<AudioCache>;
  peek?(): Promise<AudioCache | undefined>;
  remove(): Promise<boolean>;
  lock<T>(operation: () => Promise<T>): Promise<T>;
  supported(): boolean;
}
const browserCache: AudioCacheEnvironment = {
  supported: () => { try { return !!globalThis.caches && !!globalThis.crypto?.subtle && !!globalThis.navigator?.locks; } catch { return false; } },
  open: () => globalThis.caches.open(generatedCacheName),
  peek: async () => await globalThis.caches.has(generatedCacheName) ? globalThis.caches.open(generatedCacheName) : undefined,
  remove: () => globalThis.caches.delete(generatedCacheName),
  lock: operation => globalThis.navigator.locks.request(generatedCacheLock, { mode: 'exclusive' }, operation),
};

async function readRecord(response: Response): Promise<unknown> {
  if (!response.body) throw new Error('Saved audio is empty.');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > maxRecordBytes) throw new Error('Saved audio is too large.');
      chunks.push(next.value);
    }
  } finally { void reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export class GeneratedAudioStore {
  private generation = 0;
  constructor(private readonly environment: AudioCacheEnvironment = browserCache) {}
  supported(): boolean { return this.environment.supported(); }
  private requireSupport() { if (!this.supported()) throw new Error('Saved audio needs browser CacheStorage, secure verification and Web Locks. Device speech and text remain available.'); }
  /** An epoch prevents a request started before removal from restoring audio afterwards, including from another tab. */
  async begin(): Promise<string> {
    this.requireSupport();
    return this.environment.lock(async () => {
      const cache = await this.environment.open();
      const existing = await cache.match(epochUrl);
      if (existing) {
        const epoch = await existing.text();
        if (/^[a-f0-9-]{36}$/.test(epoch)) return epoch;
        throw new Error('Saved audio metadata is damaged. Remove saved browser audio before saving again.');
      }
      const epoch = globalThis.crypto.randomUUID();
      try { await cache.put(epochUrl, new Response(epoch)); }
      catch { throw new Error('Browser audio storage could not be prepared. It may be full or unavailable. No generation request was sent.'); }
      return epoch;
    });
  }
  async get(input: SpeechInput): Promise<{ asset: SpeechAsset; bytes: Uint8Array } | undefined> {
    this.requireSupport();
    const key = await speechKey(input);
    return this.environment.lock(async () => {
      // Looking up a saved clip must not create browser storage on an ordinary page visit.
      const cache = this.environment.peek ? await this.environment.peek() : await this.environment.open();
      const response = await cache?.match(prefix + key);
      if (!response) return undefined;
      try { return await verifyAsset(await readRecord(response), input); }
      catch { throw new Error('Saved audio is damaged or no longer matches. Device speech is used when available. Remove saved browser audio or explicitly save this phrase again.'); }
    });
  }
  async put(value: SpeechAsset, input: SpeechInput, signal?: AbortSignal, epoch?: string): Promise<void> {
    this.requireSupport();
    const generation = this.generation;
    const { asset } = await verifyAsset(value, input);
    await this.environment.lock(async () => {
      if (signal?.aborted || generation !== this.generation) throw new Error('Audio save cancelled.');
      const cache = await this.environment.open();
      if (epoch && await (await cache.match(epochUrl))?.text() !== epoch) throw new Error('Audio save cancelled because saved browser audio was removed.');
      const keys = await cache.keys();
      const target = prefix + asset.key;
      const prior = await cache.match(target);
      if (prior) {
        try {
          await verifyAsset(await readRecord(prior), input);
          if (signal?.aborted) throw new Error('Audio save cancelled.');
          // An exact verified clip already satisfies this save. Preserve it even if the new attempt is cancelled.
          return;
        } catch (error) {
          if (signal?.aborted) throw error;
          // Only a damaged record is replaced below.
        }
      }
      let size = asset.byteLength;
      let count = 1;
      for (const key of keys) {
        if (key.url === epochUrl) continue;
        if (key.url === target) continue;
        if (!key.url.startsWith(prefix)) throw new Error('Audio cache contains unexpected data. Remove saved browser audio before saving again.');
        const response = await cache.match(key.url);
        if (!response) continue;
        const raw = await readRecord(response);
        const parsed = speechInputSchema.safeParse((raw as SpeechAsset)?.input);
        if (!parsed.success) throw new Error('Saved audio is damaged. Remove saved browser audio before saving again.');
        const { asset: existing } = await verifyAsset(raw, parsed.data);
        if (key.url !== prefix + existing.key) throw new Error('Saved audio identity is damaged.');
        size += existing.byteLength; count++;
      }
      if (size > maxBytes || count > maxEntries) throw new Error('Saved audio is full (64 MiB or 512 clips). Remove saved browser audio to make space.');
      if (signal?.aborted || generation !== this.generation) throw new Error('Audio save cancelled.');
      try { await cache.put(target, new Response(JSON.stringify(asset), { headers: { 'Content-Type': 'application/json' } })); }
      catch { throw new Error('Audio could not be saved. Browser storage may be full or unavailable. Nothing is marked saved.'); }
      const saved = await cache.match(target);
      if (!saved) throw new Error('Audio save could not be confirmed.');
      await verifyAsset(await readRecord(saved), input);
      if (signal?.aborted) { await cache.delete(target); throw new Error('Audio save cancelled.'); }
    });
  }
  async remove(): Promise<void> {
    this.requireSupport(); this.generation++;
    await this.environment.lock(async () => {
      await this.environment.remove();
      const cache = await this.environment.open();
      await cache.put(epochUrl, new Response(globalThis.crypto.randomUUID()));
    });
  }
}
export const generatedAudioStore = new GeneratedAudioStore();
