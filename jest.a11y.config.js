module.exports = {
  roots: ['<rootDir>/src/test/a11y'],
  "testRegex": "(/src/test/.*|\\.(test|spec))\\.(ts|js)$",
   "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "testEnvironment": "node",
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

process.env = Object.assign(process.env, {
  PIP_LOCAL_API: true,
  NODE_TLS_REJECT_UNAUTHORIZED:0,
  API_URL: 'https://localhost:8080'
});
