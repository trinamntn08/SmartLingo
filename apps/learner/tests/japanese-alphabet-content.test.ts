import { test } from 'node:test';
import assert from 'node:assert/strict';
import { japaneseAlphabetLessons, japaneseAlphabetNotes, kanaScripts } from '../../../packages/content/src/japanese-alphabet';

const baseForms = {
  hiragana: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
};

test('alphabet route starts with hiragana vowels and covers each modern basic form once per script', () => {
  assert.deepEqual(kanaScripts, ['hiragana', 'katakana']);
  assert.equal(japaneseAlphabetLessons.length, 20);
  assert.deepEqual(japaneseAlphabetLessons.map(lesson => lesson.script), [
    ...Array<string>(10).fill('hiragana'), ...Array<string>(10).fill('katakana'),
  ]);
  const allCharacters = japaneseAlphabetLessons.flatMap(lesson => lesson.characters);
  assert.equal(allCharacters.length, 92);
  assert.equal(new Set(allCharacters.map(character => character.id)).size, 92);
  assert.equal(new Set(allCharacters.map(character => character.kana)).size, 92);
  for (const script of kanaScripts) {
    const lessons = japaneseAlphabetLessons.filter(lesson => lesson.script === script);
    assert.deepEqual(lessons.map(lesson => lesson.id),
      ['a', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'].map(row => `ja.alphabet.${script}.${row}`));
    assert.deepEqual(lessons.map(lesson => lesson.characters.length), [5, 5, 5, 5, 5, 5, 5, 3, 5, 3]);
    assert.equal(lessons.flatMap(lesson => lesson.characters.map(character => character.kana)).join(''), baseForms[script]);
    for (const lesson of lessons) {
      assert.equal(lesson.revision, 1);
      assert.equal(lesson.status, 'draft');
      assert.ok(lesson.title.trim() && lesson.summary.trim());
    }
  }
});

test('reading and audio prompts preserve basic sounds including particle-prone forms', () => {
  const readings = 'a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n'.split(' ');
  const expectedAudio = [...baseForms.katakana].map(kana => kana === 'ヲ' ? 'オ' : kana);
  for (const script of kanaScripts) {
    const characters = japaneseAlphabetLessons.filter(lesson => lesson.script === script).flatMap(lesson => lesson.characters);
    assert.deepEqual(characters.map(character => character.romaji), readings.map(reading => reading === 'wo' ? 'o (wo)' : reading));
    assert.deepEqual(characters.map(character => character.id), readings.map(reading => `ja.kana.${script}.${reading}`));
    assert.deepEqual(characters.map(character => character.audioText), expectedAudio);
    assert.match(characters.find(character => character.romaji === 'o (wo)')!.note!, /pronounced o/);
    assert.match(characters.find(character => character.romaji === 'n')!.note!, /without an added vowel/);
  }
  const hiragana = japaneseAlphabetLessons.filter(lesson => lesson.script === 'hiragana').flatMap(lesson => lesson.characters);
  assert.match(hiragana.find(character => character.kana === 'は')!.note!, /pronounced wa/);
  assert.match(hiragana.find(character => character.kana === 'へ')!.note!, /pronounced e/);
  assert.ok(japaneseAlphabetNotes.some(note => /draft/i.test(note.title)));
  assert.ok(japaneseAlphabetNotes.some(note => /Sound marks, small kana, long vowels and kanji come later/.test(note.body)));
});
