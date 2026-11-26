import { test, expect, type Page } from '@playwright/test';
import { listeningFormats, listeningLevels, listeningResources } from '../../apps/learner/src/listening/resources';
import { openListeningFilters } from './learner-journeys';

async function openLibrary(page: Page) {
  // Isolate the existing optional AI panel from real local services/providers.
  await page.route('**/127.0.0.1:3001/**', route => {
    if (new URL(route.request().url()).pathname === '/ai/practice/status') return route.fulfill({ json: {
      available: false, transcriptionAvailable: false, maxTurns: 8,
      usage: { usedToday: 0, dailyLimit: 40, inputTokens: 0, outputTokens: 0 },
    } });
    return route.abort();
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Listening & videos', exact: true }).click();
  await page.getByRole('button', { name: 'Browse videos & audio', exact: true }).click();
  const library = page.getByTestId('listening-resources');
  await expect(library.getByRole('heading', { name: 'French listening library', exact: true })).toBeVisible();
  await expect(page.getByTestId('french-practice')).toHaveCount(0);
  return library;
}

test('listening level and format filters combine and reset without affecting ordinary practice', async ({ page }) => {
  const library = await openLibrary(page);
  await expect(library.getByRole('link')).toHaveCount(listeningResources.length);
  await openListeningFilters(library);
  for (const level of listeningLevels) {
    const levelButton = library.getByRole('button', { name: `Listening level ${level}`, exact: true });
    await levelButton.focus();
    await page.keyboard.press('Enter');
    await expect(levelButton).toHaveAttribute('aria-selected', 'true');
    for (const format of listeningFormats) {
      await library.getByRole('button', { name: `Listening format ${format}`, exact: true }).click();
      const expected = listeningResources.filter(resource => resource.levels.includes(level) && resource.format === format);
      await expect(library.getByRole('link')).toHaveCount(expected.length);
      await expect(library.getByTestId('listening-count')).toHaveText(`${expected.length} ${expected.length === 1 ? 'resource' : 'resources'}`);
      for (const resource of expected) await expect(library.getByRole('heading', { name: resource.title, exact: true })).toBeAttached();
      if (!expected.length) {
        await expect(library.getByRole('heading', { name: 'No listening resources match', exact: true })).toBeVisible();
        await library.getByRole('button', { name: 'Show all listening resources', exact: true }).click();
        await expect(library.getByRole('link')).toHaveCount(listeningResources.length);
        await levelButton.click();
      }
    }
  }
  await library.getByRole('button', { name: 'Reset listening filters', exact: true }).click();
  await expect(library.getByRole('button', { name: 'All listening levels', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(library.getByRole('button', { name: 'All listening formats', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(library.getByRole('link')).toHaveCount(listeningResources.length);
  await page.getByRole('button', { name: 'Speaking', exact: true }).click();
  await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
  const conversation = page.getByTestId('french-practice');
  await expect(conversation.getByRole('heading', { name: 'French conversation', exact: true })).toBeAttached();
  await expect(conversation.getByRole('textbox', { name: 'Search conversation lessons', exact: true })).toBeAttached();
  await expect(conversation.getByRole('button', { name: 'Start AI conversation', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Listening & videos', exact: true }).click();
  await page.getByRole('button', { name: /^(Lessons|Topics)$/ }).click();
  await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
  await expect(page.getByTestId('listening-resources')).toHaveCount(0);
  await page.getByRole('button', { name: 'Speaking', exact: true }).click();
  await page.getByRole('button', { name: 'Optional AI conversation', exact: true }).click();
  await expect(page.getByTestId('french-practice')).toBeVisible();
});

test('resource links are explicit safe destinations and browsing requests no remote media', async ({ page }) => {
  const remoteRequests: string[] = [];
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
      remoteRequests.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  const library = await openLibrary(page);
  await expect(library.getByText('Playback opens on an external provider and requires internet.', { exact: true })).toBeVisible();
  await expect(library.getByText('Levels are approximate recommendations.', { exact: true })).toBeVisible();
  for (const resource of listeningResources) {
    const card = library.getByTestId(`listening-resource-${resource.id}`);
    const label = resource.format === 'YouTube' ? 'Watch' : resource.format === 'Podcast' ? 'Listen to' : 'Open';
    const link = card.getByRole('link', { name: `${label} ${resource.title} — new tab`, exact: true });
    await expect(link).toHaveAttribute('href', resource.url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(card.getByText(resource.practice, { exact: true })).toBeHidden();
    const notes = card.getByRole('button', { name: 'Listening notes', exact: true });
    await notes.press('Enter');
    await expect(notes).toHaveAttribute('aria-expanded', 'true');
    await expect(card.getByText(resource.support, { exact: false })).toBeVisible();
    await expect(card.getByText(resource.access, { exact: false })).toBeVisible();
    await expect(card.getByText(resource.practice, { exact: true })).toBeVisible();
    await notes.press('Enter');
  }
  const link = library.getByRole('link').first();
  await link.focus();
  await expect(link).toBeFocused();
  await openListeningFilters(library);
  await library.getByRole('button', { name: 'Listening format YouTube', exact: true }).click();
  await expect(library.getByRole('link')).toHaveCount(listeningResources.filter(resource => resource.format === 'YouTube').length);
  await expect(library.locator('iframe, video, audio, img[src^="http"]')).toHaveCount(0);
  expect(remoteRequests).toEqual([]);
});

test('listening cards and filters fit a 320px screen', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const library = await openLibrary(page);
  await expect(library.getByRole('button', { name: 'Listening level A1', exact: true })).toHaveCount(0);
  await openListeningFilters(library);
  await library.getByRole('button', { name: 'Listening level A1', exact: true }).click();
  await library.getByRole('button', { name: 'Listening format YouTube', exact: true }).click();
  await expect(library.getByRole('link').first()).toBeAttached();
  expect(await library.evaluate(element => {
    const elements = [element, ...element.querySelectorAll('*')];
    return elements.every(item => {
      const bounds = item.getBoundingClientRect();
      return bounds.left >= -1 && bounds.right <= innerWidth + 1;
    });
  })).toBe(true);
  await page.screenshot({ path: info.outputPath('listening-library-320px.png'), fullPage: false });
});
