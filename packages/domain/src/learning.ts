import { z } from 'zod';
import type { Lesson } from './content';
import type { LearningBackup, RestoreReport } from './backup';
import type { ReviewEvent } from './review-schema';
import type { CourseEvent } from './course';

export const learningEventSchema = z.object({
  id: z.string().uuid(), lessonId: z.string().min(1), revision: z.number().int().positive(),
  itemId: z.string().min(1), activity: z.enum(['vocabulary', 'picture', 'sentence', 'completion']),
  result: z.enum(['viewed', 'correct', 'almost', 'incorrect', 'completed']),
  hints: z.number().int().min(0), occurredAt: z.string().datetime({ offset: true }),
  automaticCompletion: z.literal(true).optional(),
});
export type LearningEvent = z.infer<typeof learningEventSchema>;
export const notebookEntrySchema = z.object({
  id: z.string().min(1).max(160), sourceEntryId: z.string().min(1),
  // Missing language preserves legacy French notes without rewriting their payloads.
  language: z.enum(['fr-FR', 'ja-JP']).optional(),
  reading: z.string().trim().min(1).max(300).optional(),
  exampleReading: z.string().trim().min(1).max(1000).optional(),
  target: z.string().trim().min(1).max(300), meaning: z.string().trim().min(1).max(500),
  example: z.string().trim().max(1000), updatedAt: z.string().datetime({ offset: true }),
});
export type NotebookEntry = z.infer<typeof notebookEntrySchema>;
export interface LearningRepository {
  listEvents(): Promise<LearningEvent[]>;
  recordEvent(event: LearningEvent): Promise<void>;
  recordEvents(events: readonly LearningEvent[]): Promise<void>;
  listNotebook(): Promise<NotebookEntry[]>;
  captureNotebook(entry: NotebookEntry): Promise<NotebookEntry>;
  saveNotebook(entry: NotebookEntry): Promise<void>;
  listPublishedLessons(): Promise<Lesson[]>;
  cachePublishedLessons(lessons: Lesson[]): Promise<Lesson[]>;
  exportBackup(): Promise<LearningBackup>;
  restoreBackup(backup: LearningBackup): Promise<RestoreReport>;
  listReviewEvents(): Promise<ReviewEvent[]>;
  recordReview(event: ReviewEvent): Promise<void>;
  listCourseEvents(): Promise<CourseEvent[]>;
  recordCourseEvent(event: CourseEvent): Promise<void>;
  close(): void;
}

export function normalizeAnswer(answer: string): string {
  return answer.normalize('NFC').toLocaleLowerCase('fr-FR').replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
}
export function checkAnswer(answer: string, exercise: Lesson['sentenceActivity']): 'correct' | 'almost' | 'incorrect' {
  const normalized = normalizeAnswer(answer);
  if (exercise.answers.some(valid => normalizeAnswer(valid) === normalized)) return 'correct';
  if (exercise.almostAnswers.some(valid => normalizeAnswer(valid) === normalized)) return 'almost';
  return 'incorrect';
}
export function lessonProgress(lesson: Lesson, events: LearningEvent[]) {
  const relevant = events.filter(event => event.lessonId === lesson.id && event.revision === lesson.revision);
  // A deliberate overview review covers the displayed set; older per-word events
  // still count. Opening a grid alone never creates either kind of event.
  const overviewReviewed = relevant.some(event => event.activity === 'vocabulary' && event.result === 'viewed' && event.itemId === lesson.id);
  const viewedIds = new Set(overviewReviewed ? lesson.vocabulary.map(entry => entry.id)
    : relevant.filter(event => event.activity === 'vocabulary' && event.result === 'viewed').map(event => event.itemId));
  return {
    viewedIds,
    pictureDone: relevant.some(event => event.activity === 'picture' && event.result === 'correct'),
    sentenceDone: relevant.some(event => event.activity === 'sentence' && event.result === 'correct'),
    completed: relevant.some(event => event.activity === 'completion' && event.result === 'completed'),
  };
}
