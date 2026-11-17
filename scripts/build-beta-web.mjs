import { spawn, execFileSync } from 'node:child_process';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseBetaConfig, betaConfigScript } from './beta-config.mjs';
import { prepareOfflineExport } from './prepare-offline-web.mjs';
import { prepareHostedExport } from './prepare-hosted-web.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(root, 'apps/learner/dist');
const settings = JSON.parse(await readFile(path.join(root, 'deploy/beta.config.json'), 'utf8'));
const config = parseBetaConfig({ ...settings, ...(process.env.SMARTLINGO_API_URL !== undefined ? { apiUrl: process.env.SMARTLINGO_API_URL } : {}) });
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this build with npm run build:beta.');
// Remove old hashed bundles so a new upload contains exactly this release.
await rm(directory, { recursive: true, force: true });
await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [npmCli, 'run', 'export', '--workspace', '@smartlingo/learner'], {
    cwd: root, stdio: 'inherit', env: { ...process.env, EXPO_NO_TELEMETRY: '1' },
  });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Web export failed (${code}).`)));
});
await writeFile(path.join(directory, 'deployment-config.js'), betaConfigScript(config), 'utf8');
const indexPath = path.join(directory, 'index.html');
const html = await readFile(indexPath, 'utf8');
await writeFile(indexPath, html.replace('<head>', '<head>\n<script src="/deployment-config.js"></script>\n<meta name="robots" content="noindex,nofollow">'), 'utf8');
const manifest = await prepareOfflineExport(directory);
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const sourceDirty = !!execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: root, encoding: 'utf8' }).trim();
await prepareHostedExport(directory, sourceCommit, sourceDirty);
console.log(`Beta ready in apps/learner/dist: ${manifest.files.length} offline files, ${manifest.totalBytes} bytes. API ${config.apiUrl ? 'configured' : 'optional; not configured'}.`);
if (sourceDirty) console.log('Preview build has uncommitted source. Commit and rebuild before final release verification.');
