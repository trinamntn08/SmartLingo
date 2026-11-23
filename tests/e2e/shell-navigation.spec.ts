import { openKeyPhrases, openTopic } from './learner-journeys';
import { expect, test } from '@playwright/test';
import { japaneseLessons } from '@smartlingo/content';

test('keyboard users can skip to the main learner and narrow navigation', async ({ page }) => {
  await page.goto('/today/fr');
  await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
  const content = page.getByRole('button', { name: 'Skip to learner content', exact: true });
  await page.keyboard.press('Tab');
  await expect(content).toBeFocused();
  if (page.viewportSize()!.width < 1000) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Skip to learning navigation', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('navigation', { name: 'Learning navigation' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Today', exact: true })).toBeFocused();
  }
  await content.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Today', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page).toHaveURL(/\/today\/fr$/);
});

test('Back and Forward restore shell screens and a bookmarked lesson keeps its language', async ({ page, context }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/languages');
  const button = (name: string) => page.getByRole('button', { name, exact: true });
  await button('Learn French').click();
  await expect(page).toHaveURL(/\/today\/fr$/);
  await button('Learn').click();
  await expect(page).toHaveURL(/\/learn\/fr$/);
  await button('Topic Restaurant').click();
  await expect(page).toHaveURL(/\/learn\/fr\/topics\/Restaurant$/);
  const open = button('Open At the restaurant');
  await expect(open).toHaveAttribute('href', '/lesson/fr/fr.restaurant.customer');
  await open.click();
  await expect(page).toHaveURL(/\/lesson\/fr\/fr\.restaurant\.customer/);
  await page.goBack();
  await expect(open).toBeVisible();
  await page.goBack();
  await expect(button('Topic Restaurant')).toBeVisible();
  await page.goForward();
  await expect(open).toBeVisible();
  await page.goForward();
  await expect(page.getByTestId('lesson-stage')).toBeVisible();

  const tab = await context.newPage();
  try {
    const lesson = japaneseLessons[0]!;
    await tab.goto('/lesson/ja/' + lesson.id + '/dialogue');
    await expect(tab.getByRole('heading', { name: 'Read a conversation' })).toBeVisible();
    await expect(tab.getByRole('button', { name: 'Change language' })).toContainText('Japanese');
    expect(await tab.evaluate(() => localStorage.getItem('smartlingo.target-language.v1'))).toBe('fr-FR');
  } finally { await tab.close(); }
});

test('browser Back keeps a failed learning save on screen for dismissal or retry', async ({ page }) => {
  await page.goto('/learn/fr/topics/Restaurant');
  await page.getByRole('button', { name: 'Open At the restaurant', exact: true }).click();
  await openKeyPhrases(page);
  await page.evaluate(() => {
    const add = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args: Parameters<typeof add>) {
      if (this.name === 'events') throw new Error('Test write failure');
      return add.apply(this, args);
    };
  });
  await page.getByRole('button', { name: 'Try picture practice', exact: true }).click();
  const dismiss = page.getByRole('button', { name: 'Dismiss and continue', exact: true });
  await expect(dismiss).toBeVisible();
  const failedPlace = page.url();
  await page.evaluate(() => new Promise<void>(resolve => {
    window.addEventListener('popstate', () => window.addEventListener('popstate', () => resolve(), { once: true }), { once: true });
    history.back();
  }));
  await expect(page).toHaveURL(failedPlace);
  await expect(dismiss).toBeVisible();
  await dismiss.click();
  await page.goBack();
  await expect(page).toHaveURL(/\/dialogue$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/learn\/fr\/topics\/Restaurant$/);
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
  await openKeyPhrases(page);
  const word = lesson.vocabulary[0]!;
  await page.getByTestId(`vocabulary-${word.id}`).getByRole('button', { name: `Listen to ${word.target}`, exact: true }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('shell-playing'))).toBe(word.target);

  await page.evaluate(() => { window.location.hash = 'editor'; });
  await expect(page.getByRole('button', { name: 'Retry loading lessons', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('shell-playing'))).toBeNull();
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await expect(page.getByRole('heading', { name: lesson.subtitle, exact: true })).toBeVisible();

  await page.getByRole('button', { name: /Try meaning practice|Try picture practice/ }).click();
  // This unsaved activity is distinct from the persisted dialogue resume point.
  const activity = page.getByRole('heading', { name: lesson.pictureActivity.prompt, exact: true });
  await expect(activity).toBeVisible();
  await page.evaluate(() => { window.location.hash = 'editor'; });
  await expect(activity).not.toBeVisible();
  await page.getByRole('button', { name: /Return to learning/ }).click();
  await expect(activity).toBeVisible();
});
