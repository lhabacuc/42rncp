"use client";

import {
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { type Table as TableInstance, flexRender } from "@tanstack/react-table";
import { StartLevel } from "../(project)/project-actions";

export function DataTableHeader<TData>({
  table,
  locale,
}: {
  table: TableInstance<TData>;
  locale: AppLocale;
}) {
  return (
    <>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead
            colSpan={table.getVisibleFlatColumns().length - 2}
            className={cn(table.options.meta?.className, "text-inherit")}
          >
            {locale === "pt" ? "Nível inicial" : "Start level"}
          </TableHead>
          <TableHead
            colSpan={2}
            className={cn(
              table.options.meta?.className,
              "text-right font-semibold text-inherit md:px-1",
            )}
          >
            <StartLevel locale={locale} />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    table.options.meta?.className,
                    header.column.columnDef.meta?.className,
                  )}
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
    </>
  );
}

export function DataTableFooter<TData>({
  table,
  levelEnd,
  locale,
}: {
  table: TableInstance<TData>;
  levelEnd: number;
  locale: AppLocale;
}) {
  return (
    <>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={table.getVisibleFlatColumns().length - 2}>
            {locale === "pt" ? "Nível final" : "End level"}
          </TableCell>
          <TableCell
            colSpan={2}
            className="text-right font-semibold"
          >
            {levelEnd.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </>
  );
}
