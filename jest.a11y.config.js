module.exports = {
    transformIgnorePatterns: ['/node_modules/(?!(sinon)|!(axios)/)'],
    roots: ['<rootDir>/src/test/a11y/tests'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        '^sinon$': require.resolve('sinon'),
    },
    moduleFileExtensions: ['ts', 'js'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
    // pa11y recommended default
    testTimeout: 60000,
};
