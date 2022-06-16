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
  modulePathIgnorePatterns: ["<rootDir>/src/test/unit/mocks"],
  "testEnvironment": "jsdom",
  "testTimeout": 10000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverageFrom: [ "!**/modules/**" ],
  setupFiles: ["<rootDir>/jestEnvVars.js"]


}
