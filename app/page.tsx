"use client";

import { useState } from "react";
import { JobResults } from "@/components/job-results";
import { SearchForm } from "@/components/search-form";
import type { JobResult } from "@/lib/jobs/types";

export default function HomePage() {
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = (nextJobs: JobResult[]) => {
    setJobs(nextJobs);
    setHasSearched(true);
  };

  const handleLoading = (value: boolean) => {
    if (value) {
      setHasSearched(true);
    }

    setIsLoading(value);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] px-5 py-8 shadow-panel sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 -z-10 bg-grid bg-[size:22px_22px] opacity-60" />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-aqua">
                Scoutlane
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Search jobs with cleaner signals and faster read-throughs.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Enter a role, location, and skill level to get normalized job listings with pay
                details, direct application links, and concise summaries you can scan quickly.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                  Validation built in
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                  Mock or live provider
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                  Responsive by default
                </span>
              </div>
            </div>
            <div className="rounded-[28px] bg-ink p-6 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">What you get</p>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-white/85">
                <li>Normalized results with title, company, location, pay range, and apply link.</li>
                <li>Three-sentence summaries focused on responsibilities, qualifications, and work details.</li>
                <li>Backend search logic that is ready for remote, salary, and sponsorship filters later.</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 lg:mt-10">
            <SearchForm
              onResults={handleResults}
              onError={setError}
              onLoading={handleLoading}
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Results</h2>
              <p className="mt-1 text-sm text-slate-600">
                {hasSearched
                  ? `${jobs.length} role${jobs.length === 1 ? "" : "s"} found`
                  : "Ready when you are"}
              </p>
            </div>
          </div>
          <JobResults jobs={jobs} isLoading={isLoading} error={error} hasSearched={hasSearched} />
        </section>
      </div>
    </main>
  );
}
