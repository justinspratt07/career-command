export type Stage =
  | "Saved"
  | "Applied"
  | "Screening"
  | "Technical"
  | "Final"
  | "Offer"
  | "Rejected";

export type Application = {
  id: number;
  role: string;
  company: string;
  location: string;
  salary: string;
  source: string;
  stage: Stage;
  fitScore: number;
  nextStep: string;
  followUpDate: string;
  appliedDate: string;
  contact: string;
  resumeVersion: string;
  notes: string;
  skills: string[];
};

export const stages: Stage[] = [
  "Saved",
  "Applied",
  "Screening",
  "Technical",
  "Final",
  "Offer",
  "Rejected",
];

export const applications: Application[] = [
  {
    id: 1,
    role: "Junior Software Engineer",
    company: "Northstar Health",
    location: "Remote, US",
    salary: "$68k-$78k",
    source: "LinkedIn",
    stage: "Technical",
    fitScore: 91,
    nextStep: "Complete React + SQL take-home",
    followUpDate: "2026-06-24",
    appliedDate: "2026-06-11",
    contact: "Maya R., Engineering Recruiter",
    resumeVersion: "software-engineer-react-ts.pdf",
    notes:
      "Strong match for React, TypeScript, REST APIs, SQL, and automated testing. Prepare a short story about Pizza-Shop and the QA automation repo.",
    skills: ["React", "TypeScript", "SQL", "REST", "Jest"],
  },
  {
    id: 2,
    role: "Frontend Developer I",
    company: "BrightPath Learning",
    location: "Chicago, IL",
    salary: "$64k-$72k",
    source: "Company careers",
    stage: "Screening",
    fitScore: 86,
    nextStep: "Recruiter call",
    followUpDate: "2026-06-22",
    appliedDate: "2026-06-15",
    contact: "careers@brightpath.example",
    resumeVersion: "frontend-react-portfolio.pdf",
    notes:
      "Emphasize accessible UI, form validation, state management, and turning coursework into polished portfolio projects.",
    skills: ["React", "CSS", "Accessibility", "Forms"],
  },
  {
    id: 3,
    role: "QA Automation Engineer",
    company: "RetailCloud Labs",
    location: "Remote, US",
    salary: "$60k-$70k",
    source: "Indeed",
    stage: "Applied",
    fitScore: 82,
    nextStep: "Send GitHub project link",
    followUpDate: "2026-06-26",
    appliedDate: "2026-06-18",
    contact: "Talent team",
    resumeVersion: "qa-playwright-testing.pdf",
    notes:
      "Swag Labs Playwright repo maps well. Add a concise note about test plans, traceability, CI, and repeatable test runs.",
    skills: ["Playwright", "TypeScript", "CI", "Test cases"],
  },
  {
    id: 4,
    role: "Backend Developer Intern",
    company: "CivicData Tools",
    location: "Austin, TX",
    salary: "$25/hr",
    source: "Handshake",
    stage: "Saved",
    fitScore: 74,
    nextStep: "Tailor resume for Python and APIs",
    followUpDate: "2026-06-28",
    appliedDate: "2026-06-20",
    contact: "Unknown",
    resumeVersion: "draft-backend-python.pdf",
    notes:
      "Potential fit through Python, Flask, database modeling, and API testing. Needs a stronger backend paragraph before applying.",
    skills: ["Python", "Flask", "PostgreSQL", "APIs"],
  },
  {
    id: 5,
    role: "Full Stack Developer Associate",
    company: "HarborPay",
    location: "Hybrid, Columbus, OH",
    salary: "$70k-$80k",
    source: "Built In",
    stage: "Final",
    fitScore: 89,
    nextStep: "Panel interview prep",
    followUpDate: "2026-06-23",
    appliedDate: "2026-06-03",
    contact: "Andre L., Hiring Manager",
    resumeVersion: "full-stack-react-python.pdf",
    notes:
      "Prepare concise architecture walkthrough: React UI, Flask APIs, validation, tests, deployment, and tradeoffs.",
    skills: ["React", "Python", "PostgreSQL", "Docker"],
  },
  {
    id: 6,
    role: "Software Support Developer",
    company: "OpsBridge Systems",
    location: "Remote, US",
    salary: "$58k-$66k",
    source: "Referral",
    stage: "Offer",
    fitScore: 79,
    nextStep: "Compare offer and growth path",
    followUpDate: "2026-06-25",
    appliedDate: "2026-05-29",
    contact: "Eli P., Team Lead",
    resumeVersion: "support-developer.pdf",
    notes:
      "Good entry point with debugging, SQL support, customer-facing engineering, and internal tooling.",
    skills: ["SQL", "Debugging", "APIs", "Communication"],
  },
  {
    id: 7,
    role: "Entry Level Java Developer",
    company: "Metro Benefits Group",
    location: "Remote, US",
    salary: "$62k-$69k",
    source: "ZipRecruiter",
    stage: "Rejected",
    fitScore: 67,
    nextStep: "Archive and reuse notes",
    followUpDate: "2026-06-19",
    appliedDate: "2026-05-31",
    contact: "Applicant portal",
    resumeVersion: "java-maven-simplecalc.pdf",
    notes:
      "Rejected after screening. Keep SimpleCalc repo as Java proof, but prioritize React/TypeScript roles.",
    skills: ["Java", "Maven", "JUnit"],
  },
];
