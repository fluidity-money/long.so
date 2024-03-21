"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { Box, Input, Link, Slider, Text, Token } from "@/components";
import { addressToSymbol } from "@/util/tokens";
import Caret from "@/assets/icons/Caret.svg";
import {
  getFormattedStringFromTokenAmount,
  getTokenAmountFromFormattedString,
} from "@/util/converters";
import { SwapButton } from "@/app/SwapButton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { useActiveTokenStore } from "@/stores/useActiveTokenStore";
import { useAccount, useBalance } from "wagmi";
import { useSwap } from "@/hooks/useSwap";
import { useModalStore } from "@/app/TokenModal";
import { WelcomeGradient } from "@/app/WelcomeGradient";
import { SuperloopPopover } from "@/app/SuperloopPopover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const SwapForm = () => {
  const [inputReceive, setInputReceive] = useState("");

  const [amountIn, setAmountIn] = useState(BigInt(0));
  const [amountInDisplay, setAmountInDisplay] = useState("");
  const [minOut, setMinOut] = useState("");

  const { setWelcome, welcome, hovering } = useWelcomeStore();

  const { token0, token1, decimals0, decimals1, flipTokens } =
    useActiveTokenStore();

  const { address } = useAccount();

  const { data: token0Balance } = useBalance({
    cacheTime: 2000,
    address,
    token: token0,
  });

  const { data: token1Balance } = useBalance({
    cacheTime: 2000,
    address,
    token: token1,
  });

  const { isConnected } = useAccount();

  const { swap, result, resultUsd, error, isLoading, isSwapping } = useSwap({
    amountIn,
    minOut,
  });

  // update output using quoted swap result
  useEffect(() => {
    if (result) {
      const [, outAmount] = result;
      const formattedOutAmount = getFormattedStringFromTokenAmount(
        outAmount.toString(),
        decimals1,
      );
      setInputReceive(formattedOutAmount);
    }
  }, [result, decimals1]);

  // update amountIn when input amount changes
  useEffect(() => {
    try {
      if (!token0Balance?.value) return;
      const amount = getTokenAmountFromFormattedString(
        amountInDisplay,
        decimals0,
      );
      if (amount <= token0Balance.value) setAmountIn(amount);
    } catch {}
  }, [amountInDisplay, token0Balance?.value, decimals0]);

  const setMax = () =>
    setAmountInDisplay(token0Balance?.formatted ?? amountInDisplay);

  const { setActiveModalToken, enabled: activeModalToken } = useModalStore();

  if (activeModalToken) return null;

  return (
    <div className="group z-10 flex flex-col items-center ">
      <WelcomeGradient />

      <motion.div
        // layoutId={"swap-form"}
        className={cn(
          `flex w-full flex-col items-center gap-1 p-4 transition-transform sm:w-[400px] lg:w-[450px]`,
          welcome
            ? cn(
                `cursor-pointer hover:-translate-y-8 hover:blur-0`,
                hovering ? "-translate-y-8 blur-0" : "blur-xs",
              )
            : "",
        )}
        onClick={() => setWelcome(false)}
      >
        {!welcome && <CampaignBanner />}

        <div className="z-10 flex w-full flex-col gap-2">
          <SuperloopPopover />

          <motion.div
            // layoutId="modal"
            className="flex w-full flex-col gap-3 rounded-lg bg-black p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <Text size="small">Swap</Text>
              {/* Placeholder */}
              <Text size="small">${addressToSymbol(token0)}</Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="large">
                <Input
                  placeholder="0.00"
                  value={amountInDisplay}
                  onChange={(s) => setAmountInDisplay(s)}
                />
              </Text>
              <Box
                whileTap={{ scale: 0.98 }}
                outline
                pill
                background="light"
                className="cursor-pointer pr-2"
                onClick={() => setActiveModalToken("token0")}
              >
                <Token />
                {/* Placeholder */}
                <Text weight="semibold">{addressToSymbol(token0)}</Text>
                <Caret />
              </Box>
            </div>
            <div className="flex items-center justify-between">
              {/* Use the actual amountIn so invalid inputs are visible */}
              <Text size="small">
                {getFormattedStringFromTokenAmount(
                  amountIn.toString(),
                  decimals0,
                )}
              </Text>
              <Text size="small">
                Balance: {token0Balance?.formatted}{" "}
                <Link
                  onClick={() => {
                    setMax();
                  }}
                >
                  Max
                </Link>
              </Text>
            </div>
          </motion.div>

          <div className="-my-5 flex w-full flex-row items-center justify-center">
            <SwapButton
              onClick={() => {
                // swap amounts and trigger a quote update
                const amount1 = result?.[1].toString();
                setInputReceive(amountInDisplay);
                setAmountInDisplay(
                  getFormattedStringFromTokenAmount(amount1 || "0", decimals1),
                );
                flipTokens();
              }}
            />
          </div>

          <div className="flex w-full flex-col gap-3 rounded-lg bg-black p-4 text-white">
            <div className="flex items-center justify-between">
              <Text size="small">Receive</Text>
              <Text size="small">${addressToSymbol(token1)}</Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="large">
                <Input
                  placeholder="0.00"
                  value={isLoading ? "..." : inputReceive}
                  disabled={true}
                  onChange={(s) => setInputReceive(s)}
                />
              </Text>
              <Box
                whileTap={{ scale: 0.98 }}
                outline
                pill
                background="light"
                className="cursor-pointer pr-2"
                onClick={() => setActiveModalToken("token1")}
              >
                <Token />
                <Text weight="semibold">{addressToSymbol(token1)}</Text>
                <Caret />
              </Box>
            </div>
            <div className="flex items-center justify-between">
              <Text size="small">{inputReceive}</Text>
              <Text size="small">Balance: {token1Balance?.formatted} </Text>
            </div>
          </div>
        </div>

        {/* only shown on mobile */}
        <div className="w-full md:hidden">
          <Slider
            disabled={!isConnected || isSwapping || isLoading}
            onSlideComplete={() => swap()}
          >
            Swap
          </Slider>
        </div>

        {/* only shown on desktop */}
        <div className="hidden w-full md:inline-flex">
          <Button
            className="w-full"
            size="lg"
            disabled={!isConnected || isSwapping || isLoading}
            onClick={() => swap()}
          >
            Swap
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
