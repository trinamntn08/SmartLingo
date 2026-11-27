import { expect, test } from '@playwright/test';
import { languageCurricula } from '@smartlingo/content';
import audioClips from '../../apps/learner/public/japanese-audio/manifest.json';
import { guidedLessonButton } from './learner-journeys';

test.use({ storageState: { cookies: [], origins: [] } });

for (const locale of ['fr', 'ja'] as const) {
  test(`${locale} Today prioritises study and keeps saved words in Review`, async ({ page }, info) => {
    const narrow = info.project.name === 'small-screen';
    if (narrow) await page.setViewportSize({ width: 320, height: 740 });
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    await page.goto('/');

    const button = (name: string) => page.getByRole('button', { name, exact: true });
    const recommendation = page.getByTestId('today-next-step').getByRole('button');
    await button(locale === 'fr' ? 'Learn French' : 'Learn Japanese').click();
    const course = guidedLessonButton(page);
    const vocabulary = button('Browse lessons');
    await expect(page.getByRole('heading', { name: 'Today', exact: true })).toBeVisible();
    await expect(page.getByText('Open your notebook', { exact: true })).toHaveCount(0);
    await expect(recommendation).toHaveCount(1);
    await expect(recommendation).toBeInViewport();
    await expect(course).toHaveAccessibleName('Start lesson');
    if (narrow) {
      await expect(vocabulary).toHaveCount(0);
      await expect(recommendation).toHaveAccessibleName(locale === 'fr' ? 'Start lesson' : 'Start Hiragana');
      await recommendation.click();
      if (locale === 'ja') {
        await expect(page.getByText(/Hiragana.*Row 1 of \d+/)).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: 'Lesson 1: Meet a neighbour', exact: true })).toBeVisible();
      }
      await button('Learn').click();
      await expect(page).toHaveURL(new RegExp(`/learn/${locale}$`, 'u'));
      await expect(button('Courses')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
      await button('Listening & videos').click();
      await expect(page.getByTestId('listening-comprehension')).toBeVisible();
      await button('Speaking').click();
      await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
      await button('Review').click();
      await expect(button('Add personal word')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      return;
    }
    await expect(course).toHaveCount(1);
    if (locale === 'ja') {
      await recommendation.focus();
      await page.keyboard.press('Tab');
      await expect(course).toBeFocused();
    } else {
      await expect(recommendation).toHaveAccessibleName('Start lesson');
      await course.focus();
    }
    await page.keyboard.press('Tab');
    await expect(vocabulary).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await course.click();
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/`));
    await expect(page.getByRole('heading', { name: /^Lesson 1:/ })).toBeVisible();
    await expect(button('Learn')).toHaveAttribute('aria-selected', 'true');
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/today/${locale}$`));

    await vocabulary.click();
    await expect(page.getByRole('textbox', { name: 'Search lessons', exact: true })).toBeVisible();
    await button('Today').click();
    await button('Listening & videos').click();
    await expect(page.getByTestId('listening-comprehension')).toBeVisible();
    await button('Today').click();
    await button('Speaking practice').click();
    await expect(page.getByRole('heading', { name: 'Speaking practice', exact: true })).toBeVisible();
    await button('Review').click();
    await expect(page).toHaveURL(new RegExp(`/review/${locale}(?:/notebook)?$`));
    await expect(button('Add personal word')).toBeVisible();
  });
}

for (const [locale, name, courses] of [
  ['fr', 'French', languageCurricula['fr-FR'].courses],
  ['ja', 'Japanese', languageCurricula['ja-JP'].courses],
] as const) {
  test(`${name} opens the same course picker and reader from Learn`, async ({ page }) => {
    const narrow = page.viewportSize()!.width < 600;
    // At tablet width both languages should have the same navigation placement.
    await page.setViewportSize(narrow ? { width: 320, height: 740 } : { width: 1050, height: 900 });
    await page.goto('/');
    await page.getByRole('button', { name: `Learn ${name}`, exact: true }).click();
    await page.locator('#learner-bottom-bar').getByRole('button', { name: 'Learn', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/learn/${locale}$`, 'u'));
    const trigger = page.getByRole('button', { name: 'Courses', exact: true });
    await expect(trigger).toBeInViewport();
    await trigger.click();
    const picker = page.getByTestId('course-picker');
    await expect(picker.getByRole('heading', { name: 'Courses', exact: true })).toBeFocused();
    await expect(picker.getByRole('button', { name: 'Close courses', exact: true })).toBeVisible();
    await page.goBack();
    await expect(trigger).toBeFocused();
    await trigger.click();

    const course = courses[0];
    await picker.getByRole('button', { name: `${course.title}, current course`, exact: true }).click();
    const selected = page.getByTestId('chosen-course');
    const day = course.days[0];
    await expect(selected.getByRole('heading', { name: course.title, exact: true })).toBeFocused();
    await expect(selected.getByRole('button', { name: `Lesson ${day.dayNumber}: ${day.title}`, exact: true })).toBeVisible();
    await guidedLessonButton(selected).click();
    const lesson = page.getByTestId('open-course-panel');
    await expect(lesson.getByRole('navigation', { name: 'Lesson steps' }).getByRole('link')).toHaveCount(5);
    await expect(lesson.getByTestId('lesson-stage-heading')).toHaveText('Read a conversation');
    await expect(page).toHaveURL(new RegExp(`/course/${locale}/${course.id}/${day.id}/lesson-dialogue$`, 'u'));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const withDeviceVoice of [false, true]) {
  test(`tapping a Japanese word plays its human recording ${withDeviceVoice ? 'with' : 'without'} a Japanese device voice`, async ({ page, hasTouch }) => {
    await page.addInitScript(available => {
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: class {} });
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
        getVoices: () => available ? [{ lang: 'ja-JP', voiceURI: 'ja-test', name: 'Japanese', localService: true }] : [],
        cancel() {},
      } });
    }, withDeviceVoice);
    await page.route('**/127.0.0.1:3001/**', route => route.abort());
    await page.goto('/lesson/ja/ja.lesson.day-1/vocabulary');
    const greeting = page.getByTestId('vocabulary-ja.greetings.konnichiwa');
    await expect(greeting.getByTestId('word-pronunciation')).toHaveText('konnichiwa');
    const word = greeting.getByRole('button', { name: 'Listen to こんにちは', exact: true });
    await expect(word).toHaveText('こんにちは');
    const clip = page.waitForResponse(response => response.url().endsWith('/japanese-audio/' + audioClips['こんにちは'].file) && response.request().resourceType() === 'media');
    const visibleWord = word.getByText('こんにちは', { exact: true });
    if (hasTouch) await visibleWord.tap();
    else await visibleWord.click();
    expect((await clip).ok()).toBe(true);
  });
}
