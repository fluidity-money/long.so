// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"github.com/fluidity-money/long.so/lib/types/seawater"
)

// Get swaps for a specific pool, set up to be more granular for caching.
type GetSwaps struct {
	Data SeawaterSwaps `json:"data"`
}

// Get swaps for user return type, set up to allow better control of caching.
type GetSwapsForUser struct {
	Data SeawaterSwaps `json:"data"`
}

// Liquidity incentives available in this pool that's distributed partly on-chain with
// snapshotting done off-chain.
type LiquidityIncentives struct {
	// Pool that these rewards are enabled for.
	Pool seawater.Pool `json:"pool"`
	// Maximum supply to be distributed of the rewards.
	Supply PairAmount `json:"supply"`
	// Distribution amount released per day.
	Distribution PairAmount `json:"distribution"`
	// Suggested APY based on the LP tokens locked in the pool, combined
	// with the emissions schedule.
	SuggestedApy string `json:"suggestedApy"`
}

// Liquidity over time available in the pool, in the form of PairAmount, so it's possible to
// know which side is how much. More expensive to compute so it's preferable to use
// TvlOverTime if possible, where the USD calculation is done already.
type LiquidityOverTime struct {
	// Daily liquidity in the pool, with data available as both sides.
	Daily []PairAmount `json:"daily"`
	// Monthly amounts of liquidity in the pool, as 12 data points.
	Monthly []PairAmount `json:"monthly"`
}

// Pair amount, with the USD value that's available within determined at the timestamp given.
// The backend will make an effort seemingly at random to keep this consistent.
//
// If this is a PairAmount returned in the context of a historical query (values over time?),
// then it'll return the timestamp of the time that this number was relevant (ie, if the
// volume over time calculation has been done, then it'll return the volume in USD at the
// time that the calculation for the day was done)).
//
// If this is a more current request, like the current USD value of a position, then the
// backend will attempt to convert it based on the last price point available in the
// checksumming in the database. So this could be useful to determine the current price data
// of a position.
type PairAmount struct {
	// Timestamp of the PairAmount's existence/creation.
	Timestamp int `json:"timestamp"`
	// Fusdc data available for the token at the time.
	Fusdc Amount `json:"fusdc"`
	// Token1 data (quote asset) that's available at that time.
	Token1 Amount `json:"token1"`
}

// Price over time in the pool, from the checkpointed data available.
type PriceOverTime struct {
	// Daily price each day that was available. As 31 points of data, each representing a day.
	Daily []string `json:"daily"`
	// Monthly price of data that's available, as 12 data points, each being a month.
	Monthly []string `json:"monthly"`
}

type Query struct {
}

type Served struct {
	// Timestamp of the creation of the served request.
	Timestamp int `json:"timestamp"`
}

// Super (utility) incentives powered by Fluidity. Historical endpoint for knowing
// what was rewarded.
type SuperIncentives struct {
	Amount PairAmount `json:"amount"`
}

// TVL over time available in the pool, in the form of just the USD amount, if the client is
// so inclined to request this data.
//
// LiquidityOverTime is also possible to use, but it's more involved to calculate the USD
// amount per token (by adding PairAmounts together). This is simpler, and faster.
type TvlOverTime struct {
	// A month's worth of TVL data in the form of a stringified floating point number (31
	// items.)
	Daily []string `json:"daily"`
	// Monthly data of the TVL, of the last 12 months, in the form of 12 items. Stringified
	// floating point representation of the amount.
	Monthly []string `json:"monthly"`
}

// Utility incentives given out by the Fluidity Labs team, or a partner via the DAO.
type UtilityIncentive struct {
	// Amount given out in the form of a floating point number. TODO.
	AmountGivenOut string `json:"amountGivenOut"`
	// Maximum amount that was given out historically. TODO.
	MaximumAmount string `json:"maximumAmount"`
}

// Volume that was made in the pool over time, in a daily and monthly metric.
type VolumeOverTime struct {
	// Daily volume for a month.
	Daily []PairAmount `json:"daily"`
	// Monthly volume for the last 12 months.
	Monthly []PairAmount `json:"monthly"`
}

// Yield that was paid to users in the form of fees in the pool, and amounts that were paid
// by the Fluidity worker.
type YieldOverTime struct {
	// Daily yield paid out, as 31 action points to represent a month.
	Daily []PairAmount `json:"daily"`
	// Monthly yield paid, as 12 item points of data to represent a year.
	Monthly []PairAmount `json:"monthly"`
}
