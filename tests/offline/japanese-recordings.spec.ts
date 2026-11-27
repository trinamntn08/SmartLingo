import { expect, test, type Page } from '@playwright/test';
import recordings from '../../apps/learner/public/japanese-audio/manifest.json';
import { openProfileSection } from '../e2e/learner-journeys';

const word = 'こんにちは';
const clip = `/japanese-audio/${recordings[word].file}`;
const route = '/lesson/ja/ja.lesson.day-1/vocabulary';

async function playWord(page: Page) {
  await page.goto(route);
  const card = page.getByTestId('vocabulary-ja.greetings.konnichiwa');
  const button = card.getByRole('button', { name: `Listen to ${word}`, exact: true });
  await expect(button).toHaveText(word);
  await button.getByText(word, { exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.lastRecording)).toContain(clip);
  await expect(button).toBeVisible();
  await expect(card.getByRole('alert')).toHaveCount(0);
}

test('a Japanese study word plays the bundled recording online and after a cold offline launch', async ({ page, context, request }) => {
  await request.post('/__test__/mode');
  await context.addInitScript(() => {
    localStorage.setItem('smartlingo.target-language.v1', 'ja-JP');
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      const source = this.src;
      return play.call(this).then(() => { document.documentElement.dataset.lastRecording = source; });
    };
  });
  const localRequests: string[] = [];
  await context.route('**/127.0.0.1:3001/**', route => {
    if (route.request().method() === 'POST') localRequests.push(route.request().url());
    return route.abort();
  });

  await playWord(page);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await playWord(cold);
  expect(localRequests).toEqual([]);
});
