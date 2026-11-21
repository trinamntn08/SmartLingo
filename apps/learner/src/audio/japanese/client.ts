import { audioRates, type AudioRate } from '../preferences';

export const japaneseVoice = 'Shikoku Metan';
export const japaneseCredit = 'VOICEVOX:四国めたん';
export const maxJapaneseBytes = 5 * 1024 * 1024;
export const japaneseHelp = 'Start the local API and Japanese voice engine (VOICEVOX), then retry. Saved Japanese audio may still work offline. You can continue with text.';
export interface JapaneseStatus { available: boolean; voice: typeof japaneseVoice; credit: typeof japaneseCredit }
export interface JapaneseSpeechClient {
  status(signal?: AbortSignal): Promise<JapaneseStatus>;
  play(text: string, rate: AudioRate, signal?: AbortSignal): Promise<Uint8Array>;
}

export function validateJapaneseInput(text: string, rate: AudioRate) {
  if (!text.trim() || text.length > 500 || !audioRates.includes(rate)) throw new Error('Japanese audio needs 1–500 characters and a supported speaking speed. Text study remains available.');
}

/** Check the container before either caching or handing bytes to the browser decoder. */
export function validateJapaneseWav(bytes: Uint8Array): Uint8Array {
  const label = (offset: number, length: number) => new TextDecoder().decode(bytes.subarray(offset, offset + length));
  if (bytes.length < 44 || bytes.length > maxJapaneseBytes || label(0, 4) !== 'RIFF' || label(8, 4) !== 'WAVE') throw new Error('The Japanese voice returned invalid WAV audio.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(4, true) + 8 !== bytes.length) throw new Error('The Japanese WAV audio is incomplete.');
  let offset = 12;
  let format = false;
  let data = false;
  while (offset + 8 <= bytes.length) {
    const size = view.getUint32(offset + 4, true);
    if (offset + 8 + size > bytes.length) throw new Error('The Japanese WAV audio is incomplete.');
    if (label(offset, 4) === 'fmt ') {
      if (size < 16 || view.getUint16(offset + 8, true) !== 1 || ![1, 2].includes(view.getUint16(offset + 10, true)) || view.getUint32(offset + 12, true) < 8000 || view.getUint32(offset + 12, true) > 192000 || ![8, 16, 24, 32].includes(view.getUint16(offset + 22, true))) throw new Error('The Japanese WAV format is unsupported.');
      format = true;
    }
    if (label(offset, 4) === 'data' && size > 0) data = true;
    offset += 8 + size + (size % 2);
  }
  if (!format || !data || offset !== bytes.length) throw new Error('The Japanese WAV audio is incomplete.');
  return bytes;
}

export async function readBoundedAudio(response: Response, maximum = maxJapaneseBytes): Promise<Uint8Array> {
  if (!response.body || Number(response.headers.get('Content-Length')) > maximum) throw new Error('Japanese audio response is empty or too large.');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.length;
      if (length > maximum) throw new Error('Japanese audio response is too large.');
      chunks.push(chunk.value);
    }
  } finally { void reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export function createJapaneseSpeechClient(fetcher: typeof fetch = (...args) => globalThis.fetch(...args)): JapaneseSpeechClient {
  async function request<T>(path: string, body: unknown, signal: AbortSignal | undefined, read: (response: Response) => Promise<T>): Promise<T> {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
    const timer = setTimeout(cancel, 35000);
    try {
      if (controller.signal.aborted) throw new Error('Cancelled');
      const response = await fetcher(`http://127.0.0.1:3001/speech/japanese/${path}`, {
        method: body ? 'POST' : 'GET', credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: body ? { 'Content-Type': 'application/json', 'X-SmartLingo-Speech': '1' } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) throw new Error('Local engine unavailable');
      const result = await read(response);
      if (controller.signal.aborted) throw new Error('Cancelled');
      return result;
    } catch { throw new Error(signal?.aborted ? 'Japanese audio cancelled.' : japaneseHelp); }
    finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
  }
  return {
    status: signal => request('status', undefined, signal, async response => {
      const value: unknown = JSON.parse(new TextDecoder().decode(await readBoundedAudio(response, 4096)));
      if (!value || typeof value !== 'object' || !('available' in value) || typeof value.available !== 'boolean' || !('voice' in value) || value.voice !== japaneseVoice || !('credit' in value) || value.credit !== japaneseCredit) throw new Error('Invalid status');
      return { available: value.available, voice: japaneseVoice, credit: japaneseCredit };
    }),
    play(text, rate, signal) {
      validateJapaneseInput(text, rate);
      return request('play', { text, rate }, signal, async response => {
        if (response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'audio/wav') throw new Error('Invalid audio type');
        return validateJapaneseWav(await readBoundedAudio(response));
      });
    },
  };
}
