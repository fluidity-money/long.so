"use client";
import DataScene from "./DataScene";
import Chart from "./Chart";
import { requestGetTokenEvents } from "@/data";
import { useEffect, useRef } from "react";
import interact from "interactjs";

export default function ProBody({
  name,
  quoteToken,
  poolAddress,
  initialData,
}: {
  name: string;
  quoteToken: "0" | "1";
  poolAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetTokenEvents>>;
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
      <div
        className="flex h-[300px] border-t-2 border-t-white/10 pt-2"
        ref={tableContainerRef}
      >
        <DataScene
          quoteToken={quoteToken}
          name={name}
          poolAddress={poolAddress}
          initialData={initialData}
        />
      </div>
    </>
  );
}
