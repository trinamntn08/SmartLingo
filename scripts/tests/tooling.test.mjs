import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { parseProjectToml, parseSkill } from '../lib/config.mjs';
import { containsCredential, protectedPath, scanStaged } from '../lib/secrets.mjs';
import { installationPlan, installPrepared } from '../install-codex.mjs';
import { markdownSources } from '../check-repo.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
function temporaryRepo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sll-tooling-'));
  t.after(() => {
    const resolved = path.resolve(dir);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('sll-tooling-'));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  execFileSync('git', ['init', '-b', 'main'], { cwd: dir, stdio: 'ignore' });
  return dir;
}
const git = (cwd, args) => execFileSync('git', args, { cwd, stdio: 'pipe' });

test('parse emitted TOML with multiline instructions and concurrency table', () => {
  assert.equal(parseProjectToml('[agents]\nmax_concurrent_threads_per_session = 3').agents.max_concurrent_threads_per_session, 3);
  assert.equal(parseProjectToml('name = "demo"\ndeveloper_instructions = """\nLine one\nLine two\n"""').developer_instructions, 'Line one\nLine two');
});
test('reject invalid, unsupported, duplicate, and prototype TOML keys', () => {
  for (const value of ['name = "a"\nname = "b"', 'x = [1,2]', 'x = """\nno end', '[__proto__]\nx = 1']) {
    assert.throws(() => parseProjectToml(value));
  }
  assert.equal({}.x, undefined);
});
test('parse project skill frontmatter and reject missing or duplicate metadata', () => {
  const text = '---\nname: example-skill\ndescription: Implement a focused project workflow.\n---\nFollow the actual acceptance criteria and check the outcome.';
  assert.equal(parseSkill(text).name, 'example-skill');
  assert.throws(() => parseSkill(text.replace('description:', 'name:')));
  assert.throws(() => parseSkill('# No metadata'));
});
test('block local data/secrets while permitting templates and source curriculum', () => {
  for (const file of ['.env', '.ENV', 'apps/api/.ENV.LOCAL', 'apps/api/.env.local', 'local.key', 'data/local.sqlite', 'exports/learner.json', 'recordings/a.wav']) assert.equal(protectedPath(file), true);
  for (const file of ['.env.example', '.ENV.EXAMPLE', 'apps/api/.env.local.example', 'packages/content/lesson.json', 'references/1.jpg']) assert.equal(protectedPath(file), false);
});
test('recognise likely credential values without matching placeholder names', () => {
  assert.equal(containsCredential('sk-' + 'x'.repeat(30)), true);
  assert.equal(containsCredential('ghp_' + 'x'.repeat(30)), true);
  assert.equal(containsCredential('OPENAI_API_KEY=\n'), false);
});
test('scan index bytes even after worktree credential was removed', t => {
  const dir = temporaryRepo(t);
  const file = path.join(dir, 'config.txt');
  fs.writeFileSync(file, 'sk-' + 'x'.repeat(30));
  git(dir, ['add', 'config.txt']);
  fs.writeFileSync(file, 'safe worktree');
  const issues = scanStaged(dir);
  assert.equal(issues.length, 1);
  assert.ok(issues[0].includes('config.txt'));
  assert.ok(!issues[0].includes('x'.repeat(30)));
});
test('scan staged Unicode filenames and allow safe index despite dirty worktree', t => {
  const dir = temporaryRepo(t);
  const file = 'français café.txt';
  fs.writeFileSync(path.join(dir, file), 'safe');
  git(dir, ['add', file]);
  fs.writeFileSync(path.join(dir, file), 'sk-' + 'x'.repeat(30));
  assert.deepEqual(scanStaged(dir), []);
});
test('reject protected paths added to index', t => {
  const dir = temporaryRepo(t);
  fs.writeFileSync(path.join(dir, '.env'), 'DUMMY=');
  git(dir, ['add', '.env']);
  assert.ok(scanStaged(dir)[0].startsWith('Protected'));
});
test('documentation checks exclude ignored Markdown and tracked learner data', t => {
  const dir = temporaryRepo(t);
  fs.writeFileSync(path.join(dir, '.gitignore'), 'dist/\ntranscripts/\n');
  fs.writeFileSync(path.join(dir, 'README.md'), '# Source documentation');
  for (const folder of ['dist', 'transcripts', 'exports']) {
    fs.mkdirSync(path.join(dir, folder));
    fs.writeFileSync(path.join(dir, folder, 'private.md'), '[Private](missing.md)');
  }
  git(dir, ['add', '-f', 'exports/private.md']);
  assert.deepEqual(markdownSources(dir), ['README.md']);
});
test('installer dry run lists all fifteen target files without creating them', t => {
  const dir = temporaryRepo(t);
  fs.cpSync(path.join(root, 'tooling'), path.join(dir, 'tooling'), { recursive: true });
  const plan = installationPlan(dir);
  assert.equal(plan.length, 15);
  assert.equal(fs.existsSync(path.join(dir, '.codex')), false);
  assert.ok(plan.every(item => item.to.startsWith(dir + path.sep)));
});
test('installer refuses differing existing configuration before copying', t => {
  const dir = temporaryRepo(t);
  fs.cpSync(path.join(root, 'tooling'), path.join(dir, 'tooling'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.codex'));
  fs.writeFileSync(path.join(dir, '.codex/config.toml'), 'owner setting');
  assert.throws(() => installationPlan(dir), /Existing target differs/);
  assert.equal(fs.existsSync(path.join(dir, '.agents')), false);
});
test('installer copies prepared files and is idempotent in an isolated repository', t => {
  const dir = temporaryRepo(t);
  fs.cpSync(path.join(root, 'tooling'), path.join(dir, 'tooling'), { recursive: true });
  assert.equal(installPrepared(dir).length, 15);
  const plan = installationPlan(dir);
  assert.ok(plan.every(item => item.exists));
  for (const item of plan) assert.ok(fs.readFileSync(item.from).equals(fs.readFileSync(item.to)), item.to);
  const researchRoot = path.join(dir, '.agents/skills/french-curriculum-researcher');
  assert.equal(JSON.parse(fs.readFileSync(path.join(researchRoot, 'assets/topic-seeds.json'), 'utf8')).length, 32);
  assert.equal(JSON.parse(fs.readFileSync(path.join(researchRoot, 'references/content-schema.json'), 'utf8')).properties.review_status.const, 'draft');
  assert.equal(installPrepared(dir).filter(item => !item.exists).length, 0);
  assert.equal(fs.readFileSync(path.join(dir, '.codex/config.toml'), 'utf8'), fs.readFileSync(path.join(dir, 'tooling/codex/config.toml'), 'utf8'));
});
function hook(mode, event, cwd = root) {
  const config = JSON.parse(fs.readFileSync(path.join(root, 'tooling/codex/hooks.json'), 'utf8'));
  const command = config.hooks[mode === 'session-start' ? 'SessionStart' : 'Stop'][0].hooks[0].command;
  return spawnSync(command, { cwd, shell: true, input: event, encoding: 'utf8', timeout: 20000 });
}
test('configured session hook resolves project root from nested folder', () => {
  const result = hook('session-start', JSON.stringify({ hook_event_name: 'SessionStart', source: 'startup' }), path.join(root, 'docs'));
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.ok(output.hookSpecificOutput.additionalContext.includes('docs/STATUS.md'));
});
test('malformed hook event produces an advisory JSON warning', () => {
  const result = hook('session-start', '{bad');
  assert.equal(result.status, 0, result.stderr);
  assert.ok(JSON.parse(result.stdout).systemMessage);
});
test('stop hook recursion guard never requests another turn', () => {
  const result = hook('stop', JSON.stringify({ stop_hook_active: true }));
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {});
});
test('normal stop hook returns valid non-blocking JSON', () => {
  const result = hook('stop', '{}');
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.deepEqual(output, {});
  assert.equal(output.decision, undefined);
  assert.equal(output.continue, undefined);
});
