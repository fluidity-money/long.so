import { arbitrumSepolia } from "wagmi/chains";

export const arbitrumStylusTestnet = {
  name: "Superposition Testnet",
  id: 98985,
  nativeCurrency: { name: "Superposition", symbol: "SPN", decimals: 18 },
  contracts: {
    multicall3: {
      address: "0x37Bc0f77FCf51318B2ceb9447002913f7CFb599d" as const,
    },
  },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.superposition.so"] },
    public: { http: ["https://testnet-rpc.superposition.so"] },
  },
  blockExplorers: {
    default: {
      name: "CatScan",
      url: "https://testnet-explorer.superposition.so",
    },
  },
};
