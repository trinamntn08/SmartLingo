import { guidedLessonButton, expectDialoguePhoto, expectFrenchTranscripts, openGrammar, openKeyPhrases, openRestaurant, openTopic } from './learner-journeys';
import { test, expect, type Page } from '@playwright/test';
import { getFrenchTopicPractice, getLearnerGrammar, lessons, restaurantLesson } from '@smartlingo/content';

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' });

async function expectPictureLoaded(page: Page) {
  await expect.poll(() => page.locator('img').evaluateAll(images => images.length > 0 && images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('the food-needs dialogue keeps the complete French and English transcripts separate', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await openTopic(page, 'Restaurant');
  await button(page, 'Open Explain food needs').click();
  const stage = page.getByTestId('lesson-stage');
  const lesson = lessons.find(item => item.id === 'fr.restaurant.explain-food-needs')!;
  const brief = getLearnerGrammar(lesson);
  const { french } = await expectFrenchTranscripts(stage, lesson.dialogue);
  await expectDialoguePhoto(stage, 'french-bistro-dialogue.jpg');
  await expect(french.getByRole('button', { name: `Listen to ${lesson.dialogue[0].target}`, exact: true })).toBeVisible();
  const grammar = stage.getByTestId('grammar-note');
  await expect(grammar).toHaveCount(0);
  await expect(button(page, 'Next')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await button(page, 'Next').click();
  const label = stage.getByRole('heading', { name: 'Key phrases', exact: true });
  await expect(label).toBeFocused();
  await expect(label).toHaveCSS('opacity', '0');
  await expect(grammar).toHaveCount(0);
  await button(page, 'Next').click();
  await expect(page).toHaveURL(`/lesson/fr/${lesson.id}/grammar`);
  await expect(grammar.getByRole('heading', { name: brief.title, exact: true })).toBeVisible();
  await expect(grammar).toContainText(brief.explanation);
  await expect(stage.getByTestId(`vocabulary-${lesson.vocabulary[0].id}`)).toHaveCount(0);
  await page.reload();
  await expect(grammar).toBeVisible();
  await button(page, 'Next').click();
  await expect(page).toHaveURL(/\/listening$/);
});

async function storedRows(page: Page, store: 'events' | 'notebook') {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, store);
}

test('restaurant details are visible directly and practice/notebook completion survive reload without API', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await expect(guidedLessonButton(page)).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath('today.png'), fullPage: true });
  await openRestaurant(page);
  await expect(page.getByText('hello / good morning', { exact: true })).toBeVisible();
  await expect(page.getByText(restaurantLesson.vocabulary[0].example, { exact: true })).toBeVisible();
  await expect(page.getByText(restaurantLesson.vocabulary[0].exampleMeaning, { exact: true })).toBeVisible();
  await expect(page.getByText('A polite greeting when you arrive.', { exact: true })).toBeVisible();
  await expect(button(page, /Show meaning|Show example translation|Show word note/)).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('vocabulary.png'), fullPage: true });
  await expect(page.getByRole('heading', { name: 'bonjour', exact: true })).toBeVisible();
  for (const word of ['un café', 'de l’eau', 'la carte', 'l’addition', 's’il vous plaît'])
    await expect(page.getByRole('heading', { name: word, exact: true })).toBeVisible();
  await expectPictureLoaded(page);
  await expect(page.getByTestId('vocabulary-fr.cafe').getByText('m.', { exact: true })).toBeVisible();
  await expect(page.getByTestId('vocabulary-fr.eau').getByText('f.', { exact: true })).toBeVisible();
  await expect(button(page, 'Listen to bonjour')).toHaveText('bonjour');
  const speakerBox = await button(page, 'Listen to bonjour').boundingBox();
  expect(speakerBox!.width).toBeGreaterThanOrEqual(44);
  expect(speakerBox!.height).toBeGreaterThanOrEqual(44);
  await expect(button(page, /Next word/)).toHaveCount(0);
  await button(page, 'Save bonjour').click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await button(page, 'Read conversation').click();
  await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await expect(page.getByTestId('grammar-note')).toHaveCount(0);
  await expect(page.getByText('Hello! What would you like?', { exact: true })).toBeVisible();
  await expect(button(page, /Show translation|Show grammar help/)).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('dialogue.png'), fullPage: true });
  await openKeyPhrases(page);
  await expect(page.getByTestId('grammar-note')).toHaveCount(0);
  await openGrammar(page);
  await expect(page.getByTestId('grammar-note')).toContainText(getLearnerGrammar(restaurantLesson).explanation);
  await page.getByRole('navigation', { name: 'Lesson steps' }).getByRole('link', { name: 'Key phrases', exact: true }).click();
  await button(page, /Try picture practice/).click();
  await button(page, 'l’addition').click();
  await expect(page.getByText('Take another look.', { exact: false })).toBeVisible();
  await button(page, 'Show a hint').click();
  await button(page, 'Hide hint').click();
  await button(page, 'un café').click();
  await expect(button(page, 'Next')).toBeEnabled();
  await page.reload();
  await button(page, 'Next').click();
  for (const token of ['voudrais', 'Je', 'un café', 's’il vous plaît']) await button(page, token).click();
  await button(page, 'Check sentence').click();
  await expect(page.getByText('Try a different order.', { exact: false })).toBeVisible();
  await button(page, 'Clear').click();
  await button(page, 'Show a hint').click();
  await button(page, 'Hide hint').click();
  for (const token of ['Je', 'voudrais', 'un café', 's’il vous plaît']) await button(page, token).click();
  await button(page, 'Check sentence').click();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await expect(page.getByText('10–12 min with practice', { exact: true })).toBeVisible();
  const task = getFrenchTopicPractice(restaurantLesson)!;
  const transfer = page.getByTestId('french-transfer-practice');
  await expect(transfer.getByText(task.prompt, { exact: true })).toBeVisible();
  await expect(transfer.getByText(task.modelTarget, { exact: true })).toHaveCount(0);
  const beforeTransfer = await storedRows(page, 'events');
  await button(page, 'Show example reply').click();
  await expect(transfer.getByText(task.modelMeaning, { exact: true })).toBeVisible();
  await expect(transfer.getByText(task.check, { exact: true })).toBeVisible();
  expect(await storedRows(page, 'events')).toEqual(beforeTransfer);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath('sentence.png'), fullPage: true });
  await page.reload();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await button(page, 'Review').click();
  await button(page, 'Edit note').click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My morning greeting');
  await button(page, 'Save changes').click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('My morning greeting')).toBeVisible();
  await openTopic(page, restaurantLesson.topic);
  const revisit = button(page, `Open ${restaurantLesson.subtitle}`);
  await expect(revisit).toContainText('Revisit');
  await revisit.click();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Lesson steps' }).getByRole('link', { name: 'Key phrases', exact: true }).click();
  await expect(button(page, 'Unsave bonjour')).toHaveAttribute('aria-pressed', 'true');
  const notes = await storedRows(page, 'notebook');
  expect(notes).toHaveLength(1);
  expect(notes[0].meaning).toBe('My morning greeting');
  const events = await storedRows(page, 'events');
  const overviewEvents = events.filter(event => event.lessonId === 'fr.restaurant.customer'
    && event.activity === 'vocabulary' && event.result === 'viewed');
  expect(overviewEvents).toHaveLength(1);
  expect(overviewEvents[0].itemId).toBe('fr.restaurant.customer');
  expect(events.filter(event => event.activity === 'completion')).toHaveLength(1);
  expect(events.find(event => event.activity === 'picture' && event.result === 'correct')?.hints).toBe(1);
  expect(events.find(event => event.activity === 'sentence' && event.result === 'correct')?.hints).toBe(1);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test('stale tab capture preserves another tab’s notebook edit', async ({ page, context }) => {
  await page.goto('/');
  await openRestaurant(page);
  const stale = await context.newPage();
  await stale.goto('/');
  await openRestaurant(stale);
  await button(page, 'Save bonjour').click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await button(page, 'Review').click();
  await button(page, 'Edit note').click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('Keep my personal note');
  await button(page, 'Save changes').click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await button(stale, 'Save bonjour').click();
  await expect(button(stale, 'Unsave bonjour')).toHaveAttribute('aria-pressed', 'true');
  await button(stale, 'Review').click();
  await expect(stale.getByText('Keep my personal note')).toBeVisible();
  expect((await storedRows(page, 'notebook'))[0].meaning).toBe('Keep my personal note');
});

test('320px catalogue navigation works by keyboard and illustrations load', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true }));
  await page.goto('/');
  await button(page, 'Learn').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Search lessons' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('textbox', { name: 'Search lessons' }).fill('bakery');
  await expect(page.getByText('At the restaurant', { exact: true })).toHaveCount(0);
  await button(page, 'Topic Bakery').click();
  await button(page, 'Open At the bakery').click();
  await openKeyPhrases(page);
  await expectNoHorizontalOverflow(page);
  await expectPictureLoaded(page);
  await page.screenshot({ path: info.outputPath('narrow-lesson.png'), fullPage: true });
  await button(page, 'Listen to bonjour').click();
  await expect(page.getByRole('alert')).toContainText('No French device voice');
  const title = page.getByRole('heading', { name: 'bonjour', exact: true });
  const titleBox = await title.boundingBox();
  expect(titleBox!.height).toBeLessThan(100);
  await expectNoHorizontalOverflow(page);
  // Missing device voices never block the text activity.
  await page.screenshot({ path: info.outputPath('narrow-voice-error.png'), fullPage: true });
  await expect(page.getByRole('heading', { name: 'une baguette', exact: true })).toBeVisible();
  await expect(button(page, 'Try picture practice')).toBeEnabled();
  await button(page, 'Try picture practice').click();
  await expect(page.getByRole('heading', { name: 'Match a picture', exact: true })).toBeVisible();
});

test('speaker icon plays and stops through keyboard controls', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class { constructor(public text: string) {} },
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [{ lang: 'fr-FR' }],
        speak: (utterance: SpeechSynthesisUtterance) => { document.documentElement.dataset.spoken = utterance.text; },
        cancel: () => { document.documentElement.dataset.stopped = 'true'; },
      },
    });
  });
  await page.goto('/');
  await openRestaurant(page);
  const speaker = button(page, 'Listen to bonjour');
  await speaker.focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Stop audio')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.spoken)).toBe('bonjour');
  await page.evaluate(() => { delete document.documentElement.dataset.stopped; });
  await page.keyboard.press('Space');
  await expect(speaker).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.dataset.stopped)).toBe('true');
  await expect(button(page, 'Try picture practice')).toBeEnabled();
});

test('storage denial explains the problem and never claims a saved change', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'indexedDB', { value: undefined }));
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: 'Your learning data' })).toContainText('couldn’t be opened');
  await openRestaurant(page);
  await expect(button(page, 'Save bonjour')).toBeDisabled();
  await button(page, 'Try picture practice').click();
  await expect(page.getByRole('heading', { name: 'Match a picture', exact: true })).toBeVisible();
  await button(page, 'Retry opening storage').click();
  await expect(page.getByRole('alert').filter({ hasText: 'Your learning data' })).toContainText('couldn’t be opened');
});

test('failed save can retry once without duplicate practice', async ({ page }) => {
  await page.addInitScript(() => {
    const original = IDBDatabase.prototype.transaction;
    let failed = false;
    IDBDatabase.prototype.transaction = function (...args: Parameters<IDBDatabase['transaction']>) {
      if (args[1] === 'readwrite' && !failed) {
        failed = true;
        throw new DOMException('Storage is temporarily full.', 'QuotaExceededError');
      }
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  await openRestaurant(page);
  await button(page, 'Try picture practice').click();
  await expect(page.getByRole('alert')).toContainText('hasn’t been confirmed as saved');
  await expect(button(page, 'Try picture practice')).toBeDisabled();
  await button(page, 'Retry save').click();
  await expect(page.getByRole('heading', { name: 'Match a picture', exact: true })).toBeVisible();
  expect(await storedRows(page, 'events')).toHaveLength(1);
});
