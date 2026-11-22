import { expect, test, type Page } from '@playwright/test';
import { lessons, japaneseLessons, japaneseAlphabetLessons } from '@smartlingo/content';
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
    for (const id of ['lessons', 'explored', 'saved', 'days', 'week']) await expect(page.getByTestId(`report-${id}`)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Topic / })).toHaveCount(0);
    await expectContained(page);
    await next.getByRole('button').click();
    if (language === 'French') {
      const opening = lessons.find(lesson => lesson.id === 'fr.greetings.hello-goodbye')!;
      await expect(page.getByTestId('lesson-step-vocabulary')).toHaveAttribute('aria-current', 'step');
      await expect(page.getByRole('heading', { name: 'Study words', exact: true })).toBeVisible();
      await expect(page.getByTestId(/^lesson-step-/)).toHaveCount(4);
      await expect(page.getByText(opening.vocabulary[0].meaning, { exact: true })).toBeVisible();
      await page.getByRole('button', { name: /Continue to dialogue/ }).click();
      await expect(page.getByTestId('lesson-step-dialogue')).toHaveAttribute('aria-current', 'step');
      await expect(page.getByRole('button', { name: /Try meaning practice/ })).toBeVisible();
    } else {
      const first = japaneseAlphabetLessons[0]!;
      await expect(page.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
      await expect(page.getByText(/Hiragana.*Row 1 of 10.*Step 1 of 2/)).toBeVisible();
      await expect(page.getByTestId(/^kana-row-/)).toHaveCount(0);
      await button(page, 'Try recognising this row').click();
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
    if (language === 'Japanese') await button(page, 'Vocabulary & lessons').click();
    await expect(page.getByRole('button', { name: /^Topic / }).first()).toBeVisible();
    await expectContained(page);
    await openTopic(page, language === 'French' ? 'Restaurant' : japaneseLessons[0]!.topic);
    await expect(button(page, 'All topics')).toBeVisible();
    await button(page, 'All topics').click();
    await expect(page.getByRole('button', { name: /^Topic / }).first()).toBeVisible();
    await expectContained(page);
  });
}
