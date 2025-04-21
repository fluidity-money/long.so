"use client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useBalances, useGetTokensInfo } from "@/hooks/useGraphql";
import { useMemo } from "react";
import { Balance } from "@/data";
import ArrowIcon from "@/assets/icons/arrow-up-right.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import Link from "next/link";
import CopyIcon from "@/assets/icons/copy.svg";
import { useAppKitAccount } from "@reown/appkit/react";
const columnHelper = createColumnHelper<Balance>();
const titleStyle = "text-gray-200 text-xs font-semibold";
const contentStyle = "text-xs font-medium";
const columns = [
  columnHelper.accessor("name", {
    header: () => <span className={titleStyle}>Name</span>,
    cell: ({ cell }) => <span className={contentStyle}>{cell.getValue()}</span>,
  }),
  columnHelper.accessor("symbol", {
    header: () => <span className={titleStyle}>Symbol</span>,
    cell: ({ cell }) => <span className={contentStyle}>{cell.getValue()}</span>,
  }),
  columnHelper.accessor("address", {
    header: () => <span className={titleStyle}>Address</span>,
    cell: ({ cell }) => (
      <div
        className={cn(
          contentStyle,
          "text-green inline-flex items-center gap-1 rounded-full bg-black px-2 py-0.5",
        )}
      >
        <span className="text-green-light">
          {cell.getValue().slice(0, 6)}...{cell.getValue().slice(-6)}
        </span>
        <CopyIcon className="size-3 text-white" />
      </div>
    ),
  }),
  columnHelper.accessor("balance", {
    header: () => <span className={titleStyle}>Balance</span>,
    cell: ({ cell }) => (
      <span className={contentStyle}>{cell.getValue() + "%"}</span>
    ),
  }),
  columnHelper.accessor("usdValue", {
    header: () => <span className={titleStyle}>USD Value</span>,
    cell: ({ cell }) => (
      <span className={contentStyle}>{"$" + cell.getValue()}</span>
    ),
  }),
  {
    id: "actions",
    header: () => <span className={titleStyle}>Actions</span>,
    cell: () => (
      <div className="flex justify-end gap-2 pr-2">
        <FilterIcon className="size-3 text-white" />
        <Link href={"#"}>
          <ArrowIcon className="size-3 text-white" />
        </Link>
      </div>
    ),
  },
];
export function BalancesTable({ networkId }: { networkId: number }) {
  const { address } = useAppKitAccount();
  const { data: balanceData } = useBalances({
    walletAddress: address,
    networkId,
  });
  const balances = useMemo(
    () => balanceData?.pages?.flatMap((page) => page.items) ?? [],
    [balanceData],
  );
  const tokenAddresses = balances.map((item) => item.tokenId.split(":")[0]);
  const { data: tokensInfo } = useGetTokensInfo({ networkId, tokenAddresses });
  const data = useMemo(
    () =>
      balances.map((item) => {
        const tokenInfo = tokensInfo?.find(
          (tokenItem) =>
            tokenItem?.token?.address === item.tokenId.split(":")[0],
        );
        return {
          name: tokenInfo?.token?.name,
          address: item.tokenId.split(":")[0],
          balance: item.shiftedBalance,
          usdValue: tokenInfo?.priceUSD,
        } as Balance;
      }),
    [balances, tokensInfo],
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table className="absolute inset-0 overflow-y-auto">
      <TableHeader className="sticky top-0 z-[99] bg-black shadow-[0px_0.5px_0px_white]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (!header.column.columnDef.header) return null;
              return (
                <TableHead key={header.id} className="h-auto py-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                className={cn("border-0 text-white hover:bg-black")}
              >
                {row
                  .getVisibleCells()
                  .filter((cell) => cell.getValue() !== null)
                  .map((cell) => {
                    return (
                      <TableCell key={cell.id} className={cn("px-0 py-2")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-gray-200"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
