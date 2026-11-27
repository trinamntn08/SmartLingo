import { test } from 'node:test';
import assert from 'node:assert/strict';
import { japaneseLessons } from '@smartlingo/content';
import { checkJapaneseAnswer, japanesePracticeSetSchema } from '../src';

test('all 69 topic lessons have distinct practical responses and a bounded taught reading check', () => {
  assert.equal(japaneseLessons.length, 69);
  const taskIds = new Set<string>();
  const transferPrompts = new Set<string>();
  for (const lesson of japaneseLessons) {
    const practice = lesson.japanesePractice;
    assert.ok(practice, lesson.id);
    assert.deepEqual(japanesePracticeSetSchema.parse(practice), practice, lesson.id);
    assert.ok(practice.prerequisites && practice.revisit, lesson.id);
    const transfer = practice.tasks.filter(task => task.mode === 'self');
    assert.equal(transfer.length, 1, lesson.id);
    assert.ok(transfer[0].criteria.length >= 3 && transfer[0].model, lesson.id);
    assert.ok(!transferPrompts.has(transfer[0].prompt), `${lesson.id}: repeated transfer situation`);
    transferPrompts.add(transfer[0].prompt);
    const reading = practice.tasks.find(task => task.mode === 'text');
    assert.ok(reading?.mode === 'text' && reading.focus === 'hiragana', lesson.id);
    const word = lesson.vocabulary.find(word => word.target === reading.source?.text);
    assert.ok(word?.reading, lesson.id);
    assert.deepEqual(reading.answers, [word.reading], lesson.id);
    assert.equal(checkJapaneseAnswer(word.reading, reading), true, lesson.id);
    assert.equal(checkJapaneseAnswer('This has a similar meaning.', reading), false, lesson.id);
    for (const task of practice.tasks) {
      assert.ok(!taskIds.has(task.id), `duplicate task ID: ${task.id}`);
      taskIds.add(task.id);
    }
  }
  assert.equal(transferPrompts.size, 69);
  assert.equal(taskIds.size, 154);
});

test('every topic bank closes with a fresh source-based cumulative checkpoint', () => {
  const checkpoints = japaneseLessons.filter(lesson => lesson.japanesePractice?.checkpoint);
  assert.equal(checkpoints.length, 16);
  const taughtTexts = new Set(japaneseLessons.flatMap(lesson => [
    ...lesson.dialogue.map(turn => turn.target), ...lesson.vocabulary.map(word => word.example),
  ]));
  for (let day = 1; day <= 13; day += 1) {
    assert.ok(checkpoints.some(lesson => lesson.id === `ja.lesson.day-${day}.words-5`), `missing bank ${day}`);
  }
  for (const lesson of checkpoints) {
    const task = lesson.japanesePractice!.tasks.find(task => task.mode === 'choice');
    assert.ok(task?.mode === 'choice' && task.source?.reading && task.source.meaning, lesson.id);
    assert.ok(task.source.ruby?.length, `${lesson.id}: missing authored furigana`);
    assert.ok(!/\p{Script=Han}/u.test(task.source.reading), `${lesson.id}: reading contains kanji`);
    assert.ok(!taughtTexts.has(task.source.text), `${lesson.id}: checkpoint repeats a taught text`);
    assert.equal(task.choices.filter(choice => choice === task.answer).length, 1, lesson.id);
    assert.ok(lesson.japanesePractice!.tasks.some(task => task.mode === 'self' && task.prompt.startsWith('Checkpoint:')), lesson.id);
  }
  const positions = new Set(checkpoints.map(lesson => {
    const task = lesson.japanesePractice!.tasks.find(task => task.mode === 'choice');
    return task?.mode === 'choice' ? task.choices.indexOf(task.answer) : -1;
  }));
  assert.equal(positions.size, 3, 'answers should not all occupy one predictable position');
});
