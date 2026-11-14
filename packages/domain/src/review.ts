import { reviewEventSchema, type ReviewEvent, type ReviewState } from './review-schema';

/** Calendar-day heuristic for manually rated recognition, not a proficiency assessment. */
export const reviewIntervals = [1, 3, 7, 14, 30] as const;

function validateNotebookId(id: string): void {
  if (typeof id !== 'string' || id.length < 1 || id.length > 160) throw new Error('Invalid notebook ID');
}

function calendarDate(value: string): Date {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) {
    throw new Error('Review dates must use a valid YYYY-MM-DD calendar date');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error('Review dates must use a valid YYYY-MM-DD calendar date');
  }
  return date;
}

function addCalendarDays(value: string, days: number): string {
  const date = calendarDate(value);
  // UTC components are only a calendar arithmetic tool; no elapsed-hour or machine-zone calculation.
  date.setUTCDate(date.getUTCDate() + days);
  if (date.getUTCFullYear() > 9999) throw new Error('Review date exceeds the supported calendar range');
  return date.toISOString().slice(0, 10);
}

function orderedUniqueEvents(inputs: readonly ReviewEvent[]): ReviewEvent[] {
  const unique = new Map<string, ReviewEvent>();
  for (const input of inputs) {
    const event = reviewEventSchema.parse(input);
    calendarDate(event.studyDate);
    const existing = unique.get(event.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(event)) {
      throw new Error('Conflicting review event ID');
    }
    if (!existing) unique.set(event.id, event);
  }
  return [...unique.values()].sort((left, right) => {
    const instantOrder = Date.parse(left.occurredAt) - Date.parse(right.occurredAt);
    return instantOrder || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  });
}

function stateForNotebook(notebookId: string, events: readonly ReviewEvent[], today: string): ReviewState {
  const state: ReviewState = { notebookId, step: 0, dueDate: events[0]?.studyDate ?? today, independentDays: 0 };
  const supportedDates = new Set(events.filter(event => event.rating !== 'remembered').map(event => event.studyDate));
  const independentDates = new Set<string>();
  for (const event of events) {
    state.lastRating = event.rating;
    if (event.rating !== 'remembered') {
      state.step = 0;
      state.dueDate = addCalendarDays(event.studyDate, 1);
      continue;
    }
    // Consider the whole day's history: a later help rating also makes earlier recall supported.
    if (supportedDates.has(event.studyDate) || independentDates.has(event.studyDate) || event.studyDate < state.dueDate) continue;
    independentDates.add(event.studyDate);
    state.dueDate = addCalendarDays(event.studyDate, reviewIntervals[state.step]);
    state.step = Math.min(state.step + 1, reviewIntervals.length - 1);
  }
  state.independentDays = independentDates.size;
  return state;
}

export function reviewState(notebookId: string, events: readonly ReviewEvent[], today: string): ReviewState {
  validateNotebookId(notebookId);
  calendarDate(today);
  return stateForNotebook(notebookId, orderedUniqueEvents(events).filter(event => event.notebookId === notebookId), today);
}

/** Compute a catalogue in one pass rather than revalidating the full history for each note. */
export function reviewStates(notebookIds: readonly string[], events: readonly ReviewEvent[], today: string): ReviewState[] {
  calendarDate(today);
  const grouped = new Map<string, ReviewEvent[]>();
  for (const event of orderedUniqueEvents(events)) {
    const entries = grouped.get(event.notebookId) ?? [];
    entries.push(event);
    grouped.set(event.notebookId, entries);
  }
  const states: ReviewState[] = [];
  for (const id of new Set(notebookIds)) {
    validateNotebookId(id);
    states.push(stateForNotebook(id, grouped.get(id) ?? [], today));
  }
  return states;
}

/** Due items retain the caller's notebook order; repeated notebook IDs appear only once. */
export function dueReviewIds(notebookIds: readonly string[], events: readonly ReviewEvent[], today: string): string[] {
  return reviewStates(notebookIds, events, today).filter(state => state.dueDate <= today).map(state => state.notebookId);
}
