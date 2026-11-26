import type { LearningEvent } from '@smartlingo/domain';
import { japaneseAlphabetLessons } from '@smartlingo/content';

const lessonsById = new Map(japaneseAlphabetLessons.map(lesson => [lesson.id, lesson]));
/** Teaching order is independent from the stable legacy content-array positions. */
export const alphabetLearningPath = (['hiragana', 'katakana'] as const).flatMap(script => japaneseAlphabetLessons.filter(lesson => lesson.script === script));
export function isAlphabetLessonId(id: string): boolean { return lessonsById.has(id); }

/** Explicit saved practice, separate from vocabulary totals or script mastery. */
export function alphabetProgress(events: readonly LearningEvent[], now = Date.now()) {
  const completedIds = new Set<string>();
  const taskIds = new Map<string, Set<string>>();
  let latestPractice: { lessonId: string; occurred: number } | undefined;
  for (const event of events) {
    const lesson = lessonsById.get(event.lessonId);
    const occurred = Date.parse(event.occurredAt);
    if (!lesson || event.revision !== lesson.revision || !Number.isFinite(occurred) || occurred > now) continue;
    if (event.itemId === `${lesson.id}.completion` && event.activity === 'completion' && event.result === 'completed') completedIds.add(lesson.id);
    if (event.activity === 'sentence' && lesson.practice?.some(task => task.id === event.itemId)) {
      if (event.result === 'correct') {
        const ids = taskIds.get(lesson.id) ?? new Set<string>();
        ids.add(event.itemId); taskIds.set(lesson.id, ids);
      }
      if (!latestPractice || occurred > latestPractice.occurred) latestPractice = { lessonId: lesson.id, occurred };
    }
  }
  const continuing = latestPractice && !completedIds.has(latestPractice.lessonId) ? lessonsById.get(latestPractice.lessonId) : undefined;
  return { completedIds, taskIds, completed: completedIds.size, total: japaneseAlphabetLessons.length,
    next: continuing ?? alphabetLearningPath.find(lesson => !completedIds.has(lesson.id)) };
}
