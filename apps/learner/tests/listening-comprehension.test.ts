import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Lesson } from '@smartlingo/domain';
import { lessons as catalogue } from '@smartlingo/content';
import { buildListeningQuestions } from '../src/listening/comprehension';

function lesson(id: string, language: string, pairs: [string, string][]): Lesson {
  const base = catalogue[0]!;
  return { ...base, id, language, vocabulary: pairs.map(([example, exampleMeaning], index) => ({
    ...base.vocabulary[0]!, id: `${id}.word-${index}`, example, exampleMeaning,
  })) };
}

test('listening uses full sentence meanings and varies correct positions deterministically without mutation', () => {
  const source = [lesson('fr.test', 'fr-FR', [['Bonjour.', 'Hello.'], ['Un café.', 'A coffee.'], ['De l’eau.', 'Some water.'], ['Merci.', 'Thank you.']])];
  const before = structuredClone(source);
  const questions = buildListeningQuestions(source);
  assert.equal(questions.length, 4);
  assert.deepEqual(questions, buildListeningQuestions(source));
  assert.deepEqual(source, before);
  assert.deepEqual(questions.map(question => question.correctIndex), [0, 1, 2, 0]);
  for (const question of questions) {
    assert.equal(question.choices.length, 3);
    assert.equal(new Set(question.choices).size, 3);
    assert.equal(question.choices[question.correctIndex], question.meaning);
    assert.ok(source[0]!.vocabulary.some(entry => entry.example === question.sentence && entry.exampleMeaning === question.meaning));
    assert.ok(question.choices.every(choice => source[0]!.vocabulary.some(entry => entry.exampleMeaning === choice)));
    assert.notEqual(question.meaning, source[0]!.vocabulary[0]!.meaning);
  }
});

test('mixed language input never draws distractors from another language', () => {
  const french = lesson('fr.test', 'fr-FR', [['Bonjour.', 'Hello.'], ['Merci.', 'Thank you.']]);
  const japanese = lesson('ja.test', 'ja-JP', [['こんにちは。', 'Good afternoon.'], ['水です。', 'It is water.'], ['パンです。', 'It is bread.']]);
  const questions = buildListeningQuestions([french, japanese]);
  assert.equal(questions.length, 3);
  assert.ok(questions.every(question => question.language === 'ja-JP'));
  assert.ok(questions.every(question => question.choices.every(choice => japanese.vocabulary.some(entry => entry.exampleMeaning === choice))));
});

test('normalized duplicate targets collapse and conflicting target meanings are excluded entirely', () => {
  const source = lesson('fr.test', 'fr-FR', [
    ['Bonjour.', 'Hello.'], [' BONJOUR ! ', ' HELLO! '],
    ['Merci.', 'Thank you.'], [' MERCI ! ', 'No, thanks.'],
    ['Du pain.', 'Some bread.'], ['De l’eau.', 'Some water.'],
  ]);
  const questions = buildListeningQuestions([source]);
  assert.equal(questions.length, 3);
  assert.equal(questions.filter(question => question.sentence === 'Bonjour.').length, 1);
  assert.ok(questions.every(question => !question.sentence.toLowerCase().includes('merci')));
  assert.ok(questions.every(question => !question.choices.includes('No, thanks.') && !question.choices.includes('Thank you.')));
});

test('duplicate translations cannot make ambiguous choices, while accent and kana differences are preserved', () => {
  const source = lesson('ja.test', 'ja-JP', [
    ['かき。', 'Persimmon.'], ['カキです。', ' PERSIMMON! '], ['かぎ。', 'Key.'], ['パン。', 'Bread.'],
  ]);
  const questions = buildListeningQuestions([source]);
  assert.equal(questions.length, 4);
  for (const question of questions) {
    const normalized = question.choices.map(choice => choice.toLowerCase().replace(/[\p{P}\s]+/gu, ''));
    assert.equal(new Set(normalized).size, 3);
    assert.equal(question.choices[question.correctIndex], question.meaning);
  }
  const accents = lesson('fr.accents', 'fr-FR', [['Ou ?', 'Or?'], ['Où ?', 'Where?'], ['Oui.', 'Yes.']]);
  assert.equal(buildListeningQuestions([accents]).length, 3);
});

test('insufficient distinct meanings and empty examples produce a useful empty question set', () => {
  assert.deepEqual(buildListeningQuestions([]), []);
  assert.deepEqual(buildListeningQuestions([lesson('fr.small', 'fr-FR', [['Bonjour.', 'Hello.'], ['Salut.', 'Hello!'], ['Merci.', 'Thank you.'], ['', 'Missing.']])]), []);
});

test('later questions vary distractors and prefer their own lesson over earlier catalogue meanings', () => {
  const earlier = lesson('fr.earlier', 'fr-FR', [['Bonjour.', 'Hello.'], ['Merci.', 'Thank you.'], ['Au revoir.', 'Goodbye.']]);
  const current = lesson('fr.current', 'fr-FR', [
    ['Un café.', 'A coffee.'], ['Un thé.', 'A tea.'], ['Du pain.', 'Some bread.'],
    ['De l’eau.', 'Some water.'], ['Du lait.', 'Some milk.'], ['Du sucre.', 'Some sugar.'],
  ]);
  const questions = buildListeningQuestions([earlier, current]).filter(question => question.lessonId === current.id);
  assert.equal(questions.length, 6);
  const ownMeanings = new Set(current.vocabulary.map(entry => entry.exampleMeaning));
  assert.ok(questions.every(question => question.choices.every(choice => ownMeanings.has(choice))));
  const laterDistractors = questions.slice(3).map(question => question.choices.filter((_, index) => index !== question.correctIndex).sort().join('|'));
  assert.equal(new Set(laterDistractors).size, 3);
  assert.deepEqual(questions.map(question => question.id), current.vocabulary.map(entry => `${current.id}:${entry.id}`));
});

test('small lessons prefer same-topic distractors before other topics or languages', () => {
  const current = { ...lesson('fr.small', 'fr-FR', [['Un café.', 'A coffee.']]), topic: 'Café' };
  const otherTopic = { ...lesson('fr.other', 'fr-FR', [['Bonjour.', 'Hello.'], ['Merci.', 'Thank you.']]), topic: 'Greetings' };
  const sameTopic = { ...lesson('fr.related', 'fr-FR', [['Du lait.', 'Some milk.'], ['Du sucre.', 'Some sugar.']]), topic: 'Café' };
  const japanese = { ...lesson('ja.other', 'ja-JP', [['水。', 'Water.'], ['パン。', 'Bread.']]), topic: 'Café' };
  const question = buildListeningQuestions([otherTopic, japanese, current, sameTopic]).find(item => item.lessonId === current.id)!;
  assert.ok(question);
  assert.deepEqual(new Set(question.choices), new Set(['A coffee.', 'Some milk.', 'Some sugar.']));
});

test('small lessons fall back to same-language examples when their topic lacks enough distinct meanings', () => {
  const current = { ...lesson('fr.small', 'fr-FR', [['Un café.', 'A coffee.'], ['Du lait.', 'Some milk.']]), topic: 'Café' };
  const otherTopic = { ...lesson('fr.other', 'fr-FR', [['Bonjour.', 'Hello.'], ['Merci.', 'Thank you.']]), topic: 'Greetings' };
  const source = [otherTopic, current];
  const before = structuredClone(source);
  const questions = buildListeningQuestions(source).filter(question => question.lessonId === current.id);
  assert.equal(questions.length, 2);
  for (const question of questions) {
    assert.ok(question.choices.includes('A coffee.') && question.choices.includes('Some milk.'));
    assert.ok(question.choices.some(choice => otherTopic.vocabulary.some(entry => entry.exampleMeaning === choice)));
    assert.equal(question.choices[question.correctIndex], question.meaning);
  }
  assert.deepEqual(source, before);
});
