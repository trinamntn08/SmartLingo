import { expect, test } from '@playwright/test';
import { japaneseLessons } from '@smartlingo/content';

test('hash navigation cancels hidden learner speech and preserves the mounted lesson', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('smartlingo.target-language.v1', 'ja-JP');
    const voice = { voiceURI: 'test.ja-JP', name: 'Test Japanese', lang: 'ja-JP', localService: true, default: true };
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true, value: class { constructor(public text: string) {} },
    });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [voice], addEventListener() {}, removeEventListener() {},
      // Leave playback pending until navigation explicitly cancels it.
      speak(utterance: SpeechSynthesisUtterance) { sessionStorage.setItem('shell-playing', utterance.text); },
      cancel() { sessionStorage.removeItem('shell-playing'); },
    } });
  });
  await page.goto('/');
  const lesson = japaneseLessons[0]!;
  await page.getByRole('button', { name: `Topic ${lesson.topic}`, exact: true }).click();
  await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
  const word = lesson.vocabulary[0]!;
  await page.getByTestId(`vocabulary-${word.id}`).getByRole('button', { name: `Listen to ${word.target}`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('shell-playing'))).toBe(word.target);

  await page.evaluate(() => { window.location.hash = 'editor'; });
  await expect(page.getByRole('button', { name: 'Retry loading lessons', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('shell-playing'))).toBeNull();
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await expect(page.getByRole('heading', { name: lesson.subtitle, exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  await page.getByRole('button', { name: /Try meaning practice|Try picture practice/ }).click();
  // This unsaved activity is distinct from the persisted dialogue resume point.
  const activity = page.getByRole('heading', { name: lesson.pictureActivity.prompt, exact: true });
  await expect(activity).toBeVisible();
  await page.evaluate(() => { window.location.hash = 'editor'; });
  await expect(activity).not.toBeVisible();
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await expect(activity).toBeVisible();
});
