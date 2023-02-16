module.exports = {
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
    roots: ['<rootDir>/src/test/routes'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^axios$': require.resolve('axios'),
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['<rootDir>/jestEnvVars.js'],
};
