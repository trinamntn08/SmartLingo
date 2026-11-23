import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { japaneseLessons, lessons } from '@smartlingo/content';
import { type Lesson } from '@smartlingo/domain';
import { buildAcceptedSentence, openKeyPhrases, openTopic, openProfileSection } from './learner-journeys';

// Exercise the real first-run homepage; older regressions explicitly select French in config.
test.use({ storageState: { cookies: [], origins: [] } });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
async function choose(page: Page, name: string) {
  // Reload learning navigates; wait for the next app render before choosing a route.
  await expect(button(page, 'Change language').or(button(page, `Learn ${name}`))).toBeVisible();
  if (await button(page, 'Change language').isVisible()) await button(page, 'Change language').click();
  await button(page, `Learn ${name}`).click();
  await expect(button(page, 'Learn')).toBeVisible();
}
async function open(page: Page, lesson: Lesson) {
  await openTopic(page, lesson.topic);
  await button(page, `Open ${lesson.subtitle}`).click();
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('French and Japanese follow the same complete lesson and notebook journey, with independent resume and mixed backup', async ({ page, browser, baseURL }, info) => {
  test.setTimeout(120000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await expect(button(page, 'Today')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('language-home.png'), fullPage: true });
  const pairs: Array<[string, Lesson]> = [['French', lessons[0]], ['Japanese', japaneseLessons[0]]];
  for (const [name, lesson] of pairs) {
    await choose(page, name);
    for (const tab of ['Today', 'Learn', 'Review', 'Report', 'Profile']) await expect(button(page, tab)).toBeVisible();
    await open(page, lesson);
    await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
    await openKeyPhrases(page);
    const word = lesson.vocabulary[0];
    const card = page.getByTestId(`vocabulary-${word.id}`);
    await expect(card.getByRole('heading', { name: word.target, exact: true })).toBeVisible();
    await expect(card.getByText(word.meaning, { exact: true })).toBeVisible();
    await expect(card.getByText(word.exampleMeaning, { exact: true })).toBeVisible();
    await expect(card.getByRole('button', { name: `Listen to ${word.target}`, exact: true })).toBeVisible();
    if (word.reading) await expect(card.getByText(word.reading, { exact: true }).first()).toBeVisible();
    await button(page, `Save ${word.target}`).click();
    await expect(button(page, `Save ${word.target}`)).toBeDisabled();
    await card.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`${name.toLowerCase()}-shared-words.png`), fullPage: true });
    await page.getByRole('button', { name: /Try meaning practice|Try picture practice/ }).click();
    const correct = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
    await button(page, correct.target).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await buildAcceptedSentence(page, lesson);
    await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
    await button(page, 'Review').click();
    const notebook = page.getByTestId('notebook-entries');
    await expect(notebook.getByRole('heading', { name: word.target, exact: true })).toBeVisible();
    await expect(notebook.getByRole('button', { name: 'Edit note', exact: true })).toHaveCount(1);
    await notebook.getByRole('button', { name: 'Edit note', exact: true }).click();
    await notebook.getByRole('textbox', { name: 'English meaning', exact: true }).fill(`My ${name} note`);
    await notebook.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(notebook.getByText(`My ${name} note`, { exact: true })).toBeVisible();
    await button(page, 'Reveal meaning').click();
    await button(page, 'Remembered').click();
    await expect(page.getByText(/You’re up to date for today/)).toBeVisible();
  }
  await page.reload();
  await expect(page.getByTestId('notebook-entries')).toBeVisible();
  await button(page, 'Today').click();
  await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
  await expect(button(page, 'Change language')).toContainText('Japanese');
  await open(page, japaneseLessons[0]);
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  const download = page.waitForEvent('download');
  await button(page, 'Download learning backup').click();
  const saved = await download; const path = info.outputPath('both-languages.json'); await saved.saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.version).toBe(4); expect(backup.notebook).toHaveLength(2); expect(backup.reviewEvents).toHaveLength(2);
  expect(backup.events.filter((event: { activity: string }) => event.activity === 'completion')).toHaveLength(2);
  expect(backup.notebook.find((entry: { language?: string }) => entry.language === 'ja-JP').reading).toBeTruthy();
  const fresh = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  try {
    await fresh.route('**/127.0.0.1:3001/**', route => route.abort());
    const restored = await fresh.newPage(); await restored.goto(baseURL!); await choose(restored, 'Japanese');
    await button(restored, 'Profile').click();
    await openProfileSection(restored, 'Offline & backups');
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(path);
    await restored.getByRole('checkbox').check(); await button(restored, 'Restore backup').click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await button(restored, 'Reload learning').click();
    for (const name of ['Japanese', 'French']) {
      await choose(restored, name); await button(restored, 'Review').click();
      await expect(restored.getByTestId('notebook-entries').getByText(`My ${name} note`, { exact: true })).toBeVisible();
      await expect(restored.getByText(/You’re up to date for today/)).toBeVisible();
    }
  } finally { await fresh.close(); }
  expect(errors).toEqual([]);
});

test('Japanese personal vocabulary, kana search, provider isolation and recoverable rating failure use the shared widgets', async ({ page }) => {
  await page.goto('/'); await choose(page, 'Japanese');
  await button(page, 'Review').click(); await button(page, 'Add personal word').click();
  await page.getByRole('textbox', { name: 'New Japanese word or phrase', exact: true }).fill('鍵');
  await page.getByRole('textbox', { name: 'New English meaning', exact: true }).fill('key');
  await page.getByRole('textbox', { name: 'New kana reading', exact: true }).fill('かぎ');
  await button(page, 'Save personal word').click();
  await expect(page.getByText('Saved 鍵 to your notebook.', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('かき');
  await expect(page.getByTestId('notebook-entries').getByRole('heading', { name: '鍵', exact: true })).toBeHidden();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('かぎ');
  await expect(page.getByTestId('notebook-entries').getByRole('heading', { name: '鍵', exact: true })).toBeVisible();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args: Parameters<IDBObjectStore['add']>) {
      if (this.name === 'reviewEvents') throw new DOMException('Test quota failure', 'QuotaExceededError');
      return original.apply(this, args);
    };
  });
  await button(page, 'Reveal meaning').click(); await button(page, 'Remembered').click();
  await expect(button(page, 'Retry rating save')).toBeVisible();
  await expect(button(page, 'Change language')).toBeDisabled();
  await button(page, 'Dismiss rating save').click();
  await expect(button(page, 'Change language')).toBeEnabled();
  await button(page, 'Learn').click();
  await button(page, 'Speaking').click();
  await expect(page.getByTestId('french-practice')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
  await button(page, 'Listening & videos').click();
  await button(page, 'Browse videos & audio').click();
  await expect(page.getByRole('heading', { name: 'Japanese listening library', exact: true })).toBeVisible();
  await choose(page, 'French'); await button(page, 'Review').click();
  await expect(page.getByTestId('notebook-entries')).toHaveCount(0);
});

test('both languages remain browsable when browser persistence is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined });
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } });
  });
  await page.goto('/');
  for (const [name, lesson] of [['Japanese', japaneseLessons[0]], ['French', lessons[0]]] as const) {
    await choose(page, name); await open(page, lesson);
    await openKeyPhrases(page);
    await expect(page.getByText(/Your language choice is kept for this visit/)).toBeVisible();
    await expect(page.getByTestId(`vocabulary-${lesson.vocabulary[0].id}`)).toBeVisible();
    await expect(button(page, `Save ${lesson.vocabulary[0].target}`)).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
