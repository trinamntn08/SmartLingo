import { openKeyPhrases, openLessonFromTopics, openTopic } from './learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { japaneseCourse, japaneseLessons, lessons, openCoursePilot } from '@smartlingo/content';
import {
  courseDayProgressRevision, courseEventSchema, learningEventSchema, notebookEntrySchema, reviewEventSchema,
  type CourseEvent, type LearningEvent, type Lesson, type NotebookEntry, type ReviewEvent,
} from '@smartlingo/domain';

test.use({ storageState: { cookies: [], origins: [] }, timezoneId: 'Europe/Paris' });
const now = '2026-11-21T12:00:00.000Z';
const today = '2026-11-21T10:00:00.000Z';
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const french = lessons[0];
const japanese = japaneseLessons[0];
const stores = ['events', 'notebook', 'reviewEvents', 'courseEvents'] as const;
type Rows = { events: LearningEvent[]; notebook: NotebookEntry[]; reviewEvents: ReviewEvent[]; courseEvents: CourseEvent[] };

async function choose(page: Page, language: string) {
  if (await button(page, 'Change language').isVisible()) await button(page, 'Change language').click();
  await button(page, `Learn ${language}`).click();
  await expect(button(page, 'Report')).toBeVisible();
}

async function writeRows(page: Page, rows: Partial<Rows>) {
  await page.evaluate(async rows => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning', 4);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(Object.keys(rows), 'readwrite');
        transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error);
        for (const [name, entries] of Object.entries(rows)) for (const entry of entries) transaction.objectStore(name).put(entry);
      });
    } finally { database.close(); }
  }, rows);
}

async function snapshot(page: Page) {
  return page.evaluate(async names => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning', 4);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await Promise.all(names.map(name => new Promise<unknown[]>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      })));
    } finally { database.close(); }
  }, [...stores]);
}

function event(lesson: Lesson, activity: LearningEvent['activity'], itemId: string, occurredAt = today, revision = lesson.revision) {
  return learningEventSchema.parse({ id: randomUUID(), lessonId: lesson.id, revision, itemId, activity,
    result: activity === 'completion' ? 'completed' : activity === 'vocabulary' ? 'viewed' : 'correct', hints: 0, occurredAt });
}

function fixture(): { rows: Rows; frenchActions: number; frenchExplored: number } {
  const note = (lesson: Lesson, index: number, legacy = false) => notebookEntrySchema.parse({
    id: `report-${lesson.vocabulary[index].id}`, sourceEntryId: lesson.vocabulary[index].id,
    ...(legacy ? {} : { language: lesson.language }), target: lesson.vocabulary[index].target,
    meaning: lesson.vocabulary[index].meaning, example: lesson.vocabulary[index].example, updatedAt: today,
  });
  const notebook = [note(french, 0, true), note(french, 1), note(japanese, 0)];
  const reviewEvents = [notebook[0], notebook[2]].map(entry => reviewEventSchema.parse({
    id: randomUUID(), notebookId: entry.id, entryUpdatedAt: entry.updatedAt, skill: 'recognition', source: 'manual',
    algorithmVersion: 1, rating: 'remembered', occurredAt: today, studyDate: '2026-11-21', timeZone: 'Europe/Paris',
  }));
  const day = openCoursePilot.days[0];
  const scope = { courseId: openCoursePilot.id, courseRevision: courseDayProgressRevision(openCoursePilot, day), dayId: day.id, occurredAt: today };
  const courseEvents = day.blocks.map(block => courseEventSchema.parse({ ...scope, id: randomUUID(), blockId: block.id,
    kind: block.kind === 'choice' ? 'choice' : block.kind === 'reflection' ? 'reflection' : 'study',
    ...(block.kind === 'choice' ? { choiceId: block.answerId, result: 'correct', supported: false } : {}),
  }));
  courseEvents.push(courseEventSchema.parse({ ...scope, id: randomUUID(), blockId: day.blocks.at(-1)!.id, kind: 'completion' }));
  // A bare completion does not satisfy the second day's saved block gate.
  const unstudiedDay = openCoursePilot.days[1];
  courseEvents.push(courseEventSchema.parse({ ...scope, id: randomUUID(), dayId: unstudiedDay.id,
    courseRevision: courseDayProgressRevision(openCoursePilot, unstudiedDay), blockId: unstudiedDay.blocks.at(-1)!.id, kind: 'completion' }));
  for (const kind of ['navigation', 'support'] as const) courseEvents.push(courseEventSchema.parse({
    id: randomUUID(), courseId: japaneseCourse.id, courseRevision: courseDayProgressRevision(japaneseCourse, japaneseCourse.days[0]),
    dayId: japaneseCourse.days[0].id, blockId: japaneseCourse.days[0].blocks[0].id, kind, occurredAt: today,
  }));
  const historical = lessons.find(lesson => lesson.revision > 1)!;
  const events = [event(french, 'vocabulary', french.id), event(french, 'completion', french.id),
    event(historical, 'completion', historical.id, today, historical.revision - 1),
    event(japanese, 'vocabulary', japanese.vocabulary[0].id), event(japanese, 'picture', japanese.pictureActivity.entryId),
    event(french, 'picture', french.pictureActivity.entryId, '2026-11-22T10:00:00.000Z')];
  const explored = new Set([...french.vocabulary, ...day.vocabulary].map(word => word.id));
  return { rows: { events, notebook, courseEvents, reviewEvents }, frenchActions: 3 + day.blocks.length + 2 + 1, frenchExplored: explored.size };
}

function totals(language: 'French' | 'Japanese') {
  const catalogue = language === 'French' ? lessons : japaneseLessons;
  const course = language === 'French' ? openCoursePilot : japaneseCourse;
  return { lessons: catalogue.length, words: new Set([...catalogue.flatMap(lesson => lesson.vocabulary), ...course.days.flatMap(day => day.vocabulary)].map(word => word.id)).size, days: course.days.length };
}

async function metrics(page: Page, language: 'French' | 'Japanese', completed: number, explored: number, saved: number, days: number) {
  const total = totals(language);
  for (const [id, value] of [['lessons', `${completed} / ${total.lessons}`], ['explored', `${explored} / ${total.words}`], ['saved', String(saved)], ['days', `${days} / ${total.days}`]]) {
    await expect(page.getByTestId(`report-${id}`).getByText(value, { exact: true })).toBeVisible();
  }
}

async function week(page: Page, actions: number) {
  const chart = page.getByTestId('report-week');
  for (let day = 16; day <= 22; day++) {
    await expect(chart.getByLabel(new RegExp(`, 2026-11-${day}: ${day === 21 ? actions : 0} actions`))).toBeVisible();
  }
  await expect(chart.getByLabel(/2026-11-22.*upcoming/)).toBeVisible();
}

test.beforeEach(async ({ page, context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.clock.setFixedTime(new Date(now));
});

test('first-run reports show real catalogue sizes and no invented activity in either language at desktop and 320px', async ({ page }, info) => {
  if (info.project.name === 'small-screen') await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  for (const language of ['French', 'Japanese'] as const) {
    await choose(page, language);
    await button(page, 'Report').click();
    await expect(page.getByRole('heading', { name: 'Learning report', exact: true })).toBeVisible();
    await metrics(page, language, 0, 0, 0, 0); await week(page, 0);
    await expect(page.getByTestId('report-topic-list')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`${language.toLowerCase()}-empty-report.png`), fullPage: true });
    await button(page, 'Today').click();
    for (const id of ['lessons', 'explored', 'saved', 'days', 'week']) await expect(page.getByTestId(`report-${id}`)).toHaveCount(0);
    await page.screenshot({ path: info.outputPath(`${language.toLowerCase()}-friendly-today.png`), fullPage: true });
  }
});

test('report reads scoped saved history without writing, survives reload and refreshes on focus', async ({ page }, info) => {
  await page.goto('/'); await choose(page, 'French');
  const { rows, frenchActions, frenchExplored } = fixture();
  await writeRows(page, rows); await page.reload();
  await expect(button(page, 'Report')).toBeVisible();
  const before = await snapshot(page);
  await button(page, 'Report').click();
  await metrics(page, 'French', 1, frenchExplored, 2, 1); await week(page, frenchActions);
  const topicLessons = lessons.filter(lesson => lesson.topic === french.topic);
  const topicWords = new Set(topicLessons.flatMap(lesson => lesson.vocabulary.map(word => word.id)));
  const studiedWords = new Set([...french.vocabulary, ...openCoursePilot.days[0].vocabulary].map(word => word.id));
  const topic = page.getByTestId('report-topic-list').getByRole('heading', { name: french.topic, exact: true }).locator('..');
  await expect(topic.getByText(`1 / ${topicLessons.length} lessons completed`, { exact: true })).toBeVisible();
  await expect(topic.getByText(`${[...topicWords].filter(id => studiedWords.has(id)).length} / ${topicWords.size} words explored`, { exact: true })).toBeVisible();
  expect(await snapshot(page)).toEqual(before);
  await page.screenshot({ path: info.outputPath('saved-french-report.png'), fullPage: true });
  await choose(page, 'Japanese'); await button(page, 'Report').click();
  await metrics(page, 'Japanese', 0, 1, 1, 0); await week(page, 3);
  await page.reload(); await button(page, 'Report').click();
  await metrics(page, 'Japanese', 0, 1, 1, 0); await week(page, 3);
  await openLessonFromTopics(page, japanese);
  await expect(page.getByRole('heading', { name: japanese.subtitle, exact: true })).toBeVisible();
  await choose(page, 'French'); await button(page, 'Report').click();
  await metrics(page, 'French', 1, frenchExplored, 2, 1);
  const added = event(french, 'sentence', french.sentenceActivity.id);
  await writeRows(page, { events: [added] });
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await week(page, frenchActions + 1);
  await metrics(page, 'French', 1, frenchExplored, 2, 1);
  const after = await snapshot(page);
  expect(after[0]).toEqual(expect.arrayContaining([...before[0], added]));
  expect(after[0]).toHaveLength(before[0].length + 1);
  expect(after.slice(1)).toEqual(before.slice(1));
});

test('unavailable storage offers report retry without fabricated zeroes while lessons remain browsable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  for (const [language, lesson] of [['French', french], ['Japanese', japanese]] as const) {
    await choose(page, language); await button(page, 'Report').click();
    await expect(button(page, 'Retry report')).toBeVisible();
    for (const id of ['lessons', 'explored', 'saved', 'days']) await expect(page.getByTestId(`report-${id}`)).toHaveCount(0);
    await expect(page.getByTestId('report-week')).toHaveCount(0);
    await button(page, 'Retry report').click();
    await expect(button(page, 'Retry report')).toBeVisible();
    await openTopic(page, lesson.topic);
    await button(page, `Open ${lesson.subtitle}`).click();
    await openKeyPhrases(page);
    await expect(page.getByTestId(`vocabulary-${lesson.vocabulary[0].id}`)).toBeVisible();
  }
});
