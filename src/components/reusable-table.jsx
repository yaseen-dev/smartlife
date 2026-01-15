"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export default function ReusableTable({ 
  columns, 
  data = [], 
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  emptyMessage = "No results found.",
  isLoading = false,
  footer
}) {
  return (
    <div className={cn("rounded-md border bg-card flex flex-col", className)}>
      <Table className={tableClassName}>
        <TableHeader className={headerClassName}>
          <TableRow className="hover:bg-transparent border-none">
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={cn("px-4", column.headerClassName || "text-muted-foreground")}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-4">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={rowClassName}>
                {columns.map((column) => (
                  <TableCell 
                    key={column.key} 
                    className={cn("px-4", column.className || cellClassName)}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-[200px] text-center px-4"
              >
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Inbox className="h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {footer && (
        <div className="mt-auto border-t">
          {footer}
        </div>
      )}
    </div>
  );
}
