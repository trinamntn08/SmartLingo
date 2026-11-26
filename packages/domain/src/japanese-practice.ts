import { z } from 'zod';

const text = z.string().trim().min(1).max(1200);
const ruby = z.object({ base: text, reading: text });

const taskFields = {
  id: z.string().regex(/^[a-z0-9][a-z0-9.-]+$/).max(120),
  prompt: text,
  feedback: text,
  retry: text,
  skill: z.enum(['listening', 'reading', 'writing', 'speaking', 'script']).optional(),
  source: z.object({
    text: text.max(500), reading: text.optional(), meaning: text.optional(),
    ruby: z.array(ruby).min(1).max(30).optional(),
  }).optional(),
};

export const japaneseAnswerFocusSchema = z.enum(['meaning', 'hiragana', 'katakana', 'kanji', 'verbatim']);
export type JapaneseAnswerFocus = z.infer<typeof japaneseAnswerFocusSchema>;

const hiragana = /^[ぁ-ゖゝゞー]+$/u;
const katakana = /^[ァ-ヺヽヾー・]+$/u;
const han = /\p{Script=Han}/u;
const japanese = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

export function normalizeJapaneseAnswer(value: string, focus: JapaneseAnswerFocus): string {
  const normalized = value.replace(/[\uFF01-\uFF5E\uFF61-\uFF9F]+/gu, width => width.normalize('NFKC'))
    .normalize('NFC').trim().replace(/[。！？.!?]+$/u, '').trim();
  if (focus === 'meaning' && !japanese.test(normalized)) return normalized.toLowerCase().replace(/\s+/gu, ' ');
  return normalized.replace(/\s+/gu, '');
}

function usesRequestedScript(answer: string, focus: JapaneseAnswerFocus): boolean {
  if (focus === 'hiragana') return hiragana.test(answer);
  if (focus === 'katakana') return katakana.test(answer);
  if (focus === 'kanji') return han.test(answer);
  return !!answer;
}

export const japanesePracticeTaskSchema = z.discriminatedUnion('mode', [
  z.object({ ...taskFields, mode: z.literal('choice'), choices: z.array(text).min(2).max(5), answer: text }),
  z.object({ ...taskFields, mode: z.literal('text'), answers: z.array(text).min(1).max(24), focus: japaneseAnswerFocusSchema }),
  z.object({ ...taskFields, mode: z.literal('self'), model: text, modelMeaning: text.optional(), criteria: z.array(text).min(1).max(5), response: z.enum(['speak', 'write']).optional() }),
]).superRefine((task, context) => {
  const issue = (message: string) => context.addIssue({ code: 'custom', message });
  if (task.skill === 'listening' && !task.source) issue('Listening practice requires a source transcript.');
  if (task.mode === 'choice' && (new Set(task.choices).size !== task.choices.length || !task.choices.includes(task.answer))) {
    issue('Choices must be distinct and include the answer.');
  }
  if (task.mode === 'text' && task.answers.some(answer => !usesRequestedScript(normalizeJapaneseAnswer(answer, task.focus), task.focus))) {
    issue('An accepted answer does not use the requested script.');
  }
  let cursor = 0;
  for (const annotation of task.source?.ruby ?? []) {
    const start = task.source!.text.indexOf(annotation.base, cursor);
    if (start < 0) {
      issue('Furigana must match ordered text in the source.');
      break;
    }
    cursor = start + annotation.base.length;
  }
});

export const japanesePracticeSetSchema = z.object({
  tasks: z.array(japanesePracticeTaskSchema).min(1).max(12),
  checkpoint: z.boolean().optional(),
  revisit: text.optional(),
  prerequisites: text.optional(),
}).superRefine((set, context) => {
  if (new Set(set.tasks.map(task => task.id)).size !== set.tasks.length) {
    context.addIssue({ code: 'custom', message: 'Japanese task IDs must be unique within a practice set.' });
  }
});

export type JapanesePracticeTask = z.infer<typeof japanesePracticeTaskSchema>;
export type JapanesePracticeSet = z.infer<typeof japanesePracticeSetSchema>;
export type JapanesePracticeResult = 'correct' | 'incorrect' | 'self-reviewed';

export function checkJapaneseAnswer(answer: string, task: Extract<JapanesePracticeTask, { mode: 'text' }>): boolean {
  const normalized = normalizeJapaneseAnswer(answer, task.focus);
  return usesRequestedScript(normalized, task.focus)
    && task.answers.some(valid => normalizeJapaneseAnswer(valid, task.focus) === normalized);
}
