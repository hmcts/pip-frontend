import { config as testConfig } from '../config';

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
    name: 'functional',
    tests: './tests/*-test.ts',
    output: '../../../functional-output/functional/reports',
    include: {
        I: './tests/custom-steps.ts',
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
