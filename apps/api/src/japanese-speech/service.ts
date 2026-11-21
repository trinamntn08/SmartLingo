import { synthesizeJapanese, voiceAvailable } from './provider';

export interface JapaneseSpeechOptions { fetcher?: typeof fetch; timeoutMs?: number; statusTimeoutMs?: number }
export interface JapaneseSpeechInput { text: string; rate: 0.7 | 0.85 | 1 }
function validatedTimeout(value: number, limit: number): number {
  if (!Number.isInteger(value) || value < 1 || value > limit) throw new Error('Invalid Japanese speech timeout');
  return value;
}
export class JapaneseSpeechError extends Error {
  constructor(message: string, readonly statusCode: number) { super(message); }
}
export function parseJapaneseSpeechInput(value: unknown): JapaneseSpeechInput | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).length !== 2 || typeof input.text !== 'string' || typeof input.rate !== 'number' || ![0.7, 0.85, 1].includes(input.rate)) return undefined;
  const text = input.text.trim();
  if (!text.length || text.length > 500 || /[\u0000-\u001f\u007f]/.test(text)) return undefined;
  return { text, rate: input.rate as JapaneseSpeechInput['rate'] };
}

/** Ephemeral free-engine cache: no learner storage, credentials, or paid adapters. */
export class JapaneseSpeechService {
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;
  private readonly statusTimeoutMs: number;
  private readonly controllers = new Set<AbortController>();
  private readonly cache = new Map<string, Uint8Array>();
  private cacheBytes = 0;
  private busy = false;
  private closed = false;

  constructor(options: JapaneseSpeechOptions = {}) {
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = validatedTimeout(options.timeoutMs ?? 25_000, 25_000);
    this.statusTimeoutMs = validatedTimeout(options.statusTimeoutMs ?? 1500, 3000);
  }

  async status() {
    let available = false;
    if (!this.closed) {
      try { available = await this.operation(this.statusTimeoutMs, signal => voiceAvailable(this.fetcher, signal)); } catch { /* Local engine may be stopped. */ }
    }
    return { available, voice: 'Shikoku Metan' as const, credit: 'VOICEVOX:四国めたん' as const };
  }

  async play(value: unknown, signal?: AbortSignal): Promise<Uint8Array> {
    const input = parseJapaneseSpeechInput(value);
    if (!input) throw new JapaneseSpeechError('Invalid Japanese speech request', 400);
    if (this.closed || signal?.aborted) throw new JapaneseSpeechError('Japanese speech was cancelled.', 503);
    const key = JSON.stringify([2, input.text, input.rate]), cached = this.cache.get(key);
    if (cached) { this.cache.delete(key); this.cache.set(key, cached); return cached.slice(); }
    if (this.busy) throw new JapaneseSpeechError('Another Japanese speech request is in progress. Try again shortly.', 429);
    this.busy = true;
    try {
      const audio = await this.operation(this.timeoutMs, operationSignal => synthesizeJapanese(this.fetcher, input.text, input.rate, operationSignal), signal);
      while (this.cache.size >= 100 || this.cacheBytes + audio.byteLength > 32 * 1024 * 1024) {
        const oldest = this.cache.keys().next().value!;
        this.cacheBytes -= this.cache.get(oldest)!.byteLength; this.cache.delete(oldest);
      }
      this.cache.set(key, audio); this.cacheBytes += audio.byteLength;
      return audio.slice();
    } finally { this.busy = false; }
  }

  private async operation<T>(timeoutMs: number, run: (signal: AbortSignal) => Promise<T>, external?: AbortSignal): Promise<T> {
    const controller = new AbortController();
    this.controllers.add(controller);
    let timedOut = false;
    const disconnect = () => controller.abort();
    external?.addEventListener('abort', disconnect, { once: true });
    if (external?.aborted) controller.abort();
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    let abortListener: () => void = () => {};
    const aborted = new Promise<never>((_resolve, reject) => {
      abortListener = () => reject(new JapaneseSpeechError(timedOut ? 'Japanese speech timed out. Check the local VOICEVOX engine and try again.' : 'Japanese speech was cancelled.', timedOut ? 504 : 503));
      controller.signal.addEventListener('abort', abortListener, { once: true });
      if (controller.signal.aborted) abortListener();
    });
    try {
      return await Promise.race([aborted, run(controller.signal)]);
    } catch (error) {
      if (controller.signal.aborted) { if (timedOut) throw new JapaneseSpeechError('Japanese speech timed out. Check the local VOICEVOX engine and try again.', 504); throw new JapaneseSpeechError('Japanese speech was cancelled.', 503); }
      if (error instanceof JapaneseSpeechError) throw error;
      throw new JapaneseSpeechError('Japanese speech is unavailable. Start the local VOICEVOX engine and try again.', 503);
    } finally {
      clearTimeout(timer); external?.removeEventListener('abort', disconnect); controller.signal.removeEventListener('abort', abortListener); this.controllers.delete(controller);
    }
  }

  close(): void {
    this.closed = true;
    for (const controller of this.controllers) controller.abort();
    this.cache.clear(); this.cacheBytes = 0;
  }
}
