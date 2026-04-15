import { getRequestLocale } from "@/lib/i18n";
import TitlesClient from "./page-client";

export default async function TitlesPage() {
  const locale = await getRequestLocale();

  return <TitlesClient locale={locale} />;
}
