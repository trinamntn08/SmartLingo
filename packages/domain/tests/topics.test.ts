import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons, restaurantLesson } from '@smartlingo/content';
import { checkAnswer, groupLessonTopics, matchesLesson, matchesVocabulary, normalizeAnswer, normalizeSearch, type Lesson, type Vocabulary } from '../src/index';

function canBuildAcceptedSentence(exercise: Lesson['sentenceActivity'], chosen: string[] = [], remaining = exercise.tokens): boolean {
  const prefix = normalizeAnswer(chosen.join(' '));
  if (!remaining.length) return checkAnswer(prefix, exercise) === 'correct';
  if (prefix && !exercise.answers.some(answer => {
    const valid = normalizeAnswer(answer);
    return valid === prefix || valid.startsWith(`${prefix} `);
  })) return false;
  return remaining.some((token, index) => canBuildAcceptedSentence(exercise, [...chosen, token], remaining.filter((_, at) => at !== index)));
}

test('each beginner topic has 30–50 distinct entries across short A1 and A2 lessons', () => {
  const topics = groupLessonTopics(lessons);
  assert.equal(topics.length, 12);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
  const sharedEntries = new Map<string, Vocabulary>();
  for (const topic of topics) {
    const targets = new Set(topic.vocabulary.map(entry => normalizeSearch(entry.target)));
    assert.ok(targets.size >= 30 && targets.size <= 50, `${topic.name}: ${targets.size} distinct targets`);
    assert.equal(targets.size, topic.vocabulary.length, `${topic.name}: no repeated target padding`);
    assert.ok(topic.lessons.some(lesson => lesson.level === 'A1'), `${topic.name}: A1`);
    assert.ok(topic.lessons.some(lesson => lesson.level === 'A2'), `${topic.name}: A2`);
    for (const lesson of topic.lessons) {
      assert.equal(lesson.status, 'draft');
      assert.ok(lesson.vocabulary.length >= 6 && lesson.vocabulary.length <= 10);
      for (const entry of lesson.vocabulary) {
        const existing = sharedEntries.get(entry.id);
        if (existing) assert.deepEqual(entry, existing, `Conflicting shared entry ${entry.id}`);
        sharedEntries.set(entry.id, entry);
      }
      const activity = lesson.pictureActivity;
      const choices = lesson.vocabulary.filter(entry => activity.choices.includes(entry.id));
      assert.equal(new Set(choices.map(entry => normalizeSearch(entry.target))).size, choices.length);
      if (activity.mode === 'meaning') assert.equal(new Set(choices.map(entry => normalizeSearch(entry.meaning))).size, choices.length);
      assert.ok(canBuildAcceptedSentence(lesson.sentenceActivity),
        `${lesson.id}: at least one accepted sentence can be built with exactly the supplied pieces`);
    }
  }
});

test('catalogue search matches English/French words, accents, levels and lesson situations', () => {
  assert.equal(matchesLesson(restaurantLesson, 'cafe'), true);
  assert.equal(matchesLesson(restaurantLesson, 'espresso'), true);
  assert.equal(matchesLesson(restaurantLesson, 'restaurant', 'A2'), false);
  assert.equal(matchesLesson(restaurantLesson, 'restaurant', 'A1'), true);
  assert.equal(matchesLesson(restaurantLesson, 'no-such-word'), false);
  assert.equal(matchesVocabulary(restaurantLesson.vocabulary[4], "l'addition"), true);
  assert.equal(matchesVocabulary(restaurantLesson.vocabulary[0], 'good morning'), true);
  assert.equal(matchesVocabulary(restaurantLesson.vocabulary[0], 'coffee'), false);
});

test('topic grouping follows published replacements without duplicating their entries', () => {
  const published = { ...restaurantLesson, status: 'published' as const, revision: 2 };
  const groups = groupLessonTopics([published, { ...published, id: 'fr.restaurant.second' }]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].lessons.length, 2);
  assert.equal(groups[0].vocabulary.length, restaurantLesson.vocabulary.length);
  assert.equal(groups[0].lessons[0].status, 'published');
});
