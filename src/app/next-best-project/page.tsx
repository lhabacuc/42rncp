import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFortyTwoCursus } from "@/lib/forty-two/cursus";
import {
  getNextBestProjects,
  type NextBestProjectRecommendation,
} from "@/lib/forty-two/next-best-project";
import { getFortyTwoTitles } from "@/lib/forty-two/forty-two-rncp";
import { getRequestLocale, type AppLocale } from "@/lib/i18n";
import { translateRncpTitle } from "../rncp/translations";

function priorityLabel(score: number, locale: AppLocale): string {
  if (score >= 1.2) {
    return locale === "pt" ? "Prioridade alta" : "High priority";
  }

  if (score >= 0.8) {
    return locale === "pt" ? "Prioridade média" : "Medium priority";
  }

  return locale === "pt" ? "Prioridade baixa" : "Low priority";
}

function translateTrack(track: string, locale: AppLocale): string {
  if (track === "Suite") {
    return "Suite";
  }

  return translateRncpTitle(track, locale);
}

function NextBestCard({
  locale,
  recommendation,
  index,
}: {
  locale: AppLocale;
  recommendation: NextBestProjectRecommendation;
  index: number;
}) {
  const { project, score, pathNeeds, inProgress } = recommendation;

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle tag="h2" className="text-lg">
              #{index + 1} - {project.name}
            </CardTitle>
            <CardDescription>
              {(project.experience || 0).toLocaleString()} XP
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant="secondary">{priorityLabel(score, locale)}</Badge>
            {inProgress && (
              <Badge>
                {locale === "pt" ? "Já em progresso" : "Already in progress"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          {locale === "pt"
            ? "Este projeto contribui para estas trilhas RNCP ainda incompletas:"
            : "This project contributes to these unfinished RNCP tracks:"}
        </p>

        <div className="space-y-2">
          {pathNeeds.slice(0, 3).map((pathNeed) => (
            <div
              key={`${pathNeed.title}-${pathNeed.track}`}
              className="rounded-md border border-border/50 bg-muted/20 px-3 py-2"
            >
              <p className="font-medium text-sm">
                {translateRncpTitle(pathNeed.title, locale)} • {translateTrack(pathNeed.track, locale)}
              </p>
              <p className="text-muted-foreground text-xs">
                {locale === "pt"
                  ? `${pathNeed.validatedProjects}/${pathNeed.requiredProjects} projetos validados nesta trilha`
                  : `${pathNeed.validatedProjects}/${pathNeed.requiredProjects} projects validated in this track`}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function NextBestProjectPage() {
  const [locale, cursus, titles] = await Promise.all([
    getRequestLocale(),
    getFortyTwoCursus(),
    getFortyTwoTitles(),
  ]);

  const recommendations = cursus
    ? getNextBestProjects({ cursus, titles, maxResults: 10 })
    : [];

  return (
    <main className="@container flex grow items-start justify-center p-4 md:p-12 lg:p-24">
      <Card className="@max-[1400px]:w-full @min-[1400px]:w-[1400px] bg-card/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle tag="h1">
            {locale === "pt" ? "Next Best Project" : "Next Best Project"}
          </CardTitle>
          <CardDescription>
            {locale === "pt"
              ? "Projetos recomendados para acelerar seu progresso no RNCP."
              : "Recommended projects to accelerate your RNCP progress."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-4 md:p-6">
          {!cursus && (
            <p className="text-muted-foreground text-sm">
              {locale === "pt"
                ? "Não foi possível carregar os dados do seu cursus."
                : "Could not load your cursus data."}
            </p>
          )}

          {cursus && recommendations.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {locale === "pt"
                ? "Nenhuma recomendação encontrada. Você pode já ter concluído os requisitos principais."
                : "No recommendation found. You may already have completed the main requirements."}
            </p>
          )}

          {recommendations.map((recommendation, index) => (
            <NextBestCard
              key={recommendation.project.id}
              locale={locale}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
