import { expect, test, type Page } from '@playwright/test';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

test('slang browsing, filtering and notebook saving work at both viewport sizes', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  if (info.project.name === 'small-screen') await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await button(page, 'Slang').click();
  const title = page.getByRole('heading', { name: 'Everyday French & slang' });
  await expect(title).toBeVisible();
  const intro = page.getByTestId('slang-intro');
  const [titleBox, introBox, photoBox] = await Promise.all([title.boundingBox(), intro.boundingBox(), intro.locator('img').boundingBox()]);
  expect(titleBox!.y).toBeGreaterThanOrEqual(introBox!.y);
  if (info.project.name === 'small-screen') expect(titleBox!.y + titleBox!.height).toBeLessThan(photoBox!.y);
  await expect(page.getByTestId('topic-navigation')).toHaveCount(0);
  const cards = page.getByTestId(/^expression-fr\.slang\./);
  await expect(cards).toHaveCount(12);
  const firstPhoto = cards.first().locator('img').first();
  await expect(firstPhoto).toHaveAttribute('src', /\/slang-photos\//);
  await expect.poll(() => firstPhoto.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (info.project.name === 'small-screen') expect(await page.evaluate(() => innerWidth)).toBe(320);
  await page.screenshot({ path: info.outputPath('slang-catalogue.png') });

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
  await page.reload();
  await button(page, 'Review').click();
  await expect(page.getByText(target, { exact: true }).first()).toBeVisible();
  const notebook = page.getByTestId('notebook-entries');
  await expect(notebook.getByText('Text shorthand')).toBeVisible();
  await expect(button(page, 'Listen to tkt')).toHaveCount(0);
});
