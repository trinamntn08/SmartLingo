import { defineConfig } from '@playwright/test';

const origin = 'http://localhost:8185';

export default defineConfig({
  testDir: './tests/offline',
  outputDir: './test-results/offline',
  timeout: 75000,
  expect: { timeout: 25000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: origin, trace: 'retain-on-failure', channel: 'chromium',
    // Existing regression journeys start after the learner has chosen French.
    // Gateway tests override this state to exercise a genuinely fresh visit.
    storageState: { cookies: [], origins: [{ origin,
      localStorage: [{ name: 'smartlingo.target-language.v1', value: 'fr-FR' }],
    }] },
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'small-screen', use: { browserName: 'chromium', viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node tests/offline/server.mjs',
    url: origin, reuseExistingServer: false, timeout: 30000,
  },
});
