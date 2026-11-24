import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frenchCourses, lessons } from '@smartlingo/content';
import { buildFrenchListeningCards } from '../src/listening/frenchListeningCards';
import { buildCourseListeningQuestion, buildLessonListeningQuestion } from '../src/listening/lessonQuestions';

function inSpokenOrder(cards: ReturnType<typeof buildFrenchListeningCards>): string[] {
  return [...cards].sort((left, right) => left.position - right.position).map(card => card.text);
}

test('French greetings use phrase cards and present them out of order', () => {
  const sentence = 'Au revoir et bonne journée !';
  const cards = buildFrenchListeningCards(sentence);
  assert.deepEqual(inSpokenOrder(cards), ['Au revoir', 'et', 'bonne journée']);
  assert.notDeepEqual(cards.map(card => card.text), inSpokenOrder(cards));
  assert.deepEqual(buildFrenchListeningCards(sentence), cards);
});

test('spelling stays selectable and French elisions, accents and decimals stay intact', () => {
  assert.deepEqual(inSpokenOrder(buildFrenchListeningCards('Bien sûr. N, O, R, A.')), ['Bien sûr', 'N', 'O', 'R', 'A']);
  assert.deepEqual(inSpokenOrder(buildFrenchListeningCards('L’école coûte 12,50 euros, s’il vous plaît.')),
    ['L’école', 'coûte', '12,50', 'euros', 's’il vous plaît']);
  assert.deepEqual(inSpokenOrder(buildFrenchListeningCards('Excusez-moi. Bonne soire\u0301e !')), ['Excusez-moi', 'Bonne soirée']);
});

test('identical pieces have independent positions and short answers split only when possible', () => {
  const cards = buildFrenchListeningCards('Oui, oui, d’accord.');
  assert.deepEqual(inSpokenOrder(cards), ['Oui', 'oui', 'd’accord']);
  const repeat = buildFrenchListeningCards('Oui, Oui, non.');
  assert.deepEqual(repeat.filter(card => card.text === 'Oui').map(card => card.position).sort(), [0, 1]);
  assert.notDeepEqual(repeat.map(card => card.text), inSpokenOrder(repeat));
  assert.deepEqual(inSpokenOrder(buildFrenchListeningCards('Au revoir !')), ['Au', 'revoir']);
  assert.deepEqual(buildFrenchListeningCards('D’accord !'), []);
  assert.deepEqual(buildFrenchListeningCards('…'), []);
});

test('all bundled French listening prompts reconstruct the words they play', () => {
  const questions = [
    ...lessons.filter(lesson => lesson.language === 'fr-FR').map(buildLessonListeningQuestion),
    ...frenchCourses.flatMap(course => course.days.map(day => buildCourseListeningQuestion(day, course.language))),
  ];
  const words = (text: string) => text.normalize('NFC').replace(/[^\p{L}\p{N}’'‐‑-]/gu, ' ').trim().replace(/\s+/gu, ' ');
  for (const question of questions) {
    assert.ok(question);
    const cards = buildFrenchListeningCards(question.sentence);
    assert.ok(cards.length >= 2 && cards.length <= 10, question.lessonId);
    assert.equal(new Set(cards.map(card => card.position)).size, cards.length, question.lessonId);
    assert.equal(words(inSpokenOrder(cards).join(' ')), words(question.sentence), question.lessonId);
    assert.notDeepEqual(cards.map(card => card.text), inSpokenOrder(cards), question.lessonId);
  }
});
