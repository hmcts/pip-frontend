import { defineConfig, devices } from '@playwright/test';
import { config } from './src/test/config';

export default defineConfig({
    testDir: 'playwright-e2e/tests',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    retries: 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: config.TEST_URL,
        headless: config.TestHeadlessBrowser,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        actionTimeout: config.WaitForTimeout,
        navigationTimeout: config.WaitForTimeout,
        slowMo: config.TestSlowMo,
    },
    projects: [
        {
            name: 'Chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'WebKit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
