import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '@smartlingo/content';
import { buildGreetingsLessons } from '../../content/src/topics/greetings';
import { checkAnswer, lessonSchema, normalizeAnswer, normalizeSearch, type Lesson } from '../src/index';

const existingVocabulary = lessons.filter(lesson => !lesson.id.startsWith('fr.greetings.'))
  .flatMap(lesson => lesson.vocabulary);
const greetings = buildGreetingsLessons(existingVocabulary);
const byId = new Map(greetings.map(lesson => [lesson.id, lesson]));
const sharedIds = [
  'fr.bonjour', 'fr.people.au-revoir', 'fr.silvousplait', 'fr.merci',
  'fr.essentials.thank-you', 'fr.essentials.welcome-response', 'fr.essentials.excuse-me',
];

function sentencesFromPieces(pieces: readonly string[]): Set<string> {
  if (!pieces.length) return new Set(['']);
  const sentences = new Set<string>();
  for (let index = 0; index < pieces.length; index += 1) {
    const remaining = pieces.filter((_, at) => at !== index);
    for (const tail of sentencesFromPieces(remaining)) sentences.add(normalizeAnswer(`${pieces[index]} ${tail}`));
  }
  return sentences;
}

test('greetings introduce the proposed practical phrases in three short, translated owner-review drafts', () => {
  const expectedEntries: Record<string, string[]> = {
    'fr.greetings.hello-goodbye': [
      'fr.bonjour', 'fr.greetings.bonsoir', 'fr.greetings.salut', 'fr.people.au-revoir',
      'fr.greetings.a-bientot', 'fr.greetings.a-demain', 'fr.greetings.bonne-journee', 'fr.greetings.bonne-soiree',
    ],
    'fr.greetings.politeness': [
      'fr.silvousplait', 'fr.greetings.sil-te-plait', 'fr.merci', 'fr.essentials.thank-you',
      'fr.essentials.welcome-response', 'fr.greetings.pardon', 'fr.essentials.excuse-me', 'fr.greetings.excuse-moi',
    ],
    'fr.greetings.check-in': [
      'fr.greetings.comment-allez-vous', 'fr.greetings.comment-ca-va', 'fr.greetings.ca-va-bien',
      'fr.greetings.tres-bien-merci', 'fr.greetings.pas-tres-bien', 'fr.greetings.et-vous',
      'fr.greetings.et-toi', 'fr.greetings.a-tout-a-lheure',
    ],
  };
  assert.deepEqual(greetings.map(lesson => lesson.id), Object.keys(expectedEntries));
  for (const lesson of greetings) {
    assert.equal(lessonSchema.safeParse(lesson).success, true, lesson.id);
    assert.deepEqual(lesson.vocabulary.map(entry => entry.id), expectedEntries[lesson.id]);
    assert.equal(lesson.topic, 'Everyday greetings and politeness');
    assert.equal(lesson.level, 'foundation');
    assert.equal(lesson.status, 'draft');
    assert.equal(lesson.revision, 1);
    assert.ok(lesson.dialogue.some(line => line.role === lesson.role));
    for (const line of lesson.dialogue) assert.ok(line.target.trim() && line.meaning.trim());
    for (const entry of lesson.vocabulary) {
      assert.ok(entry.example.trim() && entry.exampleMeaning.trim() && entry.note.trim(), entry.id);
      assert.doesNotMatch(JSON.stringify(entry), /\uFFFD|Ã|â€™|\bTODO\b/u, entry.id);
    }
    assert.match(lesson.provenance.rights, /greeting-first-proposal\.json/);
    assert.match(lesson.provenance.review, /Draft for owner review/);
  }
});

test('greetings reuse all seven complete canonical senses and leave existing support untouched', () => {
  const before = JSON.stringify(existingVocabulary);
  const built = buildGreetingsLessons(existingVocabulary);
  const canonical = new Map(existingVocabulary.map(entry => [entry.id, entry]));
  const reused = built.flatMap(lesson => lesson.vocabulary).filter(entry => sharedIds.includes(entry.id));
  assert.deepEqual(new Set(reused.map(entry => entry.id)), new Set(sharedIds));
  for (const entry of reused) {
    assert.deepEqual(entry, canonical.get(entry.id), entry.id);
    assert.equal(entry, canonical.get(entry.id), `${entry.id}: canonical payload itself is retained`);
  }
  assert.equal(JSON.stringify(existingVocabulary), before);
  const revisedInput = existingVocabulary.map(entry => entry.id === 'fr.silvousplait'
    ? { ...entry, target: "s'il vous plaît", note: 'Owner-reviewed canonical support remains authoritative.' } : entry);
  const revised = buildGreetingsLessons(revisedInput).flatMap(lesson => lesson.vocabulary)
    .find(entry => entry.id === 'fr.silvousplait')!;
  assert.equal(revised.target, "s'il vous plaît");
  assert.equal(revised.note, 'Owner-reviewed canonical support remains authoritative.');
  assert.throws(() => buildGreetingsLessons(existingVocabulary.filter(entry => entry.id !== 'fr.bonjour')),
    /Missing greetings shared vocabulary: fr\.bonjour/);
  assert.throws(() => buildGreetingsLessons(existingVocabulary.map(entry => entry.id === 'fr.bonjour'
    ? { ...entry, target: 'bonsoir' } : entry)), /Greetings shared vocabulary target changed: fr\.bonjour/);
});

test('meaning activities distinguish arrival greetings, polite requests and check-in questions without pictures', () => {
  const expectations = [
    ['fr.greetings.hello-goodbye', 'fr.greetings.bonsoir', /arrive/],
    ['fr.greetings.politeness', 'fr.silvousplait', /adult stranger/],
    ['fr.greetings.check-in', 'fr.greetings.comment-allez-vous', /vous/],
  ] as const;
  for (const [id, expectedAnswer, context] of expectations) {
    const lesson = byId.get(id)!;
    const activity = lesson.pictureActivity;
    assert.equal(activity.mode, 'meaning');
    assert.equal(activity.entryId, expectedAnswer);
    assert.match(activity.prompt, context);
    const choices = activity.choices.map(choice => lesson.vocabulary.find(entry => entry.id === choice)!);
    assert.ok(choices.every(Boolean), id);
    assert.equal(new Set(choices.map(entry => normalizeSearch(entry.meaning))).size, choices.length,
      `${id}: matching must not offer two forms with the same English answer`);
    assert.equal(activity.choices.filter(choice => choice === expectedAnswer).length, 1);
  }
  const opening = byId.get('fr.greetings.hello-goodbye')!;
  assert.ok(opening.pictureActivity.choices.includes('fr.greetings.bonne-soiree'));
  assert.match(opening.grammar.explanation, /including good afternoon/);
  assert.match(opening.grammar.explanation, /no rigid clock-time switch/);
  assert.match(opening.grammar.explanation, /wishes, not arrival greetings/);
  const polite = byId.get('fr.greetings.politeness')!;
  assert.match(polite.grammar.explanation, /adult stranger/);
  assert.match(polite.grammar.explanation, /s’il te plaît and excuse-moi/);
  assert.match(byId.get('fr.greetings.check-in')!.grammar.explanation, /later today/);
});

test('all accepted sentence orders can be built, accept harmless presentation changes and explain accent slips', () => {
  for (const lesson of greetings) {
    const exercise: Lesson['sentenceActivity'] = lesson.sentenceActivity;
    const buildable = sentencesFromPieces(exercise.tokens);
    for (const answer of exercise.answers) {
      assert.ok(buildable.has(normalizeAnswer(answer)), `${lesson.id}: ${answer}`);
      assert.equal(checkAnswer(answer.toLocaleUpperCase('fr-FR').replace(/[’]/g, "'"), exercise), 'correct');
    }
    assert.ok(exercise.answers.length > 1, `${lesson.id}: valid alternative order retained`);
    for (const answer of exercise.almostAnswers) assert.equal(checkAnswer(answer, exercise), 'almost');
  }
  const polite = byId.get('fr.greetings.politeness')!.sentenceActivity;
  assert.equal(checkAnswer('Un instant, s’il te plaît.', polite), 'incorrect', 'the prompt calls for vous');
  const checkIn = byId.get('fr.greetings.check-in')!.sentenceActivity;
  assert.equal(checkAnswer('Ça bien va merci.', checkIn), 'incorrect', 'word order changes are not arbitrary');
  assert.equal(checkAnswer('Pas très bien, merci.', checkIn), 'incorrect', 'an opposite response is not equivalent');
});
