import { z } from 'zod';
import { vocabularySchema } from './content';

const id = z.string().regex(/^[a-z0-9][a-z0-9.-]+$/).max(120);
const text = z.string().trim().min(1).max(2000);
const httpsUrl = z.string().url().refine(value => value.startsWith('https://'), 'Use an HTTPS source URL');
const bilingual = z.object({ target: text, meaning: text, reading: text.optional() });
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

export const courseLessonStages = ['dialogue', 'vocabulary', 'listening', 'picture', 'sentence'] as const;
export type CourseLessonStage = typeof courseLessonStages[number];

export function courseLessonStageId(stage: CourseLessonStage): `lesson-${CourseLessonStage}` {
  return `lesson-${stage}`;
}

function canonicalCourseLessonStage(blockId: string | undefined): CourseLessonStage | undefined {
  return courseLessonStages.find(stage => courseLessonStageId(stage) === blockId);
}

const previousBlockStages: Record<CourseBlock['kind'], CourseLessonStage> = {
  study: 'dialogue', vocabulary: 'vocabulary', dialogue: 'dialogue', choice: 'picture', reflection: 'sentence',
};

const compactDaySchema = z.object({
  tip: text.max(180),
  practice: z.array(z.object({ blockId: id, prompt: text.max(140), feedback: text.max(145), hint: text.max(95) })).min(1).max(6),
  reflectionPrompt: text.max(165),
});

const courseDaySchema = z.object({
  id, dayNumber: z.number().int().positive(), title: text, outcome: text,
  // An unchanged day may retain its original release's event scope when a course grows.
  progressRevision: z.number().int().positive().optional(),
  level: z.enum(['foundation', 'A1', 'A2', 'B1']),
  vocabulary: z.array(vocabularySchema.extend({ reading: text.max(300).optional(), exampleReading: text.max(1000).optional() })).min(6).max(10),
  blocks: z.array(courseBlockSchema).min(3).max(30),
  compact: compactDaySchema.optional(),
});
const courseUnitSchema = z.object({ id, title: text, outcome: text, dayIds: z.array(id).min(1).max(100) });

export const openCourseSchema = z.object({
  id, revision: z.number().int().positive(), status: z.literal('draft'),
  language: z.enum(['fr-FR', 'ja-JP']), explanationLanguage: z.literal('en'),
  title: text, description: text, sources: z.array(courseSourceSchema).max(20),
  provenance: z.object({ author: text, rights: text, review: text }).optional(),
  units: z.array(courseUnitSchema).min(1).max(100).optional(),
  days: z.array(courseDaySchema).min(1).max(100),
}).superRefine((course, context) => {
  if (!course.sources.length && !course.provenance) {
    context.addIssue({ code: 'custom', message: 'Original courses need explicit authorship, rights and review provenance' });
  }
  if (course.language === 'ja-JP' && !course.provenance) {
    context.addIssue({ code: 'custom', message: 'Japanese drafts need explicit provenance' });
  }
  const ids = [course.id, ...course.sources.map(source => source.id), ...(course.units ?? []).map(unit => unit.id)];
  const vocabularyById = new Map<string, string>();
  const dayNumbers = course.days.map(day => day.dayNumber);
  if (new Set(dayNumbers).size !== dayNumbers.length || dayNumbers.some((number, index) => number !== index + 1)) {
    context.addIssue({ code: 'custom', message: 'Course days must have consecutive authored numbers starting at one' });
  }
  if (course.units) {
    const unitDayIds = course.units.flatMap(unit => unit.dayIds);
    if (unitDayIds.length !== course.days.length || course.days.some((day, index) => day.id !== unitDayIds[index])) {
      context.addIssue({ code: 'custom', path: ['units'], message: 'Course units must cover each day once in authored order' });
    }
  }
  for (const day of course.days) {
    if (day.progressRevision !== undefined && day.progressRevision > course.revision) {
      context.addIssue({ code: 'custom', message: 'Day progress cannot reference a future course revision' });
    }
    ids.push(day.id, ...day.blocks.map(block => block.id));
    const vocabularyIds = day.vocabulary.map(word => word.id);
    for (const word of day.vocabulary) {
      const payload = JSON.stringify(word);
      if (vocabularyById.has(word.id) && vocabularyById.get(word.id) !== payload) {
        context.addIssue({ code: 'custom', message: 'A shared vocabulary ID must preserve its canonical payload across days' });
      }
      vocabularyById.set(word.id, payload);
    }
    if (course.language === 'ja-JP' && day.vocabulary.some(word => !word.id.startsWith('ja.') || !word.reading || !word.exampleReading || word.gender)) {
      context.addIssue({ code: 'custom', message: 'Japanese vocabulary needs Japanese IDs, readings and no French gender metadata' });
    }
    if (new Set(vocabularyIds).size !== vocabularyIds.length) context.addIssue({ code: 'custom', message: 'Duplicate day vocabulary IDs' });
    if (!day.blocks.some(block => block.kind === 'choice') || !day.blocks.some(block => block.kind === 'vocabulary')) {
      context.addIssue({ code: 'custom', message: 'A pilot day needs vocabulary and interactive practice' });
    }
    const compact = day.compact;
    if (compact) {
      const choices = day.blocks.filter(block => block.kind === 'choice');
      if (day.blocks.filter(block => block.kind === 'dialogue').length !== 1
        || day.blocks.filter(block => block.kind === 'reflection').length !== 1
        || compact.practice.length !== choices.length
        || choices.some((block, index) => block.id !== compact.practice[index]?.blockId)) {
        context.addIssue({ code: 'custom', message: 'Compact days need one dialogue, one reflection and concise copy for every choice in order' });
      }
    }
    for (const block of day.blocks) if (block.kind === 'choice') {
      const choices = block.choices.map(choice => choice.id);
      if (new Set(choices).size !== choices.length || !choices.includes(block.answerId)) {
        context.addIssue({ code: 'custom', message: 'Choice answers must reference a unique available option' });
      }
    }
    if (day.blocks.some(block => canonicalCourseLessonStage(block.id))) {
      context.addIssue({ code: 'custom', message: 'Authored blocks must not use reserved lesson step IDs' });
    }
  }
  if (new Set(ids).size !== ids.length) context.addIssue({ code: 'custom', message: 'Duplicate course, source, unit, day or block IDs' });
});
export type OpenCourse = z.infer<typeof openCourseSchema>;
export type CourseDay = OpenCourse['days'][number];

/** Resolve a saved cursor or a legacy course link into the shared lesson reader. */
export function courseLessonStageForBlock(day: CourseDay, blockId: string | undefined): CourseLessonStage | undefined {
  const previous = day.blocks.find(block => block.id === blockId);
  return previous ? previousBlockStages[previous.kind] : canonicalCourseLessonStage(blockId);
}

/** Only explicitly unchanged days reuse an earlier release's immutable event scope. */
export function courseDayProgressRevision(course: OpenCourse, day: CourseDay): number {
  return day.progressRevision ?? course.revision;
}

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

/** Identify valid new-reader events without changing the saved event contract. */
export function courseLessonEventStage(event: CourseEvent): CourseLessonStage | undefined {
  const stage = canonicalCourseLessonStage(event.blockId);
  if (!stage) return undefined;
  if (event.kind === 'navigation') return stage;
  if (event.kind === 'study' && (stage === 'dialogue' || stage === 'vocabulary')) return stage;
  if (event.kind === 'choice' && (stage === 'picture' || stage === 'sentence') && event.choiceId === event.result) return stage;
  return undefined;
}

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
  const events = orderedEvents(inputs).filter(event => event.courseId === course.id && event.courseRevision === courseDayProgressRevision(course, day)
    && event.dayId === day.id);
  const completedBlockIds = new Set<string>();
  const supportedBlockIds = new Set<string>();
  let dialogueStudied = false;
  let compactFinished = false;
  let legacyCompletion = false;
  let lastBlockId = day.blocks[0].id;
  for (const event of events) {
    const block = blocks.get(event.blockId);
    if (!block) {
      if (!courseLessonEventStage(event)) continue;
      lastBlockId = event.blockId;
      if (event.kind === 'study' || (event.kind === 'choice' && event.result === 'correct')) completedBlockIds.add(event.blockId);
      if (event.kind === 'choice' && event.supported) supportedBlockIds.add(event.blockId);
      continue;
    }
    if (event.kind !== 'support' && event.kind !== 'completion') lastBlockId = block.id;
    if (event.kind === 'completion') legacyCompletion = true;
    if (day.compact && event.kind === 'study' && block.kind === 'dialogue') dialogueStudied = true;
    if (dialogueStudied && event.kind === 'completion' && block.kind === 'reflection') compactFinished = true;
    if (event.kind === 'support' || (event.kind === 'choice' && event.supported)) supportedBlockIds.add(block.id);
    if (event.kind === 'study' && ['study', 'vocabulary', 'dialogue'].includes(block.kind)) completedBlockIds.add(block.id);
    if (event.kind === 'reflection' && block.kind === 'reflection') completedBlockIds.add(block.id);
    if (event.kind === 'choice' && block.kind === 'choice' && event.result === 'correct'
      && block.choices.some(choice => choice.id === event.choiceId)
      && gradeCourseChoice(block, event.choiceId) === 'correct') completedBlockIds.add(block.id);
  }
  const allBlocksComplete = day.blocks.every(block => completedBlockIds.has(block.id));
  const lessonWordsStudied = completedBlockIds.has(courseLessonStageId('vocabulary'))
    || day.blocks.some(block => block.kind === 'vocabulary' && completedBlockIds.has(block.id));
  const lessonPictureDone = completedBlockIds.has(courseLessonStageId('picture'));
  const lessonSentenceDone = completedBlockIds.has(courseLessonStageId('sentence'));
  const lessonCompleted = lessonWordsStudied && lessonPictureDone && lessonSentenceDone;
  // Existing compact and full finishes keep their original requirements.
  const completed = lessonCompleted || compactFinished || (allBlocksComplete && legacyCompletion);
  return { completedBlockIds, supportedBlockIds, canComplete: lessonCompleted || allBlocksComplete || dialogueStudied,
    completed, lastBlockId, lessonWordsStudied, lessonPictureDone, lessonSentenceDone };
}

export function nextCourseDay(course: OpenCourse, events: readonly CourseEvent[]): CourseDay | undefined {
  return course.days.find(day => !courseDayProgress(course, day, events).completed);
}

/** Resume a deliberate visit, including a completed day; calendar time never skips material. */
export function resumeCourseDay(course: OpenCourse, inputs: readonly CourseEvent[]): CourseDay | undefined {
  const days = new Map(course.days.map(day => [day.id, day]));
  for (const event of orderedEvents(inputs).reverse()) {
    const day = days.get(event.dayId);
    if (day && event.courseId === course.id && event.courseRevision === courseDayProgressRevision(course, day)
      && (day.blocks.some(block => block.id === event.blockId) || courseLessonEventStage(event))) return day;
  }
  return nextCourseDay(course, inputs) ?? course.days.at(-1);
}
