import type { LearningEvent } from '@smartlingo/domain';
import { japaneseAlphabetLessons } from '@smartlingo/content';

const lessonsById = new Map(japaneseAlphabetLessons.map(lesson => [lesson.id, lesson]));
export function isAlphabetLessonId(id: string): boolean { return lessonsById.has(id); }

/** Explicit saved row study, separate from vocabulary totals or script mastery. */
export function alphabetProgress(events: readonly LearningEvent[], now = Date.now()) {
  const completedIds = new Set<string>();
  for (const event of events) {
    const lesson = lessonsById.get(event.lessonId);
    const occurred = Date.parse(event.occurredAt);
    if (lesson && event.revision === lesson.revision && event.itemId === `${lesson.id}.completion`
      && event.activity === 'completion' && event.result === 'completed' && Number.isFinite(occurred) && occurred <= now) completedIds.add(lesson.id);
  }
  return { completedIds, completed: completedIds.size, total: japaneseAlphabetLessons.length,
    next: japaneseAlphabetLessons.find(lesson => !completedIds.has(lesson.id)) };
}
