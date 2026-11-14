import { test } from 'node:test';
import assert from 'node:assert/strict';
import { draftSaveSchema, mergeLessonCatalogue, publishRequestSchema, vocabularySchema, notebookEntrySchema } from '../src/index';
import { lessons, restaurantLesson } from '@smartlingo/content';

test('publication is explicit and draft commands refer to their base revision', () => {
  assert.ok(draftSaveSchema.safeParse({ expectedRevision: 1, lesson: restaurantLesson }).success);
  assert.equal(draftSaveSchema.safeParse({ expectedRevision: 2, lesson: restaurantLesson }).success, false);
  assert.equal(draftSaveSchema.safeParse({ expectedRevision: 1, lesson: { ...restaurantLesson, status: 'published' } }).success, false);
  assert.equal(publishRequestSchema.safeParse({ expectedRevision: 1, previewToken: '77777777-7777-4777-8777-777777777777', ownerReviewed: false }).success, false);
});

test('every valid vocabulary entry fits notebook capture limits', () => {
  const entry = { ...restaurantLesson.vocabulary[0], target: 'a'.repeat(300), meaning: 'b'.repeat(500), example: 'c'.repeat(1000) };
  assert.ok(vocabularySchema.safeParse(entry).success);
  assert.ok(notebookEntrySchema.safeParse({ ...entry, id: `notebook.${entry.id}`, sourceEntryId: entry.id, updatedAt: '2026-11-14T12:00:00Z' }).success);
  assert.equal(vocabularySchema.safeParse({ ...entry, meaning: 'b'.repeat(501) }).success, false);
  assert.equal(vocabularySchema.safeParse({ ...entry, example: 'c'.repeat(1001) }).success, false);
  assert.equal(vocabularySchema.safeParse({ ...entry, target: 'a'.repeat(301) }).success, false);
});

test('published catalogue overrides previews without allowing drafts to replace publications', () => {
  const published = { ...restaurantLesson, status: 'published' as const, revision: 3 };
  assert.deepEqual(mergeLessonCatalogue(lessons, [published]), [published, lessons[1]]);
  assert.throws(() => mergeLessonCatalogue(lessons, [restaurantLesson]), /Only published/);
});
