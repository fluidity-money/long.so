import { Provider } from "@/app/Provider";
import { Metadata } from "next";
import PopulateQueryCache from "@/app/PopulateQueryCache";
import BottomBanner from "@/components/Banners/BottomBanner";
import ErrorReportingDialog from "@/components/ErrorReportingDialog";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WalletConnectionStatus } from "@/components/WalletConnectionStatus";

export const metadata: Metadata = {
  title: "Longtail",
  description: "Longtail is Arbitrum's cheapest and most rewarding AMM.",
  metadataBase: new URL("https://long.so"),
  keywords: [
    "amm",
    "automated market maker",
    "dex",
    "defi",
    "longtail",
    "superposition",
    "onchain",
    "arbitrum",
    "superposition",
    "blockchain",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const featuresDataRequest = await fetch(
    "https://features.long.so/features.json",
  );
  const featuresData = await featuresDataRequest.json();
  return (
    <html lang="en">
      <body>
        <Provider>
          <WalletConnectionStatus />
          <PopulateQueryCache featuresData={featuresData} />
          {children}
          <BottomBanner />
          <ErrorReportingDialog />
        </Provider>
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
