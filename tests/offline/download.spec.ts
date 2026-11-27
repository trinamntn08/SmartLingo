import { guidedLessonButton, buildAcceptedSentence, openKeyPhrases, openLessonFromTopics, openProfileSection, openRestaurant, openTopic, openTopicVocabulary } from '../e2e/learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { getFrenchTopicPractice, lessons, restaurantLesson } from '@smartlingo/content';

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' });

async function learningSnapshot(page: Page) {
  return page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      const transaction = database.transaction(['events', 'notebook', 'reviewEvents', 'publishedLessons']);
      return await Promise.all(['events', 'notebook', 'reviewEvents', 'publishedLessons'].map(name => new Promise<unknown[]>((resolve, reject) => {
        const request = transaction.objectStore(name).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      })));
    } finally { database.close(); }
  });
}

test.beforeEach(async ({ request, context }) => {
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await request.post('/__test__/mode');
});

test('a fresh offline download starts greetings and saves study, practice and notebook changes across cold reloads', async ({ page, context }, info) => {
  const opening = lessons.find(lesson => lesson.id === 'fr.greetings.hello-goodbye')!;
  await page.goto('/');
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  await expect(button(page, 'Download for offline use')).toBeEnabled();
  await button(page, 'Download for offline use').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Refresh offline status')).toBeEnabled();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto('/');
  await openLessonFromTopics(cold, opening);
  await expect(cold.getByTestId('grammar-explanation')).toHaveText(opening.grammar.explanation, { useInnerText: true });
  await cold.reload();
  await expect(cold.getByText(opening.dialogue[0].meaning, { exact: true }).first()).toBeVisible();
  await openKeyPhrases(cold);
  for (const target of ['bonsoir', 'bonne soirée']) {
    const entry = opening.vocabulary.find(word => word.target === target)!;
    const card = cold.getByTestId(`vocabulary-${entry.id}`);
    await expect(card.getByText(entry.meaning, { exact: true })).toBeVisible();
    await expect(card.getByText(entry.exampleMeaning, { exact: true })).toBeVisible();
  }
  await cold.getByTestId('vocabulary-fr.greetings.bonsoir').scrollIntoViewIfNeeded();
  await cold.screenshot({ path: info.outputPath('greetings-offline-study.png'), fullPage: true });
  await button(cold, 'Save bonsoir').click();
  await expect(cold.getByText('Saved bonsoir to your notebook.', { exact: true })).toBeVisible();
  await button(cold, /Try meaning practice/).click();
  const target = opening.vocabulary.find(entry => entry.id === opening.pictureActivity.entryId)!;
  await button(cold, target.target).click();
  await expect(cold.getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await button(cold, 'Next').click();
  await buildAcceptedSentence(cold, opening);
  await expect(cold.getByText('Lesson complete', { exact: true })).toBeVisible();
  await cold.reload();
  await expect(cold.getByText('Lesson complete', { exact: true })).toBeVisible();
  const transfer = cold.getByTestId('french-transfer-practice');
  const task = getFrenchTopicPractice(opening)!;
  await expect(transfer.getByText(task.prompt, { exact: true })).toBeVisible();
  await button(cold, 'Show example reply').click();
  await expect(transfer.getByText(task.modelTarget, { exact: true })).toBeVisible();
  const steps = cold.getByRole('navigation', { name: 'Lesson steps' });
  await steps.getByRole('link', { name: 'Dialogue' }).click();
  await expect(cold.getByRole('heading', { name: 'Read a conversation' })).toBeVisible();
  await steps.getByRole('link', { name: 'Build a sentence' }).click();
  await expect(cold.getByText('Lesson complete', { exact: true })).toBeVisible();
  const next = lessons.find(lesson => lesson.id === 'fr.greetings.politeness')!;
  await button(cold, `Next lesson: ${next.subtitle}`).click();
  await expect(cold.getByRole('heading', { name: next.subtitle, exact: true })).toBeVisible();
  await expect(cold.getByText('Lesson 2 of 3', { exact: true })).toBeVisible();
  await button(cold, 'Review').click();
  await expect(cold.getByText('bonsoir', { exact: true }).first()).toBeVisible();
  const [events, notebook] = await learningSnapshot(cold);
  expect(events).toHaveLength(4);
  expect(notebook).toEqual([expect.objectContaining({ sourceEntryId: 'fr.greetings.bonsoir', target: 'bonsoir', meaning: 'good evening' })]);
});

test('French slang cold-loads by URL with its photos and can save expressions offline', async ({ page, context }) => {
  await page.goto('/today/fr');
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  await button(page, 'Download for offline use').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Refresh offline status')).toBeEnabled();
  await context.setOffline(true);
  await page.close();

  const cold = await context.newPage();
  await cold.goto('/slang/fr');
  await expect(cold.getByRole('heading', { name: 'Everyday French & slang' })).toBeVisible();
  await cold.getByRole('textbox', { name: 'Search slang' }).fill('ca marche');
  const expression = cold.getByTestId(/^expression-fr\.slang\./).first();
  const heading = expression.getByRole('heading', { name: /ça marche/i });
  await expect(heading).toBeVisible();
  const photos = cold.locator('img[src^="/slang-photos/"]');
  await expect.poll(() => photos.evaluateAll(images => images.length >= 2 && images.every(img => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const target = (await heading.textContent())!;
  await button(cold, `Save ${target}`).click();
  await expect(button(cold, 'In notebook')).toBeDisabled();
  const [events, notebook] = await learningSnapshot(cold);
  expect(events).toEqual([]);
  expect(notebook).toEqual([expect.objectContaining({ target })]);
});

test('explicit download cold-loads offline and asset removal preserves every learner store', async ({ page, context, request }, info) => {
  await page.goto('/');
  await openRestaurant(page);
  await button(page, 'Save bonjour').click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await button(page, 'Try picture practice').click();
  await button(page, 'Review').click();
  await button(page, 'Reveal meaning').click();
  await button(page, 'Needed help').click();
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Curriculum tools');
  await page.route('**/127.0.0.1:3001/published-lessons', route => route.fulfill({ json: {
    lessons: [{ ...restaurantLesson, revision: 10, status: 'published', subtitle: 'Isolated cached publication' }],
  } }));
  await button(page, 'Load published lessons').click();
  await expect(page.getByText('1 published lesson saved in this browser.', { exact: true })).toBeVisible();
  await page.unroute('**/127.0.0.1:3001/published-lessons');
  const before = await learningSnapshot(page);
  expect(before.map(rows => rows.length)).toEqual([1, 1, 1, 1]);
  await openProfileSection(page, 'Offline & backups');
  await expect(button(page, 'Download for offline use')).toBeEnabled();
  expect(await page.evaluate(() => caches.keys())).toEqual([]);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  const manifest = await request.get('/offline-manifest.json');
  expect(manifest.ok()).toBe(true);
  const { files } = await manifest.json() as { files: { url: string }[] };
  expect(files.filter(({ url }) => url.startsWith('/vocabulary-photos/'))).toEqual([]);
  await button(page, 'Download for offline use').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Refresh offline status')).toBeEnabled();
  await page.getByRole('heading', { name: 'Learn offline', exact: true }).locator('..').screenshot({ path: info.outputPath('offline-ready.png') });
  expect(await learningSnapshot(page)).toEqual(before);
  await page.evaluate(async () => { const cache = await caches.open('unrelated-owner-cache'); await cache.put('/unrelated', new Response('keep me')); });
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto('/');
  await expect(guidedLessonButton(cold)).toBeVisible();
  await expect.poll(() => cold.evaluate(() => Array.from(document.fonts).some(font => font.family === 'Inter' && font.status === 'loaded'))).toBe(true);
  await openTopic(cold, restaurantLesson.topic);
  await expect(cold.getByText('Isolated cached publication', { exact: true })).toBeVisible();
  await button(cold, 'Open Isolated cached publication').click();
  await expect(cold.getByTestId('lesson-stage')).toBeVisible();
  await openKeyPhrases(cold);
  await expect(cold.getByRole('heading', { name: 'bonjour', exact: true })).toBeVisible();
  await expect(button(cold, 'Save bonjour')).toBeDisabled();
  await expect.poll(() => cold.locator('img').evaluateAll(images => images.length > 0 && images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await button(cold, 'Learn').click();
  await button(cold, 'Topic Restaurant').click();
  const restaurantPhoto = cold.getByAltText(/^Topic context:/);
  if (info.project.name === 'desktop') {
    await expect(restaurantPhoto).toHaveAttribute('src', '/generated-vocabulary-photos/restaurant.jpg');
    await expect.poll(() => restaurantPhoto.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await openTopicVocabulary(cold);
  const coffeePhoto = cold.getByTestId('vocabulary-fr.cafe').locator('img[src^="/generated-vocabulary-photos/"]');
  await expect(coffeePhoto).toHaveAttribute('src', '/generated-vocabulary-photos/espresso.jpg');
  await expect.poll(() => coffeePhoto.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await button(cold, 'Review').click();
  await expect(cold.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await button(cold, 'Profile').click();
  await openProfileSection(cold, 'Offline & backups');
  await expect(cold.getByText('Ready for offline use', { exact: true })).toBeVisible();
  expect(await learningSnapshot(cold)).toEqual(before);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await button(cold, 'Remove downloaded assets').click();
  await button(cold, 'Cancel removal').click();
  await expect(cold.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await button(cold, 'Remove downloaded assets').click();
  await button(cold, 'Confirm removal').focus();
  await cold.keyboard.press('Enter');
  await expect(cold.getByText('No offline copy saved yet.', { exact: true })).toBeVisible();
  expect(await learningSnapshot(cold)).toEqual(before);
  expect(await cold.evaluate(() => caches.keys())).toEqual(['unrelated-owner-cache']);
  await cold.close();
  const removed = await context.newPage();
  await expect(removed.goto('/')).rejects.toThrow();
});

test('interrupted download and corrupted update can retry while preserving the last complete copy', async ({ page, context, request }, info) => {
  await page.goto('/');
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  await expect(button(page, 'Download for offline use')).toBeEnabled();
  await request.post('/__test__/mode?fail=1');
  await button(page, 'Download for offline use').click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(button(page, 'Retry download')).toBeEnabled();
  await expect(page.getByText('Download incomplete — offline launch is not ready.', { exact: true })).toBeVisible();
  await request.post('/__test__/mode');
  await button(page, 'Retry download').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Refresh offline status')).toBeEnabled();
  const firstBuild = await page.evaluate(async () => (await (await fetch('/offline-manifest.json')).json()).buildId);
  await request.post('/__test__/mode?updated=1&corrupt=1');
  await button(page, 'Refresh offline status').click();
  await expect(page.getByText('A different build is available to download.', { exact: false })).toBeVisible();
  await button(page, 'Update offline copy').click();
  await expect(page.getByRole('alert')).toContainText('integrity');
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Retry download')).toBeEnabled();
  await page.getByRole('alert').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('offline-update-error.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // The old complete copy still cold-loads after the failed update.
  await context.setOffline(true);
  await page.close();
  const old = await context.newPage();
  await old.goto('/');
  await expect(old.locator('meta[name="smartlingo-test-build"]')).toHaveCount(0);
  await button(old, 'Profile').click();
  await openProfileSection(old, 'Offline & backups');
  await expect(old.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(false);
  await button(old, 'Refresh offline status').click();
  await expect(button(old, 'Update offline copy')).toBeEnabled();
  await button(old, 'Update offline copy').click();
  await expect(old.getByText('Your offline copy is ready.', { exact: true })).toBeVisible();
  const completeBuilds = await old.evaluate(async () => {
    const builds: string[] = [];
    for (const name of await caches.keys()) {
      if (!name.startsWith('smartlingo-assets-v1-')) continue;
      const response = await (await caches.open(name)).match('/__smartlingo_offline_complete__');
      if (response) builds.push((await response.json()).manifest.buildId);
    }
    return builds;
  });
  expect(completeBuilds).toHaveLength(2);
  expect(completeBuilds).toContain(firstBuild);
  await context.setOffline(true);
  await old.close();
  const updated = await context.newPage();
  await updated.goto('/');
  await expect(updated.locator('meta[name="smartlingo-test-build"]')).toHaveAttribute('content', 'updated');
  await expect(guidedLessonButton(updated)).toBeVisible();
});

test('a stalled connection falls back to the saved document within a few seconds', async ({ page, context, request }) => {
  await page.goto('/');
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  await expect(button(page, 'Download for offline use')).toBeEnabled();
  await button(page, 'Download for offline use').click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await expect(button(page, 'Refresh offline status')).toBeEnabled();
  await request.post('/__test__/mode?stall=1');
  await page.close();
  const stalled = await context.newPage();
  const start = Date.now();
  await stalled.goto('/?from=saved');
  await expect(guidedLessonButton(stalled)).toBeVisible();
  expect(Date.now() - start).toBeLessThan(10000);
});
