import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, openCoursePilot, restaurantLesson } from '@smartlingo/content';
import type { CourseEvent, LearningEvent } from '@smartlingo/domain';

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
  await expect(page.getByRole('heading', { name: 'A small conversation', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Hide hint', exact: true })).toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(`${location}/picture`);
  await expect(page.getByRole('button', { name: 'Show a hint', exact: true })).toBeVisible();

  const events = await storedEvents<LearningEvent>(page, 'events');
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ activity: 'vocabulary', result: 'viewed' });
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
