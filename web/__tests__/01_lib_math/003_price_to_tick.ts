
import {
  encodeSqrtPrice,
  getTickAtSqrtRatio,
  MIN_SQRT_RATIO,
  MIN_TICK,
  MAX_SQRT_RATIO,
  MAX_TICK } from "@/lib/math";

describe("Liquidity math", () => {
  it("Should get the tick at the sqrt ratio given correctly", () => {
    //expect(getTickAtSqrtRatio(MIN_SQRT_RATIO)).toEqual(Number(MIN_TICK));
    //expect(getTickAtSqrtRatio(MAX_SQRT_RATIO)).toEqual(Number(MAX_TICK));
    expect(getTickAtSqrtRatio(25403716842523354832073439750n)).toEqual(-22750);
  });
});
