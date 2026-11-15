import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { lessons } from '../packages/content/src/index.ts';

// Research coverage/integrity check, not French linguistic validation.
// Run from the repository root: node --import tsx scripts/verify-curriculum-topic-audit.mjs
const read = name => JSON.parse(readFileSync(new URL(`../docs/audits/${name}`, import.meta.url), 'utf8'));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const support = ({ id, revision, topic, title, level, outcome, vocabulary }) => ({ id, revision, topic, title, level, outcome, vocabulary });
const baseline = read('topic-word-audit-baseline.json');
const audits = ['topic-words-daily.json', 'topic-words-foundations.json'].map(read);
const expected = new Map(lessons.flatMap(lesson => lesson.vocabulary.map(word => [`${lesson.id}/${word.id}`, { lesson, word }])));
const seen = new Set();
const topicNames = new Set(lessons.map(lesson => lesson.topic));
const reviewedTopics = new Set();
const actions = { keep: 0, recycle: 0, move: 0, revise: 0 };
const homes = new Map();
const issueTags = new Set(['off_topic', 'too_advanced', 'duplicated', 'missing_chunk', 'missing_verb', 'not_idiomatic', 'translation', 'gender', 'register', 'prerequisite']);
const levels = new Set(['foundation', 'A1', 'A2']);
const assertEncoding = (value, label) => {
  // Catch observed native-shell loss of accented letters/apostrophes. A question
  // mark inside a word is not valid French; ordinary final questions are fine.
  assert.ok(!/\uFFFD|\p{L}\?\p{L}|\bcaf\?/u.test(value), `Corrupt text: ${label}`);
};
for (const name of ['topic-words-daily.md', 'topic-words-foundations.md', 'all-topic-words.md']) {
  assertEncoding(readFileSync(new URL(`../docs/audits/${name}`, import.meta.url), 'utf8'), name);
}
assert.equal(baseline.reviewStatus, 'draft');
assert.equal(baseline.lessons.length, lessons.length, 'Baseline lesson count changed; audit must be refreshed');
const fingerprints = new Map(baseline.lessons.map(item => [item.id, item.sha256]));
assert.equal(fingerprints.size, lessons.length, 'Duplicate baseline lesson');
for (const lesson of lessons) assert.equal(fingerprints.get(lesson.id), digest(support(lesson)), `Stale audit support: ${lesson.id}`);
for (const audit of audits) {
  assert.equal(audit.reviewStatus, 'draft');
  assert.ok(Array.isArray(audit.scope) && audit.scope.length > 0);
  assert.equal(new Set(audit.scope).size, audit.scope.length, 'Duplicate scope');
  for (const topic of audit.scope) {
    assert.ok(topicNames.has(topic) && !reviewedTopics.has(topic), `Unknown or overlapping review scope: ${topic}`);
    reviewedTopics.add(topic);
  }
  const scope = new Set(audit.scope);
  const scopedExpected = [...expected].filter(([, { lesson }]) => scope.has(lesson.topic));
  assert.equal(audit.entries.length, scopedExpected.length, 'Scoped coverage count');
  for (const entry of audit.entries) {
    const key = `${entry.lessonId}/${entry.vocabularyId}`;
    assert.ok(expected.has(key), `Unknown occurrence: ${key}`);
    assert.ok(!seen.has(key), `Duplicate occurrence: ${key}`);
    const { lesson, word } = expected.get(key);
    assert.ok(scope.has(lesson.topic), `Out-of-scope occurrence: ${key}`);
    assert.equal(entry.target, word.target, `Changed snapshot target: ${key}`);
    assert.equal(entry.meaning, word.meaning, `Changed snapshot meaning: ${key}`);
    assert.ok(Object.hasOwn(actions, entry.action), `Invalid action: ${key}`);
    assert.ok(typeof entry.firstHome === 'string' && entry.firstHome.trim(), `Missing first home: ${key}`);
    if (homes.has(word.id)) assert.equal(entry.firstHome, homes.get(word.id), `Conflicting first home: ${word.id}`);
    homes.set(word.id, entry.firstHome);
    assert.ok(typeof entry.rationale === 'string' && entry.rationale.trim(), `Missing rationale: ${key}`);
    for (const field of ['target', 'meaning', 'firstHome', 'rationale', 'suggestedTarget', 'suggestedMeaning']) if (typeof entry[field] === 'string') assertEncoding(entry[field], `${key}/${field}`);
    assert.ok(Array.isArray(entry.issues) && entry.issues.every(tag => issueTags.has(tag)), `Invalid issues: ${key}`);
    for (const field of ['suggestedTarget', 'suggestedMeaning']) assert.ok(entry[field] === null || (typeof entry[field] === 'string' && entry[field].trim()), `Invalid ${field}: ${key}`);
    assert.ok(entry.suggestedLevel === null || levels.has(entry.suggestedLevel), `Invalid level: ${key}`);
    seen.add(key);
    actions[entry.action] += 1;
  }
}
assert.equal(seen.size, expected.size, 'Incomplete catalogue coverage');
assert.equal(reviewedTopics.size, topicNames.size, 'Incomplete topic coverage');
const opening = read('greeting-first-proposal.json');
assert.equal(opening.reviewStatus, 'draft');
assert.equal(opening.exampleOrigin, 'editorial_example');
const canonical = new Map(lessons.flatMap(lesson => lesson.vocabulary.map(word => [word.id, word])));
const proposedIds = new Set();
for (const lesson of opening.lessons) {
  assert.ok(lesson.entries.length >= 6 && lesson.entries.length <= 10, 'Opening lesson size');
  for (const entry of lesson.entries) {
    for (const field of ['target', 'meaning', 'register', 'exampleFr', 'exampleEn']) assert.ok(typeof entry[field] === 'string' && entry[field].trim(), `Missing opening ${field}`);
    for (const field of ['target', 'meaning', 'register', 'exampleFr', 'exampleEn']) assertEncoding(entry[field], `opening/${entry.target}/${field}`);
    const id = entry.existingId ?? entry.candidateId;
    assert.ok(typeof id === 'string' && !proposedIds.has(id), 'Opening ID missing/duplicated');
    proposedIds.add(id);
    if (entry.existingId !== null) {
      assert.equal(entry.candidateId, null, 'Existing and proposed IDs are mutually exclusive');
      assert.equal(canonical.get(id)?.target, entry.target, `Opening existing target mismatch: ${id}`);
    } else {
      assert.ok(!canonical.has(id), `Candidate ID already exists: ${id}`);
      assert.ok(![...canonical.values()].some(word => word.target === entry.target), `Candidate duplicates an existing target: ${entry.target}`);
    }
  }
}
console.log(JSON.stringify({ lessons: lessons.length, topics: new Set(lessons.map(lesson => lesson.topic)).size, appearancesReviewed: seen.size, canonicalSenses: canonical.size, exactTargets: new Set([...canonical.values()].map(word => word.target)).size, actions, openingExpressions: proposedIds.size, firstTeachingHomes: new Set(homes.values()).size }, null, 2));
