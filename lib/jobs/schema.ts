import { z } from "zod";

export const skillLevels = ["entry-level", "mid-level", "senior"] as const;

export const jobSearchSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Enter a job title with at least 2 characters.")
    .max(100, "Job title is too long."),
  location: z
    .string()
    .trim()
    .min(2, "Enter a location with at least 2 characters.")
    .max(100, "Location is too long."),
  skillLevel: z.enum(skillLevels, {
    errorMap: () => ({ message: "Choose a valid skill level." })
  })
});

export type JobSearchSchema = z.infer<typeof jobSearchSchema>;

export const resumeSearchSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(2, "Enter a job title with at least 2 characters.")
    .max(100, "Job title is too long."),
  location: z
    .string()
    .trim()
    .min(2, "Enter a location with at least 2 characters.")
    .max(100, "Location is too long."),
  resumeText: z
    .string()
    .trim()
    .min(40, "Resume text was too short to parse. Upload a fuller resume.")
    .max(100000, "Resume text is too long.")
});

export type ResumeSearchSchema = z.infer<typeof resumeSearchSchema>;
