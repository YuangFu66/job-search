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
  relevanceScore?: number;
};

export type ResumeSearchInput = {
  jobTitle: string;
  location: string;
  resumeText: string;
};

export type ParsedResume = {
  text: string;
  skills: string[];
  keywords: string[];
  yearsOfExperience?: number;
  seniority: SkillLevel;
};

export type ResumeSearchResult = JobResult & {
  relevanceScore: number;
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
