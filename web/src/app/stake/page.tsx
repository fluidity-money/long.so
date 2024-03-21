"use client";

import { CampaignBanner } from "@/components/CampaignBanner";
import { MyPositions } from "@/app/stake/MyPositions";
import { YieldOverTimeGraph } from "@/app/stake/YieldOverTimeGraph";
import { AllPools } from "@/app/stake/AllPools";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useHotkeys } from "react-hotkeys-hook";
import ProfilePicture from "@/assets/icons/profile-picture.svg";
import IridescentToken from "@/assets/icons/iridescent-token.svg";
import Token from "@/assets/icons/token.svg";
import Ethereum from "@/assets/icons/ethereum.svg";
import { Badge } from "@/components/ui/badge";
import { useStakeWelcomeBackStore } from "@/stores/useStakeWelcomeBackStore";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { nanoid } from "nanoid";
import { usdFormat } from "@/lib/usdFormat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";
import Success from "@/assets/icons/success.gif";

const yieldData = [
  {
    id: nanoid(),
    token: "fUSDC",
    amount: 350,
    usdAmount: 350,
    icon: <Token className="size-[20px]" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
  {
    id: nanoid(),
    token: "ETH",
    amount: 0.000432958512,
    usdAmount: 350,
    icon: <Ethereum className="size-[20px] invert" />,
  },
];

const Stake = () => {
  const {
    welcome,
    setWelcome,
    yieldBreakdown,
    setYieldBreakdown,
    yieldBreakdownClaimed,
    setYieldBreakdownClaimed,
  } = useStakeWelcomeBackStore();

  useHotkeys(
    "esc",
    () => {
      setWelcome(false);
    },
    [setWelcome],
  );

  const { isLtSm } = useMediaQuery();

  if (welcome) {
    return (
      <>
        <AlertDialog.Root open={welcome}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/80 md:bg-black/50" />
            <AlertDialog.Content className="z-50 ">
              <div className="flex flex-col items-center gap-2 px-4">
                <motion.div
                  className="w-full max-w-[394px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CampaignBanner />
                </motion.div>
                <div className="flex flex-col items-center">
                  <motion.div
                    layoutId="modal"
                    className="flex h-[366px] w-[394px] flex-col items-center justify-between rounded-lg bg-black p-[10px] text-white drop-shadow-white"
                  >
                    <div className="flex w-full flex-row justify-between p-[4px]">
                      <div className="text-3xs md:text-2xs">
                        Earned since last login
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setWelcome(false)}
                        className="h-[26px] px-2 py-0 text-2xs"
                        size={"sm"}
                      >
                        Esc
                      </Button>
                    </div>

                    <div className="flex flex-col items-center gap-[8px]">
                      <ProfilePicture className={"size-[39px]"} />

                      <div className="md: w-full text-center text-2xs md:text-sm">
                        Welcome back!
                      </div>
                    </div>

                    <div className="mt-2 w-full pl-4 text-2xs md:text-xs">
                      {"Since you left you've earned:"}
                    </div>

                    <div className="flex w-full flex-col gap-1 px-4 pl-8">
                      <div className="flex flex-row justify-between text-3xs md:text-2xs">
                        <div>Pool Fees</div>

                        <div className="flex flex-row items-center gap-1">
                          <IridescentToken className="size-4" />
                          <div>$21.72</div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between text-3xs md:text-2xs">
                        <div>Liquidity Boosts</div>

                        <div className="flex flex-row items-center gap-1">
                          <div className="flex flex-row">
                            <IridescentToken className="size-4" />
                            <IridescentToken className="-ml-2 size-4" />
                          </div>
                          <div>$13.06</div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between text-3xs md:text-2xs">
                        <div>Super Boosts</div>
                        <div className="flex flex-row items-center gap-1">
                          <IridescentToken className="size-4" />
                          <div>$8.34</div>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between text-3xs md:text-2xs">
                        <div>Utility Boosts</div>
                        <div className="flex flex-row items-center gap-1">
                          <IridescentToken className="size-4" />
                          <div>$2.99</div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-row justify-between text-3xs font-semibold md:text-2xs">
                        <div>Total</div>
                        <Badge
                          variant="iridescent"
                          className="flex h-4 flex-row p-1 pl-0 text-3xs md:text-2xs"
                        >
                          <Token className="size-4" />
                          <Token className="-ml-2 size-4" />
                          <Token className="-ml-2 size-4" />
                          <Token className="-ml-2 size-4" />
                          $41.12
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex w-full flex-col items-center">
                      <Button
                        variant="iridescent"
                        className="h-[37px] w-full "
                        onClick={() => {
                          setWelcome(false);
                          setYieldBreakdown(true);
                        }}
                      >
                        Claim All Yield
                      </Button>
                      <div className="mt-[-10px]">
                        <Badge
                          className="h-4 border-2 border-black p-1 pl-0.5 text-3xs"
                          variant="iridescent"
                        >
                          <IridescentToken />
                          <IridescentToken />
                          $920.12
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </>
    );
  }

  if (yieldBreakdown && !isLtSm) {
    return (
      <>
        <AlertDialog.Root open={yieldBreakdown && !isLtSm}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/80 md:bg-black/50" />
            <AlertDialog.Content className="z-50 ">
              <div className="flex flex-col items-center gap-2 px-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    layoutId="modal"
                    className="flex w-[400px] flex-col items-center justify-between rounded-lg bg-black p-[10px] text-white drop-shadow-white"
                  >
                    <div className="flex w-full flex-row justify-between p-[4px]">
                      <div className="text-3xs md:text-2xs">
                        Yield Breakdown
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setYieldBreakdown(false)}
                        className="h-[26px] px-2 py-0 text-2xs"
                        size={"sm"}
                      >
                        Esc
                      </Button>
                    </div>

                    <div className="mt-[26px] flex flex-col items-center gap-[4px]">
                      <div className="text-3xs">
                        Total Claimable Amount in{" "}
                        <span className="font-medium underline">$USD</span>
                      </div>
                      <div className="text-3xl">$1,433.35</div>
                    </div>

                    <div className="mt-[21px] text-center text-2xs text-gray-2">
                      Yield breakdown of tokens at current market price:
                    </div>

                    <div className="mt-[20px] flex w-full flex-col gap-[15px] px-[35px]">
                      {yieldData.map((y) => (
                        <div
                          className="flex flex-row items-center justify-between"
                          key={y.id}
                        >
                          <div className="flex flex-row items-center gap-[6px]">
                            {y.icon}

                            <div className="flex flex-col">
                              <div>{y.amount}</div>
                              <div className="text-2xs text-gray-2">
                                ({usdFormat(y.usdAmount)})
                              </div>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-white">
                            {y.token}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="mt-[32px] flex flex-col items-center">
                      <div className="text-3xs text-gray-2 underline">
                        ⚠️ ️Claiming Yield will withdraw currently available
                        yield for you.
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      className={"mt-[25px] h-[37px] w-full text-xs"}
                      onClick={() => {
                        setYieldBreakdown(false);
                        setYieldBreakdownClaimed(true);
                      }}
                    >
                      Confirm Claim
                    </Button>
                  </motion.div>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </>
    );
  }

  if (yieldBreakdownClaimed && !isLtSm) {
    return (
      <>
        <AlertDialog.Root open={yieldBreakdownClaimed && !isLtSm}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-30 bg-black/80 md:bg-black/50" />
            <AlertDialog.Content className="z-50 ">
              <div className="flex flex-col items-center gap-2 px-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    layoutId="modal"
                    className="flex w-[400px] flex-col items-center justify-between rounded-lg bg-black p-[10px] text-white drop-shadow-white"
                  >
                    <div className="flex w-full flex-row justify-between p-[4px]">
                      <div className="text-3xs md:text-2xs">
                        Yield Breakdown
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setYieldBreakdownClaimed(false)}
                        className="h-[26px] px-2 py-0 text-2xs"
                        size={"sm"}
                      >
                        Esc
                      </Button>
                    </div>
                    
                    <Image
                      src={Success}
                      alt="success"
                      className="size-[52px]"
                    />
                    <div className="mt-[11px] text-xl">All Yield Claimed!</div>
                    <div className="mt-[17px] text-3xs">
                      You’ve successfully claimed all available yields from your
                      pools!
                    </div>

                    <div className="mt-[26px] flex w-full flex-row gap-2">
                      <Button variant="outline" className="flex-1 text-2xs">
                        Add to Your Wallet
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-2xs"
                        onClick={() => {
                          setYieldBreakdownClaimed(false);
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </>
    );
  }

  return (
    <>
      <Drawer open={yieldBreakdown && isLtSm} onOpenChange={setYieldBreakdown}>
        <DrawerContent>
          <div className="flex flex-row items-center justify-between p-[14px]">
            <div className="text-2xs">Yield Breakdown</div>
            <DrawerClose>
              <Button
                size="sm"
                variant="secondary"
                className="h-[21px] w-[32px] text-3xs"
              >
                Esc
              </Button>
            </DrawerClose>
          </div>
          <div className="mx-[29px] mb-[32px] mt-[22px] flex flex-col gap-[15px]">
            {yieldData.map((y) => (
              <div
                className="flex flex-row items-center justify-between"
                key={y.id}
              >
                <div className="flex flex-row items-center gap-[6px]">
                  {y.icon}

                  <div className="flex flex-col">
                    <div>{y.amount}</div>
                    <div className="text-2xs text-gray-2">
                      ({usdFormat(y.usdAmount)})
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="text-white">
                  {y.token}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mb-[29px] flex flex-col items-center">
            <div className="text-3xs text-gray-2 underline">
              ⚠️ ️Claiming Yield will withdraw currently available yield for
              you.
            </div>
          </div>
          <div className="flex w-full flex-col px-[13px] pb-[13px]">
            <DrawerClose
              onClick={() => {
                setYieldBreakdownClaimed(true);
              }}
            >
              <Button className="w-full text-2xs" variant="secondary">
                Claim Yield
              </Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <Drawer
        open={yieldBreakdownClaimed && isLtSm}
        onOpenChange={setYieldBreakdownClaimed}
      >
        <DrawerContent>
          <div className="flex flex-row items-center justify-between p-[14px]">
            <div className="text-2xs">All Yield Claimed</div>
            <DrawerClose>
              <Button
                size="sm"
                variant="secondary"
                className="h-[21px] w-[32px] text-3xs"
              >
                Esc
              </Button>
            </DrawerClose>
          </div>
          <div className="flex flex-col items-center">
            <Image src={Success} alt="success" className="size-[52px]" />
            <div className="mt-[11px] text-xl">All Yield Claimed!</div>
            <div className="mt-[17px] text-3xs">
              You’ve successfully claimed all available yields from your pools!
            </div>

            <div className="mt-[26px] flex w-full flex-row gap-2 p-[13px]">
              <Button variant="outline" className="flex-1 text-2xs">
                Add to Your Wallet
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-2xs"
                onClick={() => {
                  setYieldBreakdownClaimed(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <div className="z-10 flex flex-col items-center gap-2 px-4">
        <motion.div
          className="w-full max-w-[500px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CampaignBanner />
        </motion.div>

        <div className="flex w-full flex-row justify-center gap-8">
          <div className="flex w-full max-w-[500px] flex-1 flex-col gap-2">
            <MyPositions />
          </div>

          {/* this doesn't show on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="hidden w-full max-w-[500px] flex-1 flex-col md:flex"
          >
            <YieldOverTimeGraph />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="flex w-full flex-col"
        >
          <AllPools />
        </motion.div>
      </div>
    </>
  );
};

export default Stake;
