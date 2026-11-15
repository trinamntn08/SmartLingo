import { createHash } from 'node:crypto';
import { speechIdentity, type SpeechAsset, type SpeechInput } from '@smartlingo/domain';

export const maxAudioBytes = 524_288;
export function identityKey(input: SpeechInput): string { return createHash('sha256').update(speechIdentity(input)).digest('hex'); }
export function audioHash(bytes: Uint8Array): string { return createHash('sha256').update(bytes).digest('hex'); }
/** Bounded MP3 signature validation; decoding remains the playback adapter's responsibility. */
export function validMp3(bytes: Uint8Array): boolean {
  return bytes.length >= 10 && bytes.length <= maxAudioBytes &&
    ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
     (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0 && (bytes[1] & 0x18) !== 0x08 && (bytes[2] & 0xf0) !== 0xf0 && (bytes[2] & 0xf0) !== 0));
}
export function makeAsset(input: SpeechInput, bytes: Uint8Array): SpeechAsset {
  if (!validMp3(bytes)) throw new Error('Invalid speech audio');
  return { key: identityKey(input), input, mimeType: 'audio/mpeg', byteLength: bytes.length, sha256: audioHash(bytes), audioBase64: Buffer.from(bytes).toString('base64') };
}
