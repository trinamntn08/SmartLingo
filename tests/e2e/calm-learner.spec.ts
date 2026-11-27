import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot, japaneseLessons, japaneseAlphabetLessons } from '@smartlingo/content';
import { openTopic } from './learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

async function expectContained(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const language of ['French', 'Japanese'] as const) {
  test(`${language} has one direct next step, focused destinations and readable session progress`, async ({ page }, info) => {
    if (info.project.name === 'small-screen') await page.setViewportSize({ width: 320, height: 740 });
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    await page.goto('/');
    await expect(page.getByTestId('language-chooser')).toBeVisible();
    await expectContained(page);
    await button(page, `Learn ${language}`).click();
    const next = page.getByTestId('today-next-step');
    await expect(next.getByRole('button')).toHaveCount(1);
    await expect(next.getByRole('button')).toBeInViewport();
    for (const id of ['lessons', 'explored', 'saved', 'days', 'week']) await expect(page.getByTestId(`report-${id}`)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Topic / })).toHaveCount(0);
    await expectContained(page);
    await next.getByRole('button').click();
    if (language === 'French') {
      const opening = openCoursePilot.days[0];
      await expect(page.getByRole('heading', { name: `Lesson 1: ${opening.title}`, exact: true })).toBeVisible();
      await expect(page.getByText('Step 1 of 5', { exact: true })).toBeVisible();
      await expect(page.getByTestId('dialogue-french-transcript').locator('[lang="fr-FR"]').first()).toBeInViewport();
      await expect(page.getByTestId('dialogue-english-transcript')).toBeVisible();
      await button(page, 'Continue to key phrases').click();
      await expect(page.getByText('Step 2 of 5', { exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
    } else {
      const first = japaneseAlphabetLessons[0]!;
      await expect(page.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
      await expect(page.getByText(/Hiragana.*Row 1 of 10.*Step 1 of 2/)).toBeVisible();
      await expect(page.getByTestId(/^kana-row-/)).toHaveCount(0);
      await button(page, 'Recognition practice').click();
      await expect(page.getByText(/Hiragana.*Row 1 of 10.*Step 2 of 2/)).toBeVisible();
      await expect(button(page, 'Mark row studied')).toBeDisabled();
    }
    await expectContained(page);
    for (const destination of ['Today', 'Review', 'Profile']) {
      await button(page, destination).click();
      await expect(page.getByTestId('topic-navigation')).toHaveCount(0);
      await expect(page.getByRole('button', { name: /^Topic / })).toHaveCount(0);
      await expectContained(page);
    }
    await button(page, 'Learn').click();
    if (language === 'Japanese') await button(page, 'Lessons').click();
    await expect(page.getByRole('button', { name: /^Topic / }).first()).toBeVisible();
    await expectContained(page);
    await openTopic(page, language === 'French' ? 'Restaurant' : japaneseLessons[0]!.topic);
    await expect(button(page, 'All topics')).toBeVisible();
    await button(page, 'All topics').click();
    await expect(page.getByRole('button', { name: /^Topic / }).first()).toBeVisible();
    await expectContained(page);
  });
}
