import { expect, test } from '@playwright/test';
import { japaneseCourse } from '@smartlingo/content';
import { guidedLessonButton, openCourseOutline, openProfileSection } from '../e2e/learner-journeys';

test.beforeEach(async ({ request }) => { await request.post('/__test__/mode'); });

test('Japanese B1 study, readings, saved vocabulary and exact cursor cold-start offline', async ({ page, context, baseURL }, info) => {
  const remoteRequests: string[] = [];
  context.on('request', request => {
    const url = new URL(request.url());
    if (['http:', 'https:'].includes(url.protocol) && !['localhost', '127.0.0.1'].includes(url.hostname)) remoteRequests.push(request.url());
  });
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Change language', exact: true }).click();
  await page.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  const panel = cold.getByTestId('open-course-panel');
  await guidedLessonButton(panel).click();
  await openCourseOutline(panel);
  await panel.getByRole('button', { name: 'B1', exact: true }).click();
  const day = japaneseCourse.days.at(-1)!;
  await panel.getByRole('button', { name: `Choose lesson ${day.dayNumber}: ${day.title}`, exact: true }).click();
  const index = day.blocks.findIndex(block => block.kind === 'vocabulary');
  await openCourseOutline(panel);
  await panel.getByRole('button', { name: `Section ${index + 1}: ${day.blocks[index].title}`, exact: true }).click();
  const word = day.vocabulary[0];
  const card = panel.getByTestId(`vocabulary-${word.id}`);
  await expect(card.getByText(word.reading!, { exact: true })).toBeVisible();
  await card.getByRole('button', { name: `Save ${word.target}`, exact: true }).click();
  await expect(card.getByText(`Saved ${word.target} to your notebook.`, { exact: true })).toBeVisible();
  await cold.reload();
  await expect(panel.getByTestId(`course-block-${day.blocks[index].id}`)).toBeVisible();
  await expect(panel.getByRole('button', { name: `Save ${word.target}`, exact: true })).toBeDisabled();
  await panel.getByRole('button', { name: 'Authorship and review', exact: true }).click();
  await expect(panel.getByText(`Rights: ${japaneseCourse.provenance!.rights}`, { exact: true })).toBeVisible();
  expect(remoteRequests).toEqual([]);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await cold.screenshot({ path: info.outputPath('japanese-cold-offline.png'), fullPage: true });
});
