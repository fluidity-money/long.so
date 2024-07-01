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

/**
 * Amount that was returned as a part of a PairAmount, a balance, or information on
 * incentives. Follows the same timestamping behaviour for USD value like PairAmount.
 * Contains information relevant to making contract and UI display decisions.
 */
export type Amount = {
  __typename?: 'Amount';
  /**
   * Decimals of the token that was traded. Available for simplicity, and for the backend's
   * interaction with the scaling of the number.
   */
  decimals: Scalars['Int']['output'];
  /** Timestamp that this Amount was made available at. */
  timestamp: Scalars['Int']['output'];
  /**
   * Token that was traded as a part of this amount. This could be the base asset (fUSDC) or
   * the quote asset (token1).
   */
  token: Token;
  /** Floating point representation of the number converted by it's decimals. */
  valueScaled: Scalars['String']['output'];
  /** Hex representation of the unscaled number as it was available on-chain. */
  valueUnscaled: Scalars['String']['output'];
  /** USD representation of the underlying number, converted by the last price checkpoint. */
  valueUsd: Scalars['String']['output'];
};

/** Get swaps for a specific pool, set up to be more granular for caching. */
export type GetSwaps = {
  __typename?: 'GetSwaps';
  data: SeawaterSwaps;
};

/** Get swaps for user return type, set up to allow better control of caching. */
export type GetSwapsForUser = {
  __typename?: 'GetSwapsForUser';
  data: SeawaterSwaps;
};

/**
 * Liquidity over time available in the pool, in the form of PairAmount, so it's possible to
 * know which side is how much. More expensive to compute so it's preferable to use
 * TvlOverTime if possible, where the USD calculation is done already.
 */
export type LiquidityOverTime = {
  __typename?: 'LiquidityOverTime';
  /** Daily liquidity in the pool, with data available as both sides. */
  daily: Array<PairAmount>;
  /** Monthly amounts of liquidity in the pool, as 12 data points. */
  monthly: Array<PairAmount>;
};

/**
 * Pair amount, with the USD value that's available within determined at the timestamp given.
 * The backend will make an effort seemingly at random to keep this consistent.
 *
 * If this is a PairAmount returned in the context of a historical query (values over time?),
 * then it'll return the timestamp of the time that this number was relevant (ie, if the
 * volume over time calculation has been done, then it'll return the volume in USD at the
 * time that the calculation for the day was done)).
 *
 * If this is a more current request, like the current USD value of a position, then the
 * backend will attempt to convert it based on the last price point available in the
 * checksumming in the database. So this could be useful to determine the current price data
 * of a position.
 */
export type PairAmount = {
  __typename?: 'PairAmount';
  /** Fusdc data available for the token at the time. */
  fusdc: Amount;
  /** Timestamp of the PairAmount's existence/creation. */
  timestamp: Scalars['Int']['output'];
  /** Token1 data (quote asset) that's available at that time. */
  token1: Amount;
};

/** Price over time in the pool, from the checkpointed data available. */
export type PriceOverTime = {
  __typename?: 'PriceOverTime';
  /** Daily price each day that was available. As 31 points of data, each representing a day. */
  daily: Array<Scalars['String']['output']>;
  /** Monthly price of data that's available, as 12 data points, each being a month. */
  monthly: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** fUSDC address that's supported by the AMM. */
  fusdc: Token;
  /**
   * Get a pool using the address of token1 that's in the pool.
   *
   * Follows the same caching behaviour as the pools endpoint.
   */
  getPool?: Maybe<SeawaterPool>;
  /** Get pool positions using the address of the pool involved. */
  getPoolPositions: SeawaterPositions;
  /** Get positions that're owned by any pool using it's ID, based on what's known to the database. */
  getPosition?: Maybe<SeawaterPosition>;
  /** Get positions that're owned by a specific wallet. */
  getPositions: SeawaterPositions;
  /**
   * Get swaps made using a pool. Safe to use to get up to date information on swaps going
   * through the UI.
   */
  getSwaps: GetSwaps;
  /** getSwapsForUser by the user across every pool we track. */
  getSwapsForUser: GetSwapsForUser;
  /**
   * Get wallet information based on information including balances. SHOULD NOT be used to get
   * information that's needed consistently. Use the frontend instead after getting addresess
   * elsewhere.
   */
  getWallet?: Maybe<Wallet>;
  /** Pools available in the AMM. */
  pools: Array<SeawaterPool>;
};


export type QueryGetPoolArgs = {
  token: Scalars['String']['input'];
};


export type QueryGetPoolPositionsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pool: Scalars['String']['input'];
};


export type QueryGetPositionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetPositionsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  wallet: Scalars['String']['input'];
};


export type QueryGetSwapsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  pool: Scalars['String']['input'];
};


export type QueryGetSwapsForUserArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  wallet: Scalars['String']['input'];
};


export type QueryGetWalletArgs = {
  address: Scalars['String']['input'];
};

/** SeawaterLiquidity available in a pool summed and grouped by ticks of 5000 at a time. */
export type SeawaterLiquidity = {
  __typename?: 'SeawaterLiquidity';
  /** Id internal to GraphQL for caching reasons. Made up of `liq:tick-from:tick-to`. */
  id: Scalars['ID']['output'];
  /** USD value of the liquidity in this range. Implemented as amount0 + (amount1 * price). */
  liquidity: Scalars['String']['output'];
  /** Median point price of token1's asset. */
  price: Scalars['String']['output'];
  /** Lower tick that this group and sum of positions is made up of. */
  tickLower: Scalars['Int']['output'];
  /** Upper tick that this group and sum of positions is made up of. */
  tickUpper: Scalars['Int']['output'];
};

/** Seawater pool available for swapping via the AMM. */
export type SeawaterPool = {
  __typename?: 'SeawaterPool';
  /** Address of the pool, and of the token that's traded. */
  address: Scalars['String']['output'];
  /** TODO */
  earnedFeesAPRFUSDC: Array<Scalars['String']['output']>;
  /** TODO */
  earnedFeesAPRToken1: Array<Scalars['String']['output']>;
  /** Id for quick caching, in the form of `pool:address`. */
  id: Scalars['ID']['output'];
  /**
   * Liquidity available in a pool, with only 20 elements being returned encompassing the
   * tick ranges subdivided.
   */
  liquidity: Array<SeawaterLiquidity>;
  /** Liquidity incentives currently available for this pool. In the form of what's available. */
  liquidityIncentives: Amount;
  /** The number of assets (the liquidity) that were kept in the pool, historically. */
  liquidityOverTime: LiquidityOverTime;
  /** Positions available in this pool. */
  positions: SeawaterPositions;
  /** Positions available in this pool, that were created by the wallet given. */
  positionsForUser: SeawaterPositions;
  /**
   * Information on the current price, last cached. Determined by the last tick of a trade
   * that was made.
   */
  price: Scalars['String']['output'];
  /** Historical price over time data that's available. */
  priceOverTime: PriceOverTime;
  /** Super incentives available in this pool. */
  superIncentives: Amount;
  /** Swaps that were made using this pool. */
  swaps: SeawaterSwaps;
  /** Tick spacing of the current pool, useful for graph rendering. */
  tickSpacing: Scalars['String']['output'];
  /** More token information about the counter asset that's available. */
  token: Token;
  /** The USD value of assets in the pool over time. Cheaper to access than liquidityOverTime. */
  tvlOverTime: TvlOverTime;
  /** Utility incentives available in this pool. */
  utilityIncentives: Array<UtilityIncentive>;
  /** The number of assets that were traded (the volume) over time in the pool, historically. */
  volumeOverTime: VolumeOverTime;
  /**
   * Yield paid by the pool over time. Yield is fees paid to the pool, as well as yield from
   * using Fluid Assets on the pool (Utility Mining and otherwise.)
   */
  yieldOverTime: YieldOverTime;
};


/** Seawater pool available for swapping via the AMM. */
export type SeawaterPoolPositionsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


/** Seawater pool available for swapping via the AMM. */
export type SeawaterPoolPositionsForUserArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  wallet: Scalars['String']['input'];
};


/** Seawater pool available for swapping via the AMM. */
export type SeawaterPoolSwapsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * SeawaterPosition owned by a user. It should be possible to derive the price of this
 * position by looking at the median of the lower, and upper tick.
 */
export type SeawaterPosition = {
  __typename?: 'SeawaterPosition';
  /** Creation timestamp of the position. */
  created: Scalars['Int']['output'];
  /** Id of the GraphQL object, for caching reasons. Made up of `positionId (pos:positionId)`. */
  id: Scalars['ID']['output'];
  /** Liquidity available in this specific position. */
  liquidity: PairAmount;
  /** Lower tick of this position. */
  lower: Scalars['Int']['output'];
  /** Owner of the position. A wallet address. */
  owner: Wallet;
  /** Pool that this position belongs to. */
  pool: SeawaterPool;
  /** Position Id in the contract of the user's position that they own. Used for a cursor. */
  positionId: Scalars['Int']['output'];
  /** Upper tick of this position. */
  upper: Scalars['Int']['output'];
};

/** Pagination-friendly way of viewing the current state of the positions available in a pool. */
export type SeawaterPositions = {
  __typename?: 'SeawaterPositions';
  next: SeawaterPositions;
  /** The positions associated with this data. */
  positions: Array<SeawaterPosition>;
  /**
   * The maximum returned by the underlying original query for this data if it's possible to
   * collect for fUSDC and the other token, done per unique token.
   */
  sum?: Maybe<Array<PairAmount>>;
};


/** Pagination-friendly way of viewing the current state of the positions available in a pool. */
export type SeawaterPositionsNextArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Swap that was made by a user. */
export type SeawaterSwap = {
  __typename?: 'SeawaterSwap';
  /** The asset and volume that was sent to be exchanged for the other asset. */
  amountIn: Amount;
  /** The asset and volume that was exchanged for by the other asset. */
  amountOut: Amount;
  /** Pool that was used to make the swap. */
  pool: SeawaterPool;
  /** Sender of the swap. */
  sender: Wallet;
  /** Timestamp of when this swap occured. */
  timestamp: Scalars['Int']['output'];
};

/**
 * Pagination-friendly way to quickly receive swaps made somewhere. Knows internally where it
 * came from, where it's at with pagination with the position ids.
 */
export type SeawaterSwaps = {
  __typename?: 'SeawaterSwaps';
  next: SeawaterSwaps;
  /** The sum of these value in these swaps per unique pool, if possible to collect. */
  sum?: Maybe<Array<PairAmount>>;
  /** The swaps that was returned in this page. */
  swaps: Array<SeawaterSwap>;
};


/**
 * Pagination-friendly way to quickly receive swaps made somewhere. Knows internally where it
 * came from, where it's at with pagination with the position ids.
 */
export type SeawaterSwapsNextArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

/** Token that's available to trade via the AMM. */
export type Token = {
  __typename?: 'Token';
  /** Address of the token. */
  address: Scalars['String']['output'];
  /** Decimals used by the token. */
  decimals: Scalars['Int']['output'];
  /** A simple ID in the form of the address of the token for GraphQL caching. */
  id: Scalars['ID']['output'];
  /** Image of the token that's stored on a URL somewhere. Loaded from the browser. */
  image: Scalars['String']['output'];
  /** Name of the token. */
  name: Scalars['String']['output'];
  /** Symbol of the token. */
  symbol: Scalars['String']['output'];
  /** Total supply of the token, in the form of base10. */
  totalSupply: Scalars['String']['output'];
};

/**
 * TVL over time available in the pool, in the form of just the USD amount, if the client is
 * so inclined to request this data.
 *
 * LiquidityOverTime is also possible to use, but it's more involved to calculate the USD
 * amount per token (by adding PairAmounts together). This is simpler, and faster.
 */
export type TvlOverTime = {
  __typename?: 'TvlOverTime';
  /**
   * A month's worth of TVL data in the form of a stringified floating point number (31
   * items.)
   */
  daily: Array<Scalars['String']['output']>;
  /**
   * Monthly data of the TVL, of the last 12 months, in the form of 12 items. Stringified
   * floating point representation of the amount.
   */
  monthly: Array<Scalars['String']['output']>;
};

/** Utility incentives given out by the Fluidity Labs team, or a partner via the DAO. */
export type UtilityIncentive = {
  __typename?: 'UtilityIncentive';
  /** Amount given out in the form of a floating point number. TODO. */
  amountGivenOut: Scalars['String']['output'];
  /** Maximum amount that was given out historically. TODO. */
  maximumAmount: Scalars['String']['output'];
};

/** Volume that was made in the pool over time, in a daily and monthly metric. */
export type VolumeOverTime = {
  __typename?: 'VolumeOverTime';
  /** Daily volume for a month. */
  daily: Array<PairAmount>;
  /** Monthly volume for the last 12 months. */
  monthly: Array<PairAmount>;
};

/** Wallet information as it's owned by a user. */
export type Wallet = {
  __typename?: 'Wallet';
  /** Address of this wallet. */
  address: Scalars['String']['output'];
  /**
   * Balances of tokens held by the user, based on information collected by the backend when
   * this is requested.
   */
  balances: Array<Amount>;
  /** Id for GraphQL caching. Simply the user's address. */
  id: Scalars['ID']['output'];
  /** Positions opened by the user in the AMM. */
  positions: SeawaterPositions;
};


/** Wallet information as it's owned by a user. */
export type WalletPositionsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Yield that was paid to users in the form of fees in the pool, and amounts that were paid
 * by the Fluidity worker.
 */
export type YieldOverTime = {
  __typename?: 'YieldOverTime';
  /** Daily yield paid out, as 31 action points to represent a month. */
  daily: Array<PairAmount>;
  /** Monthly yield paid, as 12 item points of data to represent a year. */
  monthly: Array<PairAmount>;
};

export type AllPoolsFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', name: string, decimals: number }, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, tvlOverTime: { __typename?: 'TvlOverTime', daily: Array<string> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, liquidityIncentives: { __typename?: 'Amount', valueUsd: string }, superIncentives: { __typename?: 'Amount', valueUsd: string }, positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', lower: number, upper: number }> } } & { ' $fragmentName'?: 'AllPoolsFragmentFragment' };

export type MyPositionsWalletFragmentFragment = { __typename?: 'Wallet', id: string, positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', positionId: number, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string } }, liquidity: { __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string }, token1: { __typename?: 'Amount', valueUsd: string } } }> } } & { ' $fragmentName'?: 'MyPositionsWalletFragmentFragment' };

export type SelectPrimeAssetFragmentFragment = { __typename?: 'SeawaterPool', address: string, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string } }> }, token: { __typename?: 'Token', name: string, symbol: string, address: string, decimals: number } } & { ' $fragmentName'?: 'SelectPrimeAssetFragmentFragment' };

export type ManagePoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, id: string, earnedFeesAPRFUSDC: Array<string>, token: { __typename?: 'Token', symbol: string, name: string, decimals: number }, liquidityIncentives: { __typename?: 'Amount', valueScaled: string }, superIncentives: { __typename?: 'Amount', valueScaled: string }, utilityIncentives: Array<{ __typename?: 'UtilityIncentive', amountGivenOut: string, maximumAmount: string }> } & { ' $fragmentName'?: 'ManagePoolFragmentFragment' };

export type PositionsFragmentFragment = { __typename?: 'Wallet', positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', positionId: number, lower: number, upper: number, pool: { __typename?: 'SeawaterPool', address: string }, liquidity: { __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string }, token1: { __typename?: 'Amount', valueUsd: string } } }> } } & { ' $fragmentName'?: 'PositionsFragmentFragment' };

export type WithdrawPositionsFragmentFragment = { __typename?: 'Wallet', positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', positionId: number, lower: number, upper: number, owner: { __typename?: 'Wallet', address: string }, liquidity: { __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string, valueScaled: string }, token1: { __typename?: 'Amount', valueUsd: string, valueScaled: string } } }> } } & { ' $fragmentName'?: 'WithdrawPositionsFragmentFragment' };

export type SwapExploreFragmentFragment = { __typename?: 'SeawaterPool', price: string, token: { __typename?: 'Token', name: string, symbol: string, address: string, decimals: number } } & { ' $fragmentName'?: 'SwapExploreFragmentFragment' };

export type MyPositionsInventoryWalletFragmentFragment = { __typename?: 'Wallet', id: string, positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', id: string, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string } } }> } } & { ' $fragmentName'?: 'MyPositionsInventoryWalletFragmentFragment' };

export type TradeTabTransactionsFragmentFragment = { __typename?: 'SeawaterSwap', timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } } & { ' $fragmentName'?: 'TradeTabTransactionsFragmentFragment' };

export type StakeFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, earnedFeesAPRFUSDC: Array<string> } & { ' $fragmentName'?: 'StakeFormFragmentFragment' };

export type DepositPositionsFragmentFragment = { __typename?: 'Wallet', positions: { __typename?: 'SeawaterPositions', positions: Array<{ __typename?: 'SeawaterPosition', positionId: number, lower: number, upper: number }> } } & { ' $fragmentName'?: 'DepositPositionsFragmentFragment' };

export type SwapFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, earnedFeesAPRFUSDC: Array<string>, earnedFeesAPRToken1: Array<string>, token: { __typename?: 'Token', address: string, decimals: number, name: string, symbol: string } } & { ' $fragmentName'?: 'SwapFormFragmentFragment' };

export type SwapProPoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', address: string, symbol: string }, liquidity: Array<{ __typename?: 'SeawaterLiquidity', liquidity: string }>, priceOverTime: { __typename?: 'PriceOverTime', daily: Array<string>, monthly: Array<string> }, volumeOverTime: { __typename?: 'VolumeOverTime', monthly: Array<{ __typename?: 'PairAmount', timestamp: number, token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }>, daily: Array<{ __typename?: 'PairAmount', timestamp: number, token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }>, monthly: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }> }, swaps: { __typename?: 'SeawaterSwaps', swaps: Array<{ __typename?: 'SeawaterSwap', timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } }> } } & { ' $fragmentName'?: 'SwapProPoolFragmentFragment' };

export type AllDataQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDataQuery = { __typename?: 'Query', pools: Array<(
    { __typename?: 'SeawaterPool', address: string }
    & { ' $fragmentRefs'?: { 'SwapProPoolFragmentFragment': SwapProPoolFragmentFragment;'AllPoolsFragmentFragment': AllPoolsFragmentFragment;'SelectPrimeAssetFragmentFragment': SelectPrimeAssetFragmentFragment;'SwapExploreFragmentFragment': SwapExploreFragmentFragment;'ManagePoolFragmentFragment': ManagePoolFragmentFragment;'SwapFormFragmentFragment': SwapFormFragmentFragment;'StakeFormFragmentFragment': StakeFormFragmentFragment } }
  )> };

export type ForUserQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type ForUserQuery = { __typename?: 'Query', getSwapsForUser: { __typename?: 'GetSwapsForUser', data: { __typename?: 'SeawaterSwaps', swaps: Array<(
        { __typename?: 'SeawaterSwap' }
        & { ' $fragmentRefs'?: { 'TradeTabTransactionsFragmentFragment': TradeTabTransactionsFragmentFragment } }
      )> } }, getWallet?: (
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'MyPositionsWalletFragmentFragment': MyPositionsWalletFragmentFragment;'MyPositionsInventoryWalletFragmentFragment': MyPositionsInventoryWalletFragmentFragment;'PositionsFragmentFragment': PositionsFragmentFragment;'WithdrawPositionsFragmentFragment': WithdrawPositionsFragmentFragment;'DepositPositionsFragmentFragment': DepositPositionsFragmentFragment } }
  ) | null };

export const AllPoolsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tvlOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}}]}}]} as unknown as DocumentNode<AllPoolsFragmentFragment, unknown>;
export const MyPositionsWalletFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPositionsWalletFragmentFragment, unknown>;
export const SelectPrimeAssetFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]} as unknown as DocumentNode<SelectPrimeAssetFragmentFragment, unknown>;
export const ManagePoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountGivenOut"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<ManagePoolFragmentFragment, unknown>;
export const PositionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PositionsFragmentFragment, unknown>;
export const WithdrawPositionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WithdrawPositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<WithdrawPositionsFragmentFragment, unknown>;
export const SwapExploreFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]} as unknown as DocumentNode<SwapExploreFragmentFragment, unknown>;
export const MyPositionsInventoryWalletFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPositionsInventoryWalletFragmentFragment, unknown>;
export const TradeTabTransactionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]} as unknown as DocumentNode<TradeTabTransactionsFragmentFragment, unknown>;
export const StakeFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<StakeFormFragmentFragment, unknown>;
export const DepositPositionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DepositPositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}}]}}]} as unknown as DocumentNode<DepositPositionsFragmentFragment, unknown>;
export const SwapFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<SwapFormFragmentFragment, unknown>;
export const SwapProPoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwapProPoolFragmentFragment, unknown>;
export const AllDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapProPoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllPoolsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectPrimeAssetFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapExploreFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManagePoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapFormFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StakeFormFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tvlOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"superIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"utilityIncentives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountGivenOut"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAmount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}}]}}]} as unknown as DocumentNode<AllDataQuery, AllDataQueryVariables>;
export const ForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSwapsForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TradeTabTransactionsFragment"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getWallet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyPositionsWalletFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PositionsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WithdrawPositionsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DepositPositionsFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WithdrawPositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DepositPositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}}]}}]} as unknown as DocumentNode<ForUserQuery, ForUserQueryVariables>;