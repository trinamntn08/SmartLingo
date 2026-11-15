// Run locally when the managed Codex session cannot write protected metadata.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installationPlan } from './install-codex.mjs';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '');
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const run = args => execFileSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
const paths = [
  '.editorconfig', '.env.example', '.gitattributes', '.githooks', '.gitignore',
  '.npmrc', '.node-version', '.nvmrc',
  'AGENTS.md', 'CONTRIBUTING.md', 'PROJECT_PLAN.md', 'README.md',
  'docs', 'package.json', 'package-lock.json', 'references', 'scripts', 'tooling',
  '.codex/config.toml', '.codex/hooks.json', '.codex/agents', '.agents/skills'
];
try {
  installationPlan(root); // Detect target conflicts without changing files.
  if (!process.argv.includes('--apply')) {
    console.log('Would install prepared Codex files and resources, configure local Git hooks, run checks/tests, stage bootstrap paths, set hook executable mode, and create the initial commit.');
    console.log('No global config, hook trust, remote, push, or paid API operation is included.');
    process.exit(0);
  }
  let hasHead = false;
  try { git(['rev-parse', '--verify', 'HEAD']); hasHead = true; } catch {}
  if (hasHead) throw new Error('History already exists. Use setup:codex and the normal reviewed commit workflow instead.');
  if (git(['diff', '--cached', '--name-only'])) throw new Error('The index already contains staged changes. Review them before initial setup.');
  for (const key of ['user.name', 'user.email']) {
    if (!git(['config', '--get', key])) throw new Error('Configure your Git identity locally before committing.');
  }
  run(['scripts/install-codex.mjs', '--apply']);
  run(['scripts/setup-git.mjs']);
  run(['scripts/check-repo.mjs']);
  run(['--test', 'scripts/tests/tooling.test.mjs']);
  for (const entry of paths) {
    if (!fs.existsSync(path.join(root, entry))) throw new Error('Missing bootstrap path: ' + entry);
  }
  git(['add', '--', ...paths]);
  git(['update-index', '--chmod=+x', '.githooks/pre-commit']);
  run(['scripts/check-repo.mjs', '--staged']);
  execFileSync('git', ['commit', '-m', 'chore: bootstrap Codex project workflows and Git tooling'], { cwd: root, stdio: 'inherit' });
  console.log('Initial setup committed locally. Review project hook trust in Codex; no remote was created or pushed.');
} catch (error) {
  console.error('Setup stopped: ' + error.message);
  console.error('Files are preserved. Review git status before retrying; no rollback or destructive cleanup was performed.');
  process.exitCode = 1;
}
