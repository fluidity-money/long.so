"use client";

import { usePathname, useRouter } from "next/navigation";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/MobileNetworkSelection";
import { NetworkSelection } from "@/app/NetworkSelection";
import { Button } from "@/components/ui/button";
import { Menu, Text } from "@/components";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const StyleLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <body className={inter.className}>
      <div className="h-screen w-screen overflow-hidden bg-white">
        <div
          className={
            "iridescent-blur calc absolute left-1/2 top-[180px] h-full max-h-[305px] w-full max-w-[557px] -translate-x-1/2 transform"
          }
        />

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
                  <Text>Swap</Text>
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
        <footer className="z-100 absolute bottom-0 w-full p-8">
          <div className="flex flex-row justify-between">
            <div>1002130192</div>
            <div>Version 0.0.1</div>
          </div>
        </footer>
      </div>
    </body>
  );
};
