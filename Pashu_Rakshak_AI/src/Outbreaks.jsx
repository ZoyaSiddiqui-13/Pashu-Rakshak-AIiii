import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";
import api from "./api";

const demoOutbreaks = [
  {
    id: "OB-1001",
    disease: "Respiratory Infection",
    area: "Satara",
    district: "Satara",
    related_cases: 4,
    risk: "Critical",
    response_status: "Active Response",
    status: "Open",
    created_at: new Date().toISOString(),
  },
  {
    id: "OB-1002",
    disease: "Fever Cluster",
    area: "Nashik",
    district: "Nashik",
    related_cases: 7,
    risk: "High",
    response_status: "Under Review",
    status: "Open",
    created_at: new Date().toISOString(),
  },
  {
    id: "OB-1003",
    disease: "Skin Infection",
    area: "Pune",
    district: "Pune",
    related_cases: 3,
    risk: "Medium",
    response_status: "Monitoring",
    status: "Monitoring",
    created_at: new Date().toISOString(),
  },
];

const RISK_OPTIONS = ["All", "Critical", "High", "Medium", "Low"];
const STATUS_OPTIONS = ["All", "Open", "Monitoring", "Closed"];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
}

function normalizeItems(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.outbreaks)) {
    return response.outbreaks;
  }

  return [];
}

function normalizeOutbreak(item, index) {
  return {
    id:
      item?.id ||
      item?.outbreak_id ||
      `OB-${1000 + index + 1}`,

    disease:
      item?.disease ||
      item?.disease_name ||
      "Unspecified Disease",

    area:
      item?.area ||
      item?.location ||
      item?.village ||
      item?.district ||
      "Unknown Area",

    district:
      item?.district ||
      item?.area ||
      item?.location ||
      "Unknown District",

    related_cases:
      Number(
        item?.related_cases ??
          item?.case_count ??
          item?.cases ??
          0
      ),

    risk:
      item?.risk ||
      item?.risk_level ||
      "Medium",

    response_status:
      item?.response_status ||
      item?.response ||
      "Monitoring",

    status:
      item?.status ||
      "Open",

    created_at:
      item?.created_at ||
      item?.createdAt ||
      null,
  };
}

export default function Outbreaks() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadOutbreaks() {
    setLoading(true);
    setError("");

    try {
      const response = await api.outbreaks.summary();

      const rawItems = normalizeItems(response);

      if (rawItems.length > 0) {
        const normalized = rawItems.map(
          normalizeOutbreak
        );

        setOutbreaks(normalized);
        setUsingDemo(false);
      } else {
        setOutbreaks(demoOutbreaks);
        setUsingDemo(true);
      }

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch (err) {
      setOutbreaks(demoOutbreaks);
      setUsingDemo(true);

      setError(
        err?.message ||
          "Outbreak API unavailable. Showing demo monitoring data."
      );

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOutbreaks();
  }, []);

  const filteredOutbreaks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return outbreaks.filter((item) => {
      const matchesRisk =
        riskFilter === "All" ||
        item.risk === riskFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const searchableText = [
        item.id,
        item.disease,
        item.area,
        item.district,
        item.risk,
        item.response_status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      return (
        matchesRisk &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    outbreaks,
    search,
    riskFilter,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    const total = outbreaks.length;

    const active = outbreaks.filter(
      (item) =>
        item.status !== "Closed"
    ).length;

    const critical = outbreaks.filter(
      (item) =>
        item.risk === "Critical"
    ).length;

    const high = outbreaks.filter(
      (item) =>
        item.risk === "High"
    ).length;

    const affectedCases = outbreaks.reduce(
      (sum, item) =>
        sum +
        Number(item.related_cases || 0),
      0
    );

    return {
      total,
      active,
      critical,
      high,
      affectedCases,
    };
  }, [outbreaks]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            DISEASE SURVEILLANCE
          </div>

          <h1 style={styles.title}>
            Outbreak Management
          </h1>

          <p style={styles.subtitle}>
            Monitor related disease cases, affected areas,
            risk levels and response status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOutbreaks}
          style={styles.refreshButton}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {usingDemo && (
        <div style={styles.demoBanner}>
          <CircleDot size={17} />

          <span>
            Showing sample outbreak data for the demo.
            Backend data will replace it when available.
          </span>
        </div>
      )}

      {error && (
        <div style={styles.warningBanner}>
          <AlertTriangle size={17} />

          <span style={{ flex: 1 }}>
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError("")}
            style={styles.closeButton}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div style={styles.kpiGrid}>
        <KpiCard
          icon={ShieldAlert}
          label="Total Outbreaks"
          value={stats.total}
        />

        <KpiCard
          icon={TrendingUp}
          label="Active"
          value={stats.active}
        />

        <KpiCard
          icon={AlertTriangle}
          label="Critical"
          value={stats.critical}
          danger
        />

        <KpiCard
          icon={ShieldAlert}
          label="High Risk"
          value={stats.high}
        />

        <KpiCard
          icon={CircleDot}
          label="Related Cases"
          value={stats.affectedCases}
        />
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search
            size={17}
            color="#94a3b8"
          />

          <input
            type="text"
            placeholder="Search outbreak, disease, district..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterGroup}>
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
            {RISK_OPTIONS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
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
            {STATUS_OPTIONS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section style={styles.card}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Outbreak Registry
            </h2>

            <p style={styles.sectionSubtitle}>
              {filteredOutbreaks.length} outbreak records
              shown
              {lastUpdated
                ? ` · Updated ${lastUpdated}`
                : ""}
            </p>
          </div>

          <div style={styles.registryBadge}>
            {stats.active} Active
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <RefreshCw
              size={22}
              style={styles.spin}
            />

            Loading outbreak intelligence...
          </div>
        ) : filteredOutbreaks.length === 0 ? (
          <div style={styles.empty}>
            <CircleDot
              size={42}
              color="#94a3b8"
            />

            <h3 style={styles.emptyTitle}>
              No outbreaks found
            </h3>

            <p style={styles.emptyText}>
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {filteredOutbreaks.map((item) => (
              <div
                key={item.id}
                style={styles.outbreakRow}
              >
                <div style={styles.outbreakMain}>
                  <div
                    style={{
                      ...styles.outbreakIcon,
                      ...(item.risk ===
                      "Critical"
                        ? styles.criticalIcon
                        : item.risk ===
                          "High"
                        ? styles.highIcon
                        : {}),
                    }}
                  >
                    <ShieldAlert size={19} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={
                        styles.outbreakTitle
                      }
                    >
                      {item.id}
                    </div>

                    <div
                      style={
                        styles.outbreakDisease
                      }
                    >
                      {item.disease}
                    </div>

                    <div
                      style={
                        styles.outbreakLocation
                      }
                    >
                      <MapPin size={12} />

                      {item.area},{" "}
                      {item.district}
                    </div>
                  </div>
                </div>

                <div style={styles.metric}>
                  <span style={styles.metricLabel}>
                    Related Cases
                  </span>

                  <strong style={styles.metricValue}>
                    {item.related_cases}
                  </strong>
                </div>

                <div style={styles.metric}>
                  <span style={styles.metricLabel}>
                    Risk
                  </span>

                  <RiskBadge
                    risk={item.risk}
                  />
                </div>

                <div style={styles.metric}>
                  <span style={styles.metricLabel}>
                    Response
                  </span>

                  <span
                    style={
                      styles.responseBadge
                    }
                  >
                    {item.response_status}
                  </span>
                </div>

                <div style={styles.metric}>
                  <span style={styles.metricLabel}>
                    Started
                  </span>

                  <strong
                    style={{
                      fontSize: 11,
                      color: "#334155",
                    }}
                  >
                    {formatDate(
                      item.created_at
                    )}
                  </strong>
                </div>

                <button
                  type="button"
                  style={styles.viewButton}
                  onClick={() =>
                    setSelected(item)
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div style={styles.bottomGrid}>
        <section style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <div>
              <h2 style={styles.infoTitle}>
                Risk Overview
              </h2>

              <p style={styles.infoSubtitle}>
                Current outbreak distribution
              </p>
            </div>

            <AlertTriangle
              size={18}
              color="#059669"
            />
          </div>

          <RiskProgress
            label="Critical"
            value={stats.critical}
            total={Math.max(stats.total, 1)}
            type="critical"
          />

          <RiskProgress
            label="High"
            value={stats.high}
            total={Math.max(stats.total, 1)}
            type="high"
          />

          <RiskProgress
            label="Medium"
            value={outbreaks.filter(
              (item) =>
                item.risk ===
                "Medium"
            ).length}
            total={Math.max(stats.total, 1)}
            type="medium"
          />

          <RiskProgress
            label="Low"
            value={outbreaks.filter(
              (item) =>
                item.risk ===
                "Low"
            ).length}
            total={Math.max(stats.total, 1)}
            type="low"
          />
        </section>

        <section style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <div>
              <h2 style={styles.infoTitle}>
                Response Monitoring
              </h2>

              <p style={styles.infoSubtitle}>
                Area-level response summary
              </p>
            </div>

            <TrendingUp
              size={18}
              color="#059669"
            />
          </div>

          <ResponseItem
            label="Active Response"
            count={
              outbreaks.filter(
                (item) =>
                  item.response_status ===
                  "Active Response"
              ).length
            }
          />

          <ResponseItem
            label="Under Review"
            count={
              outbreaks.filter(
                (item) =>
                  item.response_status ===
                  "Under Review"
              ).length
            }
          />

          <ResponseItem
            label="Monitoring"
            count={
              outbreaks.filter(
                (item) =>
                  item.response_status ===
                  "Monitoring"
              ).length
            }
          />

          <ResponseItem
            label="Closed"
            count={
              outbreaks.filter(
                (item) =>
                  item.status ===
                  "Closed"
              ).length
            }
          />
        </section>
      </div>

      {selected && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <div style={styles.eyebrow}>
                  OUTBREAK DETAILS
                </div>

                <h2 style={styles.modalTitle}>
                  {selected.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                style={styles.modalClose}
              >
                <X size={18} />
              </button>
            </div>

            <div style={styles.detailGrid}>
              <DetailItem
                label="Disease"
                value={
                  selected.disease
                }
              />

              <DetailItem
                label="Area"
                value={
                  selected.area
                }
              />

              <DetailItem
                label="District"
                value={
                  selected.district
                }
              />

              <DetailItem
                label="Related Cases"
                value={
                  selected.related_cases
                }
              />

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Risk Level
                </span>

                <RiskBadge
                  risk={
                    selected.risk
                  }
                />
              </div>

              <DetailItem
                label="Response"
                value={
                  selected.response_status
                }
              />

              <DetailItem
                label="Status"
                value={
                  selected.status
                }
              />

              <DetailItem
                label="Detected"
                value={formatDate(
                  selected.created_at
                )}
              />
            </div>

            <div style={styles.actionBox}>
              <ShieldAlert
                size={20}
                color="#059669"
              />

              <div>
                <strong
                  style={{
                    color: "#0f172a",
                  }}
                >
                  Surveillance action
                </strong>

                <p
                  style={{
                    margin:
                      "4px 0 0",
                    color:
                      "#64748b",
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  Review associated cases,
                  coordinate veterinary and
                  field response, and continue
                  monitoring the affected area.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes outbreakSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1100px) {
            .outbreak-row {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 760px) {
            .outbreak-row {
              grid-template-columns: 1fr !important;
            }

            .outbreak-bottom {
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
    <div style={styles.kpi}>
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
  const map = {
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

  const style =
    map[risk] || map.Medium;

  return (
    <span
      style={{
        ...styles.riskBadge,
        background:
          style.background,
        color: style.color,
        border:
          `1px solid ${style.border}`,
      }}
    >
      {risk || "Medium"}
    </span>
  );
}

function RiskProgress({
  label,
  value,
  total,
  type,
}) {
  const percentage = Math.min(
    100,
    Math.round(
      (value / total) * 100
    )
  );

  const colors = {
    critical: "#dc2626",
    high: "#ea580c",
    medium: "#d97706",
    low: "#059669",
  };

  return (
    <div style={styles.progressRow}>
      <div style={styles.progressTop}>
        <span>{label}</span>

        <strong>
          {value}
        </strong>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percentage}%`,
            background:
              colors[type] ||
              colors.medium,
          }}
        />
      </div>
    </div>
  );
}

function ResponseItem({
  label,
  count,
}) {
  return (
    <div style={styles.responseItem}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={
            styles.responseDot
          }
        />

        <span
          style={{
            fontSize: 11,
            color: "#475569",
            fontWeight: 700,
          }}
        >
          {label}
        </span>
      </div>

      <strong
        style={{
          fontSize: 14,
          color: "#0f172a",
        }}
      >
        {count}
      </strong>
    </div>
  );
}

function DetailItem({
  label,
  value,
}) {
  return (
    <div style={styles.detailItem}>
      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong
        style={{
          marginTop: 5,
          display: "block",
          color: "#0f172a",
          fontSize: 12,
        }}
      >
        {value || "—"}
      </strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding:
      "28px 30px 50px",
    background: "#f5f8f6",
    color: "#0f172a",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  header: {
    maxWidth: 1220,
    margin:
      "0 auto 20px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-end",
    gap: 18,
    flexWrap: "wrap",
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "1px",
    color: "#059669",
  },

  title: {
    margin: "5px 0 0",
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 900,
  },

  subtitle: {
    margin:
      "7px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  refreshButton: {
    border:
      "1px solid #dbe5df",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 11,
    padding: "10px 13px",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },

  demoBanner: {
    maxWidth: 1220,
    margin:
      "0 auto 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding:
      "10px 12px",
    borderRadius: 13,
    background: "#eff6ff",
    border:
      "1px solid #bfdbfe",
    color: "#1d4ed8",
    fontSize: 10,
    fontWeight: 700,
  },

  warningBanner: {
    maxWidth: 1220,
    margin:
      "0 auto 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding:
      "10px 12px",
    borderRadius: 13,
    background: "#fffbeb",
    border:
      "1px solid #fde68a",
    color: "#92400e",
    fontSize: 10,
    fontWeight: 700,
  },

  closeButton: {
    border: 0,
    background: "transparent",
    color: "currentColor",
    cursor: "pointer",
    padding: 2,
  },

  kpiGrid: {
    maxWidth: 1220,
    margin:
      "0 auto 16px",
    display: "grid",
    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",
    gap: 12,
  },

  kpi: {
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
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
    display: "grid",
    placeItems: "center",
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
    fontSize: 9,
    fontWeight: 800,
  },

  toolbar: {
    maxWidth: 1220,
    margin:
      "0 auto 15px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 11,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  searchBox: {
    flex: 1,
    minWidth: 250,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border:
      "1px solid #e2e8f0",
    borderRadius: 11,
    padding:
      "0 11px",
    background: "#f8fafc",
  },

  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    background:
      "transparent",
    padding:
      "10px 0",
    fontSize: 11,
  },

  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border:
      "1px solid #e2e8f0",
    borderRadius: 11,
    padding:
      "0 8px",
    background: "#f8fafc",
  },

  filterLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: 900,
  },

  select: {
    border: 0,
    outline: 0,
    background:
      "transparent",
    padding:
      "10px 3px",
    fontSize: 10,
    fontWeight: 800,
    color: "#334155",
  },

  card: {
    maxWidth: 1220,
    margin:
      "0 auto 16px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 17,
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.04)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: 12,
    marginBottom: 12,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 900,
  },

  sectionSubtitle: {
    margin:
      "3px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  registryBadge: {
    border:
      "1px solid #bbf7d0",
    background: "#ecfdf5",
    color: "#047857",
    padding:
      "6px 9px",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
  },

  loading: {
    minHeight: 280,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },

  spin: {
    animation:
      "outbreakSpin 1s linear infinite",
  },

  empty: {
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    justifyContent:
      "center",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
  },

  emptyText: {
    margin: 0,
    color: "#64748b",
    fontSize: 10,
  },

  list: {
    display: "grid",
    gap: 8,
  },

  outbreakRow: {
    display: "grid",
    gridTemplateColumns:
      "1.7fr 0.8fr 0.8fr 1fr 0.8fr auto",
    alignItems: "center",
    gap: 12,
    padding: 12,
    border:
      "1px solid #edf2ef",
    borderRadius: 14,
    background: "#ffffff",
  },

  outbreakMain: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },

  outbreakIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    background: "#ecfdf5",
    color: "#047857",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },

  criticalIcon: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  highIcon: {
    background: "#fff7ed",
    color: "#ea580c",
  },

  outbreakTitle: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: 900,
  },

  outbreakDisease: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: 850,
    color: "#0f172a",
  },

  outbreakLocation: {
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: "#64748b",
    fontSize: 9,
  },

  metric: {
    minWidth: 0,
  },

  metricLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 8,
    fontWeight: 800,
    marginBottom: 5,
    textTransform: "uppercase",
  },

  metricValue: {
    fontSize: 15,
    color: "#0f172a",
  },

  riskBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding:
      "5px 8px",
    fontSize: 9,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  responseBadge: {
    display: "inline-flex",
    width: "fit-content",
    borderRadius: 999,
    padding:
      "5px 8px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 8,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  viewButton: {
    border:
      "1px solid #dbe5df",
    background: "#ffffff",
    color: "#047857",
    borderRadius: 9,
    padding:
      "7px 10px",
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  bottomGrid: {
    maxWidth: 1220,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: 15,
  },

  infoCard: {
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    borderRadius: 19,
    padding: 16,
  },

  infoHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },

  infoTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
  },

  infoSubtitle: {
    margin:
      "4px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  progressRow: {
    marginBottom: 13,
  },

  progressTop: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 5,
    color: "#475569",
    fontSize: 10,
    fontWeight: 700,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    background: "#f1f5f9",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  responseItem: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding:
      "11px 0",
    borderBottom:
      "1px solid #f1f5f9",
  },

  responseDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#059669",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    padding: 15,
    background:
      "rgba(15,23,42,0.5)",
    backdropFilter:
      "blur(4px)",
  },

  modal: {
    width: "100%",
    maxWidth: 680,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 21,
    boxShadow:
      "0 30px 80px rgba(15,23,42,0.22)",
  },

  modalHeader: {
    padding:
      "18px 19px",
    borderBottom:
      "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: 10,
  },

  modalTitle: {
    margin:
      "4px 0 0",
    fontSize: 20,
    fontWeight: 900,
  },

  modalClose: {
    width: 34,
    height: 34,
    border:
      "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 10,
    color: "#64748b",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },

  detailGrid: {
    padding: 19,
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },

  detailItem: {
    padding: 11,
    border:
      "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: 12,
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 8,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  actionBox: {
    margin:
      "0 19px 19px",
    padding: 13,
    border:
      "1px solid #bbf7d0",
    background: "#ecfdf5",
    borderRadius: 14,
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
  },
};