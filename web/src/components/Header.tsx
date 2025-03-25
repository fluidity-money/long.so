import { DemoData } from "@/app/_layout/DemoData";
import { FeatureFlagConfig } from "@/app/_layout/FeatureFlagConfig";
import { MobileNetworkSelection } from "@/app/_layout/MobileNetworkSelection";
import { NavigationMenu } from "@/app/_layout/NavigationMenu";
import LongTail from "@/assets/icons/long-tail.svg";
import Points from "./Points";
import { NetworkSelection } from "@/app/_layout/NetworkSelection";
import { ConnectWalletButton } from "@/app/_layout/ConnectWalletButton";
import { superpositionTestnet } from "@/config/chains";
const faucetChains = [superpositionTestnet];

export default function Header() {
  return (
    <header className="z-20 p-8">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-row items-start justify-around">
          <div className="flex flex-grow basis-0 flex-row items-center gap-4">
            <a href="/">
              <LongTail height={34} width={34} />
            </a>
            <MobileNetworkSelection />
            <FeatureFlagConfig />
            <DemoData />
          </div>
          <NavigationMenu />
          <div className="flex flex-grow basis-0 flex-row items-center justify-end gap-4">
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
