"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PoolPage() {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-center">
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
  );
}
