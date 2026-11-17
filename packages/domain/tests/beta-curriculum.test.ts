import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { historicalResearchLessons, lessons, previousSeedFingerprints } from '@smartlingo/content';
import { lessonSchema, normalizeAnswer } from '../src/index';

const pack = (name: string) => JSON.parse(readFileSync(new URL(`../../../docs/curriculum/${name}.json`, import.meta.url), 'utf8'));
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function canBuild(answer: string, tokens: readonly string[], prefix: string[] = []): boolean {
  const text = normalizeAnswer(prefix.join(' '));
  const expected = normalizeAnswer(answer);
  if (!tokens.length) return text === expected;
  if (text && text !== expected && !expected.startsWith(`${text} `)) return false;
  return tokens.some((token, at) => canBuild(answer, tokens.filter((_, index) => index !== at), [...prefix, token]));
}

test('beta includes all complete bridge drafts and grammar refinements while preserving the historical catalogue', () => {
  const bridges = pack('bridge-lessons').lessons;
  const refinements = pack('refined-lessons').lessons;
  const refinedIds = new Set(refinements.map((lesson: { id: string }) => lesson.id));
  const ledger = pack('vocabulary-ledger');
  assert.equal(historicalResearchLessons.length, 123);
  assert.equal(lessons.length, 129);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
  for (const prior of historicalResearchLessons) {
    const fingerprint = ledger.lessons.find((lesson: { id: string }) => lesson.id === prior.id);
    assert.ok(fingerprint, prior.id);
    assert.equal(digest(prior), fingerprint.sha256, `${prior.id}: historical full payload retained`);
    if (!refinedIds.has(prior.id)) assert.equal(lessons.find(lesson => lesson.id === prior.id), prior);
  }
  for (const candidate of [...bridges, ...refinements]) {
    const current = lessons.find(lesson => lesson.id === candidate.id)!;
    assert.deepEqual(JSON.parse(JSON.stringify(current)), lessonSchema.parse(candidate));
    assert.equal(current.status, 'draft', `${current.id}: beta inclusion does not invent human review`);
    assert.ok(current.sentenceActivity.answers.every(answer => canBuild(answer, current.sentenceActivity.tokens)), current.id);
  }
});

test('each grammar correction has an exact untouched-prior seed guard and changes only its recorded fields', () => {
  const refinements = pack('refined-lessons');
  for (const candidate of refinements.lessons) {
    const prior = historicalResearchLessons.find(lesson => lesson.id === candidate.id)!;
    const change = refinements.changes.find((item: { lessonId: string }) => item.lessonId === candidate.id);
    assert.deepEqual(candidate, JSON.parse(JSON.stringify({ ...prior, revision: prior.revision + 1,
      grammar: { ...prior.grammar, explanation: change.after } })));
    assert.equal(change.before, prior.grammar.explanation);
    const guards = previousSeedFingerprints[candidate.id as keyof typeof previousSeedFingerprints];
    assert.ok(guards.some(guard => guard.revision === prior.revision && guard.sha256 === digest(prior)
      && guard.nextRevision === candidate.revision), candidate.id);
  }
});
