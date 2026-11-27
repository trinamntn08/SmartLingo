import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, japaneseLessons } from '@smartlingo/content';
import type { Lesson } from '@smartlingo/domain';
import { routeHref } from '../../apps/learner/src/app/routes';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';
import { buildAcceptedSentence } from './learner-journeys';

async function finishCore(page: Page, lesson: Lesson) {
  await page.getByTestId('lesson-stage').getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Try meaning practice', exact: true }).click();
  const target = lesson.vocabulary.find(word => word.id === lesson.pictureActivity.entryId)!;
  await page.getByRole('button', { name: target.target, exact: true }).click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await buildAcceptedSentence(page, lesson);
  await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
}

test('Japanese topic self-review persists separately from the completed lesson', async ({ page }) => {
  const lesson = japaneseLessons.find(lesson => lesson.japanesePractice?.tasks.some(task => task.mode === 'self' && task.response === 'write'))!;
  const task = lesson.japanesePractice!.tasks.find(task => task.mode === 'self' && task.response === 'write');
  if (task?.mode !== 'self') throw new Error('Expected a draft reply activity');
  await page.goto(routeHref({ kind: 'lesson', language: 'ja-JP', lessonId: lesson.id }));
  await finishCore(page, lesson);
  const disclosure = page.getByRole('button', { name: lesson.japanesePractice!.checkpoint ? 'Unit check' : 'Real-life practice', exact: true });
  await disclosure.click();
  const activity = page.getByTestId(task.id);
  await activity.getByRole('textbox', { name: 'Draft your Japanese reply' }).fill(task.model);
  await activity.getByRole('button', { name: 'Show model and checklist' }).click();
  await activity.getByRole('button', { name: 'Mark self-review complete' }).click();
  await expect(page.getByText(new RegExp(`1 of ${lesson.japanesePractice!.tasks.length} tasks recorded|Practice complete`))).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  await disclosure.click();
  await expect(activity).toContainText('Practice recorded');
  await expect(activity.getByRole('textbox', { name: 'Draft your Japanese reply' })).toHaveValue('');
});

test('Japanese guided practice saves after the transcript and keeps the lesson cursor', async ({ page }) => {
  const day = japaneseCourse.days[0];
  const lesson = buildCourseLesson(japaneseCourse, day);
  const task = lesson.japanesePractice!.tasks.find(task => task.mode === 'choice' && task.skill === 'listening');
  if (task?.mode !== 'choice') throw new Error('Expected a guided listening choice');
  await page.goto(routeHref({ kind: 'course', language: 'ja-JP', courseId: japaneseCourse.id, dayId: day.id }));
  await expect(page.getByRole('heading', { name: 'Today’s Can-dos' })).toBeVisible();
  await finishCore(page, lesson);
  const disclosure = page.getByRole('button', { name: 'Can-do practice and checkpoint', exact: true });
  await disclosure.click();
  const activity = page.getByTestId(task.id);
  const answer = activity.getByRole('button', { name: task.answer, exact: true });
  await expect(answer).toBeDisabled();
  await activity.getByRole('button', { name: 'Show transcript', exact: true }).click();
  await answer.click();
  await expect(page.getByText(`1 of ${lesson.japanesePractice!.tasks.length} tasks recorded`, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/\/lesson-sentence$/);
  await disclosure.click();
  await expect(activity).toContainText('Practice recorded');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
