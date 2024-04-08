import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import { Button } from "@/components/ui/button";
import Sort from "@/assets/icons/sort.svg";
import Link from "next/link";

export type Token = {
  name: string;
};

export type Pool = {
  id: string;
  tokens: [Token, Token];
  totalValueLocked: number;
  fees: number;
  volume: number;
  rewards: number;
  annualPercentageYield: number;
  claimable: boolean;
  boosted?: boolean;
};

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokens",
    header: "Pair",
    cell: ({ row }) => {
      return (
        <Badge className="text-2xs md:text-xs">
          {row.original.tokens[0].name} {row.original.tokens[1].name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalValueLocked",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TVL
          <Sort className="ml-2 size-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      return usdFormat(row.original.totalValueLocked);
    },
  },
  {
    accessorKey: "fees",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fees
          <Sort className="ml-2 size-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      return usdFormat(row.original.fees);
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Volume
          <Sort className="ml-2 size-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      return usdFormat(row.original.volume);
    },
  },
  {
    accessorKey: "rewards",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rewards
          <Sort className="ml-2 size-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge className="group-hover:invert">
          {usdFormat(row.original.rewards)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "annualPercentageYield",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer flex-row items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          APY
          <Sort className="ml-2 size-3" />
        </div>
      );
    },
    cell: ({ row }) => {
      return `${row.original.annualPercentageYield.toFixed(2)}%`;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2 group-hover:invert">
          <Link href={`/stake/pool/${row.original.id}/add-liquidity`}>
            <Button size="sm" className="h-[29px] text-2xs md:text-xs">
              +
            </Button>
          </Link>
          {row.original.claimable && (
            <Button size="sm" className="h-[29px] text-2xs md:text-xs">
              Claim
            </Button>
          )}
        </div>
      );
    },
  },
];
