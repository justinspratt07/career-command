import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CirclePlus,
  Download,
  Edit3,
  ClipboardList,
  Filter,
  LayoutDashboard,
  Mail,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  UserRoundCheck,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ApplicationFormState,
  applicationFromForm,
  applicationToForm,
  daysUntil,
  filterApplications,
  getActivePipelineCount,
  getAverageFitScore,
  getUpcomingFollowUps,
  storageKey,
  updateApplicationStage,
} from "./applicationLogic";
import { Application, Stage, applications as seedApplications, stages } from "./data";

const stageTone: Record<Stage, string> = {
  Saved: "neutral",
  Applied: "blue",
  Screening: "amber",
  Technical: "teal",
  Final: "green",
  Offer: "offer",
  Rejected: "red",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function App() {
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const storedApplications = window.localStorage.getItem(storageKey);
      return storedApplications ? JSON.parse(storedApplications) : seedApplications;
    } catch {
      return seedApplications;
    }
  });
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? seedApplications[0].id);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | null>(null);
  const [formState, setFormState] = useState<ApplicationFormState>(() => applicationToForm());

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(applications));
  }, [applications]);

  const filteredApplications = useMemo(
    () => filterApplications(applications, query, stageFilter),
    [applications, query, stageFilter],
  );

  const selectedApplication = applications.find((application) => application.id === selectedId);

  const activePipeline = getActivePipelineCount(applications);
  const upcomingFollowUps = getUpcomingFollowUps(applications);
  const averageFit = getAverageFitScore(applications);

  const updateStage = (id: number, stage: Stage) => {
    setApplications((current) =>
      updateApplicationStage(current, id, stage),
    );
  };

  const openAddDrawer = () => {
    setFormState(applicationToForm());
    setDrawerMode("add");
  };

  const openEditDrawer = () => {
    if (!selectedApplication) return;
    setFormState(applicationToForm(selectedApplication));
    setDrawerMode("edit");
  };

  const closeDrawer = () => setDrawerMode(null);

  const saveApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextApplication = applicationFromForm(
      formState,
      drawerMode === "edit" && selectedApplication ? selectedApplication.id : Date.now(),
    );

    if (drawerMode === "edit") {
      setApplications((current) =>
        current.map((application) =>
          application.id === nextApplication.id ? nextApplication : application,
        ),
      );
    } else {
      setApplications((current) => [nextApplication, ...current]);
    }

    setSelectedId(nextApplication.id);
    setDrawerMode(null);
  };

  const exportSnapshot = () => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], {
      type: "application/json",
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "careercommand-applications.json";
    link.click();
    URL.revokeObjectURL(href);
  };

  const resetDemoData = () => {
    setApplications(seedApplications);
    setSelectedId(seedApplications[0].id);
    setQuery("");
    setStageFilter("All");
    window.localStorage.removeItem(storageKey);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark">CC</div>
          <div>
            <strong>CareerCommand</strong>
            <span>Junior SWE search</span>
          </div>
        </div>

        <nav className="nav-list">
          <a className="nav-item active" href="#applications">
            <LayoutDashboard size={18} />
            Applications
          </a>
          <a className="nav-item" href="#pipeline">
            <ClipboardList size={18} />
            Pipeline
          </a>
          <a className="nav-item" href="#follow-ups">
            <CalendarClock size={18} />
            Follow-ups
          </a>
          <a className="nav-item" href="#resume-fit">
            <Sparkles size={18} />
            Resume Fit
          </a>
        </nav>

        <div className="sidebar-panel">
          <span>Portfolio signal</span>
          <strong>React + TypeScript + API-ready state</strong>
          <p>Built to show job-search workflow, testing readiness, and clean product thinking.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="command-bar">
          <div>
            <h1>Applications</h1>
            <p>Track every role, follow-up, interview, and resume version in one focused workspace.</p>
          </div>
          <div className="command-actions">
            <button className="icon-button" aria-label="Open notifications">
              <Bell size={18} />
            </button>
            <button className="secondary-button" onClick={exportSnapshot}>
              <Download size={17} />
              Export snapshot
            </button>
            <button className="secondary-button" onClick={resetDemoData}>
              <RotateCcw size={17} />
              Reset demo
            </button>
            <button className="primary-button" onClick={openAddDrawer}>
              <CirclePlus size={18} />
              Add Application
            </button>
          </div>
        </header>

        <section className="analytics-strip" aria-label="Search analytics">
          <Metric icon={<BriefcaseBusiness size={19} />} label="Active pipeline" value={activePipeline} />
          <Metric icon={<CalendarClock size={19} />} label="Upcoming follow-ups" value={upcomingFollowUps.length} />
          <Metric icon={<BarChart3 size={19} />} label="Average resume fit" value={`${averageFit}%`} />
          <Metric icon={<UserRoundCheck size={19} />} label="Interview stages" value="4" />
        </section>

        <section className="workspace-grid">
          <div className="workspace-primary">
            <section className="pipeline-panel" id="pipeline" aria-label="Pipeline by stage">
              {stages.map((stage) => {
                const count = applications.filter((application) => application.stage === stage).length;

                return (
                  <button
                    className={`stage-card ${stageFilter === stage ? "selected" : ""}`}
                    key={stage}
                    onClick={() => setStageFilter(stageFilter === stage ? "All" : stage)}
                  >
                    <span className={`stage-dot ${stageTone[stage]}`} />
                    <strong>{count}</strong>
                    <span>{stage}</span>
                  </button>
                );
              })}
            </section>

            <section className="table-panel" id="applications">
              <div className="table-tools">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    aria-label="Search roles or companies"
                    placeholder="Search roles or companies"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className="tool-row">
                  <label className="filter-control">
                    <Filter size={16} />
                    <select
                      aria-label="Filter by stage"
                      value={stageFilter}
                      onChange={(event) => setStageFilter(event.target.value as Stage | "All")}
                    >
                      <option value="All">All stages</option>
                      {stages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="icon-button" aria-label="Open table settings">
                    <SlidersHorizontal size={18} />
                  </button>
                </div>
              </div>

              <div className="applications-table" role="table" aria-label="Tracked applications">
                <div className="table-header" role="row">
                  <span>Role</span>
                  <span>Stage</span>
                  <span>Fit</span>
                  <span>Follow-up</span>
                </div>
                {filteredApplications.map((application) => (
                  <button
                    className={`application-row ${
                      selectedApplication?.id === application.id ? "active" : ""
                    }`}
                    key={application.id}
                    onClick={() => setSelectedId(application.id)}
                    role="row"
                  >
                    <span className="role-cell">
                      <strong>{application.role}</strong>
                      <small>
                        {application.company} · {application.location}
                      </small>
                    </span>
                    <span className={`status-chip ${stageTone[application.stage]}`}>
                      {application.stage}
                    </span>
                    <span className="fit-cell">
                      <span>{application.fitScore}%</span>
                      <i style={{ width: `${application.fitScore}%` }} />
                    </span>
                    <span className="date-cell">{formatDate(application.followUpDate)}</span>
                  </button>
                ))}
                {filteredApplications.length === 0 && (
                  <div className="empty-table">
                    <strong>No applications found</strong>
                    <span>Try another search term or clear the stage filter.</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {selectedApplication ? (
            <aside className="detail-panel" id="follow-ups" aria-label="Selected role details">
              <div className="detail-header">
                <span>Selected role</span>
                <h2>{selectedApplication.role}</h2>
                <p>{selectedApplication.company}</p>
                <button className="edit-role-button" onClick={openEditDrawer}>
                  <Edit3 size={16} />
                  Edit role
                </button>
              </div>

              <div className="detail-section">
                <label htmlFor="stage-select">Current stage</label>
                <select
                  id="stage-select"
                  value={selectedApplication.stage}
                  onChange={(event) =>
                    updateStage(selectedApplication.id, event.target.value as Stage)
                  }
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="next-step">
                <CheckCircle2 size={20} />
                <div>
                  <span>Next step</span>
                  <strong>{selectedApplication.nextStep}</strong>
                </div>
              </div>

              <div className="detail-grid">
                <Detail label="Resume" value={selectedApplication.resumeVersion} />
                <Detail label="Source" value={selectedApplication.source} />
                <Detail label="Applied" value={formatDate(selectedApplication.appliedDate)} />
                <Detail label="Salary" value={selectedApplication.salary} />
              </div>

              <div className="contact-card">
                <Mail size={18} />
                <div>
                  <span>Contact</span>
                  <strong>{selectedApplication.contact}</strong>
                </div>
              </div>

              <div className="skills-section" id="resume-fit">
                <span>Resume Fit</span>
                <div className="fit-score-large">{selectedApplication.fitScore}%</div>
                <div className="skills-list">
                  {selectedApplication.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="notes-section">
                <span>Interview notes</span>
                <p>{selectedApplication.notes}</p>
              </div>

              <div className="followup-list">
                <span>Upcoming follow-ups</span>
                {upcomingFollowUps.map((application) => (
                  <button
                    key={application.id}
                    onClick={() => setSelectedId(application.id)}
                    className="followup-item"
                  >
                    <strong>{application.company}</strong>
                    <small>
                      {formatDate(application.followUpDate)}
                      {daysUntil(application.followUpDate) === 0
                        ? " · today"
                        : ` · ${daysUntil(application.followUpDate)}d`}
                    </small>
                  </button>
                ))}
              </div>
            </aside>
          ) : (
            <aside className="detail-panel" aria-label="No selected role">
              <div className="empty-detail">
                <strong>No application selected</strong>
                <p>Add an application to start tracking your search.</p>
              </div>
            </aside>
          )}
        </section>
      </main>
      {drawerMode && (
        <div className="drawer-backdrop" role="presentation">
          <form className="application-drawer" onSubmit={saveApplication}>
            <div className="drawer-header">
              <div>
                <span>{drawerMode === "add" ? "New application" : "Edit application"}</span>
                <h2>{drawerMode === "add" ? "Add Application" : "Update Role"}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close application drawer"
                onClick={closeDrawer}
              >
                <X size={18} />
              </button>
            </div>

            <div className="drawer-grid">
              <Field
                label="Role"
                value={formState.role}
                onChange={(value) => setFormState({ ...formState, role: value })}
                required
              />
              <Field
                label="Company"
                value={formState.company}
                onChange={(value) => setFormState({ ...formState, company: value })}
                required
              />
              <Field
                label="Location"
                value={formState.location}
                onChange={(value) => setFormState({ ...formState, location: value })}
                required
              />
              <Field
                label="Salary"
                value={formState.salary}
                onChange={(value) => setFormState({ ...formState, salary: value })}
              />
              <label className="form-field">
                <span>Stage</span>
                <select
                  value={formState.stage}
                  onChange={(event) =>
                    setFormState({ ...formState, stage: event.target.value as Stage })
                  }
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Resume fit</span>
                <input
                  min="0"
                  max="100"
                  type="number"
                  value={formState.fitScore}
                  onChange={(event) =>
                    setFormState({ ...formState, fitScore: Number(event.target.value) })
                  }
                />
              </label>
              <Field
                label="Applied date"
                type="date"
                value={formState.appliedDate}
                onChange={(value) => setFormState({ ...formState, appliedDate: value })}
                required
              />
              <Field
                label="Follow-up date"
                type="date"
                value={formState.followUpDate}
                onChange={(value) => setFormState({ ...formState, followUpDate: value })}
                required
              />
              <Field
                label="Source"
                value={formState.source}
                onChange={(value) => setFormState({ ...formState, source: value })}
              />
              <Field
                label="Contact"
                value={formState.contact}
                onChange={(value) => setFormState({ ...formState, contact: value })}
              />
              <Field
                label="Resume version"
                value={formState.resumeVersion}
                onChange={(value) => setFormState({ ...formState, resumeVersion: value })}
              />
              <Field
                label="Skills"
                value={formState.skills}
                onChange={(value) => setFormState({ ...formState, skills: value })}
                placeholder="React, TypeScript, SQL"
              />
              <Field
                className="drawer-wide"
                label="Next step"
                value={formState.nextStep}
                onChange={(value) => setFormState({ ...formState, nextStep: value })}
              />
              <label className="form-field drawer-wide">
                <span>Notes</span>
                <textarea
                  value={formState.notes}
                  onChange={(event) =>
                    setFormState({ ...formState, notes: event.target.value })
                  }
                />
              </label>
            </div>

            <div className="drawer-actions">
              <button className="secondary-button" type="button" onClick={closeDrawer}>
                Cancel
              </button>
              <button className="primary-button" type="submit">
                {drawerMode === "add" ? "Save Application" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

type MetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({ label, value }: DetailProps) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

type FieldProps = {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string | number;
};

function Field({
  className,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: FieldProps) {
  return (
    <label className={`form-field ${className ?? ""}`}>
      <span>{label}</span>
      <input
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default App;
