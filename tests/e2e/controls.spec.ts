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
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Tab');
  const skipNavigation = page.getByRole('button', { name: 'Skip to navigation' });
  await expect(skipNavigation).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Today', exact: true })).toBeFocused();
  const explore = page.getByRole('button', { name: 'Explore all topics', exact: true });
  await expectStableFocus(explore);
  await explore.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();

  const topicToggle = page.getByRole('button', { name: 'Browse course topics' });
  await topicToggle.press('Enter');
  await expect(topicToggle).toHaveAttribute('aria-expanded', 'true');
  await topicToggle.press('Escape');
  await expect(topicToggle).toBeFocused();
  await expect(topicToggle).toHaveAttribute('aria-expanded', 'false');
  await topicToggle.press('Enter');
  const topic = page.getByRole('button', { name: 'Topic Restaurant', exact: true });
  await topic.scrollIntoViewIfNeeded();
  await topic.click();
  await page.getByRole('button', { name: 'Jump to short lessons' }).press('Enter');
  const lessons = page.getByRole('heading', { name: 'Short lessons', exact: true });
  await expect(lessons).toBeFocused();
  await expect(lessons).toBeInViewport();
  const open = page.getByRole('button', { name: 'Open At the restaurant', exact: true });
  await expectStableFocus(open);
  await open.press('Enter');
  const next = page.getByRole('button', { name: /Continue to dialogue/ });
  await expect(next).toBeEnabled();
  await next.scrollIntoViewIfNeeded();
  await next.press('Enter');
  const dialogue = page.getByRole('heading', { name: 'A small conversation', exact: true });
  await expect(dialogue).toBeFocused();
  await expect(dialogue).toBeInViewport();
});
