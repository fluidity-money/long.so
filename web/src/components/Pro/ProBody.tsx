"use client";
import DataScene from "./DataScene";
import Chart from "./Chart";
import { requestGetHolders, requestGetTokenEvents } from "@/data";
import { useEffect, useRef } from "react";
import interact from "interactjs";
import ResizeVerticalIcon from "@/assets/icons/sort.svg";
export default function ProBody({
  tokenName,
  quoteToken,
  poolAddress,
  initialEventsData,
  initialHoldersData,
  networkId,
  tokenAddress,
}: {
  tokenName: string;
  quoteToken: "0" | "1";
  poolAddress: string;
  tokenAddress: string;
  initialEventsData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
  initialHoldersData: Awaited<ReturnType<typeof requestGetHolders>>;
  networkId: number;
}) {
  const tableContainerRef = useRef(null);
  useEffect(() => {
    if (tableContainerRef.current) {
      interact(tableContainerRef.current).resizable({
        edges: { top: true },
        listeners: {
          move(event) {
            const target = event.target;
            let height = parseFloat(target.style.height) || target.offsetHeight;
            let top = parseFloat(target.style.top) || 0;
            height -= event.dy;
            top += event.dy;
            if (height < 100) {
              height = 100;
            } else {
              target.style.top = `${top}px`;
            }
            target.style.height = `${height}px`;
          },
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: "parent",
          }),
          interact.modifiers.restrictSize({
            min: { width: 0, height: 100 },
          }),
        ],
        inertia: true,
      });
    }
  }, []);
  return (
    <>
      <div className="flex grow items-center justify-center rounded-lg bg-white/10 text-white">
        <Chart quoteToken={quoteToken} />
      </div>
      <div className="flex h-[300px] flex-col gap-2" ref={tableContainerRef}>
        <div className="flex h-0.5 items-center">
          <div className="h-0.5 grow bg-white/20" />
          <ResizeVerticalIcon className="mx-2 size-3 bg-[#000] text-white/20" />
          <div className="h-0.5 grow bg-white/20" />
        </div>
        <DataScene
          quoteToken={quoteToken}
          networkId={networkId}
          tokenName={tokenName}
          tokenAddress={tokenAddress}
          poolAddress={poolAddress}
          initialHoldersData={initialHoldersData}
          initialEventsData={initialEventsData}
        />
      </div>
    </>
  );
}
