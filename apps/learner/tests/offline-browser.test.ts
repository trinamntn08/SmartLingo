import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offlineAssets, parseOfflineManifest } from '../src/offline/browser';

const file = { url: '/index.html', size: 25, sha256: 'a'.repeat(64) };
const manifest = { formatVersion: 1, buildId: 'b'.repeat(64), totalBytes: 25, files: [file] };

test('offline download estimates reject invalid versions, sizes, duplicates and non-root URLs', () => {
  assert.deepEqual(parseOfflineManifest(manifest), manifest);
  for (const invalid of [null, {}, { ...manifest, formatVersion: 2 }, { ...manifest, buildId: 'invalid' },
    { ...manifest, totalBytes: 26 }, { ...manifest, files: [] }, { ...manifest, files: [file, file], totalBytes: 50 },
    ...['//attacker.test/a', 'https://attacker.test/a', '/a/../index.html', '/index.html?key=1', '/index.html#hash', '/\\private'].map(url => ({ ...manifest, files: [{ ...file, url }] })),
    ...[-1, 1.5, 100 * 1024 * 1024].map(size => ({ ...manifest, totalBytes: size, files: [{ ...file, size }] })),
    { ...manifest, files: [{ ...file, sha256: 'broken' }] },
  ]) assert.throws(() => parseOfflineManifest(invalid));
});

test('unsupported offline access has an honest status and never registers or writes storage', async () => {
  const result = await offlineAssets.inspect();
  assert.equal(result.canDownload, false);
  assert.deepEqual(result.saved, { state: 'empty', bytes: 0 });
  await assert.rejects(offlineAssets.download(() => {}), /unavailable/);
  await assert.rejects(offlineAssets.remove(), /cannot be managed/);
});
