import type { PracticeContext, PracticeSession, PracticeStatus, PracticeTurnRequest, PracticeTurnResponse, PracticeUsage } from '@smartlingo/domain';
import { PracticeApiError, practiceApi, type PracticeApi } from './api';

export type PracticeExchange = { request: PracticeTurnRequest; response: PracticeTurnResponse };
export type ConversationState = {
  busy: boolean; error: string; notice: string; status?: PracticeStatus; session?: PracticeSession;
  exchanges: PracticeExchange[]; failed?: PracticeTurnRequest; usage?: PracticeUsage;
};
const empty = (): ConversationState => ({ busy: false, error: '', notice: '', exchanges: [] });

/** Memory-only conversation coordinator. Every paid attempt begins at send/retry. */
export class Conversation {
  private state = empty();
  private pending?: AbortController;
  private generation = 0;
  constructor(private changed: (state: ConversationState) => void, private api: PracticeApi = practiceApi,
    private uuid: () => string = () => globalThis.crypto.randomUUID()) {}
  private update(patch: Partial<ConversationState>) { this.state = { ...this.state, ...patch }; this.changed(this.state); }
  private async run(action: (signal: AbortSignal, current: () => boolean) => Promise<void>) {
    if (this.pending) return;
    const generation = this.generation;
    const controller = new AbortController(); this.pending = controller;
    this.update({ busy: true, error: '', notice: '' });
    const current = () => generation === this.generation && !controller.signal.aborted;
    try { await action(controller.signal, current); }
    catch (error) { if (current()) this.update({ error: error instanceof Error ? error.message : 'Practice is unavailable. Please retry explicitly.' }); }
    finally { if (current()) { this.pending = undefined; this.update({ busy: false }); } }
  }
  check() { return this.run(async (signal, current) => {
    const status = await this.api.status(signal);
    if (current()) this.update({ status, usage: status.usage });
  }); }
  start(context: PracticeContext) { return this.run(async (signal, current) => {
    const session = await this.api.start(context, signal);
    if (current()) this.update({ session, exchanges: [], failed: undefined });
    else void this.api.stop(session.sessionId).catch(() => {});
  }); }
  send(text: string, englishHelp: boolean) {
    if (this.pending || !this.state.session || !text.trim() || text.trim().length > 1000) return Promise.resolve();
    return this.submit({ sessionId: this.state.session.sessionId, requestId: this.uuid(), text: text.trim(), englishHelp });
  }
  retry() { return this.state.failed ? this.submit(this.state.failed) : Promise.resolve(); }
  reportUsage(usage: PracticeUsage) { if (this.state.session) this.update({ usage }); }
  private submit(command: PracticeTurnRequest) { return this.run(async (signal, current) => {
    this.update({ failed: command });
    try {
      const response = await this.api.turn(command, signal);
      if (current()) this.update({ failed: undefined, exchanges: [...this.state.exchanges, { request: command, response }], usage: response.usage });
    } catch (error) {
      // The server caches completed provider failures. Only an unknown outcome can
      // be recovered by retrying the same identity; a terminal attempt needs a new Send.
      if (current() && error instanceof PracticeApiError && (error.terminal || error.status === 502 || error.status === 504)) this.update({ failed: undefined });
      throw error;
    }
  }); }
  clear(notify = true) {
    this.generation++; this.pending?.abort(); this.pending = undefined;
    const generation = this.generation;
    const session = this.state.session;
    this.state = empty();
    if (notify) this.update({ notice: 'Conversation cleared. Saved notebook phrases remain.' });
    if (session) void this.api.stop(session.sessionId).catch(() => {
      // Leaving never retains a transcript. Server sessions also expire automatically.
      if (notify && generation === this.generation && !this.state.session) this.update({ notice: 'Conversation cleared here. The server could not confirm Stop; its temporary session will expire.' });
    });
  }
}
