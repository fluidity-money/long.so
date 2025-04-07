import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import graphql from "@graphql-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin-ts";
import tailwindcss from 'eslint-plugin-tailwindcss'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      "@stylistic/ts": stylistic,
      "tailwindcss": tailwindcss
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    files: ["*.ts", "*.tsx"],
    processor: "@graphql-eslint/graphql",
  },
  {
    files: ["*.graphql"],
    plugins: {
      "@graphql-eslint": graphql,
    },
  },
  {
    files: ["__tests__/**"],
    ...compat.extends("plugin:jest/recommended"),
  },
  {
    files: ["e2e/**"],
    ...compat.extends("plugin:playwright/recommended"),
  },
];
