import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { openProfileSection } from '../e2e/learner-journeys';

test('web navigation, curriculum and backup keep their browser behaviour', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(page).toHaveURL('/today/fr');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page).toHaveURL('/learn/fr');
  await page.goBack();
  await expect(page).toHaveURL('/today/fr');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Curriculum tools');
  await expect(page.getByRole('button', { name: 'Open curriculum editor', exact: true })).toBeVisible();
  await openProfileSection(page, 'Offline & backups');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const saved = await download;
  const path = info.outputPath('web-learning-backup.json');
  await saved.saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup).toMatchObject({ format: 'smartlingo-learning-backup', version: 4 });
  await expect(page.getByText('Backup download requested.', { exact: false })).toBeVisible();
});
