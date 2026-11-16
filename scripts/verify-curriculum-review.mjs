import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { lessons, courseSequence } from '../packages/content/src/index.ts';
import { lessonSchema, normalizeAnswer, notebookEntrySchema } from '../packages/domain/src/index.ts';

// Research integrity only. No database, provider, publication or curriculum writes.
const directory = new URL('../docs/curriculum/', import.meta.url);
const read = name => JSON.parse(readFileSync(new URL(name, directory), 'utf8'));
const json = value => JSON.parse(JSON.stringify(value));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const slugOf = lesson => lesson.id.split('.')[1];
const formOf = target => target.normalize('NFC').toLocaleLowerCase('fr-FR').replace(/[’‘]/g, "'").trim();
const unique = (values, label) => assert.equal(new Set(values).size, values.length, `Duplicate ${label}`);
const nonempty = (value, label) => assert.ok(typeof value === 'string' && value.trim(), `Missing ${label}`);
const strings = (values, label, minimum = 0) => {
  assert.ok(Array.isArray(values) && values.length >= minimum, `Missing ${label}`);
  values.forEach(value => nonempty(value, label));
  unique(values, label);
};
const encoding = (value, label) => assert.doesNotMatch(JSON.stringify(value), /\uFFFD|Ã|â€™|\p{L}\?\p{L}/u, `Corrupt UTF-8 ${label}`);

const sameFormDecisions = {
  'après': 'Preposition after an event versus standalone sequence adverb; preserve grammatical uses.',
  'une place': 'Town square versus available place/spot; distinct meanings.',
  "jusqu'à": 'Spatial endpoint versus temporal endpoint; related uses with separate support.',
  'un guichet': 'Transport ticket counter versus public-service counter; contextual specialisations, not unrelated lemmas.',
  'un horaire': 'Transport service/timetable versus work schedule; contextual specialisations.',
  'ça me va': 'Clothes fitting versus an arrangement being acceptable; related pragmatic uses.',
  'ouvrir': 'Physical opening versus opening a digital file/app; contextual transfer, not a newly discovered root verb.',
  'manquer': 'An item being missing versus missing a bus/event; different constructions.',
  'une expérience': 'Professional experience versus an experienced event; related count/mass uses.',
};

/** Teaching concept link only: historical IDs and their different support remain intact. */
const teachingConcept = id => id === 'fr.accommodation.breakfast' ? 'fr.routine.petit-dejeuner' : id;

export function buildInventory() {
  // Two-pass recommendation, not the current app's bank-by-bank browsing order.
  const route = [...lessons.filter(lesson => lesson.level !== 'A2'), ...lessons.filter(lesson => lesson.level === 'A2')];
  const entries = new Map();
  const introducedConcepts = new Set();
  for (const lesson of route) {
    for (const word of lesson.vocabulary) {
      let entry = entries.get(word.id);
      if (!entry) {
        entry = { vocabulary: json(word), teachingConceptId: teachingConcept(word.id), occurrences: [] };
        entries.set(word.id, entry);
      }
      assert.deepEqual(entry.vocabulary, json(word), `Canonical support conflict ${word.id}`);
      const concept = entry.teachingConceptId;
      entry.occurrences.push({ lessonId: lesson.id, level: lesson.level,
        status: introducedConcepts.has(concept) ? 'recycled' : 'new',
        recycledFrom: introducedConcepts.has(concept)
          ? [...entries.values()].flatMap(item => item.teachingConceptId === concept ? item.occurrences : []).find(item => item.status === 'new').lessonId
          : null });
      introducedConcepts.add(concept);
    }
  }
  const groups = Map.groupBy([...entries.values()], entry => formOf(entry.vocabulary.target));
  const sameFormGroups = [...groups].filter(([, values]) => values.length > 1).map(([form, values]) => {
    assert.ok(Object.hasOwn(sameFormDecisions, form), `Unreviewed same-form IDs: ${form}`);
    return { form, vocabularyIds: values.map(entry => entry.vocabulary.id), decision: 'preserve-contextual-ids', rationale: sameFormDecisions[form] };
  });
  return {
    reviewStatus: 'draft', generatedOn: '2026-11-16', baseCommit: 'd5a56ed',
    route: route.map(lesson => lesson.id),
    lessons: lessons.map(lesson => ({ id: lesson.id, revision: lesson.revision, sha256: digest(lesson) })),
    counts: { topics: new Set(lessons.map(slugOf)).size, lessons: lessons.length,
      appearances: route.reduce((total, lesson) => total + lesson.vocabulary.length, 0), canonicalIds: entries.size,
      exactWrittenForms: new Set([...entries.values()].map(entry => entry.vocabulary.target)).size,
      teachingConcepts: introducedConcepts.size,
      recycledAppearances: [...entries.values()].flatMap(entry => entry.occurrences).filter(item => item.status === 'recycled').length },
    semanticLinks: [{ vocabularyIds: ['fr.routine.petit-dejeuner', 'fr.accommodation.breakfast'],
      teachingConceptId: 'fr.routine.petit-dejeuner', action: 'count-as-recycling-preserve-runtime-ids',
      rationale: 'Breakfast with definite/indefinite article is one teaching concept. Both historical IDs and exact study cards survive; no learner migration.' }],
    sameFormGroups, entries: [...entries.values()],
  };
}

export function validateProgression(plan) {
  assert.equal(plan.reviewStatus, 'draft');
  assert.equal(plan.exampleOrigin, 'editorial_example');
  assert.deepEqual(plan.topics.map(topic => topic.slug), courseSequence.map(topic => topic.slug), 'Topic scope/order');
  const seen = new Set();
  const assigned = [];
  const canonical = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(word => [word.id, word]));
  for (const topic of plan.topics) {
    const bank = lessons.filter(lesson => slugOf(lesson) === topic.slug);
    assert.equal(topic.title, bank[0].topic, `${topic.slug} existing title`);
    for (const field of ['prerequisites']) {
      strings(topic[field], `${topic.slug}/${field}`);
      for (const prior of topic[field]) assert.ok(seen.has(prior), `Non-prior prerequisite ${topic.slug}/${prior}`);
    }
    assert.ok(topic.clusters.length >= 2, `Subclusters ${topic.slug}`);
    unique(topic.clusters.map(cluster => cluster.title), `${topic.slug} clusters`);
    for (const cluster of topic.clusters) {
      nonempty(cluster.title, `${topic.slug} cluster`);
      strings(cluster.vocabularyIds, `${topic.slug} cluster vocabulary`, 1);
      for (const id of cluster.vocabularyIds) assert.ok(bank.some(lesson => lesson.vocabulary.some(word => word.id === id)) && canonical.has(id), `Out-of-bank cluster ID ${topic.slug}/${id}`);
    }
    for (const [field, band] of [['foundationA1', 'basic'], ['a2', 'A2']]) {
      nonempty(topic[field].outcome, `${topic.slug} ${field} outcome`);
      strings(topic[field].lessonIds, `${topic.slug} lessons`);
      for (const id of topic[field].lessonIds) {
        const lesson = bank.find(lesson => lesson.id === id);
        assert.ok(lesson, `Unknown/wrong topic lesson ${id}`);
        assert.equal(lesson.level === 'A2', band === 'A2', `Wrong pass ${id}`);
        assigned.push(id);
      }
    }
    const task = topic.communicativeTask;
    for (const field of ['situation', 'promptEn', 'modelFr', 'modelEn']) nonempty(task[field], `${topic.slug} task ${field}`);
    strings(task.successCriteria, `${topic.slug} success criteria`, 2);
    strings(topic.revision.recycleFrom, `${topic.slug} recycling`);
    for (const prior of topic.revision.recycleFrom) assert.ok(seen.has(prior), `Non-prior recycling ${topic.slug}/${prior}`);
    nonempty(topic.revision.transferTaskEn, `${topic.slug} transfer task`);
    strings(topic.gaps, `${topic.slug} gaps`, 1);
    for (const level of ['B1', 'B2']) nonempty(topic.future[level], `${topic.slug} future ${level}`);
    seen.add(topic.slug);
  }
  unique(assigned, 'lesson assignment');
  assert.deepEqual([...assigned].sort(), lessons.map(lesson => lesson.id).sort(), 'Incomplete lesson coverage');
  encoding(plan, 'plan');
}

function canBuild(answer, tokens, chosen = []) {
  const prefix = normalizeAnswer(chosen.join(' '));
  const expected = normalizeAnswer(answer);
  if (!tokens.length) return prefix === expected;
  if (prefix && prefix !== expected && !expected.startsWith(`${prefix} `)) return false;
  return tokens.some((token, index) => canBuild(answer, tokens.filter((_, at) => at !== index), [...chosen, token]));
}

export function validateLesson(lesson, { everyAnswer = false } = {}) {
  const parsed = lessonSchema.parse(lesson);
  assert.equal(parsed.status, 'draft');
  encoding(parsed, lesson.id);
  // Existing lessons may accept typed orthographic variants (sœur/soeur) with one
  // fixed token spelling. Require at least one path there; new candidates use all.
  const buildable = parsed.sentenceActivity.answers.map(answer => canBuild(answer, parsed.sentenceActivity.tokens));
  assert.ok(everyAnswer ? buildable.every(Boolean) : buildable.some(Boolean), `${lesson.id}: unbuildable sentence answers`);
  const choices = parsed.vocabulary.filter(word => parsed.pictureActivity.choices.includes(word.id));
  unique(choices.map(word => formOf(word.target)), `${lesson.id} activity targets`);
  if (parsed.pictureActivity.mode === 'meaning') unique(choices.map(word => formOf(word.meaning)), `${lesson.id} activity meanings`);
  for (const word of parsed.vocabulary) {
    notebookEntrySchema.parse({ id: `fr:${word.id}`, sourceEntryId: word.id, target: word.target,
      meaning: word.meaning, example: word.example, updatedAt: '2026-11-16T12:00:00Z' });
    assert.doesNotMatch(word.example, /\b(?:TODO|TBD)\b|…|\.\.\./, `${word.id} unfinished example`);
  }
  return parsed;
}

export function validateBridges(pack) {
  assert.equal(pack.reviewStatus, 'draft');
  assert.equal(pack.exampleOrigin, 'editorial_example');
  assert.equal(pack.lessons.length, 6, 'Six bounded bridge drafts');
  unique(pack.lessons.map(lesson => lesson.id), 'bridge lesson IDs');
  const canonical = new Map(lessons.flatMap(lesson => lesson.vocabulary).map(word => [word.id, json(word)]));
  const formIds = Map.groupBy([...canonical.values()], word => formOf(word.target));
  for (const lesson of pack.lessons) {
    validateLesson(lesson, { everyAnswer: true });
    assert.ok(!lessons.some(current => current.id === lesson.id), `Existing lesson reused as bridge ${lesson.id}`);
    assert.equal(lesson.revision, 1);
    assert.ok(courseSequence.some(topic => topic.slug === slugOf(lesson)), `Bridge parent topic ${lesson.id}`);
    assert.equal(lesson.pictureActivity.mode, 'meaning');
    for (const word of lesson.vocabulary) {
      const existing = canonical.get(word.id);
      if (existing) assert.deepEqual(word, existing, `Changed canonical support ${word.id}`);
      else {
        assert.ok(!formIds.has(formOf(word.target)), `Unmarked duplicate bridge form ${word.target}`);
        canonical.set(word.id, word);
        formIds.set(formOf(word.target), [word]);
      }
    }
  }
}

export function validateRefinements(pack) {
  assert.equal(pack.reviewStatus, 'draft');
  assert.equal(pack.exampleOrigin, 'editorial_example');
  assert.equal(pack.lessons.length, 5);
  assert.equal(pack.changes.length, 5);
  unique(pack.lessons.map(lesson => lesson.id), 'refinement lesson IDs');
  unique(pack.changes.map(change => change.lessonId), 'change records');
  for (const candidate of pack.lessons) {
    validateLesson(candidate, { everyAnswer: true });
    const current = lessons.find(lesson => lesson.id === candidate.id);
    assert.ok(current, `Unknown refinement ${candidate.id}`);
    const change = pack.changes.find(change => change.lessonId === candidate.id);
    assert.ok(change, `Missing change ${candidate.id}`);
    assert.equal(change.field, 'grammar.explanation');
    assert.equal(change.before, current.grammar.explanation);
    assert.equal(change.after, candidate.grammar.explanation);
    assert.notEqual(change.before, change.after);
    nonempty(change.rationale, `${candidate.id} rationale`);
    const expected = json(current);
    expected.revision += 1;
    expected.grammar.explanation = change.after;
    assert.deepEqual(candidate, expected, `Unrecorded refinement edit ${candidate.id}`);
  }
}

function validateSources(sources) {
  assert.equal(sources.reviewStatus, 'draft');
  assert.equal(sources.accessedOn, '2026-11-16');
  unique(sources.sources.map(source => source.id), 'source IDs');
  for (const source of sources.sources) {
    for (const field of ['id', 'title', 'claim', 'limit']) nonempty(source[field], `source ${field}`);
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.ok(['cefr_descriptor', 'inspiration', 'usage_validation'].includes(source.type));
  }
}

function checkNegativeFixtures(plan, bridges, refinements, inventory) {
  const changed = (value, mutate) => { const copy = structuredClone(value); mutate(copy); return copy; };
  const fails = (run, label) => assert.throws(run, undefined, `Fixture was not rejected: ${label}`);
  fails(() => validateProgression(changed(plan, p => p.topics[0].prerequisites.push('past'))), 'future prerequisite');
  fails(() => validateProgression(changed(plan, p => p.topics[0].foundationA1.lessonIds.pop())), 'missing lesson');
  fails(() => validateProgression(changed(plan, p => p.topics[0].clusters[0].vocabularyIds.push('fr.unknown'))), 'unknown sense');
  fails(() => validateBridges(changed(bridges, p => { p.lessons[0].status = 'published'; })), 'published candidate');
  fails(() => validateBridges(changed(bridges, p => { p.lessons[0].sentenceActivity.tokens = ['impossible', 'pieces']; })), 'unsolvable sentence');
  fails(() => validateBridges(changed(bridges, p => {
    const reused = p.lessons.flatMap(l => l.vocabulary).find(w => inventory.entries.some(e => e.vocabulary.id === w.id));
    assert.ok(reused); reused.exampleMeaning = 'Changed canonical support';
  })), 'shared support drift');
  fails(() => validateRefinements(changed(refinements, p => { p.lessons[0].vocabulary[0].meaning = 'Unrecorded change'; })), 'unrecorded correction');
  fails(() => assert.deepEqual(changed(inventory, p => { p.lessons[0].sha256 = 'stale'; }), buildInventory()), 'stale full-catalogue fingerprint');
  console.log('8 negative integrity fixtures rejected as expected.');
}

function main() {
  const inventory = buildInventory();
  if (process.argv.includes('--refresh-inventory')) {
    writeFileSync(new URL('vocabulary-ledger.json', directory), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
    console.log('Wrote deterministic research vocabulary ledger; this does not approve content.');
  }
  assert.deepEqual(read('vocabulary-ledger.json'), inventory, 'Stale catalogue/ledger; review changes before explicit refresh');
  const plan = read('topic-progression.json');
  const bridges = read('bridge-lessons.json');
  const refinements = read('refined-lessons.json');
  validateSources(read('sources.json'));
  lessons.forEach(lesson => validateLesson(lesson));
  validateProgression(plan);
  validateBridges(bridges);
  validateRefinements(refinements);
  if (process.argv.includes('--self-test')) checkNegativeFixtures(plan, bridges, refinements, inventory);
  console.log(`Curriculum review integrity passed: ${JSON.stringify(inventory.counts)}; 6 bridges / 5 grammar refinements. French/CEFR correctness and owner approval are not established by this check.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
