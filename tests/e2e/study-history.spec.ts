import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, openCoursePilot, restaurantLesson } from '@smartlingo/content';
import type { CourseEvent, LearningEvent } from '@smartlingo/domain';
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
  await expect(page).toHaveURL(`${location}/vocabulary`);
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await expect(page).toHaveURL(`${location}/dialogue`);
  await page.getByRole('button', { name: /Try picture practice/ }).click();
  await expect(page).toHaveURL(`${location}/picture`);
  await page.getByRole('button', { name: 'Show a hint', exact: true }).click();

  await page.goBack();
  await expect(page).toHaveURL(`${location}/dialogue`);
  await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Hide hint', exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(`${location}/picture`);
  await expect(page.getByRole('button', { name: 'Show a hint', exact: true })).toBeVisible();

  const events = await storedEvents<LearningEvent>(page, 'events');
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ activity: 'vocabulary', result: 'viewed' });
});

test('the final answer completes the lesson in place and retries both records together', async ({ page }) => {
  const location = '/lesson/fr/' + restaurantLesson.id;
  await page.goto(location + '/vocabulary');
  await expect(page.locator('[data-testid^="lesson-step-"]')).toHaveCount(4);
  await page.getByRole('button', { name: 'Continue to dialogue', exact: true }).click();
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
  await panel.getByRole('button', { name: 'Next section', exact: true }).click();
  await expect(page).toHaveURL(`${location}/${practice.id}`);
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
});

test('Japanese course deep links and Previous browse an unsaved day without writing progress', async ({ page }) => {
  const day = japaneseCourse.days[0];
  const [first, second] = day.blocks;
  const location = `/course/ja/${japaneseCourse.id}/${day.id}`;
  await page.goto(`${location}/${second.id}`);
  const panel = page.getByTestId('open-course-panel');
  await expect(panel.getByRole('heading', { name: second.title, exact: true })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Complete study day', exact: true })).toBeDisabled();
  await panel.getByRole('button', { name: 'Previous section', exact: true }).click();
  await expect(page).toHaveURL(`${location}/${first.id}`);
  await expect(panel.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
  await page.goBack();
  await expect(panel.getByRole('heading', { name: second.title, exact: true })).toBeVisible();
  expect(await storedEvents<CourseEvent>(page, 'courseEvents')).toEqual([]);
});
