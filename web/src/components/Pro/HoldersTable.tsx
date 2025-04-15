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
import { useGetHolders, useGetTokenPrice } from "@/hooks/useGraphql";
import { useMemo } from "react";
import { requestGetHolders, Holder, requestGetTokenPrice } from "@/data";
import ArrowIcon from "@/assets/icons/arrow-up-right.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import Link from "next/link";
const columnHelper = createColumnHelper<Holder>();
const titleStyle = "text-gray-200 text-xs font-semibold";
const contentStyle = "text-xs font-medium";

export function HoldersTable({
  tokenAddress,
  initialData,
  initialTokenPriceData,
  networkId,
}: {
  tokenAddress: string;
  initialData: Awaited<ReturnType<typeof requestGetHolders>>;
  initialTokenPriceData: Awaited<ReturnType<typeof requestGetTokenPrice>>;
  networkId: number;
}) {
  const {
    data,
    //  hasNextPage, fetchNextPage
  } = useGetHolders({ tokenAddress, initialData, networkId });
  const { data: tokenPrice } = useGetTokenPrice({
    tokenAddress,
    initialData: initialTokenPriceData,
    networkId,
  });
  const columns = useMemo(
    () => [
      {
        id: "idx",
        header: () => <span className={titleStyle}>#</span>,
        cell: (p: { row: { index: number } }) => (
          <span className={contentStyle}>{p.row.index + 1}</span>
        ),
      },
      columnHelper.accessor("address", {
        header: () => <span className={titleStyle}>Address</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue()}</span>
        ),
      }),
      columnHelper.accessor("percentage", {
        header: () => <span className={titleStyle}>%</span>,
        cell: ({ cell }) => (
          <span className={contentStyle}>{cell.getValue() + "%"}</span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: () => <span className={titleStyle}>Amount</span>,
        cell: ({ cell, row }) => (
          <div className="flex items-center gap-2">
            <div className="relative h-3 w-32 overflow-hidden rounded-sm bg-black">
              <div
                className="absolute inset-0 h-3 bg-green-200"
                style={{
                  width: `${row.getValue("percentage")}%`,
                }}
              />
            </div>
            <span className={contentStyle}>{cell.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("value", {
        header: () => <span className={titleStyle}>Value (USD)</span>,
        cell: ({ row }) => (
          <span className={contentStyle}>
            {"$" +
              ((row.getValue("amount") as number) * tokenPrice!).toFixed(2)}
          </span>
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
    ],
    [tokenPrice],
  );
  const events = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data],
  );
  const table = useReactTable({
    data: events,
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
