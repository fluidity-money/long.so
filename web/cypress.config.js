import { defineConfig } from "cypress";

module.exports = defineConfig({
  supportFolder: "cypress/support",
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      // require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    // supportFile: "cypress/support/component.ts",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    baseUrl: "http://localhost:3000",
    // supportFile: "cypress/support/e2e.ts",
  },
});
