import { mockJobs } from "@/data/mock-jobs";
import { createJobSummary } from "@/lib/jobs/summary";
import type { ParsedResume, RawJob, ResumeSearchResult } from "@/lib/jobs/types";

const RESULT_LIMIT = 20;

function includesTerm(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9.+#/ -]+/g)
    .flatMap((part) => part.split(/\s+/))
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

function scoreLocation(job: RawJob, location: string) {
  const normalizedLocation = location.trim().toLowerCase();

  if (!normalizedLocation) {
    return 0;
  }

  if (normalizedLocation === "remote") {
    return job.workModel === "remote" || includesTerm(job.location, "remote") ? 15 : 0;
  }

  if (includesTerm(job.location, normalizedLocation)) {
    return 14;
  }

  if (job.workModel === "remote" && normalizedLocation.includes("united states")) {
    return 10;
  }

  return 0;
}

function scoreTitle(job: RawJob, jobTitle: string) {
  const tokens = tokenize(jobTitle);
  const title = job.title.toLowerCase();
  const tags = job.tags.join(" ").toLowerCase();

  if (tokens.length === 0) {
    return 0;
  }

  return tokens.reduce((score, token) => {
    if (title.includes(token)) {
      return score + 8;
    }

    if (tags.includes(token)) {
      return score + 4;
    }

    return score;
  }, 0);
}

function scoreResumeMatch(job: RawJob, resume: ParsedResume) {
  const combinedText = `${job.title} ${job.description} ${job.tags.join(" ")}`.toLowerCase();
  let score = 0;

  for (const skill of resume.skills) {
    if (combinedText.includes(skill)) {
      score += 10;
    }
  }

  for (const keyword of resume.keywords) {
    if (combinedText.includes(keyword)) {
      score += 3;
    }
  }

  if (resume.seniority === job.skillLevel) {
    score += 10;
  }

  if (resume.yearsOfExperience !== undefined) {
    if (job.skillLevel === "senior" && resume.yearsOfExperience >= 6) score += 8;
    if (job.skillLevel === "mid-level" && resume.yearsOfExperience >= 3) score += 6;
    if (job.skillLevel === "entry-level" && resume.yearsOfExperience <= 3) score += 4;
  }

  return score;
}

function normalizeScore(rawScore: number) {
  return Math.max(35, Math.min(99, Math.round(rawScore)));
}

export function findResumeMatchedJobs(input: {
  jobTitle: string;
  location: string;
  parsedResume: ParsedResume;
  jobs?: RawJob[];
  limit?: number;
}): ResumeSearchResult[] {
  const jobs = input.jobs ?? mockJobs;
  const limit = input.limit ?? RESULT_LIMIT;

  return jobs
    .map((job) => {
      const rawScore =
        scoreTitle(job, input.jobTitle) +
        scoreLocation(job, input.location) +
        scoreResumeMatch(job, input.parsedResume);

      return {
        title: job.title,
        company: job.company,
        location: job.location,
        payRange: job.payRange ?? "Not listed",
        summary: createJobSummary(job.description, job.payRange, {
          minSentences: 2,
          maxSentences: 3
        }),
        applicationUrl: job.applicationUrl,
        relevanceScore: normalizeScore(rawScore)
      };
    })
    .sort((left, right) => right.relevanceScore - left.relevanceScore)
    .slice(0, limit);
}
