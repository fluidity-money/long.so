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

const tokens: `0x${string}`[] = [
  "0x9A8c1806087f8c4e1315AF7a2AC285334a8275ed",
  "0x65Dfe41220C438Bf069BBce9Eb66B087fe65dB36",
];

const FaucetPage = () => {
  const { writeContract } = useWriteContract();

  const { address } = useAccount();

  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(tokens[0]);

  const onClick = () => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    writeContract({
      address: token,
      functionName: "mint",
      args: [address, BigInt(amount)],
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
            <SelectItem value={tokens[0]}>NEW_TOKEN_1</SelectItem>
            <SelectItem value={tokens[1]}>NEW_TOKEN_2</SelectItem>
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
