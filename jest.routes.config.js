module.exports = {
    transformIgnorePatterns: ['/node_modules/(?!(sinon)|!(axios)/)'],
    roots: ['<rootDir>/src/test/routes'],
    testTimeout: 30000,
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
        '^sinon$': require.resolve('sinon'),
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
};
