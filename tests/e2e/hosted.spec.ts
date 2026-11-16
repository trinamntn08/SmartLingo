import { expect, test } from '@playwright/test';

test.skip(process.env.EXPO_PUBLIC_SMARTLINGO_DEPLOYMENT_MODE !== 'hosted', 'Runs against the explicit hosted learner build.');

test('hosted learner exposes ordinary study without mounting local or paid-provider features', async ({ page }) => {
  const loopbackRequests: string[] = [];
  await page.route('**/127.0.0.1:3001/**', route => {
    loopbackRequests.push(route.request().url());
    return route.abort('blockedbyclient');
  });

  await page.goto('/#editor');
  await expect(page.getByText('FREE TEST PREVIEW', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /A little French/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open curriculum editor', exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Practise with the lessons on this device.', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start AI conversation', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Explore Everyday greetings and politeness →', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Open / }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByText('Learner-only test website', { exact: true })).toBeVisible();
  await expect(page.getByText('Device speech only', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load published lessons', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'French phrase for neural audio' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Keep a copy of your learning', exact: true })).toBeVisible();

  expect(loopbackRequests).toEqual([]);
});
