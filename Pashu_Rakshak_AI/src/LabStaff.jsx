import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  Search,
  Send,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

const INITIAL_SAMPLES = [
  {
    id: "LAB-1024",
    caseId: "CASE-2048",
    animal: "Gauri",
    farmer: "Ramesh Patil",
    disease: "Suspected Mastitis",
    sample: "Milk",
    priority: "High",
    status: "Pending",
    collectedBy: "Field Worker",
    collectedOn: "27 Sep 2026, 10:20 AM",
    village: "Palghar",
  },
  {
    id: "LAB-1023",
    caseId: "CASE-2043",
    animal: "Lakshmi",
    farmer: "Suresh More",
    disease: "Possible Brucellosis",
    sample: "Blood",
    priority: "Critical",
    status: "Processing",
    collectedBy: "Field Worker",
    collectedOn: "27 Sep 2026, 09:05 AM",
    village: "Thane",
  },
  {
    id: "LAB-1022",
    caseId: "CASE-2037",
    animal: "Moti",
    farmer: "Asha Jadhav",
    disease: "Respiratory Infection",
    sample: "Nasal Swab",
    priority: "Medium",
    status: "Completed",
    collectedBy: "Field Worker",
    collectedOn: "26 Sep 2026, 04:15 PM",
    village: "Nashik",
    result: "No significant bacterial growth detected",
  },
  {
    id: "LAB-1021",
    caseId: "CASE-2031",
    animal: "Champa",
    farmer: "Vijay Shinde",
    disease: "Parasitic Infection",
    sample: "Stool",
    priority: "Low",
    status: "Completed",
    collectedBy: "Field Worker",
    collectedOn: "26 Sep 2026, 01:30 PM",
    village: "Navi Mumbai",
    result: "Parasite load: Moderate",
  },
];

const priorityStyle = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const statusStyle = {
  Pending: "bg-slate-100 text-slate-700",
  Processing: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

export default function LabStaff() {
  const [samples, setSamples] = useState(INITIAL_SAMPLES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedSample, setSelectedSample] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [resultText, setResultText] = useState("");
  const [testType, setTestType] = useState("Rapid Screening");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const filteredSamples = useMemo(() => {
    const q = search.trim().toLowerCase();

    return samples.filter((item) => {
      const matchesFilter = filter === "All" || item.status === filter;
      const matchesSearch =
        !q ||
        [
          item.id,
          item.caseId,
          item.animal,
          item.farmer,
          item.disease,
          item.sample,
          item.village,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [samples, search, filter]);

  const stats = useMemo(() => {
    return {
      total: samples.length,
      pending: samples.filter((s) => s.status === "Pending").length,
      processing: samples.filter((s) => s.status === "Processing").length,
      completed: samples.filter((s) => s.status === "Completed").length,
      critical: samples.filter(
        (s) => s.priority === "Critical" && s.status !== "Completed"
      ).length,
    };
  }, [samples]);

  const openResultModal = (sample) => {
    setSelectedSample(sample);
    setResultText(sample.result || "");
    setNotes("");
    setTestType("Rapid Screening");
    setShowResultModal(true);
  };

  const saveResult = () => {
    if (!selectedSample || !resultText.trim()) {
      setMessage("Please enter the laboratory result before submitting.");
      return;
    }

    setSamples((current) =>
      current.map((item) =>
        item.id === selectedSample.id
          ? {
              ...item,
              status: "Completed",
              result: resultText.trim(),
              notes: notes.trim(),
              testType,
            }
          : item
      )
    );

    setMessage(
      `${selectedSample.id} result submitted successfully and marked as completed.`
    );
    setShowResultModal(false);
  };

  const startProcessing = (sample) => {
    setSamples((current) =>
      current.map((item) =>
        item.id === sample.id ? { ...item, status: "Processing" } : item
      )
    );
    setMessage(`${sample.id} moved to Processing.`);
  };

  const uploadReport = () => {
    setShowUploadModal(false);
    setMessage(
      selectedSample
        ? `Report file attached to ${selectedSample.id}.`
        : "Report file workflow opened."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck size={14} />
                LAB STAFF WORKSPACE
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Laboratory Dashboard
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Process field samples, record laboratory findings, upload
                reports, and send verified results back into the case workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Kpi label="Total Samples" value={stats.total} icon={Beaker} />
              <Kpi label="Pending" value={stats.pending} icon={Clock3} />
              <Kpi label="Processing" value={stats.processing} icon={FlaskConical} />
              <Kpi label="Completed" value={stats.completed} icon={FileCheck2} />
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span className="flex-1">{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="text-emerald-700"
              aria-label="Close message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {stats.critical > 0 && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-red-600" size={20} />
              <div>
                <p className="text-sm font-extrabold text-red-800">
                  {stats.critical} critical sample
                  {stats.critical > 1 ? "s" : ""} require attention
                </p>
                <p className="mt-1 text-xs text-red-700/80">
                  Prioritize these samples and return findings to the treating
                  veterinarian as soon as possible.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <QuickCard
            icon={FlaskConical}
            title="Sample Processing"
            text="Track received, processing and completed samples."
          />
          <QuickCard
            icon={FileText}
            title="Lab Reports"
            text="Record findings and attach report documents."
          />
          <QuickCard
            icon={Send}
            title="Vet Handoff"
            text="Return verified results into the case workflow."
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Sample Queue</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredSamples.length} sample
                  {filteredSamples.length !== 1 ? "s" : ""} shown
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
                    placeholder="Search sample, case, animal..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white sm:w-72"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Sample</th>
                  <th className="px-5 py-3 font-bold">Animal / Farmer</th>
                  <th className="px-5 py-3 font-bold">Test</th>
                  <th className="px-5 py-3 font-bold">Priority</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Collection</th>
                  <th className="px-5 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="text-sm font-extrabold text-slate-900">
                        {sample.id}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{sample.caseId}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-800">
                        {sample.animal}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {sample.farmer} • {sample.village}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {sample.sample}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {sample.disease}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                          priorityStyle[sample.priority]
                        }`}
                      >
                        {sample.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[sample.status]}`}
                      >
                        {sample.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-slate-700">
                        {sample.collectedOn}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {sample.collectedBy}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {sample.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => startProcessing(sample)}
                            className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                          >
                            Start
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openResultModal(sample)}
                          className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          {sample.status === "Completed"
                            ? "View / Edit"
                            : "Enter Result"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSamples.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No samples match your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showResultModal && selectedSample && (
        <Modal
          title={`Lab Result • ${selectedSample.id}`}
          onClose={() => setShowResultModal(false)}
        >
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Case ID" value={selectedSample.caseId} />
              <InfoBox label="Animal" value={selectedSample.animal} />
              <InfoBox label="Sample Type" value={selectedSample.sample} />
              <InfoBox label="Suspected Condition" value={selectedSample.disease} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-emerald-400"
              >
                <option>Rapid Screening</option>
                <option>Microscopy</option>
                <option>Culture</option>
                <option>PCR</option>
                <option>ELISA</option>
                <option>Biochemistry</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Laboratory Result
              </label>
              <textarea
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
                rows={5}
                placeholder="Enter verified laboratory findings..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Lab Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes, limitations, or follow-up recommendation..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveResult}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <Send size={16} />
                Submit Result
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showUploadModal && (
        <Modal
          title="Upload Laboratory Report"
          onClose={() => setShowUploadModal(false)}
        >
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
            <Upload className="mx-auto text-emerald-600" size={30} />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Attach PDF or image report
            </p>
            <p className="mt-1 text-xs text-slate-500">
              This prototype stores the upload action locally.
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              className="mt-5 block w-full text-sm"
            />
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={uploadReport}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <Upload size={16} />
              Attach Report
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Kpi({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <Icon size={17} className="text-emerald-600" />
        <span className="text-xl font-extrabold">{value}</span>
      </div>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function QuickCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={19} />
      </div>
      <h3 className="mt-3 text-sm font-extrabold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
