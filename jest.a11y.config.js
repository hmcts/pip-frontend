module.exports = {
  roots: ['<rootDir>/src/test/a11y'],
  testRegex: "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
  testEnvironment: "node",
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  setupFiles: ["<rootDir>/jestEnvVars.js"],
  testTimeout: 30000,
}
