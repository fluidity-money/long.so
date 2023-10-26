const encodeTick = (price: number): number => {
    // log_1.0001(num/denom)
    return Math.floor(Math.log(price) / Math.log(1.0001));
}

export {
    encodeTick,
}
