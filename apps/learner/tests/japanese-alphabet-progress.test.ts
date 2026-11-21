import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { LearningEvent } from '@smartlingo/domain';
import { japaneseAlphabetLessons } from '@smartlingo/content';
import { alphabetProgress, isAlphabetLessonId } from '../src/alphabet/progress';

const now = Date.parse('2026-11-22T12:00:00Z');
function completion(index: number, overrides: Partial<LearningEvent> = {}): LearningEvent {
  const lesson = japaneseAlphabetLessons[index]!;
  return { id: crypto.randomUUID(), lessonId: lesson.id, revision: 1, itemId: `${lesson.id}.completion`,
    activity: 'completion', result: 'completed', hints: 0, occurredAt: '2026-11-22T10:00:00.000Z', ...overrides };
}

test('alphabet starts with Hiragana vowels and advances through Hiragana before Katakana', () => {
  assert.equal(alphabetProgress([], now).next?.id, 'ja.alphabet.hiragana.a');
  const studied = japaneseAlphabetLessons.filter(lesson => lesson.script === 'hiragana').map((_, index) => completion(index));
  const result = alphabetProgress(studied, now);
  assert.equal(result.completed, 10);
  assert.equal(result.next?.id, 'ja.alphabet.katakana.a');
  assert.equal(result.total, 20);
});

test('only valid current alphabet row completions count; history is neither rewritten nor mistaken for word study', () => {
  const valid = completion(0);
  const events = [valid, valid, completion(0), completion(1, { revision: 2 }),
    completion(2, { activity: 'vocabulary', result: 'viewed' }), completion(3, { itemId: 'other' }),
    completion(4, { occurredAt: '2026-11-23T00:00:00.000Z' }), completion(5, { lessonId: 'fr.restaurant.customer' })];
  const before = structuredClone(events);
  const result = alphabetProgress(events, now);
  assert.equal(result.completed, 1);
  assert.equal(result.next?.id, japaneseAlphabetLessons[1]!.id);
  assert.deepEqual(events, before);
  assert.equal(isAlphabetLessonId('ja.lesson.day-1'), false);
  assert.equal(isAlphabetLessonId(valid.lessonId), true);
});

test('all studied rows remain revisitable and do not invent a next lesson', () => {
  const result = alphabetProgress(japaneseAlphabetLessons.map((_, index) => completion(index)), now);
  assert.equal(result.completed, 20);
  assert.equal(result.next, undefined);
});
