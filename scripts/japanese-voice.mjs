import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = fileURLToPath(new URL('../data/japanese-voice/venv/Scripts/python.exe', import.meta.url));
if (process.platform !== 'win32' || !existsSync(python)) {
  console.error('Run npm run setup:japanese-voice on Windows x64 first, or start the official VOICEVOX engine on 127.0.0.1:50021.');
  process.exitCode = 1;
} else {
  const child = spawn(python, ['-X', 'utf8', 'scripts/japanese_voice/server.py'], {
    cwd: root, stdio: 'inherit', windowsHide: true,
    env: { ...process.env, PYTHONUTF8: '1', RUST_LOG: 'off' },
  });
  child.once('error', () => { console.error('Japanese voice could not start. Run npm run setup:japanese-voice.'); process.exitCode = 1; });
  child.once('exit', code => { process.exitCode = code ?? 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { child.kill(signal); });
}
