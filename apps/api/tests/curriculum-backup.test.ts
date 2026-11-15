import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { test, type TestContext } from 'node:test';
import { restaurantLesson } from '@smartlingo/content';
import type { Lesson } from '@smartlingo/domain';
import { createCurriculumSnapshot, inspectCurriculumSnapshot } from '../src/curriculum-backup';
import { migrateContentDatabase } from '../src/migrations';
import { SqliteLessonRepository } from '../src/repository';

function directory(context: TestContext): string {
  const path = mkdtempSync(join(tmpdir(), 'smartlingo-curriculum-backup-'));
  context.after(() => {
    assert.equal(dirname(path), resolve(tmpdir()));
    rmSync(path, { recursive: true, force: true });
  });
  return path;
}

function insert(database: DatabaseSync, revision: number, changes: Partial<Lesson> = {}): void {
  const lesson = { ...restaurantLesson, revision, ...changes };
  database.prepare('INSERT INTO lesson_revisions VALUES (?, ?, ?)').run(lesson.id, lesson.revision, JSON.stringify(lesson));
}

function fixture(path: string): void {
  const database = new DatabaseSync(path);
  try {
    migrateContentDatabase(database);
    insert(database, 1, { title: 'Original immutable draft' });
    insert(database, 2, { status: 'published', title: 'Owner published title' });
    insert(database, 3, { title: 'Unpublished newer draft' });
    insert(database, 1, { id: 'fr.second.lesson', title: 'Another lesson' });
  } finally { database.close(); }
}

function rows(path: string) {
  const database = new DatabaseSync(path, { readOnly: true });
  try { return database.prepare('SELECT id, revision, payload FROM lesson_revisions ORDER BY id, revision').all(); }
  finally { database.close(); }
}

function hash(path: string): string { return createHash('sha256').update(readFileSync(path)).digest('hex'); }
function assertNoStages(path: string): void {
  assert.deepEqual(readdirSync(path).filter(name => name.startsWith('.smartlingo-snapshot-')), []);
}

test('snapshot preserves all immutable rows/publications and recovers to an independent new file', async context => {
  const root = directory(context);
  const source = join(root, 'source.sqlite');
  const snapshot = join(root, 'backups', 'first.sqlite');
  const recovery = join(root, 'recovered.sqlite');
  fixture(source);
  const originalBytes = hash(source);
  const originalRows = rows(source);
  const expected = { schemaVersion: 1, lessonCount: 2, revisionCount: 4, publishedRevisionCount: 1 };
  assert.deepEqual(inspectCurriculumSnapshot(source), expected);
  assert.deepEqual(await createCurriculumSnapshot(source, snapshot), { ...expected, path: snapshot });
  assert.equal(hash(source), originalBytes);
  assert.deepEqual(rows(snapshot), originalRows);
  assertNoStages(dirname(snapshot));
  const sourceWriter = new DatabaseSync(source);
  try { insert(sourceWriter, 4, { title: 'A later source-only change' }); }
  finally { sourceWriter.close(); }
  assert.deepEqual(rows(snapshot), originalRows);
  assert.deepEqual(await createCurriculumSnapshot(snapshot, recovery), { ...expected, path: recovery });
  const restored = new SqliteLessonRepository(recovery);
  try {
    assert.equal(restored.getLesson(restaurantLesson.id)?.title, 'Unpublished newer draft');
    assert.equal(restored.listPublishedLessons().find(lesson => lesson.id === restaurantLesson.id)?.title, 'Owner published title');
    restored.saveLesson({ ...restaurantLesson, revision: 4, title: 'Recovery-only revision' });
  } finally { restored.close(); }
  assert.equal(rows(snapshot).length, 4);
  assertNoStages(root);
});

test('online backup includes committed WAL data without checkpointing or changing source bytes', async context => {
  const root = directory(context);
  const source = join(root, 'wal.sqlite');
  const target = join(root, 'backup.sqlite');
  const writer = new DatabaseSync(source);
  try {
    writer.exec('PRAGMA journal_mode = WAL; PRAGMA wal_autocheckpoint = 0');
    migrateContentDatabase(writer);
    insert(writer, 1);
    insert(writer, 2, { status: 'published' });
    assert.ok(statSync(`${source}-wal`).size > 0);
    const before = { main: hash(source), wal: hash(`${source}-wal`) };
    const report = await createCurriculumSnapshot(source, target);
    assert.equal(report.revisionCount, 2);
    assert.equal(report.publishedRevisionCount, 1);
    assert.deepEqual(rows(target), rows(source));
    assert.equal(hash(source), before.main);
    assert.equal(hash(`${source}-wal`), before.wal);
  } finally { writer.close(); }
  assert.deepEqual(inspectCurriculumSnapshot(target), { schemaVersion: 1, lessonCount: 1, revisionCount: 2, publishedRevisionCount: 1 });
  assertNoStages(root);
});

test('existing destinations, hardlink aliases and same/case-alias paths are never overwritten', async context => {
  const root = directory(context);
  const source = join(root, 'source.sqlite');
  fixture(source);
  const original = hash(source);
  const occupied = join(root, 'occupied.sqlite');
  writeFileSync(occupied, 'unrelated target data');
  await assert.rejects(createCurriculumSnapshot(source, occupied), /already exists/);
  assert.equal(readFileSync(occupied, 'utf8'), 'unrelated target data');
  await assert.rejects(createCurriculumSnapshot(source, source), /different files/);
  const alias = join(root, 'alias.sqlite');
  linkSync(source, alias);
  await assert.rejects(createCurriculumSnapshot(source, alias), /already exists/);
  if (process.platform === 'win32') await assert.rejects(createCurriculumSnapshot(source, source.toUpperCase()), /different files|already exists/);
  assert.equal(hash(source), original);
  assertNoStages(root);
});

test('concurrent snapshots publish exactly one complete file with exclusive no-overwrite semantics', async context => {
  const root = directory(context);
  const source = join(root, 'source.sqlite');
  const target = join(root, 'raced.sqlite');
  fixture(source);
  const results = await Promise.allSettled([createCurriculumSnapshot(source, target), createCurriculumSnapshot(source, target)]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(results.filter(result => result.status === 'rejected').length, 1);
  assert.deepEqual(rows(target), rows(source));
  assertNoStages(root);
});

test('validation rejects corrupt historical rows even when the latest revision is valid, without leaking payloads', async context => {
  const root = directory(context);
  for (const kind of ['json', 'content', 'id', 'revision', 'oversize']) {
    const source = join(root, `${kind}.sqlite`);
    const target = join(root, `${kind}-backup.sqlite`);
    fixture(source);
    const database = new DatabaseSync(source);
    try {
      let payload = JSON.stringify({ ...restaurantLesson, revision: 1, title: 'private-content-marker' });
      if (kind === 'json') payload = '{private-content-marker';
      if (kind === 'content') payload = JSON.stringify({ title: 'private-content-marker' });
      if (kind === 'id') payload = JSON.stringify({ ...restaurantLesson, revision: 1, id: 'fr.wrong-id', title: 'private-content-marker' });
      if (kind === 'revision') payload = JSON.stringify({ ...restaurantLesson, revision: 99, title: 'private-content-marker' });
      if (kind === 'oversize') payload = JSON.stringify({ ...restaurantLesson, revision: 1, extra: 'x'.repeat(8 * 1024 * 1024) });
      database.prepare('UPDATE lesson_revisions SET payload = ? WHERE id = ? AND revision = 1').run(payload, restaurantLesson.id);
    } finally { database.close(); }
    const before = hash(source);
    assert.throws(() => inspectCurriculumSnapshot(source), error => error instanceof Error && /invalid|oversized|unsupported/.test(error.message) && !error.message.includes('private-content-marker'));
    await assert.rejects(createCurriculumSnapshot(source, target), /invalid|oversized|unsupported/);
    assert.equal(existsSync(target), false);
    assert.equal(hash(source), before);
    assertNoStages(root);
  }
});

test('unsupported version/schema/foreign objects are rejected without source changes or target creation', async context => {
  const root = directory(context);
  const alterations = [
    'PRAGMA user_version = 0',
    'PRAGMA user_version = 2',
    'CREATE TABLE private_data (secret TEXT)',
    'CREATE VIEW lesson_view AS SELECT * FROM lesson_revisions',
    'CREATE TRIGGER lesson_trigger AFTER INSERT ON lesson_revisions BEGIN SELECT 1; END',
    'CREATE INDEX unexpected_index ON lesson_revisions (revision)',
    'ALTER TABLE lesson_revisions ADD COLUMN unexpected TEXT',
  ];
  for (const [index, alteration] of alterations.entries()) {
    const source = join(root, `schema-${index}.sqlite`);
    const target = join(root, `schema-${index}-backup.sqlite`);
    fixture(source);
    const database = new DatabaseSync(source);
    try { database.exec(alteration); }
    finally { database.close(); }
    const before = hash(source);
    await assert.rejects(createCurriculumSnapshot(source, target), /Unsupported/);
    assert.equal(hash(source), before);
    assert.equal(existsSync(target), false);
    assertNoStages(root);
  }
});

test('lookalike table schema without strict/positive revision constraints is unsupported', async context => {
  const root = directory(context);
  const source = join(root, 'lookalike.sqlite');
  const database = new DatabaseSync(source);
  try {
    database.exec(`CREATE TABLE lesson_revisions (id TEXT NOT NULL, revision INTEGER NOT NULL,
      payload TEXT NOT NULL, PRIMARY KEY (id, revision)); PRAGMA user_version = 1`);
    insert(database, 1);
  } finally { database.close(); }
  assert.throws(() => inspectCurriculumSnapshot(source), /Unsupported/);
  await assert.rejects(createCurriculumSnapshot(source, join(root, 'backup.sqlite')), /Unsupported/);
  assertNoStages(root);
});

test('full integrity validation rejects damaged primary-key indexes that quick_check accepts', async context => {
  const root = directory(context);
  const source = join(root, 'damaged-index.sqlite');
  const target = join(root, 'must-not-publish.sqlite');
  const database = new DatabaseSync(source);
  let indexPage = 0;
  let pageSize = 0;
  try {
    migrateContentDatabase(database);
    for (const suffix of ['aa', 'bb', 'cc']) insert(database, 2, { id: `fr.fixture.${suffix}` });
    indexPage = database.prepare("SELECT rootpage FROM sqlite_schema WHERE type = 'index'").get()!.rootpage as number;
    pageSize = database.prepare('PRAGMA page_size').get()!.page_size as number;
  } finally { database.close(); }

  // Replace bb's leaf-index entry with cc's equally sized entry, leaving table rows intact.
  const bytes = readFileSync(source);
  const pageOffset = (indexPage - 1) * pageSize;
  assert.equal(bytes[pageOffset], 0x0a, 'fixture has one leaf index page');
  assert.equal(bytes.readUInt16BE(pageOffset + 3), 3);
  const second = pageOffset + bytes.readUInt16BE(pageOffset + 10);
  const third = pageOffset + bytes.readUInt16BE(pageOffset + 12);
  assert.ok(bytes[third]! < 128, 'fixture uses a single-byte payload-length varint');
  assert.equal(bytes[second], bytes[third], 'replacement index cell has the same size');
  const cellLength = bytes[third]! + 1;
  bytes.copy(bytes, second, third, third + cellLength);
  writeFileSync(source, bytes);

  const damaged = new DatabaseSync(source, { readOnly: true });
  try {
    assert.equal(damaged.prepare('PRAGMA quick_check(1)').get()?.quick_check, 'ok');
    assert.notEqual(damaged.prepare('PRAGMA integrity_check(1)').get()?.integrity_check, 'ok');
  } finally { damaged.close(); }
  const before = hash(source);
  assert.throws(() => inspectCurriculumSnapshot(source), /failed its integrity check/);
  await assert.rejects(createCurriculumSnapshot(source, target), /failed its integrity check/);
  assert.equal(hash(source), before);
  assert.equal(existsSync(target), false);
  assertNoStages(root);
});

test('missing/corrupt source and invalid target paths fail without creating a database or damaging foreign files', async context => {
  const root = directory(context);
  const missing = join(root, 'missing.sqlite');
  const target = join(root, 'backup.sqlite');
  await assert.rejects(createCurriculumSnapshot(missing, target));
  assert.equal(existsSync(missing), false);
  assert.equal(existsSync(target), false);
  const corrupt = join(root, 'corrupt.sqlite');
  writeFileSync(corrupt, 'This is not SQLite private-content-marker');
  await assert.rejects(createCurriculumSnapshot(corrupt, target), error => error instanceof Error && !error.message.includes('private-content-marker'));
  assert.equal(readFileSync(corrupt, 'utf8'), 'This is not SQLite private-content-marker');
  const source = join(root, 'valid.sqlite');
  fixture(source);
  await assert.rejects(createCurriculumSnapshot(source, join(root, 'wrong.txt')), /new .sqlite/);
  const blocked = join(root, 'blocked');
  writeFileSync(blocked, 'keep');
  await assert.rejects(createCurriculumSnapshot(source, join(blocked, 'backup.sqlite')));
  assert.equal(readFileSync(blocked, 'utf8'), 'keep');
  const occupiedDirectory = join(root, 'occupied.sqlite');
  mkdirSync(occupiedDirectory);
  await assert.rejects(createCurriculumSnapshot(source, occupiedDirectory), /already exists/);
  assertNoStages(root);
});

test('native backup deadline cancels safely and removes only its owned staging artifacts', async context => {
  const root = directory(context);
  const source = join(root, 'large.sqlite');
  const target = join(root, 'backup.sqlite');
  const database = new DatabaseSync(source);
  try {
    migrateContentDatabase(database);
    database.exec('BEGIN');
    for (let revision = 1; revision <= 200; revision++) insert(database, revision);
    database.exec('COMMIT');
  } finally { database.close(); }
  const unrelated = join(root, '.smartlingo-snapshot-unrelated');
  mkdirSync(unrelated);
  writeFileSync(join(unrelated, 'owner-file'), 'retain');
  const before = hash(source);
  const moduleUrl = pathToFileURL(resolve('apps/api/src/curriculum-backup.ts')).href;
  const script = `
    import { createCurriculumSnapshot } from ${JSON.stringify(moduleUrl)};
    let calls = 0;
    Date.now = () => calls++ === 0 ? 0 : 30001;
    try {
      await createCurriculumSnapshot(process.argv[1], process.argv[2]);
      process.exitCode = 2;
    } catch (error) {
      if (!/timed out/.test(error.message)) throw error;
      process.stdout.write('timeout settled');
    }
  `;
  const child = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', script, source, target], {
    encoding: 'utf8', timeout: 10_000,
  });
  assert.equal(child.error, undefined);
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout, 'timeout settled');
  assert.equal(hash(source), before);
  assert.equal(existsSync(target), false);
  assert.equal(readFileSync(join(unrelated, 'owner-file'), 'utf8'), 'retain');
  assert.deepEqual(readdirSync(root).filter(name => name.startsWith('.smartlingo-snapshot-')), ['.smartlingo-snapshot-unrelated']);
});
