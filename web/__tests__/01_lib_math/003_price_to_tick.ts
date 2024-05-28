
import { getTickAtSqrtRatio, MIN_SQRT_RATIO, MIN_TICK } from "@/lib/math";

describe("Liquidity math", () => {
  it("Should get the tick at the sqrt ratio given correctly", () => {
    expect(getTickAtSqrtRatio(MIN_SQRT_RATIO)).toEqual(Number(MIN_TICK));
  });
});
