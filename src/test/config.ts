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
    CFT_USERNAME: process.env.CFT_VALID_USERNAME,
    CFT_PASSWORD: process.env.CFT_VALID_PASSWORD,
    CFT_INVALID_USERNAME: process.env.CFT_INVALID_USERNAME,
    CFT_INVALID_PASSWORD: process.env.CFT_INVALID_PASSWORD,
    SYSTEM_ADMIN_PROVENANCE_ID: process.env.SYSTEM_ADMIN_PROVENANCE_ID,
    SYSTEM_ADMIN_USER_ID: process.env.SYSTEM_ADMIN_USER_ID,
    VERIFIED_USER_ID: process.env.VERIFIED_USER_ID,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
    SSO_TEST_ADMIN_CTSC_USER: process.env.SSO_TEST_ADMIN_CTSC_USER,
    SSO_TEST_ADMIN_CTSC_PWD: process.env.SSO_TEST_ADMIN_CTSC_PWD,
    SSO_TEST_ADMIN_LOCAL_USER: process.env.SSO_TEST_ADMIN_LOCAL_USER,
    SSO_TEST_ADMIN_LOCAL_PWD: process.env.SSO_TEST_ADMIN_LOCAL_PWD,
    SSO_TEST_SYSTEM_ADMIN_USER: process.env.SSO_TEST_SYSTEM_ADMIN_USER,
    SSO_TEST_SYSTEM_ADMIN_PWD: process.env.SSO_TEST_SYSTEM_ADMIN_PWD,
    SSO_TEST_SYSTEM_ADMIN_USER_ID: process.env.SSO_SYSTEM_ADMIN_USER_ID,
    SSO_TEST_NO_ROLES_USER: process.env.SSO_TEST_NO_ROLES_USER,
    SSO_TEST_NO_ROLES_PWD: process.env.SSO_TEST_NO_ROLES_PWD,
    DATA_MANAGEMENT_BASE_URL:
        process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net',
    SUBSCRIPTION_MANAGEMENT_BASE_URL:
        process.env.SUBSCRIPTION_MANAGEMENT_URL || 'https://pip-subscription-management.staging.platform.hmcts.net',
    ACCOUNT_MANAGEMENT_BASE_URL:
        process.env.ACCOUNT_MANAGEMENT_URL || 'https://pip-account-management.staging.platform.hmcts.net',

    TEST_SUITE_PREFIX:
        'TEST_PIP' +
        (process.env.TEST_URL ? process.env.TEST_URL.split('.')[0].replace('https://pip-frontend', '') : 'localhost'),
    TestHeadlessBrowser: process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'true' : true,
    TestSlowMo: 250,
    TestFunctionalOutputPath: path.join(process.cwd(), 'functional-output'),
    WaitForTimeout: 20000,
    helpers: {},
    plugins: {
        allure: {
            enabled: true,
            require: '@codeceptjs/allure-legacy',
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
    A11yHelper: {
        require: 'codeceptjs-a11y-helper',
        axeOptions: {
            runOnly: {
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],
            },
        },
        outputDir: 'functional-output/accessibility',
        reportFileName: 'a11y-audit.html',
    },
    TestingSupportApiHelper: {
        require: '../end-to-end/shared/helpers/testingSupportApiHelper.ts',
    },
    FileSystem: {},
};
