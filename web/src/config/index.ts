"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet } from "wagmi/chains";
import { http } from "viem";
import { arbitrumStylusTestnet } from "./arbitrumStylusTestnet";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Superposition",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [mainnet, arbitrumStylusTestnet] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  transports: {
    [arbitrumStylusTestnet.id]: http("https://stylus-testnet.arbitrum.io/rpc"),
    [mainnet.id]: http(
      "https://eth-mainnet.g.alchemy.com/v2/3NSSPOypXp4eykuGGlJ8W3FeCi9RXU_X",
    ),
  },
  metadata,
  ssr: true,
});
