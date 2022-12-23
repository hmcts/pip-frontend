module.exports = {
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  roots: ['<rootDir>/src/test/unit'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
   "moduleFileExtensions": [
    "ts",
    "js"
  ],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
  modulePathIgnorePatterns: ["<rootDir>/src/test/unit/mocks"],
  "testEnvironment": "jsdom",
  "testTimeout": 10000,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  collectCoverageFrom: [ "!**/modules/**" ],
  setupFiles: ["<rootDir>/jestEnvVars.js"]


}
