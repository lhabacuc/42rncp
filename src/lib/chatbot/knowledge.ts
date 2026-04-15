import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

type KnowledgeChunk = {
  id: string;
  source: string;
  text: string;
  tokens: string[];
};

type KnowledgeBase = {
  chunks: KnowledgeChunk[];
};

const MAX_CHUNK_LEN = 700;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function chunkText(text: string): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if (current.length + paragraph.length + 2 <= MAX_CHUNK_LEN) {
      current += `\n\n${paragraph}`;
      continue;
    }

    chunks.push(current);
    current = paragraph;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

async function loadProjectsSummary(): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "projects_21.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  const projects = Object.values(parsed.projects ?? {}) as Array<{
    id: number;
    name: string;
    slug: string;
  }>;

  const lines = projects.map((project) => {
    return `${project.id} | ${project.name} | ${project.slug}`;
  });

  return [
    "42 Projects index (id | name | slug):",
    ...lines,
  ].join("\n");
}

async function loadRncpSummary(): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "rncp_21.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  const rncp = (parsed.rncp ?? []) as Array<{
    type: string;
    title: string;
    level: number;
    number_of_events: number;
    number_of_experiences: number;
    number_of_suite: number;
    options: Array<{
      title: string;
      experience: number;
      number_of_projects: number;
    }>;
  }>;

  const lines: string[] = [];
  for (const title of rncp) {
    lines.push(
      `Title: ${title.title} (${title.type}) | level=${title.level} | events=${title.number_of_events} | experiences=${title.number_of_experiences} | suite=${title.number_of_suite}`,
    );
    for (const option of title.options ?? []) {
      lines.push(
        `  Option: ${option.title} | min projects=${option.number_of_projects} | min xp=${option.experience}`,
      );
    }
  }

  return ["RNCP dataset summary:", ...lines].join("\n");
}

async function loadSourceFile(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), filename);
  return fs.readFile(filePath, "utf-8");
}

async function buildKnowledgeBase(): Promise<KnowledgeBase> {
  const sources: Array<{ source: string; text: string }> = [];

  const files = [
    "sobre_rncp6.txt",
    "sobre_rncp7.txt",
    "logacyproject.txt",
    "espe.md",
    "README.md",
  ];

  for (const file of files) {
    try {
      const text = await loadSourceFile(file);
      sources.push({ source: file, text });
    } catch {
      // Ignore missing optional files.
    }
  }

  sources.push({
    source: "data/projects_21.json (summary)",
    text: await loadProjectsSummary(),
  });
  sources.push({
    source: "data/rncp_21.json (summary)",
    text: await loadRncpSummary(),
  });

  const chunks: KnowledgeChunk[] = [];
  for (const source of sources) {
    const parts = chunkText(source.text);
    parts.forEach((text, index) => {
      chunks.push({
        id: `${source.source}#${index + 1}`,
        source: source.source,
        text,
        tokens: tokenize(text),
      });
    });
  }

  return { chunks };
}

let knowledgeBasePromise: Promise<KnowledgeBase> | null = null;

async function getKnowledgeBase(): Promise<KnowledgeBase> {
  if (!knowledgeBasePromise) {
    knowledgeBasePromise = buildKnowledgeBase();
  }
  return knowledgeBasePromise;
}

export type RetrievedChunk = {
  source: string;
  text: string;
  score: number;
};

export async function searchKnowledge(query: string): Promise<RetrievedChunk[]> {
  const kb = await getKnowledgeBase();
  const queryTokens = tokenize(query);
  const normalizedQuery = normalizeText(query);

  if (queryTokens.length === 0) {
    return [];
  }

  const scored: RetrievedChunk[] = kb.chunks
    .map((chunk) => {
      let score = 0;

      for (const token of queryTokens) {
        if (chunk.tokens.includes(token)) {
          score += 2;
        }
      }

      const normalizedChunk = normalizeText(chunk.text);
      if (normalizedChunk.includes(normalizedQuery)) {
        score += 10;
      }

      return {
        source: chunk.source,
        text: chunk.text,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}
