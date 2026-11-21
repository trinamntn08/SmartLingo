import { lessonSchema, vocabularySchema, type CourseDay, type Lesson, type Vocabulary } from '@smartlingo/domain';

export type JapaneseLessonDraft = {
  title: string; outcome: string; role: string;
  vocabulary: Vocabulary[];
  dialogue: Lesson['dialogue'];
  grammar: Lesson['grammar'];
  sentence: Omit<Lesson['sentenceActivity'], 'id' | 'almostAnswers'>;
};
export type JapaneseTopicExpansion = { dayNumber: number; lessons: JapaneseLessonDraft[] };

/** Original draft content, with visible kana support and honest text-only media. */
export function word(slug: string, target: string, reading: string, meaning: string,
  example: string, exampleReading: string, exampleMeaning: string, note: string): Vocabulary {
  return vocabularySchema.parse({ id: `ja.expansion.${slug}`, target, reading, meaning, example, exampleReading,
    exampleMeaning, note, picture: 'context', pictureAlt: 'Text-supported Japanese expression; no literal picture is supplied.' });
}
export function line(role: string, target: string, reading: string, meaning: string): Lesson['dialogue'][number] {
  return { role, target, reading, meaning };
}

/** Append lessons without changing the original course or lesson progress scopes. */
export function buildJapaneseExpansion(day: CourseDay, topic: JapaneseTopicExpansion): Lesson[] {
  if (topic.dayNumber !== day.dayNumber || topic.lessons.length !== 4 || topic.lessons.some(lesson => lesson.vocabulary.length !== 6)) {
    throw new Error(`Japanese topic ${day.dayNumber} needs four six-entry extension lessons.`);
  }
  return topic.lessons.map((draft, index) => {
    const id = `ja.lesson.day-${day.dayNumber}.words-${index + 2}`;
    const target = draft.vocabulary[index % 3];
    return lessonSchema.parse({
      id, revision: 1, status: 'draft', language: 'ja-JP', explanationLanguage: 'en',
      title: draft.title, subtitle: draft.title, topic: day.title, outcome: draft.outcome,
      level: day.level, role: draft.role, durationMinutes: 8,
      vocabulary: draft.vocabulary, dialogue: draft.dialogue, grammar: draft.grammar,
      pictureActivity: { mode: 'meaning', prompt: `Choose the Japanese expression meaning: ${target.meaning}`,
        entryId: target.id, choices: draft.vocabulary.slice(0, 3).map(entry => entry.id) },
      sentenceActivity: { ...draft.sentence, id: `${id}.sentence`, almostAnswers: [] },
      provenance: {
        author: 'SmartLingo — original AI-assisted Japanese vocabulary expansion, 2026-11-21.',
        rights: 'Original vocabulary support, examples, dialogue and exercises; no imported course text or media.',
        review: 'Draft requiring owner and qualified Japanese review of readings, meanings, register, examples, accepted answers and task-level estimates. No complete CEFR/JLPT coverage or proficiency claim.',
      },
    });
  });
}
