import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export function installationPlan(root) {
  const plan = [];
  for (const [sourceDir, targetDir] of [['tooling/codex', '.codex'], ['tooling/agents', '.agents']]) {
    function walk(relative = '') {
      const source = path.join(root, sourceDir, relative);
      for (const ent of fs.readdirSync(source, { withFileTypes: true })) {
        if (ent.isSymbolicLink()) throw new Error('Refusing symlinked source');
        const rel = path.join(relative, ent.name);
        if (ent.isDirectory()) walk(rel);
        else {
          const from = path.join(root, sourceDir, rel);
          const to = path.join(root, targetDir, rel);
          // Refuse symlinked target ancestors instead of following links outside the project.
          let ancestor = to;
          while (ancestor !== root) {
            if (fs.existsSync(ancestor) && fs.lstatSync(ancestor).isSymbolicLink()) throw new Error('Refusing symlinked target');
            const parent = path.dirname(ancestor);
            if (parent === ancestor) throw new Error('Target escaped project root');
            ancestor = parent;
          }
          const exists = fs.existsSync(to);
          if (exists && !fs.readFileSync(from).equals(fs.readFileSync(to))) throw new Error('Existing target differs; preserve and review manually: ' + path.relative(root, to));
          plan.push({ from, to, exists });
        }
      }
    }
    walk();
  }
  return plan;
}
export function installPrepared(root) {
  const plan = installationPlan(root);
  for (const item of plan) if (!item.exists) {
    fs.mkdirSync(path.dirname(item.to), { recursive: true });
    fs.copyFileSync(item.from, item.to, fs.constants.COPYFILE_EXCL);
  }
  return plan;
}
const root = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '');
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const plan = installationPlan(root);
    if (!process.argv.includes('--apply')) {
      for (const item of plan) console.log((item.exists ? 'Already matches: ' : 'Would create: ') + path.relative(root, item.to));
      console.log('Dry run only. Run npm run setup:codex from your local terminal to install.');
    } else {
      // Entire target set is checked for conflicts before creating any file.
      installPrepared(root);
      console.log('Installed repository Codex files. Review lifecycle hooks in your Codex client before use.');
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
