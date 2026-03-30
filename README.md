# Scoutlane Job Search MVP

Scoutlane is a production-style Next.js job search MVP that lets users search by job title, location, and skill level, then view normalized results with compensation details, direct application URLs, and concise three-sentence summaries.

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Zod for request validation

## Features

- Responsive search UI with loading, empty, and error states
- Server-side API route at `/api/jobs/search`
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
  applicationUrl
}
```

## Project structure

```text
app/
  api/jobs/search/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  job-results.tsx
  search-form.tsx
data/
  mock-jobs.ts
lib/jobs/
  provider.ts
  providers/
  schema.ts
  summary.ts
  types.ts
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

1. Enter a job title, location, and skill level.
2. Submit the search form.
3. The frontend posts to `/api/jobs/search`.
4. The backend validates the request, queries the selected provider, normalizes results, and returns JSON.
5. The UI renders job cards with salary, apply link, and a generated summary.

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
