import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons, restaurantLesson, courseSequence, previousSeedFingerprints } from '@smartlingo/content';
import { checkAnswer, groupLessonTopics, matchesLesson, matchesVocabulary, mergeLessonCatalogue, normalizeAnswer, normalizeSearch, type Lesson, type Vocabulary } from '../src/index';

function canBuildAcceptedSentence(exercise: Lesson['sentenceActivity'], chosen: string[] = [], remaining = exercise.tokens): boolean {
  const prefix = normalizeAnswer(chosen.join(' '));
  if (!remaining.length) return checkAnswer(prefix, exercise) === 'correct';
  if (prefix && !exercise.answers.some(answer => {
    const valid = normalizeAnswer(answer);
    return valid === prefix || valid.startsWith(`${prefix} `);
  })) return false;
  return remaining.some((token, index) => canBuildAcceptedSentence(exercise, [...chosen, token], remaining.filter((_, at) => at !== index)));
}

test('each beginner topic has a distinct 30–50-entry bank and solvable short lessons', () => {
  const topics = groupLessonTopics(lessons);
  assert.equal(topics.length, 24);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
  const sharedEntries = new Map<string, Vocabulary>();
  for (const topic of topics) {
    const targets = new Set(topic.vocabulary.map(entry => normalizeSearch(entry.target)));
    assert.ok(targets.size >= 30 && targets.size <= 50, `${topic.name}: ${targets.size} distinct targets`);
    assert.equal(targets.size, topic.vocabulary.length, `${topic.name}: no repeated target padding`);
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

test('suggested progression covers every bank once with earlier prerequisites and immutable draft revisions', () => {
  const slugs = courseSequence.map(topic => topic.slug);
  assert.equal(new Set(slugs).size, 24);
  assert.deepEqual(new Set(lessons.map(lesson => lesson.id.split('.')[1])), new Set(slugs));
  const seen = new Set<string>();
  for (const topic of courseSequence) {
    for (const prerequisite of topic.prerequisites) assert.ok(seen.has(prerequisite), `${topic.slug}: prior ${prerequisite}`);
    seen.add(topic.slug);
  }
  assert.equal(lessons.length, 120);
  for (const lesson of lessons) {
    const history = Object.hasOwn(previousSeedFingerprints, lesson.id)
      ? previousSeedFingerprints[lesson.id as keyof typeof previousSeedFingerprints] : [];
    assert.equal(lesson.revision, history.length ? Math.max(...history.map(prior => prior.nextRevision ?? prior.revision + 1)) : 1, lesson.id);
  }
  assert.ok(lessons.some(lesson => lesson.level === 'foundation'));
  assert.ok(lessons.filter(lesson => lesson.id.startsWith('fr.past.') || lesson.id.startsWith('fr.opinions.'))
    .every(lesson => lesson.level === 'A2'));
});

test('routine and paperwork replace redundant introductions while prior canonical senses remain taught', () => {
  const routine = lessons.find(lesson => lesson.id === 'fr.routine.small-numbers')!;
  assert.ok(routine.vocabulary.some(entry => entry.target === 'se réveiller'));
  assert.ok(routine.vocabulary.some(entry => entry.target === 'se brosser les dents'));
  assert.ok(!routine.vocabulary.some(entry => entry.id === 'fr.routine.zero'));
  const number = lessons.flatMap(lesson => lesson.vocabulary).find(entry => entry.id === 'fr.routine.zero');
  assert.equal(number?.target, 'zéro');
  const paperwork = lessons.find(lesson => lesson.id === 'fr.administration.internet')!;
  assert.ok(paperwork.vocabulary.some(entry => entry.target === 'une date limite'));
  assert.ok(paperwork.vocabulary.some(entry => entry.target === 'fonctionner'));
  assert.ok(!paperwork.vocabulary.some(entry => entry.id === 'fr.administration.mot-de-passe'));
  const password = lessons.flatMap(lesson => lesson.vocabulary).find(entry => entry.id === 'fr.administration.mot-de-passe');
  assert.equal(password?.target, 'un mot de passe');
});

test('identical target forms share a sense ID except explicit contextual senses', () => {
  const contextualForms = new Set(['ça me va', 'un guichet', 'un horaire', 'manquer', 'après', 'une place', 'jusqu’à', 'une expérience', 'ouvrir'].map(normalizeSearch));
  const groups = new Map<string, Set<string>>();
  for (const word of lessons.flatMap(lesson => lesson.vocabulary)) {
    const form = normalizeSearch(word.target);
    const ids = groups.get(form) ?? new Set<string>();
    ids.add(word.id); groups.set(form, ids);
  }
  for (const [form, ids] of groups) assert.ok(ids.size === 1 || contextualForms.has(form), `${form}: unmarked duplicate senses ${[...ids].join(', ')}`);
});

test('topic grouping follows published replacements without duplicating their entries', () => {
  const published = { ...restaurantLesson, status: 'published' as const, revision: 2 };
  const groups = groupLessonTopics([published, { ...published, id: 'fr.restaurant.second' }]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].lessons.length, 2);
  assert.equal(groups[0].vocabulary.length, restaurantLesson.vocabulary.length);
  assert.equal(groups[0].lessons[0].status, 'published');
});

test('published topic and role changes are searchable and foundation content has its own filter', () => {
  const published: Lesson = { ...restaurantLesson, status: 'published', revision: restaurantLesson.revision + 1,
    topic: 'First words', role: 'Newcomer', level: 'foundation' };
  const catalogue = mergeLessonCatalogue(lessons, [published]);
  const group = groupLessonTopics(catalogue).find(topic => topic.name === 'First words')!;
  assert.deepEqual(group.lessons, [published]);
  assert.equal(group.vocabulary.length, restaurantLesson.vocabulary.length);
  assert.equal(matchesLesson(group.lessons[0], 'first words', 'foundation'), true);
  assert.equal(matchesLesson(group.lessons[0], 'newcomer', 'foundation'), true);
  assert.equal(matchesLesson(group.lessons[0], 'coffee', 'A1'), false);
  assert.equal(matchesLesson(restaurantLesson, 'coffee', 'foundation'), false);
});
