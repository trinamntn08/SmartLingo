import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dueReviewIds, reviewIntervals, reviewState } from '../src/review';
import { localStudyDate, currentReviewEvents, type ReviewEvent } from '../src/review-schema';

const notebookId = 'notebook.fr.cafe';
let nextEventId = 0;
function event(studyDate: string, rating: ReviewEvent['rating'] = 'remembered', overrides: Partial<ReviewEvent> = {}): ReviewEvent {
  nextEventId++;
  return {
    id: `00000000-0000-4000-8000-${String(nextEventId).padStart(12, '0')}`,
    notebookId, entryUpdatedAt: '2026-01-01T00:00:00Z', skill: 'recognition', source: 'manual', algorithmVersion: 1,
    rating, studyDate, occurredAt: `${studyDate}T12:00:00Z`, timeZone: 'UTC', ...overrides,
  };
}

test('new notes are due today without any independent recall claim', () => {
  assert.deepEqual(reviewIntervals, [1, 3, 7, 14, 30]);
  assert.deepEqual(reviewState(notebookId, [], '2026-11-14'), {
    notebookId, step: 0, dueDate: '2026-11-14', independentDays: 0,
  });
  assert.deepEqual(dueReviewIds(['second', notebookId, 'second'], [], '2026-11-14'), ['second', notebookId]);
});

test('independent remembered dates use 1/3/7/14/30 days then keep the thirty-day cap', () => {
  const events: ReviewEvent[] = [];
  const schedule = [
    ['2026-01-01', '2026-01-02', 1], ['2026-01-02', '2026-01-05', 2],
    ['2026-01-05', '2026-01-12', 3], ['2026-01-12', '2026-01-26', 4],
    ['2026-01-26', '2026-02-25', 4], ['2026-02-25', '2026-03-27', 4],
  ] as const;
  for (const [date, dueDate, step] of schedule) {
    events.push(event(date));
    assert.deepEqual(reviewState(notebookId, events, date), {
      notebookId, step, dueDate, independentDays: events.length, lastRating: 'remembered',
    });
  }
  assert.deepEqual(dueReviewIds([notebookId], events, '2026-03-26'), []);
  assert.deepEqual(dueReviewIds([notebookId], events, '2026-03-27'), [notebookId]);
  assert.deepEqual(dueReviewIds([notebookId], events, '2026-03-28'), [notebookId]);
});

test('Again and Needed help reset the next interval while keeping historical independent dates', () => {
  for (const rating of ['again', 'helped'] as const) {
    const events = [event('2026-01-01'), event('2026-01-02'), event('2026-01-03', rating)];
    assert.deepEqual(reviewState(notebookId, events, '2026-01-03'), {
      notebookId, step: 0, dueDate: '2026-01-04', independentDays: 2, lastRating: rating,
    });
    events.push(event('2026-01-04'));
    assert.deepEqual(reviewState(notebookId, events, '2026-01-04'), {
      notebookId, step: 1, dueDate: '2026-01-05', independentDays: 3, lastRating: 'remembered',
    });
  }
});

test('repeated remembered ratings on one local date cannot advance or alter due dates', () => {
  const first = event('2026-11-14', 'remembered', { occurredAt: '2026-11-14T08:00:00Z' });
  const second = event('2026-11-14', 'remembered', { occurredAt: '2026-11-14T23:00:00Z' });
  const expected = reviewState(notebookId, [first], '2026-11-14');
  assert.deepEqual(reviewState(notebookId, [second, first, second, first], '2026-11-14'), expected);
  assert.equal(expected.step, 1);
  assert.equal(expected.independentDays, 1);
  assert.equal(expected.dueDate, '2026-11-15');
});

test('early remembered practice from a stale tab cannot advance the due schedule', () => {
  const history = [event('2026-11-14'), event('2026-11-15')];
  const expected = reviewState(notebookId, history, '2026-11-16');
  assert.equal(expected.dueDate, '2026-11-18');
  assert.deepEqual(reviewState(notebookId, [...history, event('2026-11-16')], '2026-11-16'), expected);
  assert.equal(reviewState(notebookId, [...history, event('2026-11-18')], '2026-11-18').dueDate, '2026-11-25');
});

test('edited notebook content starts fresh practice while earlier ratings remain available', () => {
  const note = { id: notebookId, sourceEntryId: 'fr.cafe', target: 'un café', meaning: 'my note', example: '', updatedAt: '2026-01-01T00:00:00Z' };
  const ratings = [event('2026-01-01')];
  assert.equal(currentReviewEvents([note], ratings).length, 1);
  const changed = { ...note, meaning: 'a changed note', updatedAt: '2026-01-02T10:00:00Z' };
  assert.deepEqual(currentReviewEvents([changed], ratings), []);
  assert.equal(reviewState(note.id, currentReviewEvents([changed], ratings), '2026-01-02').dueDate, '2026-01-02');
  assert.equal(ratings.length, 1);
});

test('a date with any help or Again is supported regardless of rating order or event input order', () => {
  for (const rating of ['again', 'helped'] as const) {
    for (const supportedFirst of [true, false]) {
      const previous = event('2026-11-13');
      const first = event('2026-11-14', supportedFirst ? rating : 'remembered', { occurredAt: '2026-11-14T08:00:00Z' });
      const second = event('2026-11-14', supportedFirst ? 'remembered' : rating, { occurredAt: '2026-11-14T09:00:00Z' });
      const state = reviewState(notebookId, [second, previous, first], '2026-11-14');
      assert.deepEqual(state, {
        notebookId, step: 0, dueDate: '2026-11-15', independentDays: 1,
        lastRating: supportedFirst ? 'remembered' : rating,
      });
      const next = event('2026-11-15');
      assert.equal(reviewState(notebookId, [next, first, previous, second], '2026-11-15').independentDays, 2);
    }
  }
});

test('event order uses instants rather than ISO text and resolves instant ties by stable UUID', () => {
  const earlier = event('2026-11-14', 'helped', { occurredAt: '2026-11-14T10:00:00+02:00' });
  const later = event('2026-11-14', 'again', { occurredAt: '2026-11-14T09:00:00Z' });
  assert.equal(reviewState(notebookId, [later, earlier], '2026-11-14').lastRating, 'again');
  const tiedLow = event('2026-11-15', 'helped', { id: '10000000-0000-4000-8000-000000000001' });
  const tiedHigh = event('2026-11-15', 'again', { id: '20000000-0000-4000-8000-000000000001' });
  const input = [tiedHigh, later, tiedLow, earlier];
  const unchanged = JSON.stringify(input);
  assert.deepEqual(reviewState(notebookId, input, '2026-11-15'), reviewState(notebookId, [...input].reverse(), '2026-11-15'));
  assert.equal(reviewState(notebookId, input, '2026-11-15').lastRating, 'again');
  assert.equal(JSON.stringify(input), unchanged);
});

test('identical UUIDs dedupe while conflicting UUIDs fail even across notebook IDs', () => {
  const first = event('2026-11-14');
  assert.deepEqual(reviewState(notebookId, [first, { ...first }], '2026-11-14'), reviewState(notebookId, [first], '2026-11-14'));
  for (const changed of [{ ...first, rating: 'helped' as const }, { ...first, notebookId: 'another.note' }]) {
    assert.throws(() => reviewState(notebookId, [first, changed], '2026-11-14'), /Conflicting review event ID/);
    assert.throws(() => dueReviewIds([notebookId], [first, changed], '2026-11-14'), /Conflicting review event ID/);
  }
});

test('due queue preserves first notebook order, ignores other histories and includes overdue notes', () => {
  const events = [event('2026-11-14'), event('2026-11-13', 'helped', { notebookId: 'older.note' })];
  assert.deepEqual(dueReviewIds(['new.note', notebookId, 'older.note', 'new.note'], events, '2026-11-14'), ['new.note', 'older.note']);
  assert.equal(reviewState('new.note', events, '2026-11-14').independentDays, 0);
  assert.deepEqual(dueReviewIds(['older.note', notebookId], events, '2026-11-16'), ['older.note', notebookId]);
});

test('Paris spring and autumn DST changes schedule by calendar date, including leap and year boundaries', () => {
  const cases = [
    ['2026-03-28T23:30:00+01:00', '2026-03-28', '2026-03-29'],
    ['2026-03-29T23:30:00+02:00', '2026-03-29', '2026-03-30'],
    ['2026-10-24T23:30:00+02:00', '2026-10-24', '2026-10-25'],
    ['2026-10-25T23:30:00+01:00', '2026-10-25', '2026-10-26'],
    ['2028-02-28T23:30:00+01:00', '2028-02-28', '2028-02-29'],
    ['2028-02-29T23:30:00+01:00', '2028-02-29', '2028-03-01'],
    ['2026-12-31T23:30:00+01:00', '2026-12-31', '2027-01-01'],
  ];
  for (const [occurredAt, studyDate, dueDate] of cases) {
    assert.equal(localStudyDate(occurredAt, 'Europe/Paris'), studyDate);
    const reviewed = event(studyDate, 'remembered', { occurredAt, timeZone: 'Europe/Paris' });
    assert.equal(reviewState(notebookId, [reviewed], studyDate).dueDate, dueDate);
  }
});

test('study dates follow recorded timezone at midnight rather than the timestamp UTC date', () => {
  const instant = '2026-11-14T23:30:00Z';
  const paris = localStudyDate(instant, 'Europe/Paris');
  const newYork = localStudyDate(instant, 'America/New_York');
  assert.equal(paris, '2026-11-15');
  assert.equal(newYork, '2026-11-14');
  const french = event(paris, 'remembered', { occurredAt: instant, timeZone: 'Europe/Paris' });
  const american = event(newYork, 'remembered', { occurredAt: instant, timeZone: 'America/New_York' });
  assert.equal(reviewState(notebookId, [french], paris).dueDate, '2026-11-16');
  assert.equal(reviewState(notebookId, [american], newYork).dueDate, '2026-11-15');
  const laterUtcSameLocalDay = event(paris, 'remembered', {
    occurredAt: '2026-11-15T22:00:00Z', timeZone: 'Europe/Paris',
  });
  assert.equal(reviewState(notebookId, [french, laterUtcSameLocalDay], paris).independentDays, 1);
});

test('invalid calendar dates, inconsistent event dates, unsupported ratings and timezone names fail', () => {
  for (const today of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-1-01', '0000-01-01', 'not-a-date', '2026-11-14T00:00:00Z']) {
    assert.throws(() => reviewState(notebookId, [], today), /calendar date/);
    assert.throws(() => dueReviewIds([notebookId], [], today), /calendar date/);
  }
  assert.throws(() => reviewState('', [], '2026-11-14'), /notebook ID/);
  assert.throws(() => dueReviewIds(['x'.repeat(161)], [], '2026-11-14'), /notebook ID/);
  assert.throws(() => reviewState(notebookId, [event('2026-11-14', 'remembered', { timeZone: 'Nowhere/Invalid' })], '2026-11-14'));
  assert.throws(() => reviewState(notebookId, [event('2026-11-14', 'remembered', { occurredAt: '2026-11-15T12:00:00Z' })], '2026-11-14'));
  assert.throws(() => reviewState(notebookId, [event('2026-11-14', 'unknown' as ReviewEvent['rating'])], '2026-11-14'));
});
