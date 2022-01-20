/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  globals: {
    URL: '<http://localhost:3000>',
  },
  preset: 'jest-puppeteer',
  roots: ['tests'],
  verbose: true,
  collectCoverageFrom: ['dist/scripts/carouzel.js'],
  coverageReporters: ['text', 'lcov', 'json', 'json-summary'],
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['jest-puppeteer-istanbul/lib/setup'],
  reporters: ['default', 'jest-puppeteer-istanbul/lib/reporter'],
  coverageDirectory: 'coverage_result',
};
