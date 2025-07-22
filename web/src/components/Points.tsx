"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import PointsIcon from "#/icons/points.svg";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import Hourglass from "@/assets/icons/hourglass.svg";
import { usePointsGraph } from "@/hooks/useGraphql";
export default function Points() {
  const { data: html, isLoading, isError } = usePointsGraph();

  const PlaceholderDiv = ({ children }: { children: React.ReactNode }) => (
    <div className="flex size-[200px] flex-col items-center justify-center rounded-[8px] bg-black">
      {children}
    </div>
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="group">
        <Badge
          className={
            "h-[28px] rounded-2xl px-0.5 pr-2 transition-[width] group-data-[state=open]:border-b-0 md:inline-flex"
          }
        >
          <div className="flex flex-row items-center">
            <div className="mx-2">
              <PointsIcon width={18} height={18} />
            </div>
            <div className="text-nowrap">Points</div>
            <div className="ml-2 hidden w-0 transition-[width] group-hover:inline-flex group-hover:w-2 group-data-[state=open]:inline-flex group-data-[state=open]:w-2">
              <ArrowDown width={10} height={6} className={"invert"} />
            </div>
          </div>
        </Badge>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={5}>
          <div>
            {isLoading ? (
              <PlaceholderDiv>
                <Hourglass
                  className="animate-rotate180"
                  width={20}
                  height={20}
                />
              </PlaceholderDiv>
            ) : isError || !html ? (
              <PlaceholderDiv>
                <p className="rotate-90 text-base font-bold text-white">
                  {":("}
                </p>
                <p className="text-xs text-white">
                  {"Ups,\n something went wrong "}
                </p>
              </PlaceholderDiv>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="overflow-hidden rounded-[8px]"
              />
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
