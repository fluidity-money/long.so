/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Amount = {
  __typename?: 'Amount';
  decimals: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
  token: Token;
  valueScaled: Scalars['String']['output'];
  valueUnscaled: Scalars['String']['output'];
  valueUsd: Scalars['String']['output'];
};

export type LiquidityOverTime = {
  __typename?: 'LiquidityOverTime';
  daily: Array<PairAmount>;
  monthly: Array<PairAmount>;
};

export type Mutation = {
  __typename?: 'Mutation';
  setVolumeYieldPriceAndTVLForLastHour?: Maybe<Scalars['ID']['output']>;
};

export type PairAmount = {
  __typename?: 'PairAmount';
  fusdc: Amount;
  timestamp: Scalars['Int']['output'];
  token1: Amount;
};

export type PriceOverTime = {
  __typename?: 'PriceOverTime';
  daily: Array<Scalars['String']['output']>;
  monthly: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /**
   * getPool using the address of the token that's involved.
   *
   * Follows the same caching behaviour as the pools endpoint.
   */
  getPool?: Maybe<SeawaterPool>;
  /**
   * getPoolPositions using the address of the pool involved.
   *
   * Very cached. Should not be used. The getPoolPositionsForOwner is better.
   */
  getPoolPositions?: Maybe<Array<SeawaterPosition>>;
  /**
   * getPosition that's owned by any pool using it's ID, based on what's known to the database.
   *
   * Skips the cache for the most part.
   */
  getPosition?: Maybe<SeawaterPosition>;
  /**
   * getPositions that're owned by a specific wallet.
   *
   * Uses the cache with a 10-20 second window.
   */
  getPositions: Array<SeawaterPosition>;
  /**
   * getSwaps made using a pool. Safe to use to get up to date information on swaps going
   * through the UI.
   *
   * Not cached at all.
   */
  getSwaps?: Maybe<Array<SeawaterSwap>>;
  /**
   * getWallet based on information including balances. SHOULD NOT be used to get
   * information that's needed consistently. Use the frontend instead after getting addresess
   * elsewhere.
   *
   * Cached aggressively.
   */
  getWallet?: Maybe<Wallet>;
  pools: Array<SeawaterPool>;
};


export type QueryGetPoolArgs = {
  address: Scalars['String']['input'];
};


export type QueryGetPoolPositionsArgs = {
  address: Scalars['String']['input'];
};


export type QueryGetPositionArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetPositionsArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryGetSwapsArgs = {
  pool: Scalars['String']['input'];
};


export type QueryGetWalletArgs = {
  address: Scalars['String']['input'];
};

export type SeawaterPool = {
  __typename?: 'SeawaterPool';
  address: Scalars['String']['output'];
  earnedFeesAPRFUSDC: Scalars['String']['output'];
  earnedFeesAPRToken1: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  liquidityIncentives: Amount;
  liquidityOverTime: LiquidityOverTime;
  positions: Array<SeawaterPosition>;
  positionsForUser: Array<SeawaterPosition>;
  priceOverTime: PriceOverTime;
  superIncentives: Amount;
  swaps: Array<SeawaterSwap>;
  swapsForUser: Array<SeawaterSwap>;
  token: Token;
  tvlOverTime: TvlOverTime;
  utilityIncentives: Array<UtilityIncentive>;
  volumeOverTime: VolumeOverTime;
  yieldOverTime: YieldOverTime;
};


export type SeawaterPoolPositionsForUserArgs = {
  address: Scalars['String']['input'];
};


export type SeawaterPoolSwapsForUserArgs = {
  address: Scalars['String']['input'];
};

/** SeawaterPosition owned by a user. */
export type SeawaterPosition = {
  __typename?: 'SeawaterPosition';
  id: Scalars['ID']['output'];
  liquidity: PairAmount;
  lower: Scalars['String']['output'];
  owner: Wallet;
  pool: SeawaterPool;
  positionId: Scalars['String']['output'];
  upper: Scalars['String']['output'];
};

export type SeawaterSwap = {
  __typename?: 'SeawaterSwap';
  amountIn: Amount;
  amountOut: Amount;
  sender: Wallet;
  timestamp: Scalars['Int']['output'];
};

export type Token = {
  __typename?: 'Token';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['String']['output'];
};

export type TokenBalance = {
  __typename?: 'TokenBalance';
  balance: Amount;
  token: Token;
};

export type TvlOverTime = {
  __typename?: 'TvlOverTime';
  daily: Array<Scalars['String']['output']>;
  monthly: Array<Scalars['String']['output']>;
};

export type UtilityIncentive = {
  __typename?: 'UtilityIncentive';
  amountGivenOut: Scalars['String']['output'];
  maximumAmount: Scalars['String']['output'];
};

export type VolumeOverTime = {
  __typename?: 'VolumeOverTime';
  daily: Array<PairAmount>;
  monthly: Array<PairAmount>;
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String']['output'];
  balances: Array<TokenBalance>;
  id: Scalars['ID']['output'];
  positions?: Maybe<Array<SeawaterPosition>>;
};

export type YieldOverTime = {
  __typename?: 'YieldOverTime';
  daily: Array<PairAmount>;
  monthly: Array<PairAmount>;
};

export type AllPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', name: string }, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, tvlOverTime: { __typename?: 'TvlOverTime', daily: Array<string> } }> };


export const AllPoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllPools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tvlOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}}]}}]}}]} as unknown as DocumentNode<AllPoolsQuery, AllPoolsQueryVariables>;