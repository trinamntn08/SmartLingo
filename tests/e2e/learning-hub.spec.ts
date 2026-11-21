import { expect, test, type Page } from '@playwright/test';
import { restaurantLesson, japaneseLessons } from '@smartlingo/content';
import { getListeningResources } from '../../apps/learner/src/listening/resources';

async function mockSpeech(page: Page) {
  await page.addInitScript(() => {
    const voices = ['en-GB', 'fr-FR', 'ja-JP'].map(lang => ({ voiceURI: `test.${lang}`, name: `Test ${lang}`, lang, localService: true, default: lang === 'en-GB' }));
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => voices, cancel() {}, addEventListener() {}, removeEventListener() {},
      speak(utterance: SpeechSynthesisUtterance) {
        const played = JSON.parse(sessionStorage.getItem('hub-speech') ?? '[]');
        played.push({ text: utterance.text, language: utterance.lang });
        sessionStorage.setItem('hub-speech', JSON.stringify(played));
        setTimeout(() => sessionStorage.getItem('hub-speech-fail') ? utterance.onerror?.({} as SpeechSynthesisErrorEvent) : utterance.onend?.({} as SpeechSynthesisEvent), 10);
      },
    } });
  });
}

for (const language of ['fr-FR', 'ja-JP'] as const) {
  const name = language === 'fr-FR' ? 'French' : 'Japanese';
  test(`${name} shares one Learn hub with distinct vocabulary, listening and speaking modes`, async ({ page }, info) => {
    const remoteRequests: string[] = [];
    const apiRequests: string[] = [];
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        remoteRequests.push(url.href);
        return route.abort();
      }
      if (url.hostname === '127.0.0.1' && url.port === '3001') {
        apiRequests.push(url.pathname);
        return route.abort();
      }
      return route.continue();
    });
    await mockSpeech(page);
    await page.addInitScript(language => localStorage.setItem('smartlingo.target-language.v1', language), language);
    await page.goto('/');
    for (const tab of ['Today', 'Learn', 'Review', 'Report', 'Profile']) await expect(page.getByRole('button', { name: tab, exact: true })).toBeVisible();
    for (const tab of ['Explore', 'Practice']) await expect(page.getByRole('button', { name: tab, exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Learn', exact: true }).click();
    if (language === 'ja-JP') await page.getByRole('button', { name: 'Vocabulary & lessons', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    await expect(page.getByTestId('listening-resources')).toHaveCount(0);
    await page.getByRole('button', { name: 'Listening & videos', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Listening comprehension', exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toHaveCount(0);
    const library = page.getByTestId('listening-resources');
    await expect(library.getByRole('heading', { name: `${name} listening library`, exact: true })).toBeAttached();
    await expect(library.getByRole('link')).toHaveCount(getListeningResources(language).length);
    for (const resource of getListeningResources(language)) {
      const link = library.getByTestId(`listening-resource-${resource.id}`).getByRole('link');
      await expect(link).toHaveAttribute('href', resource.url);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(library.locator('iframe, video, audio, img')).toHaveCount(0);
    const lesson = language === 'fr-FR' ? restaurantLesson : japaneseLessons[0]!;
    const listening = page.getByTestId('listening-comprehension');
    await listening.getByRole('combobox', { name: 'Listening lesson', exact: true }).selectOption(lesson.id);
    await expect(listening.getByTestId('listening-transcript')).toHaveCount(0);
    await expect(listening.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
    await listening.getByRole('button', { name: 'Play sentence', exact: true }).click();
    await expect(listening.getByRole('button', { name: 'Replay sentence', exact: true })).toBeVisible();
    const played = await page.evaluate(() => JSON.parse(sessionStorage.getItem('hub-speech') ?? '[]') as { text: string; language: string }[]);
    expect(played).toHaveLength(1);
    expect(played[0]!.language).toBe(language);
    const sentence = lesson.vocabulary.find(entry => entry.example === played[0]!.text)!;
    expect(sentence).toBeDefined();
    await listening.getByRole('button', { name: 'Replay sentence', exact: true }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('hub-speech') ?? '[]').length)).toBe(2);
    await listening.getByRole('button', { name: 'Show transcript', exact: true }).click();
    await expect(listening.getByTestId('listening-transcript')).toContainText(sentence.example);
    const answer = listening.getByRole('button', { name: sentence.exampleMeaning, exact: true });
    await answer.click();
    await listening.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(listening.getByTestId('listening-feedback')).toContainText(/That.s the meaning/);
    await expect(listening.getByTestId('listening-feedback')).toContainText(sentence.exampleMeaning);
    await expect(listening.getByTestId('listening-feedback')).toContainText('transcript support');
    await listening.getByRole('button', { name: 'Next sentence', exact: true }).click();
    await expect(listening.getByTestId('listening-transcript')).toHaveCount(0);
    await page.evaluate(() => sessionStorage.setItem('hub-speech-fail', '1'));
    await listening.getByRole('button', { name: 'Play sentence', exact: true }).click();
    await expect(listening.getByRole('alert')).toContainText('Audio could not play');
    await expect(listening.getByTestId('listening-transcript')).toBeVisible();
    await page.evaluate(() => sessionStorage.removeItem('hub-speech-fail'));
    await page.getByRole('button', { name: 'Speaking', exact: true }).click();
    const speaking = page.getByTestId('guided-speaking');
    await expect(speaking.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
    await expect(page.getByTestId('listening-resources')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Listening comprehension', exact: true })).toHaveCount(0);
    await expect(page.getByTestId('french-practice')).toHaveCount(language === 'fr-FR' ? 1 : 0);
    await speaking.getByRole('combobox', { name: 'Speaking lesson', exact: true }).selectOption(lesson.id);
    await expect(speaking.getByTestId('speaking-line')).toContainText(lesson.dialogue[0]!.meaning);
    await expect(speaking.getByTestId('speaking-target')).toHaveCount(0);
    await speaking.getByRole('button', { name: 'Show model reply', exact: true }).click();
    await expect(speaking.getByTestId('speaking-target')).toHaveText(lesson.dialogue[0]!.target);
    await speaking.getByRole('button', { name: 'Listen to model reply', exact: true }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('hub-speech') ?? '[]').at(-1))).toEqual({ text: lesson.dialogue[0]!.target, language });
    const otherRole = lesson.dialogue.find(line => line.role !== lesson.dialogue[0]!.role)!.role;
    await speaking.getByRole('button', { name: `Practise as ${otherRole}`, exact: true }).click();
    await expect(speaking.getByTestId('speaking-target')).toHaveText(lesson.dialogue[0]!.target);
    await expect(speaking.getByRole('button', { name: 'Listen to partner', exact: true })).toBeVisible();
    await speaking.getByRole('button', { name: 'Next line', exact: true }).click();
    await expect(speaking.getByTestId('speaking-line')).toContainText(lesson.dialogue[1]!.meaning);
    await page.getByRole('button', { name: 'Vocabulary & lessons', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(remoteRequests).toEqual([]);
    expect(apiRequests.filter(path => path !== '/ai/practice/status')).toEqual([]);
    await page.screenshot({ path: info.outputPath(`${language}-learn-hub.png`), fullPage: false });
  });
}
