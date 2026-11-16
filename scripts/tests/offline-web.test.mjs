import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { request } from 'node:http';
import { prepareOfflineExport } from '../prepare-offline-web.mjs';
import { prepareHostedExport } from '../prepare-hosted-web.mjs';
import { createWebPreview } from '../serve-web.mjs';

test('offline manifest fingerprints export bytes reproducibly and excludes worker metadata/maps', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'smartlingo-export-'));
  try {
    await mkdir(path.join(directory, '_expo'));
    for (const [name, content] of Object.entries({ 'index.html': '<html><head></head><body></body></html>', 'smartlingo-sw.js': '// worker', 'manifest.webmanifest': '{}', 'icon.svg': '<svg/>', '_expo/app.js': 'app bytes', '_expo/app.js.map': 'not needed', 'metadata.json': '{}' })) await writeFile(path.join(directory, name), content);
    const first = await prepareOfflineExport(directory);
    assert.deepEqual(await prepareOfflineExport(directory), first);
    assert.deepEqual(first.files.map(file => file.url), ['/_expo/app.js', '/icon.svg', '/index.html', '/manifest.webmanifest']);
    assert.equal(first.totalBytes, first.files.reduce((sum, file) => sum + file.size, 0));
    for (const file of first.files) {
      const bytes = await readFile(path.join(directory, file.url.slice(1)));
      assert.equal(file.sha256, createHash('sha256').update(bytes).digest('hex'));
      assert.equal(file.size, bytes.length);
    }
    const html = await readFile(path.join(directory, 'index.html'), 'utf8');
    assert.equal(html.match(/rel="manifest"/g).length, 1);
    await writeFile(path.join(directory, '_expo/app.js'), 'changed app bytes');
    assert.notEqual((await prepareOfflineExport(directory)).buildId, first.buildId);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('hosted controls are generated after fingerprinting and never enter the offline manifest', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'smartlingo-hosted-'));
  try {
    await mkdir(path.join(directory, '_expo'));
    for (const [name, content] of Object.entries({ 'index.html': '<html><head></head><body>hosted</body></html>', 'smartlingo-sw.js': '// worker', 'manifest.webmanifest': '{}', 'icon.svg': '<svg/>', '_expo/app.js': 'hosted bytes', '_headers': 'stale', '404.html': 'stale', 'metadata.json': '{}' })) await writeFile(path.join(directory, name), content);
    const manifest = await prepareOfflineExport(directory);
    const sourceCommit = 'a'.repeat(40);
    const metadata = await prepareHostedExport(directory, sourceCommit, false);
    assert.equal(metadata.sourceCommit, sourceCommit);
    assert.equal(metadata.offlineBuildId, manifest.buildId);
    assert.equal(manifest.files.some(file => ['/404.html', '/_headers', '/_redirects', '/metadata.json'].includes(file.url)), false);
    assert.match(await readFile(path.join(directory, '_headers'), 'utf8'), /X-Robots-Tag: noindex, nofollow/);
    assert.match(await readFile(path.join(directory, '_headers'), 'utf8'), /X-Content-Type-Options: nosniff/);
    assert.match(await readFile(path.join(directory, '404.html'), 'utf8'), /Page not found/);
    assert.deepEqual(JSON.parse(await readFile(path.join(directory, 'metadata.json'), 'utf8')), {
      formatVersion: 1, deploymentMode: 'hosted', sourceCommit, sourceDirty: false, offlineBuildId: manifest.buildId,
    });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('exported preview serves only known files with correct types and loopback Host', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'smartlingo-preview-'));
  const server = createWebPreview(directory);
  try {
    await writeFile(path.join(directory, 'index.html'), '<html>preview</html>');
    await writeFile(path.join(directory, 'smartlingo-sw.js'), '// worker');
    await writeFile(path.join(directory, '.private'), 'never serve');
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    const page = await fetch(url);
    assert.equal(await page.text(), '<html>preview</html>');
    assert.match(page.headers.get('content-type'), /text\/html/);
    assert.equal(page.headers.get('cache-control'), 'no-store');
    assert.match((await fetch(`${url}/smartlingo-sw.js`)).headers.get('content-type'), /javascript/);
    for (const [name, type] of [['coffee.jpg', 'image/jpeg'], ['street.webp', 'image/webp']]) {
      await writeFile(path.join(directory, name), 'test image bytes');
      assert.equal((await fetch(`${url}/${name}`)).headers.get('content-type'), type);
    }
    for (const name of ['/missing.js', '/.private', '/%2e%2e%5cpackage.json']) assert.equal((await fetch(`${url}${name}`)).status, 404);
    assert.equal((await fetch(url, { method: 'POST' })).status, 405);
    const refused = await new Promise((resolve, reject) => {
      const req = request(url, { headers: { host: 'attacker.test' } }, response => { response.resume(); resolve(response.statusCode); });
      req.on('error', reject); req.end();
    });
    assert.equal(refused, 403);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
