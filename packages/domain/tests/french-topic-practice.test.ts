import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frenchTopicPractice, getFrenchTopicPractice, japaneseLessons, lessons, openCoursePilot } from '@smartlingo/content';
import { normalizeAnswer } from '@smartlingo/domain';

test('French topic drafts each have one original, level-specific production task', () => {
  assert.deepEqual(Object.keys(frenchTopicPractice).sort(), lessons.map(lesson => lesson.id).sort());
  const prompts = new Set<string>();
  for (const lesson of lessons) {
    const task = getFrenchTopicPractice(lesson);
    assert.ok(task, lesson.id);
    for (const value of [task.prompt, task.modelTarget, task.modelMeaning, task.check]) {
      assert.ok(value.trim() && value === value.trim(), lesson.id);
    }
    assert.ok(!prompts.has(task.prompt), lesson.id);
    prompts.add(task.prompt);
    assert.ok(!lesson.sentenceActivity.answers.some(answer => normalizeAnswer(answer) === normalizeAnswer(task.modelTarget)), lesson.id);
    assert.equal(getFrenchTopicPractice({ ...lesson, status: 'published' }), undefined);
    assert.equal(getFrenchTopicPractice({ ...lesson, revision: lesson.revision + 1 }), undefined);
  }
  assert.ok(japaneseLessons.every(lesson => !getFrenchTopicPractice(lesson)));
});

test('French guided lessons retain the authored blocks used by legacy course routes', () => {
  for (const day of openCoursePilot.days) {
    const choices = day.blocks.filter(block => block.kind === 'choice');
    assert.equal(choices.length, 3, day.id);
    assert.deepEqual(day.compact?.practice.map(item => item.blockId), choices.map(block => block.id));
    assert.equal(day.blocks.filter(block => block.kind === 'reflection').length, 1, day.id);
  }
});
