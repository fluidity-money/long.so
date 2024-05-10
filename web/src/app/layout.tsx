import { Provider } from "@/app/Provider";
import { Metadata } from "next";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/_layout/MobileNetworkSelection";
import { DemoData } from "@/app/_layout/DemoData";
import { FaucetDropdown } from "@/app/_layout/FaucetDropdown";
import { NetworkSelection } from "@/app/_layout/NetworkSelection";
import { ConnectWalletButton } from "@/app/_layout/ConnectWalletButton";
import { NavigationMenu } from "@/app/_layout/NavigationMenu";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Superposition AMM",
  description: "Long Tail is Arbitrum's cheapest and most rewarding AMM.",
  openGraph: {
    title: "Long Tail AMM",
    url: "https://long.so",
    images: [
      {
        url: "https://static.long.so/embed.jpg",
        width: 1069,
        height: 816,
        alt: "Long Tail AMM",
      },
    ],
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={cn("flex min-h-screen flex-col bg-white", inter.className)}
        >
          <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />

          <header className="p-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex flex-row items-start justify-between">
                <div className="flex flex-row items-center gap-4">
                  <Superposition height={34} width={34} />
                  <MobileNetworkSelection />
                  <DemoData />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <FaucetDropdown />
                  <NetworkSelection />
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start md:items-center">
              <NavigationMenu />
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
      </Provider>
    </html>
  );
}
