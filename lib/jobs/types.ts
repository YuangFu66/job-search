export type SkillLevel = "entry-level" | "mid-level" | "senior";

export type JobSearchInput = {
  title: string;
  location: string;
  skillLevel: SkillLevel;
};

export type JobResult = {
  title: string;
  company: string;
  location: string;
  payRange: string;
  summary: string;
  applicationUrl: string;
};

export type RawJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  payRange?: string | null;
  description: string;
  applicationUrl: string;
  tags: string[];
  skillLevel: SkillLevel;
  workModel?: "on-site" | "remote" | "hybrid";
};

export type JobSearchProvider = {
  searchJobs: (input: JobSearchInput) => Promise<JobResult[]>;
};
