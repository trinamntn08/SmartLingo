import { expect, test, type Page } from '@playwright/test';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

test('French slang is searchable, keeps its history and saves expressions to the notebook', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  const narrow = info.project.name === 'small-screen';
  if (narrow) await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/today/fr');
  const navigation = page.getByRole('navigation', { name: 'Learning navigation' });
  await expect(navigation.getByRole('button')).toHaveText(narrow
    ? ['Today', 'Learn', 'Review', 'Report', 'Profile'] : ['Today', 'Learn', 'Slang', 'Review', 'Report', 'Profile']);
  if (narrow) {
    for (const control of await navigation.getByRole('button').all()) {
      const bounds = await control.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
  } else {
    const language = button(page, 'Change language');
    await page.setViewportSize({ width: 1050, height: 1000 });
    await expect.poll(async () => (await navigation.boundingBox())!.y - (await language.boundingBox())!.y).toBeGreaterThan(500);
    await page.setViewportSize({ width: 1100, height: 1000 });
    await expect.poll(async () => Math.abs((await navigation.boundingBox())!.y - (await language.boundingBox())!.y)).toBeLessThan(15);
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  if (narrow) await button(page, 'Learn').click();
  await button(page, 'Slang').click();
  await expect(page).toHaveURL(/\/slang\/fr$/);
  await expect(button(page, narrow ? 'Learn' : 'Slang')).toHaveAttribute('aria-current', 'page');
  const title = page.getByRole('heading', { name: 'Everyday French & slang' });
  await expect(title).toBeVisible();
  const intro = page.getByTestId('slang-intro');
  const firstPhoto = intro.locator('img');
  await firstPhoto.evaluate(image => (image as HTMLImageElement).decode());
  if (narrow) expect((await title.boundingBox())!.y).toBeLessThan((await firstPhoto.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('slang-catalogue.png') });

  const cards = page.getByTestId(/^expression-fr\.slang\./);
  await expect(cards).toHaveCount(12);
  await button(page, 'Show more expressions').click();
  await expect(cards).toHaveCount(24);
  const search = page.getByRole('textbox', { name: 'Search slang' });
  await search.fill('ca marche');
  await expect(cards.first().getByRole('heading', { name: /ça marche/i })).toBeVisible();
  await search.fill('no-such-expression');
  await expect(page.getByRole('heading', { name: 'No expressions found' })).toBeVisible();
  await button(page, 'Reset search and category').click();

  await button(page, 'Verlan').click();
  await expect(button(page, 'Verlan')).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'All expressions')).toHaveAttribute('aria-pressed', 'false');
  await search.fill('relou');
  const card = cards.filter({ has: page.getByRole('heading', { name: /relou/i }) }).first();
  const target = (await card.getByRole('heading').textContent())!;
  await expect(card.getByRole('heading')).toHaveAttribute('lang', 'fr-FR');
  await expect(card.getByRole('button', { name: `Listen to ${target}`, exact: true })).toBeVisible();
  await card.getByRole('button', { name: `Save ${target}`, exact: true }).click();
  await expect(card.getByRole('button', { name: '✓ In notebook' })).toBeDisabled();
  await button(page, 'Calls & messages').click();
  await search.fill('tkt');
  await expect(cards.first().getByText('Text shorthand')).toBeVisible();
  await expect(button(page, 'Listen to tkt')).toHaveCount(0);
  await button(page, 'Save tkt').click();
  await expect(cards.first().getByRole('button', { name: '✓ In notebook' })).toBeDisabled();

  await button(page, 'Review').click();
  const notebook = page.getByTestId('notebook-entries');
  await expect(notebook.getByRole('heading', { name: target, exact: true })).toBeVisible();
  await expect(notebook.getByText('Text shorthand')).toBeVisible();
  await expect(button(page, 'Listen to tkt')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/slang\/fr$/);
  await expect(search).toHaveValue('tkt');
  await expect(button(page, 'Calls & messages')).toHaveAttribute('aria-pressed', 'true');
  await page.goForward();
  await expect(notebook.getByRole('heading', { name: 'tkt', exact: true })).toBeVisible();
  await page.reload();
  await expect(notebook.getByRole('heading', { name: 'tkt', exact: true })).toBeVisible();
});

test('the direct slang URL works and the Japanese navigation keeps its existing destinations', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/slang/fr');
  await expect(page.getByRole('heading', { name: 'Everyday French & slang' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Everyday French & slang' })).toBeVisible();
  await page.goto('/today/ja');
  const navigation = page.getByRole('navigation', { name: 'Learning navigation' });
  await expect(navigation.getByRole('button')).toHaveText(['Today', 'Learn', 'Review', 'Report', 'Profile']);
  await page.getByTestId('today-next-step').getByRole('button').click();
  await expect(page.getByText(/Hiragana.*Row 1 of 10.*Step 1 of 2/)).toBeVisible();
});
