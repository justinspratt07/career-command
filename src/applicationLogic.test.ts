import { describe, expect, it } from "vitest";
import {
  applicationFromForm,
  applicationToForm,
  daysUntil,
  filterApplications,
  getActivePipelineCount,
  getAverageFitScore,
  getUpcomingFollowUps,
  normalizeSkills,
  updateApplicationStage,
} from "./applicationLogic";
import { applications } from "./data";

describe("application logic", () => {
  it("filters applications by search text across role, company, and skills", () => {
    expect(filterApplications(applications, "playwright", "All")).toHaveLength(1);
    expect(filterApplications(applications, "harborpay", "All")[0].role).toBe(
      "Full Stack Developer Associate",
    );
  });

  it("filters applications by stage", () => {
    const appliedApplications = filterApplications(applications, "", "Applied");

    expect(appliedApplications).toHaveLength(1);
    expect(appliedApplications[0].company).toBe("RetailCloud Labs");
  });

  it("updates a single application stage without changing the rest", () => {
    const updated = updateApplicationStage(applications, 2, "Technical");

    expect(updated.find((application) => application.id === 2)?.stage).toBe("Technical");
    expect(updated.find((application) => application.id === 1)?.stage).toBe("Technical");
    expect(applications.find((application) => application.id === 2)?.stage).toBe("Screening");
  });

  it("normalizes comma-separated skills and provides a fallback", () => {
    expect(normalizeSkills("React, TypeScript, SQL")).toEqual([
      "React",
      "TypeScript",
      "SQL",
    ]);
    expect(normalizeSkills(" , ")).toEqual(["Research needed"]);
  });

  it("converts form state into an application record", () => {
    const formState = applicationToForm(applications[0]);
    const nextApplication = applicationFromForm(
      { ...formState, fitScore: 93, skills: "React, Testing" },
      42,
    );

    expect(nextApplication.id).toBe(42);
    expect(nextApplication.fitScore).toBe(93);
    expect(nextApplication.skills).toEqual(["React", "Testing"]);
  });

  it("calculates portfolio dashboard metrics", () => {
    expect(getActivePipelineCount(applications)).toBe(5);
    expect(getAverageFitScore(applications)).toBe(81);
  });

  it("sorts upcoming follow-ups from the fixed demo date", () => {
    const upcoming = getUpcomingFollowUps(applications, "2026-06-21");

    expect(upcoming.map((application) => application.company)).toEqual([
      "BrightPath Learning",
      "HarborPay",
      "Northstar Health",
    ]);
    expect(daysUntil("2026-06-24", "2026-06-21")).toBe(3);
  });
});
