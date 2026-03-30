"use client";

import type { FormEvent, ReactNode } from "react";
import { useState, useTransition } from "react";
import { skillLevels } from "@/lib/jobs/schema";
import type { JobResult, JobSearchInput } from "@/lib/jobs/types";

type SearchResponse =
  | {
      jobs: JobResult[];
    }
  | {
      error: string;
      fieldErrors?: Partial<Record<keyof JobSearchInput, string[]>>;
    };

type SearchFormProps = {
  onResults: (jobs: JobResult[]) => void;
  onError: (message: string | null) => void;
  onLoading: (value: boolean) => void;
};

const initialValues: JobSearchInput = {
  title: "",
  location: "",
  skillLevel: "mid-level"
};

export function SearchForm({ onResults, onError, onLoading }: SearchFormProps) {
  const [form, setForm] = useState<JobSearchInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof JobSearchInput, string[]>>>(
    {}
  );
  const [isPending, startTransition] = useTransition();

  const updateField = <K extends keyof JobSearchInput>(key: K, value: JobSearchInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLoading(true);
    onError(null);
    setFieldErrors({});

    startTransition(async () => {
      try {
        const response = await fetch("/api/jobs/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        const payload = (await response.json()) as SearchResponse;

        if (!response.ok) {
          if ("fieldErrors" in payload) {
            setFieldErrors(payload.fieldErrors ?? {});
          }

          onResults([]);
          onError("error" in payload ? payload.error : "We couldn't complete that search.");
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
      <div className="grid gap-4 md:grid-cols-[1.5fr_1.1fr_0.9fr_auto] md:items-end">
        <Field
          label="Job title"
          error={fieldErrors.title?.[0]}
          input={
            <input
              name="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Frontend engineer"
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
              placeholder="San Francisco, CA"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-aqua focus:bg-white"
            />
          }
        />
        <Field
          label="Skill level"
          error={fieldErrors.skillLevel?.[0]}
          input={
            <select
              name="skillLevel"
              value={form.skillLevel}
              onChange={(event) =>
                updateField("skillLevel", event.target.value as JobSearchInput["skillLevel"])
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-aqua focus:bg-white"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level.replace("-", " ")}
                </option>
              ))}
            </select>
          }
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-[50px] items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Searching..." : "Search jobs"}
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
