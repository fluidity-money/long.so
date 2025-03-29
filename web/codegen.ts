import type { CodegenConfig } from "@graphql-codegen/cli";
import serverEnv from "./src/config/serverEnv";
const config: CodegenConfig = {
  overwrite: true,
  schema: [
    serverEnv.LONGTAIL_GRAPHQL_SCHEMA,
    "https://points-graph.superposition.so/graphql",
    "https://graph.codex.io/schema/latest.graphql",
  ],
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
