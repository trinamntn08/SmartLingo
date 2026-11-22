import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { japaneseCourse, japaneseLessons, openCoursePilot, restaurantLesson } from '@smartlingo/content';
import { buildLearningReport, courseDayProgressRevision, localStudyDate, type CourseEvent, type LearningEvent,
  type LearningReportInput, type NotebookEntry, type ReviewEvent } from '../src';

const now = '2026-11-21T12:00:00Z';
const evening = '2026-11-20T23:30:00Z'; // Saturday in Paris, Friday in UTC.
const french = restaurantLesson;
const japanese = japaneseLessons[0];
const note = (language?: 'fr-FR' | 'ja-JP'): NotebookEntry => ({ id: language === 'ja-JP' ? 'note.japanese' : 'note.french',
  sourceEntryId: language === 'ja-JP' ? japanese.vocabulary[0].id : french.vocabulary[0].id,
  ...(language ? { language } : {}), target: 'a saved entry', meaning: 'a meaning', example: '', updatedAt: evening });
function event(lesson = french, activity: LearningEvent['activity'] = 'vocabulary', occurredAt = evening): LearningEvent {
  return { id: randomUUID(), lessonId: lesson.id, revision: lesson.revision, itemId: lesson.id, activity,
    result: activity === 'completion' ? 'completed' : activity === 'vocabulary' ? 'viewed' : 'correct', hints: 0, occurredAt };
}
function review(entry: NotebookEntry, occurredAt = evening): ReviewEvent {
  return { id: randomUUID(), notebookId: entry.id, entryUpdatedAt: entry.updatedAt, skill: 'recognition', source: 'manual',
    algorithmVersion: 1, rating: 'helped', occurredAt, timeZone: 'Europe/Paris', studyDate: localStudyDate(occurredAt, 'Europe/Paris') };
}
function input(overrides: Partial<LearningReportInput> = {}): LearningReportInput {
  return { language: 'fr-FR', lessons: [french, japanese], courses: [openCoursePilot, japaneseCourse],
    events: [], courseEvents: [], notebook: [], reviewEvents: [], now, timeZone: 'Europe/Paris', ...overrides };
}

test('reports have truthful empty totals, Monday–Sunday labels, and no browsing or note-edit activity', () => {
  const course = openCoursePilot; const day = course.days[0];
  const navigation: CourseEvent = { id: randomUUID(), courseId: course.id, courseRevision: courseDayProgressRevision(course, day),
    dayId: day.id, blockId: day.blocks[0].id, kind: 'navigation', occurredAt: evening };
  const report = buildLearningReport(input({ notebook: [note()], courseEvents: [navigation, { ...navigation, id: randomUUID(), kind: 'support' }] }));
  assert.equal(report.completedLessons, 0); assert.equal(report.exploredWords, 0); assert.equal(report.savedWords, 1);
  assert.equal(report.totalLessons, 1); assert.equal(report.totalStudyDays, 5); assert.equal(report.completedStudyDays, 0);
  assert.equal(report.actionsThisWeek, 0); assert.equal(report.activeDaysThisWeek, 0);
  assert.equal(report.weekStart, '2026-11-16'); assert.equal(report.weekEnd, '2026-11-22');
  assert.deepEqual(report.week.map(day => day.label), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  assert.equal(report.week[5].today, true); assert.equal(report.week[6].future, true);
  assert.ok(report.totalWords >= french.vocabulary.length);
});

test('French/Japanese activity, current completions and canonical words stay separate and idempotent', () => {
  const overview = event(); const completion = event(french, 'completion');
  const jaOverview = event(japanese); const jaCompletion = event(japanese, 'completion');
  const course = openCoursePilot; const day = course.days[0];
  const courseEvents: CourseEvent[] = day.blocks.map(block => ({ id: randomUUID(), courseId: course.id,
    courseRevision: courseDayProgressRevision(course, day), dayId: day.id, blockId: block.id, occurredAt: evening,
    ...(block.kind === 'choice' ? { kind: 'choice' as const, choiceId: block.answerId, result: 'correct' as const, supported: false }
      : { kind: block.kind === 'reflection' ? 'reflection' as const : 'study' as const }) }));
  courseEvents.push({ ...courseEvents[0], id: randomUUID(), kind: 'completion' });
  const frenchNote = note(); const japaneseNote = note('ja-JP'); const frenchReview = review(frenchNote);
  const data = input({ events: [overview, overview, completion, jaOverview, jaCompletion], courseEvents: [...courseEvents, courseEvents[0]],
    notebook: [frenchNote, frenchNote, japaneseNote], reviewEvents: [frenchReview, frenchReview, review(japaneseNote)] });
  const original = JSON.stringify(data);
  const fr = buildLearningReport(data);
  assert.equal(fr.completedLessons, 1); assert.equal(fr.completedStudyDays, 1); assert.equal(fr.savedWords, 1);
  assert.equal(fr.exploredWords, new Set([...french.vocabulary, ...day.vocabulary].map(word => word.id)).size);
  assert.equal(fr.actionsThisWeek, 2 + courseEvents.length + 1); assert.equal(fr.activeDaysThisWeek, 1);
  assert.equal(fr.week[5].actions, fr.actionsThisWeek);
  assert.equal(fr.topics[0].completedLessons, 1); assert.equal(fr.topics[0].exploredWords, french.vocabulary.length);
  const ja = buildLearningReport({ ...data, language: 'ja-JP' });
  assert.equal(ja.completedLessons, 1); assert.equal(ja.completedStudyDays, 0); assert.equal(ja.savedWords, 1);
  assert.equal(ja.exploredWords, japanese.vocabulary.length); assert.equal(ja.actionsThisWeek, 3);
  assert.equal(ja.totalStudyDays, 13); assert.equal(ja.topics[0].name, japanese.topic);
  assert.equal(JSON.stringify(data), original, 'reporting must not mutate any history or catalogue input');
});

test('old valid revisions count as activity without pretending the latest lesson was completed', () => {
  const overview = event(); const completion = event(french, 'completion');
  const revised = { ...french, revision: french.revision + 1 };
  const future = { ...completion, id: randomUUID(), revision: revised.revision + 1 };
  const orphan = { ...completion, id: randomUUID(), lessonId: 'fr.missing.lesson' };
  const tomorrow = event(revised, 'completion', '2026-11-22T12:00:00Z');
  const report = buildLearningReport(input({ lessons: [french, revised, japanese], events: [overview, completion, future, orphan, tomorrow] }));
  assert.equal(report.totalLessons, 1); assert.equal(report.completedLessons, 0); assert.equal(report.exploredWords, 0);
  assert.equal(report.actionsThisWeek, 2); assert.equal(report.week[6].actions, 0);
  assert.throws(() => buildLearningReport(input({ events: [overview, { ...overview, result: 'incorrect' }] })), /Conflicting saved activity IDs/);
});

test('viewer-local weeks handle midnight, year boundaries and both Paris DST transitions', () => {
  const cases = [
    { now: '2026-11-15T23:30:00Z', today: '2026-11-16', start: '2026-11-16', activity: '2026-11-15T23:15:00Z' },
    { now: '2026-03-29T02:00:00Z', today: '2026-03-29', start: '2026-03-23', activity: '2026-03-29T01:30:00Z' },
    { now: '2026-10-25T02:30:00Z', today: '2026-10-25', start: '2026-10-19', activity: '2026-10-25T01:30:00Z' },
    { now: '2027-01-01T11:00:00Z', today: '2027-01-01', start: '2026-12-28', activity: '2027-01-01T10:00:00Z' },
  ];
  for (const example of cases) {
    const report = buildLearningReport(input({ now: example.now, events: [event(french, 'picture', example.activity)] }));
    assert.equal(report.today, example.today); assert.equal(report.weekStart, example.start);
    assert.equal(report.actionsThisWeek, 1); assert.equal(report.week.find(day => day.today)?.actions, 1);
  }
  const utc = buildLearningReport(input({ now: cases[0].now, timeZone: 'UTC', events: [event(french, 'picture', cases[0].activity)] }));
  assert.equal(utc.today, '2026-11-15'); assert.equal(utc.weekStart, '2026-11-09');
  assert.throws(() => buildLearningReport(input({ now: 'invalid' })), /valid current time/);
  assert.throws(() => buildLearningReport(input({ timeZone: 'Invalid/Zone' })));
});

test('edited-note historical review remains activity while a bare course completion cannot invent a completed day', () => {
  const previous = note();
  const edited = { ...previous, updatedAt: now, meaning: 'a newer personal meaning' };
  const course = openCoursePilot; const day = course.days[0];
  const completion: CourseEvent = { id: randomUUID(), courseId: course.id,
    courseRevision: courseDayProgressRevision(course, day), dayId: day.id, blockId: day.blocks[0].id,
    kind: 'completion', occurredAt: evening };
  const report = buildLearningReport(input({ notebook: [edited], reviewEvents: [review(previous)], courseEvents: [completion] }));
  assert.equal(report.savedWords, 1); assert.equal(report.completedStudyDays, 0); assert.equal(report.exploredWords, 0);
  assert.equal(report.actionsThisWeek, 2);
});
