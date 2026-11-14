// Lifecycle hooks are advisory: no edits, credentials, transcripts, or network.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '..');
const mode = process.argv[2] || process.argv[1];
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
  if (input.length > 1024 * 1024) { process.stdout.write('{}'); process.exit(0); }
});
process.stdin.on('end', () => {
  let event;
  try { event = input.trim() ? JSON.parse(input) : {}; }
  catch { process.stdout.write(JSON.stringify({ systemMessage: 'Project hook received invalid event JSON; run npm run check manually.' })); return; }
  if (mode === 'session-start') {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: 'SmartLingo: read AGENTS.md, docs/STATUS.md, docs/SESSION_CHECKPOINT.md, and docs/SESSION_WORKFLOW.md; consult PROJECT_PLAN.md for requirements. Check usage if available; checkpoint progress and apply task-based model routing. French A1-A2, English explanations, web first. Run npm run check and relevant real checks. Keep API keys server-side. Delegate only independent tasks with exclusive file ownership. Tooling exists; verify app implementation status before making claims.'
    }}));
    return;
  }
  if (mode !== 'stop' || event.stop_hook_active) { process.stdout.write('{}'); return; }
  if (!fs.existsSync(path.join(root, '.git'))) { process.stdout.write('{}'); return; }
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'check-repo.mjs')], {
    cwd: root, encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'pipe']
  });
  // Never return decision:block: this hook cannot create a continuation loop.
  process.stdout.write(JSON.stringify(result.status === 0 ? {} : {
    systemMessage: 'Repository setup checks need attention. Run npm run check and report unresolved failures. This advisory hook does not verify application behaviour.'
  }));
});
