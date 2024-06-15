package math

import "math/big"

var Q96, _ = new(big.Int).SetString("79228162514264337593543950336", 10)

const Resolution = 96

// GetAmountsForLiq with sqrtRatioX96 being the first tick boundary, and
// sqrtRatioAX96 being the second. liq being the amount of liquidity in
// the position.
func GetAmountsForLiq(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount0 *big.Rat, amount1 *big.Rat) {
	var (
		sqrtRatio0X96 = sqrtRatioAX96
		sqrtRatio1X96 = sqrtRatioBX96
	)
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	//if sqrtRatioX96 <= sqrtRatio0X96
	if sqrtRatioX96.Cmp(sqrtRatio0X96) <= 0 {
		amount0 = GetAmount0ForLiq(sqrtRatio0X96, sqrtRatio1X96, liq)
		amount1 = new(big.Rat)
		//if sqrtRatioX96 < sqrtRatio1X96
	} else if sqrtRatioX96.Cmp(sqrtRatio1X96) < 0 {
		amount0 = GetAmount0ForLiq(sqrtRatioX96, sqrtRatio1X96, liq)
		amount1 = GetAmount1ForLiq(sqrtRatio1X96, sqrtRatioX96, liq)
	} else {
		amount0 = new(big.Rat)
		amount1 = GetAmount1ForLiq(sqrtRatio0X96, sqrtRatio1X96, liq)
	}
	return
}

func GetAmount0ForLiq(sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount0 *big.Rat) {
	var (
		sqrtRatio0X96 = sqrtRatioAX96
		sqrtRatio1X96 = sqrtRatioBX96
	)
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	lsl := new(big.Int).Lsh(liq, Resolution)
	sqrtDiff := new(big.Int).Sub(sqrtRatio1X96, sqrtRatio0X96)
	res := new(big.Int).Mul(lsl, sqrtDiff)
	num := new(big.Int).Quo(res, sqrtRatio1X96)
	amount0 = new(big.Rat).Quo(new(big.Rat).SetInt(num), new(big.Rat).SetInt(sqrtRatio0X96))
	return
}

func GetAmount1ForLiq(sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount1 *big.Rat) {
	var (
		sqrtRatio0X96 = sqrtRatioAX96
		sqrtRatio1X96 = sqrtRatioBX96
	)
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	sqrtDiff := new(big.Rat).Sub(new(big.Rat).SetInt(sqrtRatio1X96), new(big.Rat).SetInt(sqrtRatio0X96))
	res := new(big.Rat).Mul(new(big.Rat).SetInt(liq), sqrtDiff)
	amount1 = new(big.Rat).Quo(res, new(big.Rat).SetInt(Q96))
	return
}
