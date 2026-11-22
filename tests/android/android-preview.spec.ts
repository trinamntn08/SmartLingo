import { expect, test } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';

test.beforeEach(async ({ page }) => {
  // This fixture checks the JS/native boundary, not an actual Android WebView.
  await page.addInitScript(() => {
    const runtime = window as unknown as {
      androidBridge: object;
      Capacitor: object;
      backupRequest?: { filename: string; contents: string };
      completeBackup?: (saved: boolean) => void;
    };
    runtime.androidBridge = {};
    runtime.Capacitor = {
      PluginHeaders: [{ name: 'LearningBackup', methods: [{ name: 'save', rtype: 'promise' }] }],
      nativePromise(plugin: string, method: string, options: { filename: string; contents: string }) {
        if (plugin !== 'LearningBackup' || method !== 'save') return Promise.reject(new Error('Unexpected native call'));
        runtime.backupRequest = options;
        return new Promise((resolve, reject) => {
          runtime.completeBackup = saved => saved ? resolve({ saved: true }) : reject(new Error('Backup export cancelled.'));
        });
      },
    };
  });
});

test('Android preview studies and resumes locally, hides PC features and confirms backup writes', async ({ page }, info) => {
  const externalRequests: string[] = [];
  page.on('request', request => {
    if (request.url().startsWith('http://127.0.0.1:3001/')) externalRequests.push(request.url());
  });
  await page.goto('/#editor');
  await expect(page.getByText('ANDROID TEST PREVIEW', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open daily course', exact: true }).click();
  await page.getByRole('button', { name: 'Save study section', exact: true }).click();
  await expect(page.getByText('Section saved.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next section', exact: true }).click();
  await page.getByRole('button', { name: 'Save bonsoir', exact: true }).click();
  await expect(page.getByText('Saved bonsoir to your notebook.', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Open daily course', exact: true }).click();
  await expect(page.getByTestId(`course-block-${openCoursePilot.days[0].blocks[1].id}`)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save bonsoir', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Browse listening resources', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Start.*conversation/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByText('Ready for offline study', { exact: true })).toBeVisible();
  for (const name of ['Open curriculum editor', 'Load published lessons', 'Download for offline use']) {
    await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
  }
  await expect(page.getByText('Neural French audio', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Clearing app storage or uninstalling/)).toBeVisible();
  const save = page.getByRole('button', { name: 'Download learning backup', exact: true });
  await save.click();
  await expect(save).toBeDisabled();
  await expect(page.getByText(/Learning backup saved to your chosen location/)).toHaveCount(0);
  const exported = await page.evaluate(() => (window as unknown as { backupRequest: { filename: string; contents: string } }).backupRequest);
  expect(exported.filename).toMatch(/^smartlingo-learning-\d{4}-\d{2}-\d{2}\.json$/);
  const backup = JSON.parse(exported.contents);
  expect(backup.notebook).toHaveLength(1);
  expect(backup.notebook[0].target).toBe('bonsoir');
  expect(backup.courseEvents.length).toBeGreaterThan(0);
  await page.evaluate(() => (window as unknown as { completeBackup: (saved: boolean) => void }).completeBackup(false));
  await expect(page.getByRole('alert')).toContainText('Backup export cancelled.');
  await expect(save).toBeEnabled();
  await save.click();
  await page.evaluate(() => (window as unknown as { completeBackup: (saved: boolean) => void }).completeBackup(true));
  await expect(page.getByText(/Learning backup saved to your chosen location/)).toBeVisible();
  await page.getByLabel('Choose a learning backup', { exact: true }).setInputFiles({
    name: exported.filename, mimeType: 'application/json', buffer: Buffer.from(exported.contents),
  });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Restore backup', exact: true }).click();
  await expect(page.getByText('Backup merged successfully', { exact: true })).toBeVisible();
  expect(externalRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await page.screenshot({ path: info.outputPath('android-preview-profile.png'), fullPage: true });
});
