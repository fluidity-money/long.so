import { usdFormat } from "@/lib/usdFormat";

describe("usdFormat", () => {
  it("decimals trim", () => {
    expect(usdFormat(1.0000000123)).toEqual("$1.00");
  });
  it("0<n<0.1 is entire number", () => {
    expect(usdFormat(0.00152, true)).toEqual("$0.00152");
    expect(usdFormat(0.000000000000152, true)).toEqual("$0.000000000000152");
  });
  it("price/non price truncation works", () => {
    expect(usdFormat(0.0099, false)).toEqual("<$0.01");
    expect(usdFormat(0.0099, true)).toEqual("$0.0099");
  });
  it("tens", () => {
    expect(usdFormat(10.256)).toEqual("$10.26");
  });
  it("hundreds", () => {
    expect(usdFormat(123.4568)).toEqual("$123.46");
  });
  it("thousands", () => {
    expect(usdFormat(1223.4568)).toEqual("$1,223.46");
  });
  it("ten thousands", () => {
    expect(usdFormat(19223.4568)).toEqual("$19,223.46");
  });
  it("hundred thousands", () => {
    expect(usdFormat(123223.4568)).toEqual("$123,223.46");
  });
  it("millions", () => {
    expect(usdFormat(1234000.298)).toEqual("$1.23M");
  });
});
