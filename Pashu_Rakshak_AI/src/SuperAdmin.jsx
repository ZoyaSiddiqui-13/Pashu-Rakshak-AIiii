import React, { useState } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  PawPrint,
  AlertTriangle,
  Activity,
  BarChart3,
  Bell,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock3,
  UserCog,
  Settings,
} from "lucide-react";

export default function SuperAdmin() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: "USR-1001",
      name: "Farm Administrator",
      role: "Farm Admin",
      organization: "Green Valley Farm",
      status: "Active",
      lastActive: "2 min ago",
    },
    {
      id: "USR-1002",
      name: "Dr. Mehta",
      role: "Veterinarian",
      organization: "Pashu Care Center",
      status: "Active",
      lastActive: "12 min ago",
    },
    {
      id: "USR-1003",
      name: "Field Staff 01",
      role: "Staff",
      organization: "Nashik Field Unit",
      status: "Active",
      lastActive: "25 min ago",
    },
    {
      id: "USR-1004",
      name: "Regional Officer",
      role: "Government",
      organization: "Maharashtra Region",
      status: "Active",
      lastActive: "1 hr ago",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            Pashu-Rakshak AI / Super Admin
          </div>

          <h1 style={styles.title}>
            Super Admin Dashboard <span>🛡️</span>
          </h1>

          <p style={styles.subtitle}>
            System-wide control, users, farms, health intelligence and platform operations.
          </p>
        </div>

        <div style={styles.headerRight}>
          <button style={styles.notificationButton}>
            <Bell size={19} />
            <span style={styles.badge}>6</span>
          </button>

          <div style={styles.adminProfile}>
            <div style={styles.avatar}>SA</div>

            <div>
              <strong style={styles.adminName}>Super Admin</strong>
              <span style={styles.adminRole}>System Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<Users size={22} />}
          title="Total Users"
          value="248"
          meta="+18 this month"
          color="#7c3aed"
          bg="#f5f3ff"
        />

        <StatCard
          icon={<Building2 size={22} />}
          title="Registered Farms"
          value="128"
          meta="+12% vs previous period"
          color="#16a34a"
          bg="#f0fdf4"
        />

        <StatCard
          icon={<PawPrint size={22} />}
          title="Total Animals"
          value="1,842"
          meta="+8% monitored"
          color="#2563eb"
          bg="#eff6ff"
        />

        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Critical Alerts"
          value="6"
          meta="Needs attention"
          color="#dc2626"
          bg="#fef2f2"
        />
      </div>

      {/* SYSTEM HEALTH */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              System Health
            </h2>

            <p style={styles.panelSubtitle}>
              Current platform and service status
            </p>
          </div>

          <div style={styles.liveStatus}>
            <span style={styles.liveDot}></span>
            All systems operational
          </div>
        </div>

        <div style={styles.systemGrid}>
          <SystemItem
            title="AI Screening Service"
            value="Operational"
            percentage="98%"
            color="#16a34a"
          />

          <SystemItem
            title="Veterinary Workflow"
            value="Operational"
            percentage="94%"
            color="#2563eb"
          />

          <SystemItem
            title="Laboratory Workflow"
            value="Operational"
            percentage="91%"
            color="#7c3aed"
          />

          <SystemItem
            title="Notification Service"
            value="Operational"
            percentage="99%"
            color="#ea580c"
          />
        </div>
      </section>

      {/* QUICK ADMIN ACTIONS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Administration
            </h2>

            <p style={styles.sectionSubtitle}>
              Manage platform-wide operations
            </p>
          </div>
        </div>

        <div style={styles.actionGrid}>
          <ActionCard
            icon={<UserCog size={22} />}
            title="Manage Users"
            text="Create, edit and control user access"
            color="#7c3aed"
          />

          <ActionCard
            icon={<Building2 size={22} />}
            title="Manage Farms"
            text="Monitor registered farms and units"
            color="#16a34a"
          />

          <ActionCard
            icon={<ShieldCheck size={22} />}
            title="Role & Permissions"
            text="Control role-based platform access"
            color="#2563eb"
          />

          <ActionCard
            icon={<Settings size={22} />}
            title="System Settings"
            text="Configure platform preferences"
            color="#ea580c"
          />
        </div>
      </section>

      {/* MAIN GRID */}
      <div style={styles.mainGrid}>
        {/* USERS */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Recent Users
              </h2>

              <p style={styles.panelSubtitle}>
                Recently active platform users
              </p>
            </div>

            <button style={styles.viewButton}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div style={styles.searchBox}>
            <Search size={17} color="#94a3b8" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, role or organization..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.userList}>
            {filteredUsers.map((user) => (
              <div key={user.id} style={styles.userRow}>
                <div style={styles.userAvatar}>
                  {getInitials(user.name)}
                </div>

                <div style={styles.userInfo}>
                  <strong>{user.name}</strong>
                  <span>
                    {user.role} • {user.organization}
                  </span>
                </div>

                <StatusBadge status={user.status} />

                <div style={styles.lastActive}>
                  {user.lastActive}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div style={styles.empty}>
                No users found.
              </div>
            )}
          </div>
        </section>

        {/* REGIONAL INTELLIGENCE */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Regional Intelligence
              </h2>

              <p style={styles.panelSubtitle}>
                Current livestock health activity
              </p>
            </div>

            <BarChart3 size={20} color="#7c3aed" />
          </div>

          <Region
            name="Satara"
            cases="8 active cases"
            risk="Critical"
            progress="86%"
          />

          <Region
            name="Pune"
            cases="6 active cases"
            risk="High"
            progress="68%"
          />

          <Region
            name="Nashik"
            cases="5 active cases"
            risk="Medium"
            progress="52%"
          />

          <Region
            name="Ahmednagar"
            cases="3 active cases"
            risk="Low"
            progress="31%"
          />

          <button style={styles.mapButton}>
            Open Surveillance Map
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      {/* ACTIVITY + ALERTS */}
      <div style={styles.bottomGrid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Recent System Activity
              </h2>

              <p style={styles.panelSubtitle}>
                Latest administrative events
              </p>
            </div>

            <Activity size={20} color="#16a34a" />
          </div>

          <ActivityRow
            icon={<CheckCircle2 size={16} />}
            title="New veterinarian account approved"
            text="Dr. Mehta · Pashu Care Center"
            time="12 min ago"
          />

          <ActivityRow
            icon={<Users size={16} />}
            title="New staff member registered"
            text="Nashik Field Unit · Staff"
            time="28 min ago"
          />

          <ActivityRow
            icon={<AlertTriangle size={16} />}
            title="Critical outbreak alert escalated"
            text="Satara · Respiratory cases"
            time="42 min ago"
          />

          <ActivityRow
            icon={<ShieldCheck size={16} />}
            title="Role permissions updated"
            text="Veterinarian access policy"
            time="1 hr ago"
          />
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Platform Summary
              </h2>

              <p style={styles.panelSubtitle}>
                Key system indicators
              </p>
            </div>

            <Clock3 size={20} color="#2563eb" />
          </div>

          <SummaryMetric
            title="AI Screening Coverage"
            value="92%"
            progress="92%"
            color="#16a34a"
          />

          <SummaryMetric
            title="Vaccination Coverage"
            value="87%"
            progress="87%"
            color="#2563eb"
          />

          <SummaryMetric
            title="Case Resolution Rate"
            value="81%"
            progress="81%"
            color="#7c3aed"
          />

          <SummaryMetric
            title="Alert Response Rate"
            value="95%"
            progress="95%"
            color="#ea580c"
          />
        </section>
      </div>

      {/* FOOTER */}
      <div style={styles.footerStatus}>
        <span style={styles.footerDot}></span>

        <CheckCircle2 size={15} />

        <span>
          Super Admin control center is operational
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  meta,
  color,
  bg,
}) {
  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          color,
          background: bg,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={styles.statTitle}>{title}</span>
        <div style={styles.statValue}>{value}</div>

        <span
          style={{
            ...styles.statMeta,
            color,
          }}
        >
          {meta}
        </span>
      </div>
    </div>
  );
}

function SystemItem({
  title,
  value,
  percentage,
  color,
}) {
  return (
    <div style={styles.systemItem}>
      <div style={styles.systemTop}>
        <div style={styles.systemTitle}>
          <span
            style={{
              ...styles.systemDot,
              background: color,
            }}
          ></span>

          {title}
        </div>

        <strong style={{ color }}>
          {percentage}
        </strong>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: percentage,
            background: color,
          }}
        ></div>
      </div>

      <span
        style={{
          ...styles.systemValue,
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  text,
  color,
}) {
  return (
    <button style={styles.actionCard}>
      <div
        style={{
          ...styles.actionIcon,
          color,
          background: `${color}12`,
        }}
      >
        {icon}
      </div>

      <div style={styles.actionContent}>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <ArrowRight size={17} color="#64748b" />
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      style={{
        ...styles.statusBadge,
        background:
          status === "Active" ? "#f0fdf4" : "#fef2f2",
        color:
          status === "Active" ? "#15803d" : "#dc2626",
      }}
    >
      {status}
    </span>
  );
}

function Region({
  name,
  cases,
  risk,
  progress,
}) {
  const riskColors = {
    Critical: {
      color: "#dc2626",
      background: "#fef2f2",
    },
    High: {
      color: "#ea580c",
      background: "#fff7ed",
    },
    Medium: {
      color: "#a16207",
      background: "#fefce8",
    },
    Low: {
      color: "#15803d",
      background: "#f0fdf4",
    },
  };

  return (
    <div style={styles.regionRow}>
      <div>
        <strong style={styles.regionName}>{name}</strong>

        <span style={styles.regionCases}>{cases}</span>

        <div style={styles.regionTrack}>
          <div
            style={{
              ...styles.regionFill,
              width: progress,
              background: riskColors[risk].color,
            }}
          />
        </div>
      </div>

      <span
        style={{
          ...styles.riskBadge,
          background: riskColors[risk].background,
          color: riskColors[risk].color,
        }}
      >
        {risk}
      </span>
    </div>
  );
}

function ActivityRow({
  icon,
  title,
  text,
  time,
}) {
  return (
    <div style={styles.activityRow}>
      <div style={styles.activityIcon}>{icon}</div>

      <div style={styles.activityContent}>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <small>{time}</small>
    </div>
  );
}

function SummaryMetric({
  title,
  value,
  progress,
  color,
}) {
  return (
    <div style={styles.summaryMetric}>
      <div style={styles.summaryTop}>
        <span>{title}</span>
        <strong style={{ color }}>{value}</strong>
      </div>

      <div style={styles.summaryTrack}>
        <div
          style={{
            width: progress,
            height: "100%",
            background: color,
            borderRadius: 20,
          }}
        ></div>
      </div>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "28px 32px 40px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    color: "#0f172a",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 26,
  },

  breadcrumb: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 7,
  },

  title: {
    margin: 0,
    fontSize: 27,
    fontWeight: 850,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 13,
    maxWidth: 720,
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  notificationButton: {
    position: "relative",
    width: 43,
    height: 43,
    border: "1px solid #e2e8f0",
    borderRadius: 11,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 800,
  },

  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#f5f3ff",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 850,
  },

  adminName: {
    display: "block",
    fontSize: 12,
  },

  adminRole: {
    display: "block",
    color: "#64748b",
    fontSize: 10,
    marginTop: 2,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 18,
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 17,
  },

  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statTitle: {
    color: "#64748b",
    fontSize: 10,
  },

  statValue: {
    fontSize: 23,
    fontWeight: 850,
    marginTop: 2,
  },

  statMeta: {
    fontSize: 9,
    fontWeight: 700,
    marginTop: 3,
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 15,
    padding: 20,
    marginBottom: 18,
  },

  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 17,
  },

  panelTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
  },

  panelSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  liveStatus: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#15803d",
    background: "#f0fdf4",
    padding: "7px 10px",
    borderRadius: 8,
    fontSize: 9,
    fontWeight: 800,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },

  systemGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },

  systemItem: {
    border: "1px solid #eef2f7",
    borderRadius: 12,
    padding: 14,
  },

  systemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },

  systemTitle: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10,
    fontWeight: 700,
    color: "#475569",
  },

  systemDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },

  progressTrack: {
    marginTop: 11,
    height: 7,
    borderRadius: 20,
    background: "#f1f5f9",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  systemValue: {
    display: "block",
    marginTop: 7,
    fontSize: 9,
    fontWeight: 800,
  },

  section: {
    marginBottom: 18,
  },

  sectionHeader: {
    marginBottom: 13,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 13,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 13,
    padding: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    textAlign: "left",
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionContent: {
    flex: 1,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.3fr) minmax(320px, 1fr)",
    gap: 18,
  },

  searchBox: {
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    padding: "0 11px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 11,
    color: "#334155",
    background: "transparent",
  },

  userList: {
    display: "flex",
    flexDirection: "column",
  },

  userRow: {
    display: "grid",
    gridTemplateColumns:
      "40px 1fr auto 75px",
    alignItems: "center",
    gap: 11,
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#f5f3ff",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 850,
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  statusBadge: {
    padding: "5px 8px",
    borderRadius: 7,
    fontSize: 8,
    fontWeight: 800,
  },

  lastActive: {
    color: "#94a3b8",
    fontSize: 9,
    textAlign: "right",
  },

  empty: {
    padding: 25,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 11,
  },

  viewButton: {
    border: 0,
    background: "transparent",
    color: "#7c3aed",
    fontSize: 10,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
  },

  regionRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 15,
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  regionName: {
    display: "block",
    fontSize: 11,
  },

  regionCases: {
    display: "block",
    marginTop: 3,
    color: "#94a3b8",
    fontSize: 9,
  },

  regionTrack: {
    height: 6,
    background: "#f1f5f9",
    borderRadius: 20,
    marginTop: 8,
    overflow: "hidden",
  },

  regionFill: {
    height: "100%",
    borderRadius: 20,
  },

  riskBadge: {
    padding: "6px 9px",
    borderRadius: 8,
    fontSize: 8,
    fontWeight: 800,
  },

  mapButton: {
    width: "100%",
    marginTop: 14,
    border: "1px solid #ddd6fe",
    background: "#f5f3ff",
    color: "#7c3aed",
    borderRadius: 8,
    padding: "9px 11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.3fr) minmax(320px, 1fr)",
    gap: 18,
  },

  activityRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  activityIcon: {
    width: 31,
    height: 31,
    borderRadius: 8,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  activityContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  activityRowSmall: {
    color: "#94a3b8",
  },

  summaryMetric: {
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  summaryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 10,
  },

  summaryTrack: {
    height: 7,
    background: "#f1f5f9",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 7,
  },

  footerStatus: {
    marginTop: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    color: "#15803d",
    fontSize: 10,
    fontWeight: 700,
  },

  footerDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },
};