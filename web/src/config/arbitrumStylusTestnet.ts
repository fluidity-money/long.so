import { arbitrumSepolia } from "wagmi/chains";

export const arbitrumStylusTestnet = {
  ...arbitrumSepolia,
  name: "Stylus Testnet",
  id: 23011913,
  // use a self-deployed multicall3 for Stylus Testnet as it doesn't support the standard address
  contracts: {
    multicall3: {
      address: "0x42aaE78422EF3e8E6d0D88e58E25CA7C7Ecb9D5a" as const,
    },
  },
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
