import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter } from "@/config/wagmi";
import config from "@/config";
import {
  cookieToInitialState,
  WagmiProvider as WagmiBaseProvider,
} from "wagmi";
import React from "react";

createAppKit({
  adapters: [wagmiAdapter],
  projectId: config.NEXT_PUBLIC_LONGTAIL_WALLETCONNECT_PROJECT_ID,
  networks: [
    config.chains.superpositionMainnet,
    config.chains.superpositionTestnet,
  ],
  defaultNetwork: config.chains.superpositionMainnet,
  metadata: config.metadata,
  features: {
    analytics: true,
  },
});
export default function WagmiProvider({
  children,
  cookies,
}: {
  cookies: string | null;
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config.wagmiConfig, cookies);

  return (
    <WagmiBaseProvider config={config.wagmiConfig} initialState={initialState}>
      {children}
    </WagmiBaseProvider>
  );
}
