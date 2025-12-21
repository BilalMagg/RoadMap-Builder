import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  forceExit: true,
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
};

export default config;