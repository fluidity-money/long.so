"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Token } from "@/components";
import { usdFormat } from "@/lib/usdFormat";

export type Transaction = {
  id: string;
  value: number;
  rewards: number;
  time: Date;
  amountFrom: number;
  amountTo: number;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => usdFormat(row.original.value),
  },
  {
    id: "amount",
    header: () => <div className="font-bold">ƒUSDC/ETH</div>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <Token size="small" />
          {row.original.amountFrom} {"->"} <Token size="small" />
          {row.original.amountTo}
        </div>
      );
    },
  },
  {
    accessorKey: "rewards",
    header: "Rewards",
    cell: ({ row }) => {
      return (
        <Badge className="pl-0.5">
          <Token size="small" />
          <div className="ml-2">{row.original.rewards}</div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      return `${formatDistanceToNow(row.original.time)} ago`;
    },
  },
];
