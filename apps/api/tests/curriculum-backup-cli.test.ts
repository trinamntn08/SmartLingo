import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFile } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { DatabaseSync } from 'node:sqlite';
import { restaurantLesson } from '@smartlingo/content';
import { parseCurriculumCommand, runCurriculumCommand } from '../src/curriculum-backup-cli';
import { contentDatabasePath, defaultContentDatabasePath, projectRoot } from '../src/database-path';
import { inspectCurriculumSnapshot } from '../src/curriculum-backup';
import { SqliteLessonRepository } from '../src/repository';
import { startServer } from '../src/server';

const execute = promisify(execFile);
const cli = fileURLToPath(new URL('../src/curriculum-backup-cli.ts', import.meta.url));

function fixture() {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-curriculum-cli-'));
  const source = join(directory, 'source.sqlite');
  const repository = new SqliteLessonRepository(source);
  repository.seed([{ ...restaurantLesson, title: 'Private fixture curriculum title' }]);
  const draft = repository.saveDraft(restaurantLesson.id, { expectedRevision: restaurantLesson.revision,
    lesson: { ...restaurantLesson, title: 'Private saved draft' } });
  repository.publishDraft(draft.id, draft.revision);
  repository.close();
  return { directory, source, cleanup: () => rmSync(directory, { recursive: true, force: true }) };
}

test('curriculum CLI help/parsing cannot overwrite implicitly or silently choose a missing recovery file', async () => {
  const lines: string[] = [];
  assert.equal(await runCurriculumCommand(['restore', '--help'], { SMARTLINGO_DATABASE_PATH: 'missing.sqlite' }, line => lines.push(line)), 0);
  assert.match(lines.join('\n'), /Existing files are never replaced/);
  assert.equal(contentDatabasePath(), defaultContentDatabasePath);
  const backup = parseCurriculumCommand(['backup'])!;
  assert.equal(backup.source, defaultContentDatabasePath);
  assert.ok(backup.destination.startsWith(resolve(projectRoot, 'data/backups')));
  assert.match(backup.destination, /\.sqlite$/);
  for (const args of [['restore'], ['restore', '--source', 'backup.sqlite'], ['backup', '--force'],
    ['backup', '--source'], ['backup', '--source', 'a.sqlite', '--source', 'b.sqlite'], ['unknown']]) {
    assert.throws(() => parseCurriculumCommand(args));
  }
  for (const path of ['', 'missing.sqlite', ':memory:', 'wrong.txt', '\0.sqlite']) assert.throws(() => contentDatabasePath(path));
  const invalid: string[] = [];
  assert.equal(await runCurriculumCommand(['restore'], {}, line => invalid.push(line)), 2);
  assert.match(invalid[0], /Restore requires/);
});

test('real curriculum CLI creates and recovers fresh files, reporting counts without lesson payloads', async () => {
  const { directory, source, cleanup } = fixture();
  try {
    const backup = join(directory, 'backup with spaces.sqlite');
    const recovered = join(directory, 'recovered.sqlite');
    const before = readFileSync(source);
    const first = await execute(process.execPath, ['--import', 'tsx', cli, 'backup', '--source', source, '--destination', backup], { cwd: projectRoot });
    assert.match(first.stdout, /Lessons: 1; stored revisions: 3; published revisions: 1/);
    assert.doesNotMatch(first.stdout + first.stderr, /Private fixture|Private saved/);
    const second = await execute(process.execPath, ['--import', 'tsx', cli, 'restore', '--source', backup, '--destination', recovered], { cwd: projectRoot });
    assert.match(second.stdout, /Curriculum recovered to a new file/);
    assert.deepEqual(inspectCurriculumSnapshot(recovered), inspectCurriculumSnapshot(source));
    assert.deepEqual(readFileSync(source), before);
    const recoveredBefore = readFileSync(recovered);
    const messages: string[] = [];
    assert.equal(await runCurriculumCommand(['restore', '--source', backup, '--destination', recovered], {}, line => messages.push(line)), 1);
    assert.deepEqual(readFileSync(recovered), recoveredBefore);
    assert.deepEqual(readdirSync(directory).sort(), ['backup with spaces.sqlite', 'recovered.sqlite', 'source.sqlite']);
  } finally { cleanup(); }
});

test('an explicit recovered database starts the API without changing the backup or default database', async () => {
  const { directory, source, cleanup } = fixture();
  try {
    const recovered = join(directory, 'recovered.sqlite');
    const output: string[] = [];
    assert.equal(await runCurriculumCommand(['restore', '--source', source, '--destination', recovered], {}, line => output.push(line)), 0);
    const before = readFileSync(source);
    const reservation = createServer();
    await new Promise<void>(resolve => reservation.listen(0, '127.0.0.1', resolve));
    const address = reservation.address();
    assert.ok(address && typeof address !== 'string');
    const port = address.port;
    await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
    const app = await startServer({ PORT: String(port), SMARTLINGO_DATABASE_PATH: recovered });
    try {
      assert.equal((await app.inject('/health')).statusCode, 200);
      assert.equal((await app.inject(`/lessons/${restaurantLesson.id}`)).json().lesson.title, 'Private saved draft');
      assert.equal((await app.inject('/published-lessons')).json().lessons.length, 1);
      assert.deepEqual(readFileSync(source), before);
    } finally { await app.close(); }
    assert.equal(contentDatabasePath(recovered), recovered);
  } finally { cleanup(); }
});

test('configured missing or foreign databases fail before server migration/seeding', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-curriculum-config-'));
  try {
    const missing = join(directory, 'missing.sqlite');
    await assert.rejects(startServer({ PORT: '3003', SMARTLINGO_DATABASE_PATH: missing }));
    assert.deepEqual(readdirSync(directory), []);
    const foreign = join(directory, 'foreign.sqlite');
    const database = new DatabaseSync(foreign);
    database.exec('CREATE TABLE unrelated (value TEXT)'); database.close();
    const before = readFileSync(foreign);
    await assert.rejects(startServer({ PORT: '3003', SMARTLINGO_DATABASE_PATH: foreign }));
    assert.deepEqual(readFileSync(foreign), before);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
