import path from 'path';
import { config as testConfig } from '../config';
import { setHeadlessWhen } from '@codeceptjs/configure';

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
    name: 'functional',
    tests: './tests/**/*-test.ts',
    output: path.join(testConfig.TestFunctionalOutputPath, 'functional/reports'),
    include: {
        I: './tests/custom-steps.ts',
    },
    maskSensitiveData: true,
    helpers: testConfig.helpers,
    plugins: {
        ...testConfig.plugins,
        pauseOnFail: {
            enabled: !testConfig.TestHeadlessBrowser,
        },
    },
};
