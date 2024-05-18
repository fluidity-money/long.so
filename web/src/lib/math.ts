
const MIN_TICK = -887272;

const MAX_TICK = -MIN_TICK;

const POSSIBLE_TICKS = -MIN_TICK + MAX_TICK;

const Q96 = 2n ** 96n;

const encodeTick = (price: number): number => {
  // log_1.0001(num/denom)
  return Math.floor(Math.log(price) / Math.log(1.0001));
};

const encodeSqrtPrice = (price: number): bigint => {
  return BigInt(Math.sqrt(price) * 2 ** 96);
};

const sqrtPriceX96ToPrice = (sqrtPriceX96: bigint): bigint =>
  (sqrtPriceX96 / Q96) ** 2n;

const getSqrtRatioAtTick = (tick: bigint): bigint => {
  // the implementation of this function is more or less identical to the
  // one in the Rust tick_math code.
  if (tick > MAX_TICK) throw new Error("exceeding max tick");
  if (tick < MIN_TICK) throw new Error("below min tick");
  let absTick = tick > 0n ? tick : -tick;
  let result = (absTick & 1n) != 0n ? 0xfffcb933bd6fad37aa2d162d1a594001n : 1n << 128n;
  absTick >>= 1n;
  let ratio = 340248342086729790484326174814286782778n;
  while (absTick != 0n) {
    if ((absTick & 1n) != 0n) result = (result * ratio) >> 128n;
    ratio = (ratio * ratio) >> 128n;
    absTick >>= 1n;
  }
  if (tick > 0n) result = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn / result;
  result >>= 32n;
  if (result % (1n << 32n) != 0n) result++;
  return result;
};

const bigAbs = (n: bigint) => (n < BigInt(0) ? -n : n);

const getLiquidityForAmount0 = (
  lowerTick: bigint,
  upperTick: bigint,
  amount0: bigint
): bigint => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  const intermediate = (sqrtRatioAX96 * sqrtRatioBX96) / Q96;
  return (amount0 * intermediate) / (sqrtRatioBX96 - sqrtRatioAX96);
};

const getLiquidityForAmount1 = (
  lowerTick: bigint,
  upperTick: bigint,
  amount1: bigint
): bigint => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  return (amount1 * Q96) / (sqrtRatioBX96 - sqrtRatioAX96);
};

const getLiquidityForAmounts = (
  tick: bigint,
  lowerTick: bigint,
  upperTick: bigint,
  amount0: bigint,
  amount1: bigint
): bigint => {
  let sqrtRatioAX96 = getSqrtRatioAtTick(lowerTick);
  let sqrtRatioBX96 = getSqrtRatioAtTick(upperTick);

  const sqrtRatioX96 = getSqrtRatioAtTick(tick);

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = sqrtRatioAX96;
  }

  if (sqrtRatioAX96 > sqrtRatioX96) {
    return getLiquidityForAmount0(lowerTick, upperTick, amount0);
  } else if (sqrtRatioBX96 > sqrtRatioAX96) {
    const liquidity0 = getLiquidityForAmount0(tick, upperTick, amount0);
    const liquidity1 = getLiquidityForAmount1(lowerTick, tick, amount1);

    if (liquidity0 > liquidity1) {
      return liquidity1;
    } else {
      return liquidity0;
    }
  } else {
    return getLiquidityForAmount1(lowerTick, upperTick, amount1);
  }
};

export {
  MIN_TICK,
  MAX_TICK,
  POSSIBLE_TICKS,
  sqrtPriceX96ToPrice,
  encodeTick,
  encodeSqrtPrice,
  bigAbs,
  getLiquidityForAmounts,
  getSqrtRatioAtTick,
};
