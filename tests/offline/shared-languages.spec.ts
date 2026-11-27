import { expect, test } from '@playwright/test';
import { japaneseLessons, lessons } from '@smartlingo/content';
import { buildAcceptedSentence, openKeyPhrases, openLessonFromTopics, openProfileSection, openTodayStudyOptions, openTopic } from '../e2e/learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });
test.beforeEach(async ({ request }) => { await request.post('/__test__/mode'); });

test('Today study links and the Cloud French and Japanese drafts load from a cold download', async ({ page, context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/today/fr');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();

  const cold = await context.newPage();
  await cold.goto('/today/fr');
  await expect(cold.getByTestId('today-next-step').getByRole('img')).toHaveCount(0);
  const studyOptions = await openTodayStudyOptions(cold);
  await studyOptions.getByRole('link', { name: 'Browse all lessons', exact: true }).click();
  await expect(cold.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
  for (const id of ['fr.cycling.rent', 'fr.household-waste.sorting', 'ja.cafe.drinks']) {
    const lesson = [...lessons, ...japaneseLessons].find(item => item.id === id)!;
    await cold.goto(`/lesson/${lesson.language === 'ja-JP' ? 'ja' : 'fr'}/${id}/dialogue`);
    await expect(cold.getByRole('heading', { name: lesson.title, exact: true })).toBeVisible();
    await expect(cold.getByText(lesson.dialogue[0].meaning, { exact: true })).toBeVisible();
  }
  const japanese = japaneseLessons.find(lesson => lesson.id === 'ja.cafe.drinks')!;
  await cold.goto('/lesson/ja/ja.cafe.drinks/sentence');
  await buildAcceptedSentence(cold, japanese);
  await expect(cold.getByText(japanese.sentenceActivity.explanation, { exact: true })).toBeVisible();
});

test('the same French and Japanese lesson widgets and notebooks cold-start and switch offline', async ({ page, context, baseURL }, info) => {
  test.setTimeout(90000);
  const remote: string[] = [];
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await openLessonFromTopics(page, lessons[0]);
  await openKeyPhrases(page);
  const french = lessons[0].vocabulary[0];
  await page.getByRole('button', { name: `Save ${french.target}`, exact: true }).click();
  await expect(page.getByRole('button', { name: `Save ${french.target}`, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  context.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) remote.push(request.url()); });
  await context.setOffline(true); await page.close();
  const cold = await context.newPage(); await cold.goto(baseURL!);
  await cold.getByRole('button', { name: 'Change language', exact: true }).click();
  await cold.getByRole('button', { name: 'Learn Japanese', exact: true }).click();
  const lesson = japaneseLessons[0]; const japanese = lesson.vocabulary[0];
  await openTopic(cold, lesson.topic);
  await cold.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
  await expect(cold.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await cold.reload();
  await expect(cold.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await openKeyPhrases(cold);
  const card = cold.getByTestId(`vocabulary-${japanese.id}`);
  await expect(card.getByText(japanese.exampleMeaning, { exact: true })).toBeVisible();
  await cold.getByRole('button', { name: `Save ${japanese.target}`, exact: true }).click();
  await expect(cold.getByRole('button', { name: `Save ${japanese.target}`, exact: true })).toBeDisabled();
  await cold.getByRole('button', { name: /Try meaning practice/ }).click();
  await cold.getByRole('button', { name: lesson.vocabulary.find(word => word.id === lesson.pictureActivity.entryId)!.target, exact: true }).click();
  await cold.getByRole('button', { name: 'Next', exact: true }).click();
  await buildAcceptedSentence(cold, lesson);
  await expect(cold.getByText('Lesson complete', { exact: true })).toBeVisible();
  await cold.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(cold.getByTestId('notebook-entries').getByRole('heading', { name: japanese.target, exact: true })).toBeVisible();
  await expect(cold.getByTestId('notebook-entries').getByRole('heading', { name: french.target, exact: true })).toHaveCount(0);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await cold.screenshot({ path: info.outputPath('shared-japanese-offline.png'), fullPage: true });
  await cold.getByRole('button', { name: 'Change language', exact: true }).click();
  await cold.getByRole('button', { name: 'Learn French', exact: true }).click();
  await cold.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(cold.getByTestId('notebook-entries').getByRole('heading', { name: french.target, exact: true })).toBeVisible();
  expect(remote).toEqual([]);
});
