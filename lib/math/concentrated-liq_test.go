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
	assert.Equal(t,
		//79426470787362580746886972461
		new(big.Int).SetBits([]big.Word{0x6976f1080c4042d, 0x100a40969}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(50)).Text(10),
	)
	assert.Equal(t,
		// 79625275426524748796330556128
		new(big.Int).SetBits([]big.Word{0x1c17ddb45ce0bae0, 0x101487bee}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(100)).Text(10),
	)
	assert.Equal(t,
		//80224679980005306637834519095
		new(big.Int).SetBits([]big.Word{0x10558cdf8c440237, 0x103384cc8}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(250)).Text(10),
	)
	assert.Equal(t,
		//81233731461783161732293370115
		new(big.Int).SetBits([]big.Word{0x7f9ba68649faa103, 0x1067af7be}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(500)).Text(10),
	)
	assert.Equal(t,
		//83290069058676223003182343270
		new(big.Int).SetBits([]big.Word{0xfe8561359d69a466, 0x10d1fee2a}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(1000)).Text(10),
	)
	assert.Equal(t,
		//89776708723587163891445672585
		new(big.Int).SetBits([]big.Word{0xd5e8608ce87a2a89, 0x122158d8b}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(2500)).Text(10),
	)
	assert.Equal(t,
		//92049301871182272007977902845
		new(big.Int).SetBits([]big.Word{0x39b9cdb1686122fd, 0x1296d65dd}).Text(10),
		GetSqrtRatioAtTick(new(big.Int).SetInt64(3000)).Text(10),
	)
	assert.Equal(t,
		MinSqrtRatio.Text(10),
		GetSqrtRatioAtTick(MinTick).Text(10),
	)
	assert.Equal(t,
		MaxSqrtRatio.Text(10),
		GetSqrtRatioAtTick(MaxTick).Text(10),
	)
}

func TestGetPriceAtSqrtRatio(t *testing.T) {
	t.Fatal("unimplemented")
}

func TestGetAmountsForLiqDontBlowUpOnNilSqrtPriceX96(t *testing.T) {
	sqrtPriceAX96 := encodePriceSqrt(99, 110)
	sqrtPriceBX96 := encodePriceSqrt(100, 110)
	liq := new(big.Int).SetInt64(1048)
	_, _ = GetAmountsForLiq(nil, sqrtPriceAX96, sqrtPriceBX96, liq)
}

func TestGetAmountsForLiqDontBlowUpOnNilSqrtPriceAX96(t *testing.T) {
	sqrtPriceX96 := encodePriceSqrt(99, 110)
	sqrtPriceBX96 := encodePriceSqrt(100, 110)
	liq := new(big.Int).SetInt64(1048)
	_, _ = GetAmountsForLiq(sqrtPriceX96, nil, sqrtPriceBX96, liq)
}

func TestGetAmountsForLiqDontBlowUpOnNilSqrtPriceBX96(t *testing.T) {
	sqrtPriceX96 := encodePriceSqrt(99, 110)
	sqrtPriceAX96 := encodePriceSqrt(100, 110)
	liq := new(big.Int).SetInt64(1048)
	_, _ = GetAmountsForLiq(sqrtPriceX96, sqrtPriceAX96, nil, liq)
}

func TestGetAmountsForLiqWeird(t *testing.T) {
	sqrtPriceX96 := GetSqrtRatioAtTick(new(big.Int).SetInt64(2206))
	sqrtPriceAX96 := GetSqrtRatioAtTick(new(big.Int).SetInt64(-1140))
	sqrtPriceBX96 := GetSqrtRatioAtTick(new(big.Int).SetInt64(960))
	liq := new(big.Int).SetInt64(48296224)
	amount0, amount1 := GetAmountsForLiq(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, liq)
	assert.Equal(t, nil, amount0.FloatString(15))
	assert.Equal(t, nil, amount1.FloatString(15))
}
