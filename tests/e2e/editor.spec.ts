import { test, expect, type Page } from '@playwright/test';

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
  await page.getByRole('button', { name: /Start restaurant practice/ }).click();
  await page.getByRole('button', { name: '+ Save word', exact: true }).click();
  await expect(page.getByText('Saved to your notebook.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: /Next word/ }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const originalEvents = await learningRows(page, 'events');
  const originalNotebook = await learningRows(page, 'notebook');
  await page.getByRole('button', { name: 'Open curriculum editor', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Lesson subtitle', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Search curriculum', exact: true }).fill('restaurant');
  await page.getByRole('button', { name: 'Restaurant · At the restaurant', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Publish reviewed revision', exact: true })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Lesson subtitle', exact: true }).fill('A coffee with confidence');
  await page.getByRole('textbox', { name: 'bonjour — English meaning', exact: true }).fill('A greeting reviewed in this isolated test');
  await expect(page.getByRole('button', { name: 'Preview saved revision', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Save draft revision', exact: true }).click();
  await expect(page.getByText('Draft revision 2 saved locally.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Preview saved revision', exact: true }).click();
  await expect(page.getByText('Saved revision 2 · temporary practice', { exact: true })).toBeVisible();
  // Preview practice and word capture never touch the real notebook/history.
  await page.getByRole('button', { name: '+ Save word', exact: true }).click();
  await page.getByRole('button', { name: /Next word/ }).click();
  expect(await learningRows(page, 'events')).toEqual(originalEvents);
  expect(await learningRows(page, 'notebook')).toEqual(originalNotebook);
  await expect(page.getByText('Accepted sentence answers', { exact: false })).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.screenshot({ path: info.outputPath('publication-review.png'), fullPage: true });
  await page.getByRole('button', { name: 'Publish reviewed revision', exact: true }).click();
  await expect(page.getByText('Published revision 3 to the local catalogue.', { exact: false })).toBeVisible();
  // A later draft stays separate from the active publication.
  await page.getByRole('textbox', { name: 'Lesson subtitle', exact: true }).fill('UNPUBLISHED later changes');
  await page.getByRole('button', { name: 'Save new draft revision', exact: true }).click();
  await expect(page.getByText('Draft revision 4 saved locally.', { exact: false })).toBeVisible();
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
  await page.getByRole('button', { name: /Start restaurant practice/ }).click();
  await expect(page.getByText('Published', { exact: true })).toBeVisible();
  await expect(page.getByText('A greeting reviewed in this isolated test', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /In notebook/ })).toBeDisabled();
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
  await expect(page.getByRole('button', { name: /Start restaurant practice/ })).toBeVisible();
});

test('narrow editor keeps unsaved text when returning to the learner', async ({ page }, info) => {
  await proxyTestContent(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#editor');
  const title = page.getByRole('textbox', { name: 'Lesson title', exact: true });
  await expect(title).toBeVisible();
  await title.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type('Unsaved local form');
  await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('*')].every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
  await page.screenshot({ path: info.outputPath('narrow-editor-form.png'), fullPage: true });
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Open curriculum editor', exact: true }).click();
  await expect(title).toHaveValue('Unsaved local form');
  await expect(page.getByRole('button', { name: 'Preview saved revision', exact: true })).toBeDisabled();
});
