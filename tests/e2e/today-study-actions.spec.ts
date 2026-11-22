import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

for (const locale of ['fr', 'ja'] as const) {
  test(`${locale} Today prioritises study and keeps saved words in Review`, async ({ page }, info) => {
    if (info.project.name === 'small-screen') await page.setViewportSize({ width: 320, height: 740 });
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    await page.goto(`/today/${locale}`);

    const button = (name: string) => page.getByRole('button', { name, exact: true });
    const recommendation = page.getByTestId('today-next-step').getByRole('button');
    const course = button('Open daily course');
    const vocabulary = button('Vocabulary & lessons');
    await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
    await expect(page.getByText('Open your notebook', { exact: true })).toHaveCount(0);
    await recommendation.focus();
    await page.keyboard.press('Tab');
    await expect(course).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(vocabulary).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await course.click();
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/`));
    await expect(page.getByRole('heading', { name: /^Day 1:/ })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/today/${locale}$`));

    await vocabulary.click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    await button('Today').click();
    await button('Listening & videos').click();
    await expect(page.getByTestId('listening-comprehension')).toBeVisible();
    await button('Today').click();
    await button('Speaking practice').click();
    await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
    await button('Review').click();
    await expect(page).toHaveURL(new RegExp(`/review/${locale}(?:/notebook)?$`));
    await expect(button('Add personal word')).toBeVisible();
  });
}

test('a direct Japanese lesson shows the written pronunciation and an icon-only speaker', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/lesson/ja/ja.lesson.day-1/vocabulary');
  const greeting = page.getByTestId('vocabulary-ja.greetings.konnichiwa');
  await expect(greeting.getByTestId('word-pronunciation')).toHaveText('konnichiwa');
  await expect(greeting.getByRole('button', { name: 'Listen to こんにちは', exact: true })).toHaveText('');
});
