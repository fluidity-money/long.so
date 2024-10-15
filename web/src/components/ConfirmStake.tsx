"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useStakeStore } from "@/stores/useStakeStore";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";
import { motion } from "framer-motion";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import useWriteContract from "@/fixtures/wagmi/useWriteContract";
import {
  sqrtPriceX96ToPrice,
  getLiquidityForAmounts,
  snapTickToSpacing,
} from "@/lib/math";
import { useEffect, useCallback, useMemo } from "react";
import { Hash, hexToBigInt } from "viem";
import Confirm from "@/components/sequence/Confirm";
import { EnableSpending } from "@/components/sequence/EnableSpending";
import { Fail } from "@/components/sequence/Fail";
import { Success } from "@/components/sequence/Success";
import {
  getFormattedPriceFromAmount,
  getUsdTokenAmountsForPosition,
} from "@/lib/amounts";
import { getTokenFromAddress, useTokens } from "@/config/tokens";
import { useContracts } from "@/config/contracts";
import { TokenIcon } from "./TokenIcon";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { usePositions } from "@/hooks/usePostions";
import { superpositionTestnet } from "@/config/chains";

type ConfirmStakeProps =
  | {
      mode: "new";
      // vesting represents a change in vesting state
      // for a new position it is true if it should be vested
      // for an existing position it is true if it is already vested
      vesting: boolean;
      positionId?: never;
    }
  | {
      mode: "existing";
      // vesting represents a change in vesting state
      // for a new position it is true if it should be vested
      // for an existing position it is true if it is already vested
      vesting: boolean;
      positionId: number;
    };

export const ConfirmStake = ({
  mode,
  positionId,
  vesting,
}: ConfirmStakeProps) => {
  const router = useRouter();

  const isVesting = mode === "new" && vesting;
  const isVested = mode === "existing" && vesting;

  const { address, chainId } = useAccount();
  const expectedChainId = useChainId();
  const fUSDC = useTokens(expectedChainId, "fusdc");
  const ammContract = useContracts(expectedChainId, "amm");
  const leoContract = useContracts(expectedChainId, "leo");
  const ownershipNFTContract = useContracts(expectedChainId, "ownershipNFTs");
  const showBoostIncentives = useFeatureFlag("ui show boost incentives");
  const showStakeApy = useFeatureFlag("ui show stake apy");

  const showLeo =
    useFeatureFlag("ui show leo") && chainId === superpositionTestnet.id;
  const isDivesting = showLeo && isVested;

  useEffect(() => {
    if (!address || chainId !== expectedChainId) router.back();
  }, [address, expectedChainId, chainId, router]);

  const {
    token0,
    token1,
    token0Amount,
    token0AmountRaw,
    token1Amount,
    token1AmountRaw,
    tickLower,
    tickUpper,
    multiSingleToken,
    feePercentage,
  } = useStakeStore();

  const { updatePositionLocal } = usePositions();

  // Price of the current pool
  const { data: poolSqrtPriceX96 } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "sqrtPriceX967B8F5FC5",
    args: [token0.address],
  });

  const tokenPrice = poolSqrtPriceX96
    ? sqrtPriceX96ToPrice(poolSqrtPriceX96.result, token0.decimals)
    : 0n;

  // if no token or no token amount redirect to the stake form
  useEffect(() => {
    if (token0 && token0Amount) return;

    router.push("/stake/pool/create");
  }, [router, token0, token0Amount]);

  // read the allowance of the token
  const { data: allowanceDataToken0 } = useSimulateContract({
    address: token0.address,
    abi: getTokenFromAddress(expectedChainId, token0.address)?.abi,
    // @ts-ignore this needs to use useSimulateContract which breaks the types
    functionName: "allowance",
    // @ts-ignore
    args: [address as Hash, ammContract.address],
  });

  const { data: allowanceDataToken1 } = useSimulateContract({
    address: token1.address,
    abi: getTokenFromAddress(expectedChainId, token1.address)?.abi,
    // @ts-ignore this needs to use useSimulateContract which breaks the types
    functionName: "allowance",
    // @ts-ignore
    args: [address as Hash, ammContract.address],
  });

  // Current tick of the pool
  const { data: curTickNum } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "curTick181C6FD9",
    args: [token0.address],
  });
  const curTick = useMemo(
    () => ({
      result: BigInt(curTickNum?.result ?? 0),
    }),
    [curTickNum],
  );

  const { data: tickSpacing } = useSimulateContract({
    address: ammContract.address,
    abi: ammContract.abi,
    functionName: "tickSpacing653FE28F",
    args: [token0.address],
  });

  // set up write contract hooks
  const {
    writeContractAsync: writeContractMint,
    data: mintData,
    error: mintError,
    isPending: isMintPending,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractApprovalToken0,
    data: approvalDataToken0,
    error: approvalErrorToken0,
    isPending: isApprovalPendingToken0,
    reset: resetApproveToken0,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractApprovalToken1,
    data: approvalDataToken1,
    error: approvalErrorToken1,
    isPending: isApprovalPendingToken1,
    reset: resetApproveToken1,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractIncrPosition,
    data: incrPositionData,
    error: incrPositionError,
    isPending: isIncrPositionPending,
    reset: resetIncrPosition,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractVestPosition,
    data: vestPositionData,
    error: vestPositionError,
    isPending: isVestPositionPending,
    reset: resetVestPosition,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractDivestPosition,
    data: divestPositionData,
    error: divestPositionError,
    isPending: isDivestPositionPending,
    reset: resetDivestPosition,
  } = useWriteContract();
  const {
    writeContractAsync: writeContractApproveOwnershipNFT,
    data: approveOwnershipNFTData,
    error: approveOwnershipNFTError,
    isPending: isApproveOwnershipNFTPending,
    reset: resetApproveOwnershipNFT,
  } = useWriteContract();

  const divestPositionResult = useWaitForTransactionReceipt({
    hash: divestPositionData,
  });

  const vestPositionResult = useWaitForTransactionReceipt({
    hash: vestPositionData,
  });

  /**
   * Create a new position in the AMM.
   *
   * Step 1. Mint a new position
   */
  const createPosition = () => {
    if (
      tickLower === undefined ||
      tickUpper === undefined ||
      tickLower >= tickUpper ||
      !tickSpacing
    )
      return;

    const { result: spacing } = tickSpacing;

    // snap ticks to spacing
    const lower = snapTickToSpacing(tickLower, spacing);
    const upper = snapTickToSpacing(tickUpper, spacing);

    if (isNaN(lower) || isNaN(upper)) return;

    writeContractMint({
      address: ammContract.address,
      abi: ammContract.abi,
      functionName: "mintPositionBC5B086D",
      args: [token0.address, lower, upper],
    });
  };

  const usdTokenOPrice = getFormattedPriceFromAmount(
    token0Amount,
    tokenPrice,
    fUSDC.decimals,
  );

  const usdTokenOPriceWReward =
    getFormattedPriceFromAmount(token0Amount, tokenPrice, fUSDC.decimals) +
    Number(token1Amount);

  // wait for the mintPosition transaction to complete
  const result = useWaitForTransactionReceipt({
    hash: mintData,
  });

  // extract the position ID from the mintPosition transaction
  const mintPositionId = result?.data?.logs[0].topics[1];

  // divest if already vested before updating
  const divestPosition = useCallback(
    (id: bigint) => {
      writeContractDivestPosition({
        address: leoContract.address,
        abi: leoContract.abi,
        functionName: "divestPosition",
        args: [token0.address, BigInt(id ?? 0)],
      });
    },
    [writeContractDivestPosition, token0, leoContract.address, leoContract.abi],
  );

  const incrPosition = useCallback(
    (id: bigint) => {
      const amount0 = BigInt(token0AmountRaw);
      const amount1 = BigInt(token1AmountRaw);
      // amount0 - 33%
      const amount0Min = amount0 - amount0 / 3n;
      // amount1 - 33%
      const amount1Min = amount1 - amount1 / 3n;
      // amount0 - 5%
      const amount0Desired = amount0 - amount0 / 20n;
      // amount1 - 5%
      const amount1Desired = amount1 - amount1 / 20n;
      writeContractIncrPosition({
        address: ammContract.address,
        abi: ammContract.abi,
        functionName: "incrPositionE2437399",
        args: [
          token0.address,
          id,
          amount0Min,
          amount1Min,
          amount0Desired,
          amount1Desired,
        ],
      });
    },
    [
      writeContractIncrPosition,
      token0,
      ammContract,
      token0AmountRaw,
      token1AmountRaw,
    ],
  );

  // once token is divested, continue to updating
  useEffect(() => {
    if (!divestPositionResult.data || !positionId) return;
    // the position already exists so use positionId rather than mintPositionId
    incrPosition(BigInt(positionId));
  }, [divestPositionResult.data, positionId, incrPosition]);

  /**
   * Approve the AMM to spend the token
   *
   * Step 3. Approve token 1
   */
  const approveToken1 = useCallback(() => {
    if (
      !allowanceDataToken1?.result ||
      allowanceDataToken1.result < BigInt(token1AmountRaw)
    ) {
      writeContractApprovalToken1({
        address: token1.address,
        abi: getTokenFromAddress(expectedChainId, token1.address)!.abi,
        functionName: "approve",
        args: [ammContract.address, token1AmountRaw],
      });
    } else {
      incrPosition(hexToBigInt(mintPositionId as Hash));
    }
  }, [
    allowanceDataToken1,
    writeContractApprovalToken1,
    token1.address,
    incrPosition,
    mintPositionId,
    ammContract.address,
    expectedChainId,
    token1AmountRaw,
  ]);

  /**
   * Step 2. Approve token 0
   */
  const approveToken0 = useCallback(() => {
    if (
      !allowanceDataToken0?.result ||
      allowanceDataToken0.result < BigInt(token0AmountRaw)
    ) {
      writeContractApprovalToken0({
        address: token0.address,
        abi: getTokenFromAddress(expectedChainId, token0.address)!.abi,
        functionName: "approve",
        args: [ammContract.address, token0AmountRaw],
      });
    } else {
      approveToken1();
    }
  }, [
    allowanceDataToken0,
    writeContractApprovalToken0,
    token0.address,
    ammContract.address,
    approveToken1,
    expectedChainId,
    token0AmountRaw,
  ]);

  // once we have the position ID, approve the AMM to spend the token
  useEffect(() => {
    if (!mintPositionId) return;

    approveToken0();
    // including approveToken0 in this dependency array causes changes in allowance data
    // to retrigger the staking flow, as allowance data is a dependency of approveToken0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintPositionId]);

  // wait for the approval transaction to complete
  const approvalToken0Result = useWaitForTransactionReceipt({
    hash: approvalDataToken0,
  });

  // once approval of token 0 is complete,
  useEffect(() => {
    if (!approvalToken0Result.data || !mintPositionId) return;
    approveToken1();
    // including approveToken1 in this dependency array causes changes in allowance data
    // to retrigger the staking flow, as allowance data is a dependency of approveToken1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalToken0Result.data, mintPositionId]);

  const approvalToken1Result = useWaitForTransactionReceipt({
    hash: approvalDataToken1,
  });

  // incr the position once the approval is complete
  useEffect(() => {
    if (!approvalToken1Result.data || !mintPositionId) return;
    incrPosition(hexToBigInt(mintPositionId as Hash));
  }, [approvalToken1Result.data, mintPositionId, incrPosition]);

  // wait for the incrPosition transaction to complete
  const incrPositionResult = useWaitForTransactionReceipt({
    hash: incrPositionData,
  });

  // wait for the approveOwnershipNFT transaction to complete
  const approveOwnershipNFTResult = useWaitForTransactionReceipt({
    hash: approveOwnershipNFTData,
  });

  const getAmountsAndSetPosition = useCallback(
    function (id: number, tickLower: number, tickUpper: number) {
      const position = {
        positionId: id,
        pool: {
          token: token0,
          liquidityCampaigns: [],
        },
        lower: tickLower,
        upper: tickUpper,
        // if isVested already, we have to unvest to update the position
        isVested: isVesting,
      };
      getUsdTokenAmountsForPosition(
        expectedChainId,
        position,
        token0,
        Number(tokenPrice),
      ).then(([amount0, amount1]) =>
        updatePositionLocal({
          ...position,
          created: Math.round(new Date().getTime() / 1000),
          served: {
            timestamp: Math.round(new Date().getTime() / 1000),
          },
          liquidity: {
            fusdc: {
              valueUsd: String(amount1),
            },
            token1: {
              valueUsd: String(amount0),
            },
          },
        }),
      );
    },
    [expectedChainId, isVesting, token0, tokenPrice, updatePositionLocal],
  );

  const approveOwnershipNFT = useCallback(
    () =>
      writeContractApproveOwnershipNFT({
        address: ownershipNFTContract.address,
        abi: ownershipNFTContract.abi,
        functionName: "approve",
        args: [leoContract.address, BigInt(positionId ?? mintPositionId ?? 0)],
      }),
    [
      writeContractApproveOwnershipNFT,
      ownershipNFTContract.address,
      ownershipNFTContract.abi,
      positionId,
      mintPositionId,
      leoContract.address,
    ],
  );

  const vestPositionResultIdle = useCallback(
    () =>
      writeContractVestPosition({
        address: leoContract.address,
        abi: leoContract.abi,
        functionName: "vestPosition",
        args: [token0.address, BigInt(positionId ?? mintPositionId ?? 0)],
      }),
    [
      leoContract.abi,
      leoContract.address,
      positionId,
      mintPositionId,
      token0.address,
      writeContractVestPosition,
    ],
  );

  useEffect(() => {
    if (incrPositionResult.isSuccess) {
      const id = positionId ?? Number(mintPositionId);
      if (id && tickLower && tickUpper) {
        getAmountsAndSetPosition(id, tickLower, tickUpper);
      }
    }
  }, [
    getAmountsAndSetPosition,
    mintPositionId,
    positionId,
    tickLower,
    tickUpper,
    incrPositionResult.isSuccess,
  ]);

  useEffect(() => {
    if (incrPositionResult.isSuccess && isVesting) {
      approveOwnershipNFT();
    }
  }, [incrPositionResult.isSuccess, isVesting, approveOwnershipNFT]);

  useEffect(() => {
    // if we're vesting in Leo, have approved the ownership transfer, but haven't vested the position, do so now
    if (
      approveOwnershipNFTResult.isSuccess &&
      isVesting &&
      vestPositionResult.fetchStatus === "idle" &&
      !vestPositionResult.data
    )
      vestPositionResultIdle();
  }, [
    vestPositionResultIdle,
    isVesting,
    approveOwnershipNFTResult.isSuccess,
    vestPositionResult.data,
    vestPositionResult.fetchStatus,
  ]);

  const handleDone = useCallback(() => {
    resetIncrPosition();
    resetApproveToken0();
    resetApproveToken1();
    resetVestPosition();
    resetDivestPosition();
    resetApproveOwnershipNFT();
    incrPositionResult.refetch();
    router.push("/stake");
  }, [
    resetIncrPosition,
    resetApproveToken0,
    resetApproveToken1,
    resetVestPosition,
    resetDivestPosition,
    resetApproveOwnershipNFT,
    incrPositionResult,
    router,
  ]);

  // step 1 pending
  if (isMintPending || (mintData && result?.isPending)) {
    return (
      <Confirm
        text={"Stake"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={mintData}
      />
    );
  }

  // step 2 pending
  if (
    isApprovalPendingToken0 ||
    (approvalDataToken0 && approvalToken0Result?.isPending)
  ) {
    return (
      <EnableSpending
        tokenName={token0.symbol}
        transactionHash={approvalDataToken0}
      />
    );
  }

  // step 3 pending
  if (
    isApprovalPendingToken1 ||
    (approvalDataToken1 && approvalToken1Result?.isPending)
  ) {
    return (
      <EnableSpending
        tokenName={token1.symbol}
        transactionHash={approvalDataToken1}
      />
    );
  }

  // step 4 - divest from Leo if position is vested
  if (
    isDivesting &&
    (isDivestPositionPending ||
      (divestPositionData && divestPositionResult?.isPending))
  ) {
    return (
      <Confirm
        text={"Divest Position"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={divestPositionData}
      />
    );
  }

  // step 5 pending
  if (
    isIncrPositionPending ||
    (incrPositionData && incrPositionResult?.isPending)
  ) {
    return (
      <Confirm
        text={"Stake"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={incrPositionData}
      />
    );
  }

  // step 6 approving NFT ownership transfer for vesting
  if (
    isVesting &&
    (isApproveOwnershipNFTPending ||
      (approveOwnershipNFTData && approveOwnershipNFTResult?.isPending))
  ) {
    return (
      <Confirm
        text={"Vest Position"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={vestPositionData}
      />
    );
  }

  // step 7 vesting position
  if (
    isVesting &&
    (isVestPositionPending ||
      (vestPositionData && vestPositionResult?.isPending))
  ) {
    return (
      <Confirm
        text={"Vest Position"}
        fromAsset={{ symbol: token0.symbol, amount: token0Amount ?? "0" }}
        toAsset={{ symbol: token1.symbol, amount: token1Amount ?? "0" }}
        transactionHash={vestPositionData}
      />
    );
  }

  // success
  if (incrPositionResult.data) {
    return (
      <Success
        transactionHash={incrPositionResult.data.transactionHash}
        onDone={handleDone}
      />
    );
  }

  // error
  if (
    mintError ||
    approvalErrorToken0 ||
    approvalErrorToken1 ||
    incrPositionError ||
    divestPositionError ||
    vestPositionError ||
    approveOwnershipNFTError
  ) {
    const error =
      mintError ||
      approvalErrorToken0 ||
      approvalErrorToken1 ||
      incrPositionError ||
      divestPositionError ||
      vestPositionError ||
      approveOwnershipNFTError;
    return <Fail text={(error as any)?.shortMessage} />;
  }

  return (
    <div className="z-10 flex flex-col items-center">
      <motion.div
        layoutId={"modal"}
        className={cn("w-[315px] rounded-lg bg-black text-white md:w-[393px]", {
          "md:h-[685px]": mode === "existing",
          "md:h-[673px]": mode === "new",
          "md:h-[770px]": multiSingleToken === "single",
          "md:h-[500px]": !showBoostIncentives,
        })}
      >
        <div className="flex flex-row items-center justify-between p-[9px]">
          <div className="p-[6px] text-3xs md:text-xs">
            {mode === "new"
              ? "Stake Confirmation"
              : "Add Liquidity Confirmation"}
          </div>
          <Button
            size="esc"
            variant={"secondary"}
            onClick={() => router.back()}
          >
            Esc
          </Button>
        </div>

        <div
          className={cn("mt-[26px] flex flex-col items-center md:mt-[30px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs md:text-2xs">
            {mode === "new"
              ? "Total Deposited Amount in"
              : "Approximate Total Deposit Amount in"}{" "}
            <span className="hidden md:inline-flex">
              {" "}
              <span className="font-medium underline">$USD</span>
            </span>
          </div>
          <div className="mt-[4px] text-2xl font-medium md:text-3xl">
            ${usdTokenOPriceWReward}
          </div>
          <div className="mt-[4px] text-3xs font-medium text-gray-2 md:text-2xs">
            The amount is split into{" "}
            <span className="text-white underline">2 Tokens</span> below:
          </div>
        </div>

        <div
          className={cn("mt-[26px] flex flex-col items-center md:mt-[30px]", {
            hidden: multiSingleToken === "multi",
          })}
        >
          <div className="text-3xs md:text-2xs">
            {mode === "new"
              ? "Total Deposited Amount in"
              : "Approximate Total Deposit Amount in"}{" "}
            <span className="hidden md:inline-flex">
              {" "}
              <span className="font-medium underline">ƒUSDC</span>
            </span>
          </div>
          <div className="mt-[4px] flex flex-row items-center gap-[6px] text-2xl font-medium md:text-3xl">
            <TokenIridescent />
            <div>700</div>
          </div>
          <div className="mt-[4px] text-3xs font-medium text-gray-2 md:text-2xs">
            (= $700)
          </div>
          <div className="mt-[19px] w-[212px] text-center text-3xs font-medium text-gray-2 md:mt-[17px] md:w-[250px] md:text-2xs">
            Your <span className="iridescent-text">700 ƒUSDC</span> will be
            converted into the following two tokens to set your position in this
            pool <div className="inline-block rotate-90">{"->"}</div>
          </div>
        </div>

        <div
          className={cn("mt-[20px] flex flex-col items-center", {
            hidden: multiSingleToken === "multi",
          })}
        >
          <div className="flex h-[156px] w-[272px] flex-col rounded-md border md:h-[199px] md:w-[349px]">
            <div className="flex flex-1 flex-row justify-between border-b pl-[18px] pr-[26px] pt-[16px]">
              <div className="flex w-full flex-col gap-1">
                <div className="text-3xs md:text-2xs">{token0.symbol}</div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-sm md:gap-2 md:text-2xl">
                    <TokenIcon
                      src={token0.icon}
                      className={"size-[16px] invert"}
                    />
                    <div>{token0Amount}</div>
                  </div>
                  <div className="text-3xs text-gray-2 md:text-xs">50%</div>
                </div>
                <div className="text-3xs text-gray-2">= $350.00</div>
              </div>
            </div>

            <div className="flex flex-1 flex-row justify-between pl-[18px] pr-[26px] pt-[16px]">
              <div className="flex w-full flex-col gap-1">
                <div className="text-3xs md:text-2xs">ƒUSDC</div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-1 text-sm md:gap-2 md:text-2xl">
                    <TokenIridescent />
                    <div>350.00</div>
                  </div>
                  <div className="text-3xs text-gray-2 md:text-xs">50%</div>
                </div>
                <div className="text-3xs text-gray-2">= $350.00</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn("mt-[15px] pl-[21px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs">
            {token0.symbol}
          </div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <TokenIcon src={token0.icon} className={"size-[24px] invert"} />{" "}
            {token0Amount}
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = ${usdTokenOPrice}
          </div>
        </div>

        <div
          className={cn("mt-[23px] pl-[21px]", {
            hidden: multiSingleToken === "single",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs">ƒUSDC</div>
          <div className="mt-1 flex flex-row items-center gap-1 text-2xl">
            <TokenIcon src={token1.icon} className={"size-[24px] invert"} />{" "}
            {token1Amount}
          </div>
          <div className="mt-0.5 text-2xs text-gray-2 md:text-xs">
            = ${token1Amount}
          </div>
        </div>

        <div
          className={cn(
            "mt-[21px] flex flex-row justify-between px-[21px] text-3xs font-medium md:text-2xs md:font-normal",
            {
              hidden: mode === "new",
            },
          )}
        >
          <div>Expected Shares</div>
          <div>0.000321568910</div>
        </div>
        <div
          className={cn("px-[21px]", {
            "mt-[29px] md:mt-[37px]": mode === "new",
            "mt-[19px] md:mt-[16px]": mode === "existing",
          })}
        >
          <div className="text-3xs font-medium md:text-2xs md:font-normal">
            Projected Yield
          </div>
          <div className="mt-[13px] flex flex-col gap-[5px] px-[4px] text-2xs">
            <div className="flex flex-row justify-between">
              <div>Fees</div>
              <div>
                Pool Fee {+feePercentage.toFixed(3)}% ={" "}
                {+((usdTokenOPrice * feePercentage) / 100).toFixed(6)}$
              </div>
            </div>

            {showBoostIncentives && (
              <>
                <div className="flex flex-row justify-between">
                  <div>Protocol Boosts</div>
                  <div>3.5%</div>
                </div>

                <div className="flex flex-row justify-between">
                  <div>Super Boosts</div>
                  <div>2%</div>
                </div>
              </>
            )}

            {showStakeApy && (
              <>
                <div className="mt-[15px] flex flex-row justify-between">
                  <div>APY</div>
                  <div className="iridescent rounded px-1 text-black">
                    12.09%
                  </div>
                </div>

                <div className="flex flex-row justify-between">
                  <div>Yield</div>
                  <div>$247.88</div>
                </div>
              </>
            )}
          </div>
        </div>

        {showBoostIncentives && (
          <>
            <div className="mt-[20px] px-[21px]">
              <div className="text-3xs">Yield Composition</div>

              <div className="mt-[20px] flex flex-row gap-1 text-2xs">
                <div className="flex w-[3%] flex-col gap-1">
                  <div>3%</div>
                  <div className="h-1 w-full rounded bg-white"></div>
                  <div className="text-4xs md:hidden">Fees</div>
                </div>

                <div className="flex w-[7%] flex-col items-center gap-1">
                  <div>7%</div>
                  <div className="h-1 w-full rounded bg-white"></div>
                  <div className="text-4xs md:hidden">Protocol Boosts</div>
                </div>

                <div className="flex w-[30%] flex-col items-center gap-1">
                  <div>30%</div>
                  <div className="h-1 w-full rounded bg-white"></div>
                  <div className="text-4xs md:text-3xs">Super Boosts</div>
                </div>

                <div className="flex w-3/5 flex-col items-center gap-1">
                  <div>60%</div>
                  <div className="iridescent h-1 w-full rounded"></div>
                  <div className="text-4xs md:text-3xs">Utility Boosts</div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col items-center p-[15px]">
          <Button
            variant={"secondary"}
            className="w-full max-w-[350px]"
            onClick={() => {
              mode === "new"
                ? createPosition()
                : isDivesting
                  ? divestPosition(BigInt(positionId))
                  : incrPosition(BigInt(positionId));
            }}
          >
            {isVesting
              ? "Confirm Stake and Vest"
              : isVested
                ? "Confirm Harvest and Update Stake"
                : "Confirm Stake"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
