import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const metadataPath = '.codex/sessions/session.json';
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

export function sessionName(name) {
  if (typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 60) {
    throw new Error('Use a session name of at most 60 lowercase letters, numbers and single hyphens.');
  }
  return name;
}

export function listWorktrees(cwd) {
  return git(cwd, ['worktree', 'list', '--porcelain', '-z']).split('\0\0').filter(Boolean).map(block => {
    const fields = block.split('\0');
    return {
      directory: fields.find(field => field.startsWith('worktree '))?.slice(9),
      branch: fields.find(field => field.startsWith('branch '))?.slice(7) ?? '(detached or bare)',
      head: fields.find(field => field.startsWith('HEAD '))?.slice(5),
    };
  });
}

/** Local metadata is advisory; Git remains the authoritative inventory. */
export function readSession(directory) {
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, metadataPath), 'utf8'));
    sessionName(metadata.name);
    if (metadata.checkpoint !== `docs/sessions/${metadata.name}.md`) return null;
    return metadata;
  } catch { return null; }
}

export function initializeSession(cwd, name) {
  sessionName(name);
  const directory = git(cwd, ['rev-parse', '--show-toplevel']);
  const common = git(directory, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
  const lock = path.join(common, 'smartlingo-session-init.lock');
  let handle;
  try { handle = fs.openSync(lock, 'wx'); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Session initialization is busy or interrupted. Inspect ${lock}; retry after its owner finishes. See docs/PARALLEL_SESSIONS.md for recovery.`);
    throw error;
  }
  try {
    fs.writeFileSync(handle, JSON.stringify({ pid: process.pid, directory }) + '\n');
    return registerCheckout(directory, name);
  } finally {
    fs.closeSync(handle);
    fs.unlinkSync(lock);
  }
}

function registerCheckout(directory, name) {
  const current = readSession(directory);
  if (current) {
    if (current.name !== name) throw new Error(`This checkout already belongs to session ${current.name}.`);
    if (!fs.existsSync(path.join(directory, current.checkpoint))) throw new Error('Session checkpoint is missing; recover it before continuing.');
    return current;
  }
  const local = path.join(directory, metadataPath);
  if (fs.existsSync(local)) throw new Error('Existing session metadata is invalid; inspect it without overwriting it.');
  if (listWorktrees(directory).some(item => path.resolve(item.directory) !== path.resolve(directory) && readSession(item.directory)?.name === name)) {
    throw new Error('Session name is already registered in another worktree.');
  }
  const branch = git(directory, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  const metadata = { name, branch, base: git(directory, ['rev-parse', 'HEAD']), checkpoint: `docs/sessions/${name}.md` };
  const checkpoint = path.join(directory, metadata.checkpoint);
  if (fs.existsSync(checkpoint)) throw new Error('Checkpoint already exists; choose a fresh session name.');
  fs.mkdirSync(path.dirname(checkpoint), { recursive: true });
  fs.mkdirSync(path.dirname(local), { recursive: true });
  fs.writeFileSync(checkpoint, `# Session: ${name}\n\nBranch: ${branch}. Base: ${metadata.base}.\n\n## Request and ownership\n\nRecord the authorised request, acceptance criteria, exclusive paths and shared-file dependencies before editing.\n\n## Progress and validation\n\nNot started. Record actual checks, local checkpoint commits, remaining limitations and exact next action.\n\n## Runtime and recovery\n\nRecord owned ports, processes, browser origin and temporary data paths before starting servers. Read docs/PARALLEL_SESSIONS.md. Usage allowance unavailable until observed; automatic resume is not configured.\n`, { flag: 'wx' });
  fs.writeFileSync(local, JSON.stringify(metadata, null, 2) + '\n', { flag: 'wx' });
  return metadata;
}

export function createSession(cwd, name, { branch = `chore/${name}`, base = 'HEAD' } = {}) {
  sessionName(name);
  if (!/^(?:feat|fix|docs|chore)\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(branch)) throw new Error('Use a new feat/, fix/, docs/ or chore/ branch with lowercase words.');
  git(cwd, ['check-ref-format', '--branch', branch]);
  const commit = git(cwd, ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`]);
  const worktrees = listWorktrees(cwd);
  const main = worktrees[0].directory;
  const directory = path.join(path.dirname(main), `${path.basename(main)}-sessions`, name);
  if (fs.existsSync(directory)) throw new Error(`Target already exists: ${directory}`);
  if (worktrees.some(item => readSession(item.directory)?.name === name)) throw new Error('Session name is already registered in another worktree.');
  // Git refuses an existing branch. Never switch, stash, reset or stage in the caller.
  git(cwd, ['worktree', 'add', '-b', branch, directory, commit]);
  try {
    return { directory, ...initializeSession(directory, name) };
  } catch (error) {
    throw new Error(`Worktree preserved at ${directory}; initialization needs attention: ${error.message}`);
  }
}

export function runSessionCommand(cwd, args) {
  const [command, name, ...flags] = args;
  if (command === 'list' && name === undefined) {
    return listWorktrees(cwd).map(item => ({ ...item, session: readSession(item.directory) }));
  }
  if (command === 'init' && name && flags.length === 0) return initializeSession(cwd, name);
  if (command === 'create' && name) {
    const options = {};
    for (let i = 0; i < flags.length; i += 2) {
      const key = flags[i]?.slice(2);
      if (!['--base', '--branch'].includes(flags[i]) || !flags[i + 1] || Object.hasOwn(options, key)) throw new Error('Use --base <commit-or-ref> and/or --branch <new-branch> once each.');
      options[key] = flags[i + 1];
    }
    return createSession(cwd, name, options);
  }
  throw new Error('Usage: npm run session -- create <name> [--branch feat/name] [--base HEAD] | init <name> | list');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = runSessionCommand(process.cwd(), process.argv.slice(2));
    console.log(JSON.stringify(result, null, 2));
    if (process.argv[2] === 'create') console.log('Open the returned directory as a separate project/chat. Run npm ci there; read docs/PARALLEL_SESSIONS.md. Only committed files were copied.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
