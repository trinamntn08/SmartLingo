import type { Lesson, Vocabulary } from './content';

export type LessonTopic = { name: string; lessons: Lesson[]; vocabulary: Vocabulary[] };
export type CatalogueLevel = 'All' | Lesson['level'];

export function normalizeSearch(value: string): string {
  // Preserve kana voicing marks, which distinguish Japanese syllables.
  return value.normalize('NFD').replace(/(?![\u3099\u309a])\p{M}/gu, '').normalize('NFC').toLocaleLowerCase('fr-FR')
    .replace(/[’‘]/g, "'").trim();
}

export function matchesVocabulary(entry: Vocabulary, query: string): boolean {
  const search = normalizeSearch(query);
  return normalizeSearch(`${entry.target} ${entry.meaning}`).includes(search)
    || Boolean(entry.reading && normalizeSearch(entry.reading).includes(search));
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
