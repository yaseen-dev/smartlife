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
  emptyMessage = "No results found.",
  isLoading = false
}) {
  return (
    <div className={cn("rounded-md border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
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
                  <TableCell key={column.key}>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-72 text-center"
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
    </div>
  );
}
