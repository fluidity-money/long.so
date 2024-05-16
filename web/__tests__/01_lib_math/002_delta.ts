
import { getSqrtRatioAtTick } from "@/lib/math";

describe("Liquidity math", () => {
  it("Should get the sqrt ratio at a tick correctly", () => {
    // tests taken from the Uniswap math implementation
    expect(getSqrtRatioAtTick(50n)).toEqual(79426470787362580746886972461n);
    expect(getSqrtRatioAtTick(100n)).toEqual(79625275426524748796330556128n);
    expect(getSqrtRatioAtTick(250n)).toEqual(80224679980005306637834519095n);
    expect(getSqrtRatioAtTick(500n)).toEqual(81233731461783161732293370115n);
    expect(getSqrtRatioAtTick(1000n)).toEqual(83290069058676223003182343270n);
    expect(getSqrtRatioAtTick(2500n)).toEqual(89776708723587163891445672585n);
    expect(getSqrtRatioAtTick(3000n)).toEqual(92049301871182272007977902845n);
  });
});
