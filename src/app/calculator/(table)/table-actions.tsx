"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Column as ColumnInstance } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { ChevronsUpDownIcon, Trash2 } from "lucide-react";
import { useCalculatorStore } from "@/providers/calculator-store-provider";
import type { AppLocale } from "@/lib/i18n";

export function TableAction<TData>({
  locale,
  columns,
}: {
  locale: AppLocale;
  columns: ColumnInstance<TData>[];
}) {
  const { resetProjects } = useCalculatorStore((state) => state);
  const labelByColumnId: Record<string, string> = {
    name: locale === "pt" ? "Nome" : "Name",
    mark: locale === "pt" ? "Nota" : "Mark",
    bonus: locale === "pt" ? "Bónus da Coalizão" : "Coalition Bonus",
    "base experience": locale === "pt" ? "Experiência Base" : "Base Experience",
    "gained experience":
      locale === "pt" ? "Experiência Ganha" : "Gained Experience",
    level: locale === "pt" ? "Nível" : "Level",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Ellipsis className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer pr-2 pl-8"
          onClick={() => {
            resetProjects();
          }}
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <Trash2 className="size-4 transition-colors group-hover:stroke-destructive" />
          </span>
          <span className="transition-colors group-hover:text-destructive">
            {locale === "pt" ? "Repor projetos" : "Reset projects"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="cursor-pointer capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(value)}
          >
            {labelByColumnId[column.id] ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ToggleExpand<TData>({
  row,
  locale,
}: {
  row: Row<TData>;
  locale: AppLocale;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="group"
      onClick={row.getToggleExpandedHandler()}
      aria-label={locale === "pt" ? "Expandir linha" : "Expand row"}
    >
      <ChevronsUpDownIcon className="size-4" />
    </Button>
  );
}
