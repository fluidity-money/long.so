import { Hash, isHex } from 'viem'

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

// TODO move all env stuff (including ammAddress) into own file
const tokenListString = process.env.NEXT_PUBLIC_TOKEN_LIST
if (!tokenListString)
  throw new Error('Failed to fetch required env NEXT_PUBLIC_TOKEN_LIST!')

const permit2AddressString = process.env.NEXT_PUBLIC_PERMIT2_ADDRESS
if (!permit2AddressString || !isHex(permit2AddressString))
  throw new Error(
    `PERMIT2 address from env was not a valid address! Was ${permit2AddressString}`,
  )

const permit2Address = permit2AddressString

const TokenList: Array<Token> = JSON.parse(tokenListString)
const TokenMap: { [address: Hash]: Token } = TokenList.reduce(
  (prev, current) => ({
    ...prev,
    [current.address]: current,
  }),
  {},
)

const addressToSymbol = (address: Hash) => TokenMap[address]?.symbol
const tokenFromAddress = (address: Hash) => TokenMap[address]
const decimalsFromAddress = (address: Hash) => TokenMap[address].decimals

const FluidTokenAddress = (() => {
  const FluidTokenAddress = TokenList.find(
    ({ symbol }) => symbol === 'fUSDC',
  )?.address
  if (!FluidTokenAddress)
    throw new Error(
      'Fluid Token not found in token list! (NEXT_PUBLIC_TOKEN_LIST)',
    )
  return FluidTokenAddress
})()

export {
  TokenList,
  TokenMap,
  FluidTokenAddress,
  permit2Address,
  addressToSymbol,
  tokenFromAddress,
  decimalsFromAddress,
}
