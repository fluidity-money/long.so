"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { setTag, setUser } from "@sentry/nextjs";
export default function ContextInjector() {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      window.localStorage.setItem("walletAddress", account.address);
      setUser({ id: account.address });
    } else {
      window.localStorage.removeItem("walletAddress");
      setUser(null);
    }
  }, [account?.address]);

  useEffect(() => {
    setTag("chainId", account?.chainId);
  }, [account?.chainId]);

  return null;
}
