import { defineConfig } from "cypress";
import { defaultConfig } from "cypress";

export default defineConfig({
  ...defaultConfig,
  viewportWidth: 1366,
  viewportHeight: 800,
});
