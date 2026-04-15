"use client";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { AppLocale } from "@/lib/i18n";
import {
  type Table as TableInstance,
  flexRender,
  type Row,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { AddProject } from "../(project)/project-add";

function DataTableAddProject({
  locale,
  columnCount,
}: {
  locale: AppLocale;
  columnCount: number;
}) {
  return (
    <TableRow className="hover:bg-inherit">
      <TableCell
        colSpan={columnCount}
        className="h-24 text-center"
      >
        <AddProject locale={locale} />
      </TableCell>
    </TableRow>
  );
}

function DataTableProject<TData>({
  table,
  row,
}: { table: TableInstance<TData>; row: Row<TData> }) {
  return (
    <>
      <TableRow>
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(
              table.options.meta?.className,
              cell.column.columnDef.meta?.className,
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      {row.subRows.map((subRow) => {
        if (!subRow.getIsExpanded()) {
          return null;
        }

        return (
          <DataTableProject
            key={subRow.id}
            table={table}
            row={subRow}
          />
        );
      })}
    </>
  );
}

export function DataTableBody<TData>({
  table,
  locale,
}: {
  table: TableInstance<TData>;
  locale: AppLocale;
}) {
  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <DataTableProject
          key={row.id}
          table={table}
          row={row}
        />
      ))}
      <DataTableAddProject
        locale={locale}
        columnCount={table.getVisibleFlatColumns().length}
      />
    </TableBody>
  );
}
