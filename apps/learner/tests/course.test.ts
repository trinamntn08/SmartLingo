import { test } from 'node:test';
import assert from 'node:assert/strict';
import { courseLearningModel } from '../src/ui/course';
import type { LearningModel } from '../src/ui/useLearning';

test('course views isolate Japanese progress and notes while preserving legacy French entries and writes', () => {
  const record = () => {};
  const model = { events: [{ lessonId: 'fr.greetings.hello' }, { lessonId: 'ja.greetings.hello' }],
    notebook: [{ sourceEntryId: 'fr.hello' }, { sourceEntryId: 'personal.legacy' }, { sourceEntryId: 'ja.hello' }, { sourceEntryId: 'personal.ja.new' }], record } as unknown as LearningModel;
  const french = courseLearningModel(model, 'French');
  const japanese = courseLearningModel(model, 'Japanese');
  assert.deepEqual(french.events.map(event => event.lessonId), ['fr.greetings.hello']);
  assert.deepEqual(japanese.events.map(event => event.lessonId), ['ja.greetings.hello']);
  assert.deepEqual(french.notebook.map(entry => entry.sourceEntryId), ['fr.hello', 'personal.legacy']);
  assert.deepEqual(japanese.notebook.map(entry => entry.sourceEntryId), ['ja.hello', 'personal.ja.new']);
  assert.equal(japanese.record, record);
  assert.equal(model.notebook.length, 4);
});
