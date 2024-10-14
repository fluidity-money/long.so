import { Provider } from "@/app/Provider";
import { Metadata } from "next";
import LongTail from "@/assets/icons/long-tail.svg";
import Discord from "@/assets/icons/discord.svg";
import { MobileNetworkSelection } from "@/app/_layout/MobileNetworkSelection";
import { DemoData } from "@/app/_layout/DemoData";
import { FaucetDropdown } from "@/app/_layout/FaucetDropdown";
import { NetworkSelection } from "@/app/_layout/NetworkSelection";
import { ConnectWalletButton } from "@/app/_layout/ConnectWalletButton";
import { NavigationMenu } from "@/app/_layout/NavigationMenu";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeatureFlagConfig } from "@/app/_layout/FeatureFlagConfig";
import PopulateQueryCache from "@/app/PopulateQueryCache";
import BottomBanner from "@/components/Banners/BottomBanner";
import ErrorReportingDialog from "@/components/ErrorReportingDialog";
import { superpositionTestnet } from "@/config/chains";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const title = "Longtail";

const description = "Longtail is Arbitrum's cheapest and most rewarding AMM.";

const image = "https://static.long.so/embed.png";

export const metadata: Metadata = {
  title: title,
  description: description,
  metadataBase: new URL("https://long.so"),
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    site: "@superpositionso",
    siteId: "",
    creator: "@superpositionso",
    creatorId: "",
    images: [image],
  },
  openGraph: {
    title: "Longtail AMM",
    url: "https://long.so",
    images: [
      {
        url: image,
        width: 1200,
        height: 800,
        alt: "Longtail AMM",
      },
    ],
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

// force the static export to fetch data from the server
export const dynamic = "force-static";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH;

  const featuresDataRequest = await fetch(
    "https://features.long.so/features.json",
  );
  const featuresData = await featuresDataRequest.json();

  const faucetChains = [superpositionTestnet];

  return (
    <html lang="en">
      <body
        className={cn("flex min-h-screen flex-col bg-white", inter.className)}
      >
        <Provider>
          <PopulateQueryCache featuresData={featuresData} />
          <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />

          <header className="z-20 p-8">
            <div className="flex w-full flex-col gap-8">
              <div className="flex flex-row items-start justify-between">
                <div className="flex flex-row items-center gap-4">
                  <a href="/">
                    <LongTail height={34} width={34} />
                  </a>
                  <MobileNetworkSelection />
                  <FeatureFlagConfig />
                  <DemoData />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <FaucetDropdown allowedChains={faucetChains} />
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
              <div className="flex items-center gap-x-[10px]">
                <a href="https://x.com/superpositionso">𝕏</a>
                <a href="https://discord.gg/VjUWjRQP8y">
                  <Discord />
                </a>
                <small>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/fluidity-money/long.so/tree/development/audits"
                  >
                    Audits
                  </a>
                </small>
              </div>
              <small>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://issues.superposition.so"
                >
                  Known issues
                </a>
              </small>
              <small>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://github.com/fluidity-money/long.so/commit/${gitHash}`}
                >
                  Commit {gitHash}
                </a>
              </small>
            </div>
          </footer>
          <BottomBanner />
          <ErrorReportingDialog />
        </Provider>
        <CookieBanner />
      </body>
      <GoogleAnalytics />
    </html>
  );
}
