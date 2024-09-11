import type { CodegenConfig } from "@graphql-codegen/cli";
import serverEnv from "./src/config/serverEnv";
const config: CodegenConfig = {
  overwrite: true,
  schema: serverEnv.LONGTAIL_GRAPHQL_SCHEMA,
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
