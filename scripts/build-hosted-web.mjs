import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { prepareOfflineExport } from './prepare-offline-web.mjs';
import { prepareHostedExport } from './prepare-hosted-web.mjs';

const execFileAsync = promisify(execFile);

function runNpm(args) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('Run the hosted build through npm so the pinned npm CLI is available');
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [npmCli, ...args], {
      stdio: 'inherit', env: { ...process.env, EXPO_PUBLIC_SMARTLINGO_DEPLOYMENT_MODE: 'hosted' },
    });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`npm export exited with code ${code}`)));
  });
}

await runNpm(['run', 'export', '--workspace', '@smartlingo/learner']);
const manifest = await prepareOfflineExport();
const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' });
const status = await execFileAsync('git', ['status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8' });
const metadata = await prepareHostedExport(undefined, stdout.trim(), status.stdout.trim().length > 0);
console.log(`Prepared hosted learner: ${manifest.files.length} offline files, ${manifest.totalBytes} bytes, build ${metadata.offlineBuildId.slice(0, 12)}, source ${metadata.sourceCommit.slice(0, 12)}${metadata.sourceDirty ? ' (dirty worktree; not deployable)' : ''}.`);
