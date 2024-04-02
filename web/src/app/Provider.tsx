"use client";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrumSepolia, localhost } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { isHex } from "viem";
import "./globals.css";

const multicall3AddressString = process.env.NEXT_PUBLIC_MULTICALL3_ADDRESS;
if (!multicall3AddressString || !isHex(multicall3AddressString))
  throw new Error(
    `Multicall3 address from env was not a valid address! Was ${multicall3AddressString}`,
  );

const { publicClient, webSocketPublicClient } =
  process.env.NODE_ENV === "development"
    ? configureChains(
        [{ ...localhost, id: 412346 }],
        [
          jsonRpcProvider({
            rpc: () => ({
              http: "http://localhost:8547",
            }),
          }),
        ],
      )
    : configureChains(
        [
          {
            // Stylus Testnet is based off of Arbitrum Sepolia
            ...arbitrumSepolia,
            name: "Stylus Testnet",
            id: 23011913,
            // use a self-deployed multicall3 for Stylus Testnet as it doesn't support the standard address
            contracts: { multicall3: { address: multicall3AddressString } },
            rpcUrls: {
              default: { http: ["https://stylus-testnet.arbitrum.io/rpc"] },
              public: { http: ["https://stylus-testnet.arbitrum.io/rpc"] },
            },
            blockExplorers: {
              default: {
                name: "Arbiscan",
                url: "https://stylus-testnet-explorer.arbitrum.io/",
              },
            },
          },
        ],
        [
          jsonRpcProvider({
            rpc: () => ({
              http: "https://stylus-testnet.arbitrum.io/rpc",
            }),
          }),
        ],
      );

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector()],
  publicClient,
  webSocketPublicClient,
});

const ammAddressString = process.env.NEXT_PUBLIC_AMM_ADDRESS;
if (!ammAddressString || !isHex(ammAddressString))
  throw new Error(
    `AMM address from env was not a valid address! Was ${ammAddressString}`,
  );
const ammAddress = ammAddressString;

export function Provider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
