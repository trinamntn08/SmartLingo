import { japaneseAlphabetLessons, type JapaneseAlphabetLesson, type KanaScript } from '@smartlingo/content';
import { normalizeSearch, type CatalogueLevel } from '@smartlingo/domain';

export interface KanaTopic {
  name: 'Hiragana' | 'Katakana';
  script: KanaScript;
  sample: string;
  lessons: readonly JapaneseAlphabetLesson[];
}

export const kanaTopics: readonly KanaTopic[] = [
  { name: 'Hiragana', script: 'hiragana', sample: 'あ い う', lessons: japaneseAlphabetLessons.filter(lesson => lesson.script === 'hiragana') },
  { name: 'Katakana', script: 'katakana', sample: 'ア イ ウ', lessons: japaneseAlphabetLessons.filter(lesson => lesson.script === 'katakana') },
];

export function findKanaTopic(name: string | null | undefined): KanaTopic | undefined {
  return kanaTopics.find(topic => topic.script === name?.toLowerCase());
}

export function matchesKanaLesson(lesson: JapaneseAlphabetLesson, query: string, level: CatalogueLevel): boolean {
  if (level !== 'All' && level !== 'foundation') return false;
  const term = normalizeSearch(query);
  return !term || [lesson.title, lesson.summary, lesson.characters.map(character => character.kana).join(''),
    ...lesson.characters.map(character => character.romaji),
    ...(lesson.examples ?? []).flatMap(example => [example.text, example.reading, example.meaning]),
  ].some(text => normalizeSearch(text).includes(term));
}
