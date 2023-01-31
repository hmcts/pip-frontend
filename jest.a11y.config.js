module.exports = {
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    roots: ['<rootDir>/src/test/a11y'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
    moduleFileExtensions: ['ts', 'js'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
    // pa11y recommended default
    testTimeout: 60000,
};
