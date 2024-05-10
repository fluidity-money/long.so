const { defineConfig } = require("cypress")

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config)
      return config
    },
  },
});
