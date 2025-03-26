import { DemoData } from "@/components/Header/DemoData";
import { FeatureFlagConfig } from "@/components/Header/FeatureFlagConfig";
import { MobileNetworkSelection } from "@/components/Header/MobileNetworkSelection";
import { NavigationMenu } from "@/components/Header/NavigationMenu";
import LongTail from "@/assets/icons/long-tail.svg";
import Points from "../Points";
import { NetworkSelection } from "@/components/Header/NetworkSelection";
import { ConnectWalletButton } from "@/components/Header/ConnectWalletButton";
import { superpositionTestnet } from "@/config/chains";
const faucetChains = [superpositionTestnet];

export default function Header({ isDark }: { isDark: boolean }) {
  return (
    <header className="z-20 p-8">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-row items-start justify-around">
          <div className="flex grow basis-0 flex-row items-center gap-4">
            <a href="/">
              <LongTail height={34} width={34} />
            </a>
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
