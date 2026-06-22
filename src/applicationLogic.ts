import { Application, Stage } from "./data";

export const storageKey = "careercommand-applications";

export type ApplicationFormState = Omit<Application, "id" | "skills"> & {
  skills: string;
};

export function applicationToForm(application?: Application): ApplicationFormState {
  return {
    role: application?.role ?? "",
    company: application?.company ?? "",
    location: application?.location ?? "",
    salary: application?.salary ?? "",
    source: application?.source ?? "",
    stage: application?.stage ?? "Saved",
    fitScore: application?.fitScore ?? 75,
    nextStep: application?.nextStep ?? "",
    followUpDate: application?.followUpDate ?? "2026-06-30",
    appliedDate: application?.appliedDate ?? "2026-06-21",
    contact: application?.contact ?? "",
    resumeVersion: application?.resumeVersion ?? "",
    notes: application?.notes ?? "",
    skills: application?.skills.join(", ") ?? "",
  };
}

export function normalizeSkills(value: string) {
  const skills = value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return skills.length > 0 ? skills : ["Research needed"];
}

export function applicationFromForm(
  formState: ApplicationFormState,
  id: number,
): Application {
  return {
    ...formState,
    id,
    fitScore: Number(formState.fitScore),
    skills: normalizeSkills(formState.skills),
  };
}

export function filterApplications(
  applications: Application[],
  query: string,
  stageFilter: Stage | "All",
) {
  const normalizedQuery = query.trim().toLowerCase();

  return applications.filter((application) => {
    const matchesStage = stageFilter === "All" || application.stage === stageFilter;
    const searchable = [
      application.role,
      application.company,
      application.location,
      application.source,
      ...application.skills,
    ]
      .join(" ")
      .toLowerCase();

    return matchesStage && searchable.includes(normalizedQuery);
  });
}

export function updateApplicationStage(
  applications: Application[],
  id: number,
  stage: Stage,
) {
  return applications.map((application) =>
    application.id === id ? { ...application, stage } : application,
  );
}

export function getActivePipelineCount(applications: Application[]) {
  return applications.filter(
    (application) => !["Rejected", "Offer"].includes(application.stage),
  ).length;
}

export function getAverageFitScore(applications: Application[]) {
  if (applications.length === 0) return 0;

  return Math.round(
    applications.reduce((total, application) => total + application.fitScore, 0) /
      applications.length,
  );
}

export function daysUntil(value: string, today = "2026-06-21") {
  const current = new Date(`${today}T12:00:00`);
  const target = new Date(`${value}T12:00:00`);
  return Math.ceil((target.getTime() - current.getTime()) / 86_400_000);
}

export function getUpcomingFollowUps(applications: Application[], today = "2026-06-21") {
  return applications
    .filter((application) => daysUntil(application.followUpDate, today) >= 0)
    .sort(
      (a, b) => daysUntil(a.followUpDate, today) - daysUntil(b.followUpDate, today),
    )
    .slice(0, 3);
}
