import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getWordVisual, lessons, wordVisuals } from '@smartlingo/content';
import { historicalWordVisualIds } from '../../content/src/visuals';

test('bundled drawings cover concrete vocabulary across topics and have no remote dependencies', () => {
  const vocabulary = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry]));
  assert.ok(Object.keys(wordVisuals).length >= 90, 'Broad new visual coverage, beyond the initial ten pictures');
  const coveredTopics = new Set<string>();
  for (const [id, visual] of Object.entries(wordVisuals)) {
    const entry = vocabulary.get(id);
    assert.ok(entry || historicalWordVisualIds.includes(id), `Unknown visual entry ${id}`);
    if (entry) assert.equal(visual.target, entry.target, `Stale visual target ${id}`);
    assert.ok(visual.alt.trim().length >= 6, `Descriptive alt text for ${id}`);
    assert.match(visual.svg, /<svg\b/);
    assert.match(visual.svg, /viewBox=/);
    assert.doesNotMatch(visual.svg, /<script|<image|<foreignObject|\bhref\s*=|\bon[a-z]+\s*=/i);
    for (const lesson of lessons) if (lesson.vocabulary.some(word => word.id === id)) coveredTopics.add(lesson.topic);
  }
  assert.ok(coveredTopics.size >= 8, 'Drawings span everyday topics');
  for (const id of historicalWordVisualIds) {
    assert.equal(vocabulary.has(id), false, `Historical binding is no longer taught: ${id}`);
    assert.ok(getWordVisual({ id, target: wordVisuals[id].target }), `Older notebook picture remains available: ${id}`);
  }
});

test('a changed target or unknown ID does not silently receive an obsolete drawing', () => {
  const [id, visual] = Object.entries(wordVisuals)[0];
  assert.equal(getWordVisual({ id, target: visual.target }), visual);
  assert.equal(getWordVisual({ id, target: 'un autre sens' }), undefined);
  assert.equal(getWordVisual({ id: 'unknown.word', target: visual.target }), undefined);
  assert.equal(getWordVisual({ id: 'constructor', target: visual.target }), undefined);
});
