"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AppLocale } from "@/lib/i18n";
import { useFortyTwoStore } from "@/providers/forty-two-store-provider";
import type {
  FortyTwoCursus,
  FortyTwoProject,
  FortyTwoTitle,
  FortyTwoTitleOption,
} from "@/types/forty-two";

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function computeOptionProgress(
  option: FortyTwoTitleOption,
  cursus: FortyTwoCursus,
): { completion: number; validatedProjects: number; experience: number } {
  function walk(project: FortyTwoProject): { projects: number; experience: number } {
    const userProject = cursus.projects[project.id];
    if (!userProject) {
      return { projects: 0, experience: 0 };
    }

    let projects = 0;
    let experience = 0;

    for (const child of userProject.children) {
      const childResult = walk(child);
      projects += childResult.projects;
      experience += childResult.experience;
    }

    if (userProject.is_validated) {
      projects += 1;
      experience += (project.experience || 0) * ((userProject.mark || 0) / 100);
    }

    return { projects, experience };
  }

  let validatedProjects = 0;
  let experience = 0;

  for (const project of Object.values(option.projects)) {
    const result = walk(project);
    validatedProjects += result.projects;
    experience += result.experience;
  }

  const projectRatio =
    option.numberOfProjects > 0 ? validatedProjects / option.numberOfProjects : 1;
  const experienceRatio =
    option.experience > 0 ? experience / option.experience : projectRatio;
  const completion =
    option.experience > 0 ? (projectRatio + experienceRatio) / 2 : projectRatio;

  return { completion, validatedProjects, experience };
}

function countValidatedProjects(
  projects: Record<number, FortyTwoProject>,
  cursus: FortyTwoCursus,
): number {
  const visited = new Set<number>();

  function walk(project: FortyTwoProject): number {
    if (visited.has(project.id)) {
      return 0;
    }
    visited.add(project.id);

    let total = cursus.projects[project.id]?.is_validated ? 1 : 0;
    for (const child of project.children) {
      total += walk(child);
    }
    return total;
  }

  let count = 0;
  for (const project of Object.values(projects)) {
    count += walk(project);
  }
  return count;
}

export function TitleOverview({
  locale,
  title,
  className,
}: {
  locale: AppLocale;
  title: FortyTwoTitle;
  className?: string;
}) {
  const { cursus } = useFortyTwoStore((state) => state);

  const professionalExperiences = Object.values(cursus.projects).filter(
    (project) => title.experience[project.id] !== undefined && project.is_validated,
  ).length;

  const levelRatio = title.level > 0 ? cursus.level / title.level : 1;
  const eventsRatio =
    title.numberOfEvents > 0 ? cursus.events / title.numberOfEvents : 1;
  const experienceRatio =
    title.numberOfExperiences > 0
      ? professionalExperiences / title.numberOfExperiences
      : 1;
  const requirementsRatio = (levelRatio + eventsRatio + experienceRatio) / 3;

  const suiteValidated = countValidatedProjects(title.suite, cursus);
  const suiteRatio = title.numberOfSuite > 0 ? suiteValidated / title.numberOfSuite : 1;

  const optionProgress = title.options.map((option) => ({
    option,
    ...computeOptionProgress(option, cursus),
  }));
  const bestOption = optionProgress.reduce(
    (best, current) => (current.completion > best.completion ? current : best),
    optionProgress[0] ?? {
      option: {
        title: locale === "pt" ? "Opção" : "Option",
        experience: 0,
        numberOfProjects: 0,
        projects: {},
      },
      completion: 0,
      validatedProjects: 0,
      experience: 0,
    },
  );

  const overallRatio =
    (Math.min(requirementsRatio, 1) +
      Math.min(suiteRatio, 1) +
      Math.min(bestOption.completion, 1)) /
    3;

  const missingItems: string[] = [];
  if (cursus.level < title.level) {
    const missing = (title.level - cursus.level).toFixed(2);
    missingItems.push(
      locale === "pt"
        ? `Faltam ${missing} níveis.`
        : `${missing} levels are missing.`,
    );
  }
  if (cursus.events < title.numberOfEvents) {
    const missing = title.numberOfEvents - cursus.events;
    missingItems.push(
      locale === "pt"
        ? `Faltam ${missing} eventos.`
        : `${missing} events are missing.`,
    );
  }
  if (professionalExperiences < title.numberOfExperiences) {
    const missing = title.numberOfExperiences - professionalExperiences;
    missingItems.push(
      locale === "pt"
        ? `Faltam ${missing} experiências profissionais.`
        : `${missing} professional experiences are missing.`,
    );
  }
  if (suiteValidated < title.numberOfSuite) {
    const missing = title.numberOfSuite - suiteValidated;
    missingItems.push(
      locale === "pt"
        ? `Faltam ${missing} projetos na aba Suite.`
        : `${missing} projects are missing in the Suite tab.`,
    );
  }
  if (bestOption.option.numberOfProjects > bestOption.validatedProjects) {
    const missing = bestOption.option.numberOfProjects - bestOption.validatedProjects;
    missingItems.push(
      locale === "pt"
        ? `Na opção "${bestOption.option.title}", faltam ${missing} projetos.`
        : `In "${bestOption.option.title}", ${missing} projects are missing.`,
    );
  }
  if (bestOption.option.experience > bestOption.experience) {
    const missing = (bestOption.option.experience - bestOption.experience).toFixed(0);
    missingItems.push(
      locale === "pt"
        ? `Na opção "${bestOption.option.title}", faltam ${missing} XP.`
        : `In "${bestOption.option.title}", ${missing} XP are missing.`,
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle tag="h3" className="text-xl">
          {locale === "pt" ? "Resumo RNCP" : "RNCP Overview"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{locale === "pt" ? "Progresso geral" : "Overall progress"}</span>
            <span className="font-medium">{clampPercent(overallRatio * 100).toFixed(0)}%</span>
          </div>
          <Progress value={clampPercent(overallRatio * 100)} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-center">
            <div className="text-muted-foreground text-xs">
              {locale === "pt" ? "Nível" : "Level"}
            </div>
            <div className="font-semibold text-sm">{cursus.level.toFixed(2)}</div>
          </div>
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-center">
            <div className="text-muted-foreground text-xs">
              {locale === "pt" ? "Eventos" : "Events"}
            </div>
            <div className="font-semibold text-sm">{cursus.events}</div>
          </div>
          <div className="rounded-md border bg-muted/40 px-3 py-2 text-center">
            <div className="text-muted-foreground text-xs">
              {locale === "pt" ? "Melhor opção" : "Best option"}
            </div>
            <div className="font-semibold text-sm">
              {clampPercent(bestOption.completion * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">
            {locale === "pt" ? "Progresso por opção" : "Progress by option"}
          </h4>
          <div className="space-y-2">
            {optionProgress.map((item) => (
              <div key={item.option.title} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-4">{item.option.title}</span>
                  <span>{clampPercent(item.completion * 100).toFixed(0)}%</span>
                </div>
                <Progress value={clampPercent(item.completion * 100)} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            {locale === "pt" ? "O que falta" : "What is missing"}
          </h4>
          {missingItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {locale === "pt"
                ? "Tudo concluído para este título."
                : "Everything is completed for this title."}
            </p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
              {missingItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
