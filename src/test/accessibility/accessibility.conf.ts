import { config as testConfig, config as sharedConfig } from '../config';
import path from 'path';

export const config: CodeceptJS.MainConfig = {
    name: 'accessibility',
    tests: './*-test.ts',
    output: path.join(testConfig.TestFunctionalOutputPath, 'accessibility'),
    include: {
        I: '../end-to-end/tests/custom-steps.ts',
    },
    helpers: sharedConfig.helpers,
    plugins: sharedConfig.plugins,
};
