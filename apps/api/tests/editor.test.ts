import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { lessons, restaurantLesson } from '@smartlingo/content';
import type { Lesson } from '@smartlingo/domain';
import { createApp } from '../src/app';
import { EditorError } from '../src/editor-error';
import { PreviewReceipts } from '../src/preview-receipts';
import { SqliteLessonRepository } from '../src/repository';

const editorHeaders = {
  origin: 'http://localhost:8081', 'x-smartlingo-editor': '1', 'content-type': 'application/json',
};
const id = restaurantLesson.id;
const baseRevision = restaurantLesson.revision;

function fixture(options: { now?: () => number } = {}) {
  const repository = new SqliteLessonRepository(':memory:');
  repository.seed(lessons);
  return { repository, app: createApp(repository, options) };
}

function post(app: ReturnType<typeof createApp>, action: string, payload: unknown, lessonId = id) {
  return app.inject({ method: 'POST', url: `/editor/lessons/${lessonId}/${action}`, headers: editorHeaders, payload: JSON.stringify(payload) });
}

test('draft save, preview and reviewed publish append immutable revisions; newer drafts leave publication active', async () => {
  const { app, repository } = fixture();
  try {
    assert.deepEqual((await app.inject('/published-lessons')).json(), { lessons: [] });
    const draftResponse = await post(app, 'draft', {
      expectedRevision: baseRevision, lesson: { ...restaurantLesson, title: 'Reviewed restaurant title' },
    });
    assert.equal(draftResponse.statusCode, 200);
    const draft = draftResponse.json().lesson as Lesson;
    assert.equal(draft.revision, baseRevision + 1);
    assert.equal(draft.status, 'draft');
    const preview = await post(app, 'preview', { expectedRevision: baseRevision + 1 });
    assert.equal(preview.statusCode, 200);
    assert.deepEqual(preview.json().lesson, draft);
    const command = { expectedRevision: baseRevision + 1, previewToken: preview.json().previewToken, ownerReviewed: true };
    const publication = await post(app, 'publish', command);
    assert.equal(publication.statusCode, 200);
    const published = publication.json().lesson as Lesson;
    assert.equal(published.revision, baseRevision + 2);
    assert.equal(published.status, 'published');
    assert.equal((await post(app, 'publish', command)).statusCode, 409);
    assert.equal(repository.getLesson(id)?.revision, baseRevision + 2);
    const saved = await post(app, 'draft', {
      expectedRevision: baseRevision + 2, lesson: { ...published, status: 'draft', title: 'Unreviewed changes' },
    });
    assert.equal(saved.statusCode, 200);
    assert.equal(saved.json().lesson.revision, baseRevision + 3);
    assert.equal(repository.getLesson(id)?.status, 'draft');
    assert.deepEqual((await app.inject('/published-lessons')).json(), { lessons: [published] });
    const nextPreview = await post(app, 'preview', { expectedRevision: baseRevision + 3 });
    const nextPublish = await post(app, 'publish', {
      expectedRevision: baseRevision + 3, previewToken: nextPreview.json().previewToken, ownerReviewed: true,
    });
    assert.equal(nextPublish.statusCode, 200);
    assert.equal((await app.inject('/published-lessons')).json().lessons[0].revision, baseRevision + 4);
  } finally { await app.close(); }
});

test('two editors cannot overwrite a newer save, reuse its stale receipt, or publish unsaved content', async () => {
  const { app, repository } = fixture();
  try {
    const firstPreview = (await post(app, 'preview', { expectedRevision: baseRevision })).json();
    const firstSave = await post(app, 'draft', {
      expectedRevision: baseRevision, lesson: { ...restaurantLesson, title: 'First editor changes' },
    });
    assert.equal(firstSave.statusCode, 200);
    const secondSave = await post(app, 'draft', {
      expectedRevision: baseRevision, lesson: { ...restaurantLesson, title: 'Stale second editor changes' },
    });
    assert.equal(secondSave.statusCode, 409);
    assert.equal((await post(app, 'preview', { expectedRevision: baseRevision })).statusCode, 409);
    assert.equal((await post(app, 'publish', {
      expectedRevision: baseRevision, previewToken: firstPreview.previewToken, ownerReviewed: true,
    })).statusCode, 409);
    const currentPreview = (await post(app, 'preview', { expectedRevision: baseRevision + 1 })).json();
    for (const command of [
      { expectedRevision: baseRevision + 1, previewToken: randomUUID(), ownerReviewed: true },
      { expectedRevision: baseRevision, previewToken: currentPreview.previewToken, ownerReviewed: true },
    ]) assert.equal((await post(app, 'publish', command)).statusCode, 409);
    assert.equal((await post(app, 'publish', {
      expectedRevision: baseRevision, previewToken: currentPreview.previewToken, ownerReviewed: true,
    }, lessons[1].id)).statusCode, 409);
    for (const ownerReviewed of [false, undefined, 'true']) {
      assert.equal((await post(app, 'publish', {
        expectedRevision: baseRevision + 1, previewToken: currentPreview.previewToken, ownerReviewed,
      })).statusCode, 400);
    }
    assert.equal(repository.getLesson(id)?.title, 'First editor changes');
    assert.deepEqual(repository.listPublishedLessons(), []);
  } finally { await app.close(); }
});

test('preview receipts expire at fifteen minutes and cannot publish after expiration', async () => {
  let now = 1000;
  const { app, repository } = fixture({ now: () => now });
  try {
    const preview = (await post(app, 'preview', { expectedRevision: baseRevision })).json();
    now += 15 * 60 * 1000;
    assert.equal((await post(app, 'publish', {
      expectedRevision: baseRevision, previewToken: preview.previewToken, ownerReviewed: true,
    })).statusCode, 409);
    assert.equal(repository.getLesson(id)?.revision, baseRevision);
    const fresh = (await post(app, 'preview', { expectedRevision: baseRevision })).json();
    assert.equal((await post(app, 'publish', {
      expectedRevision: baseRevision, previewToken: fresh.previewToken, ownerReviewed: true,
    })).statusCode, 200);
    assert.equal((await post(app, 'preview', { expectedRevision: baseRevision + 1 })).statusCode, 409);
  } finally { await app.close(); }
});

test('preview receipt storage is bounded, retains other lesson receipts and clears explicitly', () => {
  let now = 0;
  const receipts = new PreviewReceipts(() => now);
  const evicted = receipts.issue(id, 1);
  for (let index = 0; index < 256; index++) receipts.issue(`lesson.${index}`, 1);
  assert.throws(() => receipts.verify(evicted, id, 1), EditorError);
  const other = receipts.issue('lesson.other', 2);
  const current = receipts.issue(id, 1);
  now = 15 * 60 * 1000 - 1;
  receipts.verify(current, id, 1);
  receipts.invalidate(id);
  assert.throws(() => receipts.verify(current, id, 1), EditorError);
  receipts.verify(other, 'lesson.other', 2);
  receipts.clear();
  assert.throws(() => receipts.verify(other, 'lesson.other', 2), EditorError);
});

test('invalid IDs, payloads, revisions and oversized input cannot save or publish', async () => {
  const { app, repository } = fixture();
  try {
    const invalid = [
      {}, { expectedRevision: 0, lesson: restaurantLesson },
      { expectedRevision: baseRevision + 1, lesson: restaurantLesson },
      { expectedRevision: baseRevision, lesson: { ...restaurantLesson, id: 'fr.wrong-id' } },
      { expectedRevision: baseRevision, lesson: { ...restaurantLesson, status: 'published' } },
      { expectedRevision: baseRevision, lesson: { ...restaurantLesson, title: 'x'.repeat(2001) } },
      { expectedRevision: baseRevision, lesson: { ...restaurantLesson, vocabulary: [] } },
    ];
    for (const body of invalid) assert.equal((await post(app, 'draft', body)).statusCode, 400);
    assert.equal((await post(app, 'draft', {
      expectedRevision: baseRevision, lesson: { ...restaurantLesson, id: 'fr.missing' },
    }, 'fr.missing')).statusCode, 404);
    assert.equal((await post(app, 'preview', { expectedRevision: baseRevision }, 'fr.missing')).statusCode, 404);
    assert.equal((await post(app, 'preview', { expectedRevision: -1 })).statusCode, 400);
    assert.equal((await post(app, 'publish', {
      expectedRevision: baseRevision, previewToken: 'not-a-token', ownerReviewed: true,
    })).statusCode, 400);
    assert.equal((await post(app, 'draft', { padding: 'x'.repeat(131_072) })).statusCode, 413);
    assert.equal((await app.inject({
      method: 'POST', url: `/editor/lessons/${id}/draft`, headers: editorHeaders, payload: '{broken JSON',
    })).statusCode, 400);
    assert.equal(repository.getLesson(id)?.revision, baseRevision);
  } finally { await app.close(); }
});

test('reopening v1 SQLite retains old revisions and published selection across competing connections', () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartlingo-editor-'));
  const path = join(directory, 'content.sqlite');
  let repository = new SqliteLessonRepository(path);
  try {
    repository.seed(lessons);
    const competing = new SqliteLessonRepository(path);
    try {
      const firstRead = competing.getLesson(id)!;
      const draft = repository.saveDraft(id, { expectedRevision: baseRevision, lesson: { ...restaurantLesson, title: 'Saved locally' } });
      assert.throws(() => competing.saveDraft(id, { expectedRevision: baseRevision, lesson: firstRead }), (error: unknown) =>
        error instanceof EditorError && error.statusCode === 409);
      const published = repository.publishDraft(id, draft.revision);
      assert.throws(() => competing.publishDraft(id, draft.revision), EditorError);
      repository.saveDraft(id, { expectedRevision: published.revision, lesson: { ...published, status: 'draft', title: 'Later draft' } });
      repository.close();
      repository = new SqliteLessonRepository(path);
      assert.equal(repository.getLesson(id)?.revision, baseRevision + 3);
      assert.deepEqual(repository.listPublishedLessons(), [published]);
      const database = new DatabaseSync(path);
      try {
        assert.equal(database.prepare('PRAGMA user_version').get()?.user_version, 1);
        const rows = database.prepare('SELECT revision, payload FROM lesson_revisions WHERE id = ? ORDER BY revision').all(id);
        assert.deepEqual(rows.map(row => row.revision), [baseRevision, baseRevision + 1, baseRevision + 2, baseRevision + 3]);
        assert.deepEqual(JSON.parse(rows[0].payload as string), restaurantLesson);
        assert.deepEqual(JSON.parse(rows[1].payload as string), draft);
        assert.deepEqual(JSON.parse(rows[2].payload as string), published);
      } finally { database.close(); }
    } finally { competing.close(); }
  } finally {
    repository.close();
    rmSync(directory, { recursive: true, force: true });
  }
});
