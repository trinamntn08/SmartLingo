// Only the isolated browser suite runs this server. It never opens owner storage.
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createWebPreview } from '../../scripts/serve-web.mjs';

const directory = fileURLToPath(new URL('../../apps/learner/dist/', import.meta.url));
const baseManifest = JSON.parse(await readFile(`${directory}offline-manifest.json`, 'utf8'));
const updatedIndex = Buffer.from((await readFile(`${directory}index.html`, 'utf8')).replace('</head>', '<meta name="smartlingo-test-build" content="updated" /></head>'));
const updatedFiles = baseManifest.files.map(file => file.url === '/index.html' ? {
  ...file, size: updatedIndex.length, sha256: createHash('sha256').update(updatedIndex).digest('hex'),
} : file);
const updatedManifest = { ...baseManifest, buildId: createHash('sha256').update(JSON.stringify(updatedFiles)).digest('hex'), files: updatedFiles, totalBytes: updatedFiles.reduce((sum, file) => sum + file.size, 0) };
const preview = createWebPreview(directory);
const serve = preview.listeners('request')[0];
let updated = false;
let failNextAsset = false;
let corruptNextAsset = false;
let stallDocument = false;

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost:8082');
  if (request.method === 'POST' && url.pathname === '/__test__/mode') {
    updated = url.searchParams.get('updated') === '1';
    failNextAsset = url.searchParams.get('fail') === '1';
    corruptNextAsset = url.searchParams.get('corrupt') === '1';
    stallDocument = url.searchParams.get('stall') === '1';
    response.writeHead(204).end(); return;
  }
  if (request.method === 'GET' && stallDocument && ['/', '/index.html'].includes(url.pathname)) return;
  if (request.method === 'GET' && url.pathname.startsWith('/_expo/')) {
    if (failNextAsset) { response.destroy(); return; }
    if (corruptNextAsset) {
      corruptNextAsset = false;
      const bytes = Buffer.from(await readFile(new URL(`../../apps/learner/dist${url.pathname}`, import.meta.url)));
      bytes[0] ^= 1;
      response.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }).end(bytes); return;
    }
  }
  if (request.method === 'GET' && updated && url.pathname === '/offline-manifest.json') {
    response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(JSON.stringify(updatedManifest)); return;
  }
  if (request.method === 'GET' && updated && ['/', '/index.html'].includes(url.pathname)) {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(updatedIndex); return;
  }
  await serve(request, response);
}).listen(8082, '127.0.0.1', () => console.log('Isolated offline browser test server on localhost:8082'));
