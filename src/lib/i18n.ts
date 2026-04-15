import { cookies, headers } from "next/headers";

export const appLocales = ["pt", "en"] as const;
export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "en";

function normalizeLocale(value?: string | null): AppLocale | undefined {
  if (!value) {
    return undefined;
  }

  const candidate = value.toLowerCase().split(",")[0]?.trim();
  if (candidate?.startsWith("pt")) {
    return "pt";
  }

  if (candidate?.startsWith("en")) {
    return "en";
  }

  return undefined;
}

export async function getRequestLocale(): Promise<AppLocale> {
  try {
    const cookieStore = await cookies();
    const fromCookie = normalizeLocale(cookieStore.get("locale")?.value);
    if (fromCookie) {
      return fromCookie;
    }

    const headerStore = await headers();
    const fromHeader = normalizeLocale(headerStore.get("accept-language"));
    return fromHeader ?? defaultLocale;
  } catch {
    return defaultLocale;
  }
}
