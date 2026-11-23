import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { lessons, getVocabularyPhoto } from '@smartlingo/content';

test('vocabulary photos are local validated images guarded by their exact sense and target', () => {
  const entries = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(entry => [entry.id, entry]));
  const files = new Set<string>();
  let covered = 0;
  for (const entry of entries.values()) {
    const photo = getVocabularyPhoto(entry.id, entry.target);
    if (!photo) continue;
    covered++;
    assert.match(photo.uri, /^\/vocabulary-photos\/[a-z0-9-]+\.(jpg|jpeg|webp)$/);
    assert.ok(photo.alt.trim().length > 3, `${entry.id}: nonempty photo alt`);
    assert.doesNotMatch(photo.alt, /^(image|photo|picture)$/i, `${entry.id}: descriptive photo alt`);
    assert.ok(photo.kind === 'literal' || photo.kind === 'context');
    if (photo.kind === 'context') assert.match(photo.alt, /^Context photograph: \S/);
    assert.equal(getVocabularyPhoto(entry.id, `${entry.target} changed`), undefined, `${entry.id}: stale-target protection`);
    if (files.has(photo.uri)) continue;
    files.add(photo.uri);
    const bytes = readFileSync(new URL(`../../../apps/learner/public${photo.uri}`, import.meta.url));
    assert.ok(bytes.length > 1000 && bytes.length <= 512 * 1024, `${photo.uri}: bounded real image`);
    if (/\.jpe?g$/.test(photo.uri)) assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff');
    else {
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    }
  }
  assert.ok(covered > 0, 'Actual curriculum words receive bundled photos');
  assert.ok(getVocabularyPhoto('fr.cafe', 'un café'), 'The starter coffee photo is included');
  for (const id of ['constructor', '__proto__', 'toString', 'fr.unknown']) {
    assert.equal(getVocabularyPhoto(id, 'un café'), undefined, id);
  }
});

test('every shipped photograph has matching source, licence, attribution and immutable byte records', () => {
  type Source = { filename: string; sourcePage: string; author: string; license: string; licenseUrl: string; bytes: number; sha256: string; bindings: unknown[] };
  const directory = new URL('../../../apps/learner/public/vocabulary-photos/', import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('sources.json', directory), 'utf8')) as { version: number; assets: Source[] };
  const registry = JSON.parse(readFileSync(new URL('../../../packages/content/src/photos/catalogue.json', import.meta.url), 'utf8')) as Source[];
  assert.equal(manifest.version, 1);
  assert.deepEqual(manifest.assets, registry, 'Offline attribution records match the curated source registry');
  assert.equal(new Set(registry.map(source => source.filename)).size, registry.length);
  assert.deepEqual(new Set(readdirSync(directory)), new Set(['credits.html', 'sources.json', ...registry.map(source => source.filename)]), 'Rejected images/contact sheets do not ship');
  for (const source of registry) {
    assert.match(source.filename, /^[a-z0-9-]+\.(jpg|jpeg|webp)$/);
    const sourceUrl = new URL(source.sourcePage);
    assert.equal(sourceUrl.protocol, 'https:');
    assert.ok(['commons.wikimedia.org', 'www.pexels.com', 'pexels.com'].includes(sourceUrl.hostname));
    const licenseUrl = new URL(source.licenseUrl);
    assert.ok(['http:', 'https:'].includes(licenseUrl.protocol));
    assert.ok(['creativecommons.org', 'commons.wikimedia.org', 'www.pexels.com', 'pexels.com'].includes(licenseUrl.hostname));
    assert.match(source.license, /^(CC0|Public domain|CC BY(?:-SA)? [234]|Pexels)/);
    if (source.license.startsWith('CC BY')) assert.ok(source.author.trim(), `${source.filename}: required author credit`);
    assert.ok(source.bindings.length > 0, `${source.filename}: actual teaching association`);
    const bytes = readFileSync(new URL(source.filename, directory));
    assert.equal(bytes.length, source.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, source.filename);
  }
});
