import { arbitrumSepolia as sepoliaTestnet } from "wagmi/chains";
import z from "zod";

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

export const arbitrumStylusTestnet = networkSchema.parse({
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
});

export { sepoliaTestnet };

const networkValidation = z
  .array(networkSchema)
  .safeParse([arbitrumStylusTestnet, sepoliaTestnet]);

if (!networkValidation.success) {
  console.error("Invalid networks: ", networkValidation.error.name);
  throw new Error(networkValidation.error.message);
}
