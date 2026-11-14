import { execFileSync } from 'node:child_process';
function read(command, args) {
  try { return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim(); }
  catch { return 'not available'; }
}
console.log('Node:', process.version);
console.log('Git:', read('git', ['--version']));
console.log('Git hooks path:', read('git', ['config', '--local', '--get', 'core.hooksPath']));
console.log('Codex CLI:', read('codex', ['--version']));
console.log('Local Codex hook/role loading must be verified in the client; this command does not activate it.');
