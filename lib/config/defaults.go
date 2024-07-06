package config

import "github.com/fluidity-money/long.so/lib/types"

const (
	// DefaultFusdcDecimals to use as the default for the base asset
	DefaultFusdcDecimals = 6

	// DefaultFusdcSymbol to send to users (from Superposition Testnet)
	DefaultFusdcSymbol = "fUSDC"

	// DefaultFusdcName to use (from Superposition Testnet)
	DefaultFusdcName = "Fluid USDC"
)

// DefaultFusdcTotalSupply from Superposition Testnet
var DefaultFusdcTotalSupply = mustUnscaled("999999999999999999900750000")

func mustUnscaled(s string) types.UnscaledNumber {
	x, err := types.UnscaledNumberFromBase10(s)
	if err != nil {
		panic(err)
	}
	return *x
}
