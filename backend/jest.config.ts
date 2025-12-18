import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  forceExit: true,
  // Indique à Jest où chercher les fichiers de test
  testMatch: ['**/**/*.test.ts'],
  // Nettoie les mocks automatiquement entre chaque test
  clearMocks: true,
};

export default config;