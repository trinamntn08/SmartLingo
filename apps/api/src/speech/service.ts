import { speechRequestSchema, type SpeechInput, type SpeechRequest, type SpeechResponse, type SpeechStatus } from '@smartlingo/domain';
import { identityKey, makeAsset } from './audio';
import { SpeechError } from './error';
import { SpeechStore } from './store';
export { SpeechError } from './error';

export interface SpeechProvider { synthesize(request: { input: SpeechInput; signal: AbortSignal }): Promise<Uint8Array> }
export interface SpeechOptions { provider?: SpeechProvider; databasePath?: string; dailyLimit?: number; timeoutMs?: number; now?: () => number }

/** Explicit generation only. Playback has no dependency on this service. */
export class SpeechService {
  private readonly store: SpeechStore;
  private readonly now: () => number;
  private readonly dailyLimit: number;
  private readonly timeoutMs: number;
  private active?: { requestId: string; controller: AbortController };
  private closed = false;
  private closedUsage = 0;
  constructor(private readonly options: SpeechOptions = {}) {
    this.now = options.now ?? Date.now;
    this.dailyLimit = options.dailyLimit ?? 40;
    this.timeoutMs = options.timeoutMs ?? 30_000;
    if (!Number.isInteger(this.dailyLimit) || this.dailyLimit < 1 || this.dailyLimit > 200) throw new Error('Speech daily limit must be from 1 to 200');
    if (!Number.isInteger(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > 30_000) throw new Error('Invalid speech timeout');
    this.store = new SpeechStore(options.databasePath ?? ':memory:');
  }
  status(): SpeechStatus {
    return { available: !!this.options.provider && !this.closed, usage: { usedToday: this.closed ? this.closedUsage : this.store.usedToday(this.now()), dailyLimit: this.dailyLimit } };
  }
  close(): void {
    if (this.closed) return;
    this.closedUsage = this.store.usedToday(this.now());
    this.closed = true;
    if (this.active) {
      this.active.controller.abort();
      this.store.fail(this.active.requestId, new SpeechError(409, 'Speech request cancelled. Generate again with a new request.', true));
    }
    this.store.close();
  }
  async generate(value: SpeechRequest, signal?: AbortSignal): Promise<SpeechResponse> {
    const parsed = speechRequestSchema.safeParse(value);
    if (!parsed.success) throw new SpeechError(400, 'Invalid speech request.');
    if (this.closed) throw new SpeechError(503, 'Neural speech is unavailable.');
    if (signal?.aborted) throw new SpeechError(409, 'Speech request cancelled.');
    const request = parsed.data, key = identityKey(request.input);
    const reservation = this.store.reserve(request, key, this.now(), this.timeoutMs + 5000, !!this.options.provider, this.dailyLimit);
    if (reservation.asset) return { requestId: request.requestId, asset: reservation.asset, cacheHit: reservation.cacheHit, usage: this.status().usage };
    const controller = new AbortController();
    this.active = { requestId: request.requestId, controller };
    let timedOut = false;
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.timeoutMs);
    const aborted = new Promise<never>((_resolve, reject) => controller.signal.addEventListener('abort', () => reject(new SpeechError(timedOut ? 504 : 409,
      timedOut ? 'Speech generation timed out. Generate again with a new request.' : 'Speech request cancelled. Generate again with a new request.', true)), { once: true }));
    try {
      const bytes = await Promise.race([this.options.provider!.synthesize({ input: request.input, signal: controller.signal }), aborted]);
      if (controller.signal.aborted || this.closed) throw new SpeechError(409, 'Speech request cancelled. Generate again with a new request.', true);
      const asset = makeAsset(request.input, bytes);
      this.store.complete(request, asset, this.now());
      return { requestId: request.requestId, asset, cacheHit: false, usage: this.status().usage };
    } catch (error) {
      const failure = error instanceof SpeechError ? error : new SpeechError(502, 'Speech generation failed. Generate again with a new request.', true);
      if (!this.closed) this.store.fail(request.requestId, failure);
      throw failure;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
      if (this.active?.requestId === request.requestId) this.active = undefined;
    }
  }
}
