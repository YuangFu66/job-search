import mammoth from "mammoth";
import type { ParsedResume, SkillLevel } from "@/lib/jobs/types";

const knownSkills = [
  "react",
  "next.js",
  "typescript",
  "javascript",
  "node.js",
  "python",
  "sql",
  "postgresql",
  "graphql",
  "rest",
  "aws",
  "docker",
  "kubernetes",
  "figma",
  "tableau",
  "power bi",
  "excel",
  "product strategy",
  "roadmap",
  "ux research",
  "design systems",
  "go",
  "java",
  "c#",
  "ruby",
  "machine learning",
  "ai",
  "data analysis",
  "a/b testing",
  "tailwind",
  "accessibility",
  "testing",
  "jest",
  "playwright",
  "ci/cd",
  "agile",
  "stakeholder management",
  "analytics",
  "seo",
  "content strategy",
  "swift",
  "kotlin"
] as const;

const stopWords = new Set([
  "the",
  "and",
  "with",
  "for",
  "that",
  "from",
  "have",
  "this",
  "your",
  "will",
  "into",
  "their",
  "about",
  "years",
  "experience",
  "work",
  "build",
  "develop",
  "using",
  "team",
  "role",
  "skills",
  "resume"
]);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function inferSeniority(text: string, yearsOfExperience?: number): SkillLevel {
  const normalized = text.toLowerCase();

  if (
    yearsOfExperience !== undefined && yearsOfExperience >= 6 ||
    /\b(senior|staff|lead|principal|head of)\b/.test(normalized)
  ) {
    return "senior";
  }

  if (
    yearsOfExperience !== undefined && yearsOfExperience >= 3 ||
    /\b(mid|manager|owner|specialist|product manager)\b/.test(normalized)
  ) {
    return "mid-level";
  }

  return "entry-level";
}

function extractYearsOfExperience(text: string) {
  const matches = Array.from(text.matchAll(/(\d{1,2})\+?\s+years?/gi)).map((match) =>
    Number.parseInt(match[1], 10)
  );

  if (matches.length === 0) {
    return undefined;
  }

  return Math.max(...matches);
}

function extractTopKeywords(text: string) {
  const frequencies = new Map<string, number>();

  for (const token of text.toLowerCase().match(/[a-z][a-z.+/#-]{2,}/g) ?? []) {
    if (stopWords.has(token)) {
      continue;
    }

    frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  }

  return Array.from(frequencies.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 16)
    .map(([keyword]) => keyword);
}

export function parseResumeText(text: string): ParsedResume {
  const normalizedText = normalizeWhitespace(text);
  const lower = normalizedText.toLowerCase();
  const skills = knownSkills.filter((skill) => lower.includes(skill));
  const yearsOfExperience = extractYearsOfExperience(normalizedText);
  const keywords = Array.from(new Set([...skills, ...extractTopKeywords(normalizedText)])).slice(
    0,
    24
  );

  return {
    text: normalizedText,
    skills,
    keywords,
    yearsOfExperience,
    seniority: inferSeniority(normalizedText, yearsOfExperience)
  };
}

async function extractPdfText(buffer: Buffer) {
  const pdfParse = (await import("pdf-parse")).default as (input: Buffer) => Promise<{
    text?: string;
  }>;
  const result = await pdfParse(buffer);
  return normalizeWhitespace(result.text ?? "");
}

async function extractDocxText(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return normalizeWhitespace(result.value);
}

export async function extractResumeTextFromFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.size === 0) {
    throw new Error("Uploaded resume file was empty.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Resume file is too large. Please keep uploads under 5 MB.");
  }

  if (extension === "pdf" || file.type === "application/pdf") {
    return extractPdfText(buffer);
  }

  if (
    extension === "docx" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractDocxText(buffer);
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
}
