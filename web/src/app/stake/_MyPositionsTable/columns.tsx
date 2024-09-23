import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import { Button } from "@/components/ui/button";
import TokenIridescent from "@/assets/icons/token-iridescent.svg";
import { TokenIcon } from "@/components/TokenIcon";
import { Token } from "@/config/tokens";
import { formatDuration, intervalToDuration } from "date-fns";
import { LiquidityCampaign } from "@/hooks/usePostions";

// this is a misnomer - it represents a position and its corresponding pool
export type Pool = {
  id: string;
  positionId: number;
  tokens: [Token, Token];
  duration: number;
  staked: number;
  totalYield: number;
  isVested: boolean;
  liquidityCampaigns: LiquidityCampaign[];
};

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokens",
    header: "Pool",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <TokenIcon
            src={row.original.tokens[0].icon}
            className="size-[20px]"
          />
          <TokenIridescent
            className={"-ml-4 size-[20px] rounded-full border border-black"}
          />
          {row.original.tokens[0].name}
          {" x "}
          {row.original.tokens[1].name}
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      if (row.original.duration < 1000) return "0 seconds";
      const duration = intervalToDuration({
        start: 0,
        end: row.original.duration,
      });
      // durations are formatted as 12 years, 5 seconds, etc.
      // so take the first two words to take the largest unit of the duration
      return formatDuration(duration).split(" ").slice(0, 2).join(" ");
    },
  },
  {
    accessorKey: "staked",
    header: "Staked",
    cell: ({ row }) => {
      return `${usdFormat(row.original.staked)}`;
    },
  },
  {
    accessorKey: "totalYield",
    header: "Total Yield",
    cell: ({ row }) => {
      return (
        <Badge variant="iridescent" className="h-4 px-1 text-2xs">
          {usdFormat(row.original.totalYield)}
        </Badge>
      );
    },
  },
  {
    id: "manage",
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          variant={"link"}
          className="hidden h-6 p-0 text-2xs text-white hover:no-underline md:inline-flex"
          size={"sm"}
        >
          <span className="mr-2 underline">Manage</span> {"->"}
        </Button>
      );
    },
  },
];
