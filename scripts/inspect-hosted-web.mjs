import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('../apps/learner/dist/', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

async function list(relative = '') {
  const files = [];
  for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Release contains a symbolic link: ${name}`);
    if (entry.isDirectory()) files.push(...await list(name));
    else if (entry.isFile()) files.push(name);
  }
  return files;
}

const files = (await list()).sort();
const required = ['index.html', '404.html', '_headers', 'smartlingo-sw.js', 'offline-manifest.json', 'metadata.json'];
if (required.some(name => !files.includes(name))) throw new Error('Hosted release is missing a required document or control file');
if (files.length > 20000) throw new Error('Hosted release exceeds the Cloudflare Pages Free file limit');
const forbiddenNames = files.filter(name => /(^|\/)(?:\.env(?:\.|$)|.*\.(?:sqlite3?|db|bak|backup|map)|.*(?:recording|transcript).*)/i.test(name));
if (forbiddenNames.length) throw new Error(`Hosted release contains forbidden private/debug files: ${forbiddenNames.join(', ')}`);

const measured = [];
for (const name of files) {
  const bytes = await readFile(path.join(directory, name));
  if (bytes.byteLength > 25 * 1024 * 1024) throw new Error(`Hosted file exceeds 25 MiB: ${name}`);
  measured.push({ name, size: bytes.byteLength });
  const text = /\.(?:html|js|json|txt|xml|webmanifest)$|^_headers$/.test(name) ? bytes.toString('utf8') : '';
  if (/\b(?:OPENAI_API_KEY|AZURE_SPEECH_KEY)\b|\bsk-[A-Za-z0-9_-]{20,}\b/.test(text)) throw new Error(`Hosted release may contain a credential in ${name}`);
}

const manifest = JSON.parse(await readFile(path.join(directory, 'offline-manifest.json'), 'utf8'));
const excluded = new Set(['/404.html', '/_headers', '/_redirects', '/metadata.json', '/smartlingo-sw.js', '/offline-manifest.json']);
let total = 0;
for (const file of manifest.files) {
  if (excluded.has(file.url)) throw new Error(`Offline manifest contains excluded hosted file: ${file.url}`);
  const decoded = file.url.slice(1).split('/').map(decodeURIComponent).join('/');
  const bytes = await readFile(path.join(directory, decoded));
  if (bytes.byteLength !== file.size || hash(bytes) !== file.sha256) throw new Error(`Offline manifest mismatch: ${file.url}`);
  total += bytes.byteLength;
}
if (total !== manifest.totalBytes) throw new Error('Offline manifest total does not match verified bytes');
const metadata = JSON.parse(await readFile(path.join(directory, 'metadata.json'), 'utf8'));
if (metadata.deploymentMode !== 'hosted' || metadata.sourceDirty !== false || metadata.offlineBuildId !== manifest.buildId || !/^[a-f0-9]{40}$/.test(metadata.sourceCommit)) throw new Error('Hosted metadata does not describe a clean committed release');
const largest = measured.sort((a, b) => b.size - a.size)[0];
const totalBytes = measured.reduce((sum, file) => sum + file.size, 0);
console.log(JSON.stringify({ files: files.length, totalBytes, largest, offlineFiles: manifest.files.length, offlineBytes: total, buildId: manifest.buildId, sourceCommit: metadata.sourceCommit }, null, 2));
