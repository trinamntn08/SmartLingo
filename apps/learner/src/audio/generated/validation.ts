import { speechAssetSchema, speechIdentity, speechKey, type SpeechAsset, type SpeechInput } from '@smartlingo/domain';

export async function sha256(bytes: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error('Secure audio verification is unavailable in this browser.');
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new Uint8Array(bytes).buffer);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Verify untrusted audio before storage and again before every replay. */
export async function verifyAsset(value: unknown, input: SpeechInput): Promise<{ asset: SpeechAsset; bytes: Uint8Array }> {
  const asset = speechAssetSchema.parse(value);
  if (speechIdentity(asset.input) !== speechIdentity(input) || asset.key !== await speechKey(input)) throw new Error('Saved audio does not match this text and voice.');
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(asset.audioBase64)) throw new Error('Audio encoding is invalid.');
  const raw = atob(asset.audioBase64);
  if (btoa(raw) !== asset.audioBase64 || raw.length !== asset.byteLength) throw new Error('Audio size or encoding is invalid.');
  const bytes = Uint8Array.from(raw, character => character.charCodeAt(0));
  if (await sha256(bytes) !== asset.sha256) throw new Error('Audio verification failed.');
  return { asset, bytes };
}
