import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  use: { baseURL: 'http://localhost:8081', trace: 'retain-on-failure', channel: 'chromium' },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'small-screen', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run web --workspace @smartlingo/learner -- --port 8081',
    url: 'http://localhost:8081', reuseExistingServer: !process.env.CI, timeout: 120000,
  },
});
