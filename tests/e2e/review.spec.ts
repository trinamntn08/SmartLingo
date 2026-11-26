import { openPhoneReview, openRestaurant } from './learner-journeys';
import { test, expect } from '@playwright/test';

test.use({ timezoneId: 'Europe/Paris' });

test('manual review saves once, retries safely, survives reload and follows local dates across DST', async ({ page }, info) => {
  await page.clock.install({ time: new Date('2026-03-28T11:00:00Z') });
  await page.addInitScript(() => {
    const original = IDBDatabase.prototype.transaction;
    let failed = sessionStorage.getItem('review-quota-tested') === '1';
    IDBDatabase.prototype.transaction = function (...args: Parameters<IDBDatabase['transaction']>) {
      if (args[0] === 'reviewEvents' && args[1] === 'readwrite' && !failed) {
        failed = true;
        sessionStorage.setItem('review-quota-tested', '1');
        throw new DOMException('Storage is temporarily full.', 'QuotaExceededError');
      }
      return original.apply(this, args);
    };
  });
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Focus review', exact: true }).click();
  await expect(page.getByText('1 card due', { exact: true })).toBeVisible();
  await expect(page.getByTestId('notebook-entries')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Remembered', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.screenshot({ path: info.outputPath('manual-review.png'), fullPage: true });
  await page.getByRole('button', { name: 'Remembered', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('temporarily full');
  await expect(page.getByRole('button', { name: 'Remembered', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Retry rating save', exact: true }).click();
  await expect(page.getByText('Next review: 2026-03-29.', { exact: false })).toBeVisible();
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Show notebook', exact: true }).click();
  await expect(page.getByTestId('notebook-entries')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await openPhoneReview(page);
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  // Paris advances its clock: this next local study day is only 23 elapsed hours later.
  await page.clock.setFixedTime(new Date('2026-03-29T10:00:00Z'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByText('1 card due', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reveal meaning', exact: true }).click();
  await page.getByRole('button', { name: 'Needed help', exact: true }).click();
  await expect(page.getByText('Next review: 2026-03-30.', { exact: false })).toBeVisible();
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  if ((page.viewportSize()?.width ?? 600) < 600) await page.getByRole('button', { name: 'Show notebook', exact: true }).click();
  await page.getByRole('button', { name: 'Edit note', exact: true }).click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('A revised greeting');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await openPhoneReview(page);
  await expect(page.getByText('1 card due', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remembered', exact: true })).toHaveCount(0);
});

test('returning to a stale review tab refreshes ratings from another tab', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-16T11:00:00Z') });
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await openPhoneReview(page);
  await expect(page.getByText('1 card due', { exact: true })).toBeVisible();
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const noteUpdatedAt = await new Promise<string>((resolve, reject) => {
        const request = database.transaction('notebook').objectStore('notebook').get('notebook.fr.bonjour');
        request.onsuccess = () => resolve(request.result.updatedAt); request.onerror = () => reject(request.error);
      });
      const transaction = database.transaction('reviewEvents', 'readwrite');
      const done = new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve(); transaction.onabort = () => reject(transaction.error);
      });
      for (const day of ['14', '15']) {
        transaction.objectStore('reviewEvents').add({
          id: day === '14' ? '11111111-1111-4111-8111-111111111111' : '22222222-2222-4222-8222-222222222222',
          notebookId: 'notebook.fr.bonjour', entryUpdatedAt: noteUpdatedAt, skill: 'recognition', source: 'manual', algorithmVersion: 1,
          rating: 'remembered', occurredAt: `2026-11-${day}T11:00:00Z`, studyDate: `2026-11-${day}`, timeZone: 'Europe/Paris',
        });
      }
      await done;
    } finally { database.close(); }
  });
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByText('You’re up to date for today.', { exact: true })).toBeVisible();
  await expect(page.getByText('Next scheduled review: 2026-11-18.', { exact: true })).toBeVisible();
});
