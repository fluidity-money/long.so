import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-white", inter.className)}>
      <div className="iridescent-blur absolute top-[180px] left-1/2 size-full max-h-[305px] max-w-[557px] -translate-x-1/2" />
      <Header />
      <main className={"z-10 flex flex-1 flex-col"}>{children}</main>
      <Footer />
    </div>
  );
}
