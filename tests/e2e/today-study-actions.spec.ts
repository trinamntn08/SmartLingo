import { expect, test, type Page } from '@playwright/test';
import { frenchCourses, japaneseCourse } from '@smartlingo/content';
import { openCourseOutline, openTodayStudyOptions } from './learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const nextStep = (page: Page) => page.getByTestId('today-next-step');
const studyNav = (page: Page) => page.getByRole('navigation', { name: /^Explore (French|Japanese)$/u });
const frenchTitles = ['A1 · First steps in France', 'A2 · Everyday independence', 'B1 · Explain, solve and participate'];

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
    const panelTitle = french ? 'Explore French' : 'Explore Japanese';
    const disclosure = button(page, panelTitle);
    const titles = french ? frenchTitles : [japaneseCourse.title];
    const course = options.getByRole('link', { name: titles[0], exact: true });
    const library = options.getByRole('link', { name: 'Browse lessons by topic', exact: true });

    await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
    await expect(nextStep(page).getByRole('img')).toHaveCount(0);
    await expect(recommendation).toHaveCount(1);
    await expect(recommendation).toBeInViewport();
    await expect(recommendation).toHaveAccessibleName('Start lesson');
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
    await expect(library).toBeFocused();
    await expect(library).toHaveCSS('outline-style', 'solid');
    await expect(options.getByRole('heading', { name: 'Find lessons', exact: true })).toBeVisible();
    await expect(options.getByRole('heading', { name: 'Practise a skill', exact: true })).toBeVisible();
    await expect(options.getByRole('link')).toHaveCount(titles.length + 3);
    for (const title of titles) await expect(options.getByRole('link', { name: title, exact: true })).toBeVisible();
    for (const link of await options.getByRole('link').all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await recommendation.click();
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/`));
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/today/${locale}$`));
    await expect(options).toBeVisible();

    await course.click();
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/`));
    await expect(page.getByRole('heading', { name: /^Lesson 1:/ })).toBeVisible();
    await expect(button(page, 'Learn')).toHaveAttribute('aria-selected', 'true');
    await page.goBack();

    await library.click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    if (!french) {
      await expect(button(page, 'Topic Hiragana')).toBeVisible();
      await expect(button(page, 'Topic Katakana')).toBeVisible();
      await button(page, 'Topic Hiragana').click();
      await expect(page).toHaveURL(/\/learn\/ja\/topics\/Hiragana$/u);
      await page.goBack();
    }
    await page.goBack();
    await options.getByRole('link', { name: 'Listening & videos', exact: true }).click();
    await expect(page.getByTestId('listening-comprehension')).toBeVisible();
    await page.goBack();
    await options.getByRole('link', { name: 'Speaking', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
    await button(page, 'Review').click();
    await expect(button(page, 'Add personal word')).toBeVisible();

    await button(page, 'Change language').click();
    await button(page, french ? 'Learn Japanese' : 'Learn French').click();
    await expect(nextStep(page).getByRole('button')).toHaveAccessibleName('Start lesson');
    if (compact) await expect(button(page, french ? 'Explore Japanese' : 'Explore French')).toHaveAttribute('aria-expanded', 'false');
    await openTodayStudyOptions(page);
    await expect(options.getByRole('link', { name: french ? japaneseCourse.title : frenchTitles[1], exact: true })).toBeVisible();
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
  const outline = course.getByRole('navigation', { name: 'Course outline' });
  await outline.getByTestId(`course-day-${day.id}`).getByRole('link').click();
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
  await openCourseOutline(course);
  await expect(outline.getByTestId(`course-day-${day.id}`).getByRole('link')).toHaveAttribute('aria-current', 'true');
  await outline.getByRole('link', { name: 'Browse lessons by topic', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(savedUrl);
  await expect(course.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();

  await openCourseOutline(course);
  const browseCourses = outline.getByRole('link', { name: 'Browse guided courses', exact: true });
  await expect(browseCourses).toHaveAttribute('href', '/today/fr?section=courses');
  await browseCourses.press('Enter');
  await expect(page).toHaveURL(/\/today\/fr\?section=courses$/u);
  await expect(studyNav(page).getByRole('heading', { name: 'Guided courses', exact: true })).toBeFocused();
  for (const name of frenchTitles.slice(1)) await expect(studyNav(page).getByRole('link', { name, exact: true })).toBeVisible();
  await page.goBack();
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
