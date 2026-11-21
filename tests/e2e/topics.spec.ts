import { test, expect } from '@playwright/test';
import { lessons } from '@smartlingo/content';
import { groupLessonTopics, matchesVocabulary, normalizeAnswer } from '@smartlingo/domain';

const topics = groupLessonTopics(lessons);
const groceryCount = topics.find(topic => topic.name === 'Groceries')!.vocabulary.length;

async function expectPicturesLoaded(page: import('@playwright/test').Page) {
  await expect.poll(() => page.locator('img').evaluateAll(images => images.length > 0
    && images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
}

test('new foundations and A2 experience lessons expose translated study material without API', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  for (const [slug, level] of [['essentials', 'foundation'], ['past', 'A2']] as const) {
    const lesson = lessons.find(item => item.id.startsWith(`fr.${slug}.`) && item.level === level)!;
    const topicButton = page.getByRole('button', { name: `Topic ${lesson.topic}`, exact: true });
    await topicButton.scrollIntoViewIfNeeded();
    await topicButton.click();
    await page.getByRole('button', { name: level === 'foundation' ? 'Foundations level' : 'A2 level', exact: true }).click();
    await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
    const entry = lesson.vocabulary[0];
    await expect(page.getByText(entry.meaning, { exact: true })).toBeVisible();
    await expect(page.getByText(entry.exampleMeaning, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Continue to dialogue/ }).click();
    await expect(page.getByText(lesson.dialogue[0].meaning, { exact: true })).toBeVisible();
    await expect(page.getByText(lesson.grammar.explanation, { exact: true })).toBeVisible();
  }
});

test('topic words are directly readable, searchable and save to the notebook without API', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page.getByText(`${topics.length} everyday topics · ${[...new Set(lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}`, { exact: true })).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('appointment');
  await page.getByRole('button', { name: 'Explore Health and appointments →', exact: true }).click();
  await expect(page.getByText('30 words · 5 short lessons', { exact: true })).toBeVisible();
  await search.fill('');
  await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'un rendez-vous', exact: true })).toBeVisible();
  await expect(page.getByText('an appointment', { exact: true })).toBeVisible();
  const appointment = lessons.flatMap(lesson => lesson.vocabulary).find(entry => entry.id === 'fr.health.rendez-vous')!;
  await expect(page.getByText(appointment.exampleMeaning, { exact: true })).toBeVisible();
  await expect(page.getByTestId('vocabulary-fr.health.rendez-vous').getByText('m.', { exact: true })).toBeVisible();
  await expect(page.getByText('Masculine noun; the spelling is unchanged in the plural.', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Synthetic device voice', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Save un rendez-vous', exact: true }).click();
  await expect(page.getByText('Saved un rendez-vous to your notebook.', { exact: true })).toBeVisible();
  await search.fill('rendez');
  const matches = topics.find(topic => topic.name === 'Health and appointments')!.vocabulary.filter(entry => matchesVocabulary(entry, 'rendez')).length;
  await expect(page.getByRole('heading', { name: `Vocabulary · ${matches}`, exact: true })).toBeVisible();
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
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
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
  let answer = normalizeAnswer(lesson.sentenceActivity.answers[0]);
  while (remaining.length) {
    const next = remaining.find(piece => answer === normalizeAnswer(piece.token) || answer.startsWith(`${normalizeAnswer(piece.token)} `));
    if (!next) throw new Error(`Cannot build ${lesson.id}: ${answer}`);
    await page.getByRole('button', { name: next.token, exact: true }).click();
    answer = answer.slice(normalizeAnswer(next.token).length).trimStart();
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

test('desktop topic pane stays to the left and switches an open lesson directly to its word bank', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  const content = page.getByTestId('learner-content');
  const topics = page.getByTestId('topic-navigation');
  const contentBox = await content.boundingBox();
  const topicsBox = await topics.boundingBox();
  expect(contentBox).not.toBeNull();
  expect(topicsBox).not.toBeNull();
  expect(topicsBox!.x + topicsBox!.width).toBeLessThanOrEqual(contentBox!.x + 1);

  const groceriesLesson = lessons.find(lesson => lesson.topic === 'Groceries')!;
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Groceries →', exact: true }).click();
  await page.getByRole('button', { name: `Open ${groceriesLesson.subtitle}`, exact: true }).click();
  await expect(page.getByRole('heading', { name: groceriesLesson.vocabulary[0].target, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Topic Groceries', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).click();
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /Start greetings practice/ }).click();
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
});

test('320px horizontal topic strip reaches topics and topic changes clear stale search and level filters', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('bakery');
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  const nav = page.getByTestId('topic-navigation');
  const groceries = nav.getByRole('button', { name: 'Topic Groceries', exact: true });
  await groceries.scrollIntoViewIfNeeded();
  await expect(groceries).toBeInViewport();
  await groceries.click();
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
  await expect(search).toHaveValue('');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
