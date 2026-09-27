import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Leaf,
  MapPin,
  MessageSquare,
  Search,
  ShieldAlert,
  Stethoscope,
  Tractor,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const STAGES = [
  { id: "reported", label: "Reported", short: "Farmer", icon: Tractor },
  { id: "ai-screening", label: "AI Screening", short: "AI", icon: Leaf },
  { id: "vet-review", label: "Vet Review", short: "Veterinarian", icon: Stethoscope },
  { id: "field", label: "Field Investigation", short: "Field Worker", icon: Wrench },
  { id: "lab", label: "Lab Test", short: "Lab Staff", icon: FlaskConical },
  { id: "treatment", label: "Treatment", short: "Veterinarian", icon: ClipboardCheck },
  { id: "follow-up", label: "Follow-up", short: "Veterinarian", icon: CheckCircle2 },
  { id: "resolved", label: "Resolved", short: "Case Closed", icon: CheckCircle2 },
];

const INITIAL_CASES = [
  {
    id: "CASE-2048",
    animal: "Gauri",
    owner: "Ramesh Patil",
    village: "Palghar",
    condition: "Suspected Mastitis",
    risk: "High",
    stage: "vet-review",
    assigned: "Dr. Mehta",
    lastUpdate: "AI screening completed",
    escalated: false,
    notes: "Fever and reduced milk output reported.",
  },
  {
    id: "CASE-2043",
    animal: "Lakshmi",
    owner: "Suresh More",
    village: "Thane",
    condition: "Possible Brucellosis",
    risk: "Critical",
    stage: "lab",
    assigned: "Lab Team 02",
    lastUpdate: "Blood sample received",
    escalated: true,
    notes: "Critical case referred for confirmatory testing.",
  },
  {
    id: "CASE-2039",
    animal: "Moti",
    owner: "Asha Jadhav",
    village: "Nashik",
    condition: "Respiratory Infection",
    risk: "Medium",
    stage: "field",
    assigned: "Field Team 04",
    lastUpdate: "Field visit scheduled",
    escalated: false,
    notes: "Respiratory symptoms require on-site assessment.",
  },
  {
    id: "CASE-2035",
    animal: "Champa",
    owner: "Vijay Shinde",
    village: "Vasai",
    condition: "Parasitic Infection",
    risk: "Low",
    stage: "follow-up",
    assigned: "Dr. Patil",
    lastUpdate: "Follow-up due tomorrow",
    escalated: false,
    notes: "Treatment started; monitor recovery.",
  },
];

const RISK_STYLE = {
  Critical: "border-red-200 bg-red-50 text-red-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function CaseWorkflow() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [notification, setNotification] = useState("");
  const [escalationReason, setEscalationReason] = useState("");
  const [showEscalation, setShowEscalation] = useState(false);

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();

    return cases.filter((item) => {
      const riskMatch = riskFilter === "All" || item.risk === riskFilter;
      const searchMatch =
        !q ||
        [
          item.id,
          item.animal,
          item.owner,
          item.village,
          item.condition,
          item.stage,
          item.assigned,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return riskMatch && searchMatch;
    });
  }, [cases, search, riskFilter]);

  const workflowStats = useMemo(
    () => ({
      active: cases.filter((item) => item.stage !== "resolved").length,
      critical: cases.filter((item) => item.risk === "Critical").length,
      escalated: cases.filter((item) => item.escalated).length,
      pendingLab: cases.filter((item) => item.stage === "lab").length,
      followUp: cases.filter((item) => item.stage === "follow-up").length,
    }),
    [cases]
  );

  const currentStageIndex = (stage) =>
    Math.max(0, STAGES.findIndex((item) => item.id === stage));

  const moveToNextStage = (caseItem) => {
    const index = currentStageIndex(caseItem.stage);

    if (index >= STAGES.length - 1) {
      setNotification(`${caseItem.id} is already resolved.`);
      return;
    }

    const nextStage = STAGES[index + 1];

    setCases((current) =>
      current.map((item) =>
        item.id === caseItem.id
          ? {
              ...item,
              stage: nextStage.id,
              lastUpdate: `${nextStage.label} started`,
            }
          : item
      )
    );

    setSelected((current) =>
      current && current.id === caseItem.id
        ? {
            ...current,
            stage: nextStage.id,
            lastUpdate: `${nextStage.label} started`,
          }
        : current
    );

    setNotification(
      `${caseItem.id} moved to ${nextStage.label}. Role notified: ${nextStage.short}.`
    );
  };

  const submitEscalation = () => {
    if (!selected) return;

    const reason =
      escalationReason.trim() || "Escalated due to risk and workflow urgency.";

    setCases((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              escalated: true,
              lastUpdate: "Escalated to government response",
              notes: reason,
            }
          : item
      )
    );

    setSelected((current) =>
      current
        ? {
            ...current,
            escalated: true,
            lastUpdate: "Escalated to government response",
            notes: reason,
          }
        : current
    );

    setShowEscalation(false);
    setEscalationReason("");
    setNotification(
      `${selected.id} escalated. District/State response workflow has been triggered.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldAlert size={14} />
                END-TO-END CASE WORKFLOW
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Case Workflow & Escalation Center
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Track each case from farmer report and AI screening through
                veterinary review, field investigation, laboratory testing,
                treatment and government escalation.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <BellRing size={18} className="text-emerald-600" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Role-based workflow
                </p>
                <p className="text-sm font-extrabold text-slate-800">
                  Notifications enabled
                </p>
              </div>
            </div>
          </div>
        </header>

        {notification && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span className="flex-1">{notification}</span>
            <button
              type="button"
              onClick={() => setNotification("")}
              aria-label="Close notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Kpi icon={ClipboardCheck} title="Active Cases" value={workflowStats.active} />
          <Kpi icon={AlertTriangle} title="Critical" value={workflowStats.critical} danger />
          <Kpi icon={ShieldAlert} title="Escalated" value={workflowStats.escalated} />
          <Kpi icon={FlaskConical} title="Lab Stage" value={workflowStats.pendingLab} />
          <Kpi icon={CheckCircle2} title="Follow-up" value={workflowStats.followUp} />
        </div>

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Case Queue</h2>
              <p className="mt-1 text-xs text-slate-500">
                Open a case to move it through the next workflow stage.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search case, animal, village..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white sm:w-72"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              >
                <option>All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {filteredCases.map((item) => {
            const stageIndex = currentStageIndex(item.stage);
            const currentStage = STAGES[stageIndex];

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-[250px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold">{item.id}</span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${RISK_STYLE[item.risk]}`}
                      >
                        {item.risk}
                      </span>
                      {item.escalated && (
                        <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
                          ESCALATED
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-extrabold">
                      {item.animal} • {item.condition}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.owner} • {item.village}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {item.lastUpdate} • Assigned: {item.assigned}
                    </p>
                  </div>

                  <div className="w-full overflow-x-auto xl:flex-1">
                    <div className="min-w-[820px]">
                      <div className="flex items-start">
                        {STAGES.map((stage, index) => {
                          const Icon = stage.icon;
                          const complete = index <= stageIndex;
                          const current = index === stageIndex;

                          return (
                            <React.Fragment key={stage.id}>
                              <div className="flex w-[102px] flex-col items-center text-center">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 ${
                                    complete
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                      : "border-slate-200 bg-slate-50 text-slate-400"
                                  } ${current ? "ring-4 ring-emerald-100" : ""}`}
                                >
                                  <Icon size={18} />
                                </div>
                                <p
                                  className={`mt-2 text-[10px] font-bold leading-4 ${
                                    current ? "text-emerald-700" : "text-slate-500"
                                  }`}
                                >
                                  {stage.label}
                                </p>
                              </div>

                              {index < STAGES.length - 1 && (
                                <div
                                  className={`mt-5 h-0.5 flex-1 ${
                                    index < stageIndex
                                      ? "bg-emerald-400"
                                      : "bg-slate-200"
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 xl:w-[235px] xl:justify-end">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare size={15} />
                      View Case
                    </button>

                    {item.stage !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => moveToNextStage(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Next Stage
                        <ArrowRight size={15} />
                      </button>
                    )}

                    {!item.escalated && item.risk !== "Low" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(item);
                          setShowEscalation(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <ShieldAlert size={15} />
                        Escalate
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {filteredCases.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              No cases found.
            </div>
          )}
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <WorkflowCard
            icon={Tractor}
            title="Farmer → AI"
            text="Symptoms and animal observations create a screening case."
          />
          <WorkflowCard
            icon={Wrench}
            title="Field → Lab"
            text="Field investigation can trigger sample collection and laboratory testing."
          />
          <WorkflowCard
            icon={ShieldAlert}
            title="Serious Case Escalation"
            text="High or critical cases can be escalated for district/state response."
          />
        </section>
      </div>

      {selected && !showEscalation && (
        <Modal title={`${selected.id} • Case Details`} onClose={() => setSelected(null)}>
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info icon={Tractor} label="Animal" value={selected.animal} />
              <Info icon={UserRound} label="Owner" value={selected.owner} />
              <Info icon={MapPin} label="Location" value={selected.village} />
              <Info icon={AlertTriangle} label="Risk" value={selected.risk} />
              <Info icon={ClipboardCheck} label="Current Stage" value={STAGES[currentStageIndex(selected.stage)]?.label} />
              <Info icon={UserRound} label="Assigned To" value={selected.assigned} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Case Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {selected.notes}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Next workflow role:{" "}
              <strong>
                {STAGES[Math.min(STAGES.length - 1, currentStageIndex(selected.stage) + 1)]
                  ?.short}
              </strong>
              .
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {!selected.escalated && selected.risk !== "Low" && (
                <button
                  type="button"
                  onClick={() => setShowEscalation(true)}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Escalate Case
                </button>
              )}

              {selected.stage !== "resolved" && (
                <button
                  type="button"
                  onClick={() => {
                    moveToNextStage(selected);
                    setSelected((current) => current);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Move to Next Stage
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {selected && showEscalation && (
        <Modal title={`${selected.id} • Escalation`} onClose={() => setShowEscalation(false)}>
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 text-red-600" size={21} />
                <div>
                  <p className="text-sm font-extrabold text-red-800">
                    Escalate to Government Response
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-700/80">
                    This will mark the case as escalated and create a
                    district/state response notification in this prototype.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Escalation Reason
              </label>
              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                rows={5}
                placeholder="Explain why the case needs government-level attention..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-red-300 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEscalation(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitEscalation}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                <ShieldAlert size={16} />
                Escalate Case
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, title, value, danger = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={19} />
      </div>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{title}</p>
    </div>
  );
}

function WorkflowCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={19} />
      </div>
      <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <p className="text-[11px] font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-extrabold">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
