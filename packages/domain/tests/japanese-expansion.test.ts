import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { frenchCourseLessonsByDay, lessons, japaneseCourse, japaneseLessons } from '@smartlingo/content';
import { checkAnswer, groupLessonTopics, lessonSchema, matchesVocabulary, normalizeSearch, type Lesson, type Vocabulary } from '../src';

const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const targetKey = (target: string) => normalizeSearch(target.normalize('NFKC')).replace(/[\s。、.!?！？]/g, '');
const coreLessons = () => japaneseLessons.filter(lesson => /^ja\.lesson\.day-\d+$/.test(lesson.id));
const starterLessons = japaneseLessons.filter(lesson => !lesson.id.startsWith('ja.lesson.day-'));

test('the French library and the Japanese course and core lessons keep their reviewed payloads', () => {
  const newFrenchLessons = new Set([...frenchCourseLessonsByDay.values()].map(lesson => lesson.id));
  assert.equal(hash(lessons.filter(lesson => !newFrenchLessons.has(lesson.id) && !/^fr\.(?:cycling|household-waste)\./.test(lesson.id))),
    '0354161d5f3fadeefbab8f58ed6bc95c6145afd38b51bb185643fe8e53abb49e');
  // Rebaselined for the learner-facing Lesson names, including shared vocabulary notes.
  assert.equal(hash(coreLessons()), '6fe97b934f5c8a411f54858187e9e83fab2cb19d523830149f4d2a1a16d8cdff');
  assert.equal(hash(japaneseCourse), '7bc08c1af962ad5861a623fd261bdff19b9705fe70dd645176587d654ff1b586');
});

function canBuild(exercise: Lesson['sentenceActivity'], chosen: string[] = [], remaining = exercise.tokens): boolean {
  if (!remaining.length) return checkAnswer(chosen.join(' '), exercise) === 'correct';
  const prefix = chosen.join(' ');
  if (prefix && !exercise.answers.some(answer => answer === prefix || answer.startsWith(`${prefix} `))) return false;
  return remaining.some((token, index) => canBuild(exercise, [...chosen, token], remaining.filter((_, at) => at !== index)));
}

test('all 13 Japanese topics offer at least 30 distinct supported words across short solvable lessons', () => {
  const expandedLessons = japaneseLessons.filter(lesson => lesson.id.startsWith('ja.lesson.day-'));
  const topics = groupLessonTopics(expandedLessons);
  assert.equal(topics.length, 13);
  assert.equal(expandedLessons.length, 65);
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

test('the four Japanese starter lessons reuse canonical senses and accept the teaching chunks', () => {
  assert.deepEqual(starterLessons.map(lesson => lesson.id), ['ja.greetings.hello', 'ja.greetings.courtesy', 'ja.introductions.name', 'ja.cafe.drinks']);
  const previous = new Map(japaneseLessons.filter(lesson => lesson.id.startsWith('ja.lesson.day-'))
    .flatMap(lesson => lesson.vocabulary.map(entry => [entry.target, entry] as const)));
  for (const lesson of starterLessons) {
    assert.deepEqual(lessonSchema.parse(lesson), lesson);
    assert.equal(lesson.status, 'draft');
    assert.ok(canBuild(lesson.sentenceActivity), lesson.id);
    assert.ok(lesson.dialogue.every(line => line.reading && !/\p{Script=Han}/u.test(line.reading)));
    for (const entry of lesson.vocabulary) {
      assert.ok(entry.reading && entry.exampleReading, entry.id);
      if (previous.has(entry.target)) assert.deepEqual(entry, previous.get(entry.target));
    }
  }
  const greeting = starterLessons[0].sentenceActivity;
  assert.equal(checkAnswer('また 明日。', greeting), 'correct');
  assert.equal(checkAnswer('また明日？', greeting), 'correct');
  assert.equal(checkAnswer('まだ 明日。', greeting), 'incorrect');
});
