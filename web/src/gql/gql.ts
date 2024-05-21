/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment SwapFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n    earnedFeesAPRToken1\n    token {\n      address\n      decimals\n      name\n      symbol\n    }\n  }\n": types.SwapFormFragmentFragmentDoc,
    "\n  fragment AllPoolsFragment on SeawaterPool {\n    address\n    token {\n      name\n    }\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    tvlOverTime {\n      daily\n    }\n    liquidityOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    liquidityIncentives {\n      valueUsd\n    }\n    superIncentives {\n      valueUsd\n    }\n  }\n": types.AllPoolsFragmentFragmentDoc,
    "\n  fragment MyPositionsWalletFragment on Wallet {\n    id\n    positions {\n      id\n      pool {\n        token {\n          name\n          address\n          symbol\n        }\n      }\n    }\n  }\n": types.MyPositionsWalletFragmentFragmentDoc,
    "\n  fragment SelectPrimeAssetFragment on SeawaterPool {\n    address\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    token {\n      name\n      symbol\n      address\n    }\n  }\n": types.SelectPrimeAssetFragmentFragmentDoc,
    "\n  fragment ManagePoolFragment on SeawaterPool {\n    address\n    id\n    token {\n      symbol\n      name\n    }\n    liquidityIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    superIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    utilityIncentives {\n      amountGivenOut\n      maximumAmount\n    }\n    earnedFeesAPRFUSDC\n  }\n": types.ManagePoolFragmentFragmentDoc,
    "\n  fragment SwapExploreFragment on SeawaterPool {\n    token {\n      name\n      symbol\n      address\n    }\n    price\n  }\n": types.SwapExploreFragmentFragmentDoc,
    "\n  fragment StakeFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n  }\n": types.StakeFormFragmentFragmentDoc,
    "\n  fragment SwapProPoolFragment on SeawaterPool {\n    address\n    token {\n      address\n    }\n    priceOverTime {\n      daily\n      monthly\n    }\n    volumeOverTime {\n      monthly {\n        timestamp\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n      daily {\n        timestamp # TODO: timestamp is always 0\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    liquidityOverTime {\n      daily {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n      monthly {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n  }\n": types.SwapProPoolFragmentFragmentDoc,
    "\n  fragment SwapProTransactionsFragment on SeawaterSwap {\n    timestamp\n    amountIn {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n    amountOut {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n  }\n": types.SwapProTransactionsFragmentFragmentDoc,
    "\n  query AllData($address: String!) {\n    getWallet(address: $address) {\n      # add wallet fragments here\n      ...MyPositionsWalletFragment\n    }\n\n    pools {\n      # used for the pool selector\n      address\n\n      swapsForUser(address: $address) {\n        # add transaction fragments here\n        ...SwapProTransactionsFragment\n      }\n\n      # add general fragments here\n      ...SwapProPoolFragment\n      ...AllPoolsFragment\n      ...SelectPrimeAssetFragment\n      ...SwapExploreFragment\n      ...ManagePoolFragment\n      ...SwapFormFragment\n      ...StakeFormFragment\n    }\n  }\n": types.AllDataDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SwapFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n    earnedFeesAPRToken1\n    token {\n      address\n      decimals\n      name\n      symbol\n    }\n  }\n"): (typeof documents)["\n  fragment SwapFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n    earnedFeesAPRToken1\n    token {\n      address\n      decimals\n      name\n      symbol\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AllPoolsFragment on SeawaterPool {\n    address\n    token {\n      name\n    }\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    tvlOverTime {\n      daily\n    }\n    liquidityOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    liquidityIncentives {\n      valueUsd\n    }\n    superIncentives {\n      valueUsd\n    }\n  }\n"): (typeof documents)["\n  fragment AllPoolsFragment on SeawaterPool {\n    address\n    token {\n      name\n    }\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    tvlOverTime {\n      daily\n    }\n    liquidityOverTime {\n      daily {\n        fusdc {\n          valueScaled\n        }\n      }\n    }\n    liquidityIncentives {\n      valueUsd\n    }\n    superIncentives {\n      valueUsd\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyPositionsWalletFragment on Wallet {\n    id\n    positions {\n      id\n      pool {\n        token {\n          name\n          address\n          symbol\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MyPositionsWalletFragment on Wallet {\n    id\n    positions {\n      id\n      pool {\n        token {\n          name\n          address\n          symbol\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SelectPrimeAssetFragment on SeawaterPool {\n    address\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    token {\n      name\n      symbol\n      address\n    }\n  }\n"): (typeof documents)["\n  fragment SelectPrimeAssetFragment on SeawaterPool {\n    address\n    volumeOverTime {\n      daily {\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    token {\n      name\n      symbol\n      address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ManagePoolFragment on SeawaterPool {\n    address\n    id\n    token {\n      symbol\n      name\n    }\n    liquidityIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    superIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    utilityIncentives {\n      amountGivenOut\n      maximumAmount\n    }\n    earnedFeesAPRFUSDC\n  }\n"): (typeof documents)["\n  fragment ManagePoolFragment on SeawaterPool {\n    address\n    id\n    token {\n      symbol\n      name\n    }\n    liquidityIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    superIncentives {\n      valueScaled # TODO: we want a percentage here\n    }\n    utilityIncentives {\n      amountGivenOut\n      maximumAmount\n    }\n    earnedFeesAPRFUSDC\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SwapExploreFragment on SeawaterPool {\n    token {\n      name\n      symbol\n      address\n    }\n    price\n  }\n"): (typeof documents)["\n  fragment SwapExploreFragment on SeawaterPool {\n    token {\n      name\n      symbol\n      address\n    }\n    price\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment StakeFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n  }\n"): (typeof documents)["\n  fragment StakeFormFragment on SeawaterPool {\n    address\n    earnedFeesAPRFUSDC\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SwapProPoolFragment on SeawaterPool {\n    address\n    token {\n      address\n    }\n    priceOverTime {\n      daily\n      monthly\n    }\n    volumeOverTime {\n      monthly {\n        timestamp\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n      daily {\n        timestamp # TODO: timestamp is always 0\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    liquidityOverTime {\n      daily {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n      monthly {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment SwapProPoolFragment on SeawaterPool {\n    address\n    token {\n      address\n    }\n    priceOverTime {\n      daily\n      monthly\n    }\n    volumeOverTime {\n      monthly {\n        timestamp\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n      daily {\n        timestamp # TODO: timestamp is always 0\n        token1 {\n          valueUsd\n        }\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n    liquidityOverTime {\n      daily {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n      monthly {\n        timestamp\n        fusdc {\n          valueUsd\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SwapProTransactionsFragment on SeawaterSwap {\n    timestamp\n    amountIn {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n    amountOut {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment SwapProTransactionsFragment on SeawaterSwap {\n    timestamp\n    amountIn {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n    amountOut {\n      valueScaled\n      token {\n        symbol\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllData($address: String!) {\n    getWallet(address: $address) {\n      # add wallet fragments here\n      ...MyPositionsWalletFragment\n    }\n\n    pools {\n      # used for the pool selector\n      address\n\n      swapsForUser(address: $address) {\n        # add transaction fragments here\n        ...SwapProTransactionsFragment\n      }\n\n      # add general fragments here\n      ...SwapProPoolFragment\n      ...AllPoolsFragment\n      ...SelectPrimeAssetFragment\n      ...SwapExploreFragment\n      ...ManagePoolFragment\n      ...SwapFormFragment\n      ...StakeFormFragment\n    }\n  }\n"): (typeof documents)["\n  query AllData($address: String!) {\n    getWallet(address: $address) {\n      # add wallet fragments here\n      ...MyPositionsWalletFragment\n    }\n\n    pools {\n      # used for the pool selector\n      address\n\n      swapsForUser(address: $address) {\n        # add transaction fragments here\n        ...SwapProTransactionsFragment\n      }\n\n      # add general fragments here\n      ...SwapProPoolFragment\n      ...AllPoolsFragment\n      ...SelectPrimeAssetFragment\n      ...SwapExploreFragment\n      ...ManagePoolFragment\n      ...SwapFormFragment\n      ...StakeFormFragment\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;