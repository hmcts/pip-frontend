module.exports = {
  roots: ['<rootDir>/src/test/unit'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
   "moduleFileExtensions": [
    "ts",
    "js"
  ],
  modulePathIgnorePatterns: ["<rootDir>/src/test/unit/mocks"],
  "testEnvironment": "jsdom",
  "testTimeout": 30000,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverageFrom: [ "!**/modules/**" ],
  setupFiles: ["<rootDir>/jestEnvVars.js"]


}
