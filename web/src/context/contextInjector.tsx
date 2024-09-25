"use client";

import { useAccount, useChainId } from "wagmi";
import { useEffect } from "react";
import { setContext, setUser } from "@sentry/nextjs";
import appConfig from "@/config";
export default function ContextInjector() {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      //   window.localStorage.setItem("walletAddress", account.address); // this one is going to be needed for GTM
      setUser({ id: account.address });
    } else {
      //   window.localStorage.removeItem("walletAddress");
      setUser(null);
    }
  }, [account?.address]);

  useEffect(() => {
    setContext("version", { commitHash: appConfig.NEXT_PUBLIC_GIT_HASH });
    setContext("chain", { id: account?.chainId });
  }, [account?.chainId]);

  return null;
}
