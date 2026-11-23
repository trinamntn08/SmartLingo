import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, openCoursePilot, restaurantLesson } from '@smartlingo/content';
import type { CourseEvent, LearningEvent } from '@smartlingo/domain';
import { buildLessonListeningQuestion } from '../../apps/learner/src/listening/lessonQuestions';
import { buildAcceptedSentence } from './learner-journeys';

async function storedEvents<T>(page: Page, store: 'events' | 'courseEvents'): Promise<T[]> {
  return page.evaluate(async name => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<T[]>((resolve, reject) => {
        const request = database.transaction(name).objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, store);
}

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('lesson Back restores its stage and Forward restores the previous hint in the matching activity', async ({ page }) => {
  const location = `/lesson/fr/${restaurantLesson.id}`;
  await page.goto(location);
  await expect(page).toHaveURL(`${location}/dialogue`);
  const steps = page.getByRole('navigation', { name: 'Lesson steps' });
  const sentence = steps.getByRole('link', { name: 'Build a sentence' });
  await steps.getByRole('link', { name: 'Match a picture' }).focus();
  await page.keyboard.press('Tab');
  await expect(sentence).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${location}/sentence`);
  await expect(sentence).toHaveAttribute('aria-current', 'step');
  await expect(page.getByTestId('lesson-stage-heading')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Lesson complete', exact: true })).toHaveCount(0);
  await steps.getByRole('link', { name: 'Key phrases' }).click();
  await expect(page).toHaveURL(`${location}/vocabulary`);
  await steps.getByRole('link', { name: 'Listen', exact: true }).click();
  await expect(page).toHaveURL(`${location}/listening`);
  await expect(page.getByTestId('lesson-step-listening')).toHaveAttribute('aria-current', 'step');
  await expect(page.getByTestId('lesson-stage-heading')).toBeFocused();
  await steps.getByRole('link', { name: 'Match a picture' }).click();
  await expect(page).toHaveURL(`${location}/picture`);
  await steps.getByRole('link', { name: 'Dialogue' }).click();
  await expect(page).toHaveURL(`${location}/dialogue`);
  await expect(storedEvents<LearningEvent>(page, 'events')).resolves.toEqual([]);

  await page.getByRole('button', { name: 'Continue to key phrases', exact: true }).click();
  await expect(page).toHaveURL(`${location}/vocabulary`);
  await page.getByRole('button', { name: /Try picture practice/ }).click();
  await expect(page).toHaveURL(`${location}/picture`);
  await page.getByRole('button', { name: 'Show a hint', exact: true }).click();

  await page.goBack();
  await expect(page).toHaveURL(`${location}/vocabulary`);
  await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await page.goForward();
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Hide hint', exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(`${location}/picture`);
  await expect(page.getByRole('button', { name: 'Show a hint', exact: true })).toBeVisible();

  const events = await storedEvents<LearningEvent>(page, 'events');
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ activity: 'vocabulary', result: 'viewed' });
});

test('lesson listening uses the target audio, shows feedback and keeps the existing progress records', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(readonly text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [{ lang: 'fr-FR', localService: true }], cancel() {},
      speak(utterance: SpeechSynthesisUtterance) {
        sessionStorage.setItem('short-lesson-audio', JSON.stringify({ text: utterance.text, lang: utterance.lang }));
        setTimeout(() => utterance.onend?.({} as SpeechSynthesisEvent), 10);
      },
    } });
  });
  const lessonPath = `/lesson/fr/${restaurantLesson.id}`;
  const question = buildLessonListeningQuestion(restaurantLesson)!;
  await page.goto(`${lessonPath}/vocabulary`);
  await page.getByRole('button', { name: 'Continue to listening', exact: true }).click();
  await expect(page).toHaveURL(`${lessonPath}/listening`);
  const player = page.getByTestId('listening-question-player');
  const button = (name: string) => player.getByRole('button', { name, exact: true });
  const transcript = player.getByTestId('listening-transcript');
  await expect(transcript).toHaveCount(0);
  await button('Play sentence').click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('short-lesson-audio') ?? '{}')))
    .toEqual({ text: question.sentence, lang: 'fr-FR' });
  await expect(button('Replay sentence')).toBeVisible();
  await button('Show transcript').click();
  await expect(transcript).toContainText(question.sentence);
  await button('Hide transcript').click();
  await button(question.choices[question.correctIndex]!).click();
  await button('Check answer').click();
  const feedback = player.getByTestId('listening-feedback');
  await expect(feedback).toContainText(question.meaning);
  await expect(feedback).toContainText('You used transcript support');
  await expect(transcript).toContainText(question.sentence);
  await button('Continue to matching').click();
  await expect(page).toHaveURL(`${lessonPath}/picture`);
  await page.goBack();
  await expect(feedback).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(`${lessonPath}/listening`);
  await expect(feedback).toHaveCount(0);
  await button('Skip listening').click();
  await expect(page).toHaveURL(`${lessonPath}/picture`);
  const saved = await storedEvents<LearningEvent>(page, 'events');
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ activity: 'vocabulary', result: 'viewed' });
});

test('the final answer completes the lesson in place and retries both records together', async ({ page }) => {
  const location = '/lesson/fr/' + restaurantLesson.id;
  await page.goto(location + '/vocabulary');
  await expect(page.locator('[data-testid^="lesson-step-"]')).toHaveCount(5);
  await page.getByRole('button', { name: /Try picture practice/ }).click();
  const match = restaurantLesson.vocabulary.find(entry => entry.id === restaurantLesson.pictureActivity.entryId)!;
  await page.getByRole('button', { name: match.target, exact: true }).click();
  await page.getByRole('button', { name: /Build a sentence/ }).click();
  await expect(page.getByTestId('lesson-step-sentence')).toHaveAttribute('aria-current', 'step');
  await page.evaluate(() => {
    const add = IDBObjectStore.prototype.add;
    let rejected = false;
    IDBObjectStore.prototype.add = function (...args: Parameters<typeof add>) {
      const value = args[0] as Partial<LearningEvent>;
      if (this.name === 'events' && value.activity === 'completion' && !rejected) {
        rejected = true;
        throw new Error('Test interrupted completion');
      }
      return add.apply(this, args);
    };
  });
  await buildAcceptedSentence(page, restaurantLesson);
  const retry = page.getByRole('button', { name: 'Retry save', exact: true });
  await expect(retry).toBeVisible();
  await expect(page.getByTestId('lesson-step-dialogue')).toBeDisabled();
  expect((await storedEvents<LearningEvent>(page, 'events')).map(event => event.activity).sort()).toEqual(['picture', 'vocabulary']);
  await retry.click();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(location + '/sentence');
  const saved = await storedEvents<LearningEvent>(page, 'events');
  expect(saved.map(event => event.activity).sort()).toEqual(['completion', 'picture', 'sentence', 'vocabulary']);
  await page.goBack();
  await expect(page).toHaveURL(location + '/picture');
  await page.goForward();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await page.goto(location + '/finish');
  await expect(page).toHaveURL(location + '/sentence');
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  expect(await storedEvents<LearningEvent>(page, 'events')).toEqual(saved);

  const completion = saved.find(event => event.activity === 'completion')!;
  expect(completion.automaticCompletion).toBe(true);
  await page.evaluate(id => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('smartlingo-learning');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('events', 'readwrite');
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onabort = () => { database.close(); reject(transaction.error); };
      transaction.objectStore('events').delete(id);
    };
  }), completion.id);
  await page.reload();
  const backToLessons = page.getByRole('button', { name: 'Back to lessons', exact: true });
  await expect(backToLessons).toBeVisible();
  expect((await storedEvents<LearningEvent>(page, 'events')).some(event => event.activity === 'completion')).toBe(false);
  await backToLessons.click();
  await expect(page).toHaveURL(/\/learn\/fr\/topics\/Restaurant$/);
  expect((await storedEvents<LearningEvent>(page, 'events')).map(event => event.activity).sort()).toEqual(['completion', 'picture', 'sentence', 'vocabulary']);
});

test('French course section history is read-only and refresh keeps the same section', async ({ page }) => {
  const day = openCoursePilot.days[0];
  const dialogue = day.blocks.find(block => block.kind === 'dialogue')!;
  const practice = day.blocks.find(block => block.kind === 'choice')!;
  const location = `/course/fr/${openCoursePilot.id}/${day.id}`;
  await page.goto(`/course/fr/${openCoursePilot.id}`);
  await expect(page).toHaveURL(`${location}/${dialogue.id}`);
  const panel = page.getByTestId('open-course-panel');
  const outlineButton = panel.getByRole('button', { name: 'Course outline', exact: true });
  const outline = panel.getByRole('navigation', { name: 'Course outline' });
  const wide = page.viewportSize()!.width >= 900;
  if (wide) {
    await expect(outlineButton).toHaveCount(0);
    await expect(outline).toBeVisible();
    const bounds = (await outline.boundingBox())!;
    const lesson = (await panel.getByRole('heading', { name: `Lesson 1: ${day.title}`, exact: true }).boundingBox())!;
    expect(bounds.x + bounds.width).toBeLessThan(lesson.x);
  } else {
    await expect(outlineButton).toHaveAttribute('aria-expanded', 'false');
    await outlineButton.press('Enter');
    await expect(outlineButton).toHaveAttribute('aria-expanded', 'true');
    await expect(outline).toHaveAttribute('id', (await outlineButton.getAttribute('aria-controls'))!);
  }
  await expect(outline.getByRole('button', { name: 'Section 1: Dialogue' })).toHaveAttribute('aria-selected', 'true');
  await expect(outline.getByRole('button', { name: /^Choose lesson 1:/ })).toHaveAttribute('aria-selected', 'true');
  await expect(outline.getByRole('button', { name: /^Choose lesson / })).toHaveCount(5);
  await expect(outline.getByRole('button', { name: 'Section 1: Dialogue' })).toHaveAttribute('href', `${location}/${dialogue.id}`);
  expect(await storedEvents<CourseEvent>(page, 'courseEvents')).toEqual([]);
  if (!wide) {
    await outlineButton.press('Enter');
    await expect(outline).toHaveCount(0);
  }

  await panel.getByRole('button', { name: 'Next section', exact: true }).click();
  await expect(page).toHaveURL(`${location}/${practice.id}`);
  if (wide) await expect(outline.getByRole('heading', { name: 'Course outline' })).toBeInViewport();
  const initialEvents = await storedEvents<CourseEvent>(page, 'courseEvents');
  expect(initialEvents.map(event => event.kind).sort()).toEqual(['navigation', 'study']);

  await page.goBack();
  await expect(panel.getByRole('heading', { name: 'Dialogue', exact: true })).toBeVisible();
  await page.goForward();
  await expect(panel.getByRole('heading', { name: 'Quick practice', exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(`${location}/${practice.id}`);
  await expect(panel.getByRole('heading', { name: 'Quick practice', exact: true })).toBeVisible();
  expect(await storedEvents<CourseEvent>(page, 'courseEvents')).toEqual(initialEvents);

  if (!wide) await outlineButton.press('Enter');
  await outline.getByRole('button', { name: 'Section 1: Dialogue' }).press('Enter');
  await expect(page).toHaveURL(`${location}/${dialogue.id}`);
  if (!wide) await expect(outlineButton).toHaveAttribute('aria-expanded', 'false');
  await expect(panel.getByRole('heading', { name: 'Dialogue', exact: true })).toBeFocused();
  expect((await storedEvents<CourseEvent>(page, 'courseEvents')).filter(event => event.kind === 'study')).toHaveLength(1);
});

test('Japanese course deep links and Previous browse an unsaved day without writing progress', async ({ page }) => {
  const day = japaneseCourse.days[0];
  const [first, second] = day.blocks;
  const location = `/course/ja/${japaneseCourse.id}/${day.id}`;
  await page.goto(`${location}/${second.id}`);
  const panel = page.getByTestId('open-course-panel');
  await expect(panel.getByRole('heading', { name: second.title, exact: true })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Complete lesson', exact: true })).toBeDisabled();
  await panel.getByRole('button', { name: 'Previous section', exact: true }).click();
  await expect(page).toHaveURL(`${location}/${first.id}`);
  await expect(panel.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
  await page.goBack();
  await expect(panel.getByRole('heading', { name: second.title, exact: true })).toBeVisible();
  expect(await storedEvents<CourseEvent>(page, 'courseEvents')).toEqual([]);
});
