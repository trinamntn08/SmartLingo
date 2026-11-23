import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restaurantLesson } from '@smartlingo/content';
import { genderLabels, vocabularyPresentation } from '../src/content/vocabularyPresentation';

test('noun gender is compact while useful notes remain and empty notes stay empty', () => {
  const entry = restaurantLesson.vocabulary[1];
  assert.equal(genderLabels.masculine.short, 'm.');
  assert.equal(genderLabels.feminine.short, 'f.');
  assert.equal(genderLabels.both.short, 'm./f.');
  assert.deepEqual(vocabularyPresentation({ ...entry, gender: 'feminine', note: '' }), { gender: 'feminine', note: '' });
  assert.deepEqual(vocabularyPresentation({ ...entry, gender: undefined, note: 'Feminine noun. Use this word for anyone.' }),
    { gender: 'feminine', note: 'Use this word for anyone.' });
  assert.deepEqual(vocabularyPresentation({ ...entry, gender: undefined, note: 'Masculine noun.' }), { gender: 'masculine', note: '' });
  assert.deepEqual(vocabularyPresentation({ ...entry, gender: undefined, note: 'Use vous with unfamiliar adults.' }),
    { gender: undefined, note: 'Use vous with unfamiliar adults.' });
  const legacy = { ...entry, gender: undefined, note: 'Masculine noun. Keep this useful explanation.' };
  const cleared = { ...legacy, gender: undefined, note: vocabularyPresentation(legacy).note };
  assert.deepEqual(vocabularyPresentation(cleared), { gender: undefined, note: 'Keep this useful explanation.' });
});
