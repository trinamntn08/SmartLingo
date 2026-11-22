import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const panel = (page: Page) => page.getByTestId('open-course-panel');
const launch = (page: Page) => panel(page).getByRole('button', { name: 'Open daily course', exact: true });
const [first, second] = openCoursePilot.days;
const path = (dayId: string) => `/course/fr/${openCoursePilot.id}/${dayId}`;

test('Today and Learn share the guided day, resume point and next session', async ({ context, page }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/today/fr');
  await expect(panel(page)).toHaveCount(1);
  await expect(launch(page)).toHaveAttribute('href', path(first.id));
  await button(page, 'Learn').click();
  await expect(launch(page)).toHaveAttribute('href', path(first.id));
  await expect(button(page, 'Vocabulary & lessons')).toBeVisible();
  await launch(page).click();
  await expect(button(page, 'Learn')).toHaveAttribute('aria-selected', 'true');
  await button(page, 'Next section').click();
  await expect(panel(page).getByRole('heading', { name: 'Quick practice', exact: true })).toBeVisible();
  const savedSection = page.url();
  await button(page, 'Today').click();
  await expect(panel(page).getByText('Resume your saved section.')).toBeVisible();
  await launch(page).click();
  await expect(page).toHaveURL(savedSection);
  await button(page, 'Skip practice').click();

  const reflection = panel(page).getByRole('heading', { name: 'Try it', exact: true });
  await expect(reflection).toBeVisible();
  const reflectionUrl = page.url();
  await page.getByTestId('daily-related-practice').getByRole('button', { name: 'Say hello and goodbye', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/fr\/fr\.greetings\.hello-goodbye\/vocabulary\?course=/);

  const copied = await context.newPage();
  await copied.goto(page.url());
  await button(copied, 'Back to study day').click();
  await expect(copied).toHaveURL(reflectionUrl);
  await copied.close();

  await button(page, 'Back to study day').click();
  await expect(page).toHaveURL(reflectionUrl);
  await expect(reflection).toBeVisible();
  await expect(panel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toHaveCount(0);
  await button(page, 'Finish lesson').click();
  await expect(panel(page).getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();

  await button(page, 'Close daily course').click();
  await expect(page).toHaveURL('/today/fr');
  await expect(launch(page)).toHaveAttribute('href', path(second.id));
  await button(page, 'Learn').click();
  await expect(launch(page)).toHaveAttribute('href', path(second.id));
  await launch(page).click();
  await expect(panel(page).getByRole('heading', { name: `Day 2: ${second.title}`, exact: true })).toBeVisible();
  await button(page, 'Close daily course').click();
  await expect(page).toHaveURL('/learn/fr');
});

test('a failed course save can be retried after Back leaves a reloaded course', async ({ context, page }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/languages');
  await button(page, 'Learn French').click();
  await launch(page).click();
  await expect(button(page, 'Next section')).toBeEnabled();
  await page.reload();
  await expect(button(page, 'Next section')).toBeEnabled();
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
  await button(page, 'Next section').click();
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
  await expect(panel(page).getByRole('heading', { name: 'Quick practice', exact: true })).toBeVisible();
});
