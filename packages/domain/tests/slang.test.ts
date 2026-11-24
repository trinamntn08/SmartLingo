import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { findSlangExpressions, lessons, slangCategoryIds, slangExpressions } from '@smartlingo/content';
import { normalizeSearch, notebookEntrySchema } from '@smartlingo/domain';

const wordForm = (target: string) => normalizeSearch(target).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

test('bundled slang has complete entries, unique keys, and a saveable notebook form', () => {
  const ids = new Set<string>();
  const targets = new Set<string>();
  const courseEntries = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry.target]));
  for (const entry of slangExpressions) {
    assert.match(entry.id, /^fr\.slang\.[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!ids.has(entry.id), `Duplicate slang ID ${entry.id}`);
    ids.add(entry.id);
    const target = wordForm(entry.target);
    assert.ok(!targets.has(target), `Duplicate slang target ${entry.target}`);
    targets.add(target);
    assert.ok(entry.example.trim() && entry.exampleMeaning.trim() && entry.note.trim(), entry.id);
    if (entry.sourceEntryId !== entry.id) assert.equal(wordForm(courseEntries.get(entry.sourceEntryId) ?? ''), target);
    notebookEntrySchema.parse({
      id: `notebook.${entry.sourceEntryId}`, sourceEntryId: entry.sourceEntryId,
      target: entry.target, meaning: entry.meaning, example: entry.example, updatedAt: '2026-11-24T12:00:00Z',
    });
    assert.ok(!entry.textAbbreviation || entry.category === 'messages', entry.id);
  }
  assert.ok(slangExpressions.length >= 240);
  assert.deepEqual(new Set(slangExpressions.map(entry => entry.category)), new Set(slangCategoryIds));
  assert.ok(slangExpressions.some(entry => entry.textAbbreviation));
  assert.ok(slangExpressions.some(entry => entry.register === 'vulgar'));
});

test('slang lookup searches French and English and combines search with the category', () => {
  const marche = findSlangExpressions('  CA MARCHE!  ', null)[0];
  assert.match(marche.target, /^ça marche/i);
  assert.ok(findSlangExpressions(marche.meaning, marche.category).includes(marche));
  assert.ok(!findSlangExpressions('ca marche', 'strong').includes(marche));
  assert.equal(findSlangExpressions('j ai la flemme', null)[0]?.id, 'fr.slang.avoir-la-flemme');
  assert.deepEqual(findSlangExpressions('xx-no-match-xx', null), []);
  assert.deepEqual(findSlangExpressions('  ', null), slangExpressions);
});
