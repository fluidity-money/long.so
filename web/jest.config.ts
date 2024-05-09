
import nextJest from "next/jest.js";

import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],

  collectCoverage: true,

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  fakeTimers: {
    "enableGlobally": true
  },

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules"
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ]
};

export default createJestConfig(config);
