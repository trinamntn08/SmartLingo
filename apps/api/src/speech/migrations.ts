import type { DatabaseSync } from 'node:sqlite';

export function migrateSpeechDatabase(database: DatabaseSync): void {
  database.exec('BEGIN IMMEDIATE');
  try {
    const version = database.prepare('PRAGMA user_version').get()?.user_version;
    const applicationId = database.prepare('PRAGMA application_id').get()?.application_id;
    const objects = database.prepare("SELECT name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%' ORDER BY name").all().map(row => row.name);
    if (typeof version !== 'number' || version < 0 || version > 1) throw new Error('Unsupported speech database schema version');
    if ((version === 0 && (applicationId !== 0 || objects.length !== 0)) ||
        (version === 1 && (applicationId !== 1397510992 || JSON.stringify(objects) !== JSON.stringify(['speech_assets', 'speech_flight', 'speech_request_age', 'speech_requests', 'speech_usage'])))) {
      throw new Error('Database is not a SmartLingo speech cache');
    }
    if (version === 0) database.exec(`
      CREATE TABLE speech_assets (
        key TEXT PRIMARY KEY, input TEXT NOT NULL, audio BLOB NOT NULL,
        byte_length INTEGER NOT NULL CHECK(byte_length BETWEEN 10 AND 524288), sha256 TEXT NOT NULL
      ) STRICT;
      CREATE TABLE speech_requests (
        id TEXT PRIMARY KEY, key TEXT NOT NULL, state TEXT NOT NULL CHECK(state IN ('pending','succeeded','failed')),
        created_at INTEGER NOT NULL, lease_until INTEGER NOT NULL, cache_hit INTEGER NOT NULL DEFAULT 0,
        error_status INTEGER, error_message TEXT
      ) STRICT;
      CREATE INDEX speech_request_age ON speech_requests(created_at);
      CREATE TABLE speech_usage (day TEXT PRIMARY KEY, attempts INTEGER NOT NULL CHECK(attempts >= 0)) STRICT;
      CREATE TABLE speech_flight (singleton INTEGER PRIMARY KEY CHECK(singleton = 1), request_id TEXT NOT NULL, lease_until INTEGER NOT NULL) STRICT;
      PRAGMA application_id = 1397510992;
      PRAGMA user_version = 1;
    `);
    database.exec('COMMIT');
  } catch (error) { database.exec('ROLLBACK'); throw error; }
}
