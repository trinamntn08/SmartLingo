import { test, expect } from '@playwright/test';
import { lessons } from '@smartlingo/content';

async function expectPicturesLoaded(page: import('@playwright/test').Page) {
  await expect.poll(() => page.locator('img').evaluateAll(images => images.length > 0
    && images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
}

test('topic words are directly readable, searchable and save to the notebook without API', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.getByText('12 everyday topics · A1–A2', { exact: true })).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('appointment');
  await page.getByRole('button', { name: 'Explore Health and appointments →', exact: true }).click();
  await expect(page.getByText('30 words · 5 short lessons', { exact: true })).toBeVisible();
  await search.fill('');
  await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'un rendez-vous', exact: true })).toBeVisible();
  await expect(page.getByText('an appointment', { exact: true })).toBeVisible();
  await expect(page.getByText('I would like an appointment.', { exact: true })).toBeVisible();
  await expect(page.getByText('Masculine noun; the spelling is unchanged in the plural.', { exact: true })).toBeVisible();
  await expect(page.getByText('Synthetic device voice', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Save un rendez-vous', exact: true }).click();
  await expect(page.getByText('Saved un rendez-vous to your notebook.', { exact: true })).toBeVisible();
  await search.fill('rendez');
  await expect(page.getByRole('heading', { name: 'Vocabulary · 1', exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('topic-word-search.png'), fullPage: true });
  await search.fill('no-such-word');
  await expect(page.getByText('No matches.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).click();
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  const a2Lessons = lessons.filter(lesson => lesson.topic === 'Health and appointments' && lesson.level === 'A2');
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(a2Lessons.length);
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('un rendez-vous', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('an appointment', { exact: true })).toBeVisible();
});

test('new A2 meaning and sentence practice work at 320px and survive reload', async ({ page }, info) => {
  const lesson = lessons.find(item => item.topic === 'Services and paperwork' && item.level === 'A2')!;
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Services and paperwork →', exact: true }).click();
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
  await expect(page.getByText(lesson.vocabulary[0].meaning, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('*')]
    .filter(element => !element.closest('[data-testid="topic-navigation"]'))
    .every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
  await page.screenshot({ path: info.outputPath('narrow-new-lesson.png'), fullPage: true });
  await expect(page.getByRole('heading', { name: lesson.vocabulary[5].target, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Next word/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await page.getByRole('button', { name: /Try meaning practice/ }).click();
  const target = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  await expect(page.getByText(target.meaning, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: target.target, exact: true }).click();
  await expect(page.getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Build a sentence/ }).click();
  // The first accepted answer is guaranteed buildable by the curriculum integrity check.
  const remaining = lesson.sentenceActivity.tokens.map((token, index) => ({ token, index }));
  let answer = lesson.sentenceActivity.answers[0];
  while (remaining.length) {
    const next = remaining.find(piece => answer === piece.token || answer.startsWith(`${piece.token} `));
    if (!next) throw new Error(`Cannot build ${lesson.id}: ${answer}`);
    await page.getByRole('button', { name: next.token, exact: true }).click();
    answer = answer.slice(next.token.length).trimStart();
    remaining.splice(remaining.indexOf(next), 1);
  }
  await page.getByRole('button', { name: 'Check sentence', exact: true }).click();
  await expect(page.getByText('That works. Your sentence is saved.', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Continue your lesson/ }).click();
  await page.getByRole('button', { name: 'Finish and save session', exact: true }).click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('desktop topic pane stays to the right and switches an open lesson directly to its word bank', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  const content = page.getByTestId('learner-content');
  const topics = page.getByTestId('topic-navigation');
  const contentBox = await content.boundingBox();
  const topicsBox = await topics.boundingBox();
  expect(contentBox).not.toBeNull();
  expect(topicsBox).not.toBeNull();
  expect(topicsBox!.x).toBeGreaterThanOrEqual(contentBox!.x + contentBox!.width - 1);

  const groceriesLesson = lessons.find(lesson => lesson.topic === 'Groceries')!;
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Groceries →', exact: true }).click();
  await page.getByRole('button', { name: `Open ${groceriesLesson.subtitle}`, exact: true }).click();
  await expect(page.getByRole('heading', { name: groceriesLesson.vocabulary[0].target, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Topic Groceries', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
});

test('320px horizontal topic strip reaches topics and topic changes clear stale search and level filters', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('bakery');
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  const nav = page.getByTestId('topic-navigation');
  const groceries = nav.getByRole('button', { name: 'Topic Groceries', exact: true });
  await groceries.scrollIntoViewIfNeeded();
  await expect(groceries).toBeInViewport();
  await groceries.click();
  await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
  await expect(search).toHaveValue('');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
