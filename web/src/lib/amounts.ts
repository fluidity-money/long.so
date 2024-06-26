// a formatted amount is a human-readable value, such as 1.445 or 20
// a token amount is a raw amount scaled by a token's decimals, such as 1445000 or 20000000

import { getSqrtRatioAtTick, sqrtPriceX96ToPrice } from "./math"
import { usdFormat } from "./usdFormat"

/**
 * @description convert a bigint formatted amount to a token amount 
 * @param amount - formatted amount
 * @param decimals - number of token decimals
 * @returns raw token amount
 */
const getTokenAmountFromFormatted = (amount: bigint, decimals: number) =>
  amount * BigInt(10 ** decimals)

/**
 * @description format a number amount to at most the given decimals
 * without the unncessary padding from toFixed
 * @param amount - number amount
 * @param decimals: maximum number of decimals to display
 * @example 1.2, 6 -> 1.2
 * @example 1.23456789, 6 -> 1.234567
 * @example 1.0, 6 -> 1
 */
const snapAmountToDecimals = (amount: number, decimals: number = 6): number =>
  Number(amount.toFixed(decimals))

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
  // assume containing e indicates an exponential value
  if (amount.includes('e')) {
    return BigInt(Number(amount).toLocaleString('fullwide', { useGrouping: false }))
  }
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

/**
 * @description scale a formatted amount string by the price of the pool
 * @param amount - formatted string
 * @param price - the pool price as a regular number, scaled up by fUSDC decimals
 * @param decimalsFusdc - the decimals of fUSDC
 * @returns the scaled price amount in USD
 */
const getFormattedPriceFromAmount = (amount: string, price: string | bigint, decimalsFusdc: number): number =>
  Number(amount) * Number(price) / 10 ** decimalsFusdc

// convert a tick to a formatted price, scaled by decimals
const getFormattedPriceFromTick = (tick: number, decimals0: number, decimals1: number) => {
  const ratio = getSqrtRatioAtTick(BigInt(tick))
  const priceUnscaled = Number(sqrtPriceX96ToPrice(ratio, decimals0))
  // adjust for decimals
  const scale = 10 ** -(decimals1)
  const formattedPrice = usdFormat(priceUnscaled * scale)
  // display '∞ ' if the price is greater than $10e18 after scaling
  return formattedPrice.length > 20 ? '∞ ' : formattedPrice
}

// get the amount of token1Unscaled, given the price and amount of token0Unscaled.
// mul sets the operation to scale up token0Unscaled by tokenPrice18 (assumes token0Unscaled is the base token)
// div sets the operation to divide token0Unscaled by tokenPrice18 (assumes token0Unscaled is the other token)
const getTokenAmountFromRawAmountAndPrice = (token0Unscaled: bigint, tokenPrice18: bigint, dec0: bigint, dec1: bigint, op: 'mul' | 'div'): bigint => {
  const num = token0Unscaled * 10n ** dec0;
  const dec = dec1 <= dec0 ? (dec0 - dec1) + dec0 : dec0;
  return op === 'mul' ?
    num * tokenPrice18 / 10n ** (dec + dec1) :
    num / tokenPrice18
}

export {
  getFormattedStringFromTokenAmount,
  snapAmountToDecimals,
  getTokenAmountFromFormattedString,
  getFormattedPriceFromAmount,
  getFormattedPriceFromTick,
  getTokenAmountFromRawAmountAndPrice,
}

