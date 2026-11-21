import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lessons, japaneseCourse, japaneseLessons } from '@smartlingo/content';
import { checkAnswer, groupLessonTopics, lessonSchema, matchesVocabulary, normalizeSearch, type Lesson, type Vocabulary } from '../src';

const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const targetKey = (target: string) => normalizeSearch(target.normalize('NFKC')).replace(/[\s。、.!?！？]/g, '');
const coreLessons = () => japaneseLessons.filter(lesson => /^ja\.lesson\.day-\d+$/.test(lesson.id));

test('expanding Japanese banks preserves French and every original Japanese course/lesson payload', () => {
  assert.equal(hash(lessons), '0354161d5f3fadeefbab8f58ed6bc95c6145afd38b51bb185643fe8e53abb49e');
  assert.equal(hash(coreLessons()), '5ded03ad21e217ba0283f596874c00cad1b25f9f16a034f2a0f02b8cd6831a84');
  assert.equal(hash(japaneseCourse), '137303f73234a0ffa43e7647dd3057294b3263cacf9197ace7822f3953f9422c');
});

function canBuild(exercise: Lesson['sentenceActivity'], chosen: string[] = [], remaining = exercise.tokens): boolean {
  if (!remaining.length) return checkAnswer(chosen.join(' '), exercise) === 'correct';
  const prefix = chosen.join(' ');
  if (prefix && !exercise.answers.some(answer => answer === prefix || answer.startsWith(`${prefix} `))) return false;
  return remaining.some((token, index) => canBuild(exercise, [...chosen, token], remaining.filter((_, at) => at !== index)));
}

test('all 13 Japanese topics offer at least 30 distinct supported words across short solvable lessons', () => {
  const topics = groupLessonTopics(japaneseLessons);
  assert.equal(topics.length, 13);
  assert.equal(japaneseLessons.length, 65);
  const byId = new Map<string, Vocabulary>();
  for (const topic of topics) {
    const targets = new Set(topic.vocabulary.map(entry => targetKey(entry.target)));
    assert.ok(targets.size >= 30, `${topic.name}: only ${targets.size} distinct entries`);
    assert.equal(targets.size, topic.vocabulary.length, `${topic.name}: duplicate spellings cannot pad coverage`);
    assert.equal(topic.lessons.length, 5);
    for (const lesson of topic.lessons) {
      assert.deepEqual(lessonSchema.parse(lesson), lesson);
      assert.equal(lesson.language, 'ja-JP'); assert.equal(lesson.status, 'draft');
      for (const answer of lesson.sentenceActivity.answers) {
        assert.ok(canBuild({ ...lesson.sentenceActivity, answers: [answer] }), `${lesson.id}: every accepted answer must use all pieces`);
      }
      const choices = lesson.pictureActivity.choices.map(id => lesson.vocabulary.find(entry => entry.id === id)!);
      assert.equal(new Set(choices.map(entry => normalizeSearch(entry.meaning))).size, choices.length, `${lesson.id}: distinct choice meanings`);
      for (const entry of lesson.vocabulary) {
        assert.ok(entry.reading && entry.exampleReading && entry.example && entry.exampleMeaning && entry.note, entry.id);
        assert.equal(/\p{Script=Han}/u.test(`${entry.reading}${entry.exampleReading}`), false, `${entry.id}: readings need kana support`);
        assert.equal(entry.gender, undefined);
        assert.ok(matchesVocabulary(entry, entry.reading));
        if (byId.has(entry.id)) assert.deepEqual(entry, byId.get(entry.id), `Conflicting canonical sense ${entry.id}`);
        byId.set(entry.id, entry);
      }
      assert.ok(lesson.dialogue.every(line => line.reading && line.target && line.meaning));
    }
  }
});
