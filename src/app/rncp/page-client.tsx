"use client";

import type { AppLocale } from "@/lib/i18n";
import { useFortyTwoStore } from "@/providers/forty-two-store-provider";
import type { FortyTwoTitle } from "@/types/forty-two";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useState } from "react";
import { TitleOptions } from "./(options)/options";
import { TitleOverview } from "./(options)/overview";
import { TitleRequirements } from "./(options)/requirements";
import { TitleSelector } from "./selector";
import { Separator } from "@/components/ui/separator";

export default function TitlesClient({ locale }: { locale: AppLocale }) {
  const { titles } = useFortyTwoStore((state) => state);
  const [activeTitle, _setActiveTitle] = useState<FortyTwoTitle | null>(
    titles[0] ?? null,
  );

  const setActiveTitle = (title: FortyTwoTitle | null) => {
    if (!title) {
      return;
    }

    _setActiveTitle(title);

    track("rncp-title-switched", {
      title: title?.title,
    });
  };

  if (!activeTitle) {
    return null;
  }

  return (
    <div className="space-y-8">
      <TitleSelector
        locale={locale}
        titles={titles}
        activeTitle={activeTitle}
        setActiveTitle={setActiveTitle}
      />

      <Separator />

      <div className="space-y-1.5">
        <h4 className="font-semibold text-2xl leading-none tracking-tight">
          {locale === "pt" ? "Informação" : "Information"}
        </h4>

        <p className="max-w-4xl text-muted-foreground text-sm">
          {locale === "pt"
            ? "Você deve validar a aba 'Suite', uma das abas de opção e os requisitos."
            : "You must validate the 'Suite' tab, one of the option tabs, and the requirements."}{" "}
          <Link
            className="underline underline-offset-1 transition-colors hover:text-foreground"
            prefetch={false}
            href="https://meta.intra.42.fr/articles/rncp-7-certificate"
          >
            {locale === "pt" ? "Saiba mais." : "Learn more."}
          </Link>
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <TitleOverview
          locale={locale}
          title={activeTitle}
          className="xl:col-span-3"
        />
        <TitleRequirements
          locale={locale}
          title={activeTitle}
          className="xl:col-span-2"
        />
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-xl leading-none tracking-tight">
          {locale === "pt" ? "Opções e Suite" : "Options and Suite"}
        </h4>
        <p className="text-muted-foreground text-sm">
          {locale === "pt"
            ? "Navegue pelas opções para ver progresso e projetos por trilha."
            : "Browse options to see progress and projects by track."}
        </p>
      </div>

      <TitleOptions
        locale={locale}
        title={activeTitle}
      />
    </div>
  );
}
