import { test } from 'node:test';
import assert from 'node:assert/strict';
import { japaneseCourse, japaneseLessons, lessons } from '@smartlingo/content';
import { checkAnswer, lessonProgress, lessonSchema, matchesVocabulary, notebookLanguage, type Lesson, type LearningEvent } from '../src';

function canBuild(lesson: Lesson, chosen: string[] = [], remaining = lesson.sentenceActivity.tokens): boolean {
  if (!remaining.length) return checkAnswer(chosen.join(' '), lesson.sentenceActivity) === 'correct';
  const prefix = chosen.join(' ');
  if (prefix && !lesson.sentenceActivity.answers.some(answer => answer === prefix || answer.startsWith(`${prefix} `))) return false;
  return remaining.some((token, index) => canBuild(lesson, [...chosen, token], remaining.filter((_, at) => at !== index)));
}

test('all existing Japanese days use the shared Lesson contract with unchanged teaching vocabulary/dialogue', () => {
  assert.equal(japaneseLessons.length, japaneseCourse.days.length);
  assert.equal(new Set([...lessons, ...japaneseLessons].map(lesson => lesson.id)).size, lessons.length + japaneseLessons.length);
  for (const [index, lesson] of japaneseLessons.entries()) {
    assert.deepEqual(lessonSchema.parse(lesson), lesson);
    assert.equal(lesson.language, 'ja-JP'); assert.equal(lesson.status, 'draft');
    const day = japaneseCourse.days[index];
    assert.equal(lesson.level, day.level);
    assert.deepEqual(lesson.vocabulary, day.vocabulary);
    assert.deepEqual(lesson.dialogue, day.blocks.find(block => block.kind === 'dialogue')!.lines);
    assert.ok(canBuild(lesson), `${lesson.id}: a sentence must use all supplied tokens`);
    assert.equal(lesson.pictureActivity.mode, 'meaning');
    assert.equal(new Set(lesson.pictureActivity.choices).size, lesson.pictureActivity.choices.length);
    assert.ok(matchesVocabulary(lesson.vocabulary[0], lesson.vocabulary[0].reading!));
  }
});

test('language scoping preserves legacy French notes and separates Japanese lesson progress', () => {
  const base = { id: 'personal.test', sourceEntryId: 'personal.test', target: 'a', meaning: 'b', example: '', updatedAt: '2026-11-21T10:00:00Z' };
  assert.equal(notebookLanguage(base), 'fr-FR');
  assert.equal(notebookLanguage({ ...base, language: 'ja-JP' }), 'ja-JP');
  const japanese = japaneseLessons[0];
  const event: LearningEvent = { id: '90ba1d03-faba-4bfa-aa16-d002351a597c', lessonId: japanese.id, revision: 1,
    itemId: japanese.id, activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: base.updatedAt };
  assert.equal(lessonProgress(japanese, [event]).viewedIds.size, japanese.vocabulary.length);
  assert.equal(lessonProgress(lessons[0], [event]).viewedIds.size, 0);
  assert.equal(lessonProgress({ ...japanese, revision: 2 }, [event]).viewedIds.size, 0);
});
