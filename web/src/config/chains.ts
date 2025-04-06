import z from "zod";
import "wagmi";
import { AppKitNetwork, defineChain } from "@reown/appkit/networks";

const networkSchema = z.object({
  id: z.number(),
  name: z.string(),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  rpcUrls: z.object({
    default: z.object({ http: z.array(z.string()) }),
    public: z.object({ http: z.array(z.string()) }).optional(),
  }),
  blockExplorers: z.object({
    default: z.object({ name: z.string(), url: z.string() }),
  }),
  testnet: z.boolean().optional(),
  contracts: z.any().optional(),
  gqlUrl: z.string().url(),
  // Optional fields
  icon: z.string().optional(),
  icons: z.array(z.string()).optional(),
});

export const superpositionTestnet = defineChain({
  name: "Superposition Testnet",
  id: 98985,
  caipNetworkId: "eip155:98985",
  chainNamespace: "eip155",
  nativeCurrency: { name: "Superposition", symbol: "SPN", decimals: 18 },
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
  gqlUrl: "https://testnet-graph.long.so",
  icon: "/icons/spn-test.svg",
});

export const superpositionMainnet = defineChain({
  name: "Superposition",
  id: 55244,
  caipNetworkId: "eip155:55244",
  chainNamespace: "eip155",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.superposition.so"] },
    public: { http: ["https://rpc.superposition.so"] },
  },
  blockExplorers: {
    default: {
      name: "CatScan",
      url: "https://explorer.superposition.so",
    },
  },
  gqlUrl: "https://graph.long.so",
  icon: "/icons/spn.svg",
});

export const allTestnets = [superpositionTestnet];

export const allMainnets = [superpositionMainnet];

export const allChains = [...allMainnets, ...allTestnets];

declare module "wagmi" {
  function useChainId(): (typeof allChains)[number]["id"];
}

export function useChain(chainId: (typeof allChains)[number]["id"]) {
  return allChains.find((chain) => chain.id === chainId)!;
}

// validate all chains
const chainValidation = z.array(networkSchema).safeParse(allChains);

if (!chainValidation.success) {
  console.error("Invalid chain: ", chainValidation.error.name);
  throw new Error(chainValidation.error.message);
}
