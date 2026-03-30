import type { RawJob, SkillLevel } from "@/lib/jobs/types";

type JobTemplate = {
  slug: string;
  title: string;
  company: string;
  skillLevel: SkillLevel;
  workModel: RawJob["workModel"];
  tags: string[];
  responsibility: string;
  qualifications: string;
  perks: string;
};

type LocationProfile = {
  city: string;
  state: string;
  payRange: string;
};

const templates: JobTemplate[] = [
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    company: "Northstar Health",
    skillLevel: "mid-level",
    workModel: "hybrid",
    tags: ["react", "typescript", "tailwind", "accessibility", "testing"],
    responsibility:
      "Build polished patient-facing web experiences across scheduling, messaging, and care navigation surfaces.",
    qualifications:
      "Candidates should have hands-on React and TypeScript experience, strong accessibility habits, and comfort partnering with product and design.",
    perks:
      "The team offers meaningful healthcare impact, a learning stipend, and collaborative hybrid rituals."
  },
  {
    slug: "software-engineer-i",
    title: "Software Engineer I",
    company: "Lattice Works",
    skillLevel: "entry-level",
    workModel: "on-site",
    tags: ["javascript", "apis", "sql", "testing", "node.js"],
    responsibility:
      "Develop customer-facing platform features and internal tooling with guidance from senior engineers.",
    qualifications:
      "Ideal applicants have internship or early-career experience, strong fundamentals in APIs and data modeling, and curiosity around shipping reliable software.",
    perks:
      "This team emphasizes mentorship, structured onboarding, and clear growth plans."
  },
  {
    slug: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    company: "Atlas Freight",
    skillLevel: "senior",
    workModel: "remote",
    tags: ["go", "distributed systems", "aws", "kubernetes", "postgresql"],
    responsibility:
      "Lead the design and delivery of distributed backend services for high-volume logistics workflows and partner integrations.",
    qualifications:
      "Strong candidates bring deep cloud systems experience, production ownership, and a track record of mentoring other engineers.",
    perks:
      "The role includes remote-first flexibility, equity, and strong healthcare coverage."
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    company: "Pine Labs",
    skillLevel: "mid-level",
    workModel: "hybrid",
    tags: ["figma", "design systems", "ux research", "prototyping"],
    responsibility:
      "Design end-to-end product experiences across onboarding, analytics, and collaboration workflows.",
    qualifications:
      "Applicants should be strong in Figma, systems thinking, and turning research into clear interaction patterns.",
    perks:
      "You will work closely with product and engineering on a mature design system."
  },
  {
    slug: "senior-product-manager",
    title: "Senior Product Manager",
    company: "Meridian AI",
    skillLevel: "senior",
    workModel: "remote",
    tags: ["product strategy", "analytics", "ai", "roadmap", "stakeholder management"],
    responsibility:
      "Own roadmap strategy for an AI workflow platform and drive execution with engineering, design, and go-to-market partners.",
    qualifications:
      "Candidates should have product leadership experience, strong analytical instincts, and a history of shipping B2B SaaS products.",
    perks:
      "The role includes equity, home office support, and a high-autonomy remote culture."
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    company: "Horizon Commerce",
    skillLevel: "entry-level",
    workModel: "hybrid",
    tags: ["sql", "tableau", "python", "analytics", "stakeholder management"],
    responsibility:
      "Analyze marketplace performance data and build dashboards that support merchandising and growth decisions.",
    qualifications:
      "Applicants should be strong in SQL, data storytelling, and translating ambiguous questions into measurable insight.",
    perks:
      "The team offers commuter benefits, strong analyst mentorship, and exposure to executive decision-making."
  },
  {
    slug: "fullstack-engineer",
    title: "Full Stack Engineer",
    company: "Fjord Cloud",
    skillLevel: "mid-level",
    workModel: "remote",
    tags: ["next.js", "node.js", "typescript", "postgresql", "graphql"],
    responsibility:
      "Ship user-facing features and backend APIs for a fast-moving workflow product used by operations teams.",
    qualifications:
      "Candidates should be comfortable moving across frontend and backend systems, owning features end to end, and writing pragmatic tests.",
    perks:
      "This remote team offers flexible hours, quarterly offsites, and strong product ownership."
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    company: "Beacon Systems",
    skillLevel: "senior",
    workModel: "remote",
    tags: ["aws", "docker", "kubernetes", "ci/cd", "terraform"],
    responsibility:
      "Improve cloud infrastructure, deployment pipelines, and reliability practices for a growing multi-service platform.",
    qualifications:
      "Strong candidates have infrastructure-as-code experience, a security mindset, and confidence supporting developers at scale.",
    perks:
      "The team provides an infrastructure budget, incident pay, and remote collaboration support."
  },
  {
    slug: "mobile-engineer",
    title: "Mobile Engineer",
    company: "Spruce Mobility",
    skillLevel: "mid-level",
    workModel: "hybrid",
    tags: ["swift", "kotlin", "react", "testing", "analytics"],
    responsibility:
      "Build high-quality mobile features that help customers manage bookings, payments, and service updates on the go.",
    qualifications:
      "Applicants should have hands-on iOS or Android experience, strong debugging skills, and comfort collaborating across platforms.",
    perks:
      "The role offers commuter support, device stipends, and a strong mobile craft culture."
  }
];

const locations: LocationProfile[] = [
  { city: "San Francisco", state: "CA", payRange: "$120,000 - $155,000" },
  { city: "Austin", state: "TX", payRange: "$95,000 - $132,000" },
  { city: "Seattle", state: "WA", payRange: "$135,000 - $185,000" },
  { city: "New York", state: "NY", payRange: "$125,000 - $175,000" },
  { city: "Chicago", state: "IL", payRange: "$90,000 - $128,000" },
  { city: "Remote, United States", state: "", payRange: "$130,000 - $190,000" }
];

function buildLocationLabel(profile: LocationProfile) {
  return profile.state ? `${profile.city}, ${profile.state}` : profile.city;
}

export const mockJobs: RawJob[] = templates.flatMap((template, templateIndex) =>
  locations.slice(0, 3).map((profile, profileIndex) => {
    const location = locations[(templateIndex + profileIndex) % locations.length];
    const locationLabel = buildLocationLabel(location);
    const id = `${template.slug}-${templateIndex + 1}-${profileIndex + 1}`;

    return {
      id,
      title: template.title,
      company: `${template.company} ${profileIndex === 0 ? "" : String.fromCharCode(65 + profileIndex)}`.trim(),
      location: locationLabel,
      payRange: location.payRange,
      applicationUrl: `https://example.com/jobs/${id}`,
      skillLevel: template.skillLevel,
      workModel: locationLabel.startsWith("Remote") ? "remote" : template.workModel,
      tags: template.tags,
      description: `${template.responsibility} ${template.qualifications} ${template.perks} Compensation for this role is ${location.payRange} and the position is based in ${locationLabel}.`
    };
  })
);
