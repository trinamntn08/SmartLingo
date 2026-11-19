import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { japaneseCourse, openCoursePilot } from '@smartlingo/content';
import { openCourseSchema, courseDayProgress, nextCourseDay, gradeCourseChoice, normalizeSearch, type CourseEvent } from '../src';

test('notebook search folds French accents without collapsing Japanese voiced kana', () => {
  assert.equal(normalizeSearch('ÉCOLE'), 'ecole');
  assert.equal(normalizeSearch('かぎ'), normalizeSearch('かき\u3099'));
  assert.notEqual(normalizeSearch('かぎ'), normalizeSearch('かき'));
  assert.notEqual(normalizeSearch('ぱん'), normalizeSearch('はん'));
});

test('Japanese route retains original draft provenance, script support and progressively richer B1 tasks', () => {
  const course = openCourseSchema.parse(japaneseCourse);
  assert.equal(course.language, 'ja-JP');
  assert.equal(course.status, 'draft');
  assert.equal(course.sources.length, 0);
  assert.match(course.provenance!.review, /review/i);
  assert.deepEqual(course.days.map(day => day.level), ['foundation', ...Array(4).fill('A1'), ...Array(4).fill('A2'), ...Array(4).fill('B1')]);
  for (const day of course.days) {
    assert.ok(day.vocabulary.length >= 6 && day.vocabulary.length <= 10);
    for (const word of day.vocabulary) {
      assert.match(word.id, /^ja\./);
      assert.ok(word.reading && word.exampleReading);
      assert.ok(word.meaning && word.exampleMeaning && word.note);
    }
    assert.ok(day.blocks.some(block => block.kind === 'dialogue'));
    assert.ok(day.blocks.some(block => block.kind === 'reflection'));
    assert.ok(day.blocks.filter(block => block.kind === 'choice').length >= 2);
    for (const block of day.blocks) if (block.kind === 'choice') {
      assert.equal(gradeCourseChoice(block, block.answerId), 'correct');
      for (const wrong of block.choices.filter(choice => choice.id !== block.answerId)) {
        assert.equal(gradeCourseChoice(block, wrong.id), 'incorrect');
      }
    }
  }
  const first = course.days[0];
  assert.equal(openCourseSchema.safeParse({ ...course, provenance: undefined }).success, false);
  assert.equal(openCourseSchema.safeParse({ ...course, days: [{ ...first, vocabulary: first.vocabulary.map(word => ({ ...word, reading: undefined })) }] }).success, false);
  const collision = { ...course.days[1], vocabulary: [
    { ...first.vocabulary[0], meaning: 'A different meaning under the same ID' }, ...course.days[1].vocabulary.slice(1),
  ] };
  assert.equal(openCourseSchema.safeParse({ ...course, days: [first, collision] }).success, false);
});

test('Japanese study progresses across days independently of French, with explicit completion and revision isolation', () => {
  const course = japaneseCourse;
  const day = course.days[0];
  const events: CourseEvent[] = day.blocks.map((block, index) => ({
    id: randomUUID(), courseId: course.id, courseRevision: course.revision, dayId: day.id, blockId: block.id,
    occurredAt: new Date(Date.UTC(2026, 10, 19, 9, index)).toISOString(),
    ...(block.kind === 'choice' ? { kind: 'choice' as const, choiceId: block.answerId, result: 'correct' as const, supported: false }
      : { kind: block.kind === 'reflection' ? 'reflection' as const : 'study' as const }),
  }));
  assert.equal(courseDayProgress(course, day, events).canComplete, true);
  assert.equal(courseDayProgress(course, day, events).completed, false);
  const completed: CourseEvent[] = [...events, { ...events[0], id: randomUUID(), kind: 'completion' }];
  assert.equal(nextCourseDay(course, completed)?.id, course.days[1].id);
  assert.equal(courseDayProgress(openCoursePilot, openCoursePilot.days[0], completed).completedBlockIds.size, 0);
  assert.equal(courseDayProgress({ ...course, revision: 2 }, day, completed).completedBlockIds.size, 0);
  const b1 = course.days.find(item => item.level === 'B1')!;
  assert.equal(courseDayProgress(course, b1, completed).completedBlockIds.size, 0);
});
