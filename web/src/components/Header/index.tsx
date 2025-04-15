import { DemoData } from "@/components/Header/DemoData";
import { FeatureFlagConfig } from "@/components/Header/FeatureFlagConfig";
import { MobileNetworkSelection } from "@/components/Header/MobileNetworkSelection";
import { NavigationMenu } from "@/components/Header/NavigationMenu";
import LongTail from "@/assets/icons/long-tail.svg";
import Points from "../Points";
import { NetworkSelection } from "@/components/Header/NetworkSelection";
import { ConnectWalletButton } from "@/components/Header/ConnectWalletButton";
import Link from "next/link";

export default function Header() {
  return (
    <header className="z-20 px-8 py-4">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-row items-start justify-around">
          <div className="flex grow basis-0 flex-row items-center gap-4">
            <Link href="/">
              <LongTail
                width={24}
                height={24}
                className={"size-6 dark:text-white"}
              />
            </Link>
            <MobileNetworkSelection />
            <FeatureFlagConfig />
            <DemoData />
          </div>
          <NavigationMenu />
          <div className="flex grow basis-0 flex-row items-center justify-end gap-4">
            <Points />
            {/* <FaucetDropdown allowedChains={faucetChains} /> */}
            <NetworkSelection />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
