import { openTopic } from './learner-journeys';
import { expect, test } from '@playwright/test';
import { japaneseLessons } from '@smartlingo/content';

test('browser Back and Forward restore visited learner screens before leaving SmartLingo', async ({ page, baseURL }) => {
  const earlierPage = 'https://previous-page.test/';
  await page.route(earlierPage, route => route.fulfill({ contentType: 'text/html', body: '<h1>Previous website</h1>' }));
  await page.addInitScript(() => {
    if (location.hostname === 'localhost') localStorage.removeItem('smartlingo.target-language.v1');
  });
  await page.goto(earlierPage);
  await page.goto('/');
  const choice = page.getByRole('heading', { name: 'Choose a language', exact: true });
  const today = page.getByRole('button', { name: 'Today', exact: true });
  const library = page.getByRole('heading', { name: 'Explore topics', exact: true });
  const topic = page.getByRole('heading', { name: 'Restaurant', exact: true });
  const lesson = page.getByRole('heading', { name: 'At the restaurant', exact: true });

  await expect(choice).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await openTopic(page, 'Restaurant');
  await page.getByRole('button', { name: 'Open At the restaurant', exact: true }).click();
  await expect(lesson).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(new URL('/', baseURL).href);
  await expect(topic).toBeVisible();
  await page.goForward();
  await expect(lesson).toBeVisible();
  await page.goBack();
  await expect(topic).toBeVisible();
  await page.goBack();
  await expect(library).toBeVisible();
  await page.goBack();
  await expect(today).toHaveAttribute('aria-selected', 'true');
  await page.goBack();
  await expect(choice).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(earlierPage);
});

test('browser Back keeps a failed learning save available for retry or dismissal', async ({ page }) => {
  await page.goto('/');
  await openTopic(page, 'Restaurant');
  await page.getByRole('button', { name: 'Open At the restaurant', exact: true }).click();
  await page.evaluate(() => {
    const add = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args: Parameters<typeof add>) {
      if (this.name === 'events') throw new Error('Test write failure');
      return add.apply(this, args);
    };
  });
  await page.getByRole('button', { name: /Continue to dialogue/ }).click();
  const dismiss = page.getByRole('button', { name: 'Dismiss and continue', exact: true });
  await expect(dismiss).toBeVisible();

  // A blocked Back traverses once to the topic and then returns to the lesson's entry.
  await page.evaluate(() => new Promise<void>(resolve => {
    window.addEventListener('popstate', () => window.addEventListener('popstate', () => resolve(), { once: true }), { once: true });
    window.history.back();
  }));
  await expect(page.getByRole('heading', { name: 'At the restaurant', exact: true })).toBeVisible();
  await expect(dismiss).toBeVisible();
  await dismiss.click();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Restaurant', exact: true })).toBeVisible();
});

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
  await openTopic(page, lesson.topic);
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
