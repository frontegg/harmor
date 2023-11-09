/* eslint-disable */
export default {
  displayName: 'harmor',
  preset: './jest.preset.js',
  coverageDirectory: './coverage/harmor',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
};
