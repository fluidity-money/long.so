"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "./ERC20mintable";
import { useState } from "react";
import { tokens } from "@/config/tokens";

const FaucetPage = () => {
  const { writeContract } = useWriteContract();

  const { address } = useAccount();

  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(tokens[0].address);

  const onClick = () => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    writeContract({
      address: token,
      functionName: "mint",
      args: [address, BigInt(parseFloat(amount) * 10 ** 18)],
      abi: abi,
    });
  };

  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={
          "flex w-[400px] flex-col items-center gap-[10px] rounded-lg bg-black p-[15px] text-white"
        }
      >
        <h1 className={"w-full text-xs"}>Faucet</h1>
        <p>Request some test tokens</p>
        <Select
          value={token}
          onValueChange={(val) => setToken(val as `0x${string}`)}
        >
          <SelectTrigger className="w-full text-black">
            <SelectValue placeholder="Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={tokens[0].address}>{tokens[0].name}</SelectItem>
            <SelectItem value={tokens[1].address}>{tokens[1].name}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder={"Amount"}
          className={"text-black"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button className={"w-full"} variant={"secondary"} onClick={onClick}>
          Request
        </Button>
      </div>
    </div>
  );
};

export default FaucetPage;
