import { openRestaurant } from './learner-journeys';
import { test, expect } from '@playwright/test';

test('French voice and speed choices survive reload and apply to lesson playback without AI', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.addInitScript(() => {
    const voices = [
      { voiceURI: 'test.fr.local', name: 'French device sample', lang: 'fr-FR', localService: true, default: false },
      { voiceURI: 'test.fr.alternative', name: 'French alternative sample', lang: 'fr-FR', localService: false, default: false },
      { voiceURI: 'test.en', name: 'English sample', lang: 'en-GB', localService: true, default: true },
    ];
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => voices, cancel() {}, addEventListener() {}, removeEventListener() {},
      speak(utterance: SpeechSynthesisUtterance) {
        sessionStorage.setItem('speech-check', JSON.stringify({ text: utterance.text, voice: utterance.voice?.name, rate: utterance.rate }));
        setTimeout(() => utterance.onend?.({} as SpeechSynthesisEvent), 20);
      },
    } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  const voice = page.getByRole('combobox', { name: 'French voice', exact: true });
  await expect(voice.getByRole('option', { name: /English sample/ })).toHaveCount(0);
  await voice.selectOption({ label: 'French alternative sample · fr-FR · Network' });
  await page.getByRole('button', { name: 'Speaking speed: Slow', exact: true }).click();
  await page.getByRole('button', { name: 'Preview French voice', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('speech-check') ?? '{}'))).toEqual({
    text: 'Bonjour ! Je voudrais un café, s’il vous plaît.', voice: 'French alternative sample', rate: 0.7,
  });
  await page.screenshot({ path: info.outputPath('french-voice-choice.png'), fullPage: true });
  await page.reload();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(voice).toHaveValue(JSON.stringify(['test.fr.alternative', 'French alternative sample', 'fr-FR']));
  await expect(page.getByRole('button', { name: 'Speaking speed: Slow', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Listen to un café', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('speech-check') ?? '{}'))).toEqual({
    text: 'un café', voice: 'French alternative sample', rate: 0.7,
  });
});

test('bundled coffee photograph loads and has a local photo-credits route', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Restaurant →', exact: true }).click();
  const card = page.getByTestId('vocabulary-fr.cafe');
  const photo = card.locator('img').first();
  await expect(photo).toHaveAttribute('src', /\/vocabulary-photos\//);
  await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('vocabulary-photograph.png') });
  await expect(page.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Photo credits and licences' })).toHaveAttribute('href', '/vocabulary-photos/credits.html');
  const credits = await page.request.get('/vocabulary-photos/credits.html');
  expect(credits.status()).toBe(200);
  expect(await credits.text()).toContain('creativecommons.org');
  await page.route('**/vocabulary-photos/*.jpg', route => route.abort());
  await page.reload();
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Explore Restaurant →', exact: true }).click();
  await expect(card.locator('img').first()).toHaveAttribute('src', /^data:image\/svg/);
  await expect(card.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
});
