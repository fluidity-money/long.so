import { defineConfig } from "cypress";

module.exports = defineConfig({
  supportFolder: "cypress/support",
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    // macbook-13 viewport
    viewportWidth: 1280,
    viewportHeight: 800,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
    baseUrl: "http://localhost:3000",
  },
});
