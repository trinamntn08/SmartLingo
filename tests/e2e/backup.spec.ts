import { openRestaurant } from './learner-journeys';
import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function eventCount(page: Page, storeName = 'events'): Promise<number> {
  return page.evaluate(async storeName => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<number>((resolve, reject) => {
        const request = database.transaction(storeName).objectStore(storeName).count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  }, storeName);
}

test('download and explicit restore recover learning in a fresh browser without overwriting local edits', async ({ page, browser }, info) => {
  test.setTimeout(60000);
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.getByRole('button', { name: 'Needed help', exact: true }).click();
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const file = await downloaded;
  const path = info.outputPath('learning-backup.json');
  await file.saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.format).toBe('smartlingo-learning-backup');
  expect(backup.events).toHaveLength(1);
  expect(backup.notebook).toHaveLength(1);
  expect(backup.version).toBe(3);
  expect(backup.courseEvents).toEqual([]);
  expect(backup.reviewEvents).toHaveLength(1);
  expect(backup).not.toHaveProperty('credentials');

  const fresh = await browser.newContext({ viewport: { width: 320, height: 740 } });
  await fresh.route('**/127.0.0.1:3001/**', route => route.abort());
  try {
    const restored = await fresh.newPage();
    await restored.goto('http://localhost:8081');
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    const input = restored.getByLabel('Choose a learning backup', { exact: true });
    await input.setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
    await expect(restored.getByRole('alert')).toContainText('not a supported');
    expect(await eventCount(restored)).toBe(0);
    await input.setInputFiles(path);
    await expect(restored.getByText('1 practice events', { exact: true })).toBeVisible();
    expect(await eventCount(restored)).toBe(0);
    await expect(restored.getByRole('button', { name: 'Restore backup', exact: true })).toBeDisabled();
    await restored.getByRole('checkbox').check();
    await restored.screenshot({ path: info.outputPath('backup-preview.png'), fullPage: true });
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Practice events: 0 added, 1 already kept.', { exact: false })).toBeVisible();
    expect(await eventCount(restored)).toBe(1);
    expect(await eventCount(restored, 'reviewEvents')).toBe(1);
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await restored.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(restored.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Edit note', exact: true }).click();
    await restored.getByRole('textbox', { name: 'English meaning', exact: true }).fill('Keep my newer personal note');
    await restored.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(restored.getByText('Changes saved in this browser.')).toBeVisible();
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(path);
    await restored.getByRole('checkbox').check();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Notebook entries: 0 added, 1 existing notes kept.', { exact: false })).toBeVisible();
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await restored.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(restored.getByText('Keep my newer personal note')).toBeVisible();
    expect(await eventCount(restored)).toBe(1);
  } finally { await fresh.close(); }
});
