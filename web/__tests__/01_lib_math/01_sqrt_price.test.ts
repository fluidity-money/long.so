
import { encodeSqrtPrice } from "@/lib/math";

describe("encodeSqrtPrice", () => {
  it("Should work with 0.03437261 tick.", () => {
    const ethTick = BigInt(14688783812173476777496150016);
    expect(encodeSqrtPrice(0.03437261)).toEqual(ethTick);
  });
});
