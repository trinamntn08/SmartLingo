import { openKeyPhrases, openTopic, openProfileSection } from './learner-journeys';
import { expect, test } from '@playwright/test';
import { japaneseLessons } from '@smartlingo/content';

test.use({ storageState: { cookies: [], origins: [{ origin: 'http://localhost:8081', localStorage: [{ name: 'smartlingo.target-language.v1', value: 'ja-JP' }] }] } });

function wav() {
  const bytes = Buffer.alloc(48);
  bytes.write('RIFF'); bytes.writeUInt32LE(40, 4); bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(24000, 24); bytes.writeUInt32LE(48000, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36); bytes.writeUInt32LE(4, 40);
  return bytes;
}

test('voice-less Japanese playback uses free local audio, replays offline, and removal prevents cached replay', async ({ page }, info) => {
  const paidRequests: string[] = [];
  const synthesis: unknown[] = [];
  let offline = false;
  await page.route('**/127.0.0.1:3001/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/speech/japanese/status') {
      if (offline) return route.abort();
      return route.fulfill({ json: { available: true, voice: 'Shikoku Metan', credit: 'VOICEVOX:四国めたん' } });
    }
    if (path === '/speech/japanese/play') {
      synthesis.push(route.request().postDataJSON());
      if (offline) return route.abort();
      expect(route.request().headers()['x-smartlingo-speech']).toBe('1');
      return route.fulfill({ contentType: 'audio/wav', body: wav() });
    }
    if (path.startsWith('/speech/')) paidRequests.push(path);
    return route.abort();
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [], cancel() {}, addEventListener() {}, removeEventListener() {},
      speak() { throw new Error('No device voice should be selected'); },
    } });
    Object.defineProperty(window, 'Audio', { configurable: true, value: class {
      onended?: () => void; onerror?: () => void; src = '';
      async play() {
        sessionStorage.setItem('japanese-clips-played', String(Number(sessionStorage.getItem('japanese-clips-played') ?? '0') + 1));
        setTimeout(() => this.onended?.(), 10);
      }
      pause() {} load() {}
    } });
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Profile', exact: true })).toBeVisible();
  expect(synthesis).toEqual([]);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(page.getByText('Free local voice ready: Shikoku Metan.', { exact: true })).toBeVisible();
  await expect(page.getByText(/No Japanese device voice is available/)).toBeVisible();
  await page.getByRole('combobox', { name: 'Japanese audio source', exact: true }).selectOption('voicevox');
  await page.getByRole('button', { name: 'Speaking speed: Slow', exact: true }).click();
  await page.getByRole('button', { name: 'Preview Japanese voice', exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('japanese-clips-played'))).toBe('1');
  expect(synthesis).toEqual([{ text: 'こんにちは。コーヒーをください。', rate: 0.7 }]);
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('smartlingo-japanese-speech-v1')).keys()).length)).toBe(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('japanese-local-voice-profile.png'), fullPage: true });
  offline = true;
  await page.reload();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(page.getByRole('combobox', { name: 'Japanese audio source', exact: true })).toHaveValue('voicevox');
  await expect(page.getByRole('button', { name: 'Speaking speed: Slow', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Preview Japanese voice', exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('japanese-clips-played'))).toBe('2');
  expect(synthesis).toHaveLength(1);
  await page.getByRole('button', { name: 'Remove saved Japanese audio', exact: true }).click();
  await expect(page.getByText(/Saved Japanese audio removed from this browser/)).toBeVisible();
  await page.getByRole('button', { name: 'Preview Japanese voice', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Start the local API and Japanese voice engine');
  expect(await page.evaluate(() => sessionStorage.getItem('japanese-clips-played'))).toBe('2');
  // The same ordinary vocabulary button uses the new route without Profile being open.
  offline = false;
  const lesson = japaneseLessons[0];
  await openTopic(page, lesson.topic);
  await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
  await openKeyPhrases(page);
  await page.getByRole('button', { name: `Listen to ${lesson.vocabulary[0].target}`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('japanese-clips-played'))).toBe('3');
  expect(synthesis.at(-1)).toEqual({ text: lesson.vocabulary[0].target, rate: 0.7 });
  expect(paidRequests).toEqual([]);
});
