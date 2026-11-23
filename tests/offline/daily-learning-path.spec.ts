import { expect, test } from '@playwright/test';
import { guidedLessonButton, openProfileSection } from '../e2e/learner-journeys';

test('a downloaded course opens related practice and returns to the exact study section offline', async ({ request, page, context, baseURL }) => {
  await request.post('/__test__/mode');
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();

  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  const button = (name: string) => cold.getByRole('button', { name, exact: true });
  await button('Learn').click();
  await guidedLessonButton(cold).click();
  await button('Next section').click();
  await button('Skip practice').click();
  const related = cold.getByTestId('daily-related-practice');
  await expect(related).toBeVisible();
  const reflectionUrl = cold.url();
  await related.getByRole('button', { name: 'Say hello and goodbye', exact: true }).click();
  await expect(cold).toHaveURL(/\/dialogue\?course=/);
  await cold.reload();
  await button('Back to guided lesson').click();
  await expect(cold).toHaveURL(reflectionUrl);
  await expect(cold.getByRole('heading', { name: 'Try it', exact: true })).toBeVisible();
});
