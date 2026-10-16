import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:3416';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['junit', { outputFile: 'artifacts/e2e-import.junit.xml' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        }
      : undefined,
  },
  webServer: {
    command: 'node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 --port 3416',
    url: `${baseURL}/api/health/live`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXTAUTH_URL: baseURL,
      VSCHOOL_RELEASED_MODULES: 'student_core,academic_core',
      VSCHOOL_E2E: '1',
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
});
