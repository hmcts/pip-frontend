module.exports = {
    cache: true,
    cacheDirectory: '/tmp/jest-cache',
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    roots: ['<rootDir>/src/test/unit'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        '^uuid$': 'uuid',
    },
    modulePathIgnorePatterns: ['<rootDir>/src/test/unit/mocks'],
    testEnvironment: 'jsdom',
    testTimeout: 10000,
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverageFrom: ['!**/modules/**'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
};
