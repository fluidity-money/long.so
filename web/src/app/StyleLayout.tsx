"use client";

import { usePathname, useRouter } from "next/navigation";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/MobileNetworkSelection";
import { NetworkSelection } from "@/app/NetworkSelection";

import { Inter } from "next/font/google";
import { useSwapPro } from "@/stores/useSwapPro";
import Head from "next/head";
import { ConnectWalletButton } from "@/app/ConnectWalletButton";
import Menu from "@/components/Menu";
import { FaFaucet } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const StyleLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { swapPro } = useSwapPro();

  return (
    <>
      <Head>
        <title>Superposition AMM</title>
      </Head>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white`}
      >
        <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />

        <header className="p-8">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-row items-start justify-between">
              <div className="flex flex-row items-center gap-4">
                <Superposition height={34} width={34} />
                <MobileNetworkSelection />
              </div>

              <div className="flex flex-row items-center gap-4">
                <a href="https://bwarelabs.com/faucets/arbitrum-stylus-testnet">
                  <Badge className="h-[28px] cursor-pointer gap-2">
                    <FaFaucet />
                    Faucet
                  </Badge>
                </a>
                <NetworkSelection />
                <ConnectWalletButton />
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
    </>
  );
};
