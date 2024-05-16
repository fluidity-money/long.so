import { arbitrumSepolia } from "wagmi/chains";

export const arbitrumStylusTestnet = {
  name: "Conduit Stylus 2 Testnet",
  id: 1111281,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  // use a self-deployed multicall3 for Conduit Stylus V2 as it doesn't support the standard address
  contracts: {
    multicall3: {
      address: "0x21329A8bF996f5112a4DCDfE0785C043F56CcF7B" as const,
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
