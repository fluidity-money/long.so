"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { arbitrumSepolia, mainnet } from "wagmi/chains";
import { http } from "viem";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// const multicall3AddressString = "";
// if (!multicall3AddressString || !isHex(multicall3AddressString))
//   throw new Error(
//     `Multicall3 address from env was not a valid address! Was ${multicall3AddressString}`,
//   );
// const multicall3Address = multicall3AddressString;

const arbitrumStylusTestnet = {
  ...arbitrumSepolia,
  name: "Stylus Testnet",
  id: 23011913,
  // use a self-deployed multicall3 for Stylus Testnet as it doesn't support the standard address
  // contracts: { multicall3: { address: multicall3Address } },
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
};

// Create wagmiConfig
const chains = [mainnet, arbitrumStylusTestnet] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  transports: {
    [arbitrumStylusTestnet.id]: http("https://stylus-testnet.arbitrum.io/rpc"),
  },
  metadata,
  ssr: true,
});
