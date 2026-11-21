import { openRestaurant } from './learner-journeys';
import { test, expect, type Page } from '@playwright/test';
import { restaurantLesson } from '@smartlingo/content';

async function proxyTestContent(page: Page) {
  await page.route('**/127.0.0.1:3001/**', async route => {
    const response = await route.fetch({ url: route.request().url().replace(':3001', ':3002') });
    await route.fulfill({ response });
  });
}

async function learningRows(page: Page, name: string) {
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
  }, name);
}

test('isolated editor draft, preview and explicit publication reach cached learner content', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'One publication writer against the isolated in-memory test API.');
  await proxyTestContent(page);
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const originalEvents = await learningRows(page, 'events');
  const originalNotebook = await learningRows(page, 'notebook');
  await page.getByRole('button', { name: 'Open curriculum editor', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Lesson subtitle', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search curriculum', exact: true }).fill('restaurant');
  await page.getByRole('button', { name: 'Restaurant · At the restaurant', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Publish reviewed revision', exact: true })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Lesson subtitle', exact: true }).fill('A coffee with confidence');
  await page.getByRole('textbox', { name: 'Lesson topic', exact: true }).fill('Café visits');
  await page.getByRole('textbox', { name: 'Learner role', exact: true }).fill('Guest');
  await page.getByRole('textbox', { name: 'Estimated duration in minutes', exact: true }).fill('12');
  await page.getByRole('button', { name: 'Lesson level A2', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Lesson level A2', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('textbox', { name: 'bonjour — English meaning', exact: true }).fill('A greeting reviewed in this isolated test');
  await page.getByRole('textbox', { name: 'Dialogue line 1 — Speaker role', exact: true }).fill('Host');
  await page.getByRole('textbox', { name: 'Dialogue line 1 — French text', exact: true }).fill('Bonjour ! Vous préférez une table à l’intérieur ou en terrasse ?');
  await page.getByRole('textbox', { name: 'Dialogue line 1 — English translation', exact: true }).fill('Hello! Would you prefer a table inside or outside?');
  await page.getByRole('textbox', { name: 'un café — Word note', exact: true }).fill('');
  await page.getByRole('button', { name: 'un café — No gender', exact: true }).click();
  await expect(page.getByRole('button', { name: 'un café — No gender', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Preview saved revision', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Save draft revision', exact: true }).click();
  await expect(page.getByText(`Draft revision ${restaurantLesson.revision + 1} saved locally.`, { exact: false })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'un café — Word note', exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'Preview saved revision', exact: true }).click();
  await expect(page.getByText(`Saved revision ${restaurantLesson.revision + 1} · temporary practice`, { exact: true })).toBeVisible();
  await expect(page.getByText('Estimated duration: 12 minutes', { exact: true })).toBeVisible();
  await expect(page.getByTestId('vocabulary-fr.cafe').getByText('m.', { exact: true })).toHaveCount(0);
  // Preview practice and word capture never touch the real notebook/history.
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await expect(page.getByText('Host', { exact: true })).toBeVisible();
  await expect(page.getByText('Bonjour ! Vous préférez une table à l’intérieur ou en terrasse ?', { exact: true })).toBeVisible();
  await expect(page.getByText('Hello! Would you prefer a table inside or outside?', { exact: true })).toBeVisible();
  expect(await learningRows(page, 'events')).toEqual(originalEvents);
  expect(await learningRows(page, 'notebook')).toEqual(originalNotebook);
  await expect(page.getByText('Accepted sentence answers', { exact: false })).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.screenshot({ path: info.outputPath('publication-review.png'), fullPage: true });
  await page.getByRole('button', { name: 'Publish reviewed revision', exact: true }).click();
  await expect(page.getByText(`Published revision ${restaurantLesson.revision + 2} to the local catalogue.`, { exact: false })).toBeVisible();
  // A later draft stays separate from the active publication.
  await page.getByRole('textbox', { name: 'Lesson subtitle', exact: true }).fill('UNPUBLISHED later changes');
  await page.getByRole('textbox', { name: 'Estimated duration in minutes', exact: true }).fill('30');
  await page.getByRole('button', { name: 'Save new draft revision', exact: true }).click();
  await expect(page.getByText(`Draft revision ${restaurantLesson.revision + 3} saved locally.`, { exact: false })).toBeVisible();
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await page.getByRole('button', { name: 'Load published lessons', exact: true }).click();
  await expect(page.getByText('1 published lesson saved in this browser.')).toBeVisible();
  expect(await learningRows(page, 'events')).toEqual(originalEvents);
  expect(await learningRows(page, 'notebook')).toEqual(originalNotebook);
  // Shut off this page's API access and verify publication survives reload from IndexedDB.
  await page.unroute('**/127.0.0.1:3001/**');
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.reload();
  await expect(page.getByText('A coffee with confidence', { exact: true })).toBeVisible();
  await expect(page.getByText('UNPUBLISHED later changes', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Guest', { exact: true })).toBeVisible();
  await expect(page.getByText('12 min · 6 useful words', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Topic Café visits', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Vocabulary · 6', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Foundations level', exact: true }).click();
  await expect(page.getByText('No matches.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'A1 level', exact: true }).click();
  await expect(page.getByText('No matches.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'bonjour', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).click();
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await page.getByRole('button', { name: /Start restaurant practice/ }).click();
  await expect(page.getByText('Published', { exact: true })).toBeVisible();
  await expect(page.getByText('A greeting reviewed in this isolated test', { exact: true })).toBeVisible();
  await expect(page.getByTestId('vocabulary-fr.cafe').getByText('m.', { exact: true })).toHaveCount(0);
  await expect(page.getByText('In France, un café usually means an espresso.', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Save bonjour', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save bonjour', exact: true })).toContainText('In notebook');
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await expect(page.getByText('Host', { exact: true })).toBeVisible();
  await expect(page.getByText('Bonjour ! Vous préférez une table à l’intérieur ou en terrasse ?', { exact: true })).toBeVisible();
  await expect(page.getByText('Hello! Would you prefer a table inside or outside?', { exact: true })).toBeVisible();
});

test('editor unavailable state preserves the independent learner flow', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#editor');
  await expect(page.getByRole('alert')).toContainText('editor request');
  await expect(page.getByRole('button', { name: 'Retry loading lessons', exact: true })).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('*')].every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
  await page.screenshot({ path: info.outputPath('editor-unavailable.png'), fullPage: true });
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
});

test('narrow editor keeps unsaved text when returning to the learner', async ({ page }, info) => {
  await proxyTestContent(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#editor');
  const title = page.getByRole('textbox', { name: 'Lesson title', exact: true });
  await expect(title).toBeVisible();
  const duration = page.getByRole('textbox', { name: 'Estimated duration in minutes', exact: true });
  await duration.fill('17');
  await title.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('Unsaved local form');
  const dialogue = page.getByRole('textbox', { name: 'Dialogue line 1 — French text', exact: true });
  await dialogue.fill('Bonjour, vous avez une réservation pour ce soir ?');
  await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('*')].every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
  await page.screenshot({ path: info.outputPath('narrow-editor-form.png'), fullPage: true });
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).click();
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(page.getByRole('button', { name: /Start greetings practice/ })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Open curriculum editor', exact: true }).click();
  await expect(title).toHaveValue('Unsaved local form');
  await expect(duration).toHaveValue('17');
  await expect(dialogue).toHaveValue('Bonjour, vous avez une réservation pour ce soir ?');
  await expect(page.getByRole('button', { name: 'Preview saved revision', exact: true })).toBeDisabled();
});

test('empty dialogue fields cannot send a draft save and the narrow form can recover', async ({ page }, info) => {
  await proxyTestContent(page);
  await page.setViewportSize({ width: 320, height: 740 });
  const writes: string[] = [];
  page.on('request', request => { if (request.method() === 'POST' && request.url().endsWith('/draft')) writes.push(request.url()); });
  await page.goto('/#editor');
  const french = page.getByRole('textbox', { name: 'Dialogue line 1 — French text', exact: true });
  await expect(french).toBeVisible();
  await french.fill('');
  await page.getByRole('button', { name: /Save (new )?draft revision/, exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('editor request');
  await expect(page.getByText('Required fields need text;', { exact: false })).toBeVisible();
  expect(writes).toEqual([]);
  await french.fill('Bonjour, vous avez une réservation pour ce soir ?');
  await expect(page.getByRole('button', { name: /Save (new )?draft revision/, exact: true })).toBeEnabled();
  await french.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('narrow-dialogue-fields.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('textbox', { name: 'Dialogue line 1 — English translation', exact: true })).toBeVisible();
});

test('invalid duration text cannot send a draft and unsaved duration protects navigation', async ({ page }, info) => {
  await proxyTestContent(page);
  await page.setViewportSize({ width: 320, height: 740 });
  let writes = 0;
  page.on('request', request => { if (request.method() === 'POST' && request.url().endsWith('/draft')) writes++; });
  await page.goto('/#editor');
  const duration = page.getByRole('textbox', { name: 'Estimated duration in minutes', exact: true });
  await expect(duration).toBeVisible();
  for (const invalid of ['', '0', '-1', '1.5', '1e1', '61', 'abc']) {
    await duration.fill(invalid);
    await page.getByRole('button', { name: /Save (new )?draft revision/, exact: true }).click();
    await expect(page.getByText('Estimated duration must be a whole number from 1 to 60 minutes. Correct this field before saving.', { exact: true })).toBeVisible();
    await expect(duration).toHaveValue(invalid);
    await expect(page.getByRole('button', { name: 'Preview saved revision', exact: true })).toBeDisabled();
  }
  expect(writes).toBe(0);
  await duration.fill('60');
  await page.getByRole('button', { name: 'Reload latest revision', exact: true }).click();
  await expect(page.getByText('Keep your unsaved edits?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(duration).toHaveValue('60');
  await page.getByRole('button', { name: 'Reload latest revision', exact: true }).click();
  await page.getByRole('button', { name: 'Discard edits and continue', exact: true }).click();
  await expect(duration).not.toHaveValue('60');
  expect(writes).toBe(0);
  await duration.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('duration-editor.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
