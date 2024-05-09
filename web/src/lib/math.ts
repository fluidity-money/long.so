const Q96 = BigInt(2 ^ 96);

const encodeTick = (price: number): number => {
  // log_1.0001(num/denom)
  return Math.floor(Math.log(price) / Math.log(1.0001));
};

const encodeSqrtPrice = (price: number): bigint => {
  return BigInt(Math.sqrt(price) * 2 ** 96);
};

const getSqrtRatioAtTick = (tick: number): bigint => {
  return BigInt(Math.sqrt(1.0001^tick) * 2^96);
};

const bigAbs = (n: bigint) => (n < BigInt(0) ? -n : n);

const getLiquidityForAmount0 = (
  lowerTick: number,
  upperTick: number,
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
  lowerTick: number,
  upperTick: number,
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
  tick: number,
  lowerTick: number,
  upperTick: number,
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

export { encodeTick, encodeSqrtPrice, bigAbs, getLiquidityForAmounts };
