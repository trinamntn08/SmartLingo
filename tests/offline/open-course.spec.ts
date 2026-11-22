import { expect, test } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { openProfileSection } from '../e2e/learner-journeys';

test.beforeEach(async ({ request }) => { await request.post('/__test__/mode'); });

test('the daily-course pilot, credits and saved cursor cold-start offline without source requests', async ({ page, context, baseURL }, info) => {
  const sourceRequests: string[] = [];
  context.on('request', request => { if (/opentextbc|utexas|creativecommons/.test(request.url())) sourceRequests.push(request.url()); });
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await cold.getByRole('button', { name: 'Open daily course', exact: true }).click();
  const panel = cold.getByTestId('open-course-panel');
  await panel.getByRole('button', { name: 'Source credits and licence', exact: true }).click();
  await expect(panel.getByText(openCoursePilot.sources[0].copyrightNotice, { exact: true })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Creative Commons Attribution 4.0 (CC BY 4.0)', exact: true })).toBeVisible();
  await panel.getByRole('button', { name: 'Hide source credits', exact: true }).click();
  await panel.getByRole('button', { name: 'Save study section', exact: true }).click();
  await panel.getByRole('button', { name: 'Next section', exact: true }).click();
  await panel.getByRole('button', { name: 'Save bonsoir', exact: true }).click();
  await expect(panel.getByText('Saved bonsoir to your notebook.', { exact: true })).toBeVisible();
  await cold.reload();
  await cold.getByRole('button', { name: 'Open daily course', exact: true }).click();
  await expect(cold.getByTestId(`course-block-${openCoursePilot.days[0].blocks[1].id}`)).toBeVisible();
  await panel.getByRole('button', { name: 'Choose a study day', exact: true }).click();
  await expect(cold.getByTestId(`course-day-${openCoursePilot.days[0].id}`).getByText('1 of 7 sections saved', { exact: true })).toBeVisible();
  await expect(cold.getByTestId('vocabulary-fr.greetings.bonsoir').getByRole('button', { name: 'Save bonsoir', exact: true })).toBeDisabled();
  expect(sourceRequests).toEqual([]);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await cold.screenshot({ path: info.outputPath('open-course-cold-offline.png'), fullPage: true });
});

test('the original second day can be studied and revisited with independent progress after a cold offline start', async ({ page, context, baseURL }, info) => {
  const externalRequests: string[] = [];
  context.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) externalRequests.push(request.url());
  });
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await cold.getByRole('button', { name: 'Open daily course', exact: true }).click();
  const panel = cold.getByTestId('open-course-panel');
  const button = (name: string) => panel.getByRole('button', { name, exact: true });
  const second = openCoursePilot.days[1];
  await button('Choose a study day').click();
  await button(`Choose day 2: ${second.title}`).click();
  await expect(panel.getByRole('heading', { name: `Day 2: ${second.title}`, exact: true })).toBeVisible();
  await button('Browse sections').click();
  for (let index = 0; index < second.blocks.length; index++) {
    const block = second.blocks[index];
    await button(`Section ${index + 1}: ${block.title}`).click();
    if (block.kind === 'choice') {
      await button('Show practice hint').click();
      await expect(panel.getByText(block.hint, { exact: true })).toBeVisible();
      await button(block.choices.find(choice => choice.id === block.answerId)!.target).click();
    } else if (block.kind === 'reflection') {
      await button('Read model exchange').click();
      await expect(panel.getByText(block.modelMeaning, { exact: true })).toBeVisible();
      await button('Save manual self-review').click();
    } else {
      if (block.kind === 'vocabulary') {
        const word = second.vocabulary.find(word => word.id === 'fr.people.prenom')!;
        await button(`Save ${word.target}`).click();
        await expect(panel.getByText(`Saved ${word.target} to your notebook.`, { exact: true })).toBeVisible();
      }
      await button('Save study section').click();
    }
    await expect(panel.getByText('Section saved.', { exact: true })).toBeVisible();
  }
  await button('Complete study day').click();
  await expect(panel.getByRole('heading', { name: 'Study day saved', exact: true })).toBeVisible();
  await cold.reload();
  await cold.getByRole('button', { name: 'Open daily course', exact: true }).click();
  await expect(panel.getByTestId(`course-block-${second.blocks.at(-1)!.id}`)).toBeVisible();
  await expect(panel.getByText('7 of 7 sections saved', { exact: true })).toBeVisible();
  await button('Choose a study day').click();
  await button(`Choose day 1: ${openCoursePilot.days[0].title}`).click();
  await expect(panel.getByText('0 of 7 sections saved', { exact: true })).toBeVisible();
  await button(`Choose day 2: ${second.title}`).click();
  await expect(panel.getByText('7 of 7 sections saved', { exact: true })).toBeVisible();
  await button('Browse sections').click();
  await button(`Section 2: ${second.blocks[1].title}`).click();
  await expect(button(`Save ${second.vocabulary.find(word => word.id === 'fr.people.prenom')!.target}`)).toBeDisabled();
  // The local API may be probed by the app shell; no source/media/provider needs fetching.
  expect(externalRequests.filter(url => !url.startsWith('http://127.0.0.1:3001/'))).toEqual([]);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // Measure the course and its controls as well as the complete document.
  const overflowing = await panel.evaluate(root => [root, ...root.querySelectorAll('*')].flatMap(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.width === 0 || (bounds.left >= -1 && bounds.right <= innerWidth + 1) ? []
      : [{ tag: element.tagName, role: element.getAttribute('role'), testId: element.getAttribute('data-testid'),
        text: element.textContent?.slice(0, 100), left: bounds.left, right: bounds.right }];
  }));
  await cold.screenshot({ path: info.outputPath('open-course-day-two-cold-offline.png'), fullPage: true });
  expect(overflowing).toEqual([]);
});
