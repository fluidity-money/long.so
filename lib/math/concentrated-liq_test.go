// Tests the concentrated liquidity math that we use for position
// scanning. For testing, it converts the underlying rat to a string and
// truncates the decimals (and rounds it up).

package math

import (
	"fmt"
	"math/big"
	"testing"

	"github.com/stretchr/testify/assert"
)

var ZeroRat = new(big.Rat)

func encodePriceSqrt(l, r int) *big.Int {
	//sqrtPriceX96 = sqrt(price) * 2 ** 96
	x := new(big.Float).SetInt64(int64(l))
	x.Quo(x, new(big.Float).SetInt64(int64(r)))
	x.Sqrt(x)
	i, _ := x.SetMantExp(x, 96).Int(nil)
	return i
}

var sqrtRatioAtTickTestTable = []struct {
	expected *big.Int
	arg      int
}{
	{
		//79426470787362580746886972461
		new(big.Int).SetBits([]big.Word{0x6976f1080c4042d, 0x100a40969}),
		50,
	},
	{
		// 79625275426524748796330556128
		new(big.Int).SetBits([]big.Word{0x1c17ddb45ce0bae0, 0x101487bee}),
		100,
	},
	{
		//80224679980005306637834519095
		new(big.Int).SetBits([]big.Word{0x10558cdf8c440237, 0x103384cc8}),
		250,
	},
	{
		//81233731461783161732293370115
		new(big.Int).SetBits([]big.Word{0x7f9ba68649faa103, 0x1067af7be}),
		500,
	},
	{
		//83290069058676223003182343270
		new(big.Int).SetBits([]big.Word{0xfe8561359d69a466, 0x10d1fee2a}),
		1000,
	},
	{
		//89776708723587163891445672585
		new(big.Int).SetBits([]big.Word{0xd5e8608ce87a2a89, 0x122158d8b}),
		2500,
	},
	{
		//92049301871182272007977902845
		new(big.Int).SetBits([]big.Word{0x39b9cdb1686122fd, 0x1296d65dd}),
		3000,
	},
	{
		MinSqrtRatio,
		int(MinTick.Int64()),
	},
	{
		MaxSqrtRatio,
		int(MaxTick.Int64()),
	},
}

func TestGetSqrtRatioAtTick(t *testing.T) {
	for i, test := range sqrtRatioAtTickTestTable {
		test := test
		t.Run(fmt.Sprintf("SqrtRatioAtTick: %v", i), func(t *testing.T) {
			t.Parallel()
			out := GetSqrtRatioAtTick(new(big.Int).SetInt64(int64(test.arg)))
			assert.Equal(t, test.expected.Text(10), out.Text(10))
		})
	}
}

func TestGetPriceAtSqrtRatio(t *testing.T) {
	t.Fatal("unimplemented")
}

var getAmountForsLiqTestTable = map[string]struct {
	sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96 *big.Int
	liq                                        int

	expectedAmount0, expectedAmount1 *big.Rat
}{
	"should survive a nil current ratio": {
		nil, encodePriceSqrt(99, 110), encodePriceSqrt(100, 110), 1048,
		ZeroRat, ZeroRat,
	},
	"should survive a nil lower ratio": {
		encodePriceSqrt(99, 110), nil, encodePriceSqrt(100, 110), 1048,
		ZeroRat, ZeroRat,
	},
	"should survive a nil upper ratio": {
		encodePriceSqrt(99, 110), encodePriceSqrt(100, 110), nil, 1048,
		ZeroRat, ZeroRat,
	},
	"liquidity weird": {
		GetSqrtRatioAtTick(new(big.Int).SetInt64(2206)),  // Current price
		GetSqrtRatioAtTick(new(big.Int).SetInt64(-1140)), // Lower pricte
		GetSqrtRatioAtTick(new(big.Int).SetInt64(960)),   // Upper price
		48296224, // Liquidity
		ZeroRat, ZeroRat,
	},
	"price inside": {
		encodePriceSqrt(1, 1), encodePriceSqrt(1, 1), encodePriceSqrt(110, 100), 2148,
		new(big.Rat).SetInt64(100), new(big.Rat).SetInt64(100),
	},
	"price below": {
		encodePriceSqrt(99, 110), encodePriceSqrt(100, 110), encodePriceSqrt(110, 100), 1048,
		new(big.Rat).SetInt64(100), new(big.Rat).SetInt64(0),
	},
	"price above": {
		encodePriceSqrt(111, 100), encodePriceSqrt(100, 110), encodePriceSqrt(110, 100), 2097,
		new(big.Rat).SetInt64(0), new(big.Rat).SetInt64(200),
	},
}

func TestGetAmountsForLiq(t *testing.T) {
	for k, test := range getAmountForsLiqTestTable {
		test := test
		t.Run(k, func(t *testing.T) {
			t.Parallel()
			amount0, amount1 := GetAmountsForLiq(test.sqrtRatioX96, test.sqrtRatioAX96, test.sqrtRatioBX96, new(big.Int).SetInt64(int64(test.liq)))
			assert.Equal(t, test.expectedAmount0.FloatString(10), amount0.FloatString(10))
			assert.Equal(t, test.expectedAmount1.FloatString(10), amount1.FloatString(10))
		})
	}
}
