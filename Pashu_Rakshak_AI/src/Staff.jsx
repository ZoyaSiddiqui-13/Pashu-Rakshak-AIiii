import React, { useState } from "react";
import {
  Users,
  PawPrint,
  ClipboardList,
  Syringe,
  Bell,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function Staff() {
  const [search, setSearch] = useState("");

  const animals = [
    {
      id: "COW-1024",
      name: "Raja",
      type: "Cow",
      health: "Healthy",
      status: "Active",
    },
    {
      id: "BUF-2088",
      name: "Gauri",
      type: "Buffalo",
      health: "Low Risk",
      status: "Active",
    },
    {
      id: "COW-1142",
      name: "Moti",
      type: "Cow",
      health: "Medium Risk",
      status: "Monitoring",
    },
    {
      id: "GOAT-3051",
      name: "Chiku",
      type: "Goat",
      health: "Healthy",
      status: "Active",
    },
  ];

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.id.toLowerCase().includes(search.toLowerCase()) ||
      animal.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>Pashu-Rakshak AI / Staff</div>

          <h1 style={styles.title}>
            Staff Dashboard <span>👋</span>
          </h1>

          <p style={styles.subtitle}>
            Manage daily livestock health and field operations.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.notificationButton}>
            <Bell size={20} />
            <span style={styles.notificationBadge}>4</span>
          </button>

          <div style={styles.profile}>
            <div style={styles.avatar}>ST</div>

            <div>
              <strong style={styles.profileName}>Field Staff</strong>
              <span style={styles.profileRole}>Staff</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<PawPrint size={22} />}
          title="Assigned Animals"
          value="86"
          change="+8%"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={<ClipboardList size={22} />}
          title="Pending Tasks"
          value="12"
          change="3 urgent"
          color="#ea580c"
          background="#fff7ed"
        />

        <StatCard
          icon={<Syringe size={22} />}
          title="Vaccinations Due"
          value="7"
          change="This week"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Health Alerts"
          value="4"
          change="Needs attention"
          color="#dc2626"
          background="#fef2f2"
        />
      </div>

      {/* QUICK ACTIONS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <p style={styles.sectionSubtitle}>
              Frequently used staff operations
            </p>
          </div>
        </div>

        <div style={styles.actionGrid}>
          <ActionCard
            icon={<Plus size={23} />}
            title="Add Animal"
            description="Register a new livestock animal"
            color="#16a34a"
          />

          <ActionCard
            icon={<ClipboardList size={23} />}
            title="Update Health Record"
            description="Add health observations"
            color="#2563eb"
          />

          <ActionCard
            icon={<Syringe size={23} />}
            title="Vaccination"
            description="Update vaccination records"
            color="#7c3aed"
          />

          <ActionCard
            icon={<Activity size={23} />}
            title="Health Check"
            description="Record routine health checks"
            color="#ea580c"
          />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={styles.contentGrid}>
        {/* ANIMALS */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Assigned Animals</h2>
              <p style={styles.panelSubtitle}>
                Livestock assigned to your field operations
              </p>
            </div>

            <button style={styles.viewButton}>
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div style={styles.searchBox}>
            <Search size={18} color="#94a3b8" />

            <input
              type="text"
              placeholder="Search animal, ID or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.animalList}>
            {filteredAnimals.map((animal) => (
              <div key={animal.id} style={styles.animalRow}>
                <div style={styles.animalIcon}>
                  <PawPrint size={19} />
                </div>

                <div style={styles.animalInfo}>
                  <strong>{animal.name}</strong>
                  <span>
                    {animal.id} • {animal.type}
                  </span>
                </div>

                <div style={styles.healthColumn}>
                  <HealthBadge health={animal.health} />
                </div>

                <div style={styles.statusColumn}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      color:
                        animal.status === "Active"
                          ? "#15803d"
                          : "#b45309",
                      background:
                        animal.status === "Active"
                          ? "#f0fdf4"
                          : "#fffbeb",
                    }}
                  >
                    {animal.status}
                  </span>
                </div>
              </div>
            ))}

            {filteredAnimals.length === 0 && (
              <div style={styles.emptyState}>
                No animals found.
              </div>
            )}
          </div>
        </section>

        {/* TASKS */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Today's Tasks</h2>
              <p style={styles.panelSubtitle}>
                Tasks requiring your attention
              </p>
            </div>
          </div>

          <div style={styles.taskList}>
            <Task
              icon={<AlertTriangle size={18} />}
              title="Health observation required"
              animal="Moti • COW-1142"
              time="10:30 AM"
              color="#dc2626"
              background="#fef2f2"
            />

            <Task
              icon={<Syringe size={18} />}
              title="Vaccination due"
              animal="Gauri • BUF-2088"
              time="12:00 PM"
              color="#2563eb"
              background="#eff6ff"
            />

            <Task
              icon={<ClipboardList size={18} />}
              title="Update health record"
              animal="Raja • COW-1024"
              time="2:00 PM"
              color="#16a34a"
              background="#f0fdf4"
            />

            <Task
              icon={<Clock3 size={18} />}
              title="Follow-up observation"
              animal="Chiku • GOAT-3051"
              time="4:30 PM"
              color="#7c3aed"
              background="#f5f3ff"
            />
          </div>
        </section>
      </div>

      {/* FOOTER STATUS */}
      <div style={styles.systemStatus}>
        <div style={styles.statusIndicator}></div>

        <CheckCircle2 size={16} />

        <span>
          Staff operations system is operational
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  color,
  background,
}) {
  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          color,
          background,
        }}
      >
        {icon}
      </div>

      <div>
        <div style={styles.statTitle}>{title}</div>

        <div style={styles.statValue}>{value}</div>

        <div
          style={{
            ...styles.statChange,
            color,
          }}
        >
          {change}
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
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

        <span>{description}</span>
      </div>

      <ArrowRight size={18} color="#64748b" />
    </button>
  );
}

function HealthBadge({ health }) {
  const settings = {
    Healthy: {
      color: "#15803d",
      background: "#f0fdf4",
    },
    "Low Risk": {
      color: "#a16207",
      background: "#fefce8",
    },
    "Medium Risk": {
      color: "#c2410c",
      background: "#fff7ed",
    },
  };

  const setting = settings[health] || settings.Healthy;

  return (
    <span
      style={{
        ...styles.healthBadge,
        color: setting.color,
        background: setting.background,
      }}
    >
      {health}
    </span>
  );
}

function Task({
  icon,
  title,
  animal,
  time,
  color,
  background,
}) {
  return (
    <div style={styles.task}>
      <div
        style={{
          ...styles.taskIcon,
          color,
          background,
        }}
      >
        {icon}
      </div>

      <div style={styles.taskContent}>
        <strong>{title}</strong>
        <span>{animal}</span>
      </div>

      <div style={styles.taskTime}>{time}</div>
    </div>
  );
}

const styles = {
  page: {
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
    marginBottom: 28,
  },

  breadcrumb: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 850,
    letterSpacing: "-0.5px",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 14,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  notificationButton: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 19,
    height: 19,
    borderRadius: "50%",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#ffedd5",
    color: "#c2410c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },

  profileName: {
    display: "block",
    fontSize: 13,
  },

  profileRole: {
    display: "block",
    color: "#64748b",
    fontSize: 11,
    marginTop: 2,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 25,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 15,
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  statTitle: {
    color: "#64748b",
    fontSize: 12,
    marginBottom: 4,
  },

  statValue: {
    fontSize: 25,
    fontWeight: 850,
    lineHeight: 1.1,
  },

  statChange: {
    fontSize: 10,
    fontWeight: 700,
    marginTop: 4,
  },

  section: {
    marginBottom: 25,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 12,
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 14,
    padding: 17,
    display: "flex",
    alignItems: "center",
    gap: 12,
    textAlign: "left",
    cursor: "pointer",
    minHeight: 82,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionContent: {
    flex: 1,
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.35fr 1fr",
    gap: 18,
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 21,
    boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 17,
  },

  panelTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 800,
  },

  panelSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  viewButton: {
    border: "none",
    background: "transparent",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  },

  searchBox: {
    height: 42,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 12px",
    marginBottom: 12,
  },

  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 12,
    color: "#334155",
    background: "transparent",
  },

  animalList: {
    display: "flex",
    flexDirection: "column",
  },

  animalRow: {
    display: "grid",
    gridTemplateColumns:
      "42px 1fr auto auto",
    alignItems: "center",
    gap: 11,
    padding: "13px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  animalIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    background: "#f0fdf4",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  animalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  healthColumn: {
    minWidth: 80,
  },

  statusColumn: {
    minWidth: 70,
    textAlign: "right",
  },

  healthBadge: {
    display: "inline-flex",
    padding: "5px 8px",
    borderRadius: 7,
    fontSize: 9,
    fontWeight: 800,
  },

  statusBadge: {
    display: "inline-flex",
    padding: "5px 8px",
    borderRadius: 7,
    fontSize: 9,
    fontWeight: 800,
  },

  emptyState: {
    padding: 30,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
  },

  task: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "15px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  taskIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  taskContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  taskTime: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 700,
  },

  systemStatus: {
    marginTop: 22,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    color: "#15803d",
    fontSize: 11,
    fontWeight: 700,
  },

  statusIndicator: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },
};