import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, openCoursePilot } from '@smartlingo/content';
import type { CourseEvent, NotebookEntry } from '@smartlingo/domain';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';
import { buildAcceptedSentence, guidedLessonButton, openCourseOutline, openLanguageChooser, openPhoneReview } from './learner-journeys';

const panel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => panel(page).getByRole('button', { name, exact: true });

async function stored<T>(page: Page, storeName: string) {
  return page.evaluate(async name => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<T[]>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, storeName);
}

async function openStep(page: Page, step: string, heading: string) {
  await panel(page).getByRole('navigation', { name: 'Lesson steps' }).getByRole('link', { name: step, exact: true }).click();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText(heading);
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

async function findFreshCourse(page: Page) {
  if ((page.viewportSize()?.width ?? 600) < 600) {
    await page.getByRole('button', { name: 'Learn', exact: true }).click();
    await page.getByRole('button', { name: 'Topics', exact: true }).click();
  }
  return guidedLessonButton(page);
}

test('Japanese readings, B1 browsing, notebook capture and exact resume stay separate from French', async ({ page }, info) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const day = japaneseCourse.days.find(item => item.level === 'B1')!;
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await (await findFreshCourse(page)).focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Continue to key phrases')).toBeEnabled();
  await button(page, 'Authorship and review').click();
  await expect(panel(page).getByText(`Author: ${japaneseCourse.provenance!.author}`, { exact: true })).toBeVisible();
  await expect(panel(page).getByText(`Rights: ${japaneseCourse.provenance!.rights}`, { exact: true })).toBeVisible();
  await expect(panel(page).getByRole('button', { name: /Creative Commons/ })).toHaveCount(0);
  await openCourseOutline(panel(page));
  const days = panel(page).getByTestId('course-day-chooser').getByRole('button', { name: /^Choose lesson / });
  await expect(days).toHaveCount(11);
  await button(page, 'Show all lessons').click();
  await expect(days).toHaveCount(japaneseCourse.days.length);
  await button(page, 'Show nearby lessons').click();
  await expect(days).toHaveCount(11);
  await button(page, 'B1').click();
  await expect(days).toHaveCount(4);
  await button(page, `Choose lesson ${day.dayNumber}: ${day.title}`).click();
  await expect(panel(page).getByRole('heading', { name: `Lesson ${day.dayNumber}: ${day.title}`, exact: true })).toBeVisible();
  const lesson = buildCourseLesson(japaneseCourse, day);
  await expect(panel(page).getByTestId('grammar-note').getByRole('heading', { name: lesson.grammar.title, exact: true })).toBeVisible();
  await expect(panel(page).getByTestId('dialogue-japanese-transcript').getByText(lesson.dialogue[0].reading!, { exact: true }).first()).toBeVisible();
  await openStep(page, 'Key phrases', 'Key phrases');
  const word = day.vocabulary[0];
  const card = panel(page).getByTestId(`vocabulary-${word.id}`);
  await expect(card.getByText(word.reading!, { exact: true })).toBeVisible();
  await expect(card.getByText(word.exampleReading!, { exact: true })).toBeVisible();
  await expect(card.getByText(word.exampleMeaning, { exact: true })).toBeVisible();
  await expect(card.getByRole('button', { name: `Listen to ${word.target}`, exact: true })).toBeVisible();
  const save = button(page, `Save ${word.target}`);
  await save.click();
  await expect(save).toBeDisabled();
  if ((page.viewportSize()?.width ?? 600) < 600) await expect(save).toHaveAttribute('aria-pressed', 'true');
  else await expect(panel(page).getByText(`Saved ${word.target} to your notebook.`, { exact: true })).toBeVisible();
  const captured = (await stored<NotebookEntry>(page, 'notebook')).find(entry => entry.sourceEntryId === word.id)!;
  expect(captured).toMatchObject({ language: 'ja-JP', target: word.target, reading: word.reading, exampleReading: word.exampleReading });
  await openStep(page, 'Read dialogue', 'Read a conversation');
  await openStep(page, 'Key phrases', 'Key phrases');
  await button(page, 'Continue to listening').click();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Listening practice');
  await button(page, 'Skip listening').click();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Match the meaning');
  const choice = lesson.pictureActivity;
  const target = lesson.vocabulary.find(word => word.id === choice.entryId)!;
  const distractor = lesson.vocabulary.find(word => choice.choices.includes(word.id) && word.id !== choice.entryId)!;
  await button(page, distractor.target).click();
  await expect(panel(page).getByText('Try again. Match the meaning with the phrase.', { exact: true })).toBeVisible();
  await button(page, 'Show a hint').click();
  await expect(panel(page).getByText(target.example, { exact: true })).toBeVisible();
  await button(page, target.target).click();
  await expect(panel(page).getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();

  // A newer French event must not move the Japanese cursor on reload.
  await openLanguageChooser(page);
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  const french = page.getByTestId('open-course-panel');
  await guidedLessonButton(french).click();
  await french.getByRole('button', { name: 'Continue to key phrases', exact: true }).click();
  await expect(french.getByTestId('lesson-stage-heading')).toHaveText('Key phrases');
  await openLanguageChooser(page);
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await page.reload();
  await guidedLessonButton(page).click();
  await expect(panel(page).getByRole('heading', { name: `Lesson ${day.dayNumber}: ${day.title}`, exact: true })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/course/ja/${japaneseCourse.id}/${day.id}/lesson-picture$`));
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Match the meaning');
  await expect(panel(page).getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await expect(panel(page).getByRole('heading', { name: 'Lesson complete', exact: true })).toHaveCount(0);
  const events = await stored<CourseEvent>(page, 'courseEvents');
  expect(events.filter(event => event.courseId === openCoursePilot.id && event.kind === 'study')).toHaveLength(1);
  expect(events.filter(event => event.courseId === japaneseCourse.id).every(event => event.dayId === day.id)).toBe(true);
  expect(events).toContainEqual(expect.objectContaining({
    courseId: japaneseCourse.id, dayId: day.id, blockId: 'lesson-picture', kind: 'choice', result: 'correct', supported: true,
  }));
  expect(await stored(page, 'events')).toEqual([]);
  await page.setViewportSize({ width: 320, height: 800 });
  await openStep(page, 'Key phrases', 'Key phrases');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('japanese-course-320.png'), fullPage: true });
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await openPhoneReview(page);
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.getByRole('button', { name: 'Remembered', exact: true }).click();
  await expect.poll(async () => (await stored(page, 'reviewEvents')).length).toBe(1);
  await page.getByRole('button', { name: 'Show notebook', exact: true }).click();
  const notebook = page.getByTestId('notebook-entries');
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill(word.reading!);
  await expect(notebook.getByRole('heading', { name: word.target, exact: true })).toBeVisible();
  await expect(notebook.getByRole('button', { name: `Listen to ${word.target}`, exact: true })).toBeVisible();
  await notebook.getByRole('button', { name: 'Edit note', exact: true }).click();
  await notebook.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My Japanese study note');
  await notebook.getByRole('textbox', { name: 'Kana reading', exact: true }).fill('じぶんのよみ');
  await notebook.getByRole('textbox', { name: 'Example kana reading', exact: true }).fill('れいぶんのよみ');
  await notebook.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('');
  await expect(page.getByText('Changes saved in this browser.', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('じぶんのよみ');
  await expect(notebook.getByText('My Japanese study note', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('notebook-entries').getByText('じぶんのよみ', { exact: true })).toBeVisible();
  expect((await stored<NotebookEntry>(page, 'notebook'))[0]).toMatchObject({ language: 'ja-JP', reading: 'じぶんのよみ', exampleReading: 'れいぶんのよみ' });
  expect(await stored(page, 'reviewEvents')).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('Japanese completion follows study and both activities, and the next lesson survives reload', async ({ page }) => {
  test.setTimeout(90000);
  const day = japaneseCourse.days[0];
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await (await findFreshCourse(page)).click();
  const lesson = buildCourseLesson(japaneseCourse, day);
  const completed = panel(page).getByRole('heading', { name: 'Lesson complete', exact: true });
  await button(page, 'Continue to key phrases').click();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Key phrases');
  await button(page, 'Try meaning practice').click();
  const match = lesson.vocabulary.find(word => word.id === lesson.pictureActivity.entryId)!;
  await button(page, match.target).click();
  await button(page, 'Next').click();
  await expect(completed).toHaveCount(0);
  await buildAcceptedSentence(page, lesson);
  await expect(completed).toBeVisible();
  await page.reload();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Build a sentence');
  await expect(completed).toBeVisible();
  const next = japaneseCourse.days[1];
  await button(page, `Next lesson: Lesson ${next.dayNumber}: ${next.title}`).click();
  await expect(panel(page).getByRole('heading', { name: `Lesson ${next.dayNumber}: ${next.title}`, exact: true })).toBeVisible();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Read a conversation');
  await page.reload();
  await expect(panel(page).getByRole('heading', { name: `Lesson ${next.dayNumber}: ${next.title}`, exact: true })).toBeVisible();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Read a conversation');
  const events = await stored<CourseEvent>(page, 'courseEvents');
  expect(events).toEqual(expect.arrayContaining([
    expect.objectContaining({ kind: 'study', dayId: day.id, blockId: 'lesson-vocabulary' }),
    expect.objectContaining({ kind: 'choice', dayId: day.id, blockId: 'lesson-picture', result: 'correct' }),
    expect.objectContaining({ kind: 'choice', dayId: day.id, blockId: 'lesson-sentence', result: 'correct' }),
  ]));
  expect(events.sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt) || left.id.localeCompare(right.id)).at(-1))
    .toMatchObject({ kind: 'navigation', dayId: next.id, blockId: 'lesson-dialogue' });
});

test('Japanese days remain readable without browser storage', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await (await findFreshCourse(page)).click();
  await expect(button(page, 'Retry course storage')).toBeVisible();
  await openCourseOutline(panel(page));
  await button(page, 'B1').click();
  const day = japaneseCourse.days.at(-1)!;
  await button(page, `Choose lesson ${day.dayNumber}: ${day.title}`).click();
  await openCourseOutline(panel(page));
  await button(page, 'All course levels').click();
  await expect(panel(page).getByTestId('course-day-chooser').getByRole('button', { name: /^Choose lesson / }).first())
    .toHaveAccessibleName(/^Choose lesson 3:/);
  await openStep(page, 'Key phrases', 'Key phrases');
  const word = day.vocabulary[0];
  await expect(panel(page).getByText(word.reading!, { exact: true })).toBeVisible();
  await expect(button(page, `Save ${word.target}`)).toBeDisabled();
  await openStep(page, 'Match meanings', 'Match the meaning');
  await expect(button(page, word.target)).toBeDisabled();
  await expect(button(page, 'Next')).toBeEnabled();
  await button(page, 'Next').click();
  await expect(panel(page).getByTestId('lesson-stage-heading')).toHaveText('Build a sentence');
  await expect(panel(page).getByRole('heading', { name: 'Lesson complete', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
