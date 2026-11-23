import type { Lesson } from '@smartlingo/domain';

export interface ListeningQuestion {
  id: string;
  lessonId: string;
  language: string;
  sentence: string;
  meaning: string;
  reading?: string;
  prompt?: string;
  choices: string[];
  correctIndex: number;
}

// Retain accents and kana distinctions; ignore presentation-only punctuation.
function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, '');
}

/** Whole-sentence meanings only. Never mix languages or offer conflicting mappings. */
export function buildListeningQuestions(lessons: readonly Lesson[]): ListeningQuestion[] {
  const topics = new Map(lessons.map(lesson => [lesson.id, lesson.topic]));
  const candidates = lessons.flatMap(lesson => lesson.vocabulary.map(entry => ({
    id: `${lesson.id}:${entry.id}`, lessonId: lesson.id, language: lesson.language,
    sentence: entry.example, meaning: entry.exampleMeaning, reading: entry.exampleReading,
  }))).filter(entry => normalize(entry.sentence) && normalize(entry.meaning));
  const mappings = new Map<string, Set<string>>();
  for (const entry of candidates) {
    const key = `${entry.language}:${normalize(entry.sentence)}`;
    const meanings = mappings.get(key) ?? new Set<string>();
    meanings.add(normalize(entry.meaning)); mappings.set(key, meanings);
  }
  const seenTargets = new Set<string>();
  const unambiguous = candidates.filter(entry => {
    const key = `${entry.language}:${normalize(entry.sentence)}`;
    if (mappings.get(key)!.size !== 1 || seenTargets.has(key)) return false;
    seenTargets.add(key); return true;
  });
  return unambiguous.flatMap((entry, index) => {
    const meanings = new Set([normalize(entry.meaning)]);
    const distractors: string[] = [];
    const priority = (alternative: typeof entry) => alternative.lessonId === entry.lessonId ? 0
      : topics.get(alternative.lessonId) === topics.get(entry.lessonId) ? 1 : 2;
    // Rotate before stable grouping so each question gets varied nearby options,
    // while keeping lesson context ahead of topic and language-wide fallback.
    const alternatives = [...unambiguous.slice(index + 1), ...unambiguous.slice(0, index + 1)]
      .filter(alternative => alternative.language === entry.language)
      .sort((left, right) => priority(left) - priority(right));
    for (const alternative of alternatives) {
      const meaning = normalize(alternative.meaning);
      if (meanings.has(meaning)) continue;
      meanings.add(meaning); distractors.push(alternative.meaning);
      if (distractors.length === 2) break;
    }
    if (distractors.length < 2) return [];
    const correctIndex = index % 3;
    const choices = [...distractors]; choices.splice(correctIndex, 0, entry.meaning);
    return [{ ...entry, choices, correctIndex }];
  });
}
