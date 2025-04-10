import { NextConfig } from "next";
import childProcess from "node:child_process";
import { withSentryConfig } from "@sentry/nextjs";
const gitHash = childProcess
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_HASH: gitHash,
  },
  turbo: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    if (process.env.NODE_V8_COVERAGE) {
      Object.defineProperty(config, "devtool", {
        get() {
          return "source-map";
        },
        set() {},
      });
    }

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
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
};
export default withSentryConfig(nextConfig, {
  org: "fluidity-money",
  project: "longtail-testnet",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
  autoInstrumentMiddleware: false,
  autoInstrumentServerFunctions: false,
});
