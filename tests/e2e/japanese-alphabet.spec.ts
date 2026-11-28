import { openKanaFromToday, openKeyPhrases, openTopic, openProfileSection, studyKeyPhrasesAndOpenMatch } from './learner-journeys';
import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { japaneseAlphabetLessons, japaneseLessons, type JapaneseAlphabetLesson } from '@smartlingo/content';
import type { LearningEvent } from '@smartlingo/domain';

const first = japaneseAlphabetLessons[0]!;
const second = japaneseAlphabetLessons[1]!;
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

async function revealRows(page: Page) {
  await expect(page.getByTestId('japanese-alphabet')).toBeVisible();
  const toggle = button(page, 'Choose another row');
  if (await toggle.isVisible()) await toggle.click();
}

async function events(page: Page): Promise<LearningEvent[]> {
  return page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('smartlingo-learning');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<LearningEvent[]>((resolve, reject) => {
        const request = database.transaction('events').objectStore('events').getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    } finally { database.close(); }
  });
}

async function tryRow(page: Page, row: JapaneseAlphabetLesson, wrongFirst = false) {
  const alphabet = page.getByTestId('japanese-alphabet');
  await alphabet.getByRole('button', { name: 'Recognition practice', exact: true }).click();
  const practice = alphabet.getByTestId('kana-recognition');
  await expect(practice.getByRole('heading')).toBeFocused();
  for (const [index, character] of row.characters.entries()) {
    await expect(practice.getByRole('heading')).toHaveText('Which kana matches the sound?');
    if (index === 0) {
      await practice.getByRole('button', { name: 'Play sound', exact: true }).click();
      await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('kana-audio') ?? '{}')))
        .toEqual({ text: character.audioText, language: 'ja-JP' });
    } else {
      await practice.getByRole('button', { name: 'Show reading', exact: true }).click();
      await expect(practice.getByRole('heading')).toContainText(character.romaji);
    }
    await expect(alphabet.getByRole('button', { name: 'Mark row studied', exact: true })).toBeDisabled();
    await practice.getByRole('button', { name: `Choose ${wrongFirst && index === 0 ? row.characters[1]!.kana : character.kana}`, exact: true }).click();
    await expect(practice.getByText(wrongFirst && index === 0 ? /Keep practising/ : /^Yes\./)).toBeVisible();
    if (index < row.characters.length - 1) await practice.getByRole('button', { name: 'Next character', exact: true }).click();
  }
  await expect(alphabet.getByRole('button', { name: 'Mark row studied', exact: true })).toBeEnabled();
}

test.beforeEach(async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('smartlingo.target-language.v1', 'ja-JP');
    localStorage.setItem('smartlingo.japanese-audio-source.v1', JSON.stringify({ version: 1, source: 'device' }));
    const voices = ['en-GB', 'fr-FR', 'ja-JP'].map(lang => ({ name: `Test ${lang}`, voiceURI: `test.${lang}`, lang, localService: true, default: lang === 'en-GB' }));
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => voices, cancel() {}, addEventListener() {}, removeEventListener() {},
      speak(utterance: SpeechSynthesisUtterance) {
        sessionStorage.setItem('kana-audio', JSON.stringify({ text: utterance.text, language: utterance.lang }));
        setTimeout(() => utterance.onend?.({} as SpeechSynthesisEvent), 10);
      },
    } });
  });
});

test('Japanese Learn lists searchable kana topics and keeps the guided lesson as Today’s recommendation', async ({ page }) => {
  await page.goto('/today/ja');
  await page.getByTestId('today-next-step').getByRole('button', { name: 'Start lesson' }).click();
  await button(page, 'Next').click();
  await expect(page).toHaveURL(/\/lesson-vocabulary$/);
  await button(page, 'Learn').click();
  await expect(page).toHaveURL('/learn/ja');
  await expect(button(page, 'Topic Hiragana')).toBeVisible();
  await expect(button(page, 'Topic Katakana')).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('Katakana');
  await expect(button(page, 'Topic Hiragana')).toHaveCount(0);
  await button(page, 'Foundations level').click();
  await button(page, 'Topic Katakana').click();
  await expect(page).toHaveURL('/learn/ja/topics/Katakana');
  await expect(page.getByRole('heading', { name: 'Katakana', exact: true })).toBeVisible();
  const katakana = japaneseAlphabetLessons.find(lesson => lesson.script === 'katakana')!;
  await button(page, `Open ${katakana.title}`).click();
  await expect(page).toHaveURL(`/learn/ja/letters/${katakana.id}/study`);
  await button(page, 'Back to Katakana').click();
  await expect(page).toHaveURL('/learn/ja/topics/Katakana');
  await page.goto('/learn/ja/topics/katakana');
  await expect(button(page, `Open ${katakana.title}`)).toBeVisible();
  await expect(page.getByRole('group', { name: 'Lesson levels', exact: true })).toHaveCount(0);
  await button(page, 'Today').click();
  const resume = page.getByTestId('today-next-step').getByRole('button', { name: 'Continue lesson' });
  await resume.click();
  await expect(page).toHaveURL(/\/course\/ja\/.*\/lesson-vocabulary$/);
});

test('Hiragana lessons save studied rows and restore them alongside existing vocabulary history', async ({ page, browser, baseURL }, info) => {
  test.setTimeout(90000);
  await page.goto('/');
  await openKanaFromToday(page, 'Hiragana', first.title);
  const alphabet = page.getByTestId('japanese-alphabet');
  await expect(alphabet.getByRole('combobox')).toHaveCount(0);
  await expect(alphabet.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
  await revealRows(page);
  await expect(alphabet.getByTestId(`kana-row-${first.id}`)).toHaveAttribute('aria-selected', 'true');
  for (const character of first.characters) {
    await expect(alphabet.getByText(character.kana, { exact: true })).toBeVisible();
    await expect(alphabet.getByText(character.romaji, { exact: true })).toBeVisible();
  }
  await alphabet.getByText(first.characters[0]!.kana, { exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('kana-audio') ?? '{}'))).toEqual({ text: first.characters[0]!.audioText, language: 'ja-JP' });
  // Vocabulary remains available before any character practice or saved row.
  await button(page, 'Lessons').click();
  const oldLesson = japaneseLessons[0]!;
  await openTopic(page, oldLesson.topic);
  await button(page, `Open ${oldLesson.subtitle}`).click();
  await openKeyPhrases(page);
  await button(page, `Save ${oldLesson.vocabulary[0]!.target}`).click();
  await expect(button(page, `Unsave ${oldLesson.vocabulary[0]!.target}`)).toHaveAttribute('aria-pressed', 'true');
  await studyKeyPhrasesAndOpenMatch(page);
  await expect(page.getByTestId('lesson-step-picture')).toHaveAttribute('aria-current', 'step');
  const oldEvents = await events(page);
  expect(oldEvents).toHaveLength(1);
  await button(page, 'Today').click();
  await openKanaFromToday(page, 'Hiragana', first.title);
  await tryRow(page, first, true);
  await alphabet.getByRole('button', { name: 'Mark row studied', exact: true }).click();
  await revealRows(page);
  await expect(alphabet.getByTestId(`kana-row-${second.id}`)).toHaveAttribute('aria-selected', 'true');
  await expect(alphabet.getByTestId(`kana-row-${first.id}`)).toContainText('Studied');
  await expect(alphabet.getByTestId(`kana-row-${first.id}`)).not.toContainText('Not studied');
  await expect(alphabet.getByTestId(`kana-row-${first.id}`)).toHaveAccessibleName(/Explore row.*Studied$/);
  await expect(alphabet.getByTestId(`kana-row-${second.id}`)).toContainText('Current row');
  await expect(alphabet.getByText(`1 of ${japaneseAlphabetLessons.length} rows studied`, { exact: true })).toBeVisible();
  const saved = await events(page);
  expect(saved).toEqual(expect.arrayContaining(oldEvents));
  expect(saved.filter(event => event.lessonId === first.id)).toEqual([expect.objectContaining({ revision: 1, itemId: `${first.id}.completion`, activity: 'completion', result: 'completed', hints: 0 })]);
  for (let step = 0; step <= first.characters.length; step++) await page.goBack();
  await expect(page).toHaveURL(url => url.pathname === `/learn/ja/letters/${first.id}/study`);
  await expect(alphabet.getByRole('heading', { name: first.title, exact: true })).toBeVisible();
  expect(await events(page)).toEqual(saved);
  for (let step = 0; step <= first.characters.length; step++) await page.goForward();
  await expect(alphabet.getByRole('heading', { name: second.title, exact: true })).toBeVisible();
  await page.reload();
  await revealRows(page);
  await expect(alphabet.getByTestId(`kana-row-${second.id}`)).toHaveAttribute('aria-selected', 'true');
  await revealRows(page);
  await alphabet.getByRole('button', { name: /Katakana$/, exact: false }).click();
  await expect(alphabet.getByRole('heading', { name: japaneseAlphabetLessons[10]!.title, exact: true })).toBeVisible();
  await alphabet.getByTestId(`kana-row-${japaneseAlphabetLessons[19]!.id}`).click();
  await expect(alphabet.getByRole('heading', { name: japaneseAlphabetLessons[19]!.title, exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('japanese-letters.png'), fullPage: false });
  await button(page, 'Profile').click();
  await openProfileSection(page, 'Offline & backups');
  const download = page.waitForEvent('download'); await button(page, 'Download learning backup').click();
  const path = info.outputPath('kana-backup.json'); await (await download).saveAs(path);
  const backup = JSON.parse(await readFile(path, 'utf8'));
  expect(backup.version).toBe(4); expect(backup.events).toEqual(expect.arrayContaining(saved)); expect(backup.notebook).toHaveLength(1);
  const fresh = await browser.newContext({ viewport: { width: 320, height: 740 }, storageState: { cookies: [], origins: [] } });
  try {
    await fresh.route('**/127.0.0.1:3001/**', route => route.abort());
    const restored = await fresh.newPage(); await restored.goto(baseURL!); await button(restored, 'Learn Japanese').click();
    await button(restored, 'Profile').click();
    await openProfileSection(restored, 'Offline & backups'); await restored.getByLabel('Choose a learning backup', { exact: true }).setInputFiles(path);
    await restored.getByRole('checkbox').check(); await button(restored, 'Restore backup').click();
    await expect(restored.getByText('Backup merged successfully', { exact: true })).toBeVisible();
    await button(restored, 'Reload learning').click();
    await expect(restored).toHaveURL(/\/profile\/ja$/);
    await button(restored, 'Today').click();
    await openKanaFromToday(restored, 'Hiragana', second.title);
    await revealRows(restored);
    await expect(restored.getByTestId(`kana-row-${second.id}`)).toHaveAttribute('aria-selected', 'true');
    expect(await events(restored)).toEqual(expect.arrayContaining(saved));
    await button(restored, 'Review').click();
    await expect(restored.getByTestId('notebook-entries').getByRole('heading', { name: oldLesson.vocabulary[0]!.target, exact: true })).toBeVisible();
  } finally { await fresh.close(); }
});

test('visual kana rows support keyboard choices at 320px without a dropdown or study lock', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/'); await openKanaFromToday(page, 'Hiragana', first.title);
  const alphabet = page.getByTestId('japanese-alphabet');
  await expect(alphabet.getByRole('combobox')).toHaveCount(0);
  await revealRows(page);
  const current = alphabet.getByTestId(`kana-row-${first.id}`);
  const next = alphabet.getByTestId(`kana-row-${second.id}`);
  await expect(current).toHaveAttribute('role', 'button');
  await expect(next).toHaveAttribute('role', 'button');
  await expect(current).toHaveAccessibleName(/Current row.*Not studied$/);
  await expect(next).toHaveAccessibleName(/Explore row.*Not studied$/);
  await expect(current).toHaveAttribute('aria-selected', 'true');
  await expect(current).toContainText('Current row');
  await expect(current).toContainText('Not studied');
  await expect(next).toContainText('Explore row');
  await current.focus(); await page.keyboard.press('Tab');
  await expect(next).toBeFocused(); await page.keyboard.press('Enter');
  await expect(next).toHaveAttribute('aria-selected', 'true');
  await expect(current).toHaveAttribute('aria-selected', 'false');
  await expect(current).toHaveAccessibleName(/Suggested next.*Not studied$/);
  await expect(next).toHaveAccessibleName(/Current row.*Not studied$/);
  const heading = alphabet.getByRole('heading', { name: second.title, exact: true });
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  await page.keyboard.press('Tab');
  await expect(button(page, `Listen to ${second.characters[0]!.kana}`)).toBeFocused();
  await expect(next).toContainText('Current row');
  await expect(next).toContainText('Not studied');
  expect(await events(page)).toHaveLength(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('kana-visual-path-320px.png'), fullPage: false });
});

test('failed alphabet saving keeps the current row and retries the same event once', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await openTopic(page, 'Hiragana');
  await button(page, `Open ${first.title}`).click();
  await expect(page.getByTestId('japanese-alphabet')).toBeVisible();
  await revealRows(page);
  await tryRow(page, first);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add; let fail = true;
    Object.assign(window, { kanaAttemptIds: [] as string[] });
    IDBObjectStore.prototype.add = function (value, key) {
      if (this.name === 'events' && (value as LearningEvent).lessonId.startsWith('ja.alphabet.')) {
        (window as unknown as { kanaAttemptIds: string[] }).kanaAttemptIds.push((value as LearningEvent).id);
        if (fail) { fail = false; throw new Error('Simulated alphabet save failure'); }
      }
      return original.call(this, value, key);
    };
  });
  await button(page, 'Mark row studied').click();
  await expect(page.getByText('Simulated alphabet save failure', { exact: true })).toBeVisible();
  await revealRows(page);
  await expect(page.getByTestId(`kana-row-${first.id}`)).toHaveAttribute('aria-selected', 'true');
  await expect(button(page, 'Lessons')).toBeDisabled(); expect(await events(page)).toHaveLength(0);
  await button(page, 'Retry save').click();
  await revealRows(page);
  await expect(page.getByTestId(`kana-row-${second.id}`)).toHaveAttribute('aria-selected', 'true');
  const attempts = await page.evaluate(() => (window as unknown as { kanaAttemptIds: string[] }).kanaAttemptIds);
  expect(attempts).toHaveLength(2); expect(attempts[0]).toBe(attempts[1]); expect(await events(page)).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('French keeps its vocabulary default without a Japanese alphabet entry', async ({ page }) => {
  await page.goto('/'); await button(page, 'Change language').click(); await button(page, 'Learn French').click();
  await expect(button(page, 'Start Hiragana')).toHaveCount(0);
  await button(page, 'Learn').click();
  await expect(button(page, 'Japanese letters')).toHaveCount(0);
  await expect(page.getByTestId('japanese-alphabet')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
});

test('a voiced kana pattern resumes word recall and saves only after checking both tasks', async ({ page }) => {
  const pattern = japaneseAlphabetLessons.find(row => row.id === 'ja.alphabet.hiragana.pattern.g')!;
  const [reading, spelling] = pattern.practice!;
  if (reading?.mode !== 'choice' || spelling?.mode !== 'text') throw new Error('The pattern needs choice and script recall tasks.');
  await page.goto(`/learn/ja/letters/${pattern.id}/study`);
  await expect(page.getByRole('heading', { name: pattern.title, exact: true })).toBeVisible();
  await expect(page.getByText('かぎ', { exact: true })).toBeVisible();
  await button(page, 'Word recall').click();
  await expect(page.getByRole('heading', { name: 'Word recall', exact: true })).toBeFocused();
  await expect(button(page, 'Mark row studied')).toBeDisabled();
  await page.getByTestId(reading.id).getByRole('button', { name: reading.answer, exact: true }).click();
  await expect(page.getByText('1 of 2 tasks saved.', { exact: true })).toBeVisible();
  await page.goto('/learn/ja/topics/Hiragana');
  const resumeCard = page.getByTestId(`topic-lesson-${pattern.id}`);
  await expect(resumeCard.getByText('Up next', { exact: true })).toBeVisible();
  await expect(resumeCard.getByRole('button', { name: `Open ${pattern.title}` })).toHaveAttribute('href', `/learn/ja/letters/${pattern.id}/words`);
  await page.goto('/learn/ja/letters');
  await expect(page).toHaveURL(`/learn/ja/letters/${pattern.id}/words`);
  await expect(page.getByText('1 of 2 tasks saved.', { exact: true })).toBeVisible();
  const answer = page.getByTestId(spelling.id).getByRole('textbox', { name: 'Type your answer', exact: true });
  await answer.fill('カギ');
  await button(page, 'Check answer').click();
  await expect(page.getByText(`${spelling.retry} ${spelling.feedback}`, { exact: true })).toBeVisible();
  await expect(button(page, 'Mark row studied')).toBeDisabled();
  await answer.fill(spelling.answers[0]!);
  await button(page, 'Check answer').click();
  await expect(page.getByText('2 of 2 tasks saved.', { exact: true })).toBeVisible();
  await button(page, 'Mark row studied').click();
  await expect(page).toHaveURL('/learn/ja/letters/ja.alphabet.hiragana.pattern.z/study');
});
