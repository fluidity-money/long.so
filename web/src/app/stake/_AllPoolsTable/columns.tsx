import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { usdFormat } from "@/lib/usdFormat";
import { Button } from "@/components/ui/button";

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
};

export const columns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokens",
    header: "Pair",
    cell: ({ row }) => {
      return (
        <Badge>
          {row.original.tokens[0].name} {row.original.tokens[1].name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalValueLocked",
    header: "TVL",
    cell: ({ row }) => {
      return usdFormat(row.original.totalValueLocked);
    },
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      return usdFormat(row.original.fees);
    },
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ row }) => {
      return usdFormat(row.original.volume);
    },
  },
  {
    accessorKey: "rewards",
    header: "Rewards",
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
    header: "APY",
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
          <Button size="sm">+</Button>
          <Button size="sm">Claim</Button>
        </div>
      );
    },
  },
];
