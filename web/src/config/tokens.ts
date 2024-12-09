import LightweightERC20 from "./abi/LightweightERC20";
import WETH10 from "./abi/WETH10";
import { useGraphqlGlobal } from "@/hooks/useGraphql";
import { graphql, useFragment } from "@/gql";
import { useCallback, useEffect, useMemo } from "react";
import { useSwapStore } from "@/stores/useSwapStore";
import { EmptyToken } from "@/lib/utils";
import { useStakeStore } from "@/stores/useStakeStore";
import { useChainId } from "wagmi";
import { useChain } from "./chains";

export type ChainIdTypes = (typeof allChains)[number]["id"];

export type Token = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  icon?: string;
} & (
  | {
      abi?: typeof LightweightERC20;
      isGasToken?: false | never;
    }
  | {
      abi?: typeof WETH10;
      isGasToken: true;
    }
);

const TokensFragment = graphql(`
  fragment TokensFragment on SeawaterPool {
    token {
      address
      decimals
      name
      symbol
      image
    }
  }
`);

const FusdcFragment = graphql(`
  fragment FusdcFragment on Token {
    address
    decimals
    name
    symbol
    image
  }
`);

export function useTokens(token: "default" | string): Token;
export function useTokens(token?: never): {
  tokens: { [symbol: string]: Token };
  DefaultToken: Token;
  getTokenFromSymbol: (symbol: string) => Token | undefined;
  getTokenFromAddress: (address: string) => Token | undefined;
};
export function useTokens(token?: "default" | string) {
  const {
    token0: swapToken0,
    token1: swapToken1,
    setToken0: setSwapToken0,
    setToken1: setSwapToken1,
  } = useSwapStore();
  const {
    token0: stakeToken0,
    token1: stakeToken1,
    setToken0: setStakeToken0,
    setToken1: setStakeToken1,
  } = useStakeStore();

  const chainId = useChainId();
  const { nativeCurrency: gasToken } = useChain(chainId);
  // TODO we should resolve this from the backend, or have a stronger check
  const isGasToken = useCallback(
    (s: string) => s.toLowerCase() === "w" + gasToken.symbol.toLowerCase(),
    [gasToken],
  );

  const { data } = useGraphqlGlobal();
  const tokensData = useFragment(TokensFragment, data?.pools);
  const fusdcData_ = useFragment(FusdcFragment, data?.fusdc);

  const tokens = useMemo(() => {
    const fusdcData = fusdcData_ ? [{ token: fusdcData_ }] : [];
    return [...fusdcData, ...(tokensData ?? [])].reduce(
      (acc, t) => ({
        ...acc,
        [t.token.symbol.toLowerCase()]: {
          ...t.token,
          address: t.token.address as `0x${string}`,
          icon: t.token.image,
          ...(isGasToken(t.token.symbol)
            ? {
                abi: WETH10,
                isGasToken: true as true,
              }
            : {
                abi: LightweightERC20,
                isGasToken: false as false,
              }),
        },
      }),
      {} as { [symbol: string]: Token },
    );
  }, [tokensData, fusdcData_, isGasToken]);
  const isTokens = fusdcData_ && tokensData;

  const DefaultToken = isTokens
    ? Object.values(tokens).find((t) => t.symbol !== "fUSDC")
    : undefined;
  const fUSDC = isTokens
    ? Object.values(tokens).find((t) => t.symbol === "fUSDC")
    : undefined;

  const getTokenFromAddress = useCallback(
    (address: string) =>
      isTokens
        ? Object.values(tokens).find(
            ({ address: _a }) => address.toLowerCase() === _a.toLowerCase(),
          )
        : EmptyToken,
    [isTokens, tokens],
  );

  const getTokenFromSymbol = useCallback(
    (symbol: string) =>
      isTokens
        ? Object.values(tokens).find(
            ({ symbol: _s }) => symbol.toLowerCase() === _s.toLowerCase(),
          )
        : EmptyToken,
    [isTokens, tokens],
  );

  // set default tokens once we load
  useEffect(() => {
    if (DefaultToken && fUSDC) {
      if (swapToken0 === EmptyToken && swapToken1 === EmptyToken) {
        setSwapToken0(fUSDC);
        setSwapToken1(DefaultToken);
      }
      if (stakeToken0 === EmptyToken && stakeToken1 === EmptyToken) {
        setStakeToken0(DefaultToken);
        setStakeToken1(fUSDC);
      }
    }
  }, [
    DefaultToken,
    fUSDC,
    swapToken0,
    swapToken1,
    setSwapToken0,
    setSwapToken1,
    stakeToken0,
    stakeToken1,
    setStakeToken0,
    setStakeToken1,
  ]);

  if (token === "default") return DefaultToken;
  if (token) return getTokenFromSymbol(token);
  return { tokens, DefaultToken, getTokenFromAddress, getTokenFromSymbol };
}
