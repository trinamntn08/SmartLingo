import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { checkJapaneseAnswer, completedJapanesePracticeIds, japanesePracticeTaskSchema, learningBackupSchema, type JapanesePracticeTask } from '../src/index';
import { japaneseLessons } from '@smartlingo/content';

function typed(focus: Extract<JapanesePracticeTask, { mode: 'text' }>['focus'], answers: string[]) {
  return { mode: 'text', id: 'ja.test.reading', prompt: 'Type the answer.', feedback: 'Correct.', retry: 'Try again.', focus, answers } as const;
}

test('Japanese grading keeps sound and script distinctions while accepting reviewed presentation variants', () => {
  const meaning = japanesePracticeTaskSchema.parse(typed('meaning', ['今日', 'きょう']));
  const hiragana = japanesePracticeTaskSchema.parse(typed('hiragana', ['きって']));
  const katakana = japanesePracticeTaskSchema.parse(typed('katakana', ['ビール']));
  const kanji = japanesePracticeTaskSchema.parse(typed('kanji', ['駅']));
  assert(meaning.mode === 'text' && hiragana.mode === 'text' && katakana.mode === 'text' && kanji.mode === 'text');
  for (const answer of ['今日。', ' きょう！？ ', 'き　ょう']) assert(checkJapaneseAnswer(answer, meaning));
  for (const answer of ['kyō', 'きょ', '明日']) assert(!checkJapaneseAnswer(answer, meaning));
  assert(checkJapaneseAnswer('きっ て。', hiragana));
  for (const answer of ['きて', 'きつて', 'キッテ', '切手']) assert(!checkJapaneseAnswer(answer, hiragana));
  assert(checkJapaneseAnswer('ﾋﾞｰﾙ。', katakana));
  assert(!checkJapaneseAnswer('ビル', katakana));
  assert(!checkJapaneseAnswer('ヒール', katakana));
  assert(!checkJapaneseAnswer('えき', kanji));
  assert(checkJapaneseAnswer('駅', kanji));
});

test('content rejects wrong-script keys, incomplete listening sources and unordered furigana', () => {
  assert.equal(japanesePracticeTaskSchema.safeParse(typed('katakana', ['こーひー'])).success, false);
  assert.equal(japanesePracticeTaskSchema.safeParse({ ...typed('hiragana', ['ねこ']), skill: 'listening' }).success, false);
  assert.equal(japanesePracticeTaskSchema.safeParse({ ...typed('hiragana', ['ねこ']), source: {
    text: '駅前', ruby: [{ base: '前', reading: 'まえ' }, { base: '駅', reading: 'えき' }],
  } }).success, false);
});

test('task completion derives from valid events and keeps earlier backups readable', () => {
  const lesson = japaneseLessons[0];
  const task = lesson.japanesePractice!.tasks.find(task => task.mode === 'text')!;
  const event = { id: '12e30e64-918c-43a2-9dda-362667389880', lessonId: lesson.id, revision: lesson.revision,
    itemId: task.id, activity: 'practice', result: 'correct', hints: 1, occurredAt: '2026-11-26T00:00:00Z' } as const;
  const backup = { format: 'smartlingo-learning-backup', version: 4, createdAt: event.occurredAt,
    events: [], notebook: [], publishedLessons: [], reviewEvents: [], courseEvents: [] };
  assert(learningBackupSchema.safeParse(backup).success);
  const restored = learningBackupSchema.parse({ ...backup, events: [event] });
  assert.deepEqual(completedJapanesePracticeIds(lesson, restored.events), [task.id]);
  assert.deepEqual(completedJapanesePracticeIds(lesson, [{ ...event, revision: lesson.revision + 1 }]), []);
  assert.deepEqual(completedJapanesePracticeIds(lesson, [{ ...event, result: 'incorrect' }]), []);
});
