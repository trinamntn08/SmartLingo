import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { expectDialoguePhoto, expectFrenchTranscripts, openProfileSection, openTopic } from '../e2e/learner-journeys';

const panel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => panel(page).getByRole('button', { name, exact: true });
const step = (page: Page, name: string) => panel(page).getByRole('heading', { name, exact: true });

async function downloadApp(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await openProfileSection(page, 'Offline & backups');
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible({ timeout: 20000 });
}

test.beforeEach(async ({ request, context }) => {
  await request.post('/__test__/mode');
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
});

test('the French dialogue, credits, notebook and saved cursor cold-start offline', async ({ page, context, baseURL }) => {
  const sourceRequests: string[] = [];
  context.on('request', request => { if (/opentextbc|utexas|creativecommons/.test(request.url())) sourceRequests.push(request.url()); });
  await downloadApp(page);
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await button(cold, 'Open daily course').click();
  await expect(step(cold, 'Dialogue')).toBeVisible();
  const dialogue = openCoursePilot.days[0].blocks.find(block => block.kind === 'dialogue')!;
  if (dialogue.kind !== 'dialogue') throw new Error('Missing dialogue');
  await expectFrenchTranscripts(panel(cold), dialogue.lines);
  await expectDialoguePhoto(panel(cold), 'french-neighbour-dialogue.jpg');
  await button(cold, 'Source credits and licence').click();
  await expect(panel(cold).getByText(openCoursePilot.sources[0].copyrightNotice, { exact: true })).toBeVisible();
  await expect(button(cold, 'Creative Commons Attribution 4.0 (CC BY 4.0)')).toBeVisible();
  await button(cold, 'Hide source credits').click();
  await button(cold, 'Useful words').click();
  await expect(panel(cold).getByTestId('vocabulary-fr.greetings.bonsoir').getByRole('img')).toHaveCount(0);
  await button(cold, 'Save bonsoir').click();
  await expect(button(cold, 'bonsoir saved to notebook')).toBeDisabled();
  await button(cold, 'Next section').click();
  await expect(step(cold, 'Quick practice')).toBeVisible();
  await cold.reload();
  await button(cold, 'Open daily course').click();
  await expect(step(cold, 'Quick practice')).toBeVisible();
  await button(cold, 'Previous section').click();
  await button(cold, 'Useful words').click();
  await expect(button(cold, 'bonsoir saved to notebook')).toBeDisabled();
  await openTopic(cold, 'Restaurant');
  await cold.getByRole('button', { name: 'Open Explain food needs', exact: true }).click();
  await cold.getByRole('button', { name: /Continue to dialogue/ }).click();
  await expectDialoguePhoto(cold.getByTestId('lesson-stage'), 'french-bistro-dialogue.jpg');
  expect(sourceRequests).toEqual([]);
});

test('the spelling lesson is browsable and finishable offline in three steps', async ({ page, context, baseURL }) => {
  const externalRequests: string[] = [];
  context.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) externalRequests.push(request.url());
  });
  await downloadApp(page);
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await button(cold, 'Open daily course').click();
  const spelling = openCoursePilot.days[2];
  await button(cold, 'Choose a study day').click();
  await button(cold, `Choose day 3: ${spelling.title}`).click();
  await expect(step(cold, `Day 3: ${spelling.title}`)).toBeVisible();
  await expect(step(cold, 'Dialogue')).toBeVisible();
  await expectDialoguePhoto(panel(cold), 'french-workshop-dialogue.jpg');
  await button(cold, 'Next section').click();
  await expect(step(cold, 'Quick practice')).toBeVisible();
  await button(cold, 'Next section').click();
  await expect(step(cold, 'Try it')).toBeVisible();
  await button(cold, 'Show example').click();
  const reflection = spelling.blocks.find(block => block.kind === 'reflection')!;
  if (reflection.kind !== 'reflection') throw new Error('Missing reflection');
  await expect(panel(cold).getByText(reflection.modelMeaning, { exact: true })).toBeVisible();
  await button(cold, 'Finish lesson').click();
  await expect(step(cold, 'Study day saved')).toBeVisible();
  await cold.reload();
  await button(cold, 'Open daily course').click();
  await expect(step(cold, `Day 3: ${spelling.title}`)).toBeVisible();
  await expect(step(cold, 'Study day saved')).toBeVisible();
  expect(externalRequests.filter(url => !url.startsWith('http://127.0.0.1:3001/'))).toEqual([]);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflowing = await panel(cold).evaluate(root => [root, ...root.querySelectorAll('*')].filter(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.width > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1);
  }).map(element => element.getAttribute('data-testid') ?? element.textContent?.slice(0, 70)));
  expect(overflowing).toEqual([]);
});
