import { execFileSync } from 'node:child_process';
export function protectedPath(name) {
  const p = name.replaceAll('\\', '/');
  const base = p.split('/').at(-1);
  if (/^\.env(?:\.|$)/i.test(base) && !/\.example$/i.test(base)) return true;
  return /(?:^|\/)(?:recordings|transcripts|exports|storage|data)\//i.test(p)
    || /\.(?:pem|key|p12|pfx|sqlite(?:-.*)?|db(?:-.*)?)$/i.test(base);
}
export function containsCredential(text) {
  return /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/.test(text)
    || /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}\b/.test(text)
    || /\bAKIA[A-Z0-9]{16}\b/.test(text)
    || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text);
}
export function scanStaged(root) {
  const git = args => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
  const names = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']).toString('utf8').split('\0').filter(Boolean);
  const issues = [];
  for (const name of names) {
    if (protectedPath(name)) { issues.push('Protected local-data/secret path staged: ' + name); continue; }
    // Check index bytes, including binary/large files, not a changed worktree copy.
    const bytes = git(['show', ':' + name]);
    if (containsCredential(bytes.toString('utf8'))) issues.push('Possible credential in staged file: ' + name);
  }
  return issues;
}
