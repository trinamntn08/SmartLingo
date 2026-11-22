import { expect, type Locator, type Page } from '@playwright/test';
import { normalizeAnswer, type Lesson } from '@smartlingo/domain';

export async function openProfileSection(page: Page, name: string) {
  const toggle = page.getByRole('button', { name, exact: true });
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
}

export async function openCourseOutline(panel: Locator) {
  const disclosure = panel.getByRole('button', { name: 'Course outline', exact: true, expanded: false });
  if (await disclosure.isVisible()) await disclosure.click();
  await expect(panel.getByTestId('course-outline')).toBeVisible();
}

/** Browse a topic through Learn, including the Japanese letters-first entry. */
export async function openTopic(page: Page, name: string) {
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  const vocabulary = page.getByRole('button', { name: 'Vocabulary & lessons', exact: true });
  await vocabulary.click();
  await expect(vocabulary).toHaveAttribute('aria-selected', 'true');
  const allTopics = page.getByRole('button', { name: 'All topics', exact: true });
  if (await allTopics.isVisible()) await allTopics.click();
  await page.getByRole('button', { name: `Topic ${name}`, exact: true }).click();
}

export async function openLessonFromTopics(page: Page, lesson: Pick<Lesson, 'topic' | 'subtitle'>) {
  await openTopic(page, lesson.topic);
  await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
}

/** Select the Restaurant journey explicitly, independent of the fresh Today suggestion. */
export async function openRestaurant(page: Page) {
  await openTopic(page, 'Restaurant');
  await page.getByRole('button', { name: 'Open At the restaurant', exact: true }).click();
}

export async function selectListeningLesson(listening: Locator, lesson: Pick<Lesson, 'title'>) {
  const chooser = listening.getByRole('button', { name: 'Change lesson', exact: true });
  await chooser.click();
  await listening.getByRole('textbox', { name: 'Search listening lessons', exact: true }).fill(lesson.title);
  await listening.getByRole('button', { name: lesson.title, exact: true }).click();
  await expect(chooser).toHaveAttribute('aria-expanded', 'false');
}

export async function openListeningFilters(library: Locator) {
  const filters = library.getByRole('button', { name: 'Filters', exact: true });
  if (await filters.isVisible()) {
    await expect(filters).toHaveAttribute('aria-expanded', 'false');
    await filters.click();
    await expect(filters).toHaveAttribute('aria-expanded', 'true');
  }
}

export async function expectFrenchTranscripts(scope: Locator, lines: readonly { target: string; meaning: string }[]) {
  const french = scope.getByTestId('dialogue-french-transcript');
  const english = scope.getByTestId('dialogue-english-transcript');
  await expect(french).toBeVisible();
  await expect(english).toBeVisible();
  await expect(french.locator('[lang="fr-FR"]')).toHaveText(lines.map(line => line.target));
  await expect(english.locator('[lang="en"]')).toHaveText(lines.map(line => line.meaning));
  const order = await scope.locator('[data-testid="dialogue-french-transcript"], [data-testid="dialogue-english-transcript"]')
    .evaluateAll(elements => elements.map(element => element.getAttribute('data-testid')));
  expect(order).toEqual(['dialogue-french-transcript', 'dialogue-english-transcript']);
  return { french, english };
}

export async function expectDialoguePhoto(scope: Locator, filename: string) {
  const photo = scope.getByTestId('dialogue-context-photo');
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.locator('img').evaluateAll((images, name) => images.some(image =>
    image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.src.endsWith(`/learning-scenes/${name}`),
  ), filename)).toBe(true);
}

export async function buildAcceptedSentence(page: Page, lesson: Lesson) {
  const remaining = [...lesson.sentenceActivity.tokens];
  let answer = normalizeAnswer(lesson.sentenceActivity.answers[0]);
  while (remaining.length) {
    const index = remaining.findIndex(token => answer === normalizeAnswer(token) || answer.startsWith(`${normalizeAnswer(token)} `));
    if (index < 0) throw new Error(`Cannot build ${lesson.id}: ${answer}`);
    const token = remaining.splice(index, 1)[0];
    await page.getByRole('button', { name: token, exact: true }).click();
    answer = answer.slice(normalizeAnswer(token).length).trimStart();
  }
  await page.getByRole('button', { name: 'Check sentence', exact: true }).click();
}
