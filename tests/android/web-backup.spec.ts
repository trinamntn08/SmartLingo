import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('the web preview still exports learning as a browser download', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.getByText('LOCAL PREVIEW', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open curriculum editor', exact: true })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const saved = await download;
  const path = info.outputPath('web-learning-backup.json');
  await saved.saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.format).toBe('smartlingo-learning-backup');
  expect(backup.version).toBe(3);
  await expect(page.getByText('Backup download requested.', { exact: false })).toBeVisible();
});
