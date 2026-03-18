import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import path from 'path';

// Load .env file from project root
config({ path: path.resolve(__dirname, '.env') });

// Resolve the auth storage path (login bypass) from env, with fallback
const storageState = path.resolve(__dirname, process.env.STORAGE_STATE ?? 'playwright/.auth/user.json');

export default defineConfig({
    globalSetup: './auth/global-setup.ts',
    testDir: './tests',

    /* Ignore legacy root-level spec files — they import from old POM paths
     * (../pages/DashboardPage etc.) that no longer exist and break the full run.
     * These are superseded by the reorganized files under tests/workflow/, tests/dashboard/ etc. */
    testIgnore: ['**/tests/*.spec.ts'],

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 8 : 6,

    /* Increase global test timeout to 120 seconds */
    timeout: 60000,

    /* Increase assertion timeout */
    expect: {
        timeout: 10000,
    },

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',

    /* Shared settings for all the projects below. */
    use: {
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',

        baseURL: process.env.BASE_URL,

        // Auth storage state loaded from .env (STORAGE_STATE=playwright/.auth/user.json)
        // This is used for login bypass — the user.json file contains saved browser session data
        storageState,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
