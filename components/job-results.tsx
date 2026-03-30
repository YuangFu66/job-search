import type { ResumeSearchResult } from "@/lib/jobs/types";

type JobResultsProps = {
  jobs: ResumeSearchResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
};

export function JobResults({ jobs, isLoading, error, hasSearched }: JobResultsProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4" aria-live="polite">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-panel"
          >
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-4 h-6 w-3/4 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
            <div className="mt-6 h-16 rounded bg-slate-100" />
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </section>
    );
  }

  if (hasSearched && jobs.length === 0) {
    return (
      <section className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
        <h2 className="text-lg font-semibold">No matching roles yet</h2>
        <p className="mt-2 text-sm text-slate-600">
          Try a broader title, a different location, or a resume with more role-specific details.
        </p>
      </section>
    );
  }

  if (!hasSearched) {
    return (
      <section className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
        <h2 className="text-lg font-semibold">Start with a focused search</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload your resume and search by role and location to see ranked job matches.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {jobs.map((job) => (
        <article
          key={`${job.company}-${job.title}-${job.location}`}
          className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-panel"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-aqua">{job.company}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{job.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
                  {job.payRange}
                </span>
                {job.relevanceScore ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    {job.relevanceScore}% match
                  </span>
                ) : null}
              </div>
            </div>
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-ink transition hover:border-aqua hover:text-aqua"
            >
              Apply now
            </a>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-700">{job.summary}</p>
        </article>
      ))}
    </section>
  );
}
