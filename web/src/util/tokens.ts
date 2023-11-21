import {Hash} from "viem"
import {mustEnv} from "./env"

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

const tokenListString = mustEnv('NEXT_PUBLIC_TOKEN_LIST')

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
