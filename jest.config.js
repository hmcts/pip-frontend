module.exports = {
  roots: ['<rootDir>/src/test/unit'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
   "moduleFileExtensions": [
    "ts",
    "js"
  ],
  modulePathIgnorePatterns: ["<rootDir>/src/test/unit/mocks"],
  preset: 'ts-jest/presets/js-with-ts',
  "testEnvironment": "jsdom",
  "testTimeout": 10000,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  "transformIgnorePatterns": [
    "!node_modules/@hmcts/cookie-manager"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverageFrom: [ "!**/modules/**" ],
  setupFiles: ["<rootDir>/jestEnvVars.js"]


}
