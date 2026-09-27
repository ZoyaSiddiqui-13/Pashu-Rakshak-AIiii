import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Stethoscope,
  User,
  X,
} from "lucide-react";

const EMPTY_FORM = {
  animal_name: "",
  owner_name: "",
  village: "",
  condition: "",
  risk: "Medium",
  symptoms: "",
  observations: "",
};

const RISK_OPTIONS = ["Low", "Medium", "High", "Critical"];

const STATUS_OPTIONS = [
  "Open",
  "Vet Review",
  "Field Investigation",
  "Lab Processing",
  "Treatment",
  "Follow-up",
  "Resolved",
  "Escalated",
];

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showCreate, setShowCreate] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  async function loadCases() {
    try {
      setLoading(true);
      setError("");

      const response = await api.cases.list({ limit: 200 });

      setCases(
        Array.isArray(response?.items) ? response.items : []
      );
    } catch (err) {
      setError(err?.message || "Unable to load cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesRisk =
        riskFilter === "All" || item?.risk === riskFilter;

      const matchesStatus =
        statusFilter === "All" || item?.status === statusFilter;

      const searchableText = [
        item?.id,
        item?.animal_name,
        item?.owner_name,
        item?.village,
        item?.condition,
        item?.status,
        item?.stage,
        item?.assigned_to,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesRisk && matchesStatus && matchesSearch;
    });
  }, [cases, search, riskFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = cases.length;

    const active = cases.filter(
      (item) =>
        item?.stage !== "resolved" &&
        item?.status !== "Resolved"
    ).length;

    const critical = cases.filter(
      (item) => item?.risk === "Critical"
    ).length;

    const high = cases.filter(
      (item) => item?.risk === "High"
    ).length;

    const resolved = cases.filter(
      (item) =>
        item?.stage === "resolved" ||
        item?.status === "Resolved"
    ).length;

    return {
      total,
      active,
      critical,
      high,
      resolved,
    };
  }, [cases]);

  async function handleCreateCase(event) {
    event.preventDefault();

    if (!form.animal_name.trim()) {
      setError("Animal name is required.");
      return;
    }

    if (!form.condition.trim()) {
      setError("Condition is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const symptoms = form.symptoms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        animal_name: form.animal_name.trim(),
        owner_name: form.owner_name.trim() || null,
        village: form.village.trim() || null,
        condition: form.condition.trim(),
        risk: form.risk,
        symptoms,
        observations:
          form.observations.trim() || null,
        stage: "reported",
        status: "Open",
      };

      const created = await api.cases.create(payload);

      setCases((previous) => [
        created,
        ...previous,
      ]);

      setForm(EMPTY_FORM);
      setShowCreate(false);

      setNotice(
        "New case created successfully and saved to MongoDB."
      );
    } catch (err) {
      setError(
        err?.message || "Unable to create the case."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCase(id, payload) {
    try {
      setUpdating(true);
      setError("");
      setNotice("");

      const updated = await api.cases.update(id, payload);

      setCases((previous) =>
        previous.map((item) =>
          item.id === id ? updated : item
        )
      );

      setSelectedCase((previous) =>
        previous?.id === id ? updated : previous
      );

      setNotice(
        `Case ${formatCaseId(id)} updated successfully.`
      );
    } catch (err) {
      setError(
        err?.message || "Unable to update the case."
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleNextStage(item) {
    const flow = {
      reported: {
        stage: "ai-screening",
        status: "Vet Review",
        notes: "AI screening completed. Case sent for veterinarian review.",
      },

      "ai-screening": {
        stage: "vet-review",
        status: "Vet Review",
        notes: "Case moved to veterinarian review.",
      },

      "vet-review": {
        stage: "field",
        status: "Field Investigation",
        notes: "Field investigation requested.",
      },

      field: {
        stage: "lab",
        status: "Lab Processing",
        notes: "Case moved to laboratory processing.",
      },

      lab: {
        stage: "treatment",
        status: "Treatment",
        notes: "Laboratory stage completed. Treatment workflow started.",
      },

      treatment: {
        stage: "follow-up",
        status: "Follow-up",
        notes: "Treatment recorded. Case moved to follow-up.",
      },

      "follow-up": {
        stage: "resolved",
        status: "Resolved",
        notes: "Follow-up completed. Case resolved.",
      },
    };

    const next = flow[item?.stage];

    if (!next) {
      setNotice(
        `${formatCaseId(item?.id)} has no automatic next stage.`
      );
      return;
    }

    await handleUpdateCase(item.id, next);
  }

  async function handleEscalate(item) {
    await handleUpdateCase(item.id, {
      stage: "escalated",
      status: "Escalated",
      escalated: true,
      notes:
        "Case escalated for district/state response review.",
    });
  }

  function formatCaseId(id) {
    if (!id) return "CASE";

    return String(id)
      .slice(-8)
      .toUpperCase();
  }

  function getDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString();
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            CASE MANAGEMENT
          </div>

          <h1 style={styles.title}>
            Cases
          </h1>

          <p style={styles.subtitle}>
            Manage disease cases, risk levels and workflow stages.
          </p>
        </div>

        <button
          type="button"
          style={styles.primary}
          onClick={() => {
            setError("");
            setNotice("");
            setShowCreate(true);
          }}
        >
          <Plus size={17} />
          New Case
        </button>
      </div>

      {notice && (
        <div style={styles.successBanner}>
          <CheckCircle2 size={18} />

          <span style={{ flex: 1 }}>
            {notice}
          </span>

          <button
            type="button"
            style={styles.bannerClose}
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {error && (
        <div style={styles.errorBanner}>
          <AlertTriangle size={18} />

          <span style={{ flex: 1 }}>
            {error}
          </span>

          <button
            type="button"
            style={styles.bannerClose}
            onClick={() => setError("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div style={styles.kpiGrid}>
        <KpiCard
          icon={ClipboardList}
          label="Total Cases"
          value={stats.total}
        />

        <KpiCard
          icon={ArrowRight}
          label="Active Cases"
          value={stats.active}
        />

        <KpiCard
          icon={ShieldAlert}
          label="Critical"
          value={stats.critical}
          danger
        />

        <KpiCard
          icon={AlertTriangle}
          label="High Risk"
          value={stats.high}
        />

        <KpiCard
          icon={CheckCircle2}
          label="Resolved"
          value={stats.resolved}
        />
      </div>

      <section style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search
            size={17}
            color="#94a3b8"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search case, animal, village..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filter}>
          <span style={styles.filterLabel}>
            Risk
          </span>

          <select
            value={riskFilter}
            onChange={(event) =>
              setRiskFilter(event.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All
            </option>

            {RISK_OPTIONS.map((risk) => (
              <option
                key={risk}
                value={risk}
              >
                {risk}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filter}>
          <span style={styles.filterLabel}>
            Status
          </span>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={styles.select}
          >
            <option value="All">
              All
            </option>

            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          style={styles.refreshButton}
          onClick={loadCases}
        >
          Refresh
        </button>
      </section>

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Case Registry
            </h2>

            <p style={styles.sectionSubtitle}>
              {filteredCases.length} cases shown
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <Loader2
              size={24}
              style={styles.spinner}
            />

            Loading cases...
          </div>
        ) : filteredCases.length === 0 ? (
          <div style={styles.empty}>
            <ClipboardList
              size={40}
              color="#94a3b8"
            />

            <h3 style={styles.emptyTitle}>
              No cases found
            </h3>

            <p style={styles.emptyText}>
              Create a health case to start tracking the livestock
              health workflow.
            </p>

            <button
              type="button"
              style={styles.primary}
              onClick={() => setShowCreate(true)}
            >
              <Plus size={17} />
              New Case
            </button>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    Case
                  </th>

                  <th style={styles.th}>
                    Animal
                  </th>

                  <th style={styles.th}>
                    Condition
                  </th>

                  <th style={styles.th}>
                    Risk
                  </th>

                  <th style={styles.th}>
                    Stage
                  </th>

                  <th style={styles.th}>
                    Status
                  </th>

                  <th
                    style={{
                      ...styles.th,
                      textAlign: "right",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <strong>
                        {formatCaseId(item.id)}
                      </strong>

                      <div style={styles.muted}>
                        {getDate(item.created_at)}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {item.animal_name || "Unknown Animal"}
                      </strong>

                      <div style={styles.muted}>
                        {item.owner_name ||
                          "Owner not supplied"}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {item.condition || "—"}
                      </strong>

                      <div style={styles.muted}>
                        {item.village ||
                          "Location not supplied"}
                      </div>
                    </td>

                    <td style={styles.td}>
                      <RiskBadge
                        risk={item.risk}
                      />
                    </td>

                    <td style={styles.td}>
                      <span style={styles.stageBadge}>
                        {item.stage ||
                          "reported"}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <StatusBadge
                        status={item.status}
                      />
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          type="button"
                          style={styles.secondarySmall}
                          onClick={() =>
                            setSelectedCase(item)
                          }
                        >
                          View
                        </button>

                        {item.stage !== "resolved" &&
                          item.stage !== "escalated" && (
                            <button
                              type="button"
                              style={styles.primarySmall}
                              disabled={updating}
                              onClick={() =>
                                handleNextStage(item)
                              }
                            >
                              Next
                              <ArrowRight size={14} />
                            </button>
                          )}

                        {item.stage !== "resolved" &&
                          item.stage !== "escalated" &&
                          item.risk !== "Low" && (
                            <button
                              type="button"
                              style={styles.dangerSmall}
                              disabled={updating}
                              onClick={() =>
                                handleEscalate(item)
                              }
                            >
                              Escalate
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showCreate && (
        <Modal
          title="Create Health Case"
          onClose={() => setShowCreate(false)}
        >
          <form onSubmit={handleCreateCase}>
            <div style={styles.formGrid}>
              <FormField
                label="Animal Name"
                required
              >
                <input
                  value={form.animal_name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      animal_name:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Gauri"
                  style={styles.formInput}
                />
              </FormField>

              <FormField label="Owner Name">
                <input
                  value={form.owner_name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      owner_name:
                        event.target.value,
                    })
                  }
                  placeholder="Farmer name"
                  style={styles.formInput}
                />
              </FormField>

              <FormField label="Village / Location">
                <input
                  value={form.village}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      village:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Satara"
                  style={styles.formInput}
                />
              </FormField>

              <FormField
                label="Condition"
                required
              >
                <input
                  value={form.condition}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      condition:
                        event.target.value,
                    })
                  }
                  placeholder="e.g. Suspected fever"
                  style={styles.formInput}
                />
              </FormField>

              <FormField label="Risk">
                <select
                  value={form.risk}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      risk: event.target.value,
                    })
                  }
                  style={styles.formInput}
                >
                  {RISK_OPTIONS.map((risk) => (
                    <option
                      key={risk}
                      value={risk}
                    >
                      {risk}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Symptoms">
                <input
                  value={form.symptoms}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      symptoms:
                        event.target.value,
                    })
                  }
                  placeholder="Fever, weakness, cough"
                  style={styles.formInput}
                />
              </FormField>

              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <FormField label="Observations">
                  <textarea
                    rows={4}
                    value={form.observations}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        observations:
                          event.target.value,
                      })
                    }
                    placeholder="Add field observations..."
                    style={styles.textarea}
                  />
                </FormField>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondary}
                onClick={() =>
                  setShowCreate(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.primary,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      style={styles.spinner}
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Create Case
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selectedCase && (
        <Modal
          title={`Case ${formatCaseId(
            selectedCase.id
          )}`}
          onClose={() =>
            setSelectedCase(null)
          }
        >
          <div style={styles.detailGrid}>
            <Detail
              icon={User}
              label="Animal"
              value={
                selectedCase.animal_name
              }
            />

            <Detail
              icon={User}
              label="Owner"
              value={
                selectedCase.owner_name
              }
            />

            <Detail
              icon={MapPin}
              label="Location"
              value={
                selectedCase.village
              }
            />

            <Detail
              icon={AlertTriangle}
              label="Condition"
              value={
                selectedCase.condition
              }
            />

            <Detail
              icon={ShieldAlert}
              label="Risk"
              value={
                selectedCase.risk
              }
            />

            <Detail
              icon={Stethoscope}
              label="Status"
              value={
                selectedCase.status
              }
            />
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailLabel}>
              Symptoms
            </div>

            <div style={styles.detailText}>
              {Array.isArray(
                selectedCase.symptoms
              ) &&
              selectedCase.symptoms.length > 0
                ? selectedCase.symptoms.join(", ")
                : "No symptoms recorded."}
            </div>
          </div>

          <div style={styles.detailBlock}>
            <div style={styles.detailLabel}>
              Observations / Notes
            </div>

            <div style={styles.detailText}>
              {selectedCase.observations ||
                selectedCase.notes ||
                "No observations recorded."}
            </div>
          </div>

          <div style={styles.workflowBox}>
            <div>
              <div style={styles.detailLabel}>
                Current Stage
              </div>

              <strong
                style={{
                  display: "block",
                  marginTop: 5,
                }}
              >
                {selectedCase.stage ||
                  "reported"}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {selectedCase.stage !==
                "resolved" &&
                selectedCase.stage !==
                  "escalated" && (
                  <button
                    type="button"
                    style={styles.primary}
                    disabled={updating}
                    onClick={() =>
                      handleNextStage(
                        selectedCase
                      )
                    }
                  >
                    <ArrowRight size={16} />
                    Next Stage
                  </button>
                )}

              {selectedCase.stage !==
                "resolved" &&
                selectedCase.stage !==
                  "escalated" &&
                selectedCase.risk !==
                  "Low" && (
                  <button
                    type="button"
                    style={styles.dangerButton}
                    disabled={updating}
                    onClick={() =>
                      handleEscalate(
                        selectedCase
                      )
                    }
                  >
                    Escalate
                  </button>
                )}
            </div>
          </div>
        </Modal>
      )}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1000px) {
            .case-kpi-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 760px) {
            .case-kpi-grid {
              grid-template-columns: 1fr !important;
            }

            .case-toolbar {
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .case-form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  danger = false,
}) {
  return (
    <div
      style={styles.kpi}
      className="case-kpi-grid"
    >
      <div
        style={{
          ...styles.kpiIcon,
          ...(danger
            ? styles.kpiDanger
            : {}),
        }}
      >
        <Icon size={20} />
      </div>

      <div>
        <div style={styles.kpiValue}>
          {value}
        </div>

        <div style={styles.kpiLabel}>
          {label}
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ risk }) {
  const value = risk || "Medium";

  const colorMap = {
    Critical: {
      background: "#fef2f2",
      color: "#b91c1c",
      border: "#fecaca",
    },
    High: {
      background: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
    },
    Medium: {
      background: "#fffbeb",
      color: "#a16207",
      border: "#fde68a",
    },
    Low: {
      background: "#ecfdf5",
      color: "#047857",
      border: "#bbf7d0",
    },
  };

  const palette =
    colorMap[value] || colorMap.Medium;

  return (
    <span
      style={{
        ...styles.badge,
        background: palette.background,
        color: palette.color,
        border: `1px solid ${palette.border}`,
      }}
    >
      {value}
    </span>
  );
}

function StatusBadge({ status }) {
  const value = status || "Open";

  const map = {
    Open: {
      background: "#f1f5f9",
      color: "#475569",
    },
    "Vet Review": {
      background: "#eff6ff",
      color: "#1d4ed8",
    },
    "Field Investigation": {
      background: "#fffbeb",
      color: "#a16207",
    },
    "Lab Processing": {
      background: "#f5f3ff",
      color: "#6d28d9",
    },
    Treatment: {
      background: "#ecfdf5",
      color: "#047857",
    },
    "Follow-up": {
      background: "#f0fdfa",
      color: "#0f766e",
    },
    Resolved: {
      background: "#ecfdf5",
      color: "#15803d",
    },
    Escalated: {
      background: "#fef2f2",
      color: "#b91c1c",
    },
  };

  return (
    <span
      style={{
        ...styles.badge,
        ...(map[value] || map.Open),
      }}
    >
      {value}
    </span>
  );
}

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>
        {label}
        {required ? " *" : ""}
      </span>

      {children}
    </label>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div style={styles.detailCard}>
      <div style={styles.detailIcon}>
        <Icon size={16} />
      </div>

      <div>
        <div style={styles.detailLabel}>
          {label}
        </div>

        <strong style={styles.detailValue}>
          {value || "—"}
        </strong>
      </div>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {title}
          </h2>

          <button
            type="button"
            style={styles.iconButton}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f8f6",
    padding: "28px 30px 50px",
    color: "#0f172a",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  header: {
    maxWidth: 1220,
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 18,
    flexWrap: "wrap",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "1px",
    color: "#059669",
    marginBottom: 6,
  },

  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 900,
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: 13,
    color: "#64748b",
  },

  primary: {
    border: 0,
    background: "#059669",
    color: "#ffffff",
    borderRadius: 11,
    padding: "11px 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontSize: 11,
    fontWeight: 850,
    cursor: "pointer",
  },

  secondary: {
    border: "1px solid #dbe5df",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 11,
    padding: "11px 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  },

  dangerButton: {
    border: 0,
    background: "#dc2626",
    color: "#ffffff",
    borderRadius: 11,
    padding: "11px 14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  },

  successBanner: {
    maxWidth: 1220,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: 14,
    padding: "11px 13px",
    fontSize: 12,
    fontWeight: 700,
  },

  errorBanner: {
    maxWidth: 1220,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 14,
    padding: "11px 13px",
    fontSize: 12,
    fontWeight: 700,
  },

  bannerClose: {
    border: 0,
    background: "transparent",
    color: "currentColor",
    cursor: "pointer",
    display: "inline-flex",
    padding: 2,
  },

  kpiGrid: {
    maxWidth: 1220,
    margin: "0 auto 17px",
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: 12,
  },

  kpi: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 11,
    boxShadow:
      "0 8px 22px rgba(15,23,42,0.04)",
  },

  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "#ecfdf5",
    color: "#047857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  kpiDanger: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  kpiValue: {
    fontSize: 24,
    fontWeight: 900,
  },

  kpiLabel: {
    marginTop: 2,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
  },

  toolbar: {
    maxWidth: 1220,
    margin: "0 auto 15px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 11,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  searchBox: {
    flex: 1,
    minWidth: 240,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 11px",
    border: "1px solid #e2e8f0",
    borderRadius: 11,
    background: "#f8fafc",
  },

  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    padding: "10px 0",
    fontSize: 11,
  },

  filter: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #e2e8f0",
    borderRadius: 11,
    padding: "0 9px",
    background: "#f8fafc",
  },

  filterLabel: {
    fontSize: 9,
    fontWeight: 900,
    color: "#94a3b8",
  },

  select: {
    border: 0,
    outline: 0,
    background: "transparent",
    padding: "10px 4px",
    fontSize: 10,
    fontWeight: 800,
    color: "#334155",
  },

  refreshButton: {
    border: "1px solid #dbe5df",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 11,
    padding: "10px 12px",
    fontSize: 10,
    fontWeight: 800,
    cursor: "pointer",
  },

  card: {
    maxWidth: 1220,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 17,
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 900,
  },

  sectionSubtitle: {
    margin: "3px 0 0",
    fontSize: 10,
    color: "#94a3b8",
  },

  loading: {
    minHeight: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
  },

  spinner: {
    animation:
      "spin 1s linear infinite",
  },

  empty: {
    minHeight: 280,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    textAlign: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
  },

  emptyText: {
    margin: 0,
    maxWidth: 430,
    color: "#64748b",
    fontSize: 11,
    lineHeight: 1.6,
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: 1040,
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "11px 9px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: 9,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  td: {
    padding: "14px 9px",
    fontSize: 11,
    borderBottom:
      "1px solid #edf2ef",
    verticalAlign: "middle",
  },

  muted: {
    marginTop: 4,
    color: "#94a3b8",
    fontSize: 9,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 9,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  stageBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "5px 8px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 9,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 6,
  },

  secondarySmall: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 9,
    padding: "7px 9px",
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  primarySmall: {
    border: 0,
    background: "#059669",
    color: "#ffffff",
    borderRadius: 9,
    padding: "7px 9px",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  dangerSmall: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: 9,
    padding: "7px 9px",
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background:
      "rgba(15,23,42,0.48)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },

  modal: {
    width: "100%",
    maxWidth: 720,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 22,
    boxShadow:
      "0 30px 80px rgba(15,23,42,0.22)",
    paddingBottom: 2,
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 19px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  modalTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
  },

  iconButton: {
    width: 34,
    height: 34,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#ffffff",
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 13,
    padding: 19,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  fieldLabel: {
    fontSize: 10,
    color: "#475569",
    fontWeight: 800,
  },

  formInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe5df",
    borderRadius: 10,
    padding: "10px 11px",
    outline: 0,
    fontSize: 11,
    background: "#fbfdfc",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dbe5df",
    borderRadius: 10,
    padding: "10px 11px",
    outline: 0,
    fontSize: 11,
    resize: "vertical",
    background: "#fbfdfc",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "0 19px 19px",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 10,
    padding: 19,
  },

  detailCard: {
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: 13,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  detailIcon: {
    width: 31,
    height: 31,
    borderRadius: 9,
    background: "#ecfdf5",
    color: "#047857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  detailLabel: {
    display: "block",
    fontSize: 8,
    color: "#94a3b8",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  detailValue: {
    display: "block",
    marginTop: 3,
    fontSize: 11,
    color: "#0f172a",
  },

  detailBlock: {
    margin: "0 19px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 12,
  },

  detailText: {
    marginTop: 6,
    color: "#475569",
    fontSize: 11,
    lineHeight: 1.6,
  },

  workflowBox: {
    margin: "16px 19px 19px",
    padding: 12,
    borderRadius: 14,
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
};