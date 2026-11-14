import { lessonSchema, type Lesson, type Vocabulary } from '@smartlingo/domain';

/** Compact authoring input; runtime lessons still pass the shared public schema. */
export type WordDraft = readonly [
  slug: string, target: string, meaning: string, example: string,
  exampleMeaning: string, note: string, picture?: Vocabulary['picture'],
];

export type ShortLessonDraft = {
  slug: string;
  title: string;
  level: 'A1' | 'A2';
  outcome: string;
  words: readonly WordDraft[];
  dialogue: readonly { role: string; target: string; meaning: string }[];
  grammar: { title: string; explanation: string };
  sentence: {
    tokens: readonly string[];
    answer: string;
    meaning: string;
    hint: string;
    explanation: string;
    alternatives?: readonly string[];
  };
};

export type TopicDraft = {
  slug: string;
  title: string;
  role: string;
  lessons: readonly ShortLessonDraft[];
};

export function buildTopic(topic: TopicDraft): Lesson[] {
  return topic.lessons.map(part => {
    const lessonId = `fr.${topic.slug}.${part.slug}`;
    const vocabulary = part.words.map(([slug, target, meaning, example, exampleMeaning, note, picture]) => ({
      id: `fr.${topic.slug}.${slug}`, target, meaning, example, exampleMeaning, note,
      picture: picture ?? 'context',
      pictureAlt: picture ? `Study illustration for ${meaning}` : 'An open vocabulary notebook',
    }));
    return lessonSchema.parse({
      id: lessonId, revision: 1, status: 'draft', language: 'fr-FR', explanationLanguage: 'en',
      title: part.title, subtitle: part.title, outcome: part.outcome, level: part.level,
      topic: topic.title, role: topic.role, durationMinutes: 7, vocabulary,
      dialogue: part.dialogue, grammar: part.grammar,
      // A meaning prompt avoids pretending a contextual drawing depicts an abstract word.
      pictureActivity: { mode: 'meaning', prompt: 'Choose the French for this meaning.',
        entryId: vocabulary[0].id, choices: [vocabulary[2].id, vocabulary[0].id, vocabulary[1].id] },
      sentenceActivity: {
        id: `${lessonId}.sentence`, prompt: `Build: “${part.sentence.meaning}”`,
        tokens: part.sentence.tokens, answers: [part.sentence.answer, ...(part.sentence.alternatives ?? [])],
        almostAnswers: [], hint: part.sentence.hint, explanation: part.sentence.explanation,
      },
      provenance: {
        author: 'Original SmartLingo AI-assisted draft, 2026-11-14',
        rights: 'Original examples and code-drawn illustrations; research references in docs/CURRICULUM_RESEARCH.md. No third-party course text or media copied.',
        review: 'Owner review required: French, meanings, estimated A1/A2 levels, activities and media. No audio reviewed.',
      },
    });
  });
}
