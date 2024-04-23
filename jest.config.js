module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}", // Adjust this pattern to match your file structure
    "!src/**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: -10,
    },
  },
  coverageReporters: ["json", "lcov", "text", "clover"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
