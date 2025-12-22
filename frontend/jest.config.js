/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    // Whenever Jest sees "utils/envConfig", it loads the mock instead
    ".*utils/envConfig$": "<rootDir>/src/__mocks__/envConfigMock.ts",
  },
};