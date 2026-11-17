import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { openCoursePilot, lessons } from '@smartlingo/content';
import { openCourseSchema, courseEventSchema, courseDayProgress, nextCourseDay, gradeCourseChoice, type CourseEvent } from '../src';

const course = openCoursePilot;
const day = course.days[0];
const event = (blockId: string, fields: Record<string, unknown> = {}): CourseEvent => courseEventSchema.parse({
  id: randomUUID(), courseId: course.id, courseRevision: course.revision, dayId: day.id,
  blockId, occurredAt: '2026-11-17T09:00:00Z', kind: 'study', ...fields,
});

test('pilot is an explicitly scoped draft with exact canonical support and complete attribution', () => {
  assert.equal(openCourseSchema.parse(course).status, 'draft');
  assert.equal(course.days.length, 1);
  assert.equal(day.vocabulary.length >= 6 && day.vocabulary.length <= 10, true);
  for (const word of day.vocabulary) {
    const canonical = lessons.flatMap(lesson => lesson.vocabulary).find(entry => entry.id === word.id);
    assert.deepEqual(word, canonical);
  }
  for (const source of course.sources) {
    assert.equal(source.license, 'CC-BY-4.0');
    assert.match(source.sourceUrl, /^https:\/\/opentextbc.ca\/francaisinteractif\//);
    assert.match(source.copyrightNotice, /2023/);
    assert.match(source.creator, /Mirabelle Tinio/);
    assert.ok(source.changes.length > 10 && source.scope.length > 10);
    assert.ok(source.excludedAssets.length > 0);
  }
  assert.throws(() => openCourseSchema.parse({ ...course, sources: [{ ...course.sources[0], license: 'unknown' }] }));
  assert.throws(() => openCourseSchema.parse({ ...course, sources: [{ ...course.sources[0], sourceUrl: 'http://insecure.example' }] }));
  const first = day.blocks[0];
  assert.throws(() => openCourseSchema.parse({ ...course, days: [{ ...day, blocks: [first, ...day.blocks] }] }));
});

test('choice validation rejects unavailable answers and schema rejects broken answer references', () => {
  for (const block of day.blocks) if (block.kind === 'choice') {
    assert.equal(gradeCourseChoice(block, block.answerId), 'correct');
    const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
    assert.equal(gradeCourseChoice(block, wrong.id), 'incorrect');
    assert.throws(() => gradeCourseChoice(block, 'not-an-option'));
    const invalid = { ...day, blocks: day.blocks.map(item => item.id === block.id ? { ...block, answerId: 'missing.option' } : item) };
    assert.throws(() => openCourseSchema.parse({ ...course, days: [invalid] }));
  }
});

test('navigation and unsupported completion do not award study; each required activity must be recorded', () => {
  const first = day.blocks[0];
  const partial = [event(first.id, { kind: 'navigation' }), event(first.id, { kind: 'completion' })];
  assert.equal(courseDayProgress(course, day, partial).completed, false);
  assert.equal(courseDayProgress(course, day, partial).completedBlockIds.size, 0);
  assert.equal(nextCourseDay(course, partial)?.id, day.id);
  const activities = day.blocks.map(block => event(block.id, block.kind === 'choice'
    ? { kind: 'choice', choiceId: block.answerId, result: 'correct', supported: false }
    : block.kind === 'reflection' ? { kind: 'reflection' } : {}));
  assert.equal(courseDayProgress(course, day, activities).canComplete, true);
  assert.equal(courseDayProgress(course, day, activities).completed, false);
  const completed = [...activities, event(first.id, { kind: 'completion' })];
  assert.equal(courseDayProgress(course, day, completed).completed, true);
  assert.equal(nextCourseDay(course, completed), undefined);
  assert.equal(courseDayProgress({ ...course, revision: course.revision + 1 }, day, completed).completed, false);
});

test('wrong answers, forged result flags, unrelated blocks and other revisions cannot complete practice', () => {
  const block = day.blocks.find(item => item.kind === 'choice')!;
  assert.equal(block.kind, 'choice');
  if (block.kind !== 'choice') return;
  const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
  for (const attempt of [
    event(block.id, { kind: 'choice', choiceId: wrong.id, result: 'incorrect', supported: false }),
    event(block.id, { kind: 'choice', choiceId: wrong.id, result: 'correct', supported: false }),
    event(block.id, { kind: 'choice', choiceId: 'unknown.option', result: 'correct', supported: false }),
    event(block.id, { kind: 'choice', choiceId: block.answerId, result: 'correct', supported: false, courseRevision: course.revision + 1 }),
    event('missing.block'),
  ]) assert.equal(courseDayProgress(course, day, [attempt]).completedBlockIds.size, 0);
});

test('resume is chronological across timezone offsets; hints survive reload and retries are idempotent', () => {
  const first = event(day.blocks[0].id, { kind: 'navigation', occurredAt: '2026-11-17T11:00:00+02:00' });
  const later = event(day.blocks[1].id, { kind: 'navigation', occurredAt: '2026-11-17T09:01:00Z' });
  const choice = day.blocks.find(block => block.kind === 'choice')!;
  const hint = event(choice.id, { kind: 'support' });
  const progress = courseDayProgress(course, day, [later, first, later, hint]);
  assert.equal(progress.lastBlockId, later.blockId);
  assert.equal(progress.supportedBlockIds.has(choice.id), true);
  assert.throws(() => courseDayProgress(course, day, [first, { ...first, blockId: later.blockId }]), /Conflicting/);
});
