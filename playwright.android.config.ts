import { defineConfig } from '@playwright/test';

/** Exported browser fixture for shell capability contracts; no physical-device claim. */
export default defineConfig({
  testDir: './tests/android',
  outputDir: './test-results/android',
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 1,
  use: { baseURL: 'http://localhost:8084', trace: 'retain-on-failure', channel: 'chromium' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'phone-width', use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node tests/android/server.mjs',
    url: 'http://localhost:8084', reuseExistingServer: false, timeout: 30000,
  },
});
