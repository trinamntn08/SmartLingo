import { openTopicVocabulary, openRestaurant, openProfileSection } from './learner-journeys';
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
  await openProfileSection(page, 'Audio & pronunciation');
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
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(voice).toHaveValue(JSON.stringify(['test.fr.alternative', 'French alternative sample', 'fr-FR']));
  await expect(page.getByRole('button', { name: 'Speaking speed: Slow', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Listen to un café', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('speech-check') ?? '{}'))).toEqual({
    text: 'un café', voice: 'French alternative sample', rate: 0.7,
  });
});

test('generated coffee photograph loads locally and falls back to an illustration', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Topic Restaurant', exact: true }).click();
  await openTopicVocabulary(page);
  const card = page.getByTestId('vocabulary-fr.cafe');
  const example = page.getByTestId('example-fr.cafe');
  const photo = example.locator('img[src^="/generated-vocabulary-photos/"]');
  await expect(photo).toHaveAttribute('src', '/generated-vocabulary-photos/espresso.jpg');
  await expect.poll(() => photo.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await example.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('vocabulary-photograph.png') });
  await expect(page.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Photo credits and licences' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'About SmartLingo');
  await expect(page.getByRole('link', { name: 'Photo credits and licences' })).toHaveCount(0);
  await page.route('**/generated-vocabulary-photos/espresso.jpg', route => route.abort());
  await page.reload();
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Topic Restaurant', exact: true }).click();
  await openTopicVocabulary(page);
  await expect(example.locator('img[alt]:not([alt=""])')).toHaveAttribute('src', /^data:image\/svg/);
  await expect(card.getByRole('heading', { name: 'un café', exact: true })).toBeVisible();
});
