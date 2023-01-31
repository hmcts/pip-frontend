module.exports = {
    roots: ['<rootDir>/src/test/e2e/Tests'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    preset: 'jest-puppeteer',
    globals: {
        URL: 'https://localhost:8080',
    },
    verbose: true,
};
