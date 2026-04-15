"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppLocale } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";

export interface LanguageToggleProps {
  locale: AppLocale;
}

export default function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter();

  const setLocale = (value: AppLocale) => {
    document.cookie = `locale=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex"
        >
          <Languages className="mr-2 size-4" />
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("pt")}>Português</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("en")}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
