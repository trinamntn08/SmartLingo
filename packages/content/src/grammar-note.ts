import type { Lesson } from '@smartlingo/domain';

export interface GrammarExample {
  target: string;
  meaning: string;
}

type GrammarDetail = string | (GrammarExample & { label?: string });

export type LearnerGrammarNote = Lesson['grammar'] & {
  example?: GrammarExample;
  detail?: GrammarDetail;
};

/** Keep a plain-text form for callers that use the lesson schema. */
export function grammarBrief(title: string, example: GrammarExample, detail?: GrammarDetail): LearnerGrammarNote {
  const exampleText = `${example.target} ${example.meaning}`;
  const detailText = typeof detail === 'string' ? detail
    : detail ? [detail.label, detail.target, detail.meaning].filter(Boolean).join(' ') : undefined;
  const explanation = detailText ? `${exampleText} ${detailText}` : exampleText;
  return { title, explanation, example, detail };
}
