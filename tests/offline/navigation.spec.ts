import { expect, test } from '@playwright/test';
import { openProfileSection } from '../e2e/learner-journeys';

test('a downloaded copy opens bookmarked lesson steps and listening routes in a cold tab', async ({ page, context }) => {
  test.setTimeout(75_000);
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/profile/fr');
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible({ timeout: 30_000 });
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto('/lesson/fr/fr.essentials.repair/dialogue');
  await expect(cold.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await cold.goto('/learn/ja/listening/library');
  await expect(cold.getByRole('heading', { name: 'Japanese listening library', exact: true })).toBeVisible();
  await cold.getByRole('button', { name: 'Back to practice', exact: true }).click();
  await expect(cold.getByRole('button', { name: 'Play sentence', exact: true })).toBeVisible();
  await cold.reload();
  await expect(cold.getByRole('button', { name: 'Play sentence', exact: true })).toBeVisible();
});
