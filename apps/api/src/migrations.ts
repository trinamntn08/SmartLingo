import type { DatabaseSync } from 'node:sqlite';

const schemaVersion = 1;

export function migrateContentDatabase(database: DatabaseSync): void {
  database.exec('BEGIN IMMEDIATE');
  try {
    const version = database.prepare('PRAGMA user_version').get()?.user_version;
    if (typeof version !== 'number' || version < 0 || version > schemaVersion) {
      throw new Error('Unsupported content database schema version');
    }
    if (version === 0) {
      database.exec(`
        CREATE TABLE lesson_revisions (
          id TEXT NOT NULL,
          revision INTEGER NOT NULL CHECK (revision > 0),
          payload TEXT NOT NULL,
          PRIMARY KEY (id, revision)
        ) STRICT;
        PRAGMA user_version = 1;
      `);
    }
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}
