import { openCourseSchema, type CourseDay, type Lesson, type OpenCourse } from '@smartlingo/domain';
import type { FrenchTransferTask } from './french-practice/types';

type DraftLevel = 'A1' | 'A2' | 'B1';
type DraftTasks = Readonly<Partial<Record<string, FrenchTransferTask>>>;

export function buildFrenchCourses(opening: OpenCourse, drafts: Record<DraftLevel, readonly Lesson[]>, tasks: DraftTasks) {
  const lessonsByDay = new Map<string, Lesson>();

  function addDays(courseId: string, lessons: readonly Lesson[], offset = 0): CourseDay[] {
    return lessons.map((lesson, index) => {
      const dayNumber = offset + index + 1;
      const id = `${courseId}.day-${dayNumber}`;
      const task = tasks[lesson.id];
      const match = lesson.pictureActivity;
      if (!task || !lesson.grammar || match.mode !== 'meaning') {
        throw new Error(`Incomplete French course draft: ${lesson.id}`);
      }
      lessonsByDay.set(id, lesson);
      return {
        id, dayNumber, progressRevision: lesson.revision, title: lesson.title, level: lesson.level,
        outcome: lesson.outcome, vocabulary: lesson.vocabulary,
        blocks: [
          { id: `${id}.study`, kind: 'study', ...lesson.grammar, examples: lesson.dialogue.slice(0, 2) },
          { id: `${id}.vocabulary`, kind: 'vocabulary', title: 'Key phrases' },
          { id: `${id}.dialogue`, kind: 'dialogue', title: 'Dialogue',
            explanation: lesson.outcome, lines: lesson.dialogue },
          {
            id: `${id}.meaning`, kind: 'choice', title: 'Recognise a key phrase',
            prompt: `Choose the French for “${lesson.vocabulary.find(word => word.id === match.entryId)!.meaning}”.`,
            choices: lesson.vocabulary.filter(word => match.choices.includes(word.id)),
            answerId: match.entryId, feedback: 'Check how the phrase is used in the dialogue or key phrases.',
            hint: 'Think about the meaning in the situation before choosing.',
          },
          { id: `${id}.response`, kind: 'reflection', title: 'Try it in a new situation',
            prompt: task.prompt, modelTarget: task.modelTarget, modelMeaning: task.modelMeaning, checklist: [task.check] },
        ],
      };
    });
  }

  function startCourse(id: string, title: string, unitTitle: string, outcome: string, level: 'A2' | 'B1'): OpenCourse {
    const days = addDays(id, drafts[level]);
    return openCourseSchema.parse({
      id, title, description: outcome, language: 'fr-FR', explanationLanguage: 'en',
      revision: 1, status: 'draft',
      provenance: {
        author: 'SmartLingo, with AI-assisted lesson drafting.',
        rights: 'Original SmartLingo lesson text, dialogues and practice.',
        review: 'Starter unit for owner and qualified French review. Levels are task estimates.',
      },
      sources: [],
      units: [{ id: `${id}.unit-1`, title: unitTitle, outcome, dayIds: days.map(day => day.id) }],
      days,
    });
  }

  const newA1 = addDays(opening.id, drafts.A1, opening.days.length);
  const firstUnit = opening.units![0];
  const a1 = openCourseSchema.parse({
    ...opening, revision: opening.revision + 1,
    description: 'Practise your first conversations at a workshop and find your way around the neighbourhood.',
    units: [
      { ...firstUnit, outcome: 'Check in at a workshop and confirm the time and room.',
        dayIds: [...firstUnit.dayIds, ...newA1.slice(0, 2).map(day => day.id)] },
      { id: `${opening.id}.unit-2`, title: 'Get around your neighbourhood',
        outcome: 'Ask where to find a local service and describe where it is using a landmark.',
        dayIds: newA1.slice(2).map(day => day.id) },
    ],
    days: [...opening.days, ...newA1],
  });
  const a2 = startCourse('fr.course-a2', 'French A2: Everyday independence', 'Change an appointment',
    'Move an appointment, explain a conflict, suggest another time and verify the new details.', 'A2');
  const b1 = startCourse('fr.course-b1', 'French B1: Explain, solve and participate', 'Get there when plans change',
    'Understand a transport disruption, compare routes and explain your revised plans.', 'B1');
  return { courses: [a1, a2, b1] as const, lessonsByDay: lessonsByDay as ReadonlyMap<string, Lesson> };
}
