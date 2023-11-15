import {Hash} from "viem"

export interface Token {
  symbol: string
  name: string
  logo: string
  address: Hash
  colour: string
  decimals: number
  // there is one fluid token per AMM
  isFluidToken: boolean
}

const tokenListString = process.env.NEXT_PUBLIC_TOKEN_LIST
if (!tokenListString)
  throw new Error("Token List was undefined! (NEXT_PUBLIC_TOKEN_LIST)")

const TokenList: Array<Token> = JSON.parse(tokenListString)
const TokenMap: {[address: Hash]: Token} = TokenList.reduce((prev, current) => ({
  ...prev,
  [current.address]: current
}), {})

const addressToSymbol = (address: Hash) => TokenMap[address].symbol

const FluidTokenAddress = TokenList.find(({symbol}) => symbol === 'fUSDC')?.address

if (!FluidTokenAddress)
  throw new Error("Fluid Token not found in token list! (NEXT_PUBLIC_TOKEN_LIST)")

export {
  TokenList,
  TokenMap,
  FluidTokenAddress,
  addressToSymbol
}
