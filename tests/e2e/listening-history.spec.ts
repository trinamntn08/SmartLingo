import { expect, test } from '@playwright/test';
import { japaneseLessons, lessons, restaurantLesson } from '@smartlingo/content';
import { openListeningFilters } from './learner-journeys';

for (const [language, lesson] of [['fr', restaurantLesson], ['ja', japaneseLessons[0]!]] as const) {
  test(`${language} listening restores the sentence and attempt through Back and Forward`, async ({ page }) => {
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    const lessonPath = `/learn/${language}/listening/${encodeURIComponent(lesson.id)}`;
    await page.goto(lessonPath);
    const listening = page.getByTestId('listening-comprehension');
    const button = (name: string) => listening.getByRole('button', { name, exact: true });
    const transcript = listening.getByTestId('listening-transcript');
    const feedback = listening.getByTestId('listening-feedback');
    const position = (number: number) => listening.getByText(new RegExp(`^Sentence ${number} of `));

    await expect(position(1)).toBeVisible();
    await expect(button('Previous sentence')).toBeDisabled();
    const firstUrl = page.url();
    await button('Show transcript').click();
    await expect(transcript).toBeVisible();
    await button('Hide transcript').click();
    await listening.locator('[aria-pressed="false"]').first().click();
    await button('Check answer').click();
    await expect(feedback).toContainText('You used transcript support');
    const checkedFeedback = (await feedback.textContent())!;

    await button('Next sentence').click();
    await expect(position(2)).toBeVisible();
    await expect(page).toHaveURL(url => url.pathname.startsWith(`${lessonPath}/`));
    const secondUrl = page.url();
    await button('Show transcript').click();
    await expect(transcript).toBeVisible();
    const secondTranscript = (await transcript.textContent())!;

    await page.goBack();
    await expect(page).toHaveURL(firstUrl);
    await expect(position(1)).toBeVisible();
    await expect(feedback).toHaveText(checkedFeedback);
    await expect(transcript).toHaveCount(0);
    await expect(button('Play sentence')).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(secondUrl);
    await expect(position(2)).toBeVisible();
    await expect(transcript).toHaveText(secondTranscript);

    await button('Previous sentence').click();
    await expect(page).toHaveURL(firstUrl);
    await expect(feedback).toHaveText(checkedFeedback);
    await page.goForward();
    await expect(page).toHaveURL(secondUrl);
    await button('Change lesson').click();
    await expect(page).toHaveURL(secondUrl);
    const search = listening.getByRole('textbox', { name: 'Search listening lessons' });
    await search.fill('unmatched listening query');
    await page.goBack();
    await expect(search).toHaveCount(0);
    await expect(transcript).toHaveText(secondTranscript);
    await page.goForward();
    await expect(search).toHaveValue('unmatched listening query');
    await page.goBack();

    await button('Browse videos & audio').click();
    const library = page.getByTestId('listening-resources');
    await expect(library).toBeVisible();
    await openListeningFilters(library);
    const level = library.getByRole('button', { name: 'Listening level A2', exact: true });
    await level.click();
    const notes = library.getByRole('button', { name: 'Listening notes', exact: true }).first();
    await notes.click();
    await expect(notes).toHaveAttribute('aria-expanded', 'true');
    await page.goBack();
    await expect(page).toHaveURL(secondUrl);
    await expect(transcript).toHaveText(secondTranscript);
    await page.goForward();
    await expect(level).toHaveAttribute('aria-selected', 'true');
    await expect(notes).toHaveAttribute('aria-expanded', 'true');
    await page.goBack();

    await page.reload();
    await expect(page).toHaveURL(secondUrl);
    await expect(position(2)).toBeVisible();
    await expect(transcript).toHaveCount(0);
    await button('Show transcript').click();
    await expect(transcript).toHaveText(secondTranscript);
  });
}

test('a direct listening link preserves its topic deck and recovers an unavailable question', async ({ page }) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  const lesson = lessons.find(item => item.id === 'fr.essentials.polite-help')!;
  const word = lesson.vocabulary.find(item => item.id === 'fr.essentials.excuse-me')!;
  const root = `/learn/fr/listening/${lesson.id}/`;
  const topic = `?topic=${encodeURIComponent(lesson.topic)}`;
  const question = encodeURIComponent(`${lesson.id}:${word.id}`);
  await page.goto(`${root}${question}${topic}`);
  const listening = page.getByTestId('listening-comprehension');
  const transcript = listening.getByTestId('listening-transcript');
  await expect(listening.getByRole('alert')).toHaveCount(0);
  await listening.getByRole('button', { name: 'Show transcript', exact: true }).click();
  await expect(transcript).toContainText(word.example);
  const choices = await listening.locator('[aria-pressed]').allTextContents();
  expect(choices).toContain(word.exampleMeaning);

  await page.reload();
  await expect(listening.getByRole('alert')).toHaveCount(0);
  await listening.getByRole('button', { name: 'Show transcript', exact: true }).click();
  await expect(transcript).toContainText(word.example);
  await expect(listening.locator('[aria-pressed]')).toHaveText(choices);

  await page.goto(`${root}unavailable-question${topic}`);
  await expect(listening.getByRole('alert')).toContainText('That listening sentence is unavailable.');
  await listening.getByRole('button', { name: 'Use this sentence', exact: true }).click();
  await expect(listening.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveURL(url => url.pathname.startsWith(root) && url.searchParams.get('topic') === lesson.topic
    && !url.pathname.endsWith('/unavailable-question'));
});
