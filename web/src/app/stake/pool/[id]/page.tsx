"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SwapPro } from "@/app/SwapPro";

export default function PoolPage() {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col">
      <div className="flex max-w-full flex-col-reverse justify-center gap-8 lg:flex-row">
        <SwapPro override />

        <div className="flex flex-col items-center">
          <div className="z-10 flex flex-col">
            <div className="w-[300px] rounded-lg bg-black p-2 text-white">
              <div className="flex flex-row items-center justify-between">
                Manage Pool
                <Button
                  variant="secondary"
                  className="px-1"
                  onClick={() => {
                    router.back();
                  }}
                >
                  {"<-"} Esc
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
