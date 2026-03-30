# Scoutlane Job Search MVP

Scoutlane is a production-style Next.js job search MVP that lets users upload a resume, search by job title and location, and view twenty ranked job matches with compensation details, direct application URLs, and concise summaries.

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Zod for request validation

## Features

- Responsive search UI with loading, empty, and error states
- Resume upload support for PDF and DOCX files
- Server-side API route at `/api/search-with-resume`
- Resume parsing and keyword-based job relevance scoring
- Expanded mock jobs dataset with twenty-plus roles
- Provider adapter layer with a default mock jobs provider
- Optional live provider wiring through environment variables
- Normalized result shape:

```ts
{
  title,
  company,
  location,
  payRange,
  summary,
  applicationUrl,
  relevanceScore
}
```

## Project structure

```text
app/
  api/search-with-resume/route.ts
  api/jobs/search/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  job-results.tsx
  search-form.tsx
data/
  mock-jobs.ts
lib/
  jobMatcher.ts
lib/jobs/
  provider.ts
  providers/
  schema.ts
  summary.ts
  types.ts
lib/
  resumeParser.ts
```

## Environment variables

Copy `.env.example` to `.env.local` and adjust as needed:

```bash
cp .env.example .env.local
```

Variables:

- `JOBS_PROVIDER`: `mock` or `live`
- `JOBS_API_URL`: base URL for your live jobs search endpoint
- `JOBS_API_KEY`: bearer token for the live provider

If `JOBS_PROVIDER` is not set to `live`, the app uses bundled mock data.

## How resume parsing works

- The frontend uploads the resume as `multipart/form-data`.
- The backend accepts PDF and DOCX files.
- PDF parsing uses `pdf-parse`.
- DOCX parsing uses `mammoth` to extract raw text.
- Parsed text is kept in memory for the request only and is not stored in a database.
- After extraction, the app derives skills, repeated keywords, and an approximate seniority level from the resume text.
- Jobs are ranked using a weighted score based on job title fit, location fit, overlap with resume skills and keywords, and seniority alignment.

## Run locally

1. Install Node.js 20.11+ or 22+.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Deploy publicly

The simplest production path is Vercel:

1. Push this repo to GitHub.
2. Import the GitHub repository into Vercel.
3. Set these project environment variables in Vercel if needed:
   - `JOBS_PROVIDER`
   - `JOBS_API_URL`
   - `JOBS_API_KEY`
4. Deploy.

Recommended Vercel settings:

- Framework preset: Next.js
- Node version: 22.x
- Build command: `npm run build`
- Install command: `npm install`

## Main user flow

1. Upload a resume in PDF or DOCX format.
2. Enter a job title and location.
3. Submit the search form.
4. The frontend posts the resume file and search fields to `/api/search-with-resume`.
5. The backend parses the resume, extracts skills and keywords, ranks jobs, and returns the top 20 matches.
6. The UI renders job cards with salary, relevance score, apply link, and a generated summary.

## Swapping in a live jobs API

The code is already structured for a real provider:

- Keep the frontend unchanged.
- Replace or extend `LiveJobsProvider` in `lib/jobs/providers/live-provider.ts`.
- Map your provider response into the normalized `JobResult` shape.
- Leave `getJobsProvider()` in `lib/jobs/provider.ts` as the provider selection boundary.

If your provider supports more filters later, extend `JobSearchInput`, `jobSearchSchema`, and the provider logic in one place.

## Verification

Recommended commands:

```bash
npm run lint
npm run typecheck
npm run build
```

In this workspace, Node.js/npm were not available, so dependency install and command-based verification could not be executed here.
