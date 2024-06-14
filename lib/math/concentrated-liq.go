package math

import "math/big"

var Q96, _ = new(big.Int).SetString("79228162514264337593543950336", 10)

const Resolution = 96

// GetAmountsForLiq with sqrtRatioX96 being the first tick boundary, and
// sqrtRatioAX96 being the second. liq being the amount of liquidity in
// the position.
func GetAmountsForLiq(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount0 *big.Int, amount1 *big.Int) {
	var sqrtRatio0X96, sqrtRatio1X96 *big.Int
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	//if sqrtRatioX96 <= sqrtRatio0X96
	if sqrtRatioX96.Cmp(sqrtRatio0X96) <= 0 {
		amount0 = GetAmount0ForLiq(sqrtRatio0X96, sqrtRatio1X96, liq)
		amount1 = new(big.Int)
	//if sqrtRatioX96 < sqrtRatio1X96
	} else if sqrtRatioX96.Cmp(sqrtRatio1X96) < 0 {
		amount0 = GetAmount0ForLiq(sqrtRatioX96, sqrtRatio1X96, liq)
		amount1 = GetAmount1ForLiq(sqrtRatio1X96, sqrtRatioX96, liq)
	} else {
		amount0 = new(big.Int)
		amount1 = GetAmount1ForLiq(sqrtRatio0X96, sqrtRatio1X96, liq)
	}
	return
}

func GetAmount0ForLiq(sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount0 *big.Int) {
	var sqrtRatio0X96, sqrtRatio1X96 *big.Int
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	lsl := new(big.Int).Lsh(liq, Resolution)
	sqrtDiff := new(big.Int).Sub(sqrtRatio1X96, sqrtRatio0X96)
	res := new(big.Int).Mul(lsl, sqrtDiff)
	num := new(big.Int).Quo(res, sqrtRatio1X96)
	amount0 = new(big.Int).Quo(num, sqrtRatio0X96)
	return
}

func GetAmount1ForLiq(sqrtRatioAX96, sqrtRatioBX96, liq *big.Int) (amount1 *big.Int) {
	var sqrtRatio0X96, sqrtRatio1X96 *big.Int
	//if sqrtRatioAX96 > sqrtRatioBX96
	if sqrtRatioAX96.Cmp(sqrtRatioBX96) > 0 {
		sqrtRatio0X96 = sqrtRatioBX96
		sqrtRatio1X96 = sqrtRatioAX96
	}
	sqrtDiff := new(big.Int).Sub(sqrtRatio1X96, sqrtRatio0X96)
	res := new(big.Int).Mul(liq, sqrtDiff)
	amount1 = new(big.Int).Quo(res, Q96)
	return
}

