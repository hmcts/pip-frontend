module.exports = {
  roots: ['<rootDir>/src/test/unit'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
   "moduleFileExtensions": [
    "ts",
    "js"
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  "transformIgnorePatterns": [
    "!node_modules/@hmcts/cookie-manager"
  ],
  modulePathIgnorePatterns: ["<rootDir>/src/test/unit/mocks"],
  preset: 'ts-jest/presets/js-with-babel',
  "testEnvironment": "jsdom",
  "testTimeout": 10000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverageFrom: [ "!**/modules/**" ],
  setupFiles: ["<rootDir>/jestEnvVars.js"]


}
