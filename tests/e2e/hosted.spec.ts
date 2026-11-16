import { expect, test } from '@playwright/test';

test.skip(process.env.EXPO_PUBLIC_SMARTLINGO_DEPLOYMENT_MODE !== 'hosted', 'Runs against the explicit hosted learner build.');

test('hosted learner exposes ordinary study without mounting local or paid-provider features', async ({ page }) => {
  const loopbackRequests: string[] = [];
  await page.route('**/127.0.0.1:3001/**', route => {
    loopbackRequests.push(route.request().url());
    return route.abort('blockedbyclient');
  });

  await page.goto('/#editor');
  await expect(page.getByText('FREE TEST PREVIEW', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /A little French/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open curriculum editor', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Practise with the lessons on this device.', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start AI conversation', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore Everyday greetings and politeness →', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Open / }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByText('Learner-only test website', { exact: true })).toBeVisible();
  await expect(page.getByText('Device speech only', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load published lessons', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'French phrase for neural audio' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Keep a copy of your learning', exact: true })).toBeVisible();

  expect(loopbackRequests).toEqual([]);
});

test('hosted learning backup restores into a fresh browser and survives a cold offline launch', async ({ page, browser }, info) => {
  test.setTimeout(90000);
  await page.route('**/127.0.0.1:3001/**', route => route.abort('blockedbyclient'));
  await page.goto('/');
  await page.getByRole('button', { name: /Start greetings practice/ }).click();
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Edit note', exact: true }).click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('hosted greeting note');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search notebook', exact: true }).fill('hosted greeting');
  await expect(page.getByText('hosted greeting note', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('hosted greeting note', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download learning backup', exact: true }).click();
  const backup = await download;
  const backupPath = info.outputPath('hosted-learning-backup.json');
  await backup.saveAs(backupPath);

  const fresh = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await fresh.route('**/127.0.0.1:3001/**', route => route.abort('blockedbyclient'));
  try {
    const restored = await fresh.newPage();
    await restored.goto('http://localhost:8082/');
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(backupPath);
    await restored.getByRole('checkbox').check();
    await restored.getByRole('button', { name: 'Restore backup', exact: true }).click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Reload learning', exact: true }).click();
    await restored.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(restored.getByText('hosted greeting note', { exact: true })).toBeVisible();
    await restored.getByRole('button', { name: 'Profile', exact: true }).click();
    await restored.getByRole('button', { name: 'Download for offline use', exact: true }).click();
    await expect(restored.getByText('Ready for offline use', { exact: true })).toBeVisible();
    await fresh.setOffline(true);
    await restored.close();
    const cold = await fresh.newPage();
    await cold.goto('http://localhost:8082/');
    await expect(cold.getByText('FREE TEST PREVIEW', { exact: true })).toBeVisible();
    await cold.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(cold.getByText('hosted greeting note', { exact: true })).toBeVisible();
  } finally {
    await fresh.close();
  }
});
