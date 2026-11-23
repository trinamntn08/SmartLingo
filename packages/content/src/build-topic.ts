import { lessonSchema, type Lesson, type Vocabulary } from '@smartlingo/domain';

/** Compact authoring input; runtime lessons still pass the shared public schema. */
export type WordDraft = readonly [
  slug: string, target: string, meaning: string, example: string,
  exampleMeaning: string, note: string, details?: { picture?: Vocabulary['picture']; gender?: Vocabulary['gender']; reading?: Vocabulary['reading'] },
];

export type ShortLessonDraft = {
  slug: string;
  revision?: number;
  title: string;
  level: Lesson['level'];
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
  revision?: number;
  language?: 'ja-JP';
  provenance?: Lesson['provenance'];
  lessons: readonly ShortLessonDraft[];
};

export function buildTopic(topic: TopicDraft): Lesson[] {
  const japanese = topic.language === 'ja-JP';
  const prefix = `${japanese ? 'ja' : 'fr'}.${topic.slug}`;
  return topic.lessons.map(part => {
    const lessonId = `${prefix}.${part.slug}`;
    const vocabulary = part.words.map(([slug, target, meaning, example, exampleMeaning, note, details]) => ({
      id: `${prefix}.${slug}`, target, meaning, example, exampleMeaning, note,
      ...(details?.reading ? { reading: details.reading } : {}),
      gender: details?.gender,
      picture: details?.picture ?? 'context',
      pictureAlt: details?.picture ? `Study illustration for ${meaning}` : 'An open vocabulary notebook',
    }));
    return lessonSchema.parse({
      id: lessonId, revision: part.revision ?? topic.revision ?? 1, status: 'draft', language: topic.language ?? 'fr-FR', explanationLanguage: 'en',
      title: part.title, subtitle: part.title, outcome: part.outcome, level: part.level,
      topic: topic.title, role: topic.role, durationMinutes: 7, vocabulary,
      dialogue: part.dialogue, grammar: part.grammar,
      // A meaning prompt avoids pretending a contextual drawing depicts an abstract word.
      pictureActivity: { mode: 'meaning', prompt: `Choose the ${japanese ? 'Japanese' : 'French'} for this meaning.`,
        entryId: vocabulary[0].id, choices: [vocabulary[2].id, vocabulary[0].id, vocabulary[1].id] },
      sentenceActivity: {
        id: `${lessonId}.sentence`, prompt: `Build: “${part.sentence.meaning}”`,
        tokens: part.sentence.tokens, answers: [part.sentence.answer, ...(part.sentence.alternatives ?? [])],
        almostAnswers: [], hint: part.sentence.hint, explanation: part.sentence.explanation,
      },
      provenance: topic.provenance ?? {
        author: 'Original SmartLingo AI-assisted curriculum rework, 2026-11-15',
        rights: 'Original examples and code-drawn illustrations; research references in docs/CURRICULUM_RESEARCH.md. No third-party course text or media copied.',
        review: 'Owner review required: French, meanings, estimated A1/A2 levels, activities and media. No audio reviewed.',
      },
    });
  });
}
