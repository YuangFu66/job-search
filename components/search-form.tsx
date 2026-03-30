"use client";

import type { FormEvent, ReactNode } from "react";
import { useState, useTransition } from "react";
import type { ResumeSearchResult } from "@/lib/jobs/types";

type SearchResponse =
  | {
      jobs: ResumeSearchResult[];
    }
  | {
      error: string;
      fieldErrors?: Partial<Record<"resume" | "jobTitle" | "location", string[]>>;
    };

type SearchFormProps = {
  onResults: (jobs: ResumeSearchResult[]) => void;
  onError: (message: string | null) => void;
  onLoading: (value: boolean) => void;
};

type ResumeSearchFormState = {
  jobTitle: string;
  location: string;
};

const initialValues: ResumeSearchFormState = {
  jobTitle: "",
  location: ""
};

export function SearchForm({ onResults, onError, onLoading }: SearchFormProps) {
  const [form, setForm] = useState<ResumeSearchFormState>(initialValues);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"resume" | "jobTitle" | "location", string[]>>
  >({});
  const [isPending, startTransition] = useTransition();

  const updateField = (key: keyof ResumeSearchFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLoading(true);
    onError(null);
    setFieldErrors({});

    startTransition(async () => {
      if (!resumeFile) {
        onLoading(false);
        setFieldErrors({ resume: ["Upload a resume before searching."] });
        onResults([]);
        return;
      }

      try {
        const body = new FormData();
        body.set("resume", resumeFile);
        body.set("jobTitle", form.jobTitle);
        body.set("location", form.location);

        const response = await fetch("/api/search-with-resume", {
          method: "POST",
          body
        });

        const payload = (await response.json()) as SearchResponse | ResumeSearchResult[];

        if (!response.ok) {
          if ("fieldErrors" in payload) {
            setFieldErrors(payload.fieldErrors ?? {});
          }

          onResults([]);
          onError("error" in payload ? payload.error : "We couldn't complete that search.");
          return;
        }

        if (Array.isArray(payload)) {
          onResults(payload);
          return;
        }

        if ("jobs" in payload) {
          onResults(payload.jobs);
          return;
        }

        onResults([]);
        onError("We couldn't complete that search.");
      } catch {
        onResults([]);
        onError("Network error. Please try again.");
      } finally {
        onLoading(false);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-panel backdrop-blur md:p-6"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
        <Field
          label="Resume"
          error={fieldErrors.resume?.[0]}
          input={
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <input
                name="resume"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />
              <p className="mt-2 text-xs text-slate-500">
                Upload a PDF or DOCX resume. Parsed text stays in request memory only.
              </p>
              {resumeFile ? (
                <p className="mt-2 text-xs font-medium text-aqua">{resumeFile.name}</p>
              ) : null}
            </div>
          }
        />
        <Field
          label="Job title"
          error={fieldErrors.jobTitle?.[0]}
          input={
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={(event) => updateField("jobTitle", event.target.value)}
              placeholder="Product manager"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-aqua focus:bg-white"
            />
          }
        />
        <Field
          label="Location"
          error={fieldErrors.location?.[0]}
          input={
            <input
              name="location"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Remote or Seattle, WA"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-aqua focus:bg-white"
            />
          }
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-[52px] items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Matching jobs..." : "Find matching jobs"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  input
}: {
  label: string;
  error?: string;
  input: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {input}
      <span className="mt-2 block min-h-5 text-xs text-rose-600">{error ?? ""}</span>
    </label>
  );
}
