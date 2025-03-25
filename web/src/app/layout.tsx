import { Provider } from "@/app/Provider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import PopulateQueryCache from "@/app/PopulateQueryCache";
import BottomBanner from "@/components/Banners/BottomBanner";
import ErrorReportingDialog from "@/components/ErrorReportingDialog";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { WalletConnectionStatus } from "@/components/WalletConnectionStatus";
import Header from "@/components/header";
import Footer from "@/components/Footer";

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
  const featuresDataRequest = await fetch(
    "https://features.long.so/features.json",
  );
  const featuresData = await featuresDataRequest.json();

  return (
    <html lang="en">
      <body
        className={cn("flex min-h-screen flex-col bg-white", inter.className)}
      >
        <Provider>
          <WalletConnectionStatus />
          <PopulateQueryCache featuresData={featuresData} />
          <div className="iridescent-blur absolute left-1/2 top-[180px] size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />
          <Header />
          <div className={"z-10 flex flex-1 flex-col"}>{children}</div>
          <Footer />
          <BottomBanner />
          <ErrorReportingDialog />
        </Provider>
        <CookieBanner />
      </body>
      <GoogleAnalytics />
    </html>
  );
}
