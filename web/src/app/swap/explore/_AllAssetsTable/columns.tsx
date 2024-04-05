import { ColumnDef } from "@tanstack/react-table";
import { usdFormat } from "@/lib/usdFormat";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict } from "date-fns";
import Hourglass from "@/assets/icons/hourglass.svg";
import IridescentPickaxe from "@/assets/icons/iridescent-pickaxe.svg";
import IridescentToken from "@/assets/icons/token-iridescent.svg";
import Token from "@/assets/icons/token.svg";
import { cn } from "@/lib/utils";

export type Asset = {
  name?: string;
  address: string;
  symbol: string;
  amount: number;
  amountUSD: number;
  boostedEndDate?: Date;
};

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "symbol",
    header: "Token",
    cell: ({ row }) => {
      return (
        <div className={"flex flex-row items-center gap-2 py-1"}>
          {row.original.boostedEndDate ? (
            <IridescentToken className={"size-[22px]"} />
          ) : (
            <Token className={"size-[22px]"} />
          )}
          <div className={"flex flex-col"}>
            <div
              className={cn("text-xs md:text-sm", {
                "iridescent-text": row.original.boostedEndDate,
              })}
            >
              {row.original.symbol}
            </div>
            {row.original.boostedEndDate && (
              <div className={"flex flex-row items-center"}>
                <IridescentPickaxe className={"size-[12px]"} />
                <Badge
                  variant={"iridescent"}
                  className={
                    "-ml-0.5 h-3 items-center border-black px-0.5 text-[8px]"
                  }
                >
                  <Hourglass className={"size-[11px] invert"} />
                  {formatDistanceToNowStrict(row.original.boostedEndDate)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name/Address",
    cell: ({ row }) => {
      return row.original.name ?? row.original.address;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div className={"flex flex-col items-end"}>
          <div>{row.original.amount}</div>
          <div className={"-mt-1.5 text-[8px] text-neutral-400 md:-mt-1"}>
            ({usdFormat(row.original.amountUSD)})
          </div>
        </div>
      );
    },
  },
];
