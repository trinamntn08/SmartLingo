import assert from 'node:assert/strict';
import test from 'node:test';
import { japaneseCourse, japaneseLessons } from '@smartlingo/content';
import { japanesePronunciation } from '../src/content/japanesePronunciation';

test('Japanese vocabulary has Latin-letter pronunciation alongside the authored kana', () => {
  const words = [
    ...japaneseLessons.flatMap(lesson => lesson.vocabulary),
    ...japaneseCourse.days.flatMap(day => day.vocabulary),
  ];
  for (const word of words) {
    assert.match(japanesePronunciation(word.reading) ?? '', /^[a-z][a-z '.,!?]*$/, word.id);
  }
});

test('pronunciation preserves kana contrasts and handles exceptional vocabulary phrases', () => {
  const readings = {
    こんにちは: 'konnichiwa',
    'かいてください': 'kaite kudasai',
    'おはようございます': 'ohayou gozaimasu',
    'きっさてん': 'kissaten',
    'まっちゃ': 'matcha',
    'しんよう': "shin'you",
    'コーヒー': 'koohii',
    'ｽﾏｰﾄﾌｫﾝ': 'sumaatofon',
    'がっこう': 'gakkou',
  };
  for (const [reading, expected] of Object.entries(readings)) {
    assert.equal(japanesePronunciation(reading), expected);
  }
  assert.equal(japanesePronunciation('日本語'), undefined);
  assert.equal(japanesePronunciation('toString'), undefined);
  assert.equal(japanesePronunciation(undefined), undefined);
});
