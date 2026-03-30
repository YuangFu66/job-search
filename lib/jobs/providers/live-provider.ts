import { createJobSummary } from "@/lib/jobs/summary";
import type { JobResult, JobSearchInput, JobSearchProvider } from "@/lib/jobs/types";

type LiveJob = {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  description?: string;
  apply_url?: string;
};

export class LiveJobsProvider implements JobSearchProvider {
  async searchJobs(input: JobSearchInput): Promise<JobResult[]> {
    const apiUrl = process.env.JOBS_API_URL;
    const apiKey = process.env.JOBS_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error("Live jobs provider is not fully configured.");
    }

    const url = new URL(apiUrl);
    url.searchParams.set("title", input.title);
    url.searchParams.set("location", input.location);
    url.searchParams.set("skillLevel", input.skillLevel);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error("Unable to fetch jobs from the configured provider.");
    }

    const payload = (await response.json()) as { jobs?: LiveJob[] };
    const jobs = payload.jobs ?? [];

    return jobs.map((job) => ({
      title: job.title ?? "Untitled role",
      company: job.company ?? "Unknown company",
      location: job.location ?? "Location not provided",
      payRange: job.salary ?? "Not listed",
      summary: createJobSummary(job.description ?? "", job.salary),
      applicationUrl: job.apply_url ?? "#"
    }));
  }
}
