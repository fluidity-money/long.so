// a formatted amount is a human-readable value, such as 1.445 or 20
// a token amount is a raw amount scaled by a token's decimals, such as 1445000 or 20000000

/**
 * @description convert a bigint formatted amount to a token amount 
 * @param amount - formatted amount
 * @param decimals - number of token decimals
 * @returns raw token amount
 */
const getTokenAmountFromFormatted = (amount: bigint, decimals: number) =>
  amount * BigInt(10 ** decimals)

/**
 * @description convert a token amount to a formatted amount string
 * @param amount - raw token amount
 * @param decimals - number of token decimals
 * @returns a formatted amount string
 */
const getFormattedStringFromTokenAmount = (amount: string, decimals: number) => {
  // slice around potential decimal place
  const a = amount.slice(0, -decimals)
  let b = amount.slice(-decimals)
 
  // if b is only 0s, amount is either 0 or a
  // if 0, a is '' => 0
  // if a, b is 000000 => a
  if (/^0+$/.test(b))
    return a || b

  // trim trailing zeros from decimal part
  b = b.replace(/0+$/, '')

  // number has a whole part
  if (amount.length > decimals)
    return a + '.' + b

  // number is a decimal, pad with zeros
  return '0.' + '0'.repeat(decimals - amount.length) + b
}

/**
 * @description convert a formatted amount string to a raw token amount
 * @param amount - formatted string
 * @param decimals - number of token decimals
 * @returns the raw token amount
 */
const getTokenAmountFromFormattedString = (amount: string, decimals: number): bigint => {
  const [whole, dec] = amount.split('.')

  // covert the whole portion to a token amount
  const wholeBig = getTokenAmountFromFormatted(BigInt(whole || 0), decimals)

  if (dec === undefined) {
    return wholeBig
  }

  // convert the decimal portion to a token amount
  const decimalsBig = BigInt(dec) * BigInt(10 ** (decimals - dec.length))

  return wholeBig + decimalsBig
}

export {
    getFormattedStringFromTokenAmount,
    getTokenAmountFromFormattedString,
}

