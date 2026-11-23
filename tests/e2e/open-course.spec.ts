import { guidedLessonButton, expectDialoguePhoto, expectFrenchTranscripts, openCourseOutline, openProfileSection } from './learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { courseDayProgressRevision, type CourseDay, type CourseEvent } from '@smartlingo/domain';

const [firstDay, secondDay, thirdDay] = openCoursePilot.days;
const coursePanel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => coursePanel(page).getByRole('button', { name, exact: true });
const step = (page: Page, name: string) => coursePanel(page).getByRole('heading', { name, exact: true });
const chooseDay = (page: Page, day: CourseDay) => coursePanel(page).getByTestId(`course-day-${day.id}`).getByRole('button');
const dayHeading = (page: Page, day: CourseDay) => step(page, `Lesson ${day.dayNumber}: ${day.title}`);

async function storedEvents(page: Page, store: 'courseEvents' | 'events' = 'courseEvents') {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<CourseEvent[]>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, store);
}

async function seedEvents(page: Page, events: CourseEvent[]) {
  await page.evaluate(async inputs => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('courseEvents', 'readwrite');
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error);
        for (const input of inputs) transaction.objectStore('courseEvents').add(input);
      });
    } finally { database.close(); }
  }, events);
}

function courseEvent(day: CourseDay, blockId: string, kind: CourseEvent['kind'], index: number): CourseEvent {
  return { id: crypto.randomUUID(), courseId: openCoursePilot.id,
    courseRevision: courseDayProgressRevision(openCoursePilot, day), dayId: day.id,
    blockId, occurredAt: new Date(Date.parse('2026-11-01T12:00:00Z') + index).toISOString(), kind } as CourseEvent;
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('all five opening lessons offer a full French transcript, full translation and a context photo', async ({ page }) => {
  await page.goto('/');
  await expect(step(page, openCoursePilot.title)).toBeVisible();
  await guidedLessonButton(page).focus();
  await page.keyboard.press('Enter');
  await openCourseOutline(coursePanel(page));
  await expect(step(page, 'Unit 1: Your first conversations in France')).toBeVisible();
  await expect(coursePanel(page).getByText('5 guided lessons · Draft preview', { exact: true })).toBeVisible();

  for (const day of openCoursePilot.days) {
    await openCourseOutline(coursePanel(page));
    await chooseDay(page, day).click();
    await expect(dayHeading(page, day)).toBeVisible();
    await expect(step(page, 'Dialogue')).toBeVisible();
    const dialogue = day.blocks.find(block => block.kind === 'dialogue')!;
    if (dialogue.kind !== 'dialogue') throw new Error('Missing dialogue');
    const { french, english } = await expectFrenchTranscripts(coursePanel(page), dialogue.lines);
    await expectDialoguePhoto(coursePanel(page), day === firstDay ? 'french-neighbour-dialogue.jpg' : 'french-workshop-dialogue.jpg');
    if (day === firstDay) {
      const frenchBox = (await french.boundingBox())!;
      const englishBox = (await english.boundingBox())!;
      if (page.viewportSize()!.width >= 600) expect(englishBox.x).toBeGreaterThan(frenchBox.x);
      else expect(englishBox.y).toBeGreaterThanOrEqual(frenchBox.y + frenchBox.height);
      await expect(coursePanel(page).getByText(firstDay.compact!.tip, { exact: true })).toBeVisible();
      await expect(button(page, 'Source credits and licence')).toHaveCount(0);
      await expect(button(page, 'Authorship and review')).toHaveCount(0);
    }
    await expect(button(page, 'Save study section')).toHaveCount(0);
    await expect(button(page, 'Next section')).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('Next saves dialogue and resumes practice without requiring answers before finishing', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await button(page, 'Next section').click();
  await expect(step(page, 'Quick practice')).toBeVisible();
  const practice = firstDay.blocks.find(block => block.kind === 'choice')!;
  if (practice.kind !== 'choice') throw new Error('Missing practice');
  const question = coursePanel(page).getByTestId(`course-choice-${practice.id}`);
  const choices = practice.choices.map((choice, index) => ({
    ...choice, label: `${'ABC'[index]}. ${choice.target}`,
  }));
  await expect(question.getByRole('heading', { name: 'How do you greet a neighbour during the day?' })).toBeVisible();
  await expect(question.getByRole('button', { name: /^[ABC]\. / })).toHaveCount(3);
  for (const { label } of choices) await expect(question.getByRole('button', { name: label, exact: true })).toBeVisible();
  const wrong = choices.find(choice => choice.id !== practice.answerId)!;
  await question.getByRole('button', { name: wrong.label, exact: true }).press('Enter');
  await expect(question.getByText(/Try again/)).toBeVisible();
  await expect(question.getByText(firstDay.compact!.practice[0].feedback, { exact: false })).toHaveCount(0);
  await question.getByRole('button', { name: /hint/i }).click();
  await expect(question.getByText(firstDay.compact!.practice[0].hint, { exact: true })).toBeVisible();
  const correct = choices.find(choice => choice.id === practice.answerId)!;
  await question.getByRole('button', { name: correct.label, exact: true }).click();
  await expect(question.getByText(/Correct/)).toBeVisible();

  await page.reload();
  await expect(step(page, 'Quick practice')).toBeVisible();
  await expect(question.getByText(/Correct/)).toBeVisible();
  await button(page, 'Next section').click();
  await expect(step(page, 'Try it')).toBeVisible();
  await button(page, 'Finish lesson').click();
  await expect(step(page, 'Lesson saved')).toBeVisible();
  const events = await storedEvents(page);
  expect(events.filter(event => event.kind === 'study')).toHaveLength(1);
  expect(events.filter(event => event.kind === 'completion')).toHaveLength(1);
  expect(events.filter(event => event.kind === 'choice' && event.result === 'correct')).toHaveLength(1);
  expect(events.some(event => event.kind === 'choice' && event.supported)).toBe(true);
  expect([...new Set(events.map(event => event.courseRevision))]).toEqual([courseDayProgressRevision(openCoursePilot, firstDay)]);
  expect(await storedEvents(page, 'events')).toEqual([]);
  await button(page, `Continue to Lesson 2: ${secondDay.title}`).click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(step(page, 'Dialogue')).toBeVisible();
});

test('notebook, progress and the resume step survive backup and restore', async ({ page, browser }, info) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await button(page, 'Useful words').click();
  await expect(coursePanel(page).getByTestId('vocabulary-fr.bonjour').getByRole('img')).toHaveCount(0);
  await button(page, 'Save bonjour').click();
  await expect(button(page, 'bonjour saved to notebook')).toBeDisabled();
  await button(page, 'Next section').click();
  await expect(step(page, 'Quick practice')).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const backupPath = info.outputPath('course-learning-backup.json');
  await (await download).saveAs(backupPath);

  const restoredContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  await restoredContext.route('**/127.0.0.1:3001/**', route => route.abort());
  try {
    const restored = await restoredContext.newPage();
    await restored.goto(new URL('/', page.url()).href);
    await restored.getByRole('button', { name: 'Learn French', exact: true }).click();
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await openProfileSection(restored, 'Offline & backups');
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(backupPath);
    await restored.getByRole('checkbox').check();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await expect(restored).toHaveURL(/\/profile\/fr$/);
    await restored.getByRole('button', { name: 'Today', exact: true }).click();
    await guidedLessonButton(restored).click();
    await expect(step(restored, 'Quick practice')).toBeVisible();
    await button(restored, 'Previous section').click();
    await expect(step(restored, 'Dialogue')).toBeVisible();
    await button(restored, 'Useful words').click();
    await expect(button(restored, 'bonjour saved to notebook')).toBeDisabled();
  } finally { await restoredContext.close(); }
});

test('Next retries a failed cursor write without duplicating dialogue study', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next section')).toBeEnabled();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    const attempts: string[] = [];
    Object.assign(window, { courseNavigationAttempts: attempts });
    let fail = true;
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents' && (value as CourseEvent).kind === 'navigation') {
        attempts.push((value as CourseEvent).id);
        if (fail) { fail = false; throw new Error('Simulated cursor failure'); }
      }
      return original.call(this, value, key);
    };
  });
  await button(page, 'Next section').click();
  await expect(coursePanel(page).getByRole('alert')).toContainText('Simulated cursor failure');
  await expect(step(page, 'Dialogue')).toBeVisible();
  await expect(button(page, 'Next section')).toBeDisabled();
  await button(page, 'Retry course save').click();
  await expect(step(page, 'Quick practice')).toBeVisible();
  const ids = await page.evaluate(() => (window as unknown as { courseNavigationAttempts: string[] }).courseNavigationAttempts);
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
  expect((await storedEvents(page)).map(value => value.kind).sort()).toEqual(['navigation', 'study']);
});

test('all compact steps can be browsed at 320 px when progress storage is unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Retry course storage')).toBeVisible();
  await button(page, 'Next section').click();
  await expect(step(page, 'Quick practice')).toBeVisible();
  await button(page, 'Next section').click();
  await expect(step(page, 'Try it')).toBeVisible();
  await expect(button(page, 'Finish lesson')).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the rewritten lesson has fresh progress and preserves historical events and other lesson cursors', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next section')).toBeEnabled();
  const firstHistory = firstDay.blocks.map((block, index): CourseEvent => {
    if (block.kind === 'choice') return { ...courseEvent(firstDay, block.id, 'choice', index), kind: 'choice',
      choiceId: block.answerId, result: 'correct', supported: false };
    return courseEvent(firstDay, block.id, block.kind === 'reflection' ? 'reflection' : 'study', index);
  });
  const oldSecondCursor = secondDay.blocks.find(block => block.kind === 'vocabulary')!;
  const laterPractice = thirdDay.blocks.filter(block => block.kind === 'choice').at(-1)!;
  const olderOpening = [...firstHistory, courseEvent(firstDay, firstDay.blocks.at(-1)!.id, 'completion', 10)]
    .map(event => ({ ...event, courseRevision: 1 }));
  await seedEvents(page, [...olderOpening,
    courseEvent(secondDay, oldSecondCursor.id, 'navigation', 11), courseEvent(thirdDay, laterPractice.id, 'navigation', 12)]);
  await page.goto(`/course/fr/${openCoursePilot.id}`);
  await expect(dayHeading(page, thirdDay)).toBeVisible();
  await expect(step(page, 'Quick practice')).toBeVisible();
  await openCourseOutline(coursePanel(page));
  await chooseDay(page, secondDay).click();
  await expect(step(page, 'Dialogue')).toBeVisible();
  await openCourseOutline(coursePanel(page));
  await expect(chooseDay(page, firstDay)).toHaveAccessibleName('Choose lesson 1: Meet a neighbour');
  await chooseDay(page, firstDay).click();
  await expect(dayHeading(page, firstDay)).toBeVisible();
  await expect(step(page, 'Dialogue')).toBeVisible();
  await expect(step(page, 'Lesson saved')).toHaveCount(0);
  expect(await storedEvents(page)).toEqual(expect.arrayContaining(olderOpening));
});

test('a restored inconsistent choice never shows correct feedback', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next section')).toBeEnabled();
  const block = firstDay.blocks.find(item => item.kind === 'choice')!;
  if (block.kind !== 'choice') throw new Error('Missing practice');
  const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
  await seedEvents(page, [{ ...courseEvent(firstDay, block.id, 'choice', 0), kind: 'choice',
    choiceId: wrong.id, result: 'correct', supported: false }]);
  await page.goto(`/course/fr/${openCoursePilot.id}`);
  await expect(step(page, 'Quick practice')).toBeVisible();
  const question = coursePanel(page).getByTestId(`course-choice-${block.id}`);
  await expect(question.getByText('Please answer again to update your saved choice.', { exact: true })).toBeVisible();
  await expect(question.getByText(/^Correct\./)).toHaveCount(0);
});
