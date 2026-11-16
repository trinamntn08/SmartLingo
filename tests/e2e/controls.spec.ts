import { test, expect, type Locator } from '@playwright/test';

async function expectStableFocus(button: Locator) {
  await button.scrollIntoViewIfNeeded();
  const before = await button.boundingBox();
  expect(before).not.toBeNull();
  await button.focus();
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('border-color', 'rgb(36, 105, 68)');
  expect(await button.boundingBox()).toEqual(before);
}

test('keyboard focus preserves narrow action geometry and opens the chosen lesson', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  const explore = page.getByRole('button', { name: 'Explore lessons', exact: true });
  await expectStableFocus(explore);
  await explore.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();

  const topic = page.getByRole('button', { name: 'Topic Restaurant', exact: true });
  await topic.scrollIntoViewIfNeeded();
  await topic.click();
  const open = page.getByRole('button', { name: 'Open At the restaurant', exact: true });
  await expectStableFocus(open);
  await open.press('Enter');
  await expect(page.getByRole('button', { name: /Continue to dialogue/ })).toBeEnabled();
});
