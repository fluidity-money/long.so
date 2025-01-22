"use client";
import { EVENTS, track } from "@/lib/analytics";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";

export const WalletConnectionStatus = () => {
  const chainId = useChainId();
  const { status, connector } = useAccount();
  const [previous, setPrevious] = useState(status);
  useEffect(() => {
    if (previous === "connecting" && status === "connected") {
      track(EVENTS.WALLET_CONNECTED, {
        wallet_name: connector?.name ?? "Unknown",
        chain_id: chainId,
      });
    }
    setPrevious(status);
  }, [previous, status, connector, chainId]);
  return <></>;
};
