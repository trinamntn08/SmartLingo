import { z } from 'zod';
import { vocabularySchema } from './content';

const id = z.string().regex(/^[a-z0-9][a-z0-9.-]+$/).max(120);
const text = z.string().trim().min(1).max(2000);
const httpsUrl = z.string().url().refine(value => value.startsWith('https://'), 'Use an HTTPS source URL');
const bilingual = z.object({ target: text, meaning: text });
const blockFields = { id, title: text };

export const courseSourceSchema = z.object({
  id, title: text, creator: text, sourceUrl: httpsUrl,
  license: z.literal('CC-BY-4.0'), licenseUrl: z.literal('https://creativecommons.org/licenses/by/4.0/'),
  copyrightNotice: text, retrievedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  changes: text, scope: text, excludedAssets: z.array(text).min(1).max(20),
});

export const courseBlockSchema = z.discriminatedUnion('kind', [
  z.object({ ...blockFields, kind: z.literal('study'), explanation: text, examples: z.array(bilingual).min(1).max(10) }),
  z.object({ ...blockFields, kind: z.literal('vocabulary') }),
  z.object({ ...blockFields, kind: z.literal('dialogue'), explanation: text,
    lines: z.array(bilingual.extend({ role: text })).min(2).max(20) }),
  z.object({ ...blockFields, kind: z.literal('choice'), prompt: text,
    choices: z.array(bilingual.extend({ id })).min(2).max(6), answerId: id, feedback: text, hint: text }),
  z.object({ ...blockFields, kind: z.literal('reflection'), prompt: text,
    modelTarget: text, modelMeaning: text, checklist: z.array(text).min(1).max(8) }),
]);
export type CourseBlock = z.infer<typeof courseBlockSchema>;
export type CourseChoice = Extract<CourseBlock, { kind: 'choice' }>;

const courseDaySchema = z.object({
  id, dayNumber: z.number().int().positive(), title: text, outcome: text,
  level: z.enum(['foundation', 'A1', 'A2']),
  vocabulary: z.array(vocabularySchema).min(6).max(10),
  blocks: z.array(courseBlockSchema).min(3).max(30),
});
export const openCourseSchema = z.object({
  id, revision: z.number().int().positive(), status: z.literal('draft'),
  language: z.literal('fr-FR'), explanationLanguage: z.literal('en'),
  title: text, description: text, sources: z.array(courseSourceSchema).min(1).max(20),
  days: z.array(courseDaySchema).min(1).max(100),
}).superRefine((course, context) => {
  const ids = [course.id, ...course.sources.map(source => source.id)];
  const dayNumbers = course.days.map(day => day.dayNumber);
  if (new Set(dayNumbers).size !== dayNumbers.length || dayNumbers.some((number, index) => number !== index + 1)) {
    context.addIssue({ code: 'custom', message: 'Course days must have consecutive authored numbers starting at one' });
  }
  for (const day of course.days) {
    ids.push(day.id, ...day.blocks.map(block => block.id));
    const vocabularyIds = day.vocabulary.map(word => word.id);
    if (new Set(vocabularyIds).size !== vocabularyIds.length) context.addIssue({ code: 'custom', message: 'Duplicate day vocabulary IDs' });
    if (!day.blocks.some(block => block.kind === 'choice') || !day.blocks.some(block => block.kind === 'vocabulary')) {
      context.addIssue({ code: 'custom', message: 'A pilot day needs vocabulary and interactive practice' });
    }
    for (const block of day.blocks) if (block.kind === 'choice') {
      const choices = block.choices.map(choice => choice.id);
      if (new Set(choices).size !== choices.length || !choices.includes(block.answerId)) {
        context.addIssue({ code: 'custom', message: 'Choice answers must reference a unique available option' });
      }
    }
  }
  if (new Set(ids).size !== ids.length) context.addIssue({ code: 'custom', message: 'Duplicate course, source, day or block IDs' });
});
export type OpenCourse = z.infer<typeof openCourseSchema>;
export type CourseDay = OpenCourse['days'][number];

const eventFields = { id: z.string().uuid(), courseId: id, courseRevision: z.number().int().positive(),
  dayId: id, blockId: id, occurredAt: z.string().datetime({ offset: true }) };
export const courseEventSchema = z.discriminatedUnion('kind', [
  z.object({ ...eventFields, kind: z.literal('navigation') }),
  z.object({ ...eventFields, kind: z.literal('study') }),
  z.object({ ...eventFields, kind: z.literal('support') }),
  z.object({ ...eventFields, kind: z.literal('choice'), choiceId: id,
    result: z.enum(['correct', 'incorrect']), supported: z.boolean() }),
  z.object({ ...eventFields, kind: z.literal('reflection') }),
  z.object({ ...eventFields, kind: z.literal('completion') }),
]);
export type CourseEvent = z.infer<typeof courseEventSchema>;

export function gradeCourseChoice(block: CourseChoice, choiceId: string): 'correct' | 'incorrect' {
  if (!block.choices.some(choice => choice.id === choiceId)) throw new Error('That answer is not an available choice.');
  return block.answerId === choiceId ? 'correct' : 'incorrect';
}

function orderedEvents(inputs: readonly CourseEvent[]): CourseEvent[] {
  const unique = new Map<string, CourseEvent>();
  for (const input of inputs) {
    const event = courseEventSchema.parse(input);
    const previous = unique.get(event.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(event)) throw new Error('Conflicting course event ID');
    unique.set(event.id, event);
  }
  return [...unique.values()].sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt) || left.id.localeCompare(right.id));
}

/** A study-day record describes activity, never independent skill or proficiency. */
export function courseDayProgress(course: OpenCourse, day: CourseDay, inputs: readonly CourseEvent[]) {
  const blocks = new Map(day.blocks.map(block => [block.id, block]));
  const events = orderedEvents(inputs).filter(event => event.courseId === course.id && event.courseRevision === course.revision
    && event.dayId === day.id && blocks.has(event.blockId));
  const completedBlockIds = new Set<string>();
  const supportedBlockIds = new Set<string>();
  for (const event of events) {
    const block = blocks.get(event.blockId)!;
    if (event.kind === 'support' || (event.kind === 'choice' && event.supported)) supportedBlockIds.add(block.id);
    if (event.kind === 'study' && ['study', 'vocabulary', 'dialogue'].includes(block.kind)) completedBlockIds.add(block.id);
    if (event.kind === 'reflection' && block.kind === 'reflection') completedBlockIds.add(block.id);
    if (event.kind === 'choice' && block.kind === 'choice' && event.result === 'correct'
      && block.choices.some(choice => choice.id === event.choiceId)
      && gradeCourseChoice(block, event.choiceId) === 'correct') completedBlockIds.add(block.id);
  }
  const canComplete = day.blocks.every(block => completedBlockIds.has(block.id));
  const last = events.filter(event => event.kind !== 'support' && event.kind !== 'completion').at(-1);
  return { completedBlockIds, supportedBlockIds, canComplete,
    completed: canComplete && events.some(event => event.kind === 'completion'),
    lastBlockId: last?.blockId ?? day.blocks[0].id };
}

export function nextCourseDay(course: OpenCourse, events: readonly CourseEvent[]): CourseDay | undefined {
  return course.days.find(day => !courseDayProgress(course, day, events).completed);
}
