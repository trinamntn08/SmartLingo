import type { Lesson, Vocabulary } from './content';

export type LessonTopic = { name: string; lessons: Lesson[]; vocabulary: Vocabulary[] };
export type CatalogueLevel = 'All' | Lesson['level'];

export function normalizeSearch(value: string): string {
  // Fold Latin accents for French search, preserving meaning-changing kana dakuten.
  return value.normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu, '$1').normalize('NFC').toLocaleLowerCase('fr-FR')
    .replace(/[’‘]/g, "'").trim();
}

export function matchesVocabulary(entry: Vocabulary, query: string): boolean {
  return normalizeSearch(`${entry.target} ${entry.meaning}`).includes(normalizeSearch(query));
}

export function matchesLesson(lesson: Lesson, query: string, level: CatalogueLevel = 'All'): boolean {
  if (level !== 'All' && lesson.level !== level) return false;
  return normalizeSearch(`${lesson.title} ${lesson.subtitle} ${lesson.topic} ${lesson.role} ${lesson.outcome}`).includes(normalizeSearch(query))
    || lesson.vocabulary.some(entry => matchesVocabulary(entry, query));
}

/** Group the actual merged catalogue, including published replacements. */
export function groupLessonTopics(lessons: readonly Lesson[]): LessonTopic[] {
  const grouped = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const items = grouped.get(lesson.topic) ?? [];
    items.push(lesson);
    grouped.set(lesson.topic, items);
  }
  return [...grouped].map(([name, items]) => ({
    name, lessons: items,
    vocabulary: [...new Map(items.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry])).values()],
  }));
}
