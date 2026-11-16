import { expect, test } from '@playwright/test';
import { lessons, restaurantLesson } from '@smartlingo/content';
import { buildAcceptedSentence } from './learner-journeys';

const opening = lessons.find(lesson => lesson.id === 'fr.greetings.hello-goodbye')!;
const greetingTopic = 'Everyday greetings and politeness';

test.beforeEach(async ({ context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('fresh Today starts greetings with readable arrival and departure support, saved words and persistent practice', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText(opening.subtitle, { exact: true })).toBeVisible();
  const start = page.getByRole('button', { name: /Start greetings practice/ });
  await start.focus();
  await page.keyboard.press('Enter');
  for (const target of ['bonjour', 'bonsoir', 'bonne journée', 'bonne soirée']) {
    const entry = opening.vocabulary.find(word => word.target === target)!;
    const card = page.getByTestId(`vocabulary-${entry.id}`);
    await expect(card.getByRole('heading', { name: target, exact: true })).toBeVisible();
    await expect(card.getByText(entry.meaning, { exact: true })).toBeVisible();
    await expect(card.getByText(entry.exampleMeaning, { exact: true })).toBeVisible();
    if (entry.note) await expect(card.getByText(entry.note, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole('button', { name: /Show meaning|Show example translation|Show word note/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Save bonsoir', exact: true }).click();
  await expect(page.getByText('Saved bonsoir to your notebook.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await expect(page.getByText(opening.dialogue[0].meaning, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(opening.grammar.explanation, { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Continue your lesson/ }).click();
  await expect(page.getByRole('heading', { name: 'A small conversation', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Try meaning practice/ }).click();
  const target = opening.vocabulary.find(entry => entry.id === opening.pictureActivity.entryId)!;
  await expect(page.getByText(target.meaning, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: target.target, exact: true }).click();
  await expect(page.getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Build a sentence/ }).click();
  await buildAcceptedSentence(page, opening);
  await expect(page.getByText('That works. Your sentence is saved.', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Continue your lesson/ }).click();
  await page.getByRole('button', { name: 'Finish and save session', exact: true }).click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('bonsoir', { exact: true }).first()).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('bonsoir', { exact: true }).first()).toBeVisible();
  await page.screenshot({ path: info.outputPath('greetings-notebook.png'), fullPage: true });
  expect(errors).toEqual([]);
});

for (const width of [1280, 320]) {
  test(`greetings lead the topic navigation at ${width}px and Foundations stay separate from A1`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const nav = page.getByTestId('topic-navigation');
    expect(await nav.getByRole('button').evaluateAll(buttons => buttons.slice(1, 5).map(button => button.getAttribute('aria-label'))))
      .toEqual([greetingTopic, 'Essential conversation tools', 'Numbers and quantities', 'People and introductions'].map(topic => `Topic ${topic}`));
    const first = nav.getByRole('button', { name: `Topic ${greetingTopic}`, exact: true });
    await first.scrollIntoViewIfNeeded();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('24 words · 3 short lessons', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Foundations level', exact: true }).click();
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(3);
    await expect(page.getByRole('button', { name: /^Open / })).toHaveText(['Practise →', 'Practise →', 'Practise →']);
    expect(await page.getByRole('button', { name: /^Open / }).evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label'))))
      .toEqual(lessons.filter(lesson => lesson.id.startsWith('fr.greetings.')).map(lesson => `Open ${lesson.subtitle}`));
    await page.getByRole('button', { name: 'A1 level', exact: true }).click();
    await expect(page.getByText('No matches.', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(0);
    await page.getByRole('button', { name: 'Clear search and filters', exact: true }).click();
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('a pre-existing Restaurant attempt still resumes its dialogue after the greetings-first update', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
  const oldEvent = { id: '3cf282d5-af5d-416f-bdaa-7a7ebf4c934c', lessonId: restaurantLesson.id, revision: restaurantLesson.revision,
    itemId: restaurantLesson.id, activity: 'vocabulary', result: 'viewed', hints: 0, occurredAt: '2026-11-14T10:00:00.000Z' };
  await page.evaluate(async event => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction('events', 'readwrite');
        transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error);
        transaction.objectStore('events').add(event);
      });
    } finally { database.close(); }
  }, oldEvent);
  await page.reload();
  await expect(page.getByText(restaurantLesson.subtitle, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Continue your lesson/ }).click();
  await expect(page.getByRole('heading', { name: 'A small conversation', exact: true })).toBeVisible();
  await expect(page.getByText(restaurantLesson.dialogue[0].meaning, { exact: true })).toBeVisible();
});

test('a cached published greeting override retains its content and first topic position after reload', async ({ page }) => {
  const published = { ...opening, revision: opening.revision + 1, status: 'published', subtitle: 'Reviewed greeting override' };
  await page.route('**/127.0.0.1:3001/published-lessons', route => route.fulfill({ json: { lessons: [published] } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Load published lessons', exact: true }).click();
  await expect(page.getByText('1 published lesson saved in this browser.', { exact: true })).toBeVisible();
  await page.unroute('**/127.0.0.1:3001/published-lessons');
  await page.reload();
  await expect(page.getByText(published.subtitle, { exact: true })).toBeVisible();
  const nav = page.getByTestId('topic-navigation');
  await expect(nav.getByRole('button').nth(1)).toHaveAttribute('aria-label', `Topic ${greetingTopic}`);
  await page.getByRole('button', { name: /Start greetings practice/ }).click();
  await expect(page.getByText('Published', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: published.subtitle, exact: true })).toBeVisible();
});
