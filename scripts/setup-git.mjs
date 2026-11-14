import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: root, stdio: 'ignore' });
let current = '';
try { current = execFileSync('git', ['config', '--local', '--get', 'core.hooksPath'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
if (current === '.githooks') {
  console.log('Repository-local Git hooks are already installed.');
} else {
  try {
    execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], { cwd: root, stdio: 'pipe' });
    console.log('Installed repository-local Git hooks. Global settings were not changed.');
  } catch {
    console.error('Could not update local Git configuration. Run npm run setup in a terminal with permission to write this repository.');
    process.exitCode = 1;
  }
}
