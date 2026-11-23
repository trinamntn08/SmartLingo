import { expect, test } from '@playwright/test';
import { japaneseAlphabetLessons, lessons, restaurantLesson } from '@smartlingo/content';
import { openRestaurant } from './learner-journeys';

test('kana Back restores the answered character and Forward opens the next prompt', async ({ page }) => {
  const row = japaneseAlphabetLessons[0]!;
  const [first, second] = row.characters;
  await page.goto('/learn/ja/letters');
  await expect(page).toHaveURL(url => url.pathname === `/learn/ja/letters/${row.id}/study`);
  await page.getByRole('button', { name: 'Recognition practice', exact: true }).click();
  const firstAddress = new URL(page.url()).pathname;
  expect(firstAddress).toContain(`/recognition/${first!.id}`);
  await page.getByRole('button', { name: `Choose ${first!.kana}`, exact: true }).click();
  await expect(page.getByText(`Yes. ${first!.kana} is read “${first!.romaji}”.`)).toBeVisible();
  await page.getByRole('button', { name: 'Next character', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Which kana matches the sound?' })).toBeVisible();
  await page.getByRole('button', { name: 'Show reading', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Which character is “${second!.romaji}”?` })).toBeVisible();
  await page.goBack();
  await expect(page.getByText(`Yes. ${first!.kana} is read “${first!.romaji}”.`)).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('heading', { name: `Which character is “${second!.romaji}”?` })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark row studied', exact: true })).toBeDisabled();
  await page.reload();
  await expect(page).toHaveURL(url => url.pathname.endsWith(`/recognition/${second!.id}`));
  await expect(page.getByRole('heading', { name: 'Which kana matches the sound?' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark row studied', exact: true })).toBeDisabled();
});

test('speaking Back restores the revealed reply without playing audio', async ({ page }) => {
  const { id, revision, dialogue } = restaurantLesson;
  const path = `/learn/fr/speaking/${id}/${revision}`;
  await page.goto(`${path}/1`);
  await page.getByRole('button', { name: 'Show model reply', exact: true }).click();
  const reply = page.getByTestId('speaking-target');
  await expect(reply).toHaveText(dialogue[0]!.target);
  await page.getByRole('button', { name: 'Next line', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}/2$`));
  await page.goBack();
  await expect(reply).toHaveText(dialogue[0]!.target);
  await expect(page.getByRole('button', { name: 'Listen to model reply', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByTestId('speaking-line')).toContainText(dialogue[1]!.meaning);
});

test('review Back restores the notebook search and Forward reopens focused review', async ({ page }) => {
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.')).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'Search notebook', exact: true });
  await search.fill('bonjour');
  await page.getByRole('button', { name: 'Focus review', exact: true }).click();
  await expect(page).toHaveURL(/\/review\/fr\/practice$/);
  await expect(search).toBeHidden();
  await page.goBack();
  await expect(search).toBeVisible();
  await expect(search).toHaveValue('bonjour');
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Show notebook', exact: true })).toBeVisible();
  await expect(page.getByText('1 card due', { exact: true })).toBeVisible();
});

test('editor history keeps an unsaved form and restores previews without issuing a receipt', async ({ page }) => {
  const other = lessons.find(lesson => lesson.language === 'fr-FR' && lesson.id !== restaurantLesson.id)!;
  const catalogue = [restaurantLesson, other].map(lesson => ({ ...lesson, status: 'draft' as const }));
  const [first, second] = catalogue;
  const writes: string[] = [];
  await page.route('**/127.0.0.1:3001/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'Content-Type, X-SmartLingo-Editor' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (path === '/lessons') return route.fulfill({ json: { lessons: catalogue }, headers });
    if (route.request().method() === 'POST') writes.push(path);
    if (path.endsWith('/preview')) return route.fulfill({ json: { lesson: first, previewToken: '154bedfc-56ab-4096-8d91-c8cc600a072b' }, headers });
    return route.abort();
  });

  await page.goto(`/editor/${first!.id}`);
  const title = page.getByRole('textbox', { name: 'Lesson title', exact: true });
  await expect(title).toHaveValue(first!.title);
  await page.getByRole('textbox', { name: 'Search curriculum', exact: true }).fill(second!.subtitle);
  await page.getByRole('button', { name: `${second!.topic} · ${second!.subtitle}`, exact: true }).click();
  await title.fill('Unsaved navigation proof');
  await page.goBack();
  await expect(title).toHaveValue(first!.title);
  await page.goForward();
  await expect(title).toHaveValue('Unsaved navigation proof');
  expect(writes).toEqual([]);

  await page.goBack();
  await page.getByRole('button', { name: 'Preview saved revision', exact: true }).click();
  const preview = page.getByText(`Saved revision ${first!.revision} · temporary practice`, { exact: true });
  await expect(preview).toBeVisible();
  await page.goBack();
  await expect(title).toHaveValue(first!.title);
  await page.goForward();
  await expect(preview).toBeVisible();
  await expect(page.getByRole('checkbox')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Publish reviewed revision', exact: true })).toBeDisabled();
  expect(writes).toEqual([`/editor/lessons/${first!.id}/preview`]);
});
