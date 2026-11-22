import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { lessons, getVocabularyPhoto } from '@smartlingo/content';
import catalogue from '../../content/src/photos/catalogue.json';
import provenance from '../../../docs/generated-vocabulary-photos.json';

const publicDirectory = new URL('../../../apps/learner/public/', import.meta.url);
const photoDirectory = new URL('generated-vocabulary-photos/', publicDirectory);

test('generated vocabulary photos are bound only to their reviewed exact vocabulary targets', () => {
  const words = new Set(lessons.flatMap(lesson =>
    lesson.vocabulary.map(({ id, target }) => `${id}\0${target}`)));
  const reviewed = new Set<string>();
  for (const { key, bindings } of catalogue) {
    assert.ok(bindings.length > 0, `${key}: has a teaching association`);
    for (const { id, target, context } of bindings) {
      const pair = `${id}\0${target}`;
      assert.ok(words.has(pair), `${id}: target is present in the bundled curriculum`);
      assert.ok(!reviewed.has(pair), `${id}: one photograph per exact target`);
      reviewed.add(pair);
      const photo = getVocabularyPhoto(id, target);
      assert.ok(photo, id);
      assert.equal(photo.uri, `/generated-vocabulary-photos/${key}.jpg`);
      assert.equal(photo.kind, context ? 'context' : 'literal');
      assert.ok(photo.alt.trim().length > 3, `${id}: descriptive alternative text`);
      if (context) assert.match(photo.alt, /^Context photograph: \S/);
      assert.equal(getVocabularyPhoto(id, `${target} changed`), undefined, `${id}: stale-target protection`);
    }
  }
  assert.equal(getVocabularyPhoto('fr.cafe', 'un café')?.uri, '/generated-vocabulary-photos/espresso.jpg');
  for (const id of ['constructor', '__proto__', 'toString', 'fr.unknown']) {
    assert.equal(getVocabularyPhoto(id, 'un café'), undefined, id);
  }
});

test('the public vocabulary photo set exactly matches recorded ImageGen outputs', () => {
  const records = new Map(provenance.assets.map(asset => [asset.key, asset]));
  const sources = new Set(provenance.sources.map(source => source.id));
  assert.equal(provenance.generator, 'OpenAI ImageGen');
  assert.equal(records.size, provenance.assets.length);
  assert.equal(records.size, catalogue.length);
  assert.deepEqual(new Set(readdirSync(photoDirectory)), new Set(catalogue.map(({ key }) => `${key}.jpg`)));
  assert.ok(!existsSync(new URL('vocabulary-photos/', publicDirectory)), 'Retired stock photos and credits are outside the current public directory');
  for (const { key } of catalogue) {
    const source = records.get(key);
    assert.ok(source && sources.has(source.source), `${key}: recorded generated source`);
    assert.match(key, /^[a-z0-9-]+$/);
    const bytes = readFileSync(new URL(`${key}.jpg`, photoDirectory));
    assert.ok(bytes.length > 1000 && bytes.length <= 512 * 1024, `${key}: bounded JPEG`);
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    assert.equal(bytes.length, source.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, key);
  }
});
