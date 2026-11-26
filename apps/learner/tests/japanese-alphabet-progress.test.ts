import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { LearningEvent } from '@smartlingo/domain';
import { japaneseAlphabetLessons } from '@smartlingo/content';
import { alphabetLearningPath, alphabetProgress, isAlphabetLessonId } from '../src/alphabet/progress';

const now = Date.parse('2026-11-22T12:00:00Z');
function completion(index: number, overrides: Partial<LearningEvent> = {}): LearningEvent {
  const lesson = japaneseAlphabetLessons[index]!;
  return { id: crypto.randomUUID(), lessonId: lesson.id, revision: 1, itemId: `${lesson.id}.completion`,
    activity: 'completion', result: 'completed', hints: 0, occurredAt: '2026-11-22T10:00:00.000Z', ...overrides };
}

test('alphabet starts with Hiragana vowels and advances through Hiragana before Katakana', () => {
  assert.equal(alphabetProgress([], now).next?.id, 'ja.alphabet.hiragana.a');
  const studied = japaneseAlphabetLessons.flatMap((lesson, index) => lesson.script === 'hiragana' ? [completion(index)] : []);
  const result = alphabetProgress(studied, now);
  assert.equal(result.completed, alphabetLearningPath.filter(lesson => lesson.script === 'hiragana').length);
  assert.equal(result.next?.id, 'ja.alphabet.katakana.a');
  assert.equal(result.total, japaneseAlphabetLessons.length);
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
  assert.equal(result.completed, japaneseAlphabetLessons.length);
  assert.equal(result.next, undefined);
});


test('legacy twenty completions stay valid and lead into additive hiragana patterns', () => {
  const result = alphabetProgress(japaneseAlphabetLessons.slice(0, 20).map((_, index) => completion(index)), now);
  assert.equal(result.completed, 20);
  assert.equal(result.next?.id, 'ja.alphabet.hiragana.checkpoint.basic');
});

test('word practice resumes a deliberate unfinished group and counts only known successful tasks', () => {
  const lesson = japaneseAlphabetLessons.find(item => item.kind === 'checkpoint')!;
  const index = japaneseAlphabetLessons.indexOf(lesson);
  const task = lesson.practice![0]!;
  const attempt = completion(index, { activity: 'sentence', itemId: task.id, result: 'correct', hints: 1 });
  const invalid = [completion(index, { activity: 'sentence', itemId: 'unknown', result: 'correct' }),
    completion(index, { activity: 'sentence', itemId: lesson.practice![1]!.id, result: 'incorrect' }),
    completion(index, { activity: 'sentence', itemId: lesson.practice![2]!.id, result: 'correct', revision: 2 })];
  const result = alphabetProgress([attempt, attempt, ...invalid], now);
  assert.equal(result.completed, 0);
  assert.equal(result.next?.id, lesson.id);
  assert.deepEqual([...result.taskIds.get(lesson.id)!], [task.id]);
  assert.equal(alphabetProgress([attempt, completion(index)], now).next?.id, 'ja.alphabet.hiragana.a');
});
