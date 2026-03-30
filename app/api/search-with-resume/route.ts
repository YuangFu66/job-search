import { NextResponse } from "next/server";
import { findResumeMatchedJobs } from "@/lib/jobMatcher";
import { extractResumeTextFromFile, parseResumeText } from "@/lib/resumeParser";
import { resumeSearchSchema } from "@/lib/jobs/schema";

function validationError(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      error: "Invalid search input.",
      fieldErrors
    },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("resume");
      const jobTitle = String(formData.get("jobTitle") ?? "");
      const location = String(formData.get("location") ?? "");

      if (!(file instanceof File)) {
        return validationError({ resume: ["Upload a resume in PDF or DOCX format."] });
      }

      const resumeText = await extractResumeTextFromFile(file);
      const parsed = resumeSearchSchema.safeParse({ resumeText, jobTitle, location });

      if (!parsed.success) {
        return validationError(parsed.error.flatten().fieldErrors);
      }

      const jobs = findResumeMatchedJobs({
        jobTitle: parsed.data.jobTitle,
        location: parsed.data.location,
        parsedResume: parseResumeText(parsed.data.resumeText)
      });

      return NextResponse.json(jobs);
    }

    const json = await request.json();
    const parsed = resumeSearchSchema.safeParse(json);

    if (!parsed.success) {
      return validationError(parsed.error.flatten().fieldErrors);
    }

    const jobs = findResumeMatchedJobs({
      jobTitle: parsed.data.jobTitle,
      location: parsed.data.location,
      parsedResume: parseResumeText(parsed.data.resumeText)
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error while parsing the resume."
      },
      { status: 500 }
    );
  }
}
