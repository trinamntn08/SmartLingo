import { expect, test, type Page } from '@playwright/test';
import { openCoursePilot } from '@smartlingo/content';
import { buildCourseLesson } from '../../apps/learner/src/course/courseLessonContent';
import { buildAcceptedSentence, guidedLessonButton, expectDialoguePhoto, expectFrenchTranscripts, openCourseOutline,
  openProfileSection, openTopic } from '../e2e/learner-journeys';

const panel = (page: Page) => page.getByTestId('open-course-panel');
const button = (page: Page, name: string) => panel(page).getByRole('button', { name, exact: true });
const step = (page: Page, name: string) => panel(page).getByRole('heading', { name, exact: true });
const steps = (page: Page) => panel(page).getByRole('navigation', { name: 'Lesson steps', exact: true });

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

test('the original French opening, notebook and saved cursor cold-start offline', async ({ page, context, baseURL }) => {
  const sourceRequests: string[] = [];
  context.on('request', request => { if (/opentextbc|utexas|creativecommons/.test(request.url())) sourceRequests.push(request.url()); });
  await downloadApp(page);
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await guidedLessonButton(cold).click();
  await expect(step(cold, 'Read a conversation')).toBeVisible();
  const [opening] = openCoursePilot.days;
  await expect(step(cold, `Lesson 1: ${opening.title}`)).toBeVisible();
  const dialogue = opening.blocks.find(block => block.kind === 'dialogue')!;
  if (dialogue.kind !== 'dialogue') throw new Error('Missing dialogue');
  await expectFrenchTranscripts(panel(cold), dialogue.lines);
  await expectDialoguePhoto(panel(cold), 'french-neighbour-dialogue.jpg');
  const study = opening.blocks.find(block => block.kind === 'study')!;
  if (study.kind !== 'study') throw new Error('Missing study explanation');
  const grammar = panel(cold).getByTestId('grammar-note');
  await expect(grammar.getByRole('heading', { name: study.title, exact: true })).toBeVisible();
  await expect(grammar.getByTestId('grammar-explanation')).toContainText(study.explanation, { useInnerText: true });
  await expect(button(cold, 'Source credits and licence')).toHaveCount(0);
  await expect(button(cold, 'Authorship and review')).toHaveCount(0);
  await button(cold, 'Continue to key phrases').click();
  await expect(step(cold, 'Key phrases')).toBeVisible();
  await expect(panel(cold).getByTestId('vocabulary-fr.greetings.bonsoir')).toContainText('good evening');
  await button(cold, 'Save bonsoir').click();
  await expect(button(cold, 'Save bonsoir')).toHaveText(/In notebook/);
  await button(cold, 'Continue to listening').click();
  await expect(step(cold, 'Listening practice')).toBeVisible();
  await expect(cold).toHaveURL(/\/lesson-listening$/);
  await cold.reload();
  await expect(step(cold, 'Listening practice')).toBeVisible();
  await steps(cold).getByRole('link', { name: 'Key phrases', exact: true }).click();
  await expect(button(cold, 'Save bonsoir')).toBeDisabled();
  await expect(button(cold, 'Save bonsoir')).toHaveText(/In notebook/);
  await openTopic(cold, 'Restaurant');
  await cold.getByRole('button', { name: 'Open Explain food needs', exact: true }).click();
  await expectDialoguePhoto(cold.getByTestId('lesson-stage'), 'french-bistro-dialogue.jpg');
  expect(sourceRequests).toEqual([]);
});

test('the spelling lesson uses the shared five steps and saves completion offline', async ({ page, context, baseURL }) => {
  const externalRequests: string[] = [];
  context.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) externalRequests.push(request.url());
  });
  await downloadApp(page);
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await guidedLessonButton(cold).click();
  const spelling = openCoursePilot.days[2];
  const lesson = buildCourseLesson(openCoursePilot, spelling);
  await openCourseOutline(panel(cold));
  const outline = panel(cold).getByTestId('course-outline');
  await expect(outline.getByRole('button', { name: /^(Dialogue|Quick practice|Try it)$/ })).toHaveCount(0);
  await outline.getByRole('button', { name: `Choose lesson 3: ${spelling.title}`, exact: true }).click();
  await expect(step(cold, `Lesson 3: ${spelling.title}`)).toBeVisible();
  await expect(step(cold, 'Read a conversation')).toBeVisible();
  const stepLinks = steps(cold).getByRole('link');
  const stepNames = ['Read dialogue', 'Key phrases', 'Listen', 'Match meanings', 'Build a sentence'];
  await expect(stepLinks).toHaveCount(stepNames.length);
  for (const [index, name] of stepNames.entries()) await expect(stepLinks.nth(index)).toHaveAccessibleName(name);
  await expectDialoguePhoto(panel(cold), 'french-workshop-dialogue.jpg');
  await button(cold, 'Continue to key phrases').click();
  await expect(step(cold, 'Key phrases')).toBeVisible();
  await button(cold, 'Continue to listening').click();
  await expect(step(cold, 'Listening practice')).toBeVisible();
  await button(cold, 'Skip listening').click();
  await expect(step(cold, 'Match the meaning')).toBeVisible();
  const match = lesson.vocabulary.find(word => word.id === lesson.pictureActivity.entryId)!;
  await button(cold, match.target).click();
  await expect(panel(cold).getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await button(cold, 'Next').click();
  await expect(step(cold, 'Build a sentence')).toBeVisible();
  await buildAcceptedSentence(cold, lesson);
  await expect(step(cold, 'Lesson complete')).toBeVisible();
  await expect(cold).toHaveURL(/\/lesson-sentence$/);
  await cold.reload();
  await expect(step(cold, `Lesson 3: ${spelling.title}`)).toBeVisible();
  await expect(step(cold, 'Lesson complete')).toBeVisible();
  await expect(panel(cold).getByText(lesson.sentenceActivity.explanation, { exact: true })).toBeVisible();
  await expect(button(cold, 'Practise the conversation')).toHaveCount(0);
  await expect(panel(cold).getByTestId('french-transfer-practice')).toHaveCount(0);
  expect(externalRequests.filter(url => !url.startsWith('http://127.0.0.1:3001/'))).toEqual([]);
  expect(await cold.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflowing = await panel(cold).evaluate(root => [root, ...root.querySelectorAll('*')].filter(element => {
    const bounds = element.getBoundingClientRect();
    return bounds.width > 0 && (bounds.left < -1 || bounds.right > innerWidth + 1);
  }).map(element => element.getAttribute('data-testid') ?? element.textContent?.slice(0, 70)));
  expect(overflowing).toEqual([]);
});
