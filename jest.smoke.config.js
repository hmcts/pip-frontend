module.exports = {
    preset: "ts-jest/presets/js-with-babel",
    transformIgnorePatterns: ["/node_modules/(?!(chai)/)"],
    roots: ['<rootDir>/src/test/smoke'],
    testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
