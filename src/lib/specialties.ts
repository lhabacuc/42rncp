import type { AppLocale } from "@/lib/i18n";

export interface SpecialtyDefinition {
  id: string;
  name: Record<AppLocale, string>;
  projectRefs: string[];
}

export const specialties: SpecialtyDefinition[] = [
  {
    id: "algo-ai-data",
    name: { pt: "Algo, IA e Dados", en: "Algo, AI & Data" },
    projectRefs: [
      "corewar",
      "dslr",
      "expert-system",
      "ft_linear_regression",
      "gomoku",
      "krpsim",
      "Leaffliction",
      "lem_in",
      "multilayer-perceptron",
      "n-puzzle",
      "Piscine Data Science",
      "Python for Data Science",
      "rubik",
      "total-perspective-vortex",
      "zappy",
    ],
  },
  {
    id: "security",
    name: { pt: "Segurança", en: "Security" },
    projectRefs: [
      "boot2root",
      "Cybersecurity",
      "darkly",
      "death",
      "dr-quine",
      "famine",
      "ft_malcolm",
      "ft_nmap",
      "ft_shield",
      "override",
      "pestilence",
      "rainfall",
      "snow-crash",
      "tinky-winkey",
      "war",
      "woody-woodpacker",
    ],
  },
  {
    id: "devops",
    name: { pt: "DevOps", en: "DevOps" },
    projectRefs: [
      "Bgp At Doors of Autonomous Systems is Simple",
      "cloud-1",
      "ft_nmap",
      "ft_ping",
      "ft_traceroute",
      "Inception-of-Things",
      "taskmaster",
    ],
  },
  {
    id: "web-mobile",
    name: { pt: "Web e Mobile", en: "Web & Mobile" },
    projectRefs: [
      "camagru",
      "darkly",
      "ft_hangouts",
      "hypertube",
      "matcha",
      "Mobile",
      "music-room",
      "Piscine Django",
      "Piscine RoR",
      "Piscine Symfony",
      "red-tetris",
      "swifty-companion",
      "swifty-proteins",
      "project_id_1486",
    ],
  },
  {
    id: "system-kernel",
    name: { pt: "Sistema e Kernel", en: "System & Kernel" },
    projectRefs: [
      "42sh",
      "drivers-and-interrupts",
      "filesystem",
      "ft_linux",
      "ft_ls",
      "ft_nmap",
      "ft_ping",
      "ft_traceroute",
      "kfs-1",
      "kfs-2",
      "kfs-3",
      "kfs-4",
      "kfs-5",
      "kfs-6",
      "kfs-7",
      "kfs-8",
      "kfs-9",
      "kfs-x",
      "lem-ipc",
      "libasm",
      "little-penguin-1",
      "malloc",
      "matt-daemon",
      "nibbler",
      "nm",
      "process-and-memory",
      "strace",
      "taskmaster",
      "userspace_digressions",
      "zappy",
    ],
  },
  {
    id: "graphics-gaming",
    name: { pt: "Gráficos e Jogos", en: "Graphics & Gaming" },
    projectRefs: [
      "42run",
      "bomberman",
      "doom-nukem",
      "ft_minecraft",
      "ft_newton",
      "ft_vox",
      "guimp",
      "humangl",
      "in-the-shadows",
      "mod1",
      "nibbler",
      "particle-system",
      "rt",
      "scop",
      "shaderpixel",
      "Unity",
      "xv",
      "zappy",
      "project_id_1485",
    ],
  },
  {
    id: "cryptography-maths",
    name: { pt: "Criptografia e Matemática", en: "Cryptography & Maths" },
    projectRefs: [
      "computorv1",
      "computorv2",
      "ft_kalman",
      "ft_linear_regression",
      "ft_ssl_des",
      "ft_ssl_md5",
      "ft_ssl_rsa",
      "matrix",
      "ready set boole",
      "rt",
    ],
  },
  {
    id: "development",
    name: { pt: "Desenvolvimento", en: "Development" },
    projectRefs: [
      "Abstract_data",
      "avaj-launcher",
      "corewar",
      "fix-me",
      "ft_ality",
      "ft_lex",
      "ft_turing",
      "ft_yacc",
      "h42n42",
      "Open Project",
      "Piscine Object",
      "Rushes",
      "swingy",
      "project_id_1484",
    ],
  },
  {
    id: "professional-experience",
    name: { pt: "Experiência Profissional", en: "Professional Experience" },
    projectRefs: [
      "Part_Time I",
      "Part_Time II",
      "Startup Experience",
      "Work Experience I",
      "Work Experience II",
    ],
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function projectMatchesSpecialtyRef(
  project: { id: number; name: string },
  ref: string,
): boolean {
  const normalizedRef = normalize(ref);
  const idMatch = normalizedRef.match(/^projectid(\d+)$/);
  if (idMatch) {
    return project.id === Number(idMatch[1]);
  }

  return normalize(project.name) === normalizedRef;
}
