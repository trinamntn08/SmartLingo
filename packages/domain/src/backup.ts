import { z } from 'zod';
import { lessonSchema } from './content';
import { learningEventSchema, notebookEntrySchema } from './learning';
import { reviewEventSchema } from './review-schema';
import { courseEventSchema } from './course';

export const maximumBackupBytes = 5_000_000;
const commonFields = {
  format: z.literal('smartlingo-learning-backup'),
  createdAt: z.string().datetime({ offset: true }),
  events: z.array(learningEventSchema).max(20000),
  notebook: z.array(notebookEntrySchema).max(5000),
  publishedLessons: z.array(lessonSchema).max(200),
};
const legacyBackupSchema = z.object({ ...commonFields, version: z.literal(1) });
const version2BackupSchema = z.object({ ...commonFields, version: z.literal(2), reviewEvents: z.array(reviewEventSchema).max(20000) });
const currentBackupSchema = z.object({
  ...commonFields, version: z.literal(4), reviewEvents: z.array(reviewEventSchema).max(20000),
  courseEvents: z.array(courseEventSchema).max(20000),
}).superRefine((backup, context) => {
  for (const name of ['events', 'notebook', 'publishedLessons', 'reviewEvents', 'courseEvents'] as const) {
    const ids = backup[name].map(item => item.id);
    if (new Set(ids).size !== ids.length) context.addIssue({ code: 'custom', message: `Duplicate IDs in ${name}` });
  }
  if (backup.publishedLessons.some(lesson => lesson.status !== 'published')) {
    context.addIssue({ code: 'custom', message: 'Only cached published lessons belong in a learner backup' });
  }
});
export const learningBackupSchema = z.preprocess(input => {
  if (typeof input !== 'object' || input === null || !('version' in input)) return input;
  if (input.version === 1) return { ...legacyBackupSchema.parse(input), version: 4, reviewEvents: [], courseEvents: [] };
  if (input.version === 2) return { ...version2BackupSchema.parse(input), version: 4, courseEvents: [] };
  // Version 4 prevents older apps silently discarding Japanese language/readings.
  if (input.version === 3) return { ...input, version: 4 };
  return input;
}, currentBackupSchema);
export type LearningBackup = z.infer<typeof learningBackupSchema>;
export type RestoreReport = { eventsAdded: number; eventsKept: number; notesAdded: number; notesKept: number; lessonsUpdated: number; lessonsKept: number; reviewsAdded: number; reviewsKept: number; courseEventsAdded: number; courseEventsKept: number };

export function parseBackupText(text: string): LearningBackup {
  if (text.length > maximumBackupBytes || new TextEncoder().encode(text).byteLength > maximumBackupBytes) throw new Error('Backup files must be 5 MB or smaller.');
  try {
    const input: unknown = JSON.parse(text);
    return learningBackupSchema.parse(input);
  }
  catch { throw new Error('This is not a supported SmartLingo learning backup. No data was changed.'); }
}

export function serializeBackup(backup: LearningBackup): string {
  const text = JSON.stringify(learningBackupSchema.parse(backup), null, 2);
  if (new TextEncoder().encode(text).byteLength > maximumBackupBytes) throw new Error('This backup exceeds the current 5 MB limit. Your browser data was kept.');
  return text;
}
