import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  MapPin,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

const INITIAL_CASES = [
  {
    id: "CASE-2048",
    animal: "Gauri",
    village: "Palghar",
    condition: "Suspected Mastitis",
    risk: "High",
    status: "Vet Review",
    owner: "Ramesh Patil",
    assignedTo: "Dr. Mehta",
  },
  {
    id: "CASE-2043",
    animal: "Lakshmi",
    village: "Thane",
    condition: "Possible Brucellosis",
    risk: "Critical",
    status: "Lab Processing",
    owner: "Suresh More",
    assignedTo: "Dr. Kulkarni",
  },
  {
    id: "CASE-2039",
    animal: "Moti",
    village: "Nashik",
    condition: "Respiratory Infection",
    risk: "Medium",
    status: "Field Investigation",
    owner: "Asha Jadhav",
    assignedTo: "Field Team 04",
  },
  {
    id: "CASE-2035",
    animal: "Champa",
    village: "Vasai",
    condition: "Parasitic Infection",
    risk: "Low",
    status: "Resolved",
    owner: "Vijay Shinde",
    assignedTo: "Dr. Patil",
  },
  {
    id: "CASE-2032",
    animal: "Sita",
    village: "Boisar",
    condition: "Fever / Weakness",
    risk: "High",
    status: "Escalated",
    owner: "Ganesh More",
    assignedTo: "District Response Cell",
  },
];

const INITIAL_ZONES = [
  { name: "Palghar", level: "High", cases: 18, animals: 742, response: "Active" },
  { name: "Thane", level: "Medium", cases: 11, animals: 610, response: "Monitoring" },
  { name: "Vasai", level: "Low", cases: 5, animals: 425, response: "Stable" },
  { name: "Boisar", level: "Critical", cases: 23, animals: 890, response: "Escalated" },
];

const RISK_STYLES = {
  Critical: "border-red-200 bg-red-50 text-red-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const STATUS_STYLES = {
  "Vet Review": "bg-blue-100 text-blue-700",
  "Lab Processing": "bg-violet-100 text-violet-700",
  "Field Investigation": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Escalated: "bg-red-100 text-red-700",
};

export default function DistrictAdmin() {
  const [cases, setCases] = useState(INITIAL_CASES);
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesRisk = riskFilter === "All" || item.risk === riskFilter;
      const matchesSearch =
        !q ||
        [
          item.id,
          item.animal,
          item.village,
          item.condition,
          item.status,
          item.owner,
          item.assignedTo,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesRisk && matchesSearch;
    });
  }, [cases, search, riskFilter]);

  const stats = useMemo(
    () => ({
      active: cases.filter((item) => item.status !== "Resolved").length,
      critical: cases.filter(
        (item) => item.risk === "Critical" && item.status !== "Resolved"
      ).length,
      highRisk: cases.filter(
        (item) => item.risk === "High" && item.status !== "Resolved"
      ).length,
      field: cases.filter((item) => item.status === "Field Investigation").length,
      lab: cases.filter((item) => item.status === "Lab Processing").length,
      escalated: cases.filter((item) => item.status === "Escalated").length,
    }),
    [cases]
  );

  const updateCase = (caseId, status) => {
    setCases((current) =>
      current.map((item) => (item.id === caseId ? { ...item, status } : item))
    );

    const found = cases.find((item) => item.id === caseId);
    if (found) {
      setNotice(`${found.id} updated to ${status}.`);
      setSelectedCase({ ...found, status });
    }
  };

  const escalateCase = (item) => {
    updateCase(item.id, "Escalated");
    setNotice(`${item.id} escalated to District Response Cell.`);
  };

  const changeZoneResponse = (zoneName, response) => {
    setZones((current) =>
      current.map((zone) =>
        zone.name === zoneName ? { ...zone, response } : zone
      )
    );
    setNotice(`${zoneName} response status changed to ${response}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck size={14} />
                DISTRICT GOVERNMENT WORKSPACE
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                District Animal Health Command Center
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Monitor disease cases, field response, laboratory activity,
                risk zones and escalations across the district.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                District
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm font-extrabold">
                <MapPin size={16} className="text-emerald-600" />
                Palghar District
              </div>
            </div>
          </div>
        </header>

        {notice && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span className="flex-1">{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Close notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Kpi title="Active Cases" value={stats.active} icon={Activity} />
          <Kpi title="Critical" value={stats.critical} icon={AlertTriangle} danger />
          <Kpi title="High Risk" value={stats.highRisk} icon={BellRing} />
          <Kpi title="Field Cases" value={stats.field} icon={MapPin} />
          <Kpi title="Lab Pending" value={stats.lab} icon={ClipboardList} />
          <Kpi title="Escalated" value={stats.escalated} icon={ArrowUpRight} />
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-extrabold">District Case Queue</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Review and coordinate open animal-health cases.
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-400 focus:bg-white sm:w-64"
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
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[940px] w-full text-left">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Case</th>
                    <th className="px-5 py-3">Animal / Location</th>
                    <th className="px-5 py-3">Condition</th>
                    <th className="px-5 py-3">Risk</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="text-sm font-extrabold">{item.id}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.owner}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold">{item.animal}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.village}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {item.condition}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Assigned: {item.assignedTo}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${RISK_STYLES[item.risk]}`}
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {item.status !== "Resolved" && (
                            <button
                              type="button"
                              onClick={() => escalateCase(item)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              Escalate
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedCase(item)}
                            className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                          >
                            Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCases.length === 0 && (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No cases found.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Risk Zones</h2>
                <p className="mt-1 text-xs text-slate-500">
                  District-level surveillance snapshot.
                </p>
              </div>
              <MapPin className="text-emerald-600" size={21} />
            </div>

            <div className="mt-5 space-y-3">
              {zones.map((zone) => (
                <div
                  key={zone.name}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold">{zone.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {zone.cases} cases • {zone.animals} animals
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${RISK_STYLES[zone.level]}`}
                    >
                      {zone.level}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Response
                    </span>
                    <select
                      value={zone.response}
                      onChange={(e) =>
                        changeZoneResponse(zone.name, e.target.value)
                      }
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold outline-none"
                    >
                      <option>Active</option>
                      <option>Monitoring</option>
                      <option>Stable</option>
                      <option>Escalated</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Panel
            icon={Stethoscope}
            title="Veterinary Activity"
            items={[
              ["Cases under vet review", "14"],
              ["Treatment plans updated", "9"],
              ["Follow-ups due today", "6"],
            ]}
          />
          <Panel
            icon={ClipboardList}
            title="Field Response"
            items={[
              ["Field teams active", "8"],
              ["Investigations underway", "11"],
              ["Samples collected today", "17"],
            ]}
          />
          <Panel
            icon={Users}
            title="District Coordination"
            items={[
              ["Veterinarians online", "21"],
              ["Lab staff active", "12"],
              ["Govt alerts issued", "4"],
            ]}
          />
        </div>
      </div>

      {selectedCase && (
        <Modal title={`${selectedCase.id} • District Review`} onClose={() => setSelectedCase(null)}>
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Animal" value={selectedCase.animal} />
              <Info label="Village" value={selectedCase.village} />
              <Info label="Condition" value={selectedCase.condition} />
              <Info label="Assigned" value={selectedCase.assignedTo} />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Case Status
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Field Investigation", "Vet Review", "Lab Processing", "Resolved"].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateCase(selectedCase.id, status)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        selectedCase.status === status
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              District administrators coordinate response and escalation.
              Clinical treatment decisions remain with veterinary staff.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Kpi({ title, value, icon: Icon, danger = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Icon size={19} />
        </div>
        <span className="text-2xl font-extrabold">{value}</span>
      </div>
      <p className="mt-3 text-xs font-bold text-slate-500">{title}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, items }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={19} />
      </div>
      <h2 className="mt-4 text-base font-extrabold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
          >
            <span className="text-xs font-semibold text-slate-500">{label}</span>
            <span className="text-sm font-extrabold">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
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
