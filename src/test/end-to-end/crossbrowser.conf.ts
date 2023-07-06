import * as path from 'path';
import { config as testConfig } from '../config';
import { container, event } from 'codeceptjs';
import { clearTestData } from './shared/testingSupportApi';

export const config: CodeceptJS.MainConfig = {
    name: 'cross-browser',
    tests: './tests/**/*-test.ts',
    output: path.join(testConfig.TestFunctionalOutputPath, 'cross-browser/reports'),
    include: {
        I: './tests/custom-steps.ts',
    },
    async teardownAll() {
        await clearTestData();
    },
    helpers: testConfig.helpers,
    plugins: testConfig.plugins,
    multiple: {
        chromium: { browsers: [{ browser: 'chromium' }] },
        webkit: { browsers: [{ browser: 'webkit' }] },
        firefox: { browsers: [{ browser: 'firefox' }] },
    },
};

event.dispatcher.on(event.test.after, () => {
    const browser = container.helpers().Playwright.browser._initializer;
    const { allure } = container.plugins();
    allure.epic(browser.name);
    allure.addParameter('environment', 'Browser', browser.name);
    allure.addParameter('environment', 'Version', browser.version);
});
