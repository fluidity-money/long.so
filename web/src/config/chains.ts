import { arbitrumSepolia as baseArbitrumSepolia } from "wagmi/chains";
import z from "zod";
import { defineChain } from "viem";

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
  // Optional fields
  icon: z.string().optional(),
  icons: z.array(z.string()).optional(),
});

export const superpositionTestnet = defineChain({
  name: "Superposition Testnet",
  id: 98985,
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
  icon: "/icons/spn-test.svg",
});

const arbitrumSepolia = {
  ...baseArbitrumSepolia,
  icon: "/icons/ARB.svg",
};

export { arbitrumSepolia };

export const allTestnets = [superpositionTestnet, arbitrumSepolia] as const;

export const allMainnets = [] as const;

export const allChains = [...allTestnets, ...allMainnets] as const;

// validate all chains
const chainValidation = z.array(networkSchema).safeParse(allChains);

if (!chainValidation.success) {
  console.error("Invalid chain: ", chainValidation.error.name);
  throw new Error(chainValidation.error.message);
}
