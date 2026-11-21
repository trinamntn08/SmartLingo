import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/offline',
  outputDir: './test-results/offline',
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:8082', trace: 'retain-on-failure', channel: 'chromium',
    // Existing regression journeys start after the learner has chosen French.
    // Gateway tests override this state to exercise a genuinely fresh visit.
    storageState: { cookies: [], origins: [{ origin: 'http://localhost:8082',
      localStorage: [{ name: 'smartlingo.target-language.v1', value: 'fr-FR' }],
    }] },
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'small-screen', use: { browserName: 'chromium', viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node tests/offline/server.mjs',
    url: 'http://localhost:8082', reuseExistingServer: false, timeout: 30000,
  },
});
