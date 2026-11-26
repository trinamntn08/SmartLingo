import { test } from 'node:test';
import assert from 'node:assert/strict';
import { japanesePracticeTaskSchema } from '@smartlingo/domain';
import { japaneseAlphabetLessons, japaneseAlphabetNotes, kanaScripts } from '../../../packages/content/src/japanese-alphabet';

const basics = japaneseAlphabetLessons.slice(0, 20);
const baseForms = {
  hiragana: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
};

test('alphabet route starts with hiragana vowels and covers each modern basic form once per script', () => {
  assert.deepEqual(kanaScripts, ['hiragana', 'katakana']);
  assert.equal(basics.length, 20);
  assert.deepEqual(basics.map(lesson => lesson.script), [
    ...Array<string>(10).fill('hiragana'), ...Array<string>(10).fill('katakana'),
  ]);
  const allCharacters = basics.flatMap(lesson => lesson.characters);
  assert.equal(allCharacters.length, 92);
  assert.equal(new Set(allCharacters.map(character => character.id)).size, 92);
  assert.equal(new Set(allCharacters.map(character => character.kana)).size, 92);
  for (const script of kanaScripts) {
    const lessons = basics.filter(lesson => lesson.script === script);
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
    const characters = basics.filter(lesson => lesson.script === script).flatMap(lesson => lesson.characters);
    assert.deepEqual(characters.map(character => character.romaji), readings.map(reading => reading === 'wo' ? 'o (wo)' : reading));
    assert.deepEqual(characters.map(character => character.id), readings.map(reading => `ja.kana.${script}.${reading}`));
    assert.deepEqual(characters.map(character => character.audioText), expectedAudio);
    assert.match(characters.find(character => character.romaji === 'o (wo)')!.note!, /pronounced o/);
    assert.match(characters.find(character => character.romaji === 'n')!.note!, /without an added vowel/);
  }
  const hiragana = basics.filter(lesson => lesson.script === 'hiragana').flatMap(lesson => lesson.characters);
  assert.match(hiragana.find(character => character.kana === 'は')!.note!, /pronounced wa/);
  assert.match(hiragana.find(character => character.kana === 'へ')!.note!, /pronounced e/);
  assert.ok(japaneseAlphabetNotes.some(note => /draft/i.test(note.title)));
  assert.ok(japaneseAlphabetNotes.some(note => /sound marks, small kana, long vowels and cumulative reading checkpoints/.test(note.body)));
});


test('every kana group has valid reading and script recall; new pattern groups remain draft with existing prerequisites', () => {
  assert.equal(japaneseAlphabetLessons.length, 53);
  const lessonIds = new Set(japaneseAlphabetLessons.map(lesson => lesson.id));
  assert.equal(lessonIds.size, japaneseAlphabetLessons.length);
  const taskIds: string[] = [];
  for (const lesson of japaneseAlphabetLessons) {
    assert.equal(lesson.status, 'draft');
    assert.equal(lesson.revision, 1);
    assert.ok(lesson.examples?.length);
    assert.ok(lesson.practice?.some(task => task.skill === 'reading'));
    assert.ok(lesson.practice?.some(task => task.mode === 'text' && task.focus === lesson.script));
    for (const task of lesson.practice ?? []) { japanesePracticeTaskSchema.parse(task); taskIds.push(task.id); }
    for (const prerequisite of lesson.prerequisites ?? []) assert.ok(lessonIds.has(prerequisite), prerequisite);
    if (lesson.kind === 'pattern') assert.ok(lesson.characters.length <= 6);
  }
  assert.equal(new Set(taskIds).size, taskIds.length);
});

test('both scripts cover all common contracted sounds and explicit mora listening checkpoints', () => {
  const contracted = 'きゃ きゅ きょ ぎゃ ぎゅ ぎょ しゃ しゅ しょ ちゃ ちゅ ちょ じゃ じゅ じょ にゃ にゅ にょ ひゃ ひゅ ひょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ みゃ みゅ みょ りゃ りゅ りょ'.split(' ');
  for (const script of kanaScripts) {
    const lessons = japaneseAlphabetLessons.filter(lesson => lesson.script === script);
    const forms = new Set(lessons.flatMap(lesson => lesson.characters.map(character => character.kana)));
    for (const form of contracted) {
      const expected = script === 'hiragana' ? form : [...form].map(char => String.fromCodePoint(char.codePointAt(0)! + 0x60)).join('');
      assert.ok(forms.has(expected), expected);
    }
    for (const key of ['g', 'z', 'd', 'b', 'p', 'small-tsu', 'long-vowels']) assert.ok(lessons.some(lesson => lesson.id.endsWith(`pattern.${key}`)));
    const listening = lessons.flatMap(lesson => lesson.practice ?? []).filter(task => task.skill === 'listening');
    assert.equal(listening.length, 2);
    assert.ok(listening.every(task => task.source?.text && /beat/.test(task.feedback)));
    const checkpoint = lessons.find(lesson => lesson.kind === 'checkpoint')!;
    assert.equal(checkpoint.practice?.length, 7);
    assert.ok(checkpoint.practice?.some(task => task.mode === 'self' && task.response === 'speak'));
  }
  assert.ok(japaneseAlphabetNotes.some(note => /Handwriting is optional/.test(note.body)));
});
