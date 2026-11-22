import { expect, test, type Page } from '@playwright/test';
import { japaneseCourse, japaneseLessons, lessons, openCoursePilot } from '@smartlingo/content';
import { openLessonFromTopics, openProfileSection, openTopic } from '../e2e/learner-journeys';

test.use({ storageState: { cookies: [], origins: [] }, timezoneId: 'Europe/Paris' });
test.beforeEach(async ({ request }) => { await request.post('/__test__/mode'); });
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

async function choose(page: Page, language: string) {
  if (await button(page, 'Change language').isVisible()) await button(page, 'Change language').click();
  await button(page, `Learn ${language}`).click();
  await expect(button(page, 'Report')).toBeVisible();
}

async function report(page: Page, language: 'French' | 'Japanese') {
  const catalogue = language === 'French' ? lessons : japaneseLessons;
  const course = language === 'French' ? openCoursePilot : japaneseCourse;
  const words = new Set([...catalogue.flatMap(lesson => lesson.vocabulary), ...course.days.flatMap(day => day.vocabulary)].map(word => word.id)).size;
  await button(page, 'Report').click();
  await expect(page.getByRole('heading', { name: 'Learning report', exact: true })).toBeVisible();
  for (const [id, value] of [['lessons', `0 / ${catalogue.length}`], ['explored', `${catalogue[0].vocabulary.length} / ${words}`], ['saved', '1'], ['days', `0 / ${course.days.length}`]]) {
    await expect(page.getByTestId(`report-${id}`).getByText(value, { exact: true })).toBeVisible();
  }
  const chart = page.getByTestId('report-week');
  for (let date = 16; date <= 22; date++) await expect(chart.getByLabel(new RegExp(`, 2026-11-${date}: ${date === 21 ? 1 : 0} actions`))).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('downloaded report cold-starts, switches saved language histories and retries a failed read without remote requests', async ({ page, context, baseURL }, info) => {
  test.setTimeout(90000);
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.clock.setFixedTime(new Date('2026-11-21T12:00:00.000Z'));
  await page.goto('/');
  // Build genuine saved activity through the ordinary lesson journey in both languages.
  for (const [language, lesson] of [['French', lessons[0]], ['Japanese', japaneseLessons[0]]] as const) {
    await choose(page, language);
    await openTopic(page, lesson.topic);
    await button(page, `Open ${lesson.subtitle}`).click();
    await button(page, `Save ${lesson.vocabulary[0].target}`).click();
    await expect(button(page, `Save ${lesson.vocabulary[0].target}`)).toBeDisabled();
    await page.getByRole('button', { name: /Continue to dialogue/ }).click();
    await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
    await report(page, language);
  }
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  await button(page, 'Download for offline use').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  const remote: string[] = [];
  context.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) remote.push(request.url());
  });
  await context.setOffline(true); await page.close();
  const cold = await context.newPage();
  await cold.clock.setFixedTime(new Date('2026-11-21T12:00:00.000Z'));
  await cold.goto(baseURL!);
  await report(cold, 'Japanese');
  await cold.screenshot({ path: info.outputPath('japanese-report-cold-offline.png'), fullPage: true });
  // A temporary IndexedDB read failure is surfaced; retry recovers the real saved counts.
  await cold.evaluate(() => {
    const original = IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll = function (...args: Parameters<IDBObjectStore['getAll']>) {
      if (this.name === 'notebook') {
        IDBObjectStore.prototype.getAll = original;
        throw new DOMException('Test report read failure', 'UnknownError');
      }
      return original.apply(this, args);
    };
    window.dispatchEvent(new Event('focus'));
  });
  await expect(button(cold, 'Retry report')).toBeVisible();
  await expect(cold.getByTestId('report-saved')).toHaveCount(0);
  await button(cold, 'Retry report').click();
  await report(cold, 'Japanese');
  await openLessonFromTopics(cold, japaneseLessons[0]);
  await expect(cold.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await choose(cold, 'French'); await report(cold, 'French');
  await cold.screenshot({ path: info.outputPath('french-report-cold-offline.png'), fullPage: true });
  await openLessonFromTopics(cold, lessons[0]);
  await expect(cold.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  expect(remote).toEqual([]);
});
