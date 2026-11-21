import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getListeningResources, listeningFormats, listeningLevels, listeningResources } from '../src/listening/resources';

test('language selection preserves the French catalogue and separates Japanese recommendations', () => {
  assert.equal(getListeningResources('fr-FR'), listeningResources);
  assert.equal(listeningResources.length, 11);
  const japanese = getListeningResources('ja-JP');
  assert.equal(japanese.length, 5);
  const frenchIds = new Set(listeningResources.map(resource => resource.id));
  assert.ok(japanese.every(resource => !frenchIds.has(resource.id)));
  assert.ok(japanese.some(resource => resource.format === 'Podcast'));
  assert.ok(japanese.some(resource => resource.format === 'Video exercises'));
  for (const level of ['A1', 'A2'] as const) assert.ok(japanese.some(resource => resource.levels.includes(level)));
});

test('bundled recommendations have safe public links, unique identities and complete learner support', () => {
  const resources = [...getListeningResources('fr-FR'), ...getListeningResources('ja-JP')];
  assert.equal(new Set(resources.map(resource => resource.id)).size, resources.length);
  assert.equal(new Set(resources.map(resource => resource.url)).size, resources.length);
  for (const resource of resources) {
    const url = new URL(resource.url);
    assert.equal(url.protocol, 'https:', resource.id);
    assert.equal(url.username, '', resource.id);
    assert.equal(url.password, '', resource.id);
    assert.ok(!['localhost', '127.0.0.1'].includes(url.hostname), resource.id);
    assert.ok(listeningFormats.includes(resource.format), resource.id);
    assert.ok(resource.levels.length > 0 && resource.levels.every(level => listeningLevels.includes(level)), resource.id);
    for (const field of ['title', 'provider', 'description', 'support', 'access', 'practice', 'levelNote'] as const) {
      assert.ok(resource[field].trim().length > 0, `${resource.id}: ${field}`);
    }
    assert.match(resource.checkedOn, /^\d{4}-\d{2}-\d{2}$/, resource.id);
    assert.ok(Number.isFinite(Date.parse(resource.checkedOn)), resource.id);
  }
});
