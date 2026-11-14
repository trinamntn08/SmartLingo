import { test, expect, type Page } from '@playwright/test';

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' });

async function expectPictureLoaded(page: Page) {
  await expect.poll(() => page.locator('img').evaluateAll(images => images.length > 0 && images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => [...document.querySelectorAll('*')].every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
}

async function storedRows(page: Page, store: 'events' | 'notebook') {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning', 1);
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

test('restaurant practice, help, notebook edits and completion survive reload without API', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await expect(button(page, /Start restaurant practice/)).toBeVisible();
  await expectPictureLoaded(page);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: info.outputPath('today.png'), fullPage: true });
  await button(page, /Start restaurant practice/).click();
  await expect(page.getByText('hello / good morning', { exact: true })).toHaveCount(0);
  await button(page, 'Show meaning').click();
  await expect(page.getByText('hello / good morning', { exact: true })).toBeVisible();
  await button(page, '+ Save word').click();
  await expect(page.getByText('Saved to your notebook.', { exact: false })).toBeVisible();
  await button(page, /Next word/).click();
  await page.reload();
  await button(page, /Continue your lesson/).click();
  await expect(page.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
  for (let index = 0; index < 4; index++) { await expectPictureLoaded(page); await button(page, /Next word/).click(); }
  await expectPictureLoaded(page);
  await button(page, /Continue to dialogue/).click();
  await expect(page.getByText( 'Je voudrais means', { exact: false })).toHaveCount(0);
  await button(page, 'Show grammar help').click();
  await expect(page.getByText('Je voudrais means', { exact: false })).toBeVisible();
  await button(page, /Try picture practice/).click();
  await button(page, 'l’addition').click();
  await expect(page.getByText('Take another look.', { exact: false })).toBeVisible();
  await button(page, 'Show a hint').click();
  await button(page, 'Hide hint').click();
  await button(page, 'un café').click();
  await page.reload();
  await button(page, /Continue your lesson/).click();
  for (const token of ['voudrais', 'Je', 'un café', 's’il vous plaît']) await button(page, token).click();
  await button(page, 'Check sentence').click();
  await expect(page.getByText('Try a different order.', { exact: false })).toBeVisible();
  await button(page, 'Clear').click();
  await button(page, 'Show a hint').click();
  await button(page, 'Hide hint').click();
  for (const token of ['Je', 'voudrais', 'un café', 's’il vous plaît']) await button(page, token).click();
  await button(page, 'Check sentence').click();
  await expect(page.getByText('That works. Your sentence is saved.')).toBeVisible();
  await page.screenshot({ path: info.outputPath('sentence.png'), fullPage: true });
  await page.reload();
  await button(page, /Continue your lesson/).click();
  await button(page, 'Finish and save session').click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  await button(page, 'Review').click();
  await button(page, 'Edit note').click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My morning greeting');
  await button(page, 'Save changes').click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await page.reload();
  await button(page, 'Review').click();
  await button(page, 'Show meaning').click();
  await expect(page.getByText('My morning greeting')).toBeVisible();
  await button(page, 'Today').click();
  await expect(page.getByText('✓ Session completed and saved', { exact: false })).toBeVisible();
  await button(page, /Revisit your lesson/).click();
  await button(page, 'Revisit the words').click();
  await expect(button(page, /In notebook/)).toBeDisabled();
  const notes = await storedRows(page, 'notebook');
  expect(notes).toHaveLength(1);
  expect(notes[0].meaning).toBe('My morning greeting');
  const events = await storedRows(page, 'events');
  expect(events.filter(event => event.activity === 'completion')).toHaveLength(1);
  expect(events.find(event => event.activity === 'picture' && event.result === 'correct')?.hints).toBe(1);
  expect(events.find(event => event.activity === 'sentence' && event.result === 'correct')?.hints).toBe(1);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test('stale tab capture preserves another tab’s notebook edit', async ({ page, context }) => {
  await page.goto('/');
  await button(page, /Start restaurant practice/).click();
  const stale = await context.newPage();
  await stale.goto('/');
  await button(stale, /Start restaurant practice/).click();
  await button(page, '+ Save word').click();
  await expect(page.getByText('Saved to your notebook.', { exact: false })).toBeVisible();
  await button(page, 'Review').click();
  await button(page, 'Edit note').click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('Keep my personal note');
  await button(page, 'Save changes').click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await button(stale, '+ Save word').click();
  await expect(button(stale, /In notebook/)).toBeDisabled();
  await button(stale, 'Review').click();
  await button(stale, 'Show meaning').click();
  await expect(stale.getByText('Keep my personal note')).toBeVisible();
  expect((await storedRows(page, 'notebook'))[0].meaning).toBe('Keep my personal note');
});

test('320px catalogue navigation works by keyboard and illustrations load', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await button(page, 'Explore').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Search lessons' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('textbox', { name: 'Search lessons' }).fill('bakery');
  await expect(page.getByText('At the restaurant', { exact: true })).toHaveCount(0);
  await expectPictureLoaded(page);
  await button(page, /Choose this lesson/).click();
  await expectNoHorizontalOverflow(page);
  await expectPictureLoaded(page);
  await page.screenshot({ path: info.outputPath('narrow-lesson.png'), fullPage: true });
  await button(page, 'Listen to bonjour').click();
  // Missing device voices never block the text activity.
  await expect(button(page, /Next word/)).toBeEnabled();
  await button(page, /Next word/).click();
  await expect(page.getByRole('heading', { name: 'une baguette', exact: true })).toBeVisible();
  await expectPictureLoaded(page);
});

test('storage denial explains the problem and never claims a saved change', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'indexedDB', { value: undefined }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('couldn’t be opened');
  await button(page, /Start restaurant practice/).click();
  await expect(button(page, '+ Save word')).toBeDisabled();
  await expect(button(page, /Next word/)).toBeDisabled();
  await button(page, 'Retry opening storage').click();
  await expect(page.getByRole('alert')).toContainText('couldn’t be opened');
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
  await button(page, /Start restaurant practice/).click();
  await button(page, /Next word/).click();
  await expect(page.getByRole('alert')).toContainText('hasn’t been confirmed as saved');
  await button(page, 'Retry save').click();
  await expect(page.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
  expect(await storedRows(page, 'events')).toHaveLength(1);
});
