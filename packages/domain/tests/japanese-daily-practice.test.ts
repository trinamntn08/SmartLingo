import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { getJapaneseDailyGuide, japaneseCourse, japaneseDailyGuides, japaneseDailyUnits } from '@smartlingo/content';
import { courseDayProgress, courseDayProgressRevision, courseEventSchema, coursePracticeProgress, japanesePracticeTaskSchema,
  learningBackupSchema, resumeCourseDay, type CourseEvent } from '../src';

const day = japaneseCourse.days[0];
const guide = getJapaneseDailyGuide(day.id)!;
function attempt(taskId: string, result: 'correct' | 'incorrect' | 'self-reviewed', changes: Partial<CourseEvent> = {}): CourseEvent {
  return courseEventSchema.parse({ id: randomUUID(), courseId: japaneseCourse.id, courseRevision: courseDayProgressRevision(japaneseCourse, day),
    dayId: day.id, blockId: 'lesson-sentence', occurredAt: '2026-11-26T12:00:00Z', kind: 'practice', taskId, result, supported: false, ...changes });
}

test('all 13 daily Can-do guides have original four-skill practice, script work and cumulative checkpoints', () => {
  assert.equal(japaneseDailyGuides.length, japaneseCourse.days.length);
  const ids = new Set<string>();
  for (const [index, courseDay] of japaneseCourse.days.entries()) {
    const item = getJapaneseDailyGuide(courseDay.id);
    assert.equal(item, japaneseDailyGuides[index]);
    assert.ok(item);
    assert.equal(item.canDos.length, 2);
    assert.ok(item.preparation && item.script && item.register && item.review);
    assert.deepEqual(new Set(item.tasks.map(task => task.skill)), new Set(['listening', 'reading', 'script', 'writing', 'speaking']));
    assert.equal(item.checkpoint.length, 2);
    for (const task of [...item.tasks, ...item.checkpoint]) {
      assert.deepEqual(japanesePracticeTaskSchema.parse(task), task);
      assert.ok(task.id.startsWith(`${courseDay.id}.`), task.id);
      assert.ok(!ids.has(task.id), task.id);
      ids.add(task.id);
      if (task.skill === 'listening') assert.ok(task.source?.text && task.source.reading && task.source.meaning, task.id);
      if (task.mode === 'self') assert.ok(task.modelMeaning && task.criteria.length >= 2, task.id);
    }
  }
  assert.equal(ids.size, 91);
  assert.equal(japaneseDailyUnits.length, 3);
  assert.deepEqual(japaneseDailyUnits.flatMap(unit => unit.dayIds), japaneseCourse.days.map(day => day.id));
  assert.equal(getJapaneseDailyGuide('fr.open-course-pilot.day-1'), undefined);
});

test('daily practice persists distinct supported, graded and self-reviewed activity and ignores foreign task/scope', () => {
  const tasks = [...guide.tasks, ...guide.checkpoint];
  const listen = tasks.find(task => task.skill === 'listening')!;
  const self = tasks.find(task => task.mode === 'self')!;
  const events = [
    attempt(listen.id, 'incorrect'), attempt(listen.id, 'correct', { supported: true }), attempt(self.id, 'self-reviewed'),
    attempt(tasks[1].id, 'self-reviewed'), // Cannot mark a graded task as self-reviewed.
    attempt(tasks[2].id, 'correct', { dayId: japaneseCourse.days[1].id }),
    attempt(tasks[2].id, 'correct', { courseRevision: 999 }),
    attempt(tasks[2].id, 'correct', { courseId: 'fr.open-course-pilot' }),
    attempt(tasks[2].id, 'correct', { blockId: 'lesson-picture' }),
    attempt('ja.everyday-course.day-2.practice.listen', 'correct'),
    attempt('ja.everyday-course.day-1.practice.unknown', 'correct'),
    attempt(self.id, 'correct'), // Self assessment never becomes an automatically graded answer.
  ];
  const progress = coursePracticeProgress(japaneseCourse, day, tasks, events);
  assert.deepEqual(progress.completedIds, new Set([listen.id, self.id]));
  assert.deepEqual(progress.supportedIds, new Set([listen.id]));
  assert.deepEqual(progress.attemptedIds, new Set([listen.id, self.id]));
  assert.equal(progress.completed, false);
});

test('supplementary attempts cannot complete a study day or shadow its saved step/day cursor', () => {
  const second = japaneseCourse.days[1];
  const nav: CourseEvent = { id: randomUUID(), courseId: japaneseCourse.id, courseRevision: courseDayProgressRevision(japaneseCourse, second),
    dayId: second.id, blockId: 'lesson-vocabulary', occurredAt: '2026-11-26T10:00:00Z', kind: 'navigation' };
  const events = [nav, ...guide.tasks.map(task => attempt(task.id, task.mode === 'self' ? 'self-reviewed' : 'correct'))];
  assert.equal(courseDayProgress(japaneseCourse, day, events).completedBlockIds.size, 0);
  assert.equal(courseDayProgress(japaneseCourse, day, events).completed, false);
  assert.equal(resumeCourseDay(japaneseCourse, events)?.id, second.id);
  assert.equal(courseDayProgress(japaneseCourse, second, events).lastBlockId, 'lesson-vocabulary');
});

test('legacy full-course completion survives additive Can-do practice without inventing checkpoint activity', () => {
  const events: CourseEvent[] = day.blocks.map((block, index) => courseEventSchema.parse({ id: randomUUID(), courseId: japaneseCourse.id,
    courseRevision: courseDayProgressRevision(japaneseCourse, day), dayId: day.id, blockId: block.id,
    occurredAt: new Date(Date.UTC(2026, 10, 19, 9, index)).toISOString(),
    ...(block.kind === 'choice' ? { kind: 'choice', choiceId: block.answerId, result: 'correct', supported: false }
      : { kind: block.kind === 'reflection' ? 'reflection' : 'study' }),
  }));
  events.push({ ...events[0], id: randomUUID(), kind: 'completion' });
  assert.equal(courseDayProgress(japaneseCourse, day, events).completed, true);
  assert.equal(coursePracticeProgress(japaneseCourse, day, guide.checkpoint, events).completedIds.size, 0);
  events.push(attempt(guide.tasks[0].id, 'incorrect'));
  assert.equal(courseDayProgress(japaneseCourse, day, events).completed, true);
});

test('v4 backup reads old course events and round-trips additive practice without raw responses', () => {
  const saved = [attempt(guide.tasks[0].id, 'correct', { supported: true })];
  const backup = { format: 'smartlingo-learning-backup', version: 4, createdAt: '2026-11-26T12:00:00Z',
    notebook: [], events: [], publishedLessons: [], reviewEvents: [], courseEvents: saved };
  const parsed = learningBackupSchema.parse(backup);
  assert.deepEqual(parsed.courseEvents, saved);
  assert.deepEqual(learningBackupSchema.parse({ ...backup, courseEvents: [] }).courseEvents, []);
  assert.equal(JSON.stringify(parsed).includes('model'), false);
  assert.equal(JSON.stringify(parsed).includes('draft'), false);
});
