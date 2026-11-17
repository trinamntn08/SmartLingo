import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultDirectory = fileURLToPath(new URL('../apps/learner/dist/', import.meta.url));

const headers = `/*
  Cache-Control: no-cache
  X-Content-Type-Options: nosniff
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY

/smartlingo-sw.js
  Content-Type: application/javascript; charset=utf-8

/offline-manifest.json
  Content-Type: application/json; charset=utf-8

/manifest.webmanifest
  Content-Type: application/manifest+json; charset=utf-8

/metadata.json
  Content-Type: application/json; charset=utf-8

/deployment-config.js
  Content-Type: application/javascript; charset=utf-8
`;

const notFound = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Page not found · SmartLingo</title></head>
<body><main><h1>Page not found</h1><p>This free SmartLingo test preview has no page at this address.</p><p><a href="/">Return to the learner</a></p></main></body></html>
`;

export async function prepareHostedExport(directory = defaultDirectory, sourceCommit, sourceDirty = true) {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit ?? '')) throw new Error('Hosted release requires a full Git source commit');
  if (typeof sourceDirty !== 'boolean') throw new Error('Hosted release requires explicit source worktree state');
  const manifest = JSON.parse(await readFile(path.join(directory, 'offline-manifest.json'), 'utf8'));
  if (!/^[a-f0-9]{64}$/.test(manifest.buildId ?? '') || !Array.isArray(manifest.files)) throw new Error('Hosted release requires a valid offline manifest');
  const excluded = new Set(['/404.html', '/_headers', '/_redirects', '/metadata.json']);
  if (manifest.files.some(file => excluded.has(file.url))) throw new Error('Hosted control files must not enter the offline manifest');
  const metadata = { formatVersion: 1, deploymentMode: 'hosted', sourceCommit, sourceDirty, offlineBuildId: manifest.buildId };
  await writeFile(path.join(directory, '_headers'), headers, 'utf8');
  await writeFile(path.join(directory, '404.html'), notFound, 'utf8');
  await writeFile(path.join(directory, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  return metadata;
}
