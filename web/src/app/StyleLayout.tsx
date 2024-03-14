"use client";

import { usePathname, useRouter } from "next/navigation";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/MobileNetworkSelection";
import { NetworkSelection } from "@/app/NetworkSelection";
import { Button } from "@/components/ui/button";
import { Menu, Text } from "@/components";
import { Inter } from "next/font/google";
import { useSwapPro } from "@/stores/useSwapPro";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const StyleLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { swapPro } = useSwapPro();

  return (
    <body className={`${inter.className} flex flex-col bg-white`}>
      <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />

      <header className="p-8">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-row items-center gap-4">
              <Superposition height={34} width={34} />
              <MobileNetworkSelection />
            </div>

            <div className="flex flex-row items-start gap-4">
              <NetworkSelection />
              <Button size="sm" color="light">
                Connect Wallet
              </Button>
            </div>
          </div>
          <div className="flex w-full flex-col items-start md:items-center">
            <Menu id="nav">
              <Menu.Item
                onClick={() => {
                  router.push("/");
                }}
                selected={pathname === "/"}
                proToggle
              >
                <Text className="text-nowrap">
                  Swap{" "}
                  {swapPro && (
                    <Text className="hidden md:inline-flex">{" Pro"}</Text>
                  )}
                </Text>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  router.push("/stake");
                }}
                selected={pathname.startsWith("/stake")}
              >
                <Text>Stake</Text>
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </header>

      {children}

      <footer className="w-full p-8">
        <div className="flex flex-row justify-between">
          <div>1002130192</div>
          <div>Version 0.0.1</div>
        </div>
      </footer>
    </body>
  );
};
