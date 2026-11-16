import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createCurriculumSnapshot } from './curriculum-backup';
import { contentDatabasePath, projectRoot } from './database-path';

type BackupEnvironment = { SMARTLINGO_DATABASE_PATH?: string };
type BackupCommand = { operation: 'backup' | 'restore'; source: string; destination: string };

const usage = `Curriculum snapshots (local SQLite files only):
  npm run backup:curriculum -- [--source PATH] [--destination NEW.sqlite]
  npm run restore:curriculum -- --source BACKUP.sqlite --destination NEW.sqlite

Backup defaults to the configured curriculum database and data/backups/.
Restore always requires a new destination. Existing files are never replaced.
To use a recovered file, stop the intended API, then set SMARTLINGO_DATABASE_PATH
to that file before starting it. Browser learning backups are separate.`;

export function parseCurriculumCommand(args: string[], environment: BackupEnvironment = {}): BackupCommand | null {
  if (!args.length || (args.length === 1 && ['--help', '-h'].includes(args[0])) ||
    (args.length === 2 && ['backup', 'restore'].includes(args[0]) && ['--help', '-h'].includes(args[1]))) return null;
  const operation = args[0];
  if (operation !== 'backup' && operation !== 'restore') throw new Error('Choose backup or restore. Use --help for commands.');
  const flags = new Map<string, string>();
  for (let index = 1; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!['--source', '--destination'].includes(flag) || flags.has(flag) || !value?.trim() || value.startsWith('--') || value.includes('\0')) {
      throw new Error('Use each --source/--destination once with a file path. Use --help for commands.');
    }
    flags.set(flag, value);
  }
  if (operation === 'restore' && (!flags.has('--source') || !flags.has('--destination'))) {
    throw new Error('Restore requires --source BACKUP.sqlite and --destination NEW.sqlite.');
  }
  const generatedName = `curriculum-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}.sqlite`;
  return {
    operation,
    source: flags.has('--source') ? resolve(projectRoot, flags.get('--source')!) : contentDatabasePath(environment.SMARTLINGO_DATABASE_PATH),
    destination: resolve(projectRoot, flags.get('--destination') ?? `data/backups/${generatedName}`),
  };
}

export async function runCurriculumCommand(args: string[], environment: BackupEnvironment = {},
  output: (line: string) => void = console.log): Promise<number> {
  let command: BackupCommand | null;
  try { command = parseCurriculumCommand(args, environment); }
  catch (error) { output(error instanceof Error ? error.message : 'Invalid snapshot command.'); return 2; }
  if (!command) { output(usage); return 0; }
  try {
    const result = await createCurriculumSnapshot(command.source, command.destination);
    output(`${command.operation === 'backup' ? 'Curriculum backup created' : 'Curriculum recovered to a new file'}: ${result.path}`);
    output(`Lessons: ${result.lessonCount}; stored revisions: ${result.revisionCount}; published revisions: ${result.publishedRevisionCount}.`);
    return 0;
  } catch (error) {
    // Snapshot adapter errors contain recovery guidance, never stored lesson payloads.
    output(error instanceof Error ? error.message : 'The curriculum snapshot could not be created. Existing files were kept.');
    return 1;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  process.exitCode = await runCurriculumCommand(process.argv.slice(2), { SMARTLINGO_DATABASE_PATH: process.env.SMARTLINGO_DATABASE_PATH });
}
