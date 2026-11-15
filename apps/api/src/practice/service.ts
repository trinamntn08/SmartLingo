import { createHash, randomUUID } from 'node:crypto';
import { practiceReplySchema, practiceTranscriptionResponseSchema, type PracticeAudioMime, type PracticeContext, type PracticeReply, type PracticeSession, type PracticeStatus, type PracticeTranscriptionRequest, type PracticeTranscriptionResponse, type PracticeTurnRequest, type PracticeTurnResponse, type PracticeUsage } from '@smartlingo/domain';

export interface PracticeMessage { role: 'user' | 'assistant'; text: string }
export interface PracticeProvider {
  respond(input: { context: PracticeContext; history: readonly PracticeMessage[]; text: string; englishHelp: boolean; signal: AbortSignal }): Promise<{ reply: unknown; inputTokens: number; outputTokens: number }>;
}
export interface PracticeTranscriber {
  transcribe(input: { audio: Uint8Array; mimeType: PracticeAudioMime; signal: AbortSignal }): Promise<{ text: unknown }>;
}
export class PracticeError extends Error {
  constructor(public readonly statusCode: number, message: string, public readonly terminal = false) { super(message); }
}
type AttemptResponse = PracticeTurnResponse | PracticeTranscriptionResponse;
type Attempt = { fingerprint: string; response?: AttemptResponse; error?: PracticeError };
type Session = { context: PracticeContext; expires: number; timer: NodeJS.Timeout; history: PracticeMessage[]; turns: number; attempts: Map<string, Attempt> };
export interface PracticeOptions { provider?: PracticeProvider; transcriber?: PracticeTranscriber; dailyLimit?: number; timeoutMs?: number; now?: () => number }

/** Ephemeral transcripts and request tombstones; no database or provider-specific state. */
export class PracticeService {
  private readonly sessions = new Map<string, Session>();
  private active?: { sessionId: string; controller: AbortController };
  private day = '';
  private usedToday = 0;
  private inputTokens = 0;
  private outputTokens = 0;
  private closed = false;
  private readonly now: () => number;
  private readonly dailyLimit: number;
  constructor(private readonly options: PracticeOptions = {}) {
    this.now = options.now ?? Date.now;
    this.dailyLimit = options.dailyLimit ?? 40;
    if (!Number.isInteger(this.dailyLimit) || this.dailyLimit < 1 || this.dailyLimit > 200) throw new Error('Practice daily limit must be from 1 to 200');
    if (options.timeoutMs !== undefined && (!Number.isFinite(options.timeoutMs) || options.timeoutMs < 1 || options.timeoutMs > 30_000)) throw new Error('Invalid practice timeout');
  }
  private sweep(): void {
    const day = new Date(this.now()).toISOString().slice(0, 10);
    if (day !== this.day) { this.day = day; this.usedToday = 0; this.inputTokens = 0; this.outputTokens = 0; }
    for (const [id, session] of this.sessions) if (session.expires <= this.now()) this.stop(id);
  }
  private usage(): PracticeUsage {
    return { usedToday: this.usedToday, dailyLimit: this.dailyLimit, inputTokens: this.inputTokens, outputTokens: this.outputTokens };
  }
  status(): PracticeStatus { this.sweep(); return { available: !!this.options.provider && !this.closed, transcriptionAvailable: !!this.options.provider && !!this.options.transcriber && !this.closed, maxTurns: 8, usage: this.usage() }; }
  private requireProvider(): PracticeProvider {
    if (!this.options.provider || this.closed) throw new PracticeError(503, 'AI practice is unavailable. Ordinary lessons remain available.');
    return this.options.provider;
  }
  create(context: PracticeContext): PracticeSession {
    this.sweep(); this.requireProvider();
    if (this.sessions.size >= 16) throw new PracticeError(429, 'Too many practice sessions. Stop a session or wait for it to expire.');
    const sessionId = randomUUID(), expires = this.now() + 30 * 60_000;
    // Delete idle transcripts too: expiry does not depend on a later browser request.
    // This module only runs on Node; the workspace also includes browser timer globals.
    const timer = setTimeout(() => this.stop(sessionId), 30 * 60_000) as unknown as NodeJS.Timeout;
    timer.unref();
    this.sessions.set(sessionId, { context, expires, timer, history: [], turns: 0, attempts: new Map() });
    return { sessionId, maxTurns: 8, expiresAt: new Date(expires).toISOString() };
  }
  stop(sessionId: string): void {
    if (this.active?.sessionId === sessionId) this.active.controller.abort();
    const session = this.sessions.get(sessionId);
    if (session) { clearTimeout(session.timer); session.history.length = 0; session.attempts.clear(); this.sessions.delete(sessionId); }
  }
  close(): void { this.closed = true; this.active?.controller.abort(); for (const id of this.sessions.keys()) this.stop(id); }
  async turn(request: PracticeTurnRequest, signal?: AbortSignal): Promise<PracticeTurnResponse> {
    const provider = this.requireProvider();
    return this.execute(request, JSON.stringify(['turn', request.text, request.englishHelp]), async (session, providerSignal) => {
      const result = await provider.respond({ context: session.context, history: session.history.map(message => ({ ...message })), text: request.text, englishHelp: request.englishHelp, signal: providerSignal });
      return () => {
        if (![result.inputTokens, result.outputTokens].every(value => Number.isSafeInteger(value) && value >= 0)) throw new Error('Invalid usage');
        this.inputTokens += result.inputTokens; this.outputTokens += result.outputTokens;
        const parsed = practiceReplySchema.safeParse(result.reply);
        if (!parsed.success) throw new Error('Invalid reply');
        const reply: PracticeReply = parsed.data;
        session.turns++;
        session.history.push({ role: 'user', text: request.text }, { role: 'assistant', text: JSON.stringify(reply) });
        return { requestId: request.requestId, reply, usedTurns: session.turns, maxTurns: 8, usage: this.usage() };
      };
    }, signal, true);
  }
  async transcribe(request: PracticeTranscriptionRequest, signal?: AbortSignal): Promise<PracticeTranscriptionResponse> {
    this.requireProvider();
    const transcriber = this.options.transcriber;
    if (!transcriber) throw new PracticeError(503, 'Audio transcription is unavailable. Type your message instead.');
    const audio = Buffer.from(request.audioBase64, 'base64');
    if (audio.length < 1 || audio.length > 2_097_152 || audio.toString('base64') !== request.audioBase64) throw new PracticeError(400, 'Invalid audio encoding or clip size.');
    const fingerprint = JSON.stringify(['transcribe', request.mimeType, createHash('sha256').update(audio).digest('hex')]);
    try {
      return await this.execute(request, fingerprint, async (_session, providerSignal) => {
        const result = await transcriber.transcribe({ audio, mimeType: request.mimeType, signal: providerSignal });
        return () => practiceTranscriptionResponseSchema.parse({ requestId: request.requestId, text: result.text, usage: this.usage() });
      }, signal);
    } finally { audio.fill(0); }
  }
  /** Reserve once, run with cancellation, then commit validated results while session is live. */
  private async execute<T extends AttemptResponse>(request: { sessionId: string; requestId: string }, fingerprint: string,
    run: (session: Session, signal: AbortSignal) => Promise<() => T>, signal?: AbortSignal, conversationTurn = false): Promise<T> {
    this.sweep();
    const session = this.sessions.get(request.sessionId);
    if (!session) throw new PracticeError(404, 'Practice session expired or stopped. Start a new session.');
    const previous = session.attempts.get(request.requestId);
    if (previous) {
      if (previous.fingerprint !== fingerprint) throw new PracticeError(409, 'Request ID was already used with different text.');
      // Fingerprints include the operation kind, so only this operation can replay here.
      if (previous.response) return previous.response as T;
      throw previous.error ?? new PracticeError(409, 'This request is already in progress.');
    }
    if ((conversationTurn && session.turns >= 8) || session.attempts.size >= 16) throw new PracticeError(429, 'Session limit reached. Start a new session.');
    if (this.usedToday >= this.dailyLimit) throw new PracticeError(429, 'Daily AI practice allowance reached. Try again tomorrow.');
    if (this.active) throw new PracticeError(409, 'Another AI reply is in progress. Wait or stop it first.');
    if (signal?.aborted) throw new PracticeError(409, 'Practice request cancelled.');
    const attempt: Attempt = { fingerprint };
    session.attempts.set(request.requestId, attempt);
    this.usedToday++;
    const controller = new AbortController();
    this.active = { sessionId: request.sessionId, controller };
    let timedOut = false;
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.options.timeoutMs ?? 30_000);
    const aborted = new Promise<never>((_resolve, reject) => controller.signal.addEventListener('abort', () => reject(new PracticeError(timedOut ? 504 : 409, timedOut ? 'AI reply timed out. Send a new request to try again.' : 'Practice request cancelled.', true)), { once: true }));
    try {
      const commit = await Promise.race([run(session, controller.signal), aborted]);
      if (controller.signal.aborted || !this.sessions.has(request.sessionId)) throw new PracticeError(409, 'Practice request cancelled.', true);
      const response = commit();
      attempt.response = response;
      return response;
    } catch (error) {
      attempt.error = error instanceof PracticeError ? error : new PracticeError(502, 'AI reply is unavailable. Send a new request to try again.', true);
      throw attempt.error;
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); this.active = undefined; }
  }
}
