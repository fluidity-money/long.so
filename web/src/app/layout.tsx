import { Metadata } from "next";
import Providers from "@/providers";
import BottomBanner from "@/components/Banners/BottomBanner";
import ErrorReportingDialog from "@/components/ErrorReportingDialog";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WalletConnectionStatus } from "@/components/WalletConnectionStatus";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import "./globals.css";

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
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  return (
    <html lang="en">
      <body>
        <Providers featuresData={featuresData} cookies={cookies}>
          <WalletConnectionStatus />
          {children}
          <BottomBanner />
          <ErrorReportingDialog />
        </Providers>
        <CookieBanner />
        <GoogleAnalytics />
        <Toaster />
      </body>
    </html>
  );
}
