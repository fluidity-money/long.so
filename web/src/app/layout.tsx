import { StyleLayout } from "@/app/StyleLayout";
import { Provider } from "@/app/Provider";
import { Metadata } from "next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <StyleLayout>{children}</StyleLayout>
      </Provider>
    </html>
  );
}
