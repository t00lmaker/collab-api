module.exports = {
  testMatch: ['**/*.spec.js'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**']
}
