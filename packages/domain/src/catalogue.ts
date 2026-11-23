import type { Lesson } from './content';

/** Published local content overrides bundled preview drafts without deleting their history. */
export function mergeLessonCatalogue(bundled: readonly Lesson[], published: readonly Lesson[]): Lesson[] {
  const catalogue = new Map(bundled.map(lesson => [lesson.id, lesson]));
  for (const lesson of published) {
    if (lesson.status !== 'published') throw new Error('Only published content can replace preview lessons.');
    catalogue.set(lesson.id, lesson);
  }
  return [...catalogue.values()];
}
