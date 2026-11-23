import { speechInputSchema, type SpeechInput } from '@smartlingo/domain';
import { maxAudioBytes } from './audio';
import type { SpeechOptions, SpeechProvider } from './service';

// Public Azure regional REST hosts only; configuration cannot redirect credentials.
const regions = new Set(['australiaeast', 'australiasoutheast', 'brazilsouth', 'canadacentral', 'canadaeast', 'centralindia', 'centralus', 'eastasia', 'eastus', 'eastus2', 'francecentral', 'germanywestcentral', 'italynorth', 'japaneast', 'japanwest', 'koreacentral', 'northcentralus', 'northeurope', 'norwayeast', 'qatarcentral', 'southafricanorth', 'southcentralus', 'southeastasia', 'swedencentral', 'switzerlandnorth', 'switzerlandwest', 'uaenorth', 'uksouth', 'ukwest', 'westcentralus', 'westeurope', 'westus', 'westus2', 'westus3']);
function validatedRegion(value: string): string {
  if (!regions.has(value)) throw new Error('AZURE_SPEECH_REGION must be a supported public Azure speech region');
  return value;
}
function escapeXml(value: string): string { return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]!); }
export function speechSsml(value: SpeechInput): string {
  const input = speechInputSchema.parse(value);
  // XML 1.0 cannot represent these control characters, even in escaped form.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/.test(input.text)) throw new Error('Unsupported speech text');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="fr-FR"><voice name="${input.voice}"><prosody rate="${input.pace === 'gentle' ? '-10%' : '0%'}">${escapeXml(input.text)}</prosody></voice></speak>`;
}
async function readBoundedAudio(response: Response): Promise<Uint8Array> {
  const length = response.headers.get('content-length');
  if (!response.ok || response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'audio/mpeg' ||
      (length !== null && (!/^\d+$/.test(length) || Number(length) > maxAudioBytes)) || !response.body) {
    await response.body?.cancel();
    throw new Error('Speech provider returned no usable audio');
  }
  const reader = response.body.getReader(), chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      total += next.value.length;
      if (total > maxAudioBytes) { await reader.cancel(); throw new Error('Speech provider audio exceeds limit'); }
      chunks.push(next.value);
    }
  } finally { reader.releaseLock(); }
  const audio = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { audio.set(chunk, offset); offset += chunk.length; }
  return audio;
}
/** No redirects or retries: one explicit generation corresponds to one reserved paid attempt. */
export function createAzureSpeechProvider(apiKey: string, region: string, fetcher: typeof fetch = fetch): SpeechProvider {
  validatedRegion(region);
  if (!apiKey.trim() || /[\r\n]/.test(apiKey)) throw new Error('Invalid Azure speech credential');
  return { async synthesize({ input, signal }) {
    const response = await fetcher(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST', redirect: 'error', signal,
      headers: { 'Ocp-Apim-Subscription-Key': apiKey, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'SmartLingo-local' },
      body: speechSsml(input),
    });
    return readBoundedAudio(response);
  } };
}
export interface SpeechEnvironment { AZURE_SPEECH_KEY?: string; AZURE_SPEECH_REGION?: string; SMARTLINGO_SPEECH_DAILY_LIMIT?: string }
export function readSpeechOptions(environment: SpeechEnvironment): SpeechOptions {
  const raw = environment.SMARTLINGO_SPEECH_DAILY_LIMIT ?? '40';
  if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 200) throw new Error('SMARTLINGO_SPEECH_DAILY_LIMIT must be from 1 to 200');
  const key = environment.AZURE_SPEECH_KEY?.trim(), region = environment.AZURE_SPEECH_REGION?.trim();
  if (region) validatedRegion(region);
  return { dailyLimit: Number(raw), provider: key && region ? createAzureSpeechProvider(key, region) : undefined };
}
