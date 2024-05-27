package model

import (
	"fmt"
	"math"

	"github.com/fluidity-money/long.so/lib/types"
)

type PriceResult struct {
	FinalTick types.Number  `json:"final_tick"`
}

// Price to obtain the price from the final tick as a formatted float string
func (p PriceResult) Price(fusdcDecimals, poolDecimals int) string {
	// p(i)) = 1.0001^i * 10**(fUSDC decimals - pool decimals)
	tick, _ := p.FinalTick.Float64()
	base := float64(10001) / 10000
	decimals := math.Pow10(fusdcDecimals - poolDecimals)
	price := math.Pow(base, tick) * decimals
	return fmt.Sprintf("%0.4f", price)
}
