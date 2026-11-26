import { z } from 'zod';
import { japanesePracticeSetSchema } from './japanese-practice';

const id = z.string().regex(/^[a-z0-9][a-z0-9.-]+$/).max(120);
const text = z.string().trim().min(1).max(2000);
export const vocabularySchema = z.object({
  id, target: text.max(300), meaning: text.max(500), example: text.max(1000), exampleMeaning: text,
  reading: text.max(300).optional(), exampleReading: text.max(1000).optional(),
  gender: z.enum(['masculine', 'feminine', 'both']).optional(),
  note: z.string().trim().max(2000), picture: z.enum(['cup', 'water', 'menu', 'bill', 'greeting', 'please', 'bread', 'croissant', 'bag', 'thanks', 'context']),
  pictureAlt: text,
});
export const lessonSchema = z.object({
  id, revision: z.number().int().positive(), status: z.enum(['draft', 'published']),
  language: z.string().min(2).max(20), explanationLanguage: z.string().min(2).max(20),
  title: text, subtitle: text, outcome: text, level: z.enum(['foundation', 'A1', 'A2', 'B1']),
  topic: text, role: text, durationMinutes: z.number().int().min(1).max(60),
  vocabulary: z.array(vocabularySchema).min(6).max(10),
  dialogue: z.array(z.object({ role: text, target: text, meaning: text, reading: text.optional() })).min(2),
  grammar: z.object({ title: text, explanation: text }),
  pictureActivity: z.object({ mode: z.enum(['picture', 'meaning']).optional(), prompt: text, entryId: id, choices: z.array(id).min(2) }),
  sentenceActivity: z.object({
    id, prompt: text, tokens: z.array(text).min(2), answers: z.array(text).min(1),
    hint: text, explanation: text,
    // Accents may change meaning; only explicitly reviewed variants receive "almost".
    almostAnswers: z.array(text),
  }),
  japanesePractice: japanesePracticeSetSchema.optional(),
  provenance: z.object({ author: text, rights: text, review: text }),
}).superRefine((lesson, context) => {
  if (lesson.japanesePractice && lesson.language !== 'ja-JP') {
    context.addIssue({ code: 'custom', message: 'Japanese practice requires a Japanese lesson.' });
  }
  const ids = lesson.vocabulary.map(entry => entry.id);
  if (new Set(ids).size !== ids.length) context.addIssue({ code: 'custom', message: 'Duplicate vocabulary IDs' });
  const picture = lesson.pictureActivity;
  if (!ids.includes(picture.entryId) || picture.choices.some(choice => !ids.includes(choice)) || !picture.choices.includes(picture.entryId)) {
    context.addIssue({ code: 'custom', message: 'Picture activity references missing vocabulary' });
  }
  if (new Set(picture.choices).size !== picture.choices.length) context.addIssue({ code: 'custom', message: 'Duplicate picture choices' });
});

export type Vocabulary = z.infer<typeof vocabularySchema>;
export type Lesson = z.infer<typeof lessonSchema>;
