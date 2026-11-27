import { expect, test } from '@playwright/test';
import { japaneseAlphabetLessons } from '@smartlingo/content';
import { openKanaFromToday, openProfileSection, openTodayStudyOptions } from '../e2e/learner-journeys';

test.beforeEach(async ({ request, context }) => {
  await request.post('/__test__/mode');
  await context.addInitScript(() => localStorage.setItem('smartlingo.target-language.v1', 'ja-JP'));
});

test('downloaded letters resume saved hiragana and freely browse katakana on a cold offline launch', async ({ page, context, baseURL }) => {
  test.setTimeout(100_000);
  const apiRequests: string[] = [];
  await context.route('**/127.0.0.1:3001/**', route => { apiRequests.push(route.request().url()); return route.abort(); });
  await context.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined }));
  const first = japaneseAlphabetLessons[0]!;
  await page.goto('/'); await openKanaFromToday(page, 'Hiragana', first.title);
  const alphabet = page.getByTestId('japanese-alphabet');
  await alphabet.getByRole('button', { name: 'Recognition practice', exact: true }).click();
  for (const [index, character] of first.characters.entries()) {
    await alphabet.getByRole('button', { name: `Choose ${character.kana}`, exact: true }).click();
    if (index < first.characters.length - 1) await alphabet.getByRole('button', { name: 'Next character', exact: true }).click();
  }
  await alphabet.getByRole('button', { name: 'Mark row studied', exact: true }).click();
  await alphabet.getByRole('button', { name: 'Choose another row', exact: true }).click();
  await expect(alphabet.getByTestId(`kana-row-${japaneseAlphabetLessons[1]!.id}`)).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible({ timeout: 55_000 });
  // Profile may check local voice availability; cold text study needs no API.
  apiRequests.length = 0;
  await context.setOffline(true); await page.close();
  const cold = await context.newPage(); await cold.goto(baseURL!);
  await (await openTodayStudyOptions(cold)).getByRole('link', { name: 'Hiragana', exact: true }).click();
  const second = japaneseAlphabetLessons[1]!;
  await expect(cold.getByTestId(`topic-lesson-${first.id}`).getByText('Completed', { exact: true })).toBeVisible();
  await expect(cold.getByTestId(`topic-lesson-${second.id}`).getByText('Up next', { exact: true })).toBeVisible();
  await cold.getByRole('button', { name: `Open ${second.title}`, exact: true }).click();
  const letters = cold.getByTestId('japanese-alphabet');
  await letters.getByRole('button', { name: 'Choose another row', exact: true }).click();
  await expect(letters.getByRole('combobox')).toHaveCount(0);
  await expect(letters.getByTestId(`kana-row-${japaneseAlphabetLessons[1]!.id}`)).toHaveAttribute('aria-selected', 'true');
  await expect(letters.getByTestId(`kana-row-${first.id}`)).toContainText('Studied');
  await expect(letters.getByTestId(`kana-row-${first.id}`)).not.toContainText('Not studied');
  await expect(letters.getByTestId(`kana-row-${first.id}`)).toHaveAccessibleName(/Explore row.*Studied$/);
  await expect(letters.getByText(`1 of ${japaneseAlphabetLessons.length} rows studied`, { exact: true })).toBeVisible();
  // Visible readings and recognition continue even without a voice or server.
  await expect(letters.getByText(japaneseAlphabetLessons[1]!.characters[0]!.romaji, { exact: true })).toBeVisible();
  await letters.getByRole('button', { name: /Katakana$/ }).click();
  await expect(letters.getByRole('heading', { name: japaneseAlphabetLessons[10]!.title, exact: true })).toBeVisible();
  await letters.getByTestId(`kana-row-${japaneseAlphabetLessons[19]!.id}`).click();
  await expect(letters.getByRole('heading', { name: japaneseAlphabetLessons[19]!.title, exact: true })).toBeVisible();
  await letters.getByRole('button', { name: 'Recognition practice', exact: true }).click();
  await letters.getByRole('button', { name: 'Show reading', exact: true }).click();
  await expect(letters.getByRole('heading', { name: `Which character is “${japaneseAlphabetLessons[19]!.characters[0]!.romaji}”?` })).toBeVisible();
  await letters.getByRole('button', { name: `Choose ${japaneseAlphabetLessons[19]!.characters[0]!.kana}`, exact: true }).click();
  await expect(letters.getByText(/^Yes\./)).toBeVisible();
  const wordTask = first.practice![0]!;
  if (wordTask.mode !== 'choice') throw new Error('The first kana lesson needs a word choice task.');
  await cold.goto(`/learn/ja/letters/${first.id}/words`);
  await expect(letters.getByRole('heading', { name: 'Word recall', exact: true })).toBeVisible();
  await letters.getByTestId(wordTask.id).getByRole('button', { name: wordTask.answer, exact: true }).click();
  await expect(letters.getByText('1 of 2 tasks saved.', { exact: true })).toBeVisible();
  await cold.getByRole('button', { name: 'Lessons', exact: true }).click();
  await expect(cold.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(apiRequests).toEqual([]);
});
