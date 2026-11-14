import { z } from 'zod';
import { lessonSchema } from './content';

export const revisionRequestSchema = z.object({ expectedRevision: z.number().int().positive() });
export const draftSaveSchema = revisionRequestSchema.extend({ lesson: lessonSchema }).refine(
  command => command.lesson.status === 'draft' && command.lesson.revision === command.expectedRevision,
  { message: 'Save a draft based on the expected revision.' },
);
export const publishRequestSchema = revisionRequestSchema.extend({
  previewToken: z.string().uuid(), ownerReviewed: z.literal(true),
});
export const lessonResponseSchema = z.object({ lesson: lessonSchema });
export const lessonListResponseSchema = z.object({ lessons: z.array(lessonSchema) });
export const previewResponseSchema = lessonResponseSchema.extend({ previewToken: z.string().uuid() });
export type DraftSave = z.infer<typeof draftSaveSchema>;
export type PublishRequest = z.infer<typeof publishRequestSchema>;
export type LessonPreview = z.infer<typeof previewResponseSchema>;
