"use client";

import { usePathname, useRouter } from "next/navigation";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/MobileNetworkSelection";
import { NetworkSelection } from "@/app/NetworkSelection";

import { Inter } from "next/font/google";
import { useSwapPro } from "@/stores/useSwapPro";
import { ConnectWalletButton } from "@/app/ConnectWalletButton";
import Menu from "@/components/Menu";
import { FaFaucet } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const StyleLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { swapPro } = useSwapPro();

  return (
    <body className={`${inter.className} flex min-h-screen flex-col bg-white`}>
      <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />

      <header className="p-8">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-row items-center gap-4">
              <Superposition height={34} width={34} />
              <MobileNetworkSelection />
            </div>
            <div className="flex flex-row items-center gap-4">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="group">
                  <Badge
                    className={
                      "h-[28px] rounded-2xl px-0.5 pr-2 transition-[width] group-data-[state=open]:rounded-b-none group-data-[state=open]:border-b-0 md:inline-flex"
                    }
                  >
                    <div className="flex-col">
                      <div className="flex flex-row items-center">
                        <div className="mx-2">
                          <FaFaucet />
                        </div>
                        <div className="text-nowrap">Faucets</div>
                        <div className="ml-2 hidden w-0 transition-[width] group-hover:inline-flex group-hover:w-2 group-data-[state=open]:inline-flex group-data-[state=open]:w-2">
                          <ArrowDown
                            width={10}
                            height={6}
                            className={"invert"}
                          />
                        </div>
                      </div>
                    </div>
                  </Badge>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={cn(
                      "-mt-2 flex w-[--radix-dropdown-menu-trigger-width] flex-col gap-0.5 rounded-2xl rounded-t-none border border-t-0 border-black bg-black p-2 text-xs text-white",
                    )}
                  >
                    <a
                      href={
                        "https://bwarelabs.com/faucets/arbitrum-stylus-testnet"
                      }
                    >
                      <DropdownMenu.Item className="flex cursor-pointer flex-row items-center gap-1 p-1 text-xs">
                        Ethereum
                      </DropdownMenu.Item>
                    </a>
                    <DropdownMenu.Item
                      className="flex cursor-pointer flex-row items-center gap-1 p-1 text-xs"
                      onSelect={() => {
                        router.push("/faucet");
                      }}
                    >
                      Tokens
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              <NetworkSelection />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start md:items-center">
          <Menu id="nav">
            <Menu.Item
              onClick={() => {
                router.push("/");
              }}
              selected={pathname === "/" || pathname.startsWith("/swap")}
              proToggle
            >
              <div className="text-nowrap">
                Swap{" "}
                {swapPro && (
                  <div className="hidden md:inline-flex">{" Pro"}</div>
                )}
              </div>
            </Menu.Item>
            <Menu.Item
              className={"w-[73px]"}
              onClick={() => {
                router.push("/stake");
              }}
              selected={pathname.startsWith("/stake")}
            >
              <div>Stake</div>
            </Menu.Item>
          </Menu>
        </div>
      </header>

      <div className={"z-10 flex-1"}>{children}</div>

      <footer className="w-full self-end p-8">
        <div className="flex flex-row justify-between">
          <div>1002130192</div>
          <div>Version 0.0.1</div>
        </div>
      </footer>
    </body>
  );
};
