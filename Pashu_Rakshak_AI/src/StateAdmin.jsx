import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const DISTRICTS = [
  {
    name: "Palghar",
    cases: 42,
    critical: 4,
    risk: "High",
    vets: 21,
    labs: 12,
    response: "Active",
  },
  {
    name: "Thane",
    cases: 31,
    critical: 2,
    risk: "Medium",
    vets: 18,
    labs: 9,
    response: "Monitoring",
  },
  {
    name: "Nashik",
    cases: 27,
    critical: 1,
    risk: "Medium",
    vets: 16,
    labs: 8,
    response: "Stable",
  },
  {
    name: "Pune",
    cases: 19,
    critical: 0,
    risk: "Low",
    vets: 23,
    labs: 11,
    response: "Stable",
  },
  {
    name: "Nagpur",
    cases: 38,
    critical: 3,
    risk: "High",
    vets: 20,
    labs: 10,
    response: "Active",
  },
];

const TREND = [
  { label: "Mon", value: 36 },
  { label: "Tue", value: 48 },
  { label: "Wed", value: 44 },
  { label: "Thu", value: 57 },
  { label: "Fri", value: 63 },
  { label: "Sat", value: 55 },
  { label: "Sun", value: 68 },
];

const RISK_STYLE = {
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function StateAdmin() {
  const [districts, setDistricts] = useState(DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [notice, setNotice] = useState("");

  const stats = useMemo(
    () => ({
      districts: districts.length,
      activeCases: districts.reduce((sum, item) => sum + item.cases, 0),
      critical: districts.reduce((sum, item) => sum + item.critical, 0),
      highRisk: districts.filter((item) => item.risk === "High").length,
      vets: districts.reduce((sum, item) => sum + item.vets, 0),
      labs: districts.reduce((sum, item) => sum + item.labs, 0),
    }),
    [districts]
  );

  const updateResponse = (name, response) => {
    setDistricts((current) =>
      current.map((item) =>
        item.name === name ? { ...item, response } : item
      )
    );
    setNotice(`${name} response status updated to ${response}.`);
  };

  const escalateDistrict = (item) => {
    setNotice(`${item.name} escalated to State Response Cell.`);
    updateResponse(item.name, "Escalated");
  };

  const maxTrend = Math.max(...TREND.map((item) => item.value));

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Globe2 size={14} />
                STATE GOVERNMENT WORKSPACE
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                State Animal Health Intelligence Center
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                View district-level disease intelligence, critical cases,
                response activity, trends and statewide escalations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                State
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm font-extrabold">
                <MapPin size={16} className="text-emerald-600" />
                Maharashtra
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
          <Kpi title="Districts" value={stats.districts} icon={Globe2} />
          <Kpi title="Active Cases" value={stats.activeCases} icon={Activity} />
          <Kpi title="Critical Cases" value={stats.critical} icon={AlertTriangle} />
          <Kpi title="High-Risk Districts" value={stats.highRisk} icon={BellRing} />
          <Kpi title="Veterinarians" value={stats.vets} icon={Users} />
          <Kpi title="Lab Staff" value={stats.labs} icon={BarChart3} />
        </div>

        <div className="mb-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold">District Monitoring</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Coordinate response and review statewide risk signals.
                  </p>
                </div>
                <ShieldCheck className="text-emerald-600" size={21} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">District</th>
                    <th className="px-5 py-3">Cases</th>
                    <th className="px-5 py-3">Critical</th>
                    <th className="px-5 py-3">Risk</th>
                    <th className="px-5 py-3">Response</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {districts.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="text-sm font-extrabold">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.vets} vets • {item.labs} lab staff
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold">
                        {item.cases}
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold">
                        {item.critical}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${RISK_STYLE[item.risk]}`}
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={item.response}
                          onChange={(e) =>
                            updateResponse(item.name, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-bold outline-none"
                        >
                          <option>Active</option>
                          <option>Monitoring</option>
                          <option>Stable</option>
                          <option>Escalated</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {item.response !== "Escalated" && (
                            <button
                              type="button"
                              onClick={() => escalateDistrict(item)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              Escalate
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedDistrict(item)}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                          >
                            Details
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">7-Day Case Trend</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Prototype surveillance trend.
                </p>
              </div>
              <BarChart3 size={21} className="text-emerald-600" />
            </div>

            <div className="mt-7 flex h-56 items-end justify-between gap-2">
              {TREND.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className="rounded-t-xl bg-emerald-500/80"
                    style={{
                      height: `${Math.max(18, (item.value / maxTrend) * 100)}%`,
                    }}
                    title={`${item.label}: ${item.value} cases`}
                  />
                  <div className="mt-2 text-center text-[11px] font-bold text-slate-400">
                    {item.label}
                  </div>
                  <div className="mt-1 text-center text-xs font-extrabold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 text-amber-600" size={19} />
                <div>
                  <p className="text-sm font-extrabold text-amber-800">
                    State response watch
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-700/80">
                    High-risk districts can be escalated for additional
                    veterinary, field or laboratory coordination.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Panel
            icon={BellRing}
            title="State Alerts"
            value="7"
            text="Active government alerts requiring review."
          />
          <Panel
            icon={Activity}
            title="Response Operations"
            value="83%"
            text="District response activities currently on track."
          />
          <Panel
            icon={ArrowUpRight}
            title="Escalations"
            value="5"
            text="Cases or district events escalated to state level."
          />
        </div>
      </div>

      {selectedDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-extrabold">
                {selectedDistrict.name} • State View
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDistrict(null)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Info label="Total Cases" value={selectedDistrict.cases} />
              <Info label="Critical Cases" value={selectedDistrict.critical} />
              <Info label="Veterinarians" value={selectedDistrict.vets} />
              <Info label="Lab Staff" value={selectedDistrict.labs} />
              <Info label="Risk Level" value={selectedDistrict.risk} />
              <Info label="Response" value={selectedDistrict.response} />
            </div>

            <div className="border-t border-slate-200 p-5 text-sm text-slate-600">
              State administration can coordinate resources and escalation
              across districts. Clinical decisions remain with veterinary
              personnel.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={19} />
        </div>
        <span className="text-2xl font-extrabold">{value}</span>
      </div>
      <p className="mt-3 text-xs font-bold text-slate-500">{title}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, value, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={19} />
        </div>
        <span className="text-xl font-extrabold">{value}</span>
      </div>
      <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold">{value}</p>
    </div>
  );
}
