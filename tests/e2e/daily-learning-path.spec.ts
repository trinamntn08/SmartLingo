import { buildAcceptedSentence, guidedLessonButton } from './learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const panel = (page: Page) => page.getByTestId('open-course-panel');
const launch = (page: Page) => guidedLessonButton(panel(page));
const [first, second] = openCoursePilot.days;
const path = (dayId: string) => `/course/fr/${openCoursePilot.id}/${dayId}`;

test('Today and Learn share the guided lesson, resume point and next lesson', async ({ context, page }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/today/fr');
  await expect(panel(page)).toHaveCount(1);
  await expect(launch(page)).toHaveAttribute('href', path(first.id));
  await button(page, 'Learn').click();
  await expect(launch(page)).toHaveAttribute('href', path(first.id));
  await expect(button(page, 'Lessons')).toBeVisible();
  await launch(page).click();
  await expect(button(page, 'Learn')).toHaveAttribute('aria-selected', 'true');
  await button(page, 'Next').click();
  await expect(panel(page).getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  const savedStep = page.url();
  await button(page, 'Today').click();
  await expect(panel(page).getByText('Resume your saved step.')).toBeVisible();
  await launch(page).click();
  await expect(page).toHaveURL(savedStep);
  await button(page, 'Next').click();
  await button(page, 'Next').click();
  const lesson = buildCourseLesson(openCoursePilot, first);
  const answer = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  await button(page, answer.target).click();
  await button(page, 'Next').click();

  const sentence = panel(page).getByRole('heading', { name: 'Build a sentence', exact: true });
  await expect(sentence).toBeVisible();
  const sentenceUrl = page.url();
  await page.getByTestId('daily-related-practice').getByRole('button', { name: 'Say hello and goodbye', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/fr\/fr\.greetings\.hello-goodbye\/dialogue\?course=/);

  const copied = await context.newPage();
  await copied.goto(page.url());
  await button(copied, 'Back to guided lesson').click();
  await expect(copied).toHaveURL(sentenceUrl);
  await copied.close();

  await button(page, 'Back to guided lesson').click();
  await expect(page).toHaveURL(sentenceUrl);
  await expect(sentence).toBeVisible();
  const completed = panel(page).getByRole('heading', { name: 'Lesson complete', exact: true });
  await expect(completed).toHaveCount(0);
  await buildAcceptedSentence(page, lesson);
  await expect(completed).toBeVisible();

  await button(page, 'Close course').first().click();
  await expect(page).toHaveURL('/today/fr');
  await expect(launch(page)).toHaveAttribute('href', path(second.id));
  await button(page, 'Learn').click();
  await expect(launch(page)).toHaveAttribute('href', path(second.id));
  await launch(page).click();
  await expect(panel(page).getByRole('heading', { name: `Lesson 2: ${second.title}`, exact: true })).toBeVisible();
  await button(page, 'Close course').click();
  await expect(page).toHaveURL('/learn/fr');
});

test('a failed course save can be retried after Back leaves a reloaded course', async ({ context, page }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/languages');
  await button(page, 'Learn French').click();
  await launch(page).click();
  await expect(button(page, 'Next')).toBeEnabled();
  await page.reload();
  await expect(button(page, 'Next')).toBeEnabled();
  await page.evaluate(() => {
    const add = IDBObjectStore.prototype.add;
    let fail = true;
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents' && value.kind === 'navigation' && fail) {
        fail = false;
        throw new Error('Simulated course navigation save failure');
      }
      return add.call(this, value, key);
    };
  });
  await button(page, 'Next').click();
  await expect(button(page, 'Retry course save')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL('/today/fr');
  await expect(button(page, 'Retry course save')).toBeVisible();
  await expect(launch(page)).toBeDisabled();
  await page.goBack();
  await expect(page).toHaveURL('/languages');
  await expect(button(page, 'Retry course save')).toBeVisible();
  await button(page, 'Retry course save').click();
  await expect(button(page, 'Retry course save')).toHaveCount(0);
  await button(page, 'Learn French').click();
  await expect(launch(page)).toBeEnabled();
  await launch(page).click();
  await expect(panel(page).getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
});
