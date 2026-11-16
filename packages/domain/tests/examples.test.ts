import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '@smartlingo/content';
import { vocabularySchema } from '../src/index';

test('draft examples are translated and noun gender remains separate from optional notes', () => {
  const entries = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry]));
  for (const lesson of lessons) { assert.ok(lesson.revision >= 1); assert.equal(lesson.status, 'draft'); }
  for (const entry of entries.values()) {
    assert.ok(entry.example.trim().length > 0 && entry.exampleMeaning.trim().length > 0, `${entry.id}: translated example`);
    assert.doesNotMatch(entry.example, /\b(?:TODO|TBD)\b|\.\.\.|…/, `${entry.id}: complete example rather than an unfinished template`);
    assert.doesNotMatch(entry.note, /^(?:Masculine|Feminine) noun\b/i, entry.id);
    assert.doesNotMatch(JSON.stringify(entry), /\?(?=\p{L})|\uFFFD|Ã|â€™/u, `${entry.id}: intact UTF-8 accents and apostrophes`);
  }
  assert.equal(entries.get('fr.cafe')?.gender, 'masculine');
  assert.equal(entries.get('fr.eau')?.gender, 'feminine');
  assert.equal(entries.get('fr.addition')?.gender, 'feminine');
  assert.equal(entries.get('fr.bonjour')?.gender, undefined);
  const word = entries.get('fr.cafe')!;
  assert.equal(vocabularySchema.safeParse({ ...word, gender: 'unknown' }).success, false);
  assert.equal(vocabularySchema.safeParse({ ...word, gender: undefined, note: '' }).success, true);
});
