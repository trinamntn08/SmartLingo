import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { parseProjectToml, parseSkill } from './lib/config.mjs';
import { scanStaged, protectedPath } from './lib/secrets.mjs';

export function markdownSources(root) {
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  return [...new Set(files.split('\0').filter(name => name.endsWith('.md') && !protectedPath(name)))];
}

export function checkRepository(root, { staged = false } = {}) {
  const issues = [];
  const requireFile = name => {
    if (!fs.existsSync(path.join(root, name))) issues.push('Missing file: ' + name);
  };
  for (const file of ['AGENTS.md', 'README.md', 'PROJECT_PLAN.md', 'docs/STATUS.md', 'docs/CODEX_SETUP.md', '.gitignore', '.gitattributes', '.githooks/pre-commit', '.env.example']) requireFile(file);
  const configurations = [['tooling/codex', 'tooling/agents/skills']];
  if (fs.existsSync(path.join(root, '.codex/config.toml'))) configurations.push(['.codex', '.agents/skills']);
  for (const [codexPath, skillPath] of configurations) {
    try {
      const config = parseProjectToml(fs.readFileSync(path.join(root, codexPath, 'config.toml'), 'utf8'));
      if (Object.keys(config).some(k => k !== 'agents') || !config.agents || Object.keys(config.agents).some(k => k !== 'max_concurrent_threads_per_session')) throw new Error('Unexpected project setting; update validator after official-doc review');
      if (config.agents.max_concurrent_threads_per_session !== 3) throw new Error('Expected concurrency cap of three subagents');
      const names = new Set();
      const agents = fs.readdirSync(path.join(root, codexPath, 'agents')).filter(f => f.endsWith('.toml'));
      const expectedRoles = ['api-builder', 'change-reviewer', 'curriculum-author', 'ui-builder', 'visual-asset-maker'];
      if (agents.length !== expectedRoles.length || expectedRoles.some(name => !agents.includes(name + '.toml'))) throw new Error('Unexpected project agent inventory');
      for (const file of agents) {
        const role = parseProjectToml(fs.readFileSync(path.join(root, codexPath, 'agents', file), 'utf8'));
        if (Object.keys(role).some(k => !['name', 'description', 'developer_instructions'].includes(k))) throw new Error('Unexpected role setting: ' + file);
        for (const key of ['name', 'description', 'developer_instructions']) if (typeof role[key] !== 'string' || !role[key].trim()) throw new Error('Missing role field: ' + file);
        if (role.name !== path.basename(file, '.toml') || names.has(role.name)) throw new Error('Duplicate or mismatched role name');
        names.add(role.name);
      }
      const hooks = JSON.parse(fs.readFileSync(path.join(root, codexPath, 'hooks.json'), 'utf8'));
      if (!hooks.hooks || Object.keys(hooks.hooks).sort().join(',') !== 'SessionStart,Stop') throw new Error('Expected start and advisory stop hooks');
      for (const groups of Object.values(hooks.hooks)) {
        for (const group of groups) for (const hook of group.hooks) {
          if (hook.type !== 'command' || typeof hook.command !== 'string' || !hook.command.includes('scripts/codex-hook.cjs') || hook.timeout > 15) throw new Error('Invalid project command hook');
        }
      }
      const skillNames = fs.readdirSync(path.join(root, skillPath));
      const expectedSkills = ['french-curriculum-researcher', 'sll-author-french', 'sll-create-visuals', 'sll-deliver-feature', 'sll-review-change'];
      if (skillNames.length !== expectedSkills.length || expectedSkills.some(name => !skillNames.includes(name))) throw new Error('Unexpected project skill inventory');
      for (const folder of skillNames) {
        const skill = parseSkill(fs.readFileSync(path.join(root, skillPath, folder, 'SKILL.md'), 'utf8'));
        if (skill.name !== folder) throw new Error('Skill folder/name mismatch: ' + folder);
      }
    } catch (error) { issues.push(codexPath + ': ' + error.message); }
  }
  function checkMarkdown() {
    for (const name of markdownSources(root)) {
      const file = path.join(root, name);
      if (fs.existsSync(file) && !fs.lstatSync(file).isSymbolicLink()) {
        const text = fs.readFileSync(file, 'utf8');
        for (const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
          const target = m[1];
          if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
          const local = decodeURIComponent(target.split('#')[0]);
          if (local && !fs.existsSync(path.resolve(path.dirname(file), local))) issues.push('Broken Markdown link in ' + path.relative(root, file) + ': ' + local);
        }
      }
    }
  }
  try { checkMarkdown(); } catch (error) { issues.push('Documentation: ' + error.message); }
  function syntax(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) syntax(p);
      else if (/\.(?:mjs|cjs)$/.test(p)) {
        try { execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' }); }
        catch { issues.push('Invalid JavaScript syntax: ' + path.relative(root, p)); }
      }
    }
  }
  try { syntax(path.join(root, 'scripts')); } catch (error) { issues.push('Scripts: ' + error.message); }
  try {
    execFileSync('git', ['diff', ...(staged ? ['--cached'] : []), '--check'], { cwd: root, stdio: 'pipe' });
    if (staged) issues.push(...scanStaged(root));
  } catch { issues.push('Git check failed; run git diff --check (or --cached) and inspect the index.'); }
  return issues;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const issues = checkRepository(root, { staged: process.argv.includes('--staged') });
  if (issues.length) { for (const issue of issues) console.error(issue); process.exitCode = 1; }
  else console.log('Repository tooling checks passed. Application/runtime activation is not checked.');
}
