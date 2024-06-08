
export const MIN_TICK = -887272;

export const MAX_TICK = -MIN_TICK;

export const MIN_SQRT_RATIO = 4295128739n;

export const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n;

export const POSSIBLE_TICKS = -MIN_TICK + MAX_TICK;

const MAX_UINT256 = (1n << 256n) - 1n;

export const Q96 = 2n ** 96n;

export const encodeTick = (price: number): number => {
  // log_1.0001(num/denom)
  return Math.floor(Math.log(price) / Math.log(1.0001));
};

// encodeSqrtPrice, generating slightly off results compared to the
// approach in the code. okay for the frontend though.
export const encodeSqrtPrice = (price: number): bigint => {
  return BigInt(Math.sqrt(price) * 2 ** 96);
};

export const sqrtPriceX96ToPrice = (sqrtPriceX96: bigint): bigint =>
  (sqrtPriceX96 / Q96) ** 2n;

export const getSqrtRatioAtTick = (tick: bigint): bigint => {
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

const overflowingMulUint256 = (x: bigint, y: bigint) => {
  let v = x * y;
  if (v > MAX_UINT256) return v & MAX_UINT256;
  return v;
};

export const getTickAtSqrtRatio = (sqrtPriceX96: bigint): number => {
  if (sqrtPriceX96 < MIN_SQRT_RATIO || sqrtPriceX96 > MAX_SQRT_RATIO)
    throw new Error("sqrt ratio out of range");

  let ratio = sqrtPriceX96 << 32n;
  let r = ratio;
  let msb = 0n;
  let f = 0n;

  if (r > 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn) f = 1n << 7n;
  msb |= f;
  r >>= f;

  if (r > 0xFFFFFFFFFFFFFFFFn) {
    f = 1n << 6n;
  } else {
    f = 0n;
  }
  msb |= f;
  r  >>= f;

  if (r > 0xFFFFFFFFn) {
    f = 1n << 5n;
  } else {
    f = 0n;
  }
  msb |= f;
  r >>= f;

  if (r > 0xFFFFn) {
    f = 1n << 4n;
  } else {
    f = 0n;
  }
  msb |= f;
  r >>= f;

  if (r > 0xFFn) {
    f = 1n << 3n;
  } else {
    f = 0n;
  }
  msb |= f;
  r >>= f;

  if (r > 0xFn) {
    f = 1n << 2n;
  } else {
    f = 0n;
  }
  msb |= f;
  r >>= f;

  if (r > 0x3n) {
    f = 1n << 1n;
  } else {
    f = 0n;
  }
  msb |= f;
  r >>= f;

  if (r > 0x1n) {
    f = 1n;
  } else {
   f = 0n;
  }
  msb |= f;

  if (msb >= 128n) {
    r = ratio >> msb - 127n;
  } else {
    r = ratio << 127n - msb;
  }

  let log2 = (msb - 128n) << 64n;

  for (let i = 63n; i >= 51n; i--) {
    r = overflowingMulUint256(r, r);
    r >>= 127n;
    const x = r >> 128n;
    log2 |= (x << i);
    r >>= x;
  }

  r = overflowingMulUint256(r, r);
  r >>= 127n;

  const x = r >> 128n;
  log2 |= (x << 50n);


  let logSqrt10001 = log2 * 255738958999603826347141n;


  const tickLow =
    lowInt32((logSqrt10001 - 3402992956809132418596140100660247210n) >> 128n);
  const tickHigh =
    lowInt32((logSqrt10001 + 291339464771989622907027621153398088495n) >> 128n);

  let tick = (() => {
    if (tickLow == tickHigh) return tickLow;
    if (getSqrtRatioAtTick(tickHigh) <= sqrtPriceX96) return tickHigh;
    return tickLow;
  })();

  return Number(tick);
}

const lowInt32 = (n: bigint) => {
  console.log("n", n);
  const b = new ArrayBuffer(4);
  const d = new DataView(b);
  d.setUint32(0, Number(n & 0xFFFFFFFFn), true);
  return BigInt(d.getInt32(0, true));
};

const bigAbs = (n: bigint) => (n < BigInt(0) ? -n : n);

export const getLiquidityForAmount0 = (
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
