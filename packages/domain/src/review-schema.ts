import { z } from 'zod';
import type { NotebookEntry } from './learning';

const dateFormatters = new Map<string, Intl.DateTimeFormat>();
function dateFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = dateFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
    if (dateFormatters.size >= 32) dateFormatters.delete(dateFormatters.keys().next().value!);
    dateFormatters.set(timeZone, formatter);
  }
  return formatter;
}

export function localStudyDate(instant: string, timeZone: string): string {
  const parts = dateFormatter(timeZone).formatToParts(new Date(instant));
  const value = (type: string) => parts.find(part => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export const reviewEventSchema = z.object({
  id: z.string().uuid(), notebookId: z.string().min(1).max(160),
  entryUpdatedAt: z.string().datetime({ offset: true }),
  skill: z.literal('recognition'), source: z.literal('manual'), algorithmVersion: z.literal(1),
  rating: z.enum(['again', 'helped', 'remembered']),
  occurredAt: z.string().datetime({ offset: true }), studyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeZone: z.string().min(1).max(100),
}).superRefine((event, context) => {
  try {
    if (localStudyDate(event.occurredAt, event.timeZone) !== event.studyDate) throw new Error('Study date mismatch');
  } catch { context.addIssue({ code: 'custom', message: 'Review study date must match its instant and valid timezone.' }); }
});
export type ReviewEvent = z.infer<typeof reviewEventSchema>;
export type ReviewState = { notebookId: string; step: number; dueDate: string; lastRating?: ReviewEvent['rating']; independentDays: number };

/** Edits start fresh recognition practice without deleting the previous note revision's ratings. */
export function currentReviewEvents(notebook: readonly NotebookEntry[], events: readonly ReviewEvent[]): ReviewEvent[] {
  const revisions = new Map(notebook.map(entry => [entry.id, entry.updatedAt]));
  return events.filter(event => revisions.get(event.notebookId) === event.entryUpdatedAt);
}
