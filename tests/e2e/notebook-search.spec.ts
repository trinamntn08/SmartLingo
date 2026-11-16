import { test, expect } from '@playwright/test';

test('notebook search handles accents, English and examples while preserving a hidden unsaved edit', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  const form = page.getByTestId('personal-word-form');
  for (const [target, meaning, example] of [
    ['à tout à l’heure', 'see you later today', 'Après le déjeuner.'],
    ['un rendez-vous', 'an appointment', 'Mon rendez-vous est demain.'],
  ]) {
    await form.getByRole('button', { name: 'Add personal word', exact: true }).click();
    await form.getByRole('textbox', { name: 'New French word or phrase', exact: true }).fill(target);
    await form.getByRole('textbox', { name: 'New English meaning', exact: true }).fill(meaning);
    await form.getByRole('textbox', { name: 'New example or personal note', exact: true }).fill(example);
    await form.getByRole('button', { name: 'Save personal word', exact: true }).click();
    await expect(form.getByText(`Saved ${target} to your notebook.`, { exact: true })).toBeVisible();
  }
  const search = page.getByRole('textbox', { name: 'Search notebook', exact: true });
  const entries = page.getByTestId('notebook-entries');
  await search.fill('a tout');
  await expect(entries.getByRole('heading', { name: 'à tout à l’heure', exact: true })).toBeVisible();
  await expect(entries.getByRole('heading', { name: 'un rendez-vous', exact: true })).toBeHidden();
  await expect(page.getByText('1 of 2 saved entries', { exact: true })).toBeVisible();
  await search.fill('APPOINTMENT');
  await expect(entries.getByRole('heading', { name: 'un rendez-vous', exact: true })).toBeVisible();
  await expect(entries.getByRole('heading', { name: 'à tout à l’heure', exact: true })).toBeHidden();
  await search.fill('dejeuner');
  await entries.getByRole('button', { name: 'Edit note', exact: true }).click();
  await entries.getByRole('textbox', { name: 'English meaning', exact: true }).fill('Keep this unsaved edit');
  await search.fill('no-match-here');
  await expect(page.getByText('No saved words match. Try a different word or clear the search.', { exact: true })).toBeVisible();
  await expect(entries.getByRole('textbox', { name: 'English meaning', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Clear notebook search', exact: true }).click();
  await expect(entries.getByRole('textbox', { name: 'English meaning', exact: true })).toHaveValue('Keep this unsaved edit');
  await entries.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(entries.getByText('Changes saved in this browser.', { exact: true })).toBeVisible();
  await search.fill('keep this');
  await expect(entries.getByRole('heading', { name: 'à tout à l’heure', exact: true })).toBeVisible();
  await search.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('notebook-search.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('2 of 2 saved entries', { exact: true })).toBeVisible();
  await expect(page.getByTestId('notebook-entries').getByText('Keep this unsaved edit', { exact: true })).toBeVisible();
});
