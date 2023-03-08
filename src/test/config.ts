// better handling of unhandled exceptions
import path from 'path';
import process from 'process';

process.on('unhandledRejection', reason => {
    throw reason;
});

export const config = {
    TEST_URL: process.env.TEST_URL || 'https://localhost:8080',
    SYSTEM_ADMIN_USERNAME: process.env.B2C_SYSTEM_ADMIN_USERNAME,
    SYSTEM_ADMIN_PASSWORD: process.env.B2C_SYSTEM_ADMIN_PASSWORD,
    ADMIN_USERNAME: process.env.B2C_ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.B2C_ADMIN_PASSWORD,
    MEDIA_USER_USERNAME: process.env.B2C_USERNAME,
    MEDIA_USER_PASSWORD: process.env.B2C_PASSWORD,
    DATA_MANAGEMENT_BASE_URL: process.env.DATA_MANAGEMENT_URL,
    TEST_SUITE_PREFIX: 'TEST_PIP_',
    TestHeadlessBrowser: process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'true' : true,
    TestSlowMo: 250,
    TestFunctionalOutputPath: path.join(process.cwd(), 'functional-output'),
    WaitForTimeout: 10000,
    helpers: {},
    plugins: {
        allure: {
            enabled: true,
            require: '@codeceptjs/allure-legacy'
        },
        retryFailedStep: {
            enabled: true,
        },
        tryTo: {
            enabled: true,
        },
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: true,
        },
    },
};

config.helpers = {
    Playwright: {
        url: config.TEST_URL,
        show: !config.TestHeadlessBrowser,
        browser: 'chromium',
        waitForTimeout: config.WaitForTimeout,
        waitForAction: 1000,
        waitForNavigation: 'domcontentloaded',
        ignoreHTTPSErrors: true,
    },
};
