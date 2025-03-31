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
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  isSuccess: boolean;
}
export function DataTablePro<TData, TValue>({
  columns,
  data,
  isLoading,
  isSuccess,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader className="sticky top-0 border-b border-b-white bg-black">
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
        {isLoading || (!isSuccess && !data.length) ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-gray-200"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                className="border-0 hover:bg-black hover:text-white"
              >
                {row
                  .getVisibleCells()
                  .filter((c) => !!c.getValue())
                  .map((cell) => (
                    <TableCell
                      colSpan={
                        cell.id === "price" && row.getValue("type") !== "swap"
                          ? 3
                          : undefined
                      }
                      key={cell.id}
                      className="px-0 py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
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
