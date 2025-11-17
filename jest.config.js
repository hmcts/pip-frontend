module.exports = {
    cache: true,
    cacheDirectory: '/tmp/jest-cache',
    preset: 'ts-jest/presets/js-with-babel',
    transformIgnorePatterns: [
        '/node_modules/(?!(chai|@azure|uuid|applicationinsights/node_modules/@azure|@typespec)/)',
    ],
    roots: ['<rootDir>/src/test/unit'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        '^sinon$': require.resolve('sinon'),
    },
    modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks'],
    testEnvironment: 'jsdom',
    testTimeout: 10000,
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['**'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
};
