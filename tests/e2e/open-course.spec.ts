import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { courseDayProgressRevision, type CourseDay, type CourseEvent } from '@smartlingo/domain';
import { readFile } from 'node:fs/promises';

const day = openCoursePilot.days[0];
const secondDay = openCoursePilot.days[1];
const coursePanel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => coursePanel(page).getByRole('button', { name, exact: true });

async function storedEvents(page: Page, store: 'courseEvents' | 'events' = 'courseEvents') {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<CourseEvent[]>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, store);
}

async function selectSection(page: Page, index: number, selectedDay = day) {
  await button(page, `Section ${index + 1}: ${selectedDay.blocks[index].title}`).click();
  await expect(coursePanel(page).getByRole('heading', { name: selectedDay.blocks[index].title, exact: true })).toBeVisible();
  await expect(button(page, 'Section 1: ' + selectedDay.blocks[0].title)).toBeEnabled();
}

const chooseDay = (page: Page, selectedDay: CourseDay) => button(page, `Choose day ${selectedDay.dayNumber}: ${selectedDay.title}`);
const dayHeading = (page: Page, selectedDay: CourseDay) => coursePanel(page).getByRole('heading', { name: `Day ${selectedDay.dayNumber}: ${selectedDay.title}`, exact: true });

async function seedEvents(page: Page, events: CourseEvent[]) {
  await page.evaluate(async inputs => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('courseEvents', 'readwrite');
        transaction.oncomplete = () => resolve(); transaction.onabort = () => reject(transaction.error);
        for (const input of inputs) transaction.objectStore('courseEvents').add(input);
      });
    } finally { database.close(); }
  }, events);
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('daily course studies, saves canonical vocabulary, resumes exact practice and completes independently of legacy lessons', async ({ page, browser }, info) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
  await expect(coursePanel(page).getByText('2 study days available · Draft preview', { exact: true })).toBeVisible();
  await button(page, 'Open daily course').focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Save study section')).toBeEnabled();
  await expect(button(page, 'Complete study day')).toBeDisabled();
  await button(page, 'Source credits and licence').click();
  const credits = page.getByTestId('course-source-credits');
  for (const source of openCoursePilot.sources) {
    await expect(credits.getByText(`Creator: ${source.creator}`, { exact: true })).toBeVisible();
    await expect(credits.getByText(source.copyrightNotice, { exact: true })).toBeVisible();
    await expect(credits.getByText(`Changes: ${source.changes}`, { exact: true })).toBeVisible();
    for (const asset of source.excludedAssets) await expect(credits.getByText(`• ${asset}`, { exact: true })).toBeVisible();
  }
  await expect(credits.getByRole('button', { name: 'Creative Commons Attribution 4.0 (CC BY 4.0)', exact: true })).toBeVisible();
  await button(page, 'Hide source credits').click();
  const first = day.blocks[0];
  if (first.kind === 'study') await expect(coursePanel(page).getByText(first.examples[0].meaning, { exact: true })).toBeVisible();
  await button(page, 'Save study section').click();
  await expect(button(page, 'Next section')).toBeEnabled();
  await button(page, 'Next section').click();
  const vocabularyIndex = day.blocks.findIndex(block => block.kind === 'vocabulary');
  const vocabulary = day.vocabulary.find(word => word.target === 'bonjour')!;
  await expect(page.getByTestId(`vocabulary-${vocabulary.id}`).getByText(vocabulary.exampleMeaning, { exact: true })).toBeVisible();
  await button(page, 'Save bonjour').click();
  await expect(coursePanel(page).getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(coursePanel(page).getByRole('heading', { name: day.blocks[vocabularyIndex].title, exact: true })).toBeVisible();
  await expect(button(page, 'Save bonjour')).toBeDisabled();

  for (let index = 0; index < day.blocks.length; index++) {
    const block = day.blocks[index];
    await selectSection(page, index);
    if (block.kind === 'choice') {
      if (index === day.blocks.findIndex(item => item.kind === 'choice')) {
        const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
        await button(page, wrong.target).click();
        await expect(coursePanel(page).getByText('Not quite — answer saved. Try another option.', { exact: true })).toBeVisible();
        await button(page, 'Show practice hint').click();
        await expect(coursePanel(page).getByText(block.hint, { exact: true })).toBeVisible();
        await expect(button(page, wrong.target)).toBeEnabled();
      }
      const correct = block.choices.find(choice => choice.id === block.answerId)!;
      await button(page, correct.target).click();
      await expect(coursePanel(page).getByText('Correct — answer saved.', { exact: true })).toBeVisible();
      await page.reload();
      await button(page, 'Open daily course').click();
      await expect(coursePanel(page).getByRole('heading', { name: block.title, exact: true })).toBeVisible();
      await expect(coursePanel(page).getByText('Correct — answer saved.', { exact: true })).toBeVisible();
    } else if (block.kind === 'reflection') {
      await expect(coursePanel(page).getByText(block.modelTarget, { exact: true })).toHaveCount(0);
      await button(page, 'Read model exchange').click();
      await expect(coursePanel(page).getByText(block.modelMeaning, { exact: true })).toBeVisible();
      await expect(button(page, 'Save manual self-review')).toBeEnabled();
      await button(page, 'Save manual self-review').click();
    } else if (index !== 0) {
      await button(page, 'Save study section').click();
    }
    await expect(coursePanel(page).getByText('Section saved.', { exact: true })).toBeVisible();
  }
  await expect(button(page, 'Complete study day')).toBeEnabled();
  await button(page, 'Complete study day').click();
  await expect(coursePanel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(coursePanel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
  await expect(dayHeading(page, day)).toBeVisible();
  await button(page, `Continue to day 2: ${secondDay.title}`).click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(coursePanel(page).getByText('0 of 7 sections saved', { exact: true })).toBeVisible();
  await button(page, 'Save study section').click();
  await selectSection(page, 2, secondDay);
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(coursePanel(page).getByRole('heading', { name: secondDay.blocks[2].title, exact: true })).toBeVisible();
  await chooseDay(page, day).focus();
  await page.keyboard.press('Enter');
  await expect(dayHeading(page, day)).toBeVisible();
  await expect(coursePanel(page).getByRole('heading', { name: day.blocks.at(-1)!.title, exact: true })).toBeVisible();
  await expect(page.getByTestId(`course-day-${day.id}`).getByText('Study day saved', { exact: true })).toBeVisible();
  await expect(page.getByTestId(`course-day-${secondDay.id}`).getByText('1 of 7 sections saved', { exact: true })).toBeVisible();
  const events = await storedEvents(page);
  expect(events.some(event => event.kind === 'choice' && event.result === 'incorrect')).toBe(true);
  expect(events.some(event => event.kind === 'choice' && event.result === 'correct' && event.supported)).toBe(true);
  expect(events.some(event => event.kind === 'support')).toBe(true);
  expect(events.some(event => event.kind === 'navigation')).toBe(true);
  for (const selectedDay of openCoursePilot.days) {
    const scoped = events.filter(event => event.dayId === selectedDay.id);
    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.every(event => event.courseRevision === courseDayProgressRevision(openCoursePilot, selectedDay))).toBe(true);
  }
  expect(await storedEvents(page, 'events')).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  await selectSection(page, vocabularyIndex);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('open-course-320.png'), fullPage: true });
  await chooseDay(page, secondDay).click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  expect(await coursePanel(page).locator('*').evaluateAll(elements => elements.every(element => {
    const bounds = element.getBoundingClientRect();
    return !bounds.width || (bounds.left >= -1 && bounds.right <= innerWidth + 1);
  }))).toBe(true);
  await page.screenshot({ path: info.outputPath('open-course-day-two-320.png'), fullPage: true });
  await chooseDay(page, day).click();
  expect(errors).toEqual([]);

  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const backupPath = info.outputPath('course-learning-backup.json');
  await (await download).saveAs(backupPath);
  const backup = JSON.parse(await readFile(backupPath, 'utf8'));
  expect(backup.version).toBe(4);
  expect(backup.courseEvents).toHaveLength((await storedEvents(page)).length);
  expect(backup.events).toEqual([]);
  const restoredContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  await restoredContext.route('**/127.0.0.1:3001/**', route => route.abort());
  try {
    const restored = await restoredContext.newPage();
    await restored.goto(new URL('/', page.url()).href);
    await restored.getByRole('button', { name: 'Learn French', exact: true }).click();
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(backupPath);
    await restored.getByRole('checkbox').check();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await button(restored, 'Open daily course').click();
    await expect(coursePanel(restored).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
    await expect(button(restored, 'Save bonjour')).toBeDisabled();
    expect(await storedEvents(restored)).toHaveLength(backup.courseEvents.length);
    await chooseDay(restored, secondDay).click();
    await expect(dayHeading(restored, secondDay)).toBeVisible();
    await expect(coursePanel(restored).getByRole('heading', { name: secondDay.blocks[2].title, exact: true })).toBeVisible();
    await expect(restored.getByTestId(`course-day-${secondDay.id}`).getByText('1 of 7 sections saved', { exact: true })).toBeVisible();
  } finally { await restoredContext.close(); }
});

test('course save failure keeps the same event for retry and never shows unsaved completion', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Save study section')).toBeEnabled();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    const ids: string[] = [];
    Object.assign(window, { courseAttemptIds: ids });
    let fail = true;
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents') {
        ids.push((value as CourseEvent).id);
        if (fail) { fail = false; throw new Error('Simulated course save failure'); }
      }
      return original.call(this, value, key);
    };
  });
  await button(page, 'Save study section').click();
  await expect(coursePanel(page).getByRole('alert')).toContainText('Simulated course save failure');
  await expect(coursePanel(page).getByText('Section saved.', { exact: true })).toHaveCount(0);
  await expect(button(page, 'Next section')).toBeDisabled();
  await button(page, 'Retry course save').click();
  await expect(coursePanel(page).getByText('Section saved.', { exact: true })).toBeVisible();
  const ids = await page.evaluate(() => (window as unknown as { courseAttemptIds: string[] }).courseAttemptIds);
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
  expect((await storedEvents(page)).filter(event => event.kind === 'study')).toHaveLength(1);
});

test('course material remains browsable at 320px when browser storage is unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Retry course storage')).toBeVisible();
  await expect(button(page, 'Save study section')).toBeDisabled();
  for (const selectedDay of openCoursePilot.days) {
    await chooseDay(page, selectedDay).click();
    for (let index = 0; index < selectedDay.blocks.length; index++) await selectSection(page, index, selectedDay);
    await button(page, 'Read model exchange').click();
    const reflection = selectedDay.blocks.at(-1)!;
    if (reflection.kind === 'reflection') await expect(coursePanel(page).getByText(reflection.modelMeaning, { exact: true })).toBeVisible();
  }
  await expect(button(page, 'Complete study day')).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('day switching waits for a saved navigation, retries the same event and supports discard', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(chooseDay(page, secondDay)).toBeEnabled();
  await selectSection(page, 1);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    Object.assign(window, { courseAttemptIds: [] as string[], failCourseNavigation: true });
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents') {
        const state = window as unknown as { courseAttemptIds: string[]; failCourseNavigation: boolean };
        state.courseAttemptIds.push((value as CourseEvent).id);
        if (state.failCourseNavigation) throw new Error('Navigation storage unavailable');
      }
      return original.call(this, value, key);
    };
  });
  await chooseDay(page, secondDay).click();
  await expect(coursePanel(page).getByRole('alert')).toContainText('Navigation storage unavailable');
  await expect(dayHeading(page, day)).toBeVisible();
  await expect(chooseDay(page, secondDay)).toBeDisabled();
  await expect(button(page, `Section 1: ${day.blocks[0].title}`)).toBeDisabled();
  await button(page, 'Discard unsaved course action').click();
  await expect(dayHeading(page, day)).toBeVisible();
  await expect(chooseDay(page, secondDay)).toBeEnabled();
  await chooseDay(page, secondDay).click();
  await expect(coursePanel(page).getByRole('alert')).toContainText('Navigation storage unavailable');
  await page.evaluate(() => { Object.assign(window, { failCourseNavigation: false }); });
  await button(page, 'Retry course save').click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  const ids = await page.evaluate(() => (window as unknown as { courseAttemptIds: string[] }).courseAttemptIds);
  expect(ids).toHaveLength(3);
  expect(ids[1]).toBe(ids[2]);
  expect(ids[0]).not.toBe(ids[1]);
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await chooseDay(page, day).click();
  await expect(coursePanel(page).getByRole('heading', { name: day.blocks[1].title, exact: true })).toBeVisible();
});

test('revision-one completed history survives the release and final completion stays on its day', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Save study section')).toBeEnabled();
  let timestamp = Date.parse('2026-11-01T12:00:00Z');
  const makeEvent = (selectedDay: CourseDay, blockId: string, kind: CourseEvent['kind']): CourseEvent => ({
    id: crypto.randomUUID(), courseId: openCoursePilot.id,
    courseRevision: courseDayProgressRevision(openCoursePilot, selectedDay), dayId: selectedDay.id,
    blockId, occurredAt: new Date(timestamp++).toISOString(), kind,
  } as CourseEvent);
  const events = openCoursePilot.days.flatMap(selectedDay => selectedDay.blocks.map(block => {
    if (block.kind === 'choice') return { ...makeEvent(selectedDay, block.id, 'choice'), kind: 'choice' as const,
      choiceId: block.answerId, result: 'correct' as const, supported: false };
    return makeEvent(selectedDay, block.id, block.kind === 'reflection' ? 'reflection' : 'study');
  }));
  events.push(makeEvent(day, day.blocks.at(-1)!.id, 'completion'));
  // Newer events outside the immutable day scope must never steal the resume cursor.
  events.push({ ...makeEvent(secondDay, secondDay.blocks[0].id, 'navigation'), courseRevision: 1 });
  events.push({ ...makeEvent(secondDay, 'fr.unknown-block', 'navigation') });
  events.push({ ...makeEvent(secondDay, secondDay.blocks[0].id, 'navigation'), dayId: 'fr.unknown-day' });
  events.push({ ...makeEvent(secondDay, secondDay.blocks[0].id, 'navigation'), courseId: 'fr.other-course' });
  await seedEvents(page, events);
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(dayHeading(page, day)).toBeVisible();
  await expect(coursePanel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
  await expect(coursePanel(page).getByRole('heading', { name: day.blocks.at(-1)!.title, exact: true })).toBeVisible();
  await button(page, `Continue to day 2: ${secondDay.title}`).click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(button(page, 'Complete study day')).toBeEnabled();
  await button(page, 'Complete study day').click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(coursePanel(page).getByText('You have finished all available draft days. Revisit either day or explore another topic whenever you like.', { exact: true })).toBeVisible();
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await chooseDay(page, day).click();
  await expect(coursePanel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
});

test('restored inconsistent answers never display correct feedback or complete a section', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Save study section')).toBeEnabled();
  const index = day.blocks.findIndex(block => block.kind === 'choice');
  const block = day.blocks[index];
  if (block.kind !== 'choice') throw new Error('The pilot needs choice practice.');
  const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
  const event: CourseEvent = { id: crypto.randomUUID(), courseId: openCoursePilot.id, courseRevision: courseDayProgressRevision(openCoursePilot, day),
    dayId: day.id, blockId: block.id, occurredAt: new Date().toISOString(), kind: 'choice', choiceId: wrong.id, result: 'correct', supported: false };
  await seedEvents(page, [event]);
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(coursePanel(page).getByRole('heading', { name: block.title, exact: true })).toBeVisible();
  await expect(coursePanel(page).getByText('This saved answer does not match the current activity. Please answer again.', { exact: true })).toBeVisible();
  await expect(coursePanel(page).getByText('Correct — answer saved.', { exact: true })).toHaveCount(0);
  await expect(coursePanel(page).getByText('Section saved.', { exact: true })).toHaveCount(0);
  await expect(button(page, 'Complete study day')).toBeDisabled();
  await button(page, block.choices.find(choice => choice.id === block.answerId)!.target).click();
  await expect(coursePanel(page).getByText('Correct — answer saved.', { exact: true })).toBeVisible();
});
