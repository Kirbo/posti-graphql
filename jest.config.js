module.exports = {
  bail: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/?(**/)*.[jt]s',
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/src/config/',
    '/src/graphql/',
    '/src/build.js',
    '/src/server.js',
    '/src/posti.js',
    '/src/index.js',
  ],
  coverageReporters: [
    'text',
    'html',
  ],
  notify: true,
  testMatch: [
    '**/?(*.)test.[jt]s',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/config/',
    '/src/graphql/',
    '/src/build.js',
    '/src/server.js',
    '/src/index.js',
  ],
  testURL: 'http://localhost/',
};
