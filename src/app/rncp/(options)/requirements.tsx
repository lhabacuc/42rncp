import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n";
import { Progress } from "@/components/ui/progress";
import { useFortyTwoStore } from "@/providers/forty-two-store-provider";
import type {
  FortyTwoCursus,
  FortyTwoProject,
  FortyTwoTitle,
  FortyTwoTitleOption,
} from "@/types/forty-two";
import Image from "next/image";

import rncp6ApplicativeLogo from "../../../../RNCP-6-APPLICATIVE-DEVELOPMENT.webp";
import rncp6WebMobileLogo from "../../../../RNCP-6-WEB-AND-MOBILE-DEVELOPMENT.webp";
import rncp7DataLogo from "../../../../RNCP-7-DATA-AND-DATABASE-ARCHITECTURE.webp";
import rncp7NetworksLogo from "../../../../RNCP-7-NETWORK-AND-INFORMATION-SYSTEMS.webp";

function getRncpLogo(title: FortyTwoTitle) {
  if (title.type === "rncp-6" && title.title === "Développement web et mobile") {
    return rncp6WebMobileLogo;
  }

  if (title.type === "rncp-6" && title.title === "Développement applicatif") {
    return rncp6ApplicativeLogo;
  }

  if (title.type === "rncp-7" && title.title === "Système d'information et réseaux") {
    return rncp7NetworksLogo;
  }

  if (
    title.type === "rncp-7" &&
    title.title === "Architecture des bases de données et data"
  ) {
    return rncp7DataLogo;
  }

  return null;
}

interface TitleRequirementProps {
  locale: AppLocale;
  name: string;
  value: number;
  max: number;
  unit?: string;
}

function TitleRequirement({
  locale,
  name,
  value,
  max,
  unit,
}: TitleRequirementProps) {
  function formatValue(value: number) {
    if (value > 1000) {
      return `${(value / 1000).toFixed(1).toLocaleString()}K`;
    }
    return value.toLocaleString();
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-1 text-sm">
        <p className="truncate">{name}</p>
        <p className="min-w-[66px] text-right font-medium">
          {formatValue(value)} / {formatValue(max)} {unit}
        </p>
      </div>
      <Progress
        max={max}
        value={value > max ? max : value}
        aria-label={
          locale === "pt"
            ? `${value} de ${max} para ${name.toLowerCase()}`
            : `${value} out of ${max} for ${name.toLowerCase()}`
        }
      />
    </div>
  );
}

export interface TitleRequirementsProps {
  locale: AppLocale;
  title: FortyTwoTitle;
  className?: string;
}

export function TitleRequirements({
  locale,
  title,
  className,
}: TitleRequirementsProps) {
  const { cursus } = useFortyTwoStore((state) => state);
  const rncpLogo = getRncpLogo(title);

  const experiences: FortyTwoProject[] = [];
  for (const project of Object.values(cursus.projects)) {
    const isExperience: boolean = title.experience[project.id] !== undefined;
    if (isExperience && project.is_validated) {
      experiences.push(project);
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle
          tag="h3"
          className="text-xl"
        >
          {locale === "pt" ? "Requisitos" : "Requirements"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
          <TitleRequirement
            locale={locale}
            name={locale === "pt" ? "Nível exigido" : "Level required"}
            value={cursus.level}
            max={title.level}
          />
          <TitleRequirement
            locale={locale}
            name={locale === "pt" ? "Número de eventos" : "Number of events"}
            value={cursus.events}
            max={title.numberOfEvents}
          />
          <TitleRequirement
            locale={locale}
            name={
              locale === "pt" ? "Experiências profissionais" : "Professional experiences"
            }
            value={experiences.length}
            max={title.numberOfExperiences}
          />
        </div>

        {rncpLogo && (
          <div className="flex items-center justify-center">
            <div className="relative h-56 w-full max-w-[520px] overflow-hidden rounded-lg border border-border/40 bg-muted/20 p-2 md:h-64">
              <Image
                src={rncpLogo}
                alt="RNCP logo"
                fill
                className="object-contain p-4 md:p-6"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function calculateExperience(
  project: FortyTwoProject,
  cursus: FortyTwoCursus,
): {
  experience: number;
  projects: number;
} {
  let projects = 0;
  let experience = 0;

  const userProject = cursus.projects[project.id];
  if (!userProject) {
    return { experience: 0, projects: 0 };
  }

  for (const child of userProject.children) {
    const childExperience = calculateExperience(child, cursus);
    projects += childExperience.projects;
    experience += childExperience.experience;
  }

  if (userProject.is_validated) {
    projects++;
    experience += (project.experience || 0) * ((userProject.mark || 0) / 100);
  }

  return { experience, projects };
}

export function TitleOptionRequirements({
  locale,
  option,
}: {
  locale: AppLocale;
  option: FortyTwoTitleOption;
}) {
  const { cursus } = useFortyTwoStore((state) => state);

  let projects = 0;
  let experience = 0;

  for (const project of Object.values(option.projects)) {
    const { experience: projectExperience, projects: projectCount } =
      calculateExperience(project, cursus);

    projects += projectCount;
    experience += projectExperience;
  }

  return (
    <div className="space-y-4">
      <TitleRequirement
        locale={locale}
        name={locale === "pt" ? "Projetos" : "Projects"}
        value={projects}
        max={option.numberOfProjects}
      />

      {option.experience > 0 && (
        <TitleRequirement
          locale={locale}
          name={locale === "pt" ? "Experiência" : "Experience"}
          value={experience}
          max={option.experience}
          unit="XP"
        />
      )}
    </div>
  );
}
