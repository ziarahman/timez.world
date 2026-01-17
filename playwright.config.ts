import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_GEO_DB_API_KEY: 'playwright-test-key',
      VITE_OPENWEATHER_API_KEY: 'playwright-test-key'
    }
  }
});
