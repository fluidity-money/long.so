import { encodeSqrtPrice, sqrtPriceX96ToPrice } from "@/lib/math";

describe("encodeSqrtPrice", () => {
    it("Should work with 0.03437261 tick.", () => {
        const ethTick = BigInt(14688783812173476777496150016);
        expect(encodeSqrtPrice(0.03437261)).toEqual(ethTick);
    });
})

describe("sqrtPriceX96ToPrice", () => {
    it("18 decimals, price > 1", () => {
        const decimals = 18;
        const sqrtPriceX96 = 1082626999771884967498373611162n
        const encoded = sqrtPriceX96ToPrice(sqrtPriceX96)
        expect(encoded).toBe(186723311178398592718n)
        expect(Number(encoded) / 10 ** decimals).toBe(186.7233111783986)
    });
    it("18 decimals, price < 1", () => {
        const decimals = 18;
        const sqrtPriceX96 = 4730467712712532270754096n
        const encoded = sqrtPriceX96ToPrice(sqrtPriceX96)
        expect(encoded).toBe(3564913510n)
        expect(Number(encoded) / 10 ** decimals).toBe(3.56491351e-9)
    });
    it("6 decimals, price > 1", () => {
        const decimals = 6;
        const sqrtPriceX96 = 79141441126769916199805n
        const encoded = sqrtPriceX96ToPrice(sqrtPriceX96)
        expect(encoded).toBe(997812n)
        expect(Number(encoded) / 10 ** decimals).toBe(0.997812)
    });
});
