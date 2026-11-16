import { z } from 'zod';

export const speechVoices = ['fr-FR-DeniseNeural', 'fr-FR-HenriNeural'] as const;
export const speechInputSchema = z.object({
  text: z.string().transform(text => text.normalize('NFC').trim()).pipe(z.string().min(1).max(500)
    .refine(text => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/u.test(text), 'Use valid plain text')),
  voice: z.enum(speechVoices), pace: z.enum(['gentle', 'normal']),
}).strict();
export type SpeechInput = z.infer<typeof speechInputSchema>;
export const speechRequestSchema = z.object({ requestId: z.string().uuid(), input: speechInputSchema }).strict();
export type SpeechRequest = z.infer<typeof speechRequestSchema>;
export const speechUsageSchema = z.object({
  usedToday: z.number().int().nonnegative(), dailyLimit: z.number().int().min(1).max(200),
}).strict();
export const speechStatusSchema = z.object({ available: z.boolean(), usage: speechUsageSchema }).strict();
export type SpeechStatus = z.infer<typeof speechStatusSchema>;
export const speechAssetSchema = z.object({
  key: z.string().regex(/^[a-f0-9]{64}$/), input: speechInputSchema,
  mimeType: z.literal('audio/mpeg'), byteLength: z.number().int().min(10).max(524288),
  sha256: z.string().regex(/^[a-f0-9]{64}$/), audioBase64: z.string().min(16).max(699052),
}).strict();
export type SpeechAsset = z.infer<typeof speechAssetSchema>;
export const speechResponseSchema = z.object({
  requestId: z.string().uuid(), asset: speechAssetSchema, cacheHit: z.boolean(), usage: speechUsageSchema,
}).strict();
export type SpeechResponse = z.infer<typeof speechResponseSchema>;

/** Fixed wire identity: text changes invalidate audio; revision-only changes can reuse it. */
export function speechIdentity(input: SpeechInput): string {
  const valid = speechInputSchema.parse(input);
  return JSON.stringify(['speech-v1', 'azure', 'fr-FR', 'audio-24khz-48kbitrate-mono-mp3', valid.voice, valid.pace, valid.text]);
}

export async function speechKey(input: SpeechInput): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(speechIdentity(input)));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
