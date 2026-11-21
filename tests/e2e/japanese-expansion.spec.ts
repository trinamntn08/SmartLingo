import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { japaneseLessons } from '@smartlingo/content';
import { groupLessonTopics, type Lesson } from '@smartlingo/domain';
import { buildAcceptedSentence } from './learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const extension = (day: number) => japaneseLessons.find(lesson => lesson.id === `ja.lesson.day-${day}.words-2`)!;

test.beforeEach(async ({ context }) => { await context.route('**/127.0.0.1:3001/**', route => route.abort()); });

test('every Japanese topic exposes thirty distinct supported entries and five shared short lessons', async ({ page }, info) => {
  test.setTimeout(120000);
  await page.goto('/'); await button(page, 'Learn Japanese').click();
  const topics = groupLessonTopics(japaneseLessons);
  for (const topic of topics) {
    await button(page, `Topic ${topic.name}`).click();
    await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
    await expect(page.getByTestId(/^vocabulary-/)).toHaveCount(30);
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(5);
    const entry = topic.lessons.at(-1)!.vocabulary.at(-1)!;
    await page.getByRole('textbox', { name: 'Search lessons', exact: true }).fill(entry.reading!);
    const card = page.getByTestId(`vocabulary-${entry.id}`);
    await expect(card.getByRole('heading', { name: entry.target, exact: true })).toBeVisible();
    await expect(card.getByText(entry.exampleMeaning, { exact: true })).toBeVisible();
    await page.getByRole('textbox', { name: 'Search lessons', exact: true }).fill('');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: info.outputPath('expanded-japanese-topic.png'), fullPage: true });
});

async function complete(page: Page, lesson: Lesson) {
  await button(page, `Topic ${lesson.topic}`).click(); await button(page, `Open ${lesson.subtitle}`).click();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await page.getByRole('button', { name: /Try meaning practice/ }).click();
  const answer = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  await button(page, answer.target).click();
  await page.getByRole('button', { name: /Build a sentence/ }).click();
  await buildAcceptedSentence(page, lesson);
  await page.getByRole('button', { name: /^Continue/ }).click();
  await button(page, 'Finish and save session').click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
}

test('added foundation/A1/A2/B1 lessons complete, save notes and resume without changing original progress', async ({ page }, info) => {
  test.setTimeout(120000);
  await page.goto('/'); await button(page, 'Learn Japanese').click();
  const original = japaneseLessons.find(lesson => lesson.id === 'ja.lesson.day-1')!;
  await button(page, `Topic ${original.topic}`).click(); await button(page, `Open ${original.subtitle}`).click();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  for (const day of [1, 3, 8, 13]) await complete(page, extension(day));
  const lesson = extension(13); const entry = lesson.vocabulary[0];
  await button(page, `Topic ${lesson.topic}`).click();
  await button(page, `Save ${entry.target}`).click();
  await expect(button(page, `Save ${entry.target}`)).toBeDisabled();
  await button(page, 'Review').click();
  const notebook = page.getByTestId('notebook-entries');
  await notebook.getByRole('button', { name: 'Edit note', exact: true }).click();
  await notebook.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My expanded Japanese note');
  await notebook.getByRole('button', { name: 'Save changes', exact: true }).click();
  await button(page, 'Reveal meaning').click(); await button(page, 'Needed help').click();
  await expect(page.getByText(/You’re up to date for today/)).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Revisit your lesson/ }).click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  await button(page, `Topic ${original.topic}`).click(); await button(page, `Open ${original.subtitle}`).click();
  await expect(page.getByRole('heading', { name: 'A small conversation', exact: true })).toBeVisible();
  await button(page, 'Profile').click();
  const download = page.waitForEvent('download'); await button(page, 'Download learning backup').click();
  const file = await download; const path = info.outputPath('expanded-japanese-backup.json'); await file.saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.version).toBe(4);
  expect(backup.notebook).toEqual([expect.objectContaining({ sourceEntryId: entry.id, language: 'ja-JP', reading: entry.reading, exampleReading: entry.exampleReading, meaning: 'My expanded Japanese note' })]);
  expect(backup.events.filter((event: { activity: string }) => event.activity === 'completion')).toHaveLength(4);
  expect(backup.events.filter((event: { lessonId: string }) => event.lessonId === original.id)).toHaveLength(1);
});
