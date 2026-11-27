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
  await expect(launch(page)).toHaveAccessibleName('Continue lesson');
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
  await expect(page.getByRole('heading', { name: 'Related practice', exact: true })).toHaveCount(0);
  const bookmark = new URLSearchParams({ course: openCoursePilot.id, day: first.id, section: 'lesson-sentence' });
  const copied = await context.newPage();
  await copied.goto(`/lesson/fr/fr.greetings.hello-goodbye/dialogue?${bookmark}`);
  await expect(copied).toHaveURL(/\/lesson\/fr\/fr\.greetings\.hello-goodbye\/dialogue\?course=/);
  await button(copied, 'Back to guided lesson').click();
  await expect(copied).toHaveURL(sentenceUrl);
  await copied.close();

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

test('solving the sentence early leaves the answer and the lesson steps available', async ({ page }) => {
  const lesson = buildCourseLesson(openCoursePilot, second);
  await page.goto(`${path(second.id)}/lesson-sentence`);
  await buildAcceptedSentence(page, lesson);
  await expect(panel(page).getByText(lesson.sentenceActivity.answers[0], { exact: true })).toBeVisible();
  await expect(panel(page).getByText('Sentence solved', { exact: true })).toHaveCount(0);
  await expect(panel(page).getByText(lesson.sentenceActivity.explanation, { exact: true })).toHaveCount(0);
  await expect(panel(page).getByRole('button', { name: 'Review key phrases', exact: true })).toHaveCount(0);
  await expect(panel(page).getByRole('heading', { name: 'Related practice', exact: true })).toHaveCount(0);
  await expect(panel(page).getByRole('navigation', { name: 'Lesson steps' })
    .getByRole('link', { name: 'Key phrases', exact: true })).toBeVisible();
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
