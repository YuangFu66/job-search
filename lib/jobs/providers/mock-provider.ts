import { mockJobs } from "@/data/mock-jobs";
import { createJobSummary } from "@/lib/jobs/summary";
import type { JobResult, JobSearchInput, JobSearchProvider, RawJob } from "@/lib/jobs/types";

function includesTerm(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function matchesLocation(job: RawJob, location: string) {
  const normalizedLocation = location.trim().toLowerCase();

  if (normalizedLocation === "remote") {
    return job.workModel === "remote" || includesTerm(job.location, "remote");
  }

  return (
    includesTerm(job.location, normalizedLocation) ||
    includesTerm(normalizedLocation, job.location.toLowerCase()) ||
    (job.workModel === "remote" && includesTerm(normalizedLocation, "united states"))
  );
}

function matchesTitle(job: RawJob, title: string) {
  const normalizedTitle = title.trim().toLowerCase();
  return (
    includesTerm(job.title, normalizedTitle) ||
    job.tags.some((tag) => includesTerm(tag, normalizedTitle))
  );
}

function rankJob(job: RawJob, input: JobSearchInput) {
  let score = 0;

  if (includesTerm(job.title, input.title)) score += 5;
  if (job.tags.some((tag) => includesTerm(tag, input.title))) score += 2;
  if (job.skillLevel === input.skillLevel) score += 3;
  if (matchesLocation(job, input.location)) score += 4;
  if (job.workModel === "remote" && includesTerm(input.location, "remote")) score += 2;

  return score;
}

function normalizeJob(job: RawJob): JobResult {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    payRange: job.payRange ?? "Not listed",
    summary: createJobSummary(job.description, job.payRange),
    applicationUrl: job.applicationUrl
  };
}

export class MockJobsProvider implements JobSearchProvider {
  async searchJobs(input: JobSearchInput) {
    const filtered = mockJobs
      .filter((job) => job.skillLevel === input.skillLevel)
      .filter((job) => matchesTitle(job, input.title))
      .filter((job) => matchesLocation(job, input.location))
      .sort((left, right) => rankJob(right, input) - rankJob(left, input))
      .map(normalizeJob);

    return filtered;
  }
}
