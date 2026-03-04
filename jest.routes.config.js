module.exports = {
    preset: 'ts-jest/presets/js-with-babel',
    transformIgnorePatterns: [
        '/node_modules/(?!(chai|@azure|uuid|applicationinsights/node_modules/@azure|@typespec|openid-client|oauth4webapi|jose|@azure-rest)/)',
    ],
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
    setupFiles: ['<rootDir>/jestEnvVars.js', '<rootDir>/globalAzureUnitConfig.ts'],
    setupFilesAfterEnv: ['<rootDir>/globalHooks.ts'],
};
