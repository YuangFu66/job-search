import { LiveJobsProvider } from "@/lib/jobs/providers/live-provider";
import { MockJobsProvider } from "@/lib/jobs/providers/mock-provider";
import type { JobSearchProvider } from "@/lib/jobs/types";

export function getJobsProvider(): JobSearchProvider {
  const provider = process.env.JOBS_PROVIDER?.toLowerCase();

  if (provider === "live") {
    return new LiveJobsProvider();
  }

  return new MockJobsProvider();
}
