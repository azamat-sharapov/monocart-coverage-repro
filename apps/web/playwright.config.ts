import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const BASE_URL = process.env.APP_URL || 'http://localhost:8000'
// uncomment for local CI debugging
// process.env.CI = 'true'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 20 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /**
   * NOTE: retry disable completely, including on CI,
   * because in some tests uniqueness of data is important
   * and retrying tests usually fails with "duplicate data"
   * validation errors.
   */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [process.env.CI ? 'github' : 'list'],
    [
      'monocart-reporter',
      {
        title: 'Web App test report',
        outputFile: './test-results/index.html',
        coverage: {
          lcov: true,
          sourceFilter: (sourcePath: string) => {
            return /^src\/.*\.(vue)$/.test(sourcePath)
          },
          entryFilter: (entry: { url: string }) => {
            const url = new URL(entry.url)

            const isLocalChunk = url.pathname.match(/^\/assets\/.+-\w+\.js$/)
            return isLocalChunk !== null && url.origin === BASE_URL
          },
        },
      },
    ],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `pnpm build && pnpm preview --port ${new URL(BASE_URL).port}`,
    port: parseInt(new URL(BASE_URL).port),
    reuseExistingServer: true,
  },
})
