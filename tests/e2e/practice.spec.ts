import { test, expect, type Page } from '@playwright/test';
import type { PracticeTurnRequest } from '@smartlingo/domain';

const sessionId = 'd77fe8e5-914e-4fa1-b064-852bcc030a6a';
const reply = {
  french: 'Bonjour ! Vous désirez un café ?', english: 'Hello! Would you like a coffee?',
  feedback: 'Your polite request is clear.',
  phrase: { target: 'Un café, s’il vous plaît.', meaning: 'A coffee, please.' },
};

async function fakePractice(page: Page, options: { available?: boolean; loseFirstReply?: boolean; transcriptionAvailable?: boolean } = {}) {
  const turns: PracticeTurnRequest[] = [];
  const transcriptions: { requestId: string; audioBase64: string; mimeType: string }[] = [];
  let starts = 0;
  let stops = 0;
  // Route every local API request so no owner database/provider is accessed.
  await page.route('**/127.0.0.1:3001/**', async route => {
    const path = new URL(route.request().url()).pathname;
    const usage = { usedToday: turns.length ? 1 : 0, dailyLimit: 40, inputTokens: 42, outputTokens: 24 };
    if (path === '/ai/practice/status') return route.fulfill({ json: { available: options.available ?? true, transcriptionAvailable: options.transcriptionAvailable ?? false, maxTurns: 8, usage } });
    if (path === '/ai/practice/sessions') {
      starts++;
      return route.fulfill({ json: { sessionId, maxTurns: 8, expiresAt: '2099-01-01T00:00:00.000Z' } });
    }
    if (path === '/ai/practice/stop') { stops++; return route.fulfill({ json: { stopped: true } }); }
    if (path === '/ai/practice/transcribe') {
      const command = route.request().postDataJSON() as typeof transcriptions[number];
      transcriptions.push(command);
      return route.fulfill({ json: { requestId: command.requestId, text: 'Bonjour, je voudrais un café.', usage: { ...usage, usedToday: 1 } } });
    }
    if (path === '/ai/practice/turns') {
      const command = route.request().postDataJSON() as PracticeTurnRequest;
      turns.push(command);
      if (options.loseFirstReply && turns.length === 1) return route.abort();
      return route.fulfill({ json: { requestId: command.requestId, reply, usedTurns: 1, maxTurns: 8, usage: { ...usage, usedToday: 1 } } });
    }
    return route.abort();
  });
  return { turns, transcriptions, starts: () => starts, stops: () => stops };
}

async function openPractice(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Speaking', exact: true }).click();
  await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
  return page.getByTestId('french-practice');
}

test('optional AI exchange saves only an explicit editable phrase and discards the conversation on leaving', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const fake = await fakePractice(page);
  const practice = await openPractice(page);
  await expect(practice.getByRole('heading', { name: 'French conversation', exact: true })).toBeVisible();
  expect(fake.turns).toHaveLength(0);
  await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
  expect(fake.starts()).toBe(1);
  expect(fake.turns).toHaveLength(0);
  await practice.getByRole('textbox', { name: 'Your French message', exact: true }).fill('Je voudrais un café, merci.');
  await practice.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toBeVisible();
  await expect(practice.getByText(reply.english, { exact: true })).toBeVisible();
  await expect(practice.getByText(reply.feedback, { exact: true })).toBeVisible();
  expect(fake.turns).toHaveLength(1);
  await practice.getByRole('button', { name: 'Save suggested phrase', exact: true }).click();
  await expect(practice.getByText(/saved.*notebook/i)).toBeVisible();
  await page.screenshot({ path: info.outputPath('french-conversation.png'), fullPage: false });
  expect(await practice.evaluate(element => element.getBoundingClientRect().right <= innerWidth + 1)).toBe(true);
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect.poll(fake.stops).toBe(1);
  await expect(page.getByRole('heading', { name: reply.phrase.target, exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Edit note', exact: true }).click();
  await page.getByRole('textbox', { name: 'English meaning', exact: true }).fill('My useful café request');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByText('Changes saved in this browser.')).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('My useful café request', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Speaking', exact: true }).click();
  await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
  await expect(page.getByTestId('french-practice').getByText(reply.french, { exact: true })).toHaveCount(0);
  expect(fake.turns).toHaveLength(1);
  expect(errors).toEqual([]);
});

test('lost response retries with the same request identity and English help is explicit', async ({ page }) => {
  const fake = await fakePractice(page, { loseFirstReply: true });
  const practice = await openPractice(page);
  await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
  await practice.getByRole('textbox', { name: 'Your French message', exact: true }).fill('Comment demander un café ?');
  await practice.getByRole('button', { name: /English help/i }).click();
  await practice.getByRole('button', { name: 'Send message', exact: true }).click();
  await practice.getByRole('button', { name: 'Retry message', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toBeVisible();
  expect(fake.turns).toHaveLength(2);
  expect(fake.turns[0]).toEqual(fake.turns[1]);
  expect(fake.turns[0].englishHelp).toBe(true);
  await practice.getByRole('button', { name: 'Stop conversation', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toHaveCount(0);
  await expect.poll(fake.stops).toBe(1);
});

test('unconfigured AI makes no conversation calls and leaves ordinary practice accessible', async ({ page }) => {
  const fake = await fakePractice(page, { available: false });
  const practice = await openPractice(page);
  await expect(practice.getByText(/not configured/i)).toBeVisible();
  await expect(practice.getByRole('button', { name: 'Start AI conversation', exact: true })).toBeDisabled();
  expect(fake.starts()).toBe(0);
  expect(fake.turns).toHaveLength(0);
  await page.getByRole('button', { name: 'Vocabulary & lessons', exact: true }).click();
  await expect(page.getByRole('textbox', { name: /Search/i }).first()).toBeVisible();
});

async function fakeMicrophone(page: Page, denied = false) {
  await page.addInitScript(({ denied }) => {
    const metrics = { requested: 0, stopped: 0 };
    Object.assign(window, { practiceMicrophoneMetrics: metrics });
    const devices = {
      async getUserMedia() {
        metrics.requested++;
        if (denied) throw new DOMException('Permission denied', 'NotAllowedError');
        let stopped = false;
        const track = { stop() { if (!stopped) { stopped = true; metrics.stopped++; } } };
        return { getTracks: () => [track], getAudioTracks: () => [track] };
      },
    };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: devices });
    class Recorder {
      static isTypeSupported(type: string) { return type.startsWith('audio/webm'); }
      state = 'inactive';
      mimeType = 'audio/webm';
      ondataavailable: ((event: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      onerror: (() => void) | null = null;
      start() { this.state = 'recording'; }
      stop() {
        if (this.state === 'inactive') return;
        this.state = 'inactive';
        this.ondataavailable?.({ data: new Blob(['test-only-audio'], { type: this.mimeType }) });
        this.onstop?.();
      }
    }
    Object.defineProperty(window, 'MediaRecorder', { configurable: true, value: Recorder });
  }, { denied });
}

test('recording stays local until explicit transcription and text can be edited before sending', async ({ page }, info) => {
  await fakeMicrophone(page);
  const fake = await fakePractice(page, { transcriptionAvailable: true });
  const practice = await openPractice(page);
  await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
  const recording = practice.getByTestId('practice-recording');
  await recording.getByRole('button', { name: 'Record French', exact: true }).click();
  await expect(practice.getByRole('button', { name: 'Send message', exact: true })).toBeDisabled();
  await recording.getByRole('button', { name: 'Stop recording', exact: true }).click();
  expect(fake.transcriptions).toHaveLength(0);
  expect(fake.turns).toHaveLength(0);
  await expect.poll(() => page.evaluate(() => (window as unknown as { practiceMicrophoneMetrics: { stopped: number } }).practiceMicrophoneMetrics.stopped)).toBe(1);
  await recording.getByRole('button', { name: 'Transcribe recording', exact: true }).click();
  const message = practice.getByRole('textbox', { name: 'Your French message', exact: true });
  await expect(message).toHaveValue('Bonjour, je voudrais un café.');
  expect(fake.transcriptions).toHaveLength(1);
  expect(fake.transcriptions[0].mimeType).toBe('audio/webm');
  expect(fake.turns).toHaveLength(0);
  await message.fill('Bonjour, je voudrais deux cafés.');
  await practice.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toBeVisible();
  expect(fake.turns[0].text).toBe('Bonjour, je voudrais deux cafés.');
  await page.screenshot({ path: info.outputPath('recorded-french.png'), fullPage: false });
  await practice.getByRole('button', { name: 'Stop conversation', exact: true }).click();
  await expect(recording).toHaveCount(0);
});

test('denied microphone leaves typed conversation available without transcription calls', async ({ page }) => {
  await fakeMicrophone(page, true);
  const fake = await fakePractice(page, { transcriptionAvailable: true });
  const practice = await openPractice(page);
  await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
  await practice.getByTestId('practice-recording').getByRole('button', { name: 'Record French', exact: true }).click();
  await expect(practice.getByTestId('practice-recording').getByRole('alert')).toBeVisible();
  await practice.getByRole('textbox', { name: 'Your French message', exact: true }).fill('Bonjour !');
  await practice.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toBeVisible();
  expect(fake.transcriptions).toHaveLength(0);
  expect(fake.turns).toHaveLength(1);
});

test('pending transcription locks message editing and discard ignores a late transcript', async ({ page }) => {
  await fakeMicrophone(page);
  const fake = await fakePractice(page, { transcriptionAvailable: true });
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let transcriptionStarted = false;
  await page.route('**/ai/practice/transcribe', async route => {
    const command = route.request().postDataJSON() as { requestId: string };
    transcriptionStarted = true;
    await pending;
    await route.fulfill({ json: { requestId: command.requestId, text: 'Late transcript must be ignored.', usage: { usedToday: 1, dailyLimit: 40, inputTokens: 0, outputTokens: 0 } } }).catch(() => {});
  });
  const practice = await openPractice(page);
  await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
  const message = practice.getByRole('textbox', { name: 'Your French message', exact: true });
  await message.fill('Keep my own message.');
  const recording = practice.getByTestId('practice-recording');
  await recording.getByRole('button', { name: 'Record French', exact: true }).click();
  await recording.getByRole('button', { name: 'Stop recording', exact: true }).click();
  await recording.getByRole('button', { name: 'Transcribe recording', exact: true }).click();
  await expect.poll(() => transcriptionStarted).toBe(true);
  await expect(message).not.toBeEditable();
  await recording.getByRole('button', { name: 'Discard recording', exact: true }).click();
  await expect(message).toBeEditable();
  release();
  await expect(message).toHaveValue('Keep my own message.');
  expect(fake.turns).toHaveLength(0);
  await practice.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(practice.getByText(reply.french, { exact: true })).toBeVisible();
  expect(fake.turns[0].text).toBe('Keep my own message.');
});


for (const action of ['change mode', 'collapse AI'] as const) {
  test(`${action} stops a recording and clears the temporary AI session`, async ({ page }) => {
    await fakeMicrophone(page);
    const fake = await fakePractice(page, { transcriptionAvailable: true });
    const practice = await openPractice(page);
    await practice.getByRole('button', { name: 'Start AI conversation', exact: true }).click();
    await practice.getByRole('textbox', { name: 'Your French message', exact: true }).fill('Unsent private draft');
    await practice.getByTestId('practice-recording').getByRole('button', { name: 'Record French', exact: true }).click();
    if (action === 'change mode') await page.getByRole('button', { name: 'Listening & videos', exact: true }).click();
    else await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
    await expect(page.getByTestId('french-practice')).toHaveCount(0);
    await expect.poll(fake.stops).toBe(1);
    await expect.poll(() => page.evaluate(() => (window as unknown as { practiceMicrophoneMetrics: { stopped: number } }).practiceMicrophoneMetrics.stopped)).toBe(1);
    await page.getByRole('button', { name: 'Speaking', exact: true }).click();
    await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
    await expect(practice.getByRole('button', { name: 'Start AI conversation', exact: true })).toBeVisible();
    await expect(practice.getByRole('textbox', { name: 'Your French message', exact: true })).toHaveCount(0);
    expect(fake.turns).toHaveLength(0);
    expect(fake.transcriptions).toHaveLength(0);
  });
}
