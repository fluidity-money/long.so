"use client";

import { useCallback, useState } from "react";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { output as faucet } from "@/lib/abi/IFaucet";
import { faucetAddress } from "@/lib/addresses";
import { erc20Abi, Hash } from "viem";

const FaucetPage = () => {
  const { writeContract } = useWriteContract();

  const { address } = useAccount();

  const { data: isStakerData } = useSimulateContract({
    address: faucetAddress,
    abi: faucet.abi,
    // @ts-expect-error
    functionName: "isMember",
    args: [address as Hash],
  });

  const isStaker = isStakerData && isStakerData.result;

  const onClick = useCallback(async () => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    const hash = await writeContract({
      address: faucetAddress,
      abi: faucet.abi,
      functionName: "claimAmount",
      args: [],
    });

    console.log("claim amount requested with hash", hash);
  }, [address, faucetAddress]);

  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={
          "flex w-[400px] flex-col items-center gap-[10px] rounded-lg bg-black p-[15px] text-white"
        }
      >
        <h1 className={"w-full text-xs"}>Faucet</h1>
        <p>Request a random amount of test tokens ($FLY stakers only)</p>
        <img src="https://static.long.so/fly-stakers.jpg" />
        <Button className={"w-full"} variant={"secondary"} onClick={onClick} disabled={!isStaker}>
          Request
        </Button>
      </div>
    </div>
  );
};

export default FaucetPage;
