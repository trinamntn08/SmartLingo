import { speechRequestSchema, speechResponseSchema, speechStatusSchema, type SpeechRequest, type SpeechResponse, type SpeechStatus } from '@smartlingo/domain';
import { verifyAsset } from './validation';

export class SpeechApiError extends Error {
  constructor(message: string, public readonly terminal = false) { super(message); this.name = 'SpeechApiError'; }
}
export interface SpeechClient {
  status(signal?: AbortSignal): Promise<SpeechStatus>;
  generate(request: SpeechRequest, signal?: AbortSignal): Promise<SpeechResponse>;
}
async function boundedJson(response: Response, limit: number): Promise<unknown> {
  if (!response.body) throw new Error('Empty response');
  const reader = response.body.getReader();
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > limit) throw new Error('Response too large');
      chunks.push(chunk.value);
    }
  } finally { void reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export function createSpeechClient(fetcher: typeof fetch = (...args) => globalThis.fetch(...args)): SpeechClient {
  async function request(path: string, command?: SpeechRequest, signal?: AbortSignal): Promise<unknown> {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(cancel, 35000);
    try {
      if (controller.signal.aborted) throw new Error('Cancelled');
      const response = await fetcher(`http://127.0.0.1:3001/speech/${path}`, {
        method: command ? 'POST' : 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: command ? { 'Content-Type': 'application/json', 'X-SmartLingo-Speech': '1' } : {},
        body: command ? JSON.stringify(command) : undefined,
      });
      const result = await boundedJson(response, response.ok && command ? 720000 : 8192);
      if (controller.signal.aborted) throw new Error('Cancelled');
      if (!response.ok) {
        const terminal = !!result && typeof result === 'object' && 'code' in result && result.code === 'attempt_ended';
        throw new SpeechApiError(terminal ? 'This attempt ended without usable audio. A new explicit generation may use credits.'
          : response.status === 503 ? 'Neural audio is unavailable. Configure Azure on the local API server, then refresh availability.'
            : response.status === 429 ? 'The speech generation limit has been reached. Try later. Failed attempts may count.'
              : response.status === 403 ? 'The local server refused this browser origin. Use the configured local learner address.'
                : 'Audio generation could not complete. Retry the same request explicitly to check its result.', terminal);
      }
      return result;
    } catch (error) {
      if (error instanceof SpeechApiError) throw error;
      throw new SpeechApiError(signal?.aborted ? 'Audio request cancelled.' : 'The local audio server is offline, timed out or returned an invalid response. Retry the same request explicitly; nothing is sent automatically.');
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
  }
  return {
    async status(signal) { return speechStatusSchema.parse(await request('status', undefined, signal)); },
    async generate(command, signal) {
      const valid = speechRequestSchema.parse(command);
      const response = speechResponseSchema.parse(await request('generate', valid, signal));
      if (signal?.aborted) throw new SpeechApiError('Audio request cancelled.');
      if (response.requestId !== valid.requestId) throw new SpeechApiError('The audio server returned a different request. No audio was saved.');
      await verifyAsset(response.asset, valid.input);
      if (signal?.aborted) throw new SpeechApiError('Audio request cancelled.');
      return response;
    },
  };
}
export const speechClient = createSpeechClient();
