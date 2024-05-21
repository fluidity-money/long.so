import { Provider } from "@/app/Provider";
import { Metadata } from "next";
import Superposition from "@/assets/icons/superposition.svg";
import { MobileNetworkSelection } from "@/app/_layout/MobileNetworkSelection";
import { DemoData } from "@/app/_layout/DemoData";
import { NetworkSelection } from "@/app/_layout/NetworkSelection";
import { ConnectWalletButton } from "@/app/_layout/ConnectWalletButton";
import { NavigationMenu } from "@/app/_layout/NavigationMenu";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeatureFlagConfig } from "@/app/_layout/FeatureFlagConfig";
import { useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
import { graphqlEndpoint } from "@/config/graphqlEndpoint";
import { graphqlQuery } from "@/hooks/useGraphql";
import PopulateQueryCache from "@/app/PopulateQueryCache";

const title = "Long Tail AMM";

const description = "Long Tail is Arbitrum's cheapest and most rewarding AMM.";

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
    title: "Long Tail AMM",
    url: "https://long.so",
    images: [
      {
        url: image,
        width: 1200,
        height: 800,
        alt: "Long Tail AMM",
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
  const gitHash = process.env.GIT_HASH;

  // make server-side requests for pre-fetching data
  const data = await request(graphqlEndpoint, graphqlQuery, { address: "" });

  const featuresDataRequest = await fetch(
    "https://features.long.so/features.json",
  );
  const featuresData = await featuresDataRequest.json();

  return (
    <html lang="en">
      <Provider>
        <PopulateQueryCache data={data} featuresData={featuresData} />
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
                  <FeatureFlagConfig />
                  <DemoData />
                </div>
                <div className="flex flex-row items-center gap-4">
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
              <small>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com/fluidity-money/long.so/tree/development/audits"
                >
                  Audits
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
        </body>
      </Provider>
    </html>
  );
}
