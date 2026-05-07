export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/app.js", "!src/index.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  transform: {},
  moduleNameMapper: {},
};
