import {
  closeSync, fsyncSync, linkSync, lstatSync, mkdirSync, mkdtempSync, openSync,
  realpathSync, rmSync, statSync,
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { backup, DatabaseSync } from 'node:sqlite';
import { lessonSchema } from '@smartlingo/domain';
import type { CurriculumSnapshotReport, CurriculumSnapshotSummary } from './curriculum-backup-contracts';

const MAX_ROW_BYTES = 8 * 1024 * 1024;
const BACKUP_TIMEOUT_MS = 30_000;
const expectedTableSql = `CREATE TABLE lesson_revisions (
  id TEXT NOT NULL,
  revision INTEGER NOT NULL CHECK (revision > 0),
  payload TEXT NOT NULL,
  PRIMARY KEY (id, revision)
) STRICT`;

function normalizedSql(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim().replace(/;$/, '').toLowerCase();
}

function existingDatabasePath(path: string): string {
  if (typeof path !== 'string' || !path.trim() || path.includes('\0')) throw new Error('A database file path is required.');
  const absolute = realpathSync(resolve(path));
  if (!statSync(absolute).isFile()) throw new Error('The source must be an existing database file.');
  return absolute;
}

function requireFreshDestination(path: string): void {
  try { lstatSync(path); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  throw new Error('The destination already exists. Choose a new .sqlite file.');
}

function readOnlyDatabase(path: string): DatabaseSync {
  return new DatabaseSync(path, {
    readOnly: true, timeout: 2000, allowExtension: false,
    limits: { length: MAX_ROW_BYTES + 1024 },
  });
}

function validateSchema(database: DatabaseSync): void {
  if (database.prepare('PRAGMA user_version').get()?.user_version !== 1) {
    throw new Error('Unsupported curriculum database schema version.');
  }
  // Full integrity checking also verifies primary-key index correspondence and uniqueness.
  if (database.prepare('PRAGMA integrity_check(1)').get()?.integrity_check !== 'ok') {
    throw new Error('The curriculum database failed its integrity check.');
  }
  let table = false;
  let index = false;
  for (const row of database.prepare('SELECT type, name, tbl_name, sql FROM sqlite_schema').iterate()) {
    if (!table && row.type === 'table' && row.name === 'lesson_revisions' && row.tbl_name === 'lesson_revisions'
      && typeof row.sql === 'string' && normalizedSql(row.sql) === normalizedSql(expectedTableSql)) {
      table = true;
    } else if (!index && row.type === 'index' && row.name === 'sqlite_autoindex_lesson_revisions_1'
      && row.tbl_name === 'lesson_revisions' && row.sql === null) {
      index = true;
    } else {
      throw new Error('Unsupported curriculum database schema or additional stored objects.');
    }
  }
  if (!table || !index) throw new Error('Unsupported curriculum database schema.');
}

function countValidatedRevisions(database: DatabaseSync): CurriculumSnapshotSummary {
  let lessonCount = 0;
  let revisionCount = 0;
  let publishedRevisionCount = 0;
  let previousId: string | undefined;
  // Stream rows and avoid returning oversized payloads from SQLite into JavaScript.
  const rows = database.prepare(`SELECT id, revision,
    CASE WHEN length(CAST(payload AS BLOB)) <= ? THEN payload ELSE NULL END AS payload
    FROM lesson_revisions ORDER BY id, revision`).iterate(MAX_ROW_BYTES);
  for (const row of rows) {
    try {
      if (typeof row.payload !== 'string') throw new Error('Unsupported payload size');
      const lesson = lessonSchema.parse(JSON.parse(row.payload));
      if (lesson.id !== row.id || lesson.revision !== row.revision) throw new Error('Revision mismatch');
      if (lesson.id !== previousId) { lessonCount++; previousId = lesson.id; }
      revisionCount++;
      if (lesson.status === 'published') publishedRevisionCount++;
    } catch {
      // Never attach validation errors or stored lesson text to CLI/log output.
      throw new Error('Stored curriculum contains an invalid, mismatched or oversized lesson revision.');
    }
  }
  return { schemaVersion: 1, lessonCount, revisionCount, publishedRevisionCount };
}

function inspectDatabase(database: DatabaseSync): CurriculumSnapshotSummary {
  // One read transaction keeps schema/integrity/history validation on one view.
  database.exec('BEGIN');
  try {
    validateSchema(database);
    const summary = countValidatedRevisions(database);
    database.exec('COMMIT');
    return summary;
  } catch (error) {
    database.exec('ROLLBACK');
    if (error instanceof Error && /^(Unsupported curriculum|The curriculum database failed|Stored curriculum)/.test(error.message)) throw error;
    throw new Error('The curriculum database is unreadable, corrupt or unsupported.');
  }
}

export function inspectCurriculumSnapshot(path: string): CurriculumSnapshotSummary {
  const database = readOnlyDatabase(existingDatabasePath(path));
  try { return inspectDatabase(database); }
  finally { database.close(); }
}

/** Publish a fully validated, independent SQLite snapshot without replacing any file. */
export async function createCurriculumSnapshot(sourcePath: string, destinationPath: string): Promise<CurriculumSnapshotReport> {
  const source = existingDatabasePath(sourcePath);
  if (typeof destinationPath !== 'string' || !destinationPath.trim() || destinationPath.includes('\0')
    || extname(destinationPath).toLowerCase() !== '.sqlite') {
    throw new Error('The destination must be a new .sqlite file.');
  }
  const requestedDestination = resolve(destinationPath);
  const comparePath = (path: string) => process.platform === 'win32' ? path.toLowerCase() : path;
  if (comparePath(source) === comparePath(requestedDestination)) throw new Error('Source and destination must be different files.');
  requireFreshDestination(requestedDestination);
  mkdirSync(dirname(requestedDestination), { recursive: true });
  const destination = join(realpathSync(dirname(requestedDestination)), basename(requestedDestination));
  requireFreshDestination(destination);
  const database = readOnlyDatabase(source);
  let stagingDirectory: string | undefined;
  let sourceClosed = false;
  let published = false;
  try {
    inspectDatabase(database);
    // A private sibling directory owns every staging artifact, including SQLite sidecars.
    stagingDirectory = mkdtempSync(join(dirname(destination), '.smartlingo-snapshot-'));
    const staging = join(stagingDirectory, 'snapshot.sqlite');
    const deadline = Date.now() + BACKUP_TIMEOUT_MS;
    await backup(database, staging, {
      rate: 64,
      progress: () => {
        // Node24 safely finalizes/rejects the backup when its progress callback throws.
        if (Date.now() > deadline) throw new Error('The curriculum backup timed out. Retry when the source is idle.');
      },
    });
    const summary = inspectCurriculumSnapshot(staging);
    database.close();
    sourceClosed = true;
    // Windows FlushFileBuffers requires a writable handle; this is our staging copy only.
    const descriptor = openSync(staging, 'r+');
    try { fsyncSync(descriptor); }
    finally { closeSync(descriptor); }
    // link() is exclusive even when another process creates the destination after our checks.
    // Never use rename(), whose overwrite behavior differs between platforms.
    linkSync(staging, destination);
    published = true;
    return { ...summary, path: destination };
  } finally {
    try { if (!sourceClosed) database.close(); }
    finally {
      if (stagingDirectory) {
        if (dirname(stagingDirectory) !== dirname(destination) || !basename(stagingDirectory).startsWith('.smartlingo-snapshot-')) {
          throw new Error('Refusing cleanup outside the owned snapshot staging directory.');
        }
        try { rmSync(stagingDirectory, { recursive: true }); }
        catch (error) {
          // Once published, a valid new backup is success even if the OS retains its private stage.
          // Never remove the final file to compensate for a cleanup failure.
          if (!published) throw error;
        }
      }
    }
  }
}
