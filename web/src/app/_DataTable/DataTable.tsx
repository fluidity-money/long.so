"use client";

import {
  ColumnDef,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg text-sm">
      <Table>
        <TableHeader className="[&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-0">
              {headerGroup.headers.map((header) => {
                if (!header.column.columnDef.header) return null;
                return (
                  <TableHead
                    key={header.id}
                    className="text-sm text-black"
                    colSpan={(header.column.columnDef as any).colSpan}
                  >
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
              const transactionHash = (row.original as any).transactionHash; // Access the transactionHash from row data
              const blockExplorerUrl = `https://testnet-explorer.superposition.so/tx/${transactionHash}`;
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group relative border-b-0 hover:bg-black hover:text-white"
                  // onClick={() => {
                  //   window.open(
                  //     blockExplorerUrl,
                  //     "_blank",
                  //     "noopener,noreferrer",
                  //   );
                  // }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                      {cell.column.getIndex() === 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              className="absolute inset-0"
                              disabled
                            />
                            <TooltipContent
                              side={"bottom"}
                              className="relative flex justify-center overflow-visible bg-black p-0 text-white"
                            >
                              <div className="absolute -top-1 z-20 border-x-4 border-b-4 border-transparent border-b-black" />
                              <a
                                href={blockExplorerUrl}
                                target="_blank"
                                className="px-3 py-1.5 text-xs"
                              >
                                See on block explorer{" "}
                                <span className="inline-block -rotate-45">
                                  -&gt;
                                </span>
                                {/* ↗️ */}
                              </a>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
