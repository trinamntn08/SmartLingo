import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createSession, initializeSession, listWorktrees, readSession, runSessionCommand } from '../session.mjs';

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
const root = fileURLToPath(new URL('../../', import.meta.url));
function fixture(t) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sll-sessions-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(temporary)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temporary).startsWith('sll-sessions-'));
    fs.rmSync(temporary, { recursive: true, force: true });
  });
  const directory = path.join(temporary, 'Project with spaces');
  fs.mkdirSync(directory);
  git(directory, ['init', '-b', 'main']);
  git(directory, ['config', 'user.name', 'Session test']);
  git(directory, ['config', 'user.email', 'session@example.invalid']);
  git(directory, ['config', 'core.autocrlf', 'false']);
  fs.writeFileSync(path.join(directory, '.gitignore'), '.codex/sessions/\n.env\nnode_modules/\ndata/\n');
  fs.writeFileSync(path.join(directory, 'source.txt'), 'committed\n');
  git(directory, ['add', '.gitignore', 'source.txt']);
  git(directory, ['commit', '-m', 'fixture']);
  return directory;
}

test('create preserves dirty source, staged bytes, branch and private files; worktree commits are isolated', t => {
  const source = fixture(t);
  fs.writeFileSync(path.join(source, 'source.txt'), 'staged\n');
  git(source, ['add', 'source.txt']);
  fs.writeFileSync(path.join(source, 'source.txt'), 'unstaged\n');
  fs.writeFileSync(path.join(source, '.env'), 'DUMMY=private-test-value\n');
  const before = git(source, ['status', '--porcelain=v1']);
  const head = git(source, ['rev-parse', 'HEAD']);
  const index = git(source, ['show', ':source.txt']);
  const session = createSession(source, 'first-task', { branch: 'feat/first-task' });
  assert.equal(git(source, ['status', '--porcelain=v1']), before);
  assert.equal(git(source, ['show', ':source.txt']), index);
  assert.equal(git(source, ['branch', '--show-current']), 'main');
  assert.equal(git(session.directory, ['branch', '--show-current']), 'feat/first-task');
  assert.equal(fs.readFileSync(path.join(session.directory, 'source.txt'), 'utf8'), 'committed\n');
  assert.equal(fs.existsSync(path.join(session.directory, '.env')), false);
  assert.equal(git(session.directory, ['check-ignore', '.codex/sessions/session.json']), '.codex/sessions/session.json');
  git(session.directory, ['add', session.checkpoint]);
  git(session.directory, ['commit', '-m', 'isolated checkpoint']);
  assert.equal(git(source, ['rev-parse', 'HEAD']), head);
  assert.equal(git(source, ['status', '--porcelain=v1']), before);
});

test('creating from a linked worktree uses the same sibling root and the requested committed base', t => {
  const source = fixture(t);
  const first = createSession(source, 'first');
  fs.writeFileSync(path.join(source, 'source.txt'), 'newer\n');
  git(source, ['add', 'source.txt']);
  git(source, ['commit', '-m', 'new base']);
  const second = createSession(first.directory, 'second', { base: 'main' });
  assert.equal(path.dirname(second.directory), path.dirname(first.directory));
  assert.equal(second.base, git(source, ['rev-parse', 'main']));
  assert.equal(listWorktrees(second.directory).length, 3);
});

test('refuse unsafe names, options, invalid refs, existing paths and branches without overwriting', t => {
  const source = fixture(t);
  for (const name of ['../escape', 'a/b', '--flag', 'Uppercase', 'a--b', 'x'.repeat(61)]) assert.throws(() => createSession(source, name));
  assert.throws(() => createSession(source, 'invalid-base', { base: '--help' }));
  assert.throws(() => createSession(source, 'invalid-branch', { branch: '--force' }));
  assert.throws(() => runSessionCommand(source, ['create', 'flags', '--base', 'main', '--base', 'HEAD']));
  assert.throws(() => runSessionCommand(source, ['create', 'flags', '--unknown', 'yes']));
  git(source, ['branch', 'chore/existing']);
  assert.throws(() => createSession(source, 'existing'));
  assert.equal(listWorktrees(source).length, 1);
  const first = createSession(source, 'safe');
  fs.writeFileSync(path.join(first.directory, 'keep.txt'), 'keep');
  assert.throws(() => createSession(source, 'safe'));
  assert.equal(fs.readFileSync(path.join(first.directory, 'keep.txt'), 'utf8'), 'keep');
});

test('initialization is idempotent and refuses reassignment or an existing checkpoint', t => {
  const source = fixture(t);
  const first = initializeSession(source, 'owned');
  fs.appendFileSync(path.join(source, first.checkpoint), '\nOwner progress.\n');
  assert.deepEqual(initializeSession(source, 'owned'), first);
  assert.match(fs.readFileSync(path.join(source, first.checkpoint), 'utf8'), /Owner progress/);
  assert.throws(() => initializeSession(source, 'another'), /already belongs/);
  fs.unlinkSync(path.join(source, '.codex/sessions/session.json'));
  assert.throws(() => initializeSession(source, 'owned'), /Checkpoint already exists/);
});

test('initialization refuses another worktree name and an active setup lock without writing a checkpoint', t => {
  const source = fixture(t);
  createSession(source, 'taken');
  const before = git(source, ['status', '--porcelain=v1']);
  assert.throws(() => initializeSession(source, 'taken'), /already registered in another worktree/);
  assert.equal(fs.existsSync(path.join(source, 'docs/sessions/taken.md')), false);
  assert.equal(git(source, ['status', '--porcelain=v1']), before);
  const lock = path.join(git(source, ['rev-parse', '--path-format=absolute', '--git-common-dir']), 'smartlingo-session-init.lock');
  fs.writeFileSync(lock, 'another initializer', { flag: 'wx' });
  assert.throws(() => initializeSession(source, 'fresh'), /busy or interrupted/);
  assert.equal(fs.readFileSync(lock, 'utf8'), 'another initializer');
  assert.equal(fs.existsSync(path.join(source, 'docs/sessions/fresh.md')), false);
  fs.unlinkSync(lock);
  assert.equal(initializeSession(source, 'fresh').name, 'fresh');
  assert.equal(fs.existsSync(lock), false);
});

test('list includes unregistered worktrees and metadata never redirects checkpoints outside the session', t => {
  const source = fixture(t);
  const session = createSession(source, 'registered');
  const inventory = runSessionCommand(source, ['list']);
  assert.equal(inventory.length, 2);
  assert.equal(inventory[0].session, null);
  assert.equal(inventory[1].session.name, 'registered');
  fs.writeFileSync(path.join(session.directory, '.codex/sessions/session.json'), JSON.stringify({ name: 'registered', checkpoint: '../../private.md' }));
  assert.equal(readSession(session.directory), null);
  assert.throws(() => initializeSession(session.directory, 'registered'), /metadata is invalid/);
});

test('startup hook selects the task checkpoint in a linked checkout without changing Git state', t => {
  const source = fixture(t);
  const session = createSession(source, 'hook-task');
  fs.mkdirSync(path.join(session.directory, 'scripts'));
  fs.copyFileSync(path.join(root, 'scripts/codex-hook.cjs'), path.join(session.directory, 'scripts/codex-hook.cjs'));
  const before = git(session.directory, ['status', '--porcelain=v1']);
  const result = spawnSync(process.execPath, [path.join(session.directory, 'scripts/codex-hook.cjs'), 'session-start'], { cwd: session.directory, input: '{}', encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(JSON.parse(result.stdout).hookSpecificOutput.additionalContext, /docs\/sessions\/hook-task.md/);
  assert.equal(git(session.directory, ['status', '--porcelain=v1']), before);
});
