"use client";

import { WelcomeGradient } from "@/app/WelcomeGradient";
import { CampaignBanner } from "@/components/CampaignBanner";
import Gas from "@/assets/icons/gas.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Token from "@/assets/icons/token.svg";
import Swap from "@/assets/icons/Swap.svg";
import ArrowDown from "@/assets/icons/arrow-down-white.svg";
import { SuperloopPopover } from "@/app/SuperloopPopover";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { sqrtPriceX96ToPrice } from "@/lib/math";
import { motion } from "framer-motion";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import Link from "next/link";
import { useSwapStore } from "@/stores/useSwapStore";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { erc20Abi, Hash, maxUint256 } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import LightweightERC20 from "@/lib/abi/LightweightERC20";
import { ammAddress } from "@/lib/addresses";
import { output as seawaterContract } from "@/lib/abi/ISeawaterAMM";
import { fUSDC } from "@/config/tokens";
import { EnableSpending } from "@/components/sequence/EnableSpending";
import Confirm from "@/components/sequence/Confirm";
import { Success } from "@/components/sequence/Success";
import { Fail } from "@/components/sequence/Fail";
import { LoaderIcon } from "lucide-react";
import { graphql, useFragment } from "@/gql";
import { useGraphqlGlobal } from "@/hooks/useGraphql";
import { usdFormat } from "@/lib/usdFormat";
import { useToast } from "@/components/ui/use-toast";

const SwapFormFragment = graphql(`
  fragment SwapFormFragment on SeawaterPool {
    address
    earnedFeesAPRFUSDC
    earnedFeesAPRToken1
    token {
      address
      decimals
      name
      symbol
    }
  }
`);

export const SwapForm = () => {
  const [breakdownHidden, setBreakdownHidden] = useState(true);

  const { setWelcome, welcome, hovering, setHovering } = useWelcomeStore();

  const toast = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const showSuperloopPopover = useFeatureFlag("ui show superloop");
  const showCampaignBanner = useFeatureFlag("ui show campaign banner");
  const showMockData = useFeatureFlag("ui show demo data");

  useEffect(() => {
    if (!welcome) {
      inputRef.current?.focus();
    }
  }, [welcome]);

  const {
    token0,
    token1,
    flipTokens,
    token0Amount,
    token0AmountRaw,
    token1Amount,
    setToken0Amount,
    setToken0AmountRaw,
    setToken1AmountRaw,
  } = useSwapStore();
  const { data } = useGraphqlGlobal();

  const poolsData = useFragment(SwapFormFragment, data?.pools);

  const poolData = useMemo(() => {
    // find the pool containing token0 or token1
    return poolsData?.find((pool) => {
      return (
        pool.token.address === token0.address ||
        pool.token.address === token1.address
      );
    });
  }, [poolsData, token0.address, token1.address]);

  const { address } = useAccount();

  // the user is currently swapping the "base" asset, the fUSDC
  // asset, into the other.
  const isSwappingBaseAsset = token0.address === fUSDC.address;

  // the user is currently swapping between fUSDC and another asset, in either direction.
  const isSwap1 = isSwappingBaseAsset || token1.address === fUSDC.address;

  // the pool currently in use's price
  const poolAddress = isSwappingBaseAsset ? token1!.address : token0.address;

  // price of the current pool
  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammAddress,
    abi: seawaterContract.abi,
    functionName: "sqrtPriceX96",
    args: [poolAddress],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result)
    : 0n;

  // token0 hooks
  const { data: token0Decimals /* error */ } = useSimulateContract({
    address: token0.address,
    abi: erc20Abi,
    // @ts-expect-error
    functionName: "decimals",
  });

  const { data: token0Balance } = useSimulateContract({
    address: token0.address,
    abi: erc20Abi,
    // @ts-expect-error I don't know why but this needs to use useSimulateContract instead of useReadContract which breaks all the types
    functionName: "balanceOf",
    // @ts-expect-error
    args: [address as Hash],
  });

  // token1 hooks
  const { data: token1Decimals } = useSimulateContract({
    address: token1.address,
    abi: erc20Abi,
    // @ts-expect-error
    functionName: "decimals",
  });

  const { data: token1Balance } = useSimulateContract({
    address: token1.address,
    abi: erc20Abi,
    // @ts-expect-error
    functionName: "balanceOf",
    // @ts-expect-error
    args: [address as Hash],
  });

  const { error: quote1Error, isLoading: quote1IsLoading } =
    useSimulateContract({
      address: ammAddress,
      abi: seawaterContract.abi,
      functionName: "quote",
      args: [
        poolAddress,
        token1.address === fUSDC.address,
        BigInt(token0AmountRaw ?? 0),
        maxUint256,
      ],
      // since this is intended to throw an error, we want to disable retries
      query: {
        retry: false,
        retryOnMount: false,
      },
    });

  const { error: quote2Error, isLoading: quote2IsLoading } =
    useSimulateContract({
      address: ammAddress,
      abi: seawaterContract.abi,
      functionName: "quote2",
      args: [
        token0.address,
        token1.address,
        BigInt(token0AmountRaw ?? 0),
        // TODO minout
        0n,
      ],
      // since this is intended to throw an error, we want to disable retries
      query: {
        retry: false,
        retryOnMount: false,
      },
    });

  /**
   * Parse the quote amount from the error message
   */
  const [quoteAmount, quoteIsLoading] = useMemo(() => {
    const quoteError = isSwap1 ? quote1Error : quote2Error
    const quoteIsLoading = isSwap1 ? quote1IsLoading : quote2IsLoading
    const [, quoteAmountString] =
      quoteError?.message.match(
        /reverted with the following reason:\n(.+)\n/,
      ) || [];

    return [BigInt(quoteAmountString ?? 0), quoteIsLoading];
  }, [isSwap1, quote1Error, quote1IsLoading, quote2Error, quote2IsLoading]);

  // update the token1 amount when the quote amount changes
  useEffect(() => {
    setToken1AmountRaw(quoteAmount.toString());
  }, [quoteAmount, setToken1AmountRaw]);

   const setMaxBalance = () =>
     setToken0AmountRaw(token0Balance?.toString() ?? token0Amount ?? "0")

  const { open } = useWeb3Modal();

  // read the allowance of the token
  const { data: allowanceData } = useSimulateContract({
    address: token0.address,
    abi: LightweightERC20,
    // @ts-ignore this needs to use useSimulateContract which breaks the types
    functionName: "allowance",
    // @ts-ignore
    args: [address as Hash, ammAddress],
  });

  // set up write hooks
  const {
    writeContract: writeContractApproval,
    data: approvalData,
    error: approvalError,
    isPending: isApprovalPending,
    reset: resetApproval,
  } = useWriteContract();
  const {
    writeContract: writeContractSwap,
    data: swapData,
    error: swapError,
    isPending: isSwapPending,
    reset: resetSwap,
  } = useWriteContract();

  /**
   * Approve the AMM to spend the token
   *
   * Step 1.
   */
  const onSubmit = () => {
    if (!token0Amount || token0Amount === "") {
      toast.toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount",
      });
      return;
    }

    if (!allowanceData?.result || allowanceData.result === BigInt(0)) {
      console.log("approving");
      writeContractApproval({
        address: token0.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [ammAddress, maxUint256],
      });
    } else {
      performSwap();
    }
  };

  // wait for the approval transaction to complete
  const approvalResult = useWaitForTransactionReceipt({
    hash: approvalData,
  });

  const performSwap = useCallback(() => {
    console.log("performing swap");

    // if one of the assets is fusdc, use swap1
    if (isSwappingBaseAsset) {
      writeContractSwap({
        address: ammAddress,
        abi: seawaterContract.abi,
        functionName: "swap",
        args: [token1.address, false, BigInt(token0AmountRaw ?? 0), maxUint256],
      });
    } else if (token1.address === fUSDC.address) {
      writeContractSwap({
        address: ammAddress,
        abi: seawaterContract.abi,
        functionName: "swap",
        args: [token0.address, true, BigInt(token0AmountRaw ?? 0), maxUint256],
      });
    } else {
      // if both of the assets aren't fusdc, use swap2
      writeContractSwap({
        address: ammAddress,
        abi: seawaterContract.abi,
        functionName: "swap2ExactIn",
        args: [
          token0.address,
          token1.address,
          BigInt(token0AmountRaw ?? 0),
          BigInt(0),
        ],
      });
    }
  }, [
    token0Amount,
    token0.address,
    token1.address,
    writeContractSwap,
    isSwappingBaseAsset,
  ]);

  const swapResult = useWaitForTransactionReceipt({
    hash: swapData,
  });

  // once we have the result, initiate the swap
  useEffect(() => {
    if (!approvalResult.data) return;
    performSwap();
  }, [approvalResult.data, performSwap]);

  if (isApprovalPending || (approvalData && !approvalResult.data)) {
    return (
      <EnableSpending
        tokenName={token0.symbol}
        transactionHash={approvalData}
      />
    );
  }

  if (isSwapPending || (swapData && !swapResult.data)) {
    return <Confirm
      text={"Swap"}
      fromAsset={{symbol: token0.symbol, amount: token0Amount ?? "0"}}
      toAsset={{symbol: token1.symbol, amount: token1Amount ?? "0"}}
      />;
  }

  // success
  if (swapResult.data) {
    return (
      <Success
        onDone={() => {
          resetApproval();
          resetSwap();
          swapResult.refetch();
        }}
      />
    );
  }

  // error
  if (swapError || approvalError) {
    const error = swapError || approvalError;
    return (
      <Fail
        text={(error as any)?.shortMessage}
        onDone={() => {
          resetApproval();
          resetSwap();
          swapResult.refetch();
        }}
      />
    );
  }

  return (
    <>
      <WelcomeGradient />

      <motion.div
        variants={{
          default: {
            y: 0,
            filter: "blur(0px)",
          },
          hovering: {
            y: -10,
            filter: "blur(0px)",
          },
          notHovering: {
            filter: "blur(2px)",
          },
        }}
        initial={"notHovering"}
        animate={welcome ? (hovering ? "hovering" : "notHovering") : "default"}
        className={cn("group z-10 flex flex-col items-center", {
          "cursor-pointer": welcome,
        })}
        onClick={() => setWelcome(false)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className={"flex w-[317px] flex-col items-center md:w-[392.42px]"}>
          <motion.div
            className={"w-full"}
            initial={"hidden"}
            variants={{
              hidden: {
                opacity: 0,
                y: 10,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            animate={welcome ? "hidden" : "visible"}
          >
            {showCampaignBanner && <CampaignBanner />}
          </motion.div>

          <motion.div
            layoutId={"modal"}
            className="relative mt-[19px] h-[102px] w-[317px] rounded-lg bg-black pb-[19px] pl-[21px] pr-[15px] pt-[17px] text-white md:h-[126.37px] md:w-[392.42px] md:pb-[25px] md:pl-[25px] md:pr-[20px] md:pt-[22px]"
          >
            {showSuperloopPopover ? <SuperloopPopover /> : <></>}

            <motion.div
              layout
              className={"flex h-full flex-col justify-between"}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-[8px] md:text-[10px]"}>Swap</div>

                <div className={"text-[8px] md:text-[10px]"}>{token0.name}</div>
              </div>

              <div className={"flex flex-row items-center justify-between"}>
                <Input
                  ref={inputRef}
                  className="-ml-2 border-0 bg-black pl-2 text-2xl"
                  variant={"no-ring"}
                  placeholder={welcome ? "1024.82" : undefined}
                  value={token0Amount}
                  onChange={(e) => setToken0Amount(e.target.value, (token0Balance?.result as unknown as bigint).toString())}
                />

                <Link href={"/swap/explore?token=0"}>
                  <Badge
                    variant="outline"
                    className="flex h-[26px] cursor-pointer flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:pl-[4px] md:text-base"
                  >
                    <Token className="size-[20px] md:size-[25px]" />
                    <div>{token0.symbol}</div>
                    <ArrowDown className="ml-1 h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
                  </Badge>
                </Link>
              </div>

              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-[10px] text-zinc-400"}>
                  ${token0.address === fUSDC.address ? "1" : tokenPrice.toString()}
                </div>

                <div
                  className={
                    "flex flex-row gap-[17px] text-[8px] md:text-[10px]"
                  }
                >
                  {token0Balance && token0Decimals && (
                    <div>
                      Balance:{" "}
                      {(
                        (token0Balance.result as unknown as bigint) /
                        BigInt(10 ** token0Decimals.result)
                      ).toString()}
                    </div>
                  )}
                  <div onClick={setMaxBalance} className={"cursor-pointer underline"}>Max</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={"flex flex-col items-center"}
            initial={welcome ? "visible" : "hidden"}
            exit={"hidden"}
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            animate={"visible"}
          >
            <Button
              variant={"secondary"}
              className={
                "z-50 mt-[-12px] size-[32px] p-0 transition-all hover:rounded-[20px] hover:bg-white md:mt-[-15px] md:size-[40px]"
              }
              onClick={flipTokens}
            >
              <Swap />
            </Button>

            <div className="mt-[-12px] flex h-[102px] w-[317px] flex-col justify-between rounded-lg bg-black pb-[19px] pl-[21px] pr-[15px] pt-[17px] text-white md:mt-[-15px] md:h-[126.37px] md:w-[392.42px] md:pl-[25px] md:pr-[20px] md:pt-[22px]">
              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-[8px] md:text-[10px]"}>Receive</div>

                <div className={"text-[8px] md:text-[10px]"}>{token1.name}</div>
              </div>

              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-2xl"}>
                  {quoteIsLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    token1Amount
                  )}
                </div>

                <Link href={"/swap/explore?token=1"}>
                  <Badge
                    variant="outline"
                    className="flex h-[26px] cursor-pointer flex-row justify-between pl-0.5 pr-1 text-white md:h-[33px] md:pl-[4px] md:text-base"
                  >
                    <Token className="size-[20px] md:size-[25px]" />
                    <div>{token1.symbol}</div>
                    <ArrowDown className="ml-1 h-[5.22px] w-[9.19px] md:h-[6.46px] md:w-[11.38px]" />
                  </Badge>
                </Link>
              </div>

              <div className={"flex flex-row items-center justify-between"}>
                <div className={"text-[10px] text-zinc-400"}>
                  ${token1.address === fUSDC.address ? "1" : tokenPrice.toString()}
                </div>

                <div
                  className={
                    "flex flex-row gap-[17px] text-[8px] md:text-[10px]"
                  }
                >
                  {token1Balance && token1Decimals && (
                    <div>
                      Balance:{" "}
                      {(
                        (token1Balance.result as unknown as bigint) /
                        BigInt(10 ** token1Decimals.result)
                      ).toString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={
                "mt-[12px] flex w-full flex-row items-center justify-between"
              }
            >
              <div
                className={cn(
                  "flex flex-row items-center gap-1 text-[10px] md:text-[12px]",
                  {
                    hidden: !breakdownHidden,
                  },
                )}
              >
                <Gas />
                <div>$3.40</div>
              </div>

              <div
                className={cn("text-[10px] md:text-[12px]", {
                  hidden: breakdownHidden,
                })}
              >
                {token0Amount} {token0.symbol} = {quoteIsLoading ? "??" : token1Amount} {token1.symbol}
              </div>

              <div className={"cursor-pointer text-[10px] md:text-[12px]"}>
                <div
                  onClick={() => setBreakdownHidden((v) => !v)}
                  className="flex cursor-pointer flex-row"
                >
                  {breakdownHidden ? (
                    <>
                      <div className="underline">See breakdown</div>
                      <div className="ml-1">{"->"}</div>
                    </>
                  ) : (
                    <>
                      <div className="underline">Hide breakdown</div>
                      <div className="ml-1 rotate-90">{"<-"}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "flex h-[75px] h-auto w-full flex-col gap-[7px] overflow-hidden text-[10px] transition-all",
                {
                  "h-0": breakdownHidden,
                  "mt-[7px]": !breakdownHidden,
                },
              )}
            >
              <div className={"flex flex-row justify-between"}>
                <div>Fees</div>
                <div className={"flex flex-row items-center gap-1"}>
                  <Gas /> $0.10
                </div>
              </div>
              <div className={"flex flex-row justify-between"}>
                <div>Rewards</div>
                <Badge className="h-[17px] px-1 text-2xs font-normal">
                  <Token />
                  <Token className={"-ml-1"} />
                  <Token className={"-ml-1 mr-1"} />
                  <div className="iridescent-text">
                    {showMockData
                      ? "$6.11 - $33.12"
                      : `${usdFormat(parseFloat(poolData?.earnedFeesAPRFUSDC[0] ?? "0") ?? 0)} - ${usdFormat(parseFloat(poolData?.earnedFeesAPRFUSDC[1] ?? "0") ?? 0)}`}
                  </div>
                </Badge>
              </div>

              <div className="flex flex-row justify-between">
                <div>Route</div>
                <div>Super Route</div>
              </div>
            </div>

            <Badge
              className={cn(
                "shine mt-[15px] h-[27px] w-full pl-1.5 md:h-[31px]",
                {
                  hidden: !breakdownHidden,
                },
              )}
            >
              <Token className={"size-[20px]"} />
              <Token className={"-ml-2 size-[20px]"} />
              <Token className={"-ml-2 mr-2 size-[20px]"} />

              <div className={"iridescent-text text-[12px] md:text-[14px]"}>
                Earn up-to $100 for making this trade!
              </div>
            </Badge>

            <div
              className={cn(
                "mt-[15px] h-[140px] w-[317px] rounded-lg bg-black px-[15px] py-[17px] text-white md:mt-[22px] md:h-[140px] md:w-[393px]",
                {
                  hidden: breakdownHidden,
                },
              )}
            >
              <div className={"text-[12px]"}>Rewards Breakdown</div>
              <div className={"mt-[10px] flex flex-col gap-[4px] "}>
                <div className={"flex flex-row justify-between text-[10px]"}>
                  <div>Fluid Rewards</div>
                  <div
                    className={
                      "iridescent-text flex flex-row items-center gap-1"
                    }
                  >
                    <Token />
                    <div>$0 - $21.72</div>
                  </div>
                </div>
                <div className={"flex flex-row justify-between text-[10px]"}>
                  <div>Trader Rewards</div>
                  <div
                    className={
                      "iridescent-text flex flex-row items-center gap-1"
                    }
                  >
                    <Token />
                    <div>$5.91 - $8.34</div>
                  </div>
                </div>
                <div className={"flex flex-row justify-between text-[10px]"}>
                  <div>Super Rewards</div>
                  <div
                    className={
                      "iridescent-text flex flex-row items-center gap-1"
                    }
                  >
                    <Token />
                    <Token className={"-ml-2"} />
                    <div>$0.20 - $13.06</div>
                  </div>
                </div>
              </div>
              <div
                className={
                  "mt-[10px] flex flex-row items-center justify-between text-[10px]"
                }
              >
                <div className={"font-semibold"}>Total</div>
                <Badge
                  variant="iridescent"
                  className="h-[17px] px-1 text-2xs font-normal"
                >
                  <Token />
                  <Token className={"-ml-1"} />
                  <Token className={"-ml-1 mr-1"} />
                  <div>$6.11 - $33.12</div>
                </Badge>
              </div>
            </div>

            {address ? (
              <Button
                className={"mt-[20px] hidden h-[53.92px] w-full md:inline-flex"}
                onClick={() => onSubmit()}
              >
                Swap
              </Button>
            ) : (
              <Button
                className={"mt-[20px] hidden h-[53.92px] w-full md:inline-flex"}
                onClick={() => open()}
              >
                Connect Wallet
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
