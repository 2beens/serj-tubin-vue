module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': require.resolve('@vue/vue2-jest'),
    '^.+\\.jsx?$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [],
  testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)', '**/__tests__/*.[jt]s?(x)'],
  testURL: 'http://localhost/',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
}
