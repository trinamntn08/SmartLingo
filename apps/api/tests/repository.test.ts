import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { lessons, restaurantLesson, previousSeedFingerprints } from '@smartlingo/content';
import { lessonSchema } from '@smartlingo/domain';
import { migrateContentDatabase } from '../src/migrations';
import { InvalidStoredLessonError, SqliteLessonRepository } from '../src/repository';

test('migration initializes the schema once and preserves existing rows', () => {
  const database = new DatabaseSync(':memory:');
  try {
    migrateContentDatabase(database);
    database.prepare('INSERT INTO lesson_revisions VALUES (?, ?, ?)').run('test.lesson', 1, '{}');
    migrateContentDatabase(database);
    assert.equal(database.prepare('PRAGMA user_version').get()?.user_version, 1);
    assert.equal(database.prepare('SELECT COUNT(*) AS count FROM lesson_revisions').get()?.count, 1);
  } finally { database.close(); }
});

test('migration refuses a future schema without changing its version', () => {
  const database = new DatabaseSync(':memory:');
  try {
    database.exec('PRAGMA user_version = 2');
    assert.throws(() => migrateContentDatabase(database), /Unsupported/);
    assert.equal(database.prepare('PRAGMA user_version').get()?.user_version, 2);
    assert.equal(database.isTransaction, false);
  } finally { database.close(); }
});

test('draft seed is idempotent and preserves local revisions and same-revision edits', () => {
  const repository = new SqliteLessonRepository(':memory:');
  try {
    const edited = { ...restaurantLesson, title: 'My local preview' };
    repository.saveLesson(edited);
    repository.seed(lessons);
    repository.seed(lessons);
    assert.equal(repository.listLessons().length, lessons.length);
    assert.equal(repository.getLesson(edited.id)?.title, edited.title);
    const next = { ...edited, revision: restaurantLesson.revision + 2, title: 'My later revision' };
    repository.saveLesson(next);
    repository.seed([{ ...restaurantLesson, revision: restaurantLesson.revision + 3 }]);
    assert.deepEqual(repository.getLesson(edited.id), next);
  } finally { repository.close(); }
});

test('invalid writes and revision conflicts leave valid content unchanged', () => {
  const repository = new SqliteLessonRepository(':memory:');
  try {
    repository.seed(lessons);
    assert.throws(() => repository.saveLesson({ ...restaurantLesson, vocabulary: [] }));
    assert.throws(() => repository.saveLesson({ ...restaurantLesson, title: 'Overwrite' }), /revision/);
    repository.saveLesson(restaurantLesson); // An identical retry is harmless.
    repository.saveLesson({ ...restaurantLesson, revision: restaurantLesson.revision + 1 });
    assert.throws(() => repository.saveLesson(restaurantLesson), /revision/);
    assert.equal(repository.getLesson(restaurantLesson.id)?.revision, restaurantLesson.revision + 1);
    assert.throws(() => repository.seed([{ ...restaurantLesson, status: 'published' }]), /drafts/);
  } finally { repository.close(); }
});

test('seeding validates the entire batch before writing', () => {
  const repository = new SqliteLessonRepository(':memory:');
  try {
    assert.throws(() => repository.seed([restaurantLesson, { id: 'broken' }]));
    assert.deepEqual(repository.listLessons(), []);
  } finally { repository.close(); }
});

test('reopening SQLite preserves revisions; malformed stored content fails explicitly', () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-api-'));
  const path = join(directory, 'content.sqlite');
  let repository = new SqliteLessonRepository(path);
  try {
    repository.seed(lessons);
    const revised = { ...restaurantLesson, revision: restaurantLesson.revision + 1, title: 'Persisted local title' };
    repository.saveLesson(revised);
    repository.close();
    repository = new SqliteLessonRepository(path);
    assert.deepEqual(repository.getLesson(revised.id), revised);
    repository.close();
    const database = new DatabaseSync(path);
    try {
      assert.equal(database.prepare('SELECT COUNT(*) AS count FROM lesson_revisions WHERE id = ?')
        .get(revised.id)?.count, 2);
      database.prepare('UPDATE lesson_revisions SET payload = ? WHERE id = ? AND revision = ?')
        .run('{broken JSON', revised.id, revised.revision);
    } finally { database.close(); }
    repository = new SqliteLessonRepository(path);
    assert.throws(() => repository.getLesson(revised.id), InvalidStoredLessonError);
    assert.throws(() => repository.listLessons(), InvalidStoredLessonError);
    assert.throws(() => repository.listPublishedLessons(), InvalidStoredLessonError);
    assert.throws(() => repository.seed(lessons), InvalidStoredLessonError);
  } finally {
    repository.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('stored content must match its database ID and revision', () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-api-'));
  const path = join(directory, 'content.sqlite');
  const repository = new SqliteLessonRepository(path);
  try {
    const database = new DatabaseSync(path);
    try {
      database.prepare('INSERT INTO lesson_revisions VALUES (?, ?, ?)')
        .run(restaurantLesson.id, restaurantLesson.revision + 1, JSON.stringify(restaurantLesson));
    } finally { database.close(); }
    assert.throws(() => repository.getLesson(restaurantLesson.id), InvalidStoredLessonError);
  } finally {
    repository.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

function seedRefreshFixture() {
  const original = lessonSchema.parse({ ...restaurantLesson, revision: 1, title: 'Original bundled draft' });
  const updated = lessonSchema.parse({ ...original, revision: 2, title: 'Updated bundled draft' });
  const baselines = {
    [original.id]: { revision: 1, sha256: createHash('sha256').update(JSON.stringify(original)).digest('hex') },
  };
  return { original, updated, baselines };
}

test('trusted seed refresh appends once and retains the exact original revision on disk', () => {
  const { original, updated, baselines } = seedRefreshFixture();
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-seed-'));
  const path = join(directory, 'content.sqlite');
  const repository = new SqliteLessonRepository(path);
  try {
    repository.seed([original]);
    repository.seed([updated], baselines);
    repository.seed([updated], baselines);
    assert.deepEqual(repository.getLesson(original.id), updated);
    assert.deepEqual(repository.listPublishedLessons(), []);
    const database = new DatabaseSync(path);
    try {
      const rows = database.prepare('SELECT revision, payload FROM lesson_revisions WHERE id = ? ORDER BY revision').all(original.id);
      assert.deepEqual(rows.map(row => row.revision), [1, 2]);
      assert.deepEqual(JSON.parse(rows[0].payload as string), original);
      assert.deepEqual(JSON.parse(rows[1].payload as string), updated);
    } finally { database.close(); }
  } finally {
    repository.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('trusted refresh preserves edited heads, newer drafts, publications and untrusted baselines', () => {
  const { original, updated, baselines } = seedRefreshFixture();
  const published = lessonSchema.parse({ ...original, status: 'published' });
  const cases = [
    { name: 'same-revision owner edit', head: { ...original, title: 'Owner edit' }, incoming: updated, baselines },
    { name: 'newer owner draft', head: { ...original, revision: 3 }, incoming: updated, baselines },
    { name: 'same-revision different draft', head: { ...updated, title: 'Owner revision two' }, incoming: updated, baselines },
    { name: 'published head even with a matching fingerprint', head: published, incoming: updated, baselines: {
      [published.id]: { revision: 1, sha256: createHash('sha256').update(JSON.stringify(published)).digest('hex') },
    } },
    { name: 'newer publication', head: { ...published, revision: 3 }, incoming: updated, baselines },
    { name: 'unknown baseline', head: original, incoming: updated, baselines: {} },
    { name: 'no explicit baseline', head: original, incoming: updated, baselines: undefined },
    { name: 'inherited baseline', head: original, incoming: updated, baselines: Object.create(baselines) as typeof baselines },
    { name: 'wrong baseline revision', head: original, incoming: updated, baselines: { [original.id]: { ...baselines[original.id], revision: 2 } } },
    { name: 'wrong fingerprint', head: original, incoming: updated, baselines: { [original.id]: { revision: 1, sha256: '0'.repeat(64) } } },
    { name: 'nonconsecutive incoming revision', head: original, incoming: { ...updated, revision: 3 }, baselines },
  ];
  for (const scenario of cases) {
    const repository = new SqliteLessonRepository(':memory:');
    try {
      repository.saveLesson(scenario.head);
      repository.seed([scenario.incoming], scenario.baselines);
      assert.deepEqual(repository.getLesson(original.id), lessonSchema.parse(scenario.head), scenario.name);
    } finally { repository.close(); }
  }
});

test('trusted refresh seeds new databases and validates every incoming draft before appending', () => {
  const { original, updated, baselines } = seedRefreshFixture();
  const repository = new SqliteLessonRepository(':memory:');
  try {
    repository.seed([updated], baselines);
    assert.deepEqual(repository.getLesson(updated.id), updated);
  } finally { repository.close(); }
  const existing = new SqliteLessonRepository(':memory:');
  try {
    existing.seed([original]);
    assert.throws(() => existing.seed([updated, { id: 'broken' }], baselines));
    assert.deepEqual(existing.getLesson(original.id), original);
    assert.throws(() => existing.seed([updated, { ...updated, id: 'fr.published', status: 'published' }], baselines), /drafts/);
    assert.deepEqual(existing.getLesson(original.id), original);
    assert.equal(existing.getLesson('fr.published'), undefined);
  } finally { existing.close(); }
});

test('explicit historical destinations refresh an untouched older draft without publishing or replacing edits', () => {
  const { original, baselines } = seedRefreshFixture();
  const revisionTwo = lessonSchema.parse({ ...original, revision: 2, title: 'Second bundled draft' });
  const updated = lessonSchema.parse({ ...original, revision: 3, title: 'Reviewed rework draft' });
  const history = { [original.id]: [
    { ...baselines[original.id], nextRevision: 3 },
    { revision: 2, sha256: createHash('sha256').update(JSON.stringify(revisionTwo)).digest('hex') },
  ] };
  for (const head of [original, revisionTwo, { ...original, title: 'Owner edit' },
    { ...revisionTwo, title: 'Owner edit' }, { ...original, status: 'published' as const },
    { ...revisionTwo, revision: 4 }]) {
    const directory = mkdtempSync(join(tmpdir(), 'smartlingo-rework-'));
    const path = join(directory, 'content.sqlite');
    const repository = new SqliteLessonRepository(path);
    try {
      repository.saveLesson(head);
      repository.seed([updated], history);
      repository.seed([updated], history);
      const untouched = head === original || head === revisionTwo;
      assert.deepEqual(repository.getLesson(head.id), untouched ? updated : lessonSchema.parse(head));
      assert.equal(repository.listPublishedLessons().length, head.status === 'published' ? 1 : 0);
      // Every recorded historical payload remains readable and unchanged.
      const database = new DatabaseSync(path);
      try {
        const row = database.prepare('SELECT payload FROM lesson_revisions WHERE id = ? AND revision = ?').get(head.id, head.revision)!;
        assert.deepEqual(JSON.parse(row.payload as string), lessonSchema.parse(head));
      } finally { database.close(); }
    } finally {
      repository.close();
      rmSync(directory, { recursive: true, force: true });
    }
  }
});

test('bundled refresh destinations have exact revision-1/2 fingerprints and target existing revision-3 drafts', () => {
  assert.equal(Object.keys(previousSeedFingerprints).length, 60);
  for (const [id, baselines] of Object.entries(previousSeedFingerprints)) {
    assert.equal(lessons.find(lesson => lesson.id === id)?.revision, 3, id);
    assert.deepEqual(baselines.map(baseline => baseline.revision), [1, 2]);
    for (const baseline of baselines) assert.match(baseline.sha256, /^[a-f0-9]{64}$/);
  }
});

test('corrupted stored heads fail safely and roll back earlier seed appends in the batch', () => {
  const { original, updated, baselines } = seedRefreshFixture();
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-seed-'));
  const path = join(directory, 'content.sqlite');
  const repository = new SqliteLessonRepository(path);
  try {
    repository.seed([original]);
    const database = new DatabaseSync(path);
    try {
      database.prepare('INSERT INTO lesson_revisions VALUES (?, ?, ?)').run('fr.corrupt', 1, '{broken');
    } finally { database.close(); }
    assert.throws(() => repository.seed([updated, { ...updated, id: 'fr.corrupt' }], baselines), InvalidStoredLessonError);
    assert.deepEqual(repository.getLesson(original.id), original);
  } finally {
    repository.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
