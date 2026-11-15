import {
  practiceContextSchema, practiceSessionSchema, practiceStatusSchema,
  practiceTurnRequestSchema, practiceTurnResponseSchema, practiceSessionIdSchema,
  type PracticeContext, type PracticeSession, type PracticeStatus,
  type PracticeTurnRequest, type PracticeTurnResponse,
  practiceTranscriptionRequestSchema, practiceTranscriptionResponseSchema,
  type PracticeTranscriptionRequest, type PracticeTranscriptionResponse,
} from '@smartlingo/domain';

export class PracticeApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly terminal = false) { super(message); this.name = 'PracticeApiError'; }
}

export interface PracticeApi {
  status(signal?: AbortSignal): Promise<PracticeStatus>;
  start(context: PracticeContext, signal?: AbortSignal): Promise<PracticeSession>;
  turn(command: PracticeTurnRequest, signal?: AbortSignal): Promise<PracticeTurnResponse>;
  transcribe(command: PracticeTranscriptionRequest, signal?: AbortSignal): Promise<PracticeTranscriptionResponse>;
  stop(sessionId: string): Promise<void>;
}

function failureMessage(status: number): string {
  if (status === 502 || status === 504) return 'The previous AI attempt ended without a usable reply. Press Send message to make a new attempt; it may use additional API credits.';
  if (status === 503) return 'AI practice is unavailable. Configure OpenAI on the local API server, then check again. Ordinary lessons remain available.';
  if (status === 429) return 'The practice limit has been reached. Stop this conversation or try again later. Failed attempts can count toward the daily limit.';
  if (status === 404 || status === 410) return 'This conversation has expired. Stop and start a new conversation.';
  if (status === 409) return 'Another turn is still processing or this request changed. Wait, then retry the unchanged message, or stop and start again.';
  if (status === 403) return 'Local practice access was refused. Open SmartLingo at localhost:8081 or localhost:8082.';
  return 'The AI reply could not be completed. Retry the same message explicitly, or stop. Nothing is sent automatically.';
}

async function request(path: string, body?: unknown, signal?: AbortSignal): Promise<unknown> {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(cancel, 35000);
  try {
    if (controller.signal.aborted) throw new Error('Cancelled');
    const response = await fetch(`http://127.0.0.1:3001/ai/practice/${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-SmartLingo-Practice': '1' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'omit', redirect: 'error', cache: 'no-store', signal: controller.signal,
    });
    if (!response.ok) {
      // Only this fixed protocol code is trusted. Never display server/provider text.
      const failure: unknown = await response.json().catch(() => null);
      const terminal = typeof failure === 'object' && failure !== null && 'code' in failure && failure.code === 'attempt_ended';
      const message = terminal || response.status === 502 || response.status === 504
        ? `The previous AI attempt ended without a usable reply. Press ${path === 'transcribe' ? 'Transcribe recording' : 'Send message'} to make a new attempt; it may use additional API credits.`
        : path === 'transcribe' && response.status === 503 ? 'Transcription is not configured on the local API server. Configure its OpenAI transcription model, restart, and check availability. You can keep typing instead.'
          : failureMessage(response.status);
      throw new PracticeApiError(message, response.status, terminal);
    }
    const result: unknown = await response.json();
    if (controller.signal.aborted) throw new Error('Cancelled');
    return result;
  } catch (error) {
    if (error instanceof PracticeApiError) throw error;
    throw new PracticeApiError(signal?.aborted ? 'Practice request cancelled.' : 'The local practice server is offline or timed out. Run npm run dev:api, then retry explicitly. Ordinary lessons remain available.');
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', cancel);
  }
}

function validate<T>(parse: () => T): T {
  try { return parse(); } catch { throw new PracticeApiError('The practice server returned an invalid reply. Stop and start again, or retry explicitly.'); }
}

export const practiceApi: PracticeApi = {
  async status(signal) { const result = await request('status', undefined, signal); return validate(() => practiceStatusSchema.parse(result)); },
  async start(context, signal) {
    const result = await request('sessions', { context: practiceContextSchema.parse(context) }, signal);
    return validate(() => practiceSessionSchema.parse(result));
  },
  async turn(command, signal) {
    const result = await request('turns', practiceTurnRequestSchema.parse(command), signal);
    const reply = validate(() => practiceTurnResponseSchema.parse(result));
    if (reply.requestId !== command.requestId || reply.usedTurns > reply.maxTurns) throw new PracticeApiError('The practice server returned a mismatched reply. Stop and start again.');
    return reply;
  },
  async stop(sessionId) { await request('stop', practiceSessionIdSchema.parse({ sessionId })); },
  async transcribe(command, signal) {
    const result = await request('transcribe', practiceTranscriptionRequestSchema.parse(command), signal);
    const response = validate(() => practiceTranscriptionResponseSchema.parse(result));
    if (response.requestId !== command.requestId) throw new PracticeApiError('The server returned a mismatched transcription. Discard the recording and try again, or type instead.');
    return response;
  },
};
