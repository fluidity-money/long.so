import { arbitrumSepolia } from "wagmi/chains";

export const arbitrumStylusTestnet = {
  name: "Superposition Testnet",
  id: 98985,
  nativeCurrency: { name: "Superposition", symbol: "SPN", decimals: 18 },
  contracts: {
    multicall3: {
      address: "0x69B6eb359E3f9CE04078B96249aFceA1809A350f" as const,
    },
  },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.superposition.so"] },
    public: { http: ["https://testnet-rpc.superposition.so"] },
  },
  blockExplorers: {
    default: {
      name: "CatScan",
      url: "https://testnet-explorer.superpositionso",
    },
  },
};
