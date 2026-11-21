import { maxJapaneseAudioBytes, validPcmWave } from './audio';

const engine = 'http://127.0.0.1:50021';
const maxJsonBytes = 256 * 1024;

async function boundedBytes(response: Response, limit: number): Promise<Uint8Array> {
  const length = response.headers.get('content-length');
  if (!response.ok || !response.body || (length !== null && (!/^\d+$/.test(length) || Number(length) > limit))) {
    await response.body?.cancel();
    throw new Error('Unusable engine response');
  }
  const reader = response.body.getReader(), chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      total += next.value.byteLength;
      if (total > limit) { await reader.cancel(); throw new Error('Engine response exceeds limit'); }
      chunks.push(next.value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}

async function boundedJson(response: Response): Promise<unknown> {
  if (response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    await response.body?.cancel(); throw new Error('Invalid engine JSON');
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await boundedBytes(response, maxJsonBytes))) as unknown;
}

export async function voiceAvailable(fetcher: typeof fetch, signal: AbortSignal): Promise<boolean> {
  const speakers = await boundedJson(await fetcher(`${engine}/speakers`, { signal, redirect: 'error' }));
  return Array.isArray(speakers) && speakers.some((speaker: unknown) => {
    if (!speaker || typeof speaker !== 'object' || !('name' in speaker) || speaker.name !== '四国めたん' || !('styles' in speaker) || !Array.isArray(speaker.styles)) return false;
    return speaker.styles.some((style: unknown) => !!style && typeof style === 'object' && 'id' in style && style.id === 2);
  });
}

export async function synthesizeJapanese(fetcher: typeof fetch, text: string, rate: number, signal: AbortSignal): Promise<Uint8Array> {
  const params = new URLSearchParams({ speaker: '2', text });
  const query = await boundedJson(await fetcher(`${engine}/audio_query?${params}`, { method: 'POST', signal, redirect: 'error' }));
  if (!query || typeof query !== 'object' || Array.isArray(query) || !('accent_phrases' in query) || !Array.isArray(query.accent_phrases) || !('speedScale' in query) || typeof query.speedScale !== 'number') throw new Error('Invalid audio query');
  signal.throwIfAborted();
  const response = await fetcher(`${engine}/synthesis?speaker=2`, {
    method: 'POST', signal, redirect: 'error', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...query, speedScale: rate }),
  });
  const type = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (type !== 'audio/wav' && type !== 'audio/x-wav' && type !== 'audio/wave') { await response.body?.cancel(); throw new Error('Invalid audio type'); }
  const audio = await boundedBytes(response, maxJapaneseAudioBytes);
  if (!validPcmWave(audio)) throw new Error('Invalid PCM wave');
  return audio;
}
