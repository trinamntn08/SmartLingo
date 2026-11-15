import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '@smartlingo/content';
import { vocabularySchema } from '../src/index';

test('revised drafts have fuller examples and separate noun gender from optional notes', () => {
  const entries = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry]));
  for (const lesson of lessons) { assert.equal(lesson.revision, 2); assert.equal(lesson.status, 'draft'); }
  for (const entry of entries.values()) {
    assert.ok(entry.example.split(/\s+/).length >= 8, `${entry.id}: a full everyday example, not a short fragment`);
    assert.doesNotMatch(entry.note, /^(?:Masculine|Feminine) noun\b/i, entry.id);
  }
  assert.equal(entries.get('fr.cafe')?.gender, 'masculine');
  assert.equal(entries.get('fr.eau')?.gender, 'feminine');
  assert.equal(entries.get('fr.addition')?.gender, 'feminine');
  assert.equal(entries.get('fr.bonjour')?.gender, undefined);
  const word = entries.get('fr.cafe')!;
  assert.equal(vocabularySchema.safeParse({ ...word, gender: 'unknown' }).success, false);
  assert.equal(vocabularySchema.safeParse({ ...word, gender: undefined, note: '' }).success, true);
});
