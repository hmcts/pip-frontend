import path from 'path';
import { config as testConfig } from '../config';
import { setHeadlessWhen } from '@codeceptjs/configure';

setHeadlessWhen(testConfig.TestHeadlessBrowser);

let initialPerformanceConfig= {
    name: 'performance',
    tests: './tests/performance/*-test.ts',
    output: path.join(testConfig.TestPerformanceOutputPath, 'reports'),
    include: {
        I: './tests/custom-steps.ts',
    },
    maskSensitiveData: true,
    helpers: testConfig.helpers,
    mocha: {},
    plugins: {
        ...testConfig.plugins,
        pauseOnFail: {
            enabled: !testConfig.TestHeadlessBrowser,
        },
    }
};

initialPerformanceConfig.helpers['Playwright']['waitForAction'] = 1000;

export const config: CodeceptJS.MainConfig = initialPerformanceConfig;
