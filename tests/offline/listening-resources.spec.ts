import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request }) => { await request.post('/__test__/mode'); });

test('downloaded listening guidance and filters cold-start offline without provider requests', async ({ page, context, baseURL }) => {
  const providerRequests: string[] = [];
  context.on('request', request => {
    const host = new URL(request.url()).hostname;
    if (!['localhost', '127.0.0.1', '[::1]'].includes(host)) providerRequests.push(request.url());
  });
  await context.route('**/127.0.0.1:3001/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Download for offline use', exact: true }).click();
  await expect(page.getByText('Ready for offline use', { exact: true })).toBeVisible();
  await context.setOffline(true);
  await page.close();
  const cold = await context.newPage();
  await cold.goto(baseURL!);
  await cold.getByRole('button', { name: 'Practice', exact: true }).click();
  await cold.getByRole('button', { name: 'Browse listening resources', exact: true }).click();
  const library = cold.getByTestId('listening-resources');
  await expect(library.getByText(/Online only: playback opens on an external provider/)).toBeVisible();
  await library.getByRole('button', { name: 'Listening level B1', exact: true }).click();
  await library.getByRole('button', { name: 'Listening format YouTube', exact: true }).click();
  await expect(library.getByRole('link')).toHaveCount(2);
  await expect(library.getByRole('heading', { name: 'Street interviews: French as people speak it', exact: true })).toBeAttached();
  await expect(library.getByTestId('listening-resource-innerfrench-youtube').getByText(/Watch two minutes/)).toBeAttached();
  expect(providerRequests).toEqual([]);
});
