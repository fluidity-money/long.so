// Tests the concentrated liquidity math that we use for position
// scanning. For testing, it converts the underlying rat to a string and
// truncates the decimals (and rounds it up).

package math

import (
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

func encodePriceSqrt(l, r int) *big.Int {
	//sqrtPriceX96 = sqrt(price) * 2 ** 96
	x := new(big.Float).SetInt64(int64(l))
	x.Quo(x, new(big.Float).SetInt64(int64(r)))
	x.Sqrt(x)
	i, _ := x.SetMantExp(x, 96).Int(nil)
	return i
}

func TestGetAmountsForLiqPriceInside(t *testing.T) {
	sqrtPriceX96 := encodePriceSqrt(1, 1)
	sqrtPriceAX96 := encodePriceSqrt(100, 110)
	sqrtPriceBX96 := encodePriceSqrt(110, 100)
	liq := new(big.Int).SetInt64(2148)
	amount0, amount1 := GetAmountsForLiq(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liq)
	assert.Equalf(t,
		new(big.Rat).SetInt64(100).FloatString(0), // 99 rounded up
		amount0.FloatString(0),
		"amount0 not equal",
	)
	assert.Equalf(t,
		new(big.Rat).SetInt64(100).FloatString(0),
		amount1.FloatString(0),
		"amount1 not equal",
	)
}

func TestGetAmountsForLiqPriceBelow(t *testing.T) {
	sqrtPriceX96 := encodePriceSqrt(99, 110)
	sqrtPriceAX96 := encodePriceSqrt(100, 110)
	sqrtPriceBX96 := encodePriceSqrt(110, 100)
	liq := new(big.Int).SetInt64(1048)
	amount0, amount1 := GetAmountsForLiq(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liq)
	assert.Equalf(t,
		new(big.Rat).SetInt64(100).FloatString(0), // 99 rounded up
		amount0.FloatString(0),
		"amount0 not equal",
	)
	assert.Equalf(t,
		new(big.Rat).SetInt64(0).FloatString(0),
		amount1.FloatString(0),
		"amount1 not equal",
	)
}

func TestGetAmountsForLiqPriceAbove(t *testing.T) {
	sqrtPriceX96 := encodePriceSqrt(111, 100)
	sqrtPriceAX96 := encodePriceSqrt(100, 110)
	sqrtPriceBX96 := encodePriceSqrt(110, 100)
	liq := new(big.Int).SetInt64(2097)
	amount0, amount1 := GetAmountsForLiq(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liq)
	assert.Equalf(t,
		new(big.Rat).SetInt64(0).FloatString(0),
		amount0.FloatString(0),
		"amount0 not equal",
	)
	assert.Equalf(t,
		new(big.Rat).SetInt64(200).FloatString(0), // 199 rounded up
		amount1.FloatString(0),
		"amount1 not equal",
	)
}

func TestGetSqrtRatioAtTick(t *testing.T) {
	assert.Equalf(t,
		// 79426470787362580746886972461
		new(big.Int).SetBits([]big.Word{0x6976f1080c4042d, 0x100a40969}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(50)).Text(10),
		"tick not correct",
	)
}
