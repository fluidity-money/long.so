import { DemoData } from "@/components/Header/DemoData";
import { FeatureFlagConfig } from "@/components/Header/FeatureFlagConfig";
import { MobileNetworkSelection } from "@/components/Header/MobileNetworkSelection";
import { NavigationMenu } from "@/components/Header/NavigationMenu";
import LongTail from "@/assets/icons/long-tail.svg";
import Points from "../Points";
import { NetworkSelection } from "@/components/Header/NetworkSelection";
import { ConnectWalletButton } from "@/components/Header/ConnectWalletButton";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Header({ isDark }: { isDark: boolean }) {
  return (
    <header className="z-20 px-8 py-4">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-row items-start justify-around">
          <div className="flex grow basis-0 flex-row items-center gap-4">
            <Link href="/">
              <LongTail
                width={24}
                height={24}
                className={cn(isDark && "text-white", "size-6")}
              />
            </Link>
            <MobileNetworkSelection />
            <FeatureFlagConfig isDark={isDark} />
            <DemoData />
          </div>
          <NavigationMenu isDark={isDark} />
          <div className="flex grow basis-0 flex-row items-center justify-end gap-4">
            <Points />
            {/* <FaucetDropdown allowedChains={faucetChains} /> */}
            <NetworkSelection />
            <ConnectWalletButton isDark={isDark} />
          </div>
        </div>
      </div>
    </header>
  );
}
