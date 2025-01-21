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

export type Apr = {
  __typename?: 'APR';
  /** Scaled percentage APR available from rewards from campaign tokens, for campaigns that are currently active on this pool. */
  campaign: Scalars['String']['output'];
  /** Scaled percentage APR available from the fee this pool takes, containing the amount of fUSDC, pool token, and sum of both that is available. */
  fee: AprFee;
  /** Scaled percentage representing the total APR of this pool, summing the pool fees of fUSDC and the pool token, and the campaign rewards for all active campaigns on the pool. */
  total: Scalars['String']['output'];
};

export type AprFee = {
  __typename?: 'APRFee';
  fusdc: Scalars['String']['output'];
  token: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type Achievement = {
  __typename?: 'Achievement';
  /** Number of the achievement that was won. May be a unscaled number. */
  count: Scalars['Int']['output'];
  /** The descirption of this achievement. */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /**
   * Is the count financial? This could dissuade the UI from displaying this item if so. Or,
   * enabling some scaling functionality.
   */
  isCountFinancial: Scalars['Boolean']['output'];
  /** Name of the achievement earned. */
  name?: Maybe<Scalars['String']['output']>;
  /** Product that this achievement was for. */
  product: Scalars['String']['output'];
  /** The amount of scoring for this achievement. NOTE THAT THESE ARE NOT POINTS! */
  scoring: Scalars['Float']['output'];
  /** The season that this achievement is for. */
  season: Scalars['Int']['output'];
  /**
   * Whether this achievement counts the amount of interactions with it, or its a one time
   * interaction. It might be better to not display the count of in a "this is how many
   * people have this" context if it's the former.
   */
  shouldCountMatter: Scalars['Boolean']['output'];
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

export type Leaderboard = {
  __typename?: 'Leaderboard';
  id: Scalars['ID']['output'];
  /** The amount of items in this leaderboard. */
  items: Array<LeaderboardItem>;
  /** The product this leaderboard is for. Could be 9lives or longtail. */
  product: Scalars['String']['output'];
};

export type LeaderboardItem = {
  __typename?: 'LeaderboardItem';
  id: Scalars['ID']['output'];
  /** The ranking of the wallet. Ie, 1 for first place (the top). */
  ranking: Scalars['Int']['output'];
  /** The scoring of the wallet for their cumulative count achievement value. */
  scoring: Scalars['Int']['output'];
  /** The wallet that sits in the leaderboard this way. */
  wallet: Scalars['String']['output'];
};

/** Liquidity campaigns available in this pool that's distributed on-chain. */
export type LiquidityCampaign = {
  __typename?: 'LiquidityCampaign';
  /** Campaign ID to identify the campaign with a contract call. */
  campaignId: Scalars['String']['output'];
  /** Timestamp that ends this liquidity mining campaign. */
  endTimestamp: Scalars['Int']['output'];
  /** Timestamp that begins this liquidity mining campaign. */
  fromTimestamp: Scalars['Int']['output'];
  /**
   * Maximum amount of the token that can be distributed over all time. The token that's sent
   * is contained within.
   */
  maximumAmount: Amount;
  /** Owner of the incentive campaign, they can pause, cancel, and update the campaigns. */
  owner: SeawaterPositionsUser;
  /** Amount of token that's released per second. */
  perSecond: Amount;
  /** Pool that these rewards are enabled for. */
  pool: SeawaterPool;
  /** Lower tick that this position incentivises. */
  tickLower: Scalars['Int']['output'];
  /** Upper tick that this position incentivises. */
  tickUpper: Scalars['Int']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  /** Add achievement for an address or Discord handle given. */
  addAchievement: Scalars['Boolean']['output'];
  /**
   * Authenticate with the info service using the key given. Secret string that should be set
   * with Authorization.
   */
  auth?: Maybe<Scalars['String']['output']>;
  /**
   * Calculate points based on the data lake available. Does so using a function with an
   * advisory lock. Can only be used by an authenticated user sending a Authentication token.
   */
  calculatePoints: Scalars['Boolean']['output'];
  /**
   * Register a Discord username with an address given. Does verification
   * to see if a trusted user is making this association.
   */
  registerDiscord: Scalars['Boolean']['output'];
};


export type MutationAddAchievementArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  discordUsername?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationAuthArgs = {
  key: Scalars['String']['input'];
};


export type MutationCalculatePointsArgs = {
  yes: Scalars['Boolean']['input'];
};


export type MutationRegisterDiscordArgs = {
  address: Scalars['String']['input'];
  snowflake: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

/** Presentation info about the webapp/anything else. */
export type Note = {
  __typename?: 'Note';
  /** HTML content ready to be injected and displayed to the end user. */
  content: Scalars['String']['output'];
  /**
   * Placement info that might be relevant on the platform it's intended
   * to be displayed on. Could be "top", "bottom-right" for Longtail.
   */
  placement: Scalars['String']['output'];
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

export type Points = {
  __typename?: 'Points';
  /** Amount of points that're given to this user so far. */
  amount: Scalars['Int']['output'];
  /** ID of the points of the form "address" */
  id: Scalars['ID']['output'];
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
  /**
   * Get achievements for the address given, or the category.
   * If the product is requested, then the count will be 0.
   */
  achievements: Array<Achievement>;
  /** Campaigns actively running with Leo on Longtail pools. */
  activeLiquidityCampaigns: Array<LiquidityCampaign>;
  /** fUSDC address that's supported by the AMM. */
  fusdc: Token;
  /** Get a user's address using their wallet address. */
  getAddressByDiscord?: Maybe<Scalars['String']['output']>;
  /**
   * Return the address associated with a Discord handle.
   * Authenticated user only.
   */
  getDiscordName?: Maybe<Scalars['String']['output']>;
  /**
   * Returns html string with embded points data for the wallet.
   * This is a common points component to be used in every products.
   */
  getPointsComponent?: Maybe<Scalars['String']['output']>;
  /**
   * Get a pool using the address of token1 that's in the pool.
   *
   * Follows the same caching behaviour as the pools endpoint.
   */
  getPool?: Maybe<SeawaterPool>;
  /** Get pool positions using the address of the pool involved. */
  getPoolPositions: SeawaterPositionsGlobal;
  /** Get positions that're owned by any pool using it's ID, based on what's known to the database. */
  getPosition?: Maybe<SeawaterPosition>;
  /** Get positions that're owned by a specific wallet. */
  getPositions: SeawaterPositionsUser;
  /** Get a Thirdweb smart account with the owner address given. */
  getSmartAccount: Array<Wallet>;
  /**
   * Get swaps made using a pool. Safe to use to get up to date information on swaps going
   * through the UI.
   */
  getSwaps: GetSwaps;
  /** Get swaps for a user across every pool we track. */
  getSwapsForUser: GetSwapsForUser;
  /**
   * Get wallet information based on information including balances. SHOULD NOT be used to get
   * information that's needed consistently. Use the frontend instead after getting addresess
   * elsewhere.
   */
  getWallet?: Maybe<Wallet>;
  /** Gets a sorted ranking of the address * achievement count for a specific product. */
  leaderboards: Array<Leaderboard>;
  /** Get either global or user-specific presentation issue in anything SPN. */
  notes: Array<Note>;
  /** Get points for the address given. */
  points: Points;
  /** Pools available in the AMM. */
  pools: Array<SeawaterPool>;
  /** Number of users who used this product. */
  productUserCount: Scalars['Int']['output'];
  /** Metadata of the current request. */
  served: Served;
  /** Campaigns slated to begin with Leo with Longtail pools in the future. */
  upcomingLiquidityCampaigns: Array<LiquidityCampaign>;
};


export type QueryAchievementsArgs = {
  wallet?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAddressByDiscordArgs = {
  addr: Scalars['String']['input'];
};


export type QueryGetDiscordNameArgs = {
  handle: Scalars['String']['input'];
};


export type QueryGetPointsComponentArgs = {
  wallet?: InputMaybe<Scalars['String']['input']>;
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


export type QueryGetSmartAccountArgs = {
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


export type QueryLeaderboardsArgs = {
  product: Scalars['String']['input'];
  season?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotesArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryPointsArgs = {
  wallet: Scalars['String']['input'];
};


export type QueryProductUserCountArgs = {
  product: Scalars['String']['input'];
};

/** SeawaterConfig available to the pool. */
export type SeawaterConfig = {
  __typename?: 'SeawaterConfig';
  /**
   * Classification of the type of pool. Non-volatile assets like stablecoins (`STABLECOIN`)
   * should have a range of -10%-10% suggested to the user for the pool, volatile assets
   * (`VOLATILE`) should have a suggestion based on the historical trading data in the
   * backend, with the lowest price in the last 7 days, and the highest price, and an extra
   * 5%. Unclear assets (`UNKNOWN`) should avoid these recommendations altogether, and only
   * allow the user to submit their price ranges without intervention.
   */
  classification: SeawaterPoolClassification;
  /** Whether this pool should be displayed to frontend users. */
  displayed: Scalars['Boolean']['output'];
  /** Identifier of this config. Should be config:<pool address> */
  id: Scalars['ID']['output'];
  /** Pool this configuration belongs to. */
  pool: SeawaterPool;
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
  /** APR for this pool, containing scaled percentage values for campaign rewards and pool fees. */
  APR: Apr;
  /** Address of the pool, and of the token that's traded. */
  address: Scalars['String']['output'];
  /** Amounts currently contained in this pool. */
  amounts: PairAmount;
  /**
   * Configuration details available to this pool. Should be mostly static. This is displayed
   * to the frontend. Can be used to hint how the display of the tick selection should work.
   */
  config: SeawaterConfig;
  /** TODO */
  earnedFeesAPRFUSDC: Array<Scalars['String']['output']>;
  /** TODO */
  earnedFeesAPRToken1: Array<Scalars['String']['output']>;
  /** Pool fee, that taken every trade. */
  fee: Scalars['Int']['output'];
  /** Id for quick caching, in the form of `pool:address`. */
  id: Scalars['ID']['output'];
  /**
   * Liquidity available in a pool, with only 20 elements being returned encompassing the
   * tick ranges subdivided.
   */
  liquidity: Array<SeawaterLiquidity>;
  /** Liquidity campaigns currently available for this pool. */
  liquidityCampaigns: Array<LiquidityCampaign>;
  /** The number of assets (the liquidity) that were kept in the pool, historically. */
  liquidityOverTime: LiquidityOverTime;
  /** Positions available in this pool. Cached aggressively. */
  positions: SeawaterPositionsGlobal;
  /** Positions available in this pool, that were created by the wallet given. Not so cached. */
  positionsForUser: SeawaterPositionsUser;
  /**
   * Information on the current price, last cached. Determined by the last tick of a trade
   * that was made.
   */
  price: Scalars['String']['output'];
  /** Historical price over time data that's available. */
  priceOverTime: PriceOverTime;
  /** Metadata of the current request. */
  served: Served;
  /**
   * Swaps that were made using this pool.
   * If filter is set, only swaps between the pool token and the filter token will be returned.
   * If filter isn't set, only swaps between the pool token and fUSDC will be returned.
   */
  swaps: SeawaterSwaps;
  /** Tick spacing of the current pool, useful for graph rendering. */
  tickSpacing: Scalars['String']['output'];
  /** More token information about the counter asset that's available. */
  token: Token;
  /**
   * Total all time fees collected by this pool,
   * scaled by price as a USD amount.
   */
  total_fee: TotalFee;
  /** The USD value of assets in the pool over time. Cheaper to access than liquidityOverTime. */
  tvlOverTime: TvlOverTime;
  /** Volume for this pool, containing the volume of each token for the whole lifetime of the pool. */
  volume: PairAmount;
  /** The number of assets that were traded (the volume) over time in the pool, historically. */
  volumeOverTime: VolumeOverTime;
  /** Yield paid by the pool over time. Yield is fees paid to the pool via fees taken. */
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
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export enum SeawaterPoolClassification {
  Stablecoin = 'STABLECOIN',
  Unknown = 'UNKNOWN',
  Volatile = 'VOLATILE'
}

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
  /** True if this position is currently vested in Leo, false otherwise. */
  isVested: Scalars['Boolean']['output'];
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
  /** Metadata of the current request. */
  served: Served;
  /** Upper tick of this position. */
  upper: Scalars['Int']['output'];
};

/**
 * Pagination-friendly way of viewing the current state of the positions available in a pool.
 * Cached aggressively.
 */
export type SeawaterPositionsGlobal = {
  __typename?: 'SeawaterPositionsGlobal';
  /** ID available for this for caching reasons. Should be posglobal:from:to. */
  id: Scalars['ID']['output'];
  next: SeawaterPositionsGlobal;
  /** The positions associated with this data. */
  positions: Array<SeawaterPosition>;
  /**
   * The maximum returned by the underlying original query for this data if it's possible to
   * collect for fUSDC and the other token, done per unique token.
   */
  sum?: Maybe<Array<PairAmount>>;
};


/**
 * Pagination-friendly way of viewing the current state of the positions available in a pool.
 * Cached aggressively.
 */
export type SeawaterPositionsGlobalNextArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Pagination-friendly way of viewing the current state of the positions available in a pool.
 * Not cached so aggressively!
 */
export type SeawaterPositionsUser = {
  __typename?: 'SeawaterPositionsUser';
  /** ID available for this for caching reasons. Should be posuser:from:to. */
  id: Scalars['ID']['output'];
  next: SeawaterPositionsUser;
  /** The positions associated with this data. */
  positions: Array<SeawaterPosition>;
  /**
   * The maximum returned by the underlying original query for this data if it's possible to
   * collect for fUSDC and the other token, done per unique token.
   */
  sum?: Maybe<Array<PairAmount>>;
};


/**
 * Pagination-friendly way of viewing the current state of the positions available in a pool.
 * Not cached so aggressively!
 */
export type SeawaterPositionsUserNextArgs = {
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
  /** Metadata of the current request. */
  served: Served;
  /** Timestamp of when this swap occured. */
  timestamp: Scalars['Int']['output'];
  /** Transaction hash swap is operated on. */
  transactionHash: Scalars['String']['output'];
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

export type Served = {
  __typename?: 'Served';
  /** Timestamp of the creation of the served request. */
  timestamp: Scalars['Int']['output'];
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

export type TotalFee = {
  __typename?: 'TotalFee';
  /** USD scaled value of token0 that has been collected as fees. */
  amount0: Scalars['String']['output'];
  /** USD scaled value of token1 (fUSDC) that has been collected as fees. */
  amount1: Scalars['String']['output'];
  /** USD scaled value of both tokens that have been collected as fees. */
  total: Scalars['String']['output'];
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
  positions: SeawaterPositionsUser;
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

export type AllPoolsFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', name: string, decimals: number, symbol: string, image: string }, volume: { __typename?: 'PairAmount', token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }, amounts: { __typename?: 'PairAmount', token1: { __typename?: 'Amount', valueUsd: string }, fusdc: { __typename?: 'Amount', valueUsd: string } }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueScaled: string } }> }, APR: { __typename?: 'APR', total: string }, positions: { __typename?: 'SeawaterPositionsGlobal', positions: Array<{ __typename?: 'SeawaterPosition', lower: number, upper: number }> }, total_fee: { __typename?: 'TotalFee', total: string } } & { ' $fragmentName'?: 'AllPoolsFragmentFragment' };

export type SelectPrimeAssetFragmentFragment = { __typename?: 'SeawaterPool', address: string, volumeOverTime: { __typename?: 'VolumeOverTime', daily: Array<{ __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string } }> }, token: { __typename?: 'Token', name: string, symbol: string, address: string, decimals: number } } & { ' $fragmentName'?: 'SelectPrimeAssetFragmentFragment' };

export type ManagePoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, id: string, earnedFeesAPRFUSDC: Array<string>, liquidity: Array<{ __typename?: 'SeawaterLiquidity', liquidity: string }>, token: { __typename?: 'Token', symbol: string, name: string, decimals: number }, liquidityCampaigns: Array<{ __typename?: 'LiquidityCampaign', campaignId: string, tickLower: number, tickUpper: number, fromTimestamp: number, endTimestamp: number }> } & { ' $fragmentName'?: 'ManagePoolFragmentFragment' };

export type SwapExploreFragmentFragment = { __typename?: 'SeawaterPool', price: string, token: { __typename?: 'Token', name: string, symbol: string, address: string, decimals: number } } & { ' $fragmentName'?: 'SwapExploreFragmentFragment' };

export type NotesFragmentFragment = { __typename?: 'Note', content: string, placement: string } & { ' $fragmentName'?: 'NotesFragmentFragment' };

export type ConfirmStakeFragmentFragment = { __typename?: 'SeawaterPool', APR: { __typename?: 'APR', total: string } } & { ' $fragmentName'?: 'ConfirmStakeFragmentFragment' };

export type MyPositionsInventoryWalletFragmentFragment = { __typename?: 'Wallet', id: string, positions: { __typename?: 'SeawaterPositionsUser', positions: Array<{ __typename?: 'SeawaterPosition', id: string, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string } } }> } } & { ' $fragmentName'?: 'MyPositionsInventoryWalletFragmentFragment' };

export type TradeTabTransactionsFragmentFragment = { __typename?: 'SeawaterSwap', timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } } & { ' $fragmentName'?: 'TradeTabTransactionsFragmentFragment' };

export type StakeFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, earnedFeesAPRFUSDC: Array<string>, fee: number, config: { __typename?: 'SeawaterConfig', classification: SeawaterPoolClassification }, priceOverTime: { __typename?: 'PriceOverTime', daily: Array<string> }, liquidity: Array<{ __typename?: 'SeawaterLiquidity', tickLower: number, tickUpper: number, price: string, liquidity: string }> } & { ' $fragmentName'?: 'StakeFormFragmentFragment' };

export type StakeFormPoolFragmentFragment = { __typename?: 'SeawaterPool', token: { __typename?: 'Token', decimals: number, address: string, name: string, symbol: string } } & { ' $fragmentName'?: 'StakeFormPoolFragmentFragment' };

export type SwapFormFragmentFragment = { __typename?: 'SeawaterPool', address: string, fee: number, earnedFeesAPRFUSDC: Array<string>, earnedFeesAPRToken1: Array<string>, token: { __typename?: 'Token', address: string, decimals: number, name: string, symbol: string } } & { ' $fragmentName'?: 'SwapFormFragmentFragment' };

export type SwapProPoolFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', address: string, symbol: string }, liquidity: Array<{ __typename?: 'SeawaterLiquidity', liquidity: string }>, priceOverTime: { __typename?: 'PriceOverTime', daily: Array<string>, monthly: Array<string> }, volumeOverTime: { __typename?: 'VolumeOverTime', monthly: Array<{ __typename?: 'PairAmount', token1: { __typename?: 'Amount', timestamp: number, valueUsd: string }, fusdc: { __typename?: 'Amount', timestamp: number, valueUsd: string } }>, daily: Array<{ __typename?: 'PairAmount', token1: { __typename?: 'Amount', timestamp: number, valueUsd: string }, fusdc: { __typename?: 'Amount', timestamp: number, valueUsd: string } }> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }>, monthly: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }> }, APR: { __typename?: 'APR', total: string }, swaps: { __typename?: 'SeawaterSwaps', swaps: Array<{ __typename?: 'SeawaterSwap', transactionHash: string, timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string } } }> } } & { ' $fragmentName'?: 'SwapProPoolFragmentFragment' };

export type SwapProPoolFilteredFragmentFragment = { __typename?: 'SeawaterPool', address: string, token: { __typename?: 'Token', address: string, symbol: string }, liquidity: Array<{ __typename?: 'SeawaterLiquidity', liquidity: string }>, priceOverTime: { __typename?: 'PriceOverTime', daily: Array<string>, monthly: Array<string> }, volumeOverTime: { __typename?: 'VolumeOverTime', monthly: Array<{ __typename?: 'PairAmount', token1: { __typename?: 'Amount', timestamp: number, valueUsd: string }, fusdc: { __typename?: 'Amount', timestamp: number, valueUsd: string } }>, daily: Array<{ __typename?: 'PairAmount', token1: { __typename?: 'Amount', timestamp: number, valueUsd: string }, fusdc: { __typename?: 'Amount', timestamp: number, valueUsd: string } }> }, liquidityOverTime: { __typename?: 'LiquidityOverTime', daily: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }>, monthly: Array<{ __typename?: 'PairAmount', timestamp: number, fusdc: { __typename?: 'Amount', valueUsd: string } }> }, APR: { __typename?: 'APR', total: string }, swaps: { __typename?: 'SeawaterSwaps', swaps: Array<{ __typename?: 'SeawaterSwap', transactionHash: string, timestamp: number, amountIn: { __typename?: 'Amount', valueScaled: string, valueUsd: string, token: { __typename?: 'Token', symbol: string, image: string } }, amountOut: { __typename?: 'Amount', valueScaled: string, token: { __typename?: 'Token', symbol: string, image: string } } }> } } & { ' $fragmentName'?: 'SwapProPoolFilteredFragmentFragment' };

export type TokensFragmentFragment = { __typename?: 'SeawaterPool', token: { __typename?: 'Token', address: string, decimals: number, name: string, symbol: string, image: string } } & { ' $fragmentName'?: 'TokensFragmentFragment' };

export type FusdcFragmentFragment = { __typename?: 'Token', address: string, decimals: number, name: string, symbol: string, image: string } & { ' $fragmentName'?: 'FusdcFragmentFragment' };

export type AllDataQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDataQuery = { __typename?: 'Query', fusdc: (
    { __typename?: 'Token', address: string }
    & { ' $fragmentRefs'?: { 'FusdcFragmentFragment': FusdcFragmentFragment } }
  ), pools: Array<(
    { __typename?: 'SeawaterPool', address: string }
    & { ' $fragmentRefs'?: { 'SwapProPoolFragmentFragment': SwapProPoolFragmentFragment;'AllPoolsFragmentFragment': AllPoolsFragmentFragment;'SelectPrimeAssetFragmentFragment': SelectPrimeAssetFragmentFragment;'SwapExploreFragmentFragment': SwapExploreFragmentFragment;'ManagePoolFragmentFragment': ManagePoolFragmentFragment;'SwapFormFragmentFragment': SwapFormFragmentFragment;'StakeFormFragmentFragment': StakeFormFragmentFragment;'TokensFragmentFragment': TokensFragmentFragment;'ConfirmStakeFragmentFragment': ConfirmStakeFragmentFragment } }
  )> };

export type ForUserQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type ForUserQuery = { __typename?: 'Query', getSwapsForUser: { __typename?: 'GetSwapsForUser', data: { __typename?: 'SeawaterSwaps', swaps: Array<(
        { __typename?: 'SeawaterSwap' }
        & { ' $fragmentRefs'?: { 'TradeTabTransactionsFragmentFragment': TradeTabTransactionsFragmentFragment } }
      )> } }, getWallet?: (
    { __typename?: 'Wallet' }
    & { ' $fragmentRefs'?: { 'MyPositionsInventoryWalletFragmentFragment': MyPositionsInventoryWalletFragmentFragment;'PositionsFragmentFragment': PositionsFragmentFragment } }
  ) | null, notes: Array<(
    { __typename?: 'Note' }
    & { ' $fragmentRefs'?: { 'NotesFragmentFragment': NotesFragmentFragment } }
  )> };

export type QueryGetPointsQueryVariables = Exact<{
  wallet: Scalars['String']['input'];
}>;


export type QueryGetPointsQuery = { __typename?: 'Query', getPointsComponent?: string | null };

export type QueryGetPoolQueryVariables = Exact<{
  token: Scalars['String']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type QueryGetPoolQuery = { __typename?: 'Query', getPool?: (
    { __typename?: 'SeawaterPool' }
    & { ' $fragmentRefs'?: { 'StakeFormPoolFragmentFragment': StakeFormPoolFragmentFragment;'ManagePoolFragmentFragment': ManagePoolFragmentFragment;'SwapProPoolFilteredFragmentFragment': SwapProPoolFilteredFragmentFragment } }
  ) | null };

export type PositionsFragmentFragment = { __typename?: 'Wallet', id: string, positions: { __typename?: 'SeawaterPositionsUser', positions: Array<{ __typename?: 'SeawaterPosition', created: number, positionId: number, lower: number, upper: number, isVested: boolean, served: { __typename?: 'Served', timestamp: number }, pool: { __typename?: 'SeawaterPool', token: { __typename?: 'Token', name: string, address: string, symbol: string, decimals: number }, liquidityCampaigns: Array<{ __typename?: 'LiquidityCampaign', campaignId: string, tickLower: number, tickUpper: number, fromTimestamp: number, endTimestamp: number }> }, liquidity: { __typename?: 'PairAmount', fusdc: { __typename?: 'Amount', valueUsd: string }, token1: { __typename?: 'Amount', valueUsd: string } } }> } } & { ' $fragmentName'?: 'PositionsFragmentFragment' };

export const AllPoolsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volume"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total_fee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AllPoolsFragmentFragment, unknown>;
export const SelectPrimeAssetFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]} as unknown as DocumentNode<SelectPrimeAssetFragmentFragment, unknown>;
export const ManagePoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"fromTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}}]} as unknown as DocumentNode<ManagePoolFragmentFragment, unknown>;
export const SwapExploreFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]} as unknown as DocumentNode<SwapExploreFragmentFragment, unknown>;
export const NotesFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}}]}}]} as unknown as DocumentNode<NotesFragmentFragment, unknown>;
export const ConfirmStakeFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfirmStakeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<ConfirmStakeFragmentFragment, unknown>;
export const MyPositionsInventoryWalletFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPositionsInventoryWalletFragmentFragment, unknown>;
export const TradeTabTransactionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]} as unknown as DocumentNode<TradeTabTransactionsFragmentFragment, unknown>;
export const StakeFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}}]}}]} as unknown as DocumentNode<StakeFormFragmentFragment, unknown>;
export const StakeFormPoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<StakeFormPoolFragmentFragment, unknown>;
export const SwapFormFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<SwapFormFragmentFragment, unknown>;
export const SwapProPoolFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwapProPoolFragmentFragment, unknown>;
export const SwapProPoolFilteredFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFilteredFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SwapProPoolFilteredFragmentFragment, unknown>;
export const TokensFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TokensFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]} as unknown as DocumentNode<TokensFragmentFragment, unknown>;
export const FusdcFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FusdcFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]} as unknown as DocumentNode<FusdcFragmentFragment, unknown>;
export const PositionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"served"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"fromTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVested"}}]}}]}}]}}]} as unknown as DocumentNode<PositionsFragmentFragment, unknown>;
export const AllDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FusdcFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapProPoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllPoolsFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SelectPrimeAssetFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapExploreFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManagePoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapFormFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"StakeFormFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TokensFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfirmStakeFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FusdcFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Token"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPoolsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volume"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total_fee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SelectPrimeAssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapExploreFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"fromTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRToken1"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TokensFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfirmStakeFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AllDataQuery, AllDataQueryVariables>;
export const ForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSwapsForUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TradeTabTransactionsFragment"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getWallet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PositionsFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotesFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TradeTabTransactionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterSwap"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyPositionsInventoryWalletFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PositionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Wallet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"served"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positionId"}},{"kind":"Field","name":{"kind":"Name","value":"pool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"fromTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lower"}},{"kind":"Field","name":{"kind":"Name","value":"upper"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isVested"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotesFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Note"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"placement"}}]}}]} as unknown as DocumentNode<ForUserQuery, ForUserQueryVariables>;
export const QueryGetPointsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queryGetPoints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPointsComponent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wallet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wallet"}}}]}]}}]} as unknown as DocumentNode<QueryGetPointsQuery, QueryGetPointsQueryVariables>;
export const QueryGetPoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queryGetPool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StakeFormPoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManagePoolFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SwapProPoolFilteredFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StakeFormPoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManagePoolFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"earnedFeesAPRFUSDC"}},{"kind":"Field","name":{"kind":"Name","value":"liquidityCampaigns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"campaignId"}},{"kind":"Field","name":{"kind":"Name","value":"tickLower"}},{"kind":"Field","name":{"kind":"Name","value":"tickUpper"}},{"kind":"Field","name":{"kind":"Name","value":"fromTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SwapProPoolFilteredFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SeawaterPool"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"liquidity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"}},{"kind":"Field","name":{"kind":"Name","value":"monthly"}}]}},{"kind":"Field","name":{"kind":"Name","value":"volumeOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"liquidityOverTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"fusdc"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"APR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"swaps"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swaps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionHash"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"amountIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"valueUsd"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"valueScaled"}},{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<QueryGetPoolQuery, QueryGetPoolQueryVariables>;