import { expectGrammarNote, guidedLessonButton, openGrammar, openKeyPhrases, openLessonFromTopics, openTopic, openTopicVocabulary } from './learner-journeys';
import { test, expect } from '@playwright/test';
import { getLearnerGrammar, lessons } from '@smartlingo/content';
import { groupLessonTopics, matchesVocabulary, normalizeAnswer } from '@smartlingo/domain';

const topics = groupLessonTopics(lessons);
const groceryCount = topics.find(topic => topic.name === 'Groceries')!.vocabulary.length;

test('the visual library returns from a lesson to the same filtered topic and scroll position', async ({ page }, info) => {
  const narrow = info.project.name === 'small-screen';
  await page.setViewportSize({ width: narrow ? 320 : 1440, height: narrow ? 740 : 550 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  const button = (name: string) => page.getByRole('button', { name, exact: true });
  await button('Learn').click();
  const topicSelector = button('Topics');
  if (narrow) {
    await topicSelector.press('Enter');
    await expect(topicSelector).toHaveAttribute('aria-expanded', 'true');
  }
  await button('Browse topic Restaurant').press('Enter');
  if (narrow) {
    await expect(topicSelector).toHaveAttribute('aria-expanded', 'false');
    await expect(topicSelector).toBeFocused();
  }
  if (!narrow) {
    const cover = page.getByAltText(/^Topic context:/);
    await expect(cover).toBeVisible();
    await expect(cover).toHaveAttribute('src', /\/restaurant\.jpg$/);
    await expect.poll(() => cover.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  const search = page.getByRole('textbox', { name: 'Search lessons' });
  await search.fill('coffee');
  await button('A1 level').click();
  await openTopicVocabulary(page);
  const openLesson = button('Open At the restaurant');
  const scrollPosition = () => page.getByTestId('learner-content').evaluate(node => node.scrollTop);
  await openLesson.scrollIntoViewIfNeeded();
  const before = await scrollPosition();
  await openLesson.click();
  await expect(page.getByTestId('lesson-stage')).toBeVisible();
  await expect.poll(scrollPosition).toBe(0);
  await openKeyPhrases(page);
  await expect(page.getByRole('heading', { name: 'Key phrases', exact: true })).toBeFocused();
  await button('All lessons').click();
  await expect(search).toHaveValue('coffee');
  await expect(button('A1 level')).toHaveAttribute('aria-selected', 'true');
  await expect(button('Topic vocabulary')).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => Math.abs(await scrollPosition() - before)).toBeLessThanOrEqual(2);
});

async function expectPicturesLoaded(page: import('@playwright/test').Page) {
  await expect.poll(() => page.locator('img').evaluateAll(images => images.length > 0
    && images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
}

test('foundations and A2 experience lessons expose translated study material and grammar without API', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  for (const [slug, level] of [['essentials', 'foundation'], ['past', 'A2']] as const) {
    const lesson = lessons.find(item => item.id.startsWith(`fr.${slug}.`) && item.level === level)!;
    await openTopic(page, lesson.topic);
    await page.getByRole('button', { name: level === 'foundation' ? 'Foundations level' : 'A2 level', exact: true }).click();
    await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
    await expect(page.getByText(lesson.dialogue[0].meaning, { exact: true })).toBeVisible();
    const grammar = page.getByTestId('grammar-note');
    await expect(grammar).toHaveCount(0);
    await openKeyPhrases(page);
    await expect(grammar).toHaveCount(0);
    await openGrammar(page);
    const brief = getLearnerGrammar(lesson);
    await expect(grammar.getByRole('heading', { name: brief.title, exact: true })).toBeVisible();
    await expectGrammarNote(grammar, brief);
    if (slug === 'essentials') {
      await expect(grammar).toContainText('Vous pouvez');
      await expect(grammar).toContainText('répéter');
      await expect(grammar.getByTestId('grammar-target').first()).toHaveText('Vous pouvez répéter ?');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await grammar.screenshot({ path: info.outputPath('grammar-card.png') });
      await page.getByRole('navigation', { name: 'Lesson steps' }).getByRole('link', { name: 'Match meanings', exact: true }).click();
      await expect(page.getByText(lesson.pictureActivity.prompt, { exact: true })).toBeVisible();
    }
  }
});

test('topic words are directly readable, searchable and save to the notebook without API', async ({ page }, info) => {
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page.getByText(`${topics.length} everyday topics · ${[...new Set(lessons.map(lesson => lesson.level === 'foundation' ? 'Foundations' : lesson.level))].join(' / ')}`, { exact: true })).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('appointment');
  await page.getByRole('button', { name: 'Topic Health and appointments', exact: true }).click();
  await expect(page.getByTestId('topic-lesson-cards')).toBeVisible();
  await search.fill('');
  await openTopicVocabulary(page);
  await expect(page.getByRole('heading', { name: 'Vocabulary · 30', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'un rendez-vous', exact: true })).toBeVisible();
  await expect(page.getByText('an appointment', { exact: true })).toBeVisible();
  const appointment = lessons.flatMap(lesson => lesson.vocabulary).find(entry => entry.id === 'fr.health.rendez-vous')!;
  await expect(page.getByText(appointment.exampleMeaning, { exact: true })).toBeVisible();
  await expect(page.getByTestId('vocabulary-fr.health.rendez-vous').getByText('m.', { exact: true })).toBeVisible();
  await expect(page.getByText('Masculine noun; the spelling is unchanged in the plural.', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Synthetic device voice', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Save un rendez-vous', exact: true }).click();
  await expect(page.getByText('Saved un rendez-vous to your notebook.', { exact: true })).toBeVisible();
  await search.fill('rendez');
  const matches = topics.find(topic => topic.name === 'Health and appointments')!.vocabulary.filter(entry => matchesVocabulary(entry, 'rendez')).length;
  await expect(page.getByRole('heading', { name: `Vocabulary · ${matches}`, exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('topic-word-search.png'), fullPage: true });
  await search.fill('no-such-word');
  await expect(page.getByText('No matches.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).click();
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  const a2Lessons = lessons.filter(lesson => lesson.topic === 'Health and appointments' && lesson.level === 'A2');
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(a2Lessons.length);
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('un rendez-vous', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('an appointment', { exact: true })).toBeVisible();
  await page.goBack();
  await openTopicVocabulary(page);
  const unsave = page.getByRole('button', { name: 'Unsave un rendez-vous', exact: true });
  await expect(unsave).toHaveAttribute('aria-pressed', 'true');
  await unsave.press('Space');
  await expect(page.getByRole('button', { name: 'Save un rendez-vous', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await expect(page.getByText('un rendez-vous', { exact: true })).toHaveCount(0);
});

test('new A2 meaning and sentence practice work at 320px and survive reload', async ({ page }, info) => {
  const lesson = lessons.find(item => item.topic === 'Services and paperwork' && item.level === 'A2')!;
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Topic Services and paperwork', exact: true }).click();
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  await page.getByRole('button', { name: `Open ${lesson.subtitle}`, exact: true }).click();
  await openKeyPhrases(page);
  await expect(page.getByText(lesson.vocabulary[0].meaning, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => [...document.querySelectorAll('*')]
    .every(element => element.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
  await page.screenshot({ path: info.outputPath('narrow-new-lesson.png'), fullPage: true });
  await expect(page.getByRole('heading', { name: lesson.vocabulary[5].target, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Next word/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Try meaning practice/ }).click();
  const target = lesson.vocabulary.find(entry => entry.id === lesson.pictureActivity.entryId)!;
  await expect(page.getByText(target.meaning, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: target.target, exact: true }).click();
  await expect(page.getByText('That’s it. You matched the meaning.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  // The first accepted answer is guaranteed buildable by the curriculum integrity check.
  const remaining = lesson.sentenceActivity.tokens.map((token, index) => ({ token, index }));
  let answer = normalizeAnswer(lesson.sentenceActivity.answers[0]);
  while (remaining.length) {
    const next = remaining.find(piece => answer === normalizeAnswer(piece.token) || answer.startsWith(`${normalizeAnswer(piece.token)} `));
    if (!next) throw new Error(`Cannot build ${lesson.id}: ${answer}`);
    await page.getByRole('button', { name: next.token, exact: true }).click();
    answer = answer.slice(normalizeAnswer(next.token).length).trimStart();
    remaining.splice(remaining.indexOf(next), 1);
  }
  await page.getByRole('button', { name: 'Check sentence', exact: true }).click();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Lesson complete', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('Learn switches an open lesson back to its topic and home resets the destination', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await expect(page.getByTestId('topic-navigation')).toHaveCount(0);

  const groceriesLesson = lessons.find(lesson => lesson.topic === 'Groceries')!;
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Topic Groceries', exact: true }).click();
  await page.getByRole('button', { name: `Open ${groceriesLesson.subtitle}`, exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Read a conversation', exact: true })).toBeVisible();
  await openTopic(page, 'Groceries');
  await openTopicVocabulary(page);
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).click();
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(guidedLessonButton(page)).toBeVisible();
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toHaveCount(0);
  await openLessonFromTopics(page, lessons[0]);
  await page.getByRole('button', { name: 'SmartLingo home', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('language-chooser')).toBeVisible();
  await page.getByRole('button', { name: 'Learn French', exact: true }).click();
  await expect(guidedLessonButton(page)).toBeVisible();
});

test('320px catalogue reaches topics and topic changes clear stale search and level filters', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'Search lessons', exact: true });
  await search.fill('bakery');
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  await page.getByRole('button', { name: 'All levels', exact: true }).click();
  await search.fill('');
  const groceries = page.getByRole('button', { name: 'Topic Groceries', exact: true });
  await groceries.scrollIntoViewIfNeeded();
  await expect(groceries).toBeInViewport();
  await groceries.click();
  await search.fill('bakery');
  await page.getByRole('button', { name: 'A2 level', exact: true }).click();
  await page.getByRole('button', { name: 'All topics', exact: true }).click();
  await groceries.click();
  await openTopicVocabulary(page);
  await expect(page.getByRole('heading', { name: `Vocabulary · ${groceryCount}`, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'une pomme', exact: true })).toBeVisible();
  await expectPicturesLoaded(page);
  await expect(search).toHaveValue('');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
