import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import type { CourseEvent } from '@smartlingo/domain';
import { readFile } from 'node:fs/promises';

const day = openCoursePilot.days[0];
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

async function selectSection(page: Page, index: number) {
  await button(page, `Section ${index + 1}: ${day.blocks[index].title}`).click();
  await expect(coursePanel(page).getByRole('heading', { name: day.blocks[index].title, exact: true })).toBeVisible();
  await expect(button(page, 'Section 1: ' + day.blocks[0].title)).toBeEnabled();
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
  await expect(coursePanel(page).getByText('1 study day available · Draft preview', { exact: true })).toBeVisible();
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
  const events = await storedEvents(page);
  expect(events.some(event => event.kind === 'choice' && event.result === 'incorrect')).toBe(true);
  expect(events.some(event => event.kind === 'choice' && event.result === 'correct' && event.supported)).toBe(true);
  expect(events.some(event => event.kind === 'support')).toBe(true);
  expect(events.some(event => event.kind === 'navigation')).toBe(true);
  expect(await storedEvents(page, 'events')).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  await selectSection(page, vocabularyIndex);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('open-course-320.png'), fullPage: true });
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
  const restoredContext = await browser.newContext();
  await restoredContext.route('**/127.0.0.1:3001/**', route => route.abort());
  try {
    const restored = await restoredContext.newPage();
    await restored.goto(new URL('/', page.url()).href);
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
  for (let index = 0; index < day.blocks.length; index++) await selectSection(page, index);
  await button(page, 'Read model exchange').click();
  const reflection = day.blocks.at(-1)!;
  if (reflection.kind === 'reflection') await expect(coursePanel(page).getByText(reflection.modelMeaning, { exact: true })).toBeVisible();
  await expect(button(page, 'Complete study day')).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('restored inconsistent answers never display correct feedback or complete a section', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Save study section')).toBeEnabled();
  const index = day.blocks.findIndex(block => block.kind === 'choice');
  const block = day.blocks[index];
  if (block.kind !== 'choice') throw new Error('The pilot needs choice practice.');
  const wrong = block.choices.find(choice => choice.id !== block.answerId)!;
  const event: CourseEvent = { id: crypto.randomUUID(), courseId: openCoursePilot.id, courseRevision: openCoursePilot.revision,
    dayId: day.id, blockId: block.id, occurredAt: new Date().toISOString(), kind: 'choice', choiceId: wrong.id, result: 'correct', supported: false };
  await page.evaluate(async input => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('courseEvents', 'readwrite');
        transaction.oncomplete = () => resolve(); transaction.onabort = () => reject(transaction.error);
        transaction.objectStore('courseEvents').add(input);
      });
    } finally { database.close(); }
  }, event);
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
