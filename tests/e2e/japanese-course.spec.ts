import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, openCoursePilot } from '@smartlingo/content';
import type { CourseDay, CourseEvent, NotebookEntry } from '@smartlingo/domain';
import { openCourseOutline } from './learner-journeys';

const panel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => panel(page).getByRole('button', { name, exact: true });

async function stored<T>(page: Page, storeName: string) {
  return page.evaluate(async name => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<T[]>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, storeName);
}

async function section(page: Page, day: CourseDay, index: number) {
  await openCourseOutline(panel(page));
  await button(page, `Section ${index + 1}: ${day.blocks[index].title}`).click();
  await expect(panel(page).getByRole('heading', { name: day.blocks[index].title, exact: true })).toBeVisible();
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('Japanese readings, B1 browsing, notebook capture and exact resume stay separate from French', async ({ page }, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const day = japaneseCourse.days.find(item => item.level === 'B1')!;
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await button(page, 'Open daily course').focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Save study section')).toBeEnabled();
  await button(page, 'Authorship and review').click();
  await expect(panel(page).getByText(`Author: ${japaneseCourse.provenance!.author}`, { exact: true })).toBeVisible();
  await expect(panel(page).getByText(`Rights: ${japaneseCourse.provenance!.rights}`, { exact: true })).toBeVisible();
  await expect(panel(page).getByRole('button', { name: /Creative Commons/ })).toHaveCount(0);
  await openCourseOutline(panel(page));
  const days = panel(page).getByTestId('course-day-chooser').getByRole('button', { name: /^Choose day / });
  await expect(days).toHaveCount(11);
  await button(page, 'Show all days').click();
  await expect(days).toHaveCount(japaneseCourse.days.length);
  await button(page, 'Show nearby days').click();
  await expect(days).toHaveCount(11);
  await button(page, 'B1').click();
  await expect(days).toHaveCount(4);
  await button(page, `Choose day ${day.dayNumber}: ${day.title}`).click();
  await expect(panel(page).getByRole('heading', { name: `Day ${day.dayNumber}: ${day.title}`, exact: true })).toBeVisible();
  const study = day.blocks.find(block => block.kind === 'study')!;
  if (study.kind !== 'study') throw new Error('Japanese day requires study.');
  await expect(panel(page).getByText(`Reading: ${study.examples[0].reading}`, { exact: true })).toBeVisible();
  const vocabularyIndex = day.blocks.findIndex(block => block.kind === 'vocabulary');
  await section(page, day, vocabularyIndex);
  const word = day.vocabulary[0];
  const card = panel(page).getByTestId(`vocabulary-${word.id}`);
  await expect(card.getByText(word.reading!, { exact: true })).toBeVisible();
  await expect(card.getByText(word.exampleReading!, { exact: true })).toBeVisible();
  await expect(card.getByText(word.exampleMeaning, { exact: true })).toBeVisible();
  await expect(card.getByRole('button', { name: `Listen to ${word.target}`, exact: true })).toBeVisible();
  await button(page, `Save ${word.target}`).click();
  await expect(panel(page).getByText(`Saved ${word.target} to your notebook.`, { exact: true })).toBeVisible();
  const captured = (await stored<NotebookEntry>(page, 'notebook')).find(entry => entry.sourceEntryId === word.id)!;
  expect(captured).toMatchObject({ language: 'ja-JP', target: word.target, reading: word.reading, exampleReading: word.exampleReading });
  const dialogueIndex = day.blocks.findIndex(block => block.kind === 'dialogue');
  await section(page, day, dialogueIndex);
  const dialogue = day.blocks[dialogueIndex];
  if (dialogue.kind === 'dialogue') await expect(panel(page).getByText(`Reading: ${dialogue.lines[0].reading}`, { exact: true })).toBeVisible();
  const choiceIndex = day.blocks.findIndex(block => block.kind === 'choice');
  const choice = day.blocks[choiceIndex];
  if (choice.kind !== 'choice') throw new Error('Japanese day requires practice.');
  await section(page, day, choiceIndex);
  await button(page, choice.choices.find(item => item.id !== choice.answerId)!.target).click();
  await expect(panel(page).getByText('Not quite — answer saved. Try another option.', { exact: true })).toBeVisible();
  await button(page, 'Show practice hint').click();
  await expect(panel(page).getByText(choice.hint, { exact: true })).toBeVisible();
  await button(page, choice.choices.find(item => item.id === choice.answerId)!.target).click();
  await expect(panel(page).getByText('Correct — answer saved.', { exact: true })).toBeVisible();

  // A newer French event must not move the Japanese cursor on reload.
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  const french = page.getByTestId('open-course-panel');
  await french.getByRole('button', { name: 'Open daily course', exact: true }).click();
  await french.getByRole('button', { name: 'Next section', exact: true }).click();
  await expect(french.getByRole('heading', { name: 'Quick practice', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await page.reload();
  await button(page, 'Open daily course').click();
  await expect(panel(page).getByRole('heading', { name: `Day ${day.dayNumber}: ${day.title}`, exact: true })).toBeVisible();
  await expect(panel(page).getByRole('heading', { name: choice.title, exact: true })).toBeVisible();
  await expect(panel(page).getByText('Saved as practice with support.', { exact: true })).toBeVisible();
  await expect(button(page, 'Complete study day')).toBeDisabled();
  const events = await stored<CourseEvent>(page, 'courseEvents');
  expect(events.filter(event => event.courseId === openCoursePilot.id && event.kind === 'study')).toHaveLength(1);
  expect(events.filter(event => event.courseId === japaneseCourse.id).every(event => event.dayId === day.id)).toBe(true);
  expect(await stored(page, 'events')).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  await section(page, day, vocabularyIndex);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('japanese-course-320.png'), fullPage: true });
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('Japanese → meaning', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.getByRole('button', { name: 'Remembered', exact: true }).click();
  await expect.poll(async () => (await stored(page, 'reviewEvents')).length).toBe(1);
  const notebook = page.getByTestId('notebook-entries');
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill(word.reading!);
  await expect(notebook.getByRole('heading', { name: word.target, exact: true })).toBeVisible();
  await expect(notebook.getByRole('button', { name: `Listen to ${word.target}`, exact: true })).toBeVisible();
  await notebook.getByRole('button', { name: 'Edit note', exact: true }).click();
  await notebook.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My Japanese study note');
  await notebook.getByRole('textbox', { name: 'Kana reading', exact: true }).fill('じぶんのよみ');
  await notebook.getByRole('textbox', { name: 'Example kana reading', exact: true }).fill('れいぶんのよみ');
  await notebook.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('');
  await expect(page.getByText('Changes saved in this browser.', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('じぶんのよみ');
  await expect(notebook.getByText('My Japanese study note', { exact: true })).toBeVisible();
  await expect(page.getByText('Japanese → meaning', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('notebook-entries').getByText('じぶんのよみ', { exact: true })).toBeVisible();
  expect((await stored<NotebookEntry>(page, 'notebook'))[0]).toMatchObject({ language: 'ja-JP', reading: 'じぶんのよみ', exampleReading: 'れいぶんのよみ' });
  expect(await stored(page, 'reviewEvents')).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('Japanese completion is deliberate and next day navigation survives reload', async ({ page }) => {
  test.setTimeout(90000);
  const day = japaneseCourse.days[0];
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await button(page, 'Open daily course').click();
  for (const [index, block] of day.blocks.entries()) {
    await section(page, day, index);
    if (block.kind === 'choice') await button(page, block.choices.find(item => item.id === block.answerId)!.target).click();
    else await button(page, block.kind === 'reflection' ? 'Save manual self-review' : 'Save study section').click();
    await expect(panel(page).getByText('Section saved.', { exact: true })).toBeVisible();
  }
  await expect(panel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toHaveCount(0);
  await button(page, 'Complete study day').click();
  await expect(panel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
  await page.reload();
  await expect(panel(page).getByRole('heading', { name: day.blocks.at(-1)!.title, exact: true })).toBeVisible();
  const next = japaneseCourse.days[1];
  await button(page, `Continue to day ${next.dayNumber}: ${next.title}`).click();
  await expect(panel(page).getByRole('heading', { name: `Day ${next.dayNumber}: ${next.title}`, exact: true })).toBeVisible();
  await expect(panel(page).getByRole('heading', { name: next.blocks[0].title, exact: true })).toBeVisible();
  await page.reload();
  await expect(panel(page).getByRole('heading', { name: `Day ${next.dayNumber}: ${next.title}`, exact: true })).toBeVisible();
  await expect(panel(page).getByRole('heading', { name: next.blocks[0].title, exact: true })).toBeVisible();
  const events = await stored<CourseEvent>(page, 'courseEvents');
  expect(events.filter(event => event.kind === 'completion')).toHaveLength(1);
  expect(events.sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt) || left.id.localeCompare(right.id)).at(-1))
    .toMatchObject({ kind: 'navigation', dayId: next.id, blockId: next.blocks[0].id });
});

test('Japanese days remain readable without browser storage', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await button(page, 'Open daily course').click();
  await expect(button(page, 'Retry course storage')).toBeVisible();
  await openCourseOutline(panel(page));
  await button(page, 'B1').click();
  const day = japaneseCourse.days.at(-1)!;
  await button(page, `Choose day ${day.dayNumber}: ${day.title}`).click();
  await openCourseOutline(panel(page));
  await button(page, 'All course levels').click();
  await expect(panel(page).getByTestId('course-day-chooser').getByRole('button', { name: /^Choose day / }).first())
    .toHaveAccessibleName(/^Choose day 3:/);
  await section(page, day, day.blocks.findIndex(block => block.kind === 'vocabulary'));
  const word = day.vocabulary[0];
  await expect(panel(page).getByText(word.reading!, { exact: true })).toBeVisible();
  await expect(button(page, `Save ${word.target}`)).toBeDisabled();
  await expect(button(page, 'Save study section')).toBeDisabled();
  await expect(button(page, 'Complete study day')).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
