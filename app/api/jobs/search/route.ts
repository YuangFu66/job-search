import { NextResponse } from "next/server";
import { getJobsProvider } from "@/lib/jobs/provider";
import { jobSearchSchema } from "@/lib/jobs/schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = jobSearchSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid search input.",
          fieldErrors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const provider = getJobsProvider();
    const jobs = await provider.searchJobs(parsed.data);

    return NextResponse.json({ jobs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error while searching jobs.";

    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}
