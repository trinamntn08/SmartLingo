import { openProfileSection } from './learner-journeys';
import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { NotebookEntry } from '@smartlingo/domain';

async function notes(page: Page): Promise<NotebookEntry[]> {
  return page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<NotebookEntry[]>((resolve, reject) => {
        const request = database.transaction('notebook').objectStore('notebook').getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  });
}

async function openForm(page: Page) {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Add personal word', exact: true }).click();
  return page.getByTestId('personal-word-form');
}

test('personal word works without API, survives edits/reload, enters review and appears in backup', async ({ page }, info) => {
  const form = await openForm(page);
  await form.getByRole('textbox', { name: 'New French word or phrase', exact: true }).fill('  à tout à l’heure  ');
  await form.getByRole('textbox', { name: 'New English meaning', exact: true }).fill('  see you later today  ');
  await form.getByRole('textbox', { name: 'New example or personal note', exact: true }).fill('À tout à l’heure, après le déjeuner.');
  await form.getByRole('button', { name: 'Save personal word', exact: true }).click();
  await expect(form.getByText('Saved à tout à l’heure to your notebook.', { exact: true })).toBeVisible();
  const saved = await notes(page);
  expect(saved).toHaveLength(1);
  expect(saved[0].id).toMatch(/^personal\.[0-9a-f-]{36}$/);
  expect(saved[0].sourceEntryId).toBe(saved[0].id);
  expect(saved[0].target).toBe('à tout à l’heure');
  expect(saved[0].meaning).toBe('see you later today');
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Edit note', exact: true }).click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My phrase for meeting again today');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Changes saved in this browser.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.getByRole('button', { name: 'Needed help', exact: true }).click();
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('personal-notebook.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const file = info.outputPath('personal-backup.json');
  await (await downloaded).saveAs(file);
  const backup = JSON.parse(await readFile(file, 'utf8'));
  expect(backup.notebook).toHaveLength(1);
  expect(backup.notebook[0].id).toBe(saved[0].id);
  expect(backup.notebook[0].meaning).toBe('My phrase for meeting again today');
  expect(backup.reviewEvents).toHaveLength(1);
  expect(backup.events).toHaveLength(0);
});

test('invalid and cancelled personal forms write no notebook entry', async ({ page }) => {
  const form = await openForm(page);
  await form.getByRole('button', { name: 'Save personal word', exact: true }).click();
  await expect(form.getByRole('alert')).toContainText('English meaning');
  expect(await notes(page)).toHaveLength(0);
  await form.getByRole('textbox', { name: 'New French word or phrase', exact: true }).fill('un rendez-vous');
  await form.getByRole('button', { name: 'Save personal word', exact: true }).click();
  expect(await notes(page)).toHaveLength(0);
  await form.getByRole('button', { name: 'Cancel personal word', exact: true }).click();
  await form.getByRole('button', { name: 'Add personal word', exact: true }).click();
  await expect(form.getByRole('textbox', { name: 'New French word or phrase', exact: true })).toHaveValue('');
  expect(await notes(page)).toHaveLength(0);
});

test('failed personal save keeps the form and retries the same entry once', async ({ page }) => {
  await page.addInitScript(() => {
    const original = IDBDatabase.prototype.transaction;
    let failed = false;
    IDBDatabase.prototype.transaction = function (...args: Parameters<IDBDatabase['transaction']>) {
      if (args[1] === 'readwrite' && !failed) { failed = true; throw new DOMException('Temporarily full', 'QuotaExceededError'); }
      return original.apply(this, args);
    };
    const uuid = crypto.randomUUID.bind(crypto);
    Object.assign(window, { personalIdCount: 0 });
    Object.defineProperty(crypto, 'randomUUID', { value() {
      (window as unknown as { personalIdCount: number }).personalIdCount++;
      return uuid();
    } });
  });
  const form = await openForm(page);
  await form.getByRole('textbox', { name: 'New French word or phrase', exact: true }).fill('un rendez-vous');
  await form.getByRole('textbox', { name: 'New English meaning', exact: true }).fill('an appointment');
  await form.getByRole('button', { name: 'Save personal word', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('hasn’t been confirmed as saved');
  await expect(form.getByRole('textbox', { name: 'New French word or phrase', exact: true })).toHaveValue('un rendez-vous');
  expect(await notes(page)).toHaveLength(0);
  await page.getByRole('button', { name: 'Retry save', exact: true }).click();
  await expect(form.getByText('Saved un rendez-vous to your notebook.', { exact: true })).toBeVisible();
  expect(await notes(page)).toHaveLength(1);
  expect(await page.evaluate(() => (window as unknown as { personalIdCount: number }).personalIdCount)).toBe(1);
});
