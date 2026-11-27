import { expect, test, type Page } from '@playwright/test';
import { frenchCourses, japaneseCourse, japaneseAlphabetLessons, lessons, japaneseLessons } from '@smartlingo/content';
import { groupLessonTopics } from '@smartlingo/domain';
import { openCourseOutline, openTodayStudyOptions } from './learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const nextStep = (page: Page) => page.getByTestId('today-next-step');
const studyNav = (page: Page) => page.getByRole('navigation', { name: 'Study options', exact: true });

for (const locale of ['fr', 'ja'] as const) {
  test(`${locale} Today prioritises study and keeps saved words in Review`, async ({ page }, info) => {
    const compact = info.project.name === 'small-screen';
    if (compact) await page.setViewportSize({ width: 320, height: 740 });
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    await page.goto('/');

    const french = locale === 'fr';
    await button(page, french ? 'Learn French' : 'Learn Japanese').click();
    const recommendation = nextStep(page).getByRole('button');
    const options = studyNav(page);
    const disclosure = button(page, 'Browse study options');
    const titles = (french ? frenchCourses : [japaneseCourse]).map(course => course.title);
    const suggestedTopics = groupLessonTopics(french ? lessons : japaneseLessons).slice(0, 3).map(topic => topic.name);
    const course = options.getByRole('link', { name: titles[0], exact: true });
    const library = options.getByRole('link', { name: 'Browse all lessons', exact: true });

    await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
    await expect(nextStep(page).getByRole('img')).toHaveCount(0);
    await expect(recommendation).toHaveCount(1);
    await expect(recommendation).toBeInViewport();
    await expect(recommendation).toHaveAccessibleName(french ? 'Start lesson' : 'Start Hiragana');
    await recommendation.focus();
    await page.keyboard.press('Tab');

    if (compact) {
      await expect(options).toHaveCount(0);
      await expect(disclosure).toBeFocused();
      await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press('Enter');
      await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
      await expect(options).toBeVisible();
      await page.keyboard.press('Tab');
    } else {
      await expect(disclosure).toHaveCount(0);
      await expect(options).toBeVisible();
      const sidebar = (await options.boundingBox())!;
      const activity = (await nextStep(page).boundingBox())!;
      expect(sidebar.x + sidebar.width).toBeLessThan(activity.x);
    }
    await expect(course).toBeFocused();
    await expect(course).toHaveCSS('outline-style', 'solid');
    if (french) await expect(course).toHaveAttribute('aria-current', 'true');
    await expect(options.getByRole('link')).toHaveCount(titles.length + 4 + (french ? 2 : 3));
    for (const title of titles) await expect(options.getByRole('link', { name: title, exact: true })).toBeVisible();
    for (const title of suggestedTopics) await expect(options.getByRole('link', { name: title, exact: true })).toBeVisible();
    for (const link of await options.getByRole('link').all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await recommendation.click();
    if (french) await expect(page).toHaveURL(/\/course\/fr\//u);
    else {
      await expect(page).toHaveURL(/\/learn\/ja\/letters/u);
      await expect(page.getByRole('heading', { name: japaneseAlphabetLessons[0]!.title, exact: true })).toBeVisible();
    }
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/today/${locale}$`));
    await expect(options).toBeVisible();

    await course.click();
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/`));
    await expect(page.getByRole('heading', { name: /^Lesson 1:/ })).toBeVisible();
    await expect(button(page, 'Learn')).toHaveAttribute('aria-selected', 'true');
    await page.goBack();

    await options.getByRole('link', { name: suggestedTopics[0], exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/learn/${locale}/topics/`));
    await page.goBack();
    await library.click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    await page.goBack();
    await options.getByRole('link', { name: 'Listening & videos', exact: true }).click();
    await expect(page.getByTestId('listening-comprehension')).toBeVisible();
    await page.goBack();
    await options.getByRole('link', { name: 'Speaking practice', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
    await button(page, 'Review').click();
    await expect(button(page, 'Add personal word')).toBeVisible();

    await button(page, 'Change language').click();
    await button(page, french ? 'Learn Japanese' : 'Learn French').click();
    await expect(nextStep(page).getByRole('button')).toHaveAccessibleName(french ? 'Start Hiragana' : 'Start lesson');
    if (compact) await expect(disclosure).toHaveAttribute('aria-expanded', 'false');
    await openTodayStudyOptions(page);
    await expect(options.getByRole('link', { name: french ? japaneseCourse.title : frenchCourses[1]!.title, exact: true })).toBeVisible();
    await expect(course).toHaveCount(0);
  });
}

test('French Today resumes Lesson 3 at the saved step with one action', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/today/fr');
  await button(page, 'Start lesson').click();
  const day = frenchCourses[0]!.days[2]!;
  const title = `Lesson 3: ${day.title}`;
  const course = page.getByTestId('open-course-panel');
  await openCourseOutline(course);
  await button(page, `Choose lesson 3: ${day.title}`).click();
  await expect(course.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await button(page, 'Next').click();
  await expect(course.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  const savedUrl = page.url();

  await button(page, 'Today').click();
  await expect(nextStep(page).getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(nextStep(page).getByText(day.outcome, { exact: true })).toBeVisible();
  await expect(nextStep(page).getByText('Resume your saved step.')).toHaveCount(0);
  await expect(nextStep(page).getByText(/guided lessons/)).toHaveCount(0);
  await button(page, 'Continue lesson').click();
  await expect(page).toHaveURL(savedUrl);
  await expect(course.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
});

test('a direct Japanese lesson shows written pronunciation beside the playable word', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/lesson/ja/ja.lesson.day-1/vocabulary');
  const greeting = page.getByTestId('vocabulary-ja.greetings.konnichiwa');
  await expect(greeting.getByTestId('word-pronunciation')).toHaveText('konnichiwa');
  await expect(greeting.getByRole('button', { name: 'Listen to こんにちは', exact: true })).toHaveText('こんにちは');
});
