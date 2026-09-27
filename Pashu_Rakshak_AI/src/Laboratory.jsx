import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FlaskConical,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Stethoscope,
  XCircle,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("pashuAccessToken") || "";
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("pashuAccessToken");
    localStorage.removeItem("pashuUser");
    localStorage.removeItem("pashuAllowedRole");
    localStorage.removeItem("pashuRole");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let message = "Laboratory request failed.";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      // Keep default.
    }
    throw new Error(message);
  }

  return response.json();
}

function toItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function riskClass(value) {
  const risk = String(value || "Medium").toLowerCase();

  if (risk === "critical") return "critical";
  if (risk === "high") return "high";
  if (risk === "low") return "low";
  return "medium";
}

function statusData(value) {
  const status = String(value || "Pending").toLowerCase();

  if (status === "completed") {
    return {
      className: "completed",
      icon: CheckCircle2,
    };
  }

  if (status === "processing") {
    return {
      className: "processing",
      icon: FlaskConical,
    };
  }

  if (status === "rejected") {
    return {
      className: "rejected",
      icon: XCircle,
    };
  }

  return {
    className: "pending",
    icon: Clock3,
  };
}

function Laboratory() {
  const [tests, setTests] = useState([]);
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    case_id: "",
    animal_id: "",
    animal_name: "",
    sample_type: "Blood",
    test_name: "Complete Blood Count",
    priority: "Medium",
    notes: "",
  });

  async function loadData(firstLoad = false) {
    try {
      setError("");
      setSuccess("");

      if (firstLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [labData, caseData] = await Promise.all([
        apiRequest("/api/lab-tests"),
        apiRequest("/api/cases?limit=200"),
      ]);

      setTests(toItems(labData));
      setCases(toItems(caseData));
    } catch (err) {
      setError(err?.message || "Unable to load laboratory data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData(true);
  }, []);

  const filteredTests = useMemo(() => {
    const search = query.trim().toLowerCase();

    return [...tests]
      .filter((item) => {
        if (filter !== "All" && String(item?.status || "Pending") !== filter) {
          return false;
        }

        if (!search) return true;

        const haystack = [
          item?.animal_name,
          item?.test_name,
          item?.sample_type,
          item?.priority,
          item?.status,
          item?.case_id,
          item?.notes,
          item?.result,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      })
      .sort((a, b) => {
        const aTime = new Date(a?.created_at || 0).getTime();
        const bTime = new Date(b?.created_at || 0).getTime();
        return bTime - aTime;
      });
  }, [tests, filter, query]);

  const stats = useMemo(() => {
    return {
      total: tests.length,
      pending: tests.filter(
        (item) => String(item?.status || "Pending") === "Pending"
      ).length,
      processing: tests.filter(
        (item) => String(item?.status || "") === "Processing"
      ).length,
      completed: tests.filter(
        (item) => String(item?.status || "") === "Completed"
      ).length,
      critical: tests.filter((item) =>
        ["Critical", "High"].includes(String(item?.priority || ""))
      ).length,
    };
  }, [tests]);

  function selectCase(event) {
    const caseId = event.target.value;

    setForm((current) => {
      if (!caseId) {
        return {
          ...current,
          case_id: "",
          animal_id: "",
          animal_name: "",
        };
      }

      const found = cases.find((item) => String(item.id) === String(caseId));

      return {
        ...current,
        case_id: caseId,
        animal_id: found?.animal_id || "",
        animal_name: found?.animal_name || "",
      };
    });
  }

  async function createLabTest(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.animal_name.trim()) {
        throw new Error("Please select a case or enter an animal name.");
      }

      if (!form.test_name.trim()) {
        throw new Error("Please enter a test name.");
      }

      await apiRequest("/api/lab-tests", {
        method: "POST",
        body: JSON.stringify({
          case_id: form.case_id || null,
          animal_id: form.animal_id || null,
          animal_name: form.animal_name.trim(),
          sample_type: form.sample_type,
          test_name: form.test_name.trim(),
          priority: form.priority,
          status: "Pending",
          notes: form.notes.trim() || null,
        }),
      });

      setCreateOpen(false);
      setForm({
        case_id: "",
        animal_id: "",
        animal_name: "",
        sample_type: "Blood",
        test_name: "Complete Blood Count",
        priority: "Medium",
        notes: "",
      });

      setSuccess("Laboratory test request created successfully.");
      await loadData(false);
    } catch (err) {
      setError(err?.message || "Could not create laboratory test.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(test, nextStatus) {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await apiRequest(`/api/lab-tests/${test.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      setSuccess(`Lab test moved to ${nextStatus}.`);
      setSelectedTest(null);
      await loadData(false);
    } catch (err) {
      setError(err?.message || "Could not update laboratory test.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style>{`
        .laboratory-page {
          max-width: 1280px;
          margin: 0 auto;
          padding-bottom: 36px;
          color: #173e35;
        }

        .laboratory-page * {
          box-sizing: border-box;
        }

        .lab-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 18px;
        }

        .lab-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .lab-header p {
          margin: 7px 0 0;
          max-width: 720px;
          color: #7d8d86;
          font-size: 12px;
          line-height: 1.55;
        }

        .lab-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .lab-button {
          height: 38px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          color: #506f65;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 850;
        }

        .lab-button.primary {
          border-color: #d8e6c8;
          background: #dff0a7;
          color: #3d5a2e;
        }

        .lab-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .lab-refresh.spinning svg {
          animation: lab-spin .8s linear infinite;
        }

        @keyframes lab-spin {
          to { transform: rotate(360deg); }
        }

        .lab-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 15px;
        }

        .lab-stat {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 13px;
          padding: 14px;
        }

        .lab-stat-icon {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef5e4;
          color: #688b3a;
        }

        .lab-stat strong {
          display: block;
          margin-top: 11px;
          color: #294d43;
          font-size: 22px;
        }

        .lab-stat span {
          display: block;
          margin-top: 4px;
          color: #81908a;
          font-size: 9px;
        }

        .lab-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 9px;
        }

        .lab-alert.error {
          background: #fff1ef;
          border: 1px solid #f0d7d3;
          color: #a64b43;
        }

        .lab-alert.success {
          background: #eff8e8;
          border: 1px solid #dcebd0;
          color: #5f8037;
        }

        .lab-alert button {
          margin-left: auto;
          border: 0;
          border-radius: 7px;
          padding: 6px 9px;
          background: currentColor;
          color: #fff;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        .lab-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 13px 15px;
          border-bottom: 1px solid #edf2ef;
        }

        .lab-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .lab-tab {
          border: 1px solid #e1ebe7;
          background: #fff;
          border-radius: 999px;
          padding: 7px 9px;
          color: #6f8279;
          font-size: 8px;
          font-weight: 850;
          cursor: pointer;
        }

        .lab-tab.active {
          background: #edf6e3;
          border-color: #dce9cf;
          color: #5e8135;
        }

        .lab-search {
          height: 36px;
          min-width: 235px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          outline: none;
          padding: 0 10px;
          color: #47665c;
          font-size: 9px;
        }

        .lab-card {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(44, 69, 59, .04);
        }

        .lab-table {
          width: 100%;
          border-collapse: collapse;
        }

        .lab-table th {
          padding: 11px 12px;
          text-align: left;
          border-bottom: 1px solid #edf2ef;
          color: #8a9892;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .lab-table td {
          padding: 12px;
          border-bottom: 1px solid #eef2f0;
          color: #64766e;
          font-size: 9px;
        }

        .lab-table tbody tr {
          cursor: pointer;
        }

        .lab-table tbody tr:hover {
          background: #fafcf9;
        }

        .lab-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .lab-animal strong {
          display: block;
          color: #3e5e54;
          font-size: 10px;
        }

        .lab-animal span {
          display: block;
          margin-top: 3px;
          color: #929e99;
          font-size: 8px;
        }

        .lab-status,
        .lab-priority {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 999px;
          padding: 5px 7px;
          font-size: 7px;
          font-weight: 900;
        }

        .lab-status.pending {
          background: #fff8df;
          color: #92772a;
        }

        .lab-status.processing {
          background: #e9f2f8;
          color: #39758e;
        }

        .lab-status.completed {
          background: #eaf7ec;
          color: #4d8a5f;
        }

        .lab-status.rejected {
          background: #ffe9e7;
          color: #ac4a42;
        }

        .lab-priority.low {
          background: #eef8df;
          color: #608238;
        }

        .lab-priority.medium {
          background: #fff8df;
          color: #92772a;
        }

        .lab-priority.high {
          background: #fff0df;
          color: #b56f24;
        }

        .lab-priority.critical {
          background: #ffe8e5;
          color: #b1483e;
        }

        .lab-empty,
        .lab-loading {
          padding: 55px 20px;
          text-align: center;
          color: #94a09c;
          font-size: 10px;
        }

        .lab-empty svg,
        .lab-loading svg {
          display: block;
          margin: 0 auto 9px;
        }

        .lab-loading svg {
          animation: lab-spin 1s linear infinite;
        }

        .lab-note {
          margin-top: 13px;
          padding: 10px 12px;
          border-radius: 9px;
          background: #f2f6ec;
          color: #74836e;
          font-size: 8px;
          line-height: 1.55;
        }

        .lab-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(16, 35, 28, .48);
        }

        .lab-modal {
          width: min(650px, 100%);
          max-height: 90vh;
          overflow: auto;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 30px 70px rgba(0,0,0,.22);
        }

        .lab-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 17px;
          border-bottom: 1px solid #edf2ef;
        }

        .lab-modal-header h2 {
          margin: 0;
          color: #284d43;
          font-size: 16px;
        }

        .lab-close {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          background: #f4f7f5;
          color: #6f7e78;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .lab-form {
          display: grid;
          gap: 11px;
          padding: 17px;
        }

        .lab-form label {
          display: grid;
          gap: 5px;
          color: #546f65;
          font-size: 9px;
          font-weight: 850;
        }

        .lab-form input,
        .lab-form select,
        .lab-form textarea {
          width: 100%;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          padding: 9px 10px;
          outline: none;
          color: #385a50;
          font-size: 10px;
          font-weight: 500;
        }

        .lab-form textarea {
          min-height: 80px;
          resize: vertical;
        }

        .lab-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .lab-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 5px;
        }

        .lab-detail {
          padding: 17px;
        }

        .lab-detail-top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: flex-start;
        }

        .lab-detail-top h3 {
          margin: 0;
          color: #2e5046;
          font-size: 17px;
        }

        .lab-detail-top p {
          margin: 5px 0 0;
          color: #84928c;
          font-size: 9px;
        }

        .lab-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
          margin-top: 14px;
        }

        .lab-detail-box {
          padding: 10px;
          border-radius: 9px;
          background: #f7faf8;
        }

        .lab-detail-box span {
          display: block;
          color: #8a9892;
          font-size: 8px;
        }

        .lab-detail-box strong {
          display: block;
          margin-top: 4px;
          color: #45655b;
          font-size: 10px;
        }

        .lab-result-box {
          margin-top: 11px;
          padding: 11px;
          border-radius: 10px;
          background: #f2f6ec;
        }

        .lab-result-box strong {
          color: #5b7a37;
          font-size: 9px;
        }

        .lab-result-box p {
          margin: 5px 0 0;
          color: #70806b;
          font-size: 9px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .lab-stats {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .lab-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .lab-search {
            min-width: 0;
            width: 100%;
          }

          .lab-table-wrap {
            overflow-x: auto;
          }

          .lab-table {
            min-width: 820px;
          }
        }

        @media (max-width: 600px) {
          .lab-header {
            flex-direction: column;
          }

          .lab-stats {
            grid-template-columns: 1fr 1fr;
          }

          .lab-form-grid,
          .lab-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 420px) {
          .lab-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="laboratory-page">
        <div className="lab-header">
          <div>
            <h1>Laboratory</h1>
            <p>
              Manage pending tests, sample processing and laboratory results
              linked to animal health cases.
            </p>
          </div>

          <div className="lab-actions">
            <button
              className={`lab-button lab-refresh ${
                refreshing ? "spinning" : ""
              }`}
              onClick={() => loadData(false)}
              disabled={refreshing}
            >
              <RefreshCw size={15} />
              Refresh
            </button>

            <button
              className="lab-button primary"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={15} />
              Request Lab Test
            </button>
          </div>
        </div>

        {error && (
          <div className="lab-alert error">
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {success && (
          <div className="lab-alert success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
            <button onClick={() => setSuccess("")}>Dismiss</button>
          </div>
        )}

        <div className="lab-stats">
          <div className="lab-stat">
            <div className="lab-stat-icon">
              <Beaker size={17} />
            </div>
            <strong>{stats.total}</strong>
            <span>Total tests</span>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <Clock3 size={17} />
            </div>
            <strong>{stats.pending}</strong>
            <span>Pending</span>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <FlaskConical size={17} />
            </div>
            <strong>{stats.processing}</strong>
            <span>Processing</span>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <FileCheck2 size={17} />
            </div>
            <strong>{stats.completed}</strong>
            <span>Completed</span>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <ShieldAlert size={17} />
            </div>
            <strong>{stats.critical}</strong>
            <span>High / critical priority</span>
          </div>
        </div>

        <section className="lab-card">
          <div className="lab-toolbar">
            <div className="lab-tabs">
              {["All", "Pending", "Processing", "Completed", "Rejected"].map(
                (item) => (
                  <button
                    key={item}
                    className={`lab-tab ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div>
              <input
                className="lab-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search animal, test, case..."
              />
            </div>
          </div>

          {loading ? (
            <div className="lab-loading">
              <RefreshCw size={25} />
              <div>Loading laboratory data from MongoDB...</div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="lab-empty">
              <Beaker size={27} />
              <div>No laboratory tests found.</div>
            </div>
          ) : (
            <div className="lab-table-wrap">
              <table className="lab-table">
                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Test</th>
                    <th>Sample</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Case</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTests.map((item) => {
                    const statusInfo = statusData(item.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTest(item)}
                      >
                        <td>
                          <div className="lab-animal">
                            <strong>{item.animal_name || "Unnamed animal"}</strong>
                            <span>{item.animal_id || "Animal ID unavailable"}</span>
                          </div>
                        </td>

                        <td>{item.test_name || "Laboratory test"}</td>
                        <td>{item.sample_type || "—"}</td>

                        <td>
                          <span
                            className={`lab-priority ${riskClass(
                              item.priority
                            )}`}
                          >
                            {item.priority || "Medium"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`lab-status ${statusInfo.className}`}
                          >
                            <StatusIcon size={10} />
                            {item.status || "Pending"}
                          </span>
                        </td>

                        <td>
                          {item.case_id
                            ? String(item.case_id).slice(-8)
                            : "—"}
                        </td>

                        <td>{formatDate(item.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="lab-note">
          Laboratory results are recorded as part of the case workflow. A
          completed lab result can be followed by veterinarian review,
          treatment and follow-up updates.
        </div>
      </div>

      {createOpen && (
        <div className="lab-modal-overlay">
          <div className="lab-modal">
            <div className="lab-modal-header">
              <h2>Request Laboratory Test</h2>

              <button
                className="lab-close"
                type="button"
                onClick={() => setCreateOpen(false)}
              >
                <XCircle size={17} />
              </button>
            </div>

            <form className="lab-form" onSubmit={createLabTest}>
              <label>
                Related Case
                <select value={form.case_id} onChange={selectCase}>
                  <option value="">No linked case / manual entry</option>
                  {cases.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.animal_name || "Animal"} ·{" "}
                      {item.condition || "Health case"} ·{" "}
                      {item.id}
                    </option>
                  ))}
                </select>
              </label>

              <div className="lab-form-grid">
                <label>
                  Animal Name
                  <input
                    value={form.animal_name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        animal_name: event.target.value,
                      }))
                    }
                    placeholder="Animal name"
                  />
                </label>

                <label>
                  Sample Type
                  <select
                    value={form.sample_type}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sample_type: event.target.value,
                      }))
                    }
                  >
                    <option>Blood</option>
                    <option>Milk</option>
                    <option>Urine</option>
                    <option>Saliva</option>
                    <option>Stool</option>
                    <option>Swab</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Test Name
                  <input
                    value={form.test_name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        test_name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        priority: event.target.value,
                      }))
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>
              </div>

              <label>
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Sample details, symptoms or test instructions..."
                />
              </label>

              <div className="lab-form-actions">
                <button
                  type="button"
                  className="lab-button"
                  onClick={() => setCreateOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="lab-button primary"
                  disabled={saving}
                >
                  {saving ? (
                    <RefreshCw size={14} className="spinning" />
                  ) : (
                    <Plus size={14} />
                  )}
                  {saving ? "Creating..." : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTest && (
        <div className="lab-modal-overlay">
          <div className="lab-modal">
            <div className="lab-modal-header">
              <h2>Laboratory Test Details</h2>

              <button
                className="lab-close"
                type="button"
                onClick={() => setSelectedTest(null)}
              >
                <XCircle size={17} />
              </button>
            </div>

            <div className="lab-detail">
              <div className="lab-detail-top">
                <div>
                  <h3>
                    {selectedTest.animal_name || "Unnamed animal"}
                  </h3>
                  <p>
                    {selectedTest.test_name || "Laboratory test"} ·{" "}
                    {selectedTest.sample_type || "Sample"}
                  </p>
                </div>

                <span
                  className={`lab-priority ${riskClass(
                    selectedTest.priority
                  )}`}
                >
                  {selectedTest.priority || "Medium"}
                </span>
              </div>

              <div className="lab-detail-grid">
                <div className="lab-detail-box">
                  <span>Case ID</span>
                  <strong>{selectedTest.case_id || "Not linked"}</strong>
                </div>

                <div className="lab-detail-box">
                  <span>Status</span>
                  <strong>{selectedTest.status || "Pending"}</strong>
                </div>

                <div className="lab-detail-box">
                  <span>Created</span>
                  <strong>{formatDate(selectedTest.created_at)}</strong>
                </div>

                <div className="lab-detail-box">
                  <span>Collected By</span>
                  <strong>{selectedTest.collected_by || "Not recorded"}</strong>
                </div>
              </div>

              <div className="lab-result-box">
                <strong>Result / Notes</strong>
                <p>
                  {selectedTest.result ||
                    selectedTest.notes ||
                    "No laboratory result has been recorded yet."}
                </p>
              </div>

              <div className="lab-form-actions" style={{ marginTop: 14 }}>
                {selectedTest.status === "Pending" && (
                  <button
                    className="lab-button"
                    disabled={saving}
                    onClick={() => updateStatus(selectedTest, "Processing")}
                  >
                    <FlaskConical size={14} />
                    Start Processing
                  </button>
                )}

                {selectedTest.status === "Processing" && (
                  <button
                    className="lab-button primary"
                    disabled={saving}
                    onClick={() => updateStatus(selectedTest, "Completed")}
                  >
                    <FileCheck2 size={14} />
                    Mark Completed
                  </button>
                )}

                <button
                  className="lab-button"
                  onClick={() => setSelectedTest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Laboratory;
