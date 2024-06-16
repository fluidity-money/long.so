package math

import "math/big"

var (
	One  = new(big.Int).SetInt64(1)
	Zero = new(big.Int).SetInt64(0)
)

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

func GetSqrtRatioAtTick(t *big.Int) *big.Int {
	absTick := new(big.Int).Abs(t)
	res := new(big.Int).And(absTick, One)
	//if res != 0
	if res.Cmp(Zero) != 0 {
		_, _ = res.SetString("0xfffcb933bd6fad37aa2d162d1a594001", 16)
	} else {
		res.Lsh(One, 128)
	}
	absTick.Rsh(absTick, 1)
	ratio, _ := new(big.Int).SetString("340248342086729790484326174814286782778", 10)
	//while absTick != 0
	for absTick.Cmp(Zero) != 0 {
		//if absTick & 1n != 0
		if new(big.Int).And(absTick, One).Cmp(Zero) != 0 {
			res.Mul(res, ratio)
			res.Rsh(res, 128)
		}
		ratio.Mul(ratio, ratio)
		ratio.Rsh(ratio, 128)
		absTick.Rsh(absTick, 1)
	}
	//if t > 0
	if t.Cmp(Zero) > 0 {
		x, _ := new(big.Int).SetString("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16)
		res.Quo(x, res)
	}
	res.Rsh(res, 32)
	//if result % (1n << 32n) != 0
	if new(big.Int).Mod(res, new(big.Int).Set(One).Lsh(One, 32)).Cmp(Zero) != 0 {
		res.Add(res, One)
	}
	return res
}