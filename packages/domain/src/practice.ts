import { z } from 'zod';

export const practiceContextSchema = z.object({
  topic: z.string().trim().min(1).max(150),
  role: z.string().trim().min(1).max(150),
  level: z.enum(['foundation', 'A1', 'A2']),
}).strict();
export const practiceSessionRequestSchema = z.object({ context: practiceContextSchema }).strict();
export const practiceSessionIdSchema = z.object({ sessionId: z.string().uuid() }).strict();
export const practiceTurnRequestSchema = z.object({
  sessionId: z.string().uuid(), requestId: z.string().uuid(),
  text: z.string().trim().min(1).max(1000), englishHelp: z.boolean(),
}).strict();
export const practiceReplySchema = z.object({
  french: z.string().trim().min(1).max(1000),
  english: z.string().trim().min(1).max(1500),
  feedback: z.string().trim().max(1000),
  phrase: z.object({ target: z.string().trim().min(1).max(300), meaning: z.string().trim().min(1).max(500) }).strict().nullable(),
}).strict();
export const practiceUsageSchema = z.object({
  usedToday: z.number().int().nonnegative(), dailyLimit: z.number().int().positive(),
  inputTokens: z.number().int().nonnegative(), outputTokens: z.number().int().nonnegative(),
}).strict();
export const practiceStatusSchema = z.object({
  available: z.boolean(), transcriptionAvailable: z.boolean().default(false),
  maxTurns: z.number().int().positive(), usage: practiceUsageSchema,
}).strict();
export const practiceSessionSchema = z.object({
  sessionId: z.string().uuid(), maxTurns: z.number().int().positive(), expiresAt: z.string().datetime(),
}).strict();
export const practiceTurnResponseSchema = z.object({
  requestId: z.string().uuid(), reply: practiceReplySchema,
  usedTurns: z.number().int().nonnegative(), maxTurns: z.number().int().positive(), usage: practiceUsageSchema,
}).strict();
export type PracticeContext = z.infer<typeof practiceContextSchema>;
export type PracticeReply = z.infer<typeof practiceReplySchema>;
export type PracticeTurnRequest = z.infer<typeof practiceTurnRequestSchema>;
export type PracticeTurnResponse = z.infer<typeof practiceTurnResponseSchema>;
export type PracticeSession = z.infer<typeof practiceSessionSchema>;
export type PracticeStatus = z.infer<typeof practiceStatusSchema>;
export type PracticeUsage = z.infer<typeof practiceUsageSchema>;

export const practiceAudioMimeSchema = z.enum(['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav']);
export const practiceTranscriptionRequestSchema = z.object({
  sessionId: z.string().uuid(), requestId: z.string().uuid(),
  mimeType: practiceAudioMimeSchema,
  // Two MiB decoded; server also verifies canonical encoding and actual byte count.
  audioBase64: z.string().min(4).max(2_796_204),
}).strict();
export const practiceTranscriptionResponseSchema = z.object({
  requestId: z.string().uuid(), text: z.string().trim().min(1).max(1000), usage: practiceUsageSchema,
}).strict();
export type PracticeAudioMime = z.infer<typeof practiceAudioMimeSchema>;
export type PracticeTranscriptionRequest = z.infer<typeof practiceTranscriptionRequestSchema>;
export type PracticeTranscriptionResponse = z.infer<typeof practiceTranscriptionResponseSchema>;
