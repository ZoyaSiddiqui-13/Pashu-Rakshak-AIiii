import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Download,
  RefreshCw,
  ShieldAlert,
  Syringe,
  TrendingUp,
} from "lucide-react";
import api from "./api";

const demoData = {
  average_health_score: 86,
  critical_cases: 12,
  ai_screening_coverage: 94,
  vaccination_coverage: 91,
  total_animals: 300,
  recovered_cases: 128,
  active_cases: 42,
  monthly_cases: [
    { month: "Jan", value: 12 },
    { month: "Feb", value: 18 },
    { month: "Mar", value: 16 },
    { month: "Apr", value: 24 },
    { month: "May", value: 21 },
    { month: "Jun", value: 29 },
    { month: "Jul", value: 26 },
    { month: "Aug", value: 31 },
    { month: "Sep", value: 27 },
    { month: "Oct", value: 34 },
    { month: "Nov", value: 30 },
    { month: "Dec", value: 36 },
  ],
  risk_distribution: [
    { label: "Low", value: 178 },
    { label: "Medium", value: 72 },
    { label: "High", value: 34 },
    { label: "Critical", value: 16 },
  ],
};

const periods = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "This Year",
];

export default function Analytics() {
  const [data, setData] = useState(demoData);
  const [period, setPeriod] = useState("Last 30 Days");
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadAnalytics() {
    setLoading(true);
    setError("");

    try {
      const response = await api.analytics.summary();

      if (response && typeof response === "object") {
        const merged = {
          ...demoData,
          ...response,
          monthly_cases:
            Array.isArray(response.monthly_cases)
              ? response.monthly_cases
              : demoData.monthly_cases,
          risk_distribution:
            Array.isArray(response.risk_distribution)
              ? response.risk_distribution
              : demoData.risk_distribution,
        };

        setData(merged);
        setUsingDemo(false);
      } else {
        setData(demoData);
        setUsingDemo(true);
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setData(demoData);
      setUsingDemo(true);
      setError(
        err?.message ||
          "Analytics API unavailable. Showing demo analytics."
      );
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const maxCases = useMemo(() => {
    const values = data.monthly_cases.map((item) =>
      Number(item?.value || 0)
    );

    return Math.max(...values, 1);
  }, [data.monthly_cases]);

  const totalRiskAnimals = useMemo(() => {
    return data.risk_distribution.reduce(
      (sum, item) => sum + Number(item?.value || 0),
      0
    );
  }, [data.risk_distribution]);

  function exportReport() {
    const report = [
      "PASHU-RAKSHAK AI ANALYTICS REPORT",
      `Period: ${period}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Average Health Score: ${data.average_health_score}%`,
      `Critical Cases: ${data.critical_cases}`,
      `AI Screening Coverage: ${data.ai_screening_coverage}%`,
      `Vaccination Coverage: ${data.vaccination_coverage}%`,
      `Total Animals: ${data.total_animals}`,
      `Recovered Cases: ${data.recovered_cases}`,
      `Active Cases: ${data.active_cases}`,
      "",
      "Risk Distribution:",
      ...data.risk_distribution.map(
        (item) =>
          `${item.label}: ${item.value}`
      ),
    ].join("\n");

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "pashu-rakshak-analytics-report.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            INSIGHTS & REPORTS
          </div>

          <h1 style={styles.title}>
            Analytics
          </h1>

          <p style={styles.subtitle}>
            Track livestock health, disease trends, AI screening,
            vaccination coverage and regional indicators.
          </p>
        </div>

        <div style={styles.headerActions}>
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
            style={styles.periodSelect}
          >
            {periods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={exportReport}
            style={styles.exportButton}
          >
            <Download size={15} />
            Export Report
          </button>

          <button
            type="button"
            onClick={loadAnalytics}
            style={styles.refreshButton}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {usingDemo && (
        <div style={styles.demoBanner}>
          <BarChart3 size={17} />

          <span>
            Showing demo analytics data. Connected backend data
            will replace it when available.
          </span>
        </div>
      )}

      {error && (
        <div style={styles.errorBanner}>
          <AlertTriangle size={17} />

          <span>{error}</span>
        </div>
      )}

      <div style={styles.statsGrid}>
        <StatCard
          icon={Activity}
          value={`${data.average_health_score}%`}
          label="Average Health Score"
          change="+12.4%"
        />

        <StatCard
          icon={ShieldAlert}
          value={data.critical_cases}
          label="Critical Cases"
          change="-8.2%"
          danger
        />

        <StatCard
          icon={Brain}
          value={`${data.ai_screening_coverage}%`}
          label="AI Screening Coverage"
          change="+15.7%"
        />

        <StatCard
          icon={Syringe}
          value={`${data.vaccination_coverage}%`}
          label="Vaccination Coverage"
          change="+6.1%"
        />
      </div>

      <div style={styles.overviewGrid}>
        <OverviewCard
          icon={Activity}
          label="Total Animals"
          value={data.total_animals}
        />

        <OverviewCard
          icon={CheckCircle2}
          label="Recovered Cases"
          value={data.recovered_cases}
        />

        <OverviewCard
          icon={TrendingUp}
          label="Active Cases"
          value={data.active_cases}
        />

        <OverviewCard
          icon={BarChart3}
          label="Tracked Risk Records"
          value={totalRiskAnimals}
        />
      </div>

      {loading ? (
        <div style={styles.loading}>
          <RefreshCw
            size={24}
            style={styles.spinner}
          />

          Loading analytics...
        </div>
      ) : (
        <>
          <div style={styles.chartGrid}>
            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Disease Cases Trend
                  </h2>

                  <p style={styles.cardSubtitle}>
                    {period}
                  </p>
                </div>

                <TrendingUp
                  size={18}
                  color="#059669"
                />
              </div>

              <div style={styles.barChart}>
                <div style={styles.chartGridLine} />
                <div style={styles.chartGridLineTwo} />
                <div style={styles.chartGridLineThree} />

                {data.monthly_cases.map((item) => {
                  const value = Number(item?.value || 0);

                  const height =
                    (value / maxCases) * 100;

                  return (
                    <div
                      key={item.month}
                      style={styles.barColumn}
                    >
                      <div style={styles.barValue}>
                        {value}
                      </div>

                      <div style={styles.barArea}>
                        <div
                          style={{
                            ...styles.bar,
                            height: `${Math.max(
                              height,
                              4
                            )}%`,
                          }}
                        />
                      </div>

                      <div style={styles.barMonth}>
                        {item.month}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.chartNote}>
                Case reporting trends can be reviewed alongside
                surveillance, treatment and outbreak workflows.
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Risk Distribution
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Current animal population
                  </p>
                </div>

                <ShieldAlert
                  size={18}
                  color="#059669"
                />
              </div>

              <div style={styles.riskLayout}>
                <div style={styles.donutWrap}>
                  <div
                    style={{
                      ...styles.donut,
                      background: getDonutGradient(
                        data.risk_distribution,
                        totalRiskAnimals
                      ),
                    }}
                  >
                    <div style={styles.donutInner}>
                      <strong>
                        {totalRiskAnimals}
                      </strong>

                      <span>
                        Animals
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.legend}>
                  {data.risk_distribution.map(
                    (item) => (
                      <RiskLegend
                        key={item.label}
                        label={item.label}
                        value={Number(
                          item.value || 0
                        )}
                        total={totalRiskAnimals}
                      />
                    )
                  )}
                </div>
              </div>
            </section>
          </div>

          <div style={styles.bottomGrid}>
            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    System Performance
                  </h2>

                  <p style={styles.cardSubtitle}>
                    AI and health monitoring
                  </p>
                </div>

                <Brain
                  size={18}
                  color="#059669"
                />
              </div>

              <PerformanceRow
                icon={Brain}
                label="AI Screening"
                value={data.ai_screening_coverage}
                suffix="%"
              />

              <PerformanceRow
                icon={Activity}
                label="Average Health"
                value={data.average_health_score}
                suffix="%"
              />

              <PerformanceRow
                icon={Syringe}
                label="Vaccination Coverage"
                value={data.vaccination_coverage}
                suffix="%"
              />

              <PerformanceRow
                icon={CheckCircle2}
                label="Recovery Records"
                value={
                  data.recovered_cases
                    ? Math.min(
                        Math.round(
                          (data.recovered_cases /
                            Math.max(
                              data.total_animals,
                              1
                            )) *
                            100
                        ),
                        100
                      )
                    : 0
                }
                suffix="%"
              />
            </section>

            <section style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>
                    Health Intelligence
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Current operational snapshot
                  </p>
                </div>

                <Activity
                  size={18}
                  color="#059669"
                />
              </div>

              <IntelligenceRow
                title="Population Health"
                text={`${data.average_health_score}% average health score`}
              />

              <IntelligenceRow
                title="AI Monitoring"
                text={`${data.ai_screening_coverage}% screening coverage`}
              />

              <IntelligenceRow
                title="Vaccination"
                text={`${data.vaccination_coverage}% vaccination coverage`}
              />

              <IntelligenceRow
                title="Active Cases"
                text={`${data.active_cases} active cases currently tracked`}
              />
            </section>
          </div>
        </>
      )}

      <div style={styles.footerNote}>
        Pashu-Rakshak AI analytics are intended for health
        monitoring and decision support. Clinical decisions
        remain with qualified veterinary professionals.
      </div>

      <style>
        {`
          @keyframes analyticsSpin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 1100px) {
            .analytics-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 820px) {
            .analytics-charts,
            .analytics-bottom {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 620px) {
            .analytics-stats {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  change,
  danger = false,
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTop}>
        <div
          style={{
            ...styles.statIcon,
            ...(danger
              ? styles.statDangerIcon
              : {}),
          }}
        >
          <Icon size={17} />
        </div>

        <span style={styles.statChange}>
          {change}
        </span>
      </div>

      <strong style={styles.statValue}>
        {value}
      </strong>

      <span style={styles.statLabel}>
        {label}
      </span>
    </div>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div style={styles.overviewCard}>
      <div style={styles.overviewIcon}>
        <Icon size={17} />
      </div>

      <div>
        <strong style={styles.overviewValue}>
          {value}
        </strong>

        <span style={styles.overviewLabel}>
          {label}
        </span>
      </div>
    </div>
  );
}

function RiskLegend({
  label,
  value,
  total,
}) {
  const percentage = total
    ? Math.round((value / total) * 100)
    : 0;

  const colorMap = {
    Low: "#059669",
    Medium: "#d97706",
    High: "#ea580c",
    Critical: "#dc2626",
  };

  return (
    <div style={styles.legendRow}>
      <div style={styles.legendLeft}>
        <span
          style={{
            ...styles.legendDot,
            background:
              colorMap[label] ||
              "#64748b",
          }}
        />

        <span style={styles.legendName}>
          {label}
        </span>
      </div>

      <strong style={styles.legendValue}>
        {value}{" "}
        <small>
          ({percentage}%)
        </small>
      </strong>
    </div>
  );
}

function PerformanceRow({
  icon: Icon,
  label,
  value,
  suffix,
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, Number(value || 0))
  );

  return (
    <div style={styles.performanceRow}>
      <div style={styles.performanceTop}>
        <div style={styles.performanceName}>
          <div style={styles.performanceIcon}>
            <Icon size={14} />
          </div>

          <span>
            {label}
          </span>
        </div>

        <strong>
          {safeValue}
          {suffix}
        </strong>
      </div>

      <div style={styles.track}>
        <div
          style={{
            ...styles.trackFill,
            width: `${safeValue}%`,
          }}
        />
      </div>
    </div>
  );
}

function IntelligenceRow({
  title,
  text,
}) {
  return (
    <div style={styles.intelligenceRow}>
      <div>
        <strong style={styles.intelligenceTitle}>
          {title}
        </strong>

        <span style={styles.intelligenceText}>
          {text}
        </span>
      </div>

      <CheckCircle2
        size={16}
        color="#059669"
      />
    </div>
  );
}

function getDonutGradient(items, total) {
  if (!total) {
    return "#e2e8f0 0deg 360deg";
  }

  const colors = {
    Low: "#059669",
    Medium: "#d97706",
    High: "#ea580c",
    Critical: "#dc2626",
  };

  let current = 0;

  const stops = items.map((item) => {
    const percentage =
      (Number(item?.value || 0) /
        total) *
      360;

    const start = current;
    const end =
      current + percentage;

    current = end;

    return `${
      colors[item.label] ||
      "#64748b"
    } ${start}deg ${end}deg`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px 30px 50px",
    background: "#f5f8f6",
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
    gap: 16,
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
    fontWeight: 900,
    lineHeight: 1.1,
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 13,
    maxWidth: 700,
    lineHeight: 1.5,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  periodSelect: {
    border: "1px solid #dbe5df",
    background: "#ffffff",
    borderRadius: 11,
    padding: "10px 11px",
    outline: 0,
    color: "#334155",
    fontSize: 10,
    fontWeight: 800,
  },

  exportButton: {
    border: 0,
    background: "#059669",
    color: "#ffffff",
    borderRadius: 11,
    padding: "10px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    fontWeight: 800,
    cursor: "pointer",
  },

  refreshButton: {
    border: "1px solid #dbe5df",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 11,
    padding: "10px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 10,
    fontWeight: 800,
    cursor: "pointer",
  },

  demoBanner: {
    maxWidth: 1220,
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1d4ed8",
    padding: "10px 12px",
    borderRadius: 13,
    fontSize: 10,
    fontWeight: 700,
  },

  errorBanner: {
    maxWidth: 1220,
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "10px 12px",
    borderRadius: 13,
    fontSize: 10,
    fontWeight: 700,
  },

  statsGrid: {
    maxWidth: 1220,
    margin: "0 auto 13px",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 14,
    boxShadow:
      "0 8px 22px rgba(15,23,42,0.04)",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    background: "#ecfdf5",
    color: "#047857",
    display: "grid",
    placeItems: "center",
  },

  statDangerIcon: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  statChange: {
    fontSize: 9,
    fontWeight: 900,
    color: "#15803d",
  },

  statValue: {
    display: "block",
    marginTop: 12,
    fontSize: 25,
    fontWeight: 900,
  },

  statLabel: {
    display: "block",
    marginTop: 3,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
  },

  overviewGrid: {
    maxWidth: 1220,
    margin: "0 auto 16px",
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 10,
  },

  overviewCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 15,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  overviewIcon: {
    width: 33,
    height: 33,
    borderRadius: 10,
    background: "#f0fdf4",
    color: "#15803d",
    display: "grid",
    placeItems: "center",
  },

  overviewValue: {
    display: "block",
    fontSize: 18,
    fontWeight: 900,
  },

  overviewLabel: {
    display: "block",
    marginTop: 2,
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: 700,
  },

  chartGrid: {
    maxWidth: 1220,
    margin: "0 auto 15px",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.4fr) minmax(360px, 1fr)",
    gap: 15,
  },

  bottomGrid: {
    maxWidth: 1220,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 15,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 19,
    padding: 16,
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.04)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 17,
  },

  cardTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 9,
  },

  barChart: {
    height: 270,
    display: "flex",
    alignItems: "stretch",
    gap: 8,
    position: "relative",
    padding:
      "12px 6px 25px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  chartGridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "25%",
    borderTop: "1px dashed #edf2ef",
  },

  chartGridLineTwo: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    borderTop: "1px dashed #edf2ef",
  },

  chartGridLineThree: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "75%",
    borderTop: "1px dashed #edf2ef",
  },

  barColumn: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 0,
    position: "relative",
    zIndex: 2,
  },

  barValue: {
    fontSize: 8,
    color: "#64748b",
    fontWeight: 800,
    marginBottom: 4,
  },

  barArea: {
    width: "100%",
    height: "78%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  bar: {
    width: "62%",
    minWidth: 7,
    maxWidth: 24,
    background:
      "linear-gradient(180deg, #10b981 0%, #059669 100%)",
    borderRadius:
      "6px 6px 0 0",
  },

  barMonth: {
    position: "absolute",
    bottom: 0,
    fontSize: 8,
    color: "#94a3b8",
  },

  chartNote: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 9,
    lineHeight: 1.6,
  },

  riskLayout: {
    minHeight: 270,
    display: "flex",
    alignItems: "center",
    gap: 30,
  },

  donutWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "0 0 190px",
  },

  donut: {
    width: 185,
    height: 185,
    borderRadius: "50%",
    position: "relative",
    display: "grid",
    placeItems: "center",
  },

  donutInner: {
    width: 126,
    height: 126,
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "0 4px 14px rgba(15,23,42,0.05)",
  },

  legend: {
    flex: 1,
    display: "grid",
    gap: 14,
  },

  legendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  legendLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
  },

  legendName: {
    color: "#475569",
    fontSize: 10,
    fontWeight: 700,
  },

  legendValue: {
    fontSize: 10,
    color: "#0f172a",
  },

  loading: {
    maxWidth: 1220,
    margin: "0 auto",
    minHeight: 360,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },

  spinner: {
    animation:
      "analyticsSpin 1s linear infinite",
  },

  performanceRow: {
    marginBottom: 18,
  },

  performanceTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 7,
  },

  performanceName: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#475569",
    fontSize: 10,
    fontWeight: 750,
  },

  performanceIcon: {
    width: 29,
    height: 29,
    borderRadius: 8,
    background: "#ecfdf5",
    color: "#047857",
    display: "grid",
    placeItems: "center",
  },

  track: {
    width: "100%",
    height: 7,
    borderRadius: 999,
    background: "#f1f5f9",
    overflow: "hidden",
  },

  trackFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, #059669 0%, #10b981 100%)",
  },

  intelligenceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "13px 0",
    borderBottom:
      "1px solid #f1f5f9",
  },

  intelligenceTitle: {
    display: "block",
    fontSize: 10,
    color: "#334155",
  },

  intelligenceText: {
    display: "block",
    marginTop: 3,
    color: "#94a3b8",
    fontSize: 9,
  },

  footerNote: {
    maxWidth: 1220,
    margin:
      "18px auto 0",
    color: "#94a3b8",
    fontSize: 9,
    lineHeight: 1.6,
    textAlign: "center",
  },
};