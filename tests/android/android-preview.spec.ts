import { expect, test, type Page } from '@playwright/test';
import { japaneseLessons } from '@smartlingo/content';
import { guidedLessonButton, openKeyPhrases, openLessonFromTopics, openProfileSection } from '../e2e/learner-journeys';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

interface AndroidFixture extends Window {
  androidBridge: object;
  Capacitor: object;
  backupRequests: Array<{ filename: string; contents: string }>;
  completeBackup: (saved: boolean) => void;
}

test.beforeEach(async ({ page }) => {
  // Exercise the JavaScript/native contract in Chromium.
  await page.addInitScript(() => {
    const runtime = window as unknown as AndroidFixture;
    runtime.androidBridge = {};
    runtime.backupRequests = [];
    runtime.Capacitor = {
      PluginHeaders: [{ name: 'LearningBackup', methods: [{ name: 'save', rtype: 'promise' }] }],
      nativePromise(plugin: string, method: string, options: AndroidFixture['backupRequests'][number]) {
        if (plugin !== 'LearningBackup' || method !== 'save') return Promise.reject(new Error('Unexpected native call'));
        runtime.backupRequests.push(options);
        return new Promise((resolve, reject) => {
          runtime.completeBackup = saved => saved ? resolve({ saved: true }) : reject(new Error('Backup save cancelled.'));
        });
      },
    };
  });
});

test('Android study, navigation and reload retain the shared learner without desktop services', async ({ page, context }) => {
  const apiRequests: string[] = [];
  await context.route('**/127.0.0.1:3001/**', route => {
    apiRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto('/#/editor');
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await button(page, 'Learn French').click();
  await expect(page).toHaveURL('/#/today/fr');
  const launch = guidedLessonButton(page.getByTestId('open-course-panel'));
  await launch.click();
  const photo = page.getByTestId('dialogue-context-photo').locator('img').first();
  await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await openKeyPhrases(page);
  await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  const savedStep = page.url();
  await page.goBack();
  await expect(button(page, 'Continue to key phrases')).toBeVisible();
  await button(page, 'Today').click();
  await page.reload();
  await launch.click();
  await expect(page).toHaveURL(savedStep);
  await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  await button(page, 'Learn').click();
  await button(page, 'Speaking').click();
  await expect(page.getByText('Optional AI conversation', { exact: false })).toHaveCount(0);
  await button(page, 'Profile').click();
  await expect(button(page, 'Curriculum tools')).toHaveCount(0);
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(page.getByText('Neural French audio', { exact: true })).toHaveCount(0);
  await openProfileSection(page, 'Offline & backups');
  await expect(page.getByText(/French and Japanese lessons are bundled/)).toBeVisible();
  await expect(button(page, 'Download for offline use')).toHaveCount(0);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);

  await button(page, 'Change language').click();
  await button(page, 'Learn Japanese').click();
  await button(page, 'Learn').click();
  await expect(page.getByTestId('japanese-alphabet')).toBeVisible();
  const lesson = japaneseLessons[0];
  await openLessonFromTopics(page, lesson);
  await openKeyPhrases(page);
  const word = lesson.vocabulary[0];
  const card = page.getByTestId('vocabulary-' + word.id);
  await expect(card.getByText(word.reading!, { exact: true }).first()).toBeVisible();
  const save = button(page, 'Save ' + word.target);
  await save.click();
  await expect(save).toBeDisabled();
  await page.reload();
  await expect(save).toBeDisabled();
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(page.getByText(/VOICEVOX/)).toHaveCount(0);
  expect(apiRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test('Android export waits for the picker and merges validated v4 learning explicitly', async ({ page }) => {
  await page.goto('/#/today/ja');
  const lesson = japaneseLessons[0];
  const word = lesson.vocabulary[0];
  await openLessonFromTopics(page, lesson);
  await openKeyPhrases(page);
  const saveWord = button(page, 'Save ' + word.target);
  await saveWord.click();
  await expect(saveWord).toBeDisabled();
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  const save = button(page, 'Download learning backup');
  const success = page.getByText(/Learning backup saved to your chosen location/);
  const requests = () => page.evaluate(() => (window as unknown as AndroidFixture).backupRequests);
  await save.click();
  await expect.poll(requests).toHaveLength(1);
  await expect(save).toBeDisabled();
  await expect(success).toHaveCount(0);
  const [exported] = await requests();
  expect(exported.filename).toMatch(/^smartlingo-learning-\d{4}-\d{2}-\d{2}\.json$/);
  expect(JSON.parse(exported.contents)).toMatchObject({
    version: 4,
    notebook: [{ target: word.target, language: 'ja-JP', reading: word.reading }],
  });
  await page.evaluate(() => (window as unknown as AndroidFixture).completeBackup(false));
  await expect(page.getByRole('alert')).toContainText('Backup save cancelled.');
  await expect(success).toHaveCount(0);

  await save.click();
  await expect.poll(requests).toHaveLength(2);
  await page.evaluate(() => (window as unknown as AndroidFixture).completeBackup(true));
  await expect(success).toBeVisible();

  const file = page.getByLabel('Choose a learning backup', { exact: true });
  await file.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await expect(page.getByRole('alert')).toContainText('not a supported SmartLingo learning backup');
  await file.setInputFiles({ name: exported.filename, mimeType: 'application/json', buffer: Buffer.from(exported.contents) });
  await expect(button(page, 'Restore backup')).toBeDisabled();
  await page.getByRole('checkbox').check();
  await button(page, 'Restore backup').click();
  await expect(page.getByText('Backup merged successfully', { exact: true })).toBeVisible();
  await expect(page.getByText(/0 added, 1 existing notes kept/)).toBeVisible();
  await button(page, 'Reload learning').click();
  await expect(page).toHaveURL('/#/profile/ja');
  await expect(page.getByText('1 saved word', { exact: true })).toBeVisible();
});

test('a failed save keeps Android Back on the same step even with forward history', async ({ page }) => {
  await page.goto('/#/today/fr');
  await guidedLessonButton(page.getByTestId('open-course-panel')).click();
  await expect(button(page, 'Continue to key phrases')).toBeEnabled();
  const dialogue = page.url();
  await openKeyPhrases(page);
  await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeVisible();
  const phrases = page.url();
  await button(page, 'Continue to listening').click();
  await expect(button(page, 'Skip listening')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(phrases);
  await page.evaluate(() => {
    const add = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'courseEvents' && value.kind === 'navigation') throw new Error('Simulated save failure');
      return add.call(this, value, key);
    };
    const visits: string[] = [];
    window.addEventListener('popstate', () => visits.push(location.href));
    Object.defineProperty(window, 'androidTestBackVisits', { value: visits });
  });
  await button(page, 'Continue to listening').click();
  await expect(button(page, 'Retry course save')).toBeVisible();
  await page.evaluate(() => history.back());
  const visits = () => page.evaluate(() => (window as unknown as { androidTestBackVisits: string[] }).androidTestBackVisits);
  await expect.poll(visits).toEqual([dialogue, phrases]);
  await expect(button(page, 'Retry course save')).toBeVisible();
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await visits()).toEqual([dialogue, phrases]);
  await expect(page).toHaveURL(phrases);
});
