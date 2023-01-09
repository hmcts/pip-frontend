// better handling of unhandled exceptions
import path from 'path';
import process from 'process';

process.on('unhandledRejection', reason => {
  throw reason;
});

export const config = {
  TEST_URL: process.env.TEST_URL || 'https://localhost:8080',
  TEST_SUITE_PREFIX: 'TEST_PIP_',
  TestHeadlessBrowser: process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'true' : true,
  TestSlowMo: 250,
  TestFunctionalOutputPath: path.join(process.cwd(), 'functional-output'),
  WaitForTimeout: 10000,
  helpers: {},
  plugins: {
    allure: {
      enabled: true,
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
