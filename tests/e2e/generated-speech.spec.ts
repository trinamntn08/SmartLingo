import { openRestaurant, openProfileSection } from './learner-journeys';
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { speechKey, speechRequestSchema, type SpeechRequest, type SpeechAsset } from '@smartlingo/domain';

const tone = readFileSync(resolve('tests/fixtures/speech-tone.mp3'));
async function fakeSpeech(page: Page, options: { loseFirst?: boolean; available?: boolean; hold?: boolean } = {}) {
  const requests: SpeechRequest[] = [];
  const clips = new Map<string, SpeechAsset>();
  let release: (() => void) | undefined;
  await page.route('**/127.0.0.1:3001/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/speech/status') return route.fulfill({ json: { available: options.available ?? true, usage: { usedToday: clips.size, dailyLimit: 40 } } });
    if (path !== '/speech/generate') return route.abort();
    const request = speechRequestSchema.parse(route.request().postDataJSON());
    requests.push(request);
    const key = await speechKey(request.input);
    const cacheHit = clips.has(key);
    const asset: SpeechAsset = clips.get(key) ?? { key, input: request.input, mimeType: 'audio/mpeg',
      byteLength: tone.length, sha256: createHash('sha256').update(tone).digest('hex'), audioBase64: tone.toString('base64') };
    clips.set(key, asset);
    if (options.hold) await new Promise<void>(resolve => { release = resolve; });
    if (options.loseFirst && requests.length === 1) return route.abort();
    try { await route.fulfill({ json: { requestId: request.requestId, asset, cacheHit, usage: { usedToday: clips.size, dailyLimit: 40 } } }); }
    catch { /* Cancelled browser requests intentionally discard their late result. */ }
  });
  return { requests, clips, release: () => release?.() };
}
async function instrumentAudio(page: Page, failOneSave = false) {
  await page.addInitScript(({ failOneSave }) => {
    const state = { ended: 0, device: 0 };
    Object.defineProperty(window, '__speechAudio', { value: state });
    const original = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      this.addEventListener('ended', () => { state.ended++; }, { once: true });
      return original.call(this);
    };
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class { constructor(public text: string) {} } });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [{ name: 'Device French fixture', voiceURI: 'test.fr', lang: 'fr-FR', localService: true }],
      cancel() {}, addEventListener() {}, removeEventListener() {},
      speak(utterance: SpeechSynthesisUtterance) { state.device++; setTimeout(() => utterance.onend?.({} as SpeechSynthesisEvent), 20); },
    } });
    if (failOneSave) {
      const put = Cache.prototype.put; let failed = false;
      Cache.prototype.put = function (request: RequestInfo | URL, response: Response) {
        const url = typeof request === 'string' ? request : request instanceof URL ? request.href : request.url;
        if (!failed && /generated-speech\/v1\/[a-f0-9]{64}$/.test(url)) { failed = true; return Promise.reject(new DOMException('quota fixture', 'QuotaExceededError')); }
        return put.call(this, request, response);
      };
    }
  }, { failOneSave });
}
const audioState = (page: Page) => page.evaluate(() => (window as unknown as { __speechAudio: { ended: number; device: number } }).__speechAudio);
const savedCount = (page: Page) => page.evaluate(async () => {
  const cache = await caches.open('smartlingo-generated-speech-v1');
  return (await cache.keys()).filter(request => /\/[a-f0-9]{64}$/.test(request.url)).length;
});
async function openPanel(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Audio & pronunciation');
  return page.getByRole('heading', { name: 'Neural French audio', exact: true }).locator('..');
}

test('explicit neural save, actual MP3 playback, reload and browser-only removal preserve learner data', async ({ page }, info) => {
  const fake = await fakeSpeech(page);
  await instrumentAudio(page);
  await page.goto('/');
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Save bonjour', exact: true }).click();
  await expect(page.getByText('Saved bonjour to your notebook.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Audio & pronunciation');
  const panel = page.getByRole('heading', { name: 'Neural French audio', exact: true }).locator('..');
  await expect(panel.getByText('Local generation is configured.', { exact: false })).toBeVisible();
  expect(fake.requests).toHaveLength(0);
  await panel.getByRole('combobox', { name: 'Neural French voice' }).selectOption('fr-FR-HenriNeural');
  await panel.getByRole('textbox', { name: 'French phrase for neural audio' }).fill('un café');
  expect(await panel.getByRole('button', { name: 'Generate and save (may use credits)', exact: true }).evaluate(button => button.getBoundingClientRect().right <= button.parentElement!.getBoundingClientRect().right + 1)).toBe(true);
  await panel.getByRole('button', { name: 'Generate and save (may use credits)', exact: true }).click();
  await expect(panel.getByText(/^Saved in this browser\. Replay/)).toBeVisible();
  await panel.getByRole('button', { name: 'Play saved sample', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).ended).toBe(1);
  await panel.getByRole('button', { name: 'Use saved neural audio', exact: true }).click();
  await panel.screenshot({ path: info.outputPath('neural-audio-panel.png') });
  expect(fake.requests).toHaveLength(1);
  await page.reload();
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Listen to un café', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).ended).toBe(1);
  expect((await audioState(page)).device).toBe(0);
  expect(fake.requests).toHaveLength(1);
  await page.getByRole('button', { name: 'Audio options for un café', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Close audio options', exact: true })).toBeVisible();
  expect(await page.getByRole('button', { name: 'Generate and save (may use credits)', exact: true }).evaluate(button => button.getBoundingClientRect().right <= button.parentElement!.getBoundingClientRect().right + 1)).toBe(true);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Audio & pronunciation');
  await expect(panel.getByRole('combobox', { name: 'Neural French voice' })).toHaveValue('fr-FR-HenriNeural');
  await page.evaluate(async () => { const unrelated = await caches.open('unrelated-owner-cache'); await unrelated.put('/keep', new Response('keep')); });
  await panel.getByRole('button', { name: 'Remove saved browser audio', exact: true }).click();
  await panel.getByRole('button', { name: 'Confirm removal', exact: true }).click();
  await expect(panel.getByText('Saved browser audio removed.', { exact: false })).toBeVisible();
  expect(await savedCount(page)).toBe(0);
  expect(await page.evaluate(async () => !!(await (await caches.open('unrelated-owner-cache')).match('/keep')))).toBe(true);
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByTestId('notebook-entries').getByRole('heading', { name: 'bonjour', exact: true })).toBeVisible();
});

test('uncertain transport retry keeps the request ID and storage retry does not call the API twice', async ({ page }) => {
  const fake = await fakeSpeech(page, { loseFirst: true });
  await instrumentAudio(page, true);
  const panel = await openPanel(page);
  const generate = panel.getByRole('button', { name: 'Generate and save (may use credits)', exact: true });
  await generate.click();
  await expect(panel.getByRole('alert')).toBeVisible();
  expect(fake.requests).toHaveLength(1);
  await generate.click();
  await expect(panel.getByRole('alert')).toBeVisible();
  expect(fake.requests).toHaveLength(2);
  expect(fake.requests[0].requestId).toBe(fake.requests[1].requestId);
  expect(await savedCount(page)).toBe(0);
  await generate.click();
  await expect(panel.getByText(/^Saved in this browser\. Replay/)).toBeVisible();
  expect(fake.requests).toHaveLength(2);
  expect(fake.clips.size).toBe(1);
  expect(await savedCount(page)).toBe(1);
  await panel.getByRole('button', { name: 'Use saved neural audio', exact: true }).click();
  await page.getByRole('button', { name: 'Preview French voice', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).device).toBe(1);
  expect((await audioState(page)).ended).toBe(0);
});

test('cancel and leave discards late generation without a browser cache write', async ({ page }) => {
  const fake = await fakeSpeech(page, { hold: true });
  const panel = await openPanel(page);
  await panel.getByRole('button', { name: 'Generate and save (may use credits)', exact: true }).click();
  await expect.poll(() => fake.requests.length).toBe(1);
  await expect(panel.getByRole('textbox', { name: 'French phrase for neural audio' })).toHaveAttribute('readonly', '');
  await panel.getByRole('button', { name: 'Cancel generation', exact: true }).click();
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  fake.release();
  await expect.poll(() => savedCount(page)).toBe(0);
  expect(fake.requests).toHaveLength(1);
});

test('unconfigured neural audio leaves device study available without generation', async ({ page }) => {
  const fake = await fakeSpeech(page, { available: false });
  await instrumentAudio(page);
  const panel = await openPanel(page);
  await expect(panel.getByText('Neural generation is not configured', { exact: false })).toBeVisible();
  expect(fake.requests).toHaveLength(0);
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await openRestaurant(page);
  await page.getByRole('button', { name: 'Listen to un café', exact: true }).click();
  await expect.poll(async () => (await audioState(page)).device).toBe(1);
  expect(fake.requests).toHaveLength(0);
});
