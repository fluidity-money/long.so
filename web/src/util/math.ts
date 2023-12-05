const encodeTick = (price: number): number => {
    // log_1.0001(num/denom)
    return Math.floor(Math.log(price) / Math.log(1.0001))
}

const encodeSqrtPrice = (price: number): bigint => {
    return BigInt(Math.sqrt(price) * 2**96)
}

const bigAbs = (n: bigint) => (n < BigInt(0)) ? -n : n

export {
    encodeTick,
    encodeSqrtPrice,
    bigAbs,
}
