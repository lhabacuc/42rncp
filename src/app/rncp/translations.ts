import type { AppLocale } from "@/lib/i18n";

const rncpTitleTranslations: Record<string, { pt: string; en: string }> = {
  "Développement web et mobile": {
    pt: "Desenvolvimento web e mobile",
    en: "Web and mobile development",
  },
  "Développement applicatif": {
    pt: "Desenvolvimento de aplicações",
    en: "Application development",
  },
  "Système d'information et réseaux": {
    pt: "Sistemas de informação e redes",
    en: "Information systems and networks",
  },
  "Architecture des bases de données et data": {
    pt: "Arquitetura de bases de dados e dados",
    en: "Database and data architecture",
  },
};

export function translateRncpTitle(title: string, locale: AppLocale): string {
  if (locale === "en" || locale === "pt") {
    return rncpTitleTranslations[title]?.[locale] ?? title;
  }

  return title;
}
