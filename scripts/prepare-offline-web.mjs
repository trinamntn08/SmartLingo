import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultDirectory = fileURLToPath(new URL('../apps/learner/dist/', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const excludedFiles = new Set(['404.html', '_headers', '_redirects', 'smartlingo-sw.js', 'offline-manifest.json', 'metadata.json']);

async function exportFiles(directory, relative = '') {
  const files = [];
  for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Offline exports cannot include symbolic links');
    if (entry.isDirectory()) files.push(...await exportFiles(directory, name));
    else if (entry.isFile() && !excludedFiles.has(name) && !name.endsWith('.map')) files.push(name);
  }
  return files.sort();
}

/** Fingerprint actual exported bytes, never a development bundle or private data. */
export async function prepareOfflineExport(directory = defaultDirectory) {
  const indexPath = path.join(directory, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  if (!html.includes('rel="manifest"')) {
    html = html.replace('</head>', '  <link rel="manifest" href="/manifest.webmanifest" />\n    <meta name="theme-color" content="#F5F2E8" />\n  </head>');
    await writeFile(indexPath, html, 'utf8');
  }
  for (const required of ['smartlingo-sw.js', 'manifest.webmanifest', 'icon.svg']) await readFile(path.join(directory, required));
  const files = [];
  for (const filename of await exportFiles(directory)) {
    const bytes = await readFile(path.join(directory, filename));
    files.push({ url: `/${filename.split('/').map(encodeURIComponent).join('/')}`, size: bytes.byteLength, sha256: hash(bytes) });
  }
  if (!files.some(file => /^\/_expo\/.*\.js$/.test(file.url))) throw new Error('Offline export has no production JavaScript bundle');
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (files.length > 2000 || totalBytes > 100 * 1024 * 1024 || files.some(file => file.size > 32 * 1024 * 1024)) throw new Error('Offline export exceeds supported pack limits');
  const manifest = { formatVersion: 1, buildId: hash(JSON.stringify(files)), totalBytes, files };
  await writeFile(path.join(directory, 'offline-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const manifest = await prepareOfflineExport();
  console.log(`Prepared offline preview: ${manifest.files.length} files, ${manifest.totalBytes} bytes, build ${manifest.buildId.slice(0, 12)}.`);
}
