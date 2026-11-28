import { buildAcceptedSentence, guidedLessonButton, expectDialoguePhoto, expectFrenchTranscripts, openCourseOutline, openProfileSection, openLessonFromTopics, openTodayCourse } from './learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { frenchCourses, frenchCourseLessonsByDay, japaneseCourse, openCoursePilot } from '@smartlingo/content';
import { courseDayProgressRevision, courseLessonStageId, type CourseDay, type CourseEvent } from '@smartlingo/domain';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';
import { buildCourseListeningQuestion } from '../../apps/learner/src/listening/lessonQuestions';

const [firstDay, secondDay, thirdDay] = openCoursePilot.days;
const coursePanel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => coursePanel(page).getByRole('button', { name, exact: true });
const step = (page: Page, name: string) => coursePanel(page).getByRole('heading', { name, exact: true });
const stepTab = (page: Page, stage: string) => coursePanel(page).getByTestId(`lesson-step-${stage}`);
const chooseDay = (page: Page, day: CourseDay) => coursePanel(page).getByTestId(`course-day-${day.id}`).getByRole('link');
const dayHeading = (page: Page, day: CourseDay) => step(page, `Lesson ${day.dayNumber}: ${day.title}`);

async function storedEvents(page: Page, store: 'courseEvents' | 'events' = 'courseEvents') {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<CourseEvent[]>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, store);
}

async function seedEvents(page: Page, events: CourseEvent[]) {
  await page.evaluate(async inputs => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('courseEvents', 'readwrite');
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error);
        for (const input of inputs) transaction.objectStore('courseEvents').add(input);
      });
    } finally { database.close(); }
  }, events);
}

function courseEvent(day: CourseDay, blockId: string, kind: CourseEvent['kind'], index: number): CourseEvent {
  return { id: crypto.randomUUID(), courseId: openCoursePilot.id,
    courseRevision: courseDayProgressRevision(openCoursePilot, day), dayId: day.id,
    blockId, occurredAt: new Date(Date.parse('2026-11-01T12:00:00Z') + index).toISOString(), kind } as CourseEvent;
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('Today opens French courses independently and Learn focuses on the recommendation and topics', async ({ page }) => {
  const [, a2, b1] = frenchCourses;
  const today = () => page.getByRole('button', { name: 'Today', exact: true }).click();
  await page.goto('/today/fr');

  await openTodayCourse(page, a2.title);
  await expect(dayHeading(page, a2.days[0])).toBeVisible();
  await button(page, 'Next').click();
  await expect(page).toHaveURL(/\/fr\.course-a2\.day-1\/lesson-vocabulary$/u);

  await today();
  await openTodayCourse(page, b1.title);
  await expect(dayHeading(page, b1.days[0])).toBeVisible();
  await openCourseOutline(coursePanel(page));
  await chooseDay(page, b1.days[2]).click();
  await expect(dayHeading(page, b1.days[2])).toBeVisible();
  await button(page, 'Next').click();
  await expect(page).toHaveURL(/\/fr\.course-b1\.day-3\/lesson-vocabulary$/u);
  await page.reload();
  await expect(step(page, 'Key phrases')).toBeVisible();
  await expect(page).toHaveURL(/\/fr\.course-b1\.day-3\/lesson-vocabulary$/u);

  await today();
  await expect(guidedLessonButton(page)).toHaveText(/Start lesson/u);
  await openTodayCourse(page, a2.title);
  await expect(page).toHaveURL(/\/fr\.course-a2\.day-1\/lesson-vocabulary$/u);
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(coursePanel(page).getByRole('button', { name: 'Open course', exact: true })).toBeVisible();
  await expect(page.getByText('More French courses', { exact: true })).toHaveCount(0);
  await expect(button(page, 'More French courses')).toHaveCount(0);
  await expect(button(page, a2.title)).toHaveCount(0);
  await expect(button(page, b1.title)).toHaveCount(0);
  await today();
  await openTodayCourse(page, b1.title);
  await expect(page).toHaveURL(/\/fr\.course-b1\.day-3\/lesson-vocabulary$/u);

  const topicLesson = frenchCourseLessonsByDay.get(b1.days[2].id)!;
  await openLessonFromTopics(page, topicLesson);
  await expect(page.getByRole('heading', { name: topicLesson.title, exact: true })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/lesson/fr/${topicLesson.id}/dialogue$`, 'u'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('all five opening lessons share a six-step reader with full transcripts and photos', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('today-next-step').getByRole('heading', { name: `Lesson 1: ${firstDay.title}` })).toBeVisible();
  await guidedLessonButton(page).focus();
  await page.keyboard.press('Enter');
  await expect(step(page, openCoursePilot.title)).toBeVisible();
  await openCourseOutline(coursePanel(page));
  const outline = coursePanel(page).getByTestId('course-outline');
  await expect(outline.getByRole('button', { name: 'Unit 1: Your first conversations in France', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(outline.getByText('2 units · 9 lessons', { exact: true })).toBeVisible();
  await expect(outline.getByText('0 of 9 lessons complete', { exact: true })).toBeVisible();
  const unitTwo = outline.getByRole('button', { name: 'Unit 2: Get around your neighbourhood', exact: true });
  await expect(unitTwo).toHaveAttribute('aria-expanded', 'false');
  await expect(unitTwo).toHaveAccessibleDescription('2 lessons');
  await unitTwo.press('Enter');
  await expect(outline.getByRole('link', { name: /^Choose lesson/ })).toHaveCount(9);
  await expect(chooseDay(page, openCoursePilot.days[8]!)).toBeVisible();
  await expect(outline.getByText(/sections in lesson|quick practice|try it/i)).toHaveCount(0);

  for (const day of openCoursePilot.days.slice(0, 5)) {
    await openCourseOutline(coursePanel(page));
    await chooseDay(page, day).click();
    await expect(dayHeading(page, day)).toBeVisible();
    await expect(step(page, 'Read a conversation')).toBeVisible();
    await expect(coursePanel(page).getByRole('navigation', { name: 'Lesson steps' }).getByRole('link')).toHaveCount(6);
    await expect(stepTab(page, 'dialogue')).toHaveAttribute('aria-current', 'step');
    const dialogue = day.blocks.find(block => block.kind === 'dialogue')!;
    if (dialogue.kind !== 'dialogue') throw new Error('Missing dialogue');
    const { french, english } = await expectFrenchTranscripts(coursePanel(page), dialogue.lines);
    await expectDialoguePhoto(coursePanel(page), day === firstDay ? 'french-neighbour-dialogue.jpg' : 'french-workshop-dialogue.jpg');
    if (day === firstDay) {
      const frenchBox = (await french.boundingBox())!;
      const englishBox = (await english.boundingBox())!;
      if (page.viewportSize()!.width >= 600) expect(englishBox.x).toBeGreaterThan(frenchBox.x);
      else expect(englishBox.y).toBeGreaterThanOrEqual(frenchBox.y + frenchBox.height);
      await expect(button(page, 'Source credits and licence')).toHaveCount(0);
      await expect(button(page, 'Authorship and review')).toHaveCount(0);
    }
    await expect(button(page, 'Listening check')).toHaveCount(0);
    await expect(button(page, 'Next')).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

for (const course of [openCoursePilot, japaneseCourse]) {
  const language = course.language === 'fr-FR' ? 'French' : 'Japanese';
  test(`${language} guided listening offers transcript support without writing progress`, async ({ page }) => {
    const day = course.days[0];
    const code = course.language === 'fr-FR' ? 'fr' : 'ja';
    const path = `/course/${code}/${course.id}/${day.id}/lesson-listening`;
    const question = buildCourseListeningQuestion(day, course.language)!;
    await page.goto(path);
    const check = coursePanel(page).getByTestId('listening-question-player');
    await expect(step(page, 'Listening practice')).toBeVisible();
    await expect(stepTab(page, 'listening')).toHaveAttribute('aria-current', 'step');
    const transcript = check.getByTestId('listening-transcript');
    const answer = check.getByRole('button', { name: 'Check answer', exact: true });
    await expect(check.getByRole('button', { name: 'Play sentence', exact: true })).toBeVisible();
    await expect(transcript).toHaveCount(0);
    await expect(answer).toBeDisabled();
    await check.getByRole('button', { name: 'Show transcript', exact: true }).click();
    await expect(transcript).toContainText(question.sentence);
    if (course.language === 'fr-FR') {
      const bank = check.getByRole('group', { name: 'Word cards' });
      await bank.getByRole('button', { name: 'Au revoir', exact: true }).click();
      await bank.getByRole('button', { name: 'bonne journée', exact: true }).click();
    } else {
      await check.getByRole('button', { name: question.choices[question.correctIndex], exact: true }).click();
    }
    await answer.click();
    const feedback = check.getByTestId('listening-feedback');
    await expect(feedback).toContainText(question.meaning);
    await expect(feedback).toContainText(/transcript support/);
    await expect(button(page, 'Next')).toBeEnabled();
    await expect(page).toHaveURL(path);
    expect(await storedEvents(page)).toEqual([]);
    expect(await storedEvents(page, 'events')).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('the shared stages save progress, restore matching and unlock the next lesson on completion', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await stepTab(page, 'vocabulary').press('Enter');
  await expect(step(page, 'Key phrases')).toBeVisible();
  expect((await storedEvents(page)).filter(event => event.kind === 'study')).toEqual([]);
  await stepTab(page, 'dialogue').press('Enter');
  await button(page, 'Next').click();
  await button(page, 'Next').click();
  await expect(coursePanel(page).getByTestId('grammar-note')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Listening practice')).toBeVisible();
  await button(page, 'Next').click();
  const lesson = buildCourseLesson(openCoursePilot, firstDay);
  const { entryId, choices, prompt } = lesson.pictureActivity;
  const correct = lesson.vocabulary.find(entry => entry.id === entryId)!;
  const wrong = lesson.vocabulary.find(entry => entry.id !== entryId && choices.includes(entry.id))!;
  const activity = coursePanel(page).getByTestId('lesson-stage');
  await expect(activity.getByRole('heading', { name: prompt })).toBeVisible();
  await button(page, wrong.target).press('Enter');
  await expect(activity.getByText(/^Try again/)).toBeVisible();
  await button(page, 'Show a hint').click();
  await expect(activity.getByText(correct.example, { exact: true })).toBeVisible();
  await button(page, correct.target).click();
  await expect(activity.getByText('That’s it. You matched the meaning.')).toBeVisible();

  await page.reload();
  await expect(step(page, 'Match the meaning')).toBeVisible();
  await expect(activity.getByText('That’s it. You matched the meaning.')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Build a sentence')).toBeVisible();
  await expect(step(page, 'Lesson complete')).toHaveCount(0);
  await buildAcceptedSentence(page, lesson);
  await expect(step(page, 'Lesson complete')).toBeVisible();
  const events = await storedEvents(page);
  expect(events.filter(event => event.kind === 'study').map(event => event.blockId).sort()).toEqual(['lesson-dialogue', 'lesson-vocabulary']);
  expect(events.filter(event => event.kind === 'completion')).toHaveLength(0);
  expect(events.filter(event => event.kind === 'choice' && event.result === 'correct').map(event => event.blockId).sort())
    .toEqual(['lesson-picture', 'lesson-sentence']);
  expect(events.some(event => event.kind === 'choice' && event.supported)).toBe(true);
  expect([...new Set(events.map(event => event.courseRevision))]).toEqual([courseDayProgressRevision(openCoursePilot, firstDay)]);
  expect(await storedEvents(page, 'events')).toEqual([]);
  await expect(coursePanel(page).getByText('About 10 min', { exact: true })).toBeVisible();
  await expect(activity.getByText(lesson.sentenceActivity.answers[0], { exact: true })).toBeVisible();
  await expect(button(page, 'Practise the conversation')).toHaveCount(0);
  await expect(activity.getByTestId('french-transfer-practice')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await stepTab(page, 'dialogue').click();
  await expect(step(page, 'Read a conversation')).toBeVisible();
  await page.goBack();
  await expect(activity.getByText(lesson.sentenceActivity.answers[0], { exact: true })).toBeVisible();
  const firstLessonUrl = `/course/fr/${openCoursePilot.id}/${firstDay.id}`;
  const secondLessonUrl = `/course/fr/${openCoursePilot.id}/${secondDay.id}`;
  await page.goto(`${secondLessonUrl}/lesson-dialogue`);
  await stepTab(page, 'sentence').click();
  await expect(page).toHaveURL(`${secondLessonUrl}/lesson-sentence`);
  await page.goto(secondLessonUrl);
  await expect(page).toHaveURL(`${secondLessonUrl}/lesson-sentence`);
  await page.goto(`${firstLessonUrl}/lesson-sentence`);
  await button(page, `Next lesson: Lesson 2: ${secondDay.title}`).click();
  await expect(page).toHaveURL(`${secondLessonUrl}/lesson-dialogue`);
  await expect(dayHeading(page, secondDay)).toBeVisible();
  await expect(step(page, 'Read a conversation')).toBeVisible();

  await page.goto(firstLessonUrl);
  await stepTab(page, 'vocabulary').press('Enter');
  await expect(page).toHaveURL(`${firstLessonUrl}/lesson-vocabulary`);
  await page.goto(firstLessonUrl);
  await expect(page).toHaveURL(`${firstLessonUrl}/lesson-vocabulary`);
  await expect(step(page, 'Key phrases')).toBeVisible();
});

test('notebook, progress and the resume step survive backup and restore', async ({ page, browser }, info) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await button(page, 'Next').click();
  await button(page, 'Save bonjour').click();
  await expect(button(page, 'Unsave bonjour')).toHaveAttribute('aria-pressed', 'true');
  await button(page, 'Next').click();
  await expect(coursePanel(page).getByTestId('grammar-note')).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const backupPath = info.outputPath('course-learning-backup.json');
  await (await download).saveAs(backupPath);

  const restoredContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  await restoredContext.route('**/127.0.0.1:3001/**', route => route.abort());
  try {
    const restored = await restoredContext.newPage();
    await restored.goto(new URL('/', page.url()).href);
    await restored.getByRole('button', { name: 'Learn French', exact: true }).click();
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await openProfileSection(restored, 'Offline & backups');
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(backupPath);
    await restored.getByRole('checkbox').check();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await expect(restored).toHaveURL(/\/profile\/fr$/);
    await restored.getByRole('button', { name: 'Today', exact: true }).click();
    await guidedLessonButton(restored).click();
    await expect(restored).toHaveURL(/\/lesson-grammar$/);
    await expect(coursePanel(restored).getByTestId('grammar-note')).toBeVisible();
    await stepTab(restored, 'vocabulary').click();
    await expect(step(restored, 'Key phrases')).toBeVisible();
    await expect(button(restored, 'Unsave bonjour')).toHaveAttribute('aria-pressed', 'true');
  } finally { await restoredContext.close(); }
});

test('Next retries a failed cursor write without duplicating dialogue study', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next')).toBeEnabled();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    const attempts: string[] = [];
    Object.assign(window, { courseNavigationAttempts: attempts });
    let fail = true;
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents' && (value as CourseEvent).kind === 'navigation') {
        attempts.push((value as CourseEvent).id);
        if (fail) { fail = false; throw new Error('Simulated cursor failure'); }
      }
      return original.call(this, value, key);
    };
  });
  await button(page, 'Next').click();
  await expect(coursePanel(page).getByRole('alert')).toContainText('Simulated cursor failure');
  await expect(step(page, 'Read a conversation')).toBeVisible();
  await expect(button(page, 'Next')).toBeDisabled();
  await button(page, 'Retry course save').click();
  await expect(step(page, 'Key phrases')).toBeVisible();
  const ids = await page.evaluate(() => (window as unknown as { courseNavigationAttempts: string[] }).courseNavigationAttempts);
  expect(ids).toHaveLength(2);
  expect(ids[0]).toBe(ids[1]);
  expect((await storedEvents(page)).map(value => value.kind).sort()).toEqual(['navigation', 'study']);
});

test('all six steps can be browsed at 320 px when progress storage is unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: undefined }); });
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Retry course storage')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Key phrases')).toBeVisible();
  await button(page, 'Next').click();
  await expect(coursePanel(page).getByTestId('grammar-note')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Listening practice')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Match the meaning')).toBeVisible();
  await button(page, 'Next').click();
  await expect(step(page, 'Build a sentence')).toBeVisible();
  await expect(button(page, 'Check sentence')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the rewritten lesson has fresh progress and preserves historical events and other lesson cursors', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next')).toBeEnabled();
  const firstHistory = firstDay.blocks.map((block, index): CourseEvent => {
    if (block.kind === 'choice') return { ...courseEvent(firstDay, block.id, 'choice', index), kind: 'choice',
      choiceId: block.answerId, result: 'correct', supported: false };
    return courseEvent(firstDay, block.id, block.kind === 'reflection' ? 'reflection' : 'study', index);
  });
  const oldSecondCursor = secondDay.blocks.find(block => block.kind === 'vocabulary')!;
  const laterPractice = thirdDay.blocks.filter(block => block.kind === 'choice').at(-1)!;
  const olderOpening = [...firstHistory, courseEvent(firstDay, firstDay.blocks.at(-1)!.id, 'completion', 10)]
    .map(event => ({ ...event, courseRevision: 1 }));
  await seedEvents(page, [...olderOpening,
    courseEvent(secondDay, oldSecondCursor.id, 'navigation', 11), courseEvent(thirdDay, laterPractice.id, 'navigation', 12)]);
  await page.goto(`/course/fr/${openCoursePilot.id}`);
  await expect(dayHeading(page, thirdDay)).toBeVisible();
  await expect(step(page, 'Match the meaning')).toBeVisible();
  await expect(page).toHaveURL(/\/lesson-picture$/);
  await openCourseOutline(coursePanel(page));
  await chooseDay(page, secondDay).click();
  await expect(step(page, 'Key phrases')).toBeVisible();
  await openCourseOutline(coursePanel(page));
  await expect(chooseDay(page, firstDay)).toHaveAccessibleName('Choose lesson 1: Meet a neighbour');
  await chooseDay(page, firstDay).click();
  await expect(dayHeading(page, firstDay)).toBeVisible();
  await expect(step(page, 'Read a conversation')).toBeVisible();
  await expect(step(page, 'Lesson complete')).toHaveCount(0);
  expect(await storedEvents(page)).toEqual(expect.arrayContaining(olderOpening));
  const original = await storedEvents(page);
  const oldDialogue = firstDay.blocks.find(block => block.kind === 'dialogue')!;
  await page.goto(`/course/fr/${openCoursePilot.id}/${firstDay.id}/${oldDialogue.id}`);
  await expect(step(page, 'Read a conversation')).toBeVisible();
  await expect(page).toHaveURL(/\/lesson-dialogue$/);
  expect(await storedEvents(page)).toEqual(original);

  const oldReflection = firstDay.blocks.find(block => block.kind === 'reflection')!;
  await seedEvents(page, [courseEvent(firstDay, oldDialogue.id, 'study', 20),
    courseEvent(firstDay, oldReflection.id, 'reflection', 21), courseEvent(firstDay, oldReflection.id, 'completion', 22)]);
  await page.goto(`/course/fr/${openCoursePilot.id}/${firstDay.id}/${oldReflection.id}`);
  await expect(page).toHaveURL(/\/lesson-sentence$/);
  await expect(button(page, 'Check sentence')).toBeVisible();
  await expect(button(page, `Next lesson: Lesson 2: ${secondDay.title}`)).toBeEnabled();
});

test('a restored inconsistent choice never shows correct feedback', async ({ page }) => {
  await page.goto('/');
  await guidedLessonButton(page).click();
  await expect(button(page, 'Next')).toBeEnabled();
  await seedEvents(page, [{ ...courseEvent(firstDay, courseLessonStageId('picture'), 'choice', 0), kind: 'choice',
    choiceId: 'incorrect', result: 'correct', supported: false }]);
  await page.goto(`/course/fr/${openCoursePilot.id}/${firstDay.id}/lesson-picture`);
  await expect(step(page, 'Match the meaning')).toBeVisible();
  await expect(coursePanel(page).getByText('That’s it. You matched the meaning.')).toHaveCount(0);
  await expect(button(page, 'Next')).toHaveCount(0);
});
