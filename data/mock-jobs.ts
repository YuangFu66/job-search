import type { RawJob } from "@/lib/jobs/types";

export const mockJobs: RawJob[] = [
  {
    id: "job_1",
    title: "Frontend Engineer",
    company: "Northstar Health",
    location: "San Francisco, CA",
    payRange: "$120,000 - $155,000",
    applicationUrl: "https://example.com/jobs/northstar-frontend-engineer",
    skillLevel: "mid-level",
    workModel: "hybrid",
    tags: ["react", "typescript", "accessibility", "tailwind"],
    description:
      "Build performant patient-facing product experiences in React and TypeScript across our scheduling and care navigation flows. You should have 3+ years of frontend engineering experience, strong accessibility habits, and comfort collaborating with product and design. This hybrid role includes competitive benefits, a learning stipend, and a salary band of $120,000 - $155,000."
  },
  {
    id: "job_2",
    title: "Software Engineer I",
    company: "Lattice Works",
    location: "Austin, TX",
    payRange: "$92,000 - $112,000",
    applicationUrl: "https://example.com/jobs/lattice-software-engineer-1",
    skillLevel: "entry-level",
    workModel: "on-site",
    tags: ["javascript", "apis", "sql", "testing"],
    description:
      "Develop customer-facing platform features and internal tooling with support from a senior engineering mentor. Ideal candidates have internship or early-career experience, a strong CS foundation, and curiosity around APIs, databases, and testing. This on-site Austin role offers a transparent salary range of $92,000 - $112,000 plus annual bonus potential."
  },
  {
    id: "job_3",
    title: "Senior Backend Engineer",
    company: "Atlas Freight",
    location: "Seattle, WA",
    payRange: "$165,000 - $205,000",
    applicationUrl: "https://example.com/jobs/atlas-senior-backend",
    skillLevel: "senior",
    workModel: "remote",
    tags: ["go", "distributed systems", "cloud", "kubernetes"],
    description:
      "Lead the design and delivery of distributed services that power high-volume logistics workflows and partner integrations. Candidates should bring 7+ years of backend or platform engineering experience, deep cloud systems knowledge, and a track record of mentoring other engineers. This remote-first role includes equity, strong healthcare coverage, and a salary range of $165,000 - $205,000."
  },
  {
    id: "job_4",
    title: "Product Designer",
    company: "Pine Labs",
    location: "New York, NY",
    payRange: "$130,000 - $150,000",
    applicationUrl: "https://example.com/jobs/pinelabs-product-designer",
    skillLevel: "mid-level",
    workModel: "hybrid",
    tags: ["design systems", "figma", "ux research", "prototyping"],
    description:
      "Design polished end-to-end product experiences across onboarding, analytics, and collaboration surfaces. We are looking for a designer with 4+ years of product design experience, excellent communication skills, and confidence working in Figma and design systems. The role is hybrid in New York with strong benefits and total cash compensation of $130,000 - $150,000."
  },
  {
    id: "job_5",
    title: "Senior Product Manager",
    company: "Meridian AI",
    location: "Remote, United States",
    payRange: "$170,000 - $210,000",
    applicationUrl: "https://example.com/jobs/meridian-senior-pm",
    skillLevel: "senior",
    workModel: "remote",
    tags: ["product strategy", "b2b saas", "analytics", "ai"],
    description:
      "Own roadmap strategy for our AI workflow platform and drive execution with engineering, design, and go-to-market partners. Successful candidates have 6+ years in product management, strong analytical instincts, and experience shipping B2B SaaS products. This fully remote U.S. position includes equity, home office support, and compensation of $170,000 - $210,000."
  },
  {
    id: "job_6",
    title: "Data Analyst",
    company: "Horizon Commerce",
    location: "Chicago, IL",
    payRange: "$88,000 - $108,000",
    applicationUrl: "https://example.com/jobs/horizon-data-analyst",
    skillLevel: "entry-level",
    workModel: "hybrid",
    tags: ["sql", "tableau", "python", "stakeholder management"],
    description:
      "Analyze marketplace performance data and build dashboards that help teams make better merchandising decisions. Candidates should have 1-2 years of analytics experience, excellent SQL fundamentals, and the ability to turn ambiguous questions into clear insights. This Chicago hybrid role includes commuter benefits and pays $88,000 - $108,000."
  }
];
