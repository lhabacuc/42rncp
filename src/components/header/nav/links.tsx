import type { AppLocale } from "@/lib/i18n";

export interface NavLink {
  text: string;
  href: string;
  className?: string;
  isProtected?: boolean;
}

export function getNavLinks(locale: AppLocale): NavLink[] {
  return [
    {
      text: "42calculator",
      href: "/",
      className: "font-semibold text-foreground",
    },
    {
      text: locale === "pt" ? "Calculadora" : "Calculator",
      href: "/calculator",
      isProtected: true,
    },
    {
      text: "RNCP",
      href: "/rncp",
      isProtected: true,
    },
    {
      text: locale === "pt" ? "Next Best Project" : "Next Best Project",
      href: "/next-best-project",
      isProtected: true,
    },
  ];
}
