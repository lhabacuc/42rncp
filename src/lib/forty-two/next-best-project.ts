import type {
  FortyTwoCursus,
  FortyTwoProject,
  FortyTwoTitle,
  FortyTwoTitleOption,
} from "@/types/forty-two";

interface ProjectPathNeed {
  title: string;
  track: string;
  requiredProjects: number;
  validatedProjects: number;
}

export interface NextBestProjectRecommendation {
  project: FortyTwoProject;
  score: number;
  inProgress: boolean;
  pathNeeds: ProjectPathNeed[];
}

function flattenProjects(
  projects: Record<number, FortyTwoProject>,
): Record<number, FortyTwoProject> {
  const output: Record<number, FortyTwoProject> = {};

  function walk(project: FortyTwoProject) {
    output[project.id] = project;

    for (const child of project.children) {
      walk(child);
    }
  }

  for (const project of Object.values(projects)) {
    walk(project);
  }

  return output;
}

function countValidatedProjects(
  projects: Record<number, FortyTwoProject>,
  cursus: FortyTwoCursus,
): number {
  let validated = 0;

  for (const projectId of Object.keys(projects)) {
    const userProject = cursus.projects[Number(projectId)];
    if (userProject?.is_validated) {
      validated += 1;
    }
  }

  return validated;
}

function getOptionNeed(option: FortyTwoTitleOption, title: FortyTwoTitle) {
  return {
    title: title.title,
    track: option.title,
    requiredProjects: option.numberOfProjects,
  };
}

export function getNextBestProjects({
  cursus,
  titles,
  maxResults = 10,
}: {
  cursus: FortyTwoCursus;
  titles: FortyTwoTitle[];
  maxResults?: number;
}): NextBestProjectRecommendation[] {
  const candidates = new Map<number, NextBestProjectRecommendation>();

  for (const title of titles) {
    const optionBuckets: FortyTwoTitleOption[] = [
      ...title.options,
      {
        title: "Suite",
        experience: 0,
        numberOfProjects: title.numberOfSuite,
        projects: title.suite,
      },
    ];

    for (const option of optionBuckets) {
      const optionProjects = flattenProjects(option.projects);
      const validatedProjects = countValidatedProjects(optionProjects, cursus);
      const remainingProjects = Math.max(0, option.numberOfProjects - validatedProjects);

      if (remainingProjects === 0) {
        continue;
      }

      const urgencyRatio =
        option.numberOfProjects > 0 ? remainingProjects / option.numberOfProjects : 0;

      for (const project of Object.values(optionProjects)) {
        const userProject = cursus.projects[project.id];
        if (userProject?.is_validated) {
          continue;
        }

        const inProgress = userProject?.status === "in_progress";
        const xpRatio = Math.min((project.experience || 0) / 20000, 1);
        const statusBonus = inProgress ? 0.4 : userProject ? 0.15 : 0;
        const score = urgencyRatio * 0.65 + xpRatio * 0.25 + statusBonus;

        const existing = candidates.get(project.id);
        const pathNeed: ProjectPathNeed = {
          ...getOptionNeed(option, title),
          validatedProjects,
        };

        if (!existing) {
          candidates.set(project.id, {
            project,
            score,
            inProgress,
            pathNeeds: [pathNeed],
          });
          continue;
        }

        existing.score += score;
        existing.inProgress = existing.inProgress || inProgress;
        existing.pathNeeds.push(pathNeed);
      }
    }
  }

  return Array.from(candidates.values())
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if ((b.project.experience || 0) !== (a.project.experience || 0)) {
        return (b.project.experience || 0) - (a.project.experience || 0);
      }

      return a.project.name.localeCompare(b.project.name);
    })
    .slice(0, maxResults);
}
