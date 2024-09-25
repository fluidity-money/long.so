# Longtail AMM webapp

## Getting Started

First, run the development server:

    pnpm dev

## Code generation with GraphQL

    pnpm run codegen

## Environment variables

| Environment variable                            | Description                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `LONGTAIL_GRAPHQL_SCHEMA`                       | Real path to the GraphQL schema file found in the cmd/graphql.ethereum directory. Used for codegen. |
| `NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID` | Walletconnect project ID that's needed to build the frontend.                                       |
