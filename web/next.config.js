const path = require("path");
const childProcess = require("child_process");

const gitHash =
  childProcess.execSync("git rev-parse HEAD").toString().trim();

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },

  env: {
    GIT_HASH: gitHash
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [{ loader: "@svgr/webpack", options: { icon: true } }],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `
      @use "@/styles/variables" as *;
      @use "@/styles/mixins" as *;
    `,
  },
};

module.exports = nextConfig;
