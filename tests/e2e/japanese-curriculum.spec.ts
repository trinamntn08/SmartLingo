import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, japaneseDailyGuides, japaneseLessons } from '@smartlingo/content';
import type { JapanesePracticeTask, Lesson } from '@smartlingo/domain';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';
import { routeHref } from '../../apps/learner/src/app/routes';
import { buildAcceptedSentence } from './learner-journeys';

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

async function completeCore(page: Page, lesson: Lesson, guided = false) {
  await page.getByRole('button', { name: 'Continue to key phrases', exact: true }).click();
  await page.getByRole('button', { name: 'Try meaning practice', exact: true }).click();
  const choice = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  await page.getByRole('button', { name: choice.target, exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await buildAcceptedSentence(page, lesson);
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  if (guided) await expect(page.getByTestId('daily-checkpoint-status')).toBeVisible();
}

async function completeTask(page: Page, task: JapanesePracticeTask, checkError = false) {
  const activity = page.getByTestId(task.id);
  await expect(activity.getByRole('heading', { name: task.prompt })).toBeVisible();
  if (task.skill === 'listening') {
    await expect(activity.locator('span[lang=ja]')).toHaveCount(0);
    await activity.getByRole('button', { name: 'Show transcript', exact: true }).click();
  } else if (task.source?.ruby?.length) {
    await activity.getByRole('button', { name: 'Show reading support', exact: true }).click();
  }
  if (task.source?.ruby?.length) await expect(activity.locator('ruby rt').first()).toHaveText(task.source.ruby[0].reading);
  if (task.mode === 'choice') {
    if (checkError) {
      const wrong = task.choices.find(option => option !== task.answer)!;
      await activity.getByRole('button', { name: wrong, exact: true }).click();
      await expect(activity.getByText(`${task.retry} ${task.feedback}`, { exact: true })).toBeVisible();
    }
    await activity.getByRole('button', { name: task.answer, exact: true }).click();
  } else if (task.mode === 'text') {
    const input = activity.getByRole('textbox', { name: 'Type your answer' });
    if (checkError) {
      await input.fill('not a Japanese answer');
      await activity.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(activity.getByText(`${task.retry} ${task.feedback}`, { exact: true })).toBeVisible();
    }
    await input.fill(task.answers[0]);
    await activity.getByRole('button', { name: 'Check answer', exact: true }).click();
  } else {
    if (task.response === 'write') await activity.getByRole('textbox', { name: 'Draft your Japanese reply' }).fill(task.model);
    await activity.getByRole('button', { name: 'Show model and checklist' }).click();
    await activity.getByRole('button', { name: 'Mark self-review complete' }).click();
  }
  await expect(activity.getByText(task.feedback, { exact: true }).last()).toBeVisible();
}

for (const lesson of japaneseLessons.filter(lesson => lesson.japanesePractice?.checkpoint)) {
  test(`Japanese topic checkpoint and reload: ${lesson.topic}`, async ({ page }) => {
    const href = routeHref({ kind: 'lesson', language: 'ja-JP', lessonId: lesson.id });
    await page.goto(href);
    await completeCore(page, lesson);
    await page.getByRole('button', { name: 'Unit check', exact: true }).click();
    for (const task of lesson.japanesePractice!.tasks) await completeTask(page, task, true);
    await expect(page.getByText('Practice complete. Revisit any task.', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
    await expect(page.getByText('Practice complete. Revisit any task.', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const dayNumber of [1, 5, 9, 13]) {
  test(`Japanese guided checkpoint and resume: lesson ${dayNumber}`, async ({ page }) => {
    const day = japaneseCourse.days[dayNumber - 1];
    const guide = japaneseDailyGuides.find(guide => guide.dayId === day.id)!;
    const lesson = buildCourseLesson(japaneseCourse, day);
    await page.goto(routeHref({ kind: 'course', language: 'ja-JP', courseId: japaneseCourse.id, dayId: day.id }));
    await completeCore(page, lesson, true);
    await page.getByRole('button', { name: 'Unit check', exact: true }).click();
    for (const task of guide.checkpoint) await completeTask(page, task, true);
    await expect(page.getByTestId('daily-checkpoint-status')).toContainText('2 of 2 checkpoint activities saved');
    await page.reload();
    await expect(page.getByTestId('daily-checkpoint-status')).toContainText('2 of 2 checkpoint activities saved');
    await page.getByRole('button', { name: 'Unit check', exact: true }).click();
    await expect(page.getByTestId(guide.checkpoint[0].id)).toContainText('Practice recorded');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('guided listening plays the bundled clip and reveals its support on demand', async ({ page }) => {
  const day = japaneseCourse.days[0];
  const task = japaneseDailyGuides[0].tasks.find((task): task is Extract<JapanesePracticeTask, { mode: 'choice' }> =>
    task.skill === 'listening' && task.mode === 'choice')!;
  await page.goto(routeHref({ kind: 'course', language: 'ja-JP', courseId: japaneseCourse.id, dayId: day.id }));
  await completeCore(page, buildCourseLesson(japaneseCourse, day), true);
  await page.getByRole('button', { name: 'Unit check', exact: true }).click();
  const activity = page.getByTestId(task.id);
  const answer = activity.getByRole('button', { name: task.answer, exact: true });
  await expect(answer).toBeDisabled();
  const media = page.waitForResponse(response => response.url().includes('/japanese-audio/') && response.request().resourceType() === 'media');
  await activity.getByRole('button', { name: 'Play Japanese audio', exact: true }).click();
  const response = await media;
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('audio/mpeg');
  await expect(answer).toBeEnabled();
  await answer.click();
  await expect(activity.getByText(task.feedback, { exact: true })).toBeVisible();
  await activity.getByRole('button', { name: 'Show transcript', exact: true }).click();
  await expect(activity.getByText(task.source!.text, { exact: true })).toBeVisible();
});

test('Back restores a Japanese reply draft during the same visit', async ({ page }) => {
  const lesson = japaneseLessons.find(lesson => lesson.japanesePractice?.checkpoint
    && lesson.japanesePractice.tasks.some(task => task.mode === 'self' && task.response === 'write'))!;
  await page.goto(routeHref({ kind: 'lesson', language: 'ja-JP', lessonId: lesson.id }));
  await completeCore(page, lesson);
  await page.getByRole('button', { name: 'Unit check', exact: true }).click();
  const response = page.getByRole('textbox', { name: 'Draft your Japanese reply', exact: true });
  await response.fill('時間を確認します。');
  await page.getByRole('navigation', { name: 'Lesson steps' }).getByRole('link', { name: 'Key phrases', exact: true }).click();
  await page.goBack();
  await expect(response).toHaveValue('時間を確認します。');
});
