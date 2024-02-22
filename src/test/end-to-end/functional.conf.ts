import path from 'path';
import { config as testConfig } from '../config';
import { clearTestData } from './shared/testingSupportApi';

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
    name: 'functional',
    tests: './tests/**/*-test.ts',
    output: path.join(testConfig.TestFunctionalOutputPath, 'functional/reports'),
    include: {
        I: './tests/custom-steps.ts',
    },
    async teardownAll() {
        await clearTestData();
    },
    helpers: testConfig.helpers,
    mocha: {},
    plugins: {
        ...testConfig.plugins,
        pauseOnFail: {
            enabled: !testConfig.TestHeadlessBrowser,
        },
    },
};
