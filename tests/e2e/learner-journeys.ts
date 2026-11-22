import type { Page } from '@playwright/test';
import { normalizeAnswer, type Lesson } from '@smartlingo/domain';

export async function openCourseTopic(page: Page, name: string) {
  await page.getByRole('navigation', { name: 'Learner navigation', exact: true }).waitFor();
  const topicToggle = page.getByRole('button', { name: 'Browse course topics', exact: true });
  if (await topicToggle.isVisible() && await topicToggle.getAttribute('aria-expanded') === 'false') await topicToggle.click();
  const topic = page.getByRole('button', { name: `Topic ${name}`, exact: true });
  await topic.scrollIntoViewIfNeeded();
  await topic.click();
}

/** Select the Restaurant journey explicitly, independent of the fresh Today suggestion. */
export async function openRestaurant(page: Page) {
  await openCourseTopic(page, 'Restaurant');
  await page.getByRole('button', { name: 'Open At the restaurant', exact: true }).click();
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
