import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, lessonProgress, lessonSchema, type LearningEvent } from '../src/index';
import { lessons, restaurantLesson } from '@smartlingo/content';

test('all draft lessons validate; bad references and duplicate IDs are rejected', () => {
  assert.ok(lessons.length >= 60);
  for (const lesson of lessons) assert.equal(lessonSchema.parse(lesson).status, 'draft');
  assert.equal(lessonSchema.safeParse({ ...restaurantLesson, pictureActivity: { ...restaurantLesson.pictureActivity, entryId: 'missing.id' } }).success, false);
  assert.equal(lessonSchema.safeParse({ ...restaurantLesson, vocabulary: Array(6).fill(restaurantLesson.vocabulary[0]) }).success, false);
});

test('sentence checking accepts alternatives and apostrophes but keeps meaningful accents', () => {
  const exercise = restaurantLesson.sentenceActivity;
  assert.equal(checkAnswer("  JE   voudrais un café s'il vous plaît. ", exercise), 'correct');
  assert.equal(checkAnswer('S’il vous plaît je voudrais un café', exercise), 'correct');
  assert.equal(checkAnswer('Je voudrais un cafe s’il vous plait', exercise), 'almost');
  assert.equal(checkAnswer('Je un café voudrais s’il vous plaît', exercise), 'incorrect');
  const distinction = { ...exercise, answers: ['Il est là'], almostAnswers: [] };
  assert.equal(checkAnswer('Il est la', distinction), 'incorrect');
});

test('progress belongs to a content revision and completion does not imply proficiency', () => {
  const event: LearningEvent = { id: '77777777-7777-4777-8777-777777777777', lessonId: restaurantLesson.id, revision: 1, itemId: 'fr.cafe', activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: '2026-11-14T12:00:00Z' };
  const progress = lessonProgress(restaurantLesson, [event, { ...event, revision: 2, activity: 'completion', result: 'completed' }]);
  assert.ok(progress.viewedIds.has('fr.cafe'));
  assert.equal(progress.completed, false);
  assert.equal(progress.pictureDone, false);
  assert.equal(progress.sentenceDone, false);
});

test('explicit vocabulary overview review covers one revision without implying exercise completion', () => {
  const overview: LearningEvent = { id: '88888888-8888-4888-8888-888888888888', lessonId: restaurantLesson.id, revision: 1,
    itemId: restaurantLesson.id, activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: '2026-11-14T12:00:00Z' };
  assert.equal(lessonProgress(restaurantLesson, []).viewedIds.size, 0);
  assert.deepEqual([...lessonProgress(restaurantLesson, [overview]).viewedIds], restaurantLesson.vocabulary.map(entry => entry.id));
  assert.equal(lessonProgress(restaurantLesson, [overview]).completed, false);
  assert.equal(lessonProgress(restaurantLesson, [overview]).pictureDone, false);
  assert.equal(lessonProgress(restaurantLesson, [overview]).sentenceDone, false);
  assert.equal(lessonProgress({ ...restaurantLesson, revision: 2 }, [overview]).viewedIds.size, 0);
  assert.equal(lessonProgress({ ...restaurantLesson, id: 'fr.other.lesson' }, [overview]).viewedIds.size, 0);
});
