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
   */
  getSwaps?: Maybe<Array<SeawaterSwap>>;
  /**
   * getWallet based on information including balances. SHOULD NOT be used to get
   * information that's needed consistently. Use the frontend instead after getting addresess
   * elsewhere.
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

/** SeawaterLiquidity available in a pool summed and grouped by ticks of 5000 at a time. */
export type SeawaterLiquidity = {
  __typename?: 'SeawaterLiquidity';
  amount: PairAmount;
  id: Scalars['ID']['output'];
  positions: Array<SeawaterPosition>;
  tickLower: Scalars['String']['output'];
  tickUpper: Scalars['String']['output'];
};

export type SeawaterPool = {
  __typename?: 'SeawaterPool';
  /** Address of the pool, and of the token that's traded. */
  address: Scalars['String']['output'];
  earnedFeesAPRFUSDC: Array<Scalars['String']['output']>;
  earnedFeesAPRToken1: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /**
   * Liquidity available in a pool, with only 20 elements being returned encompassing the
   * tick ranges subdivided.
   */
  liquidity: Array<SeawaterLiquidity>;
  liquidityIncentives: Amount;
  /** The number of assets (the liquidity) that were kept in the pool, historically. */
  liquidityOverTime: LiquidityOverTime;
  positions: Array<SeawaterPosition>;
  positionsForUser: Array<SeawaterPosition>;
  /**
   * Information on the current price, last cached. Determined by the last tick of a trade
   * that was made.
   */
  price: Scalars['String']['output'];
  /** Historical price over time data that's available. */
  priceOverTime: PriceOverTime;
  superIncentives: Amount;
  swaps: Array<SeawaterSwap>;
  swapsForUser: Array<SeawaterSwap>;
  /** Tick spacing of the current pool, useful for graph rendering. */
  tickSpacing: Scalars['String']['output'];
  /** More token information about the counter asset that's available. */
  token: Token;
  /** The USD value of assets in the pool over time. Cheaper to access than liquidityOverTime. */
  tvlOverTime: TvlOverTime;
  utilityIncentives: Array<UtilityIncentive>;
  /** The number of assets that were traded (the volume) over time in the pool, historically. */
  volumeOverTime: VolumeOverTime;
  /**
   * Yield paid by the pool over time. Yield is fees paid to the pool, as well as yield from
   * using Fluid Assets on the pool (Utility Mining and otherwise.)
   */
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

export type SwapFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, earnedFeesAPRFUSDC: Array<string>, earnedFeesAPRToken1: Array<string>, token: { __typename?: 'Token', address: string, decimals: number, name: string, symbol: string } } & { ' $fragmentName'?: 'SwapFormFragmentFragment' };

export type AllPoolsFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', name: string }, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, tvlOverTime: { __typename?: 'TvlOverTime', daily: Array<string> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, liquidityIncentives: { __typename?: 'Amount', valueUsd: string }, superIncentives: { __typename?: 'Amount', valueUsd: string } } & { ' $fragmentName'?: 'AllPoolsFragmentFragment' };

export type MyPositionsWalletFragmentFragment = { __typename?: 'Wallet', id: string, positions?: Array<{ __typename?: 'SeawaterPosition', id: string, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string } } }> | null } & { ' $fragmentName'?: 'MyPositionsWalletFragmentFragment' };

export type SelectPrimeAssetFragmentFragment = { __typename?: 'SeawaterPool', address: string, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string } }> }, token: { __typename?: 'Token', name: string, symbol: string, address: string } } & { ' $fragmentName'?: 'SelectPrimeAssetFragmentFragment' };

export type ManagePoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, id: string, earnedFeesAPRFUSDC: Array<string>, token: { __typename?: 'Token', symbol: string, name: string }, liquidityIncentives: { __typename?: 'Amount', valueScaled: string }, superIncentives: { __typename?: 'Amount', valueScaled: string }, utilityIncentives: Array<{ __typename?: 'UtilityIncentive', amountGivenOut: string, maximumAmount: string }> } & { ' $fragmentName'?: 'ManagePoolFragmentFragment' };

export type SwapExploreFragmentFragment = { __typename?: 'SeawaterPool', price: string, token: { __typename?: 'Token', name: string, symbol: string, address: string } } & { ' $fragmentName'?: 'SwapExploreFragmentFragment' };

export type MyPositionsInventoryWalletFragmentFragment = { __typename?: 'Wallet', id: string, positions?: Array<{ __typename?: 'SeawaterPosition', id: string, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string } } }> | null } & { ' $fragmentName'?: 'MyPositionsInventoryWalletFragmentFragment' };

export type TradeTabTransactionsFragmentFragment = { __typename?: 'SeawaterSwap', timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } } & { ' $fragmentName'?: 'TradeTabTransactionsFragmentFragment' };

export type StakeFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, earnedFeesAPRFUSDC: Array<string> } & { ' $fragmentName'?: 'StakeFormFragmentFragment' };

export type SwapProPoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', address: string }, priceOverTime: { __typename?: 'PriceOverTime', daily: Array<string>, monthly: Array<string> }, volumeOverTime: { __typename?: 'VolumeOverTime', monthly: Array<{ __typename?: 'PairAmount', timestamp: number, token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }>, daily: Array<{ __typename?: 'PairAmount', timestamp: number, token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }>, monthly: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }> } } & { ' $fragmentName'?: 'SwapProPoolFragmentFragment' };

export type SwapProTransactionsFragmentFragment = { __typename?: 'SeawaterSwap', timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } } & { ' $fragmentName'?: 'SwapProTransactionsFragmentFragment' };

export type AllDataQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type AllDataQuery = { __typename?: 'Query', getWallet?: (
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'MyPositionsWalletFragmentFragment': MyPositionsWalletFragmentFragment;'MyPositionsInventoryWalletFragmentFragment': MyPositionsInventoryWalletFragmentFragment } }
  ) | null, pools: Array<(
    { __typename?: 'SeawaterPool', address: string, swapsForUser: Array<(
      { __typename?: 'SeawaterSwap' }
      & { ' $fragmentRefs'?: { 'SwapProTransactionsFragmentFragment': SwapProTransactionsFragmentFragment;'TradeTabTransactionsFragmentFragment': TradeTabTransactionsFragmentFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'SwapProPoolFragmentFragment': SwapProPoolFragmentFragment;'AllPoolsFragmentFragment': AllPoolsFragmentFragment;'SelectPrimeAssetFragmentFragment': SelectPrimeAssetFragmentFragment;'SwapExploreFragmentFragment': SwapExploreFragmentFragment;'ManagePoolFragmentFragment': ManagePoolFragmentFragment;'SwapFormFragmentFragment': SwapFormFragmentFragment;'StakeFormFragmentFragment': StakeFormFragmentFragment } }
  )> };

export const SwapFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<SwapFormFragmentFragment, unknown>;
export const AllPoolsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tvlOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]} as unknown as DocumentNode<AllPoolsFragmentFragment, unknown>;
export const MyPositionsWalletFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPositionsWalletFragmentFragment, unknown>;
export const SelectPrimeAssetFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<SelectPrimeAssetFragmentFragment, unknown>;
export const ManagePoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountGivenOut"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<ManagePoolFragmentFragment, unknown>;
export const SwapExploreFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]} as unknown as DocumentNode<SwapExploreFragmentFragment, unknown>;
export const MyPositionsInventoryWalletFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPositionsInventoryWalletFragmentFragment, unknown>;
export const TradeTabTransactionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]} as unknown as DocumentNode<TradeTabTransactionsFragmentFragment, unknown>;
export const StakeFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<StakeFormFragmentFragment, unknown>;
export const SwapProPoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwapProPoolFragmentFragment, unknown>;
export const SwapProTransactionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]} as unknown as DocumentNode<SwapProTransactionsFragmentFragment, unknown>;
export const AllDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWallet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyPositionsWalletFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"swapsForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapProTransactionsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TradeTabTransactionsFragment"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapProPoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllPoolsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectPrimeAssetFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapExploreFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManagePoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapFormFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StakeFormFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tvlOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountGivenOut"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<AllDataQuery, AllDataQueryVariables>;