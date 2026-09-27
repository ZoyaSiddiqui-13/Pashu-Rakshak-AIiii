import React, { useState } from "react";
import {
  MapPinned,
  ClipboardList,
  PawPrint,
  FlaskConical,
  Camera,
  Upload,
  Search,
  Bell,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  ArrowRight,
  Phone,
  X,
} from "lucide-react";

export default function FieldWorker() {
  const [search, setSearch] = useState("");
  const [showCollection, setShowCollection] = useState(false);

  const [selectedCase, setSelectedCase] = useState(null);
  const [sampleType, setSampleType] = useState("");
  const [observation, setObservation] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [message, setMessage] = useState("");

  const assignments = [
    {
      id: "CS-2048",
      animal: "Raja",
      type: "Goat",
      disease: "Respiratory infection suspected",
      location: "Satara",
      priority: "Critical",
      status: "Investigation Required",
      time: "12 min ago",
    },
    {
      id: "CS-2047",
      animal: "Laxmi",
      type: "Cow",
      disease: "Possible fever",
      location: "Pune",
      priority: "High",
      status: "Sample Pending",
      time: "38 min ago",
    },
    {
      id: "CS-2046",
      animal: "Moti",
      type: "Buffalo",
      disease: "Appetite reduction",
      location: "Nashik",
      priority: "Medium",
      status: "Field Visit Assigned",
      time: "1 hr ago",
    },
    {
      id: "CS-2045",
      animal: "Gauri",
      type: "Cow",
      disease: "Parasite screening",
      location: "Ahmednagar",
      priority: "Low",
      status: "Observation",
      time: "2 hrs ago",
    },
  ];

  const filteredAssignments = assignments.filter((item) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      item.id.toLowerCase().includes(value) ||
      item.animal.toLowerCase().includes(value) ||
      item.location.toLowerCase().includes(value) ||
      item.disease.toLowerCase().includes(value)
    );
  });

  const openCollection = (item) => {
    setSelectedCase(item);
    setSampleType("");
    setObservation("");
    setPhotoName("");
    setMessage("");
    setShowCollection(true);
  };

  const submitCollection = (e) => {
    e.preventDefault();

    if (!sampleType) {
      setMessage("Please select the sample type.");
      return;
    }

    setMessage(
      "Sample collection recorded. The case is ready for laboratory referral."
    );
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            Pashu-Rakshak AI / Field Worker
          </div>

          <h1 style={styles.title}>
            Field Worker Dashboard <span>🚜</span>
          </h1>

          <p style={styles.subtitle}>
            Manage field investigations, sample collection and case updates.
          </p>
        </div>

        <div style={styles.headerRight}>
          <button style={styles.notificationButton}>
            <Bell size={19} />
            <span style={styles.notificationBadge}>5</span>
          </button>

          <div style={styles.profile}>
            <div style={styles.avatar}>FW</div>

            <div>
              <strong style={styles.profileName}>
                Field Worker
              </strong>

              <span style={styles.profileRole}>
                Field Operations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<ClipboardList size={22} />}
          title="Assigned Cases"
          value="18"
          meta="6 urgent"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={<Navigation size={22} />}
          title="Field Visits"
          value="7"
          meta="Today's schedule"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={<FlaskConical size={22} />}
          title="Samples Pending"
          value="4"
          meta="Awaiting collection"
          color="#ea580c"
          background="#fff7ed"
        />

        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Critical Cases"
          value="2"
          meta="Priority response"
          color="#dc2626"
          background="#fef2f2"
        />
      </div>

      {/* QUICK ACTIONS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Field Operations
            </h2>

            <p style={styles.sectionSubtitle}>
              Start a field task quickly
            </p>
          </div>
        </div>

        <div style={styles.actionGrid}>
          <ActionCard
            icon={<ClipboardList size={21} />}
            title="Assigned Cases"
            text="Review cases assigned to you"
            color="#2563eb"
          />

          <ActionCard
            icon={<MapPinned size={21} />}
            title="Open Field Map"
            text="Navigate to case locations"
            color="#16a34a"
          />

          <ActionCard
            icon={<FlaskConical size={21} />}
            title="Collect Sample"
            text="Record sample collection"
            color="#ea580c"
            onClick={() => {
              if (assignments[0]) {
                openCollection(assignments[0]);
              }
            }}
          />

          <ActionCard
            icon={<AlertTriangle size={21} />}
            title="Emergency Case"
            text="Handle priority field response"
            color="#dc2626"
          />
        </div>
      </section>

      {/* MAIN GRID */}
      <div style={styles.mainGrid}>
        {/* CASES */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Assigned Field Cases
              </h2>

              <p style={styles.panelSubtitle}>
                Cases requiring investigation or sample collection
              </p>
            </div>

            <button style={styles.viewButton}>
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          {/* SEARCH */}
          <div style={styles.searchBox}>
            <Search size={17} color="#94a3b8" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case, animal, location..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.caseList}>
            {filteredAssignments.map((item) => (
              <div key={item.id} style={styles.caseRow}>
                <div style={styles.caseIcon}>
                  <PawPrint size={18} />
                </div>

                <div style={styles.caseInfo}>
                  <div style={styles.caseTop}>
                    <strong>{item.id}</strong>

                    <RiskBadge risk={item.priority} />
                  </div>

                  <strong style={styles.animalName}>
                    {item.animal} • {item.type}
                  </strong>

                  <span style={styles.caseDisease}>
                    {item.disease}
                  </span>

                  <span style={styles.caseLocation}>
                    <MapPinned size={12} />
                    {item.location}
                  </span>
                </div>

                <div style={styles.caseStatus}>
                  <StatusBadge status={item.status} />

                  <small>{item.time}</small>

                  <button
                    type="button"
                    style={styles.collectButton}
                    onClick={() =>
                      openCollection(item)
                    }
                  >
                    Update
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}

            {filteredAssignments.length === 0 && (
              <div style={styles.emptyState}>
                No matching field cases found.
              </div>
            )}
          </div>
        </section>

        {/* TODAY'S ROUTE */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Today's Field Route
              </h2>

              <p style={styles.panelSubtitle}>
                Scheduled investigation locations
              </p>
            </div>

            <MapPinned
              size={20}
              color="#16a34a"
            />
          </div>

          <RouteItem
            number="01"
            location="Satara"
            caseId="CS-2048"
            priority="Critical"
            time="10:30 AM"
          />

          <RouteItem
            number="02"
            location="Pune"
            caseId="CS-2047"
            priority="High"
            time="12:00 PM"
          />

          <RouteItem
            number="03"
            location="Nashik"
            caseId="CS-2046"
            priority="Medium"
            time="2:30 PM"
          />

          <RouteItem
            number="04"
            location="Ahmednagar"
            caseId="CS-2045"
            priority="Low"
            time="4:30 PM"
          />

          <button
            type="button"
            style={styles.mapButton}
            onClick={() =>
              alert(
                "Field navigation map opened for the demo."
              )
            }
          >
            <Navigation size={15} />
            Open Navigation Map
          </button>
        </section>
      </div>

      {/* SAMPLE + INVESTIGATION */}
      <div style={styles.bottomGrid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Sample Collection
              </h2>

              <p style={styles.panelSubtitle}>
                Collect and refer samples to the laboratory
              </p>
            </div>

            <FlaskConical
              size={20}
              color="#ea580c"
            />
          </div>

          <div style={styles.workflow}>
            <WorkflowStep
              number="1"
              title="Field Investigation"
              text="Visit animal and record observations"
              color="#16a34a"
            />

            <WorkflowArrow />

            <WorkflowStep
              number="2"
              title="Sample Collection"
              text="Record sample type and evidence"
              color="#ea580c"
            />

            <WorkflowArrow />

            <WorkflowStep
              number="3"
              title="Laboratory Referral"
              text="Send sample for testing"
              color="#2563eb"
            />
          </div>

          <button
            type="button"
            style={styles.primaryButton}
            onClick={() =>
              openCollection(assignments[0])
            }
          >
            <FlaskConical size={16} />
            Start Sample Collection
          </button>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Field Updates
              </h2>

              <p style={styles.panelSubtitle}>
                Recent activity from field operations
              </p>
            </div>

            <Clock3
              size={20}
              color="#2563eb"
            />
          </div>

          <ActivityRow
            icon={<CheckCircle2 size={16} />}
            title="Sample collected"
            text="CS-2047 • Laxmi"
            time="22 min ago"
          />

          <ActivityRow
            icon={<Camera size={16} />}
            title="Photo evidence uploaded"
            text="CS-2048 • Raja"
            time="38 min ago"
          />

          <ActivityRow
            icon={<MapPinned size={16} />}
            title="Field visit completed"
            text="Nashik • CS-2046"
            time="1 hr ago"
          />

          <ActivityRow
            icon={<FlaskConical size={16} />}
            title="Sample referred to lab"
            text="CS-2044 • Blood sample"
            time="2 hrs ago"
          />
        </section>
      </div>

      {/* SUPPORT */}
      <section style={styles.supportBanner}>
        <div style={styles.supportIcon}>
          <Phone size={20} />
        </div>

        <div style={styles.supportContent}>
          <strong>Need veterinary support?</strong>

          <span>
            Escalate serious field observations to the veterinarian.
          </span>
        </div>

        <button
          type="button"
          style={styles.supportButton}
          onClick={() =>
            alert(
              "Veterinarian support request created for the demo."
            )
          }
        >
          Contact Veterinarian
        </button>
      </section>

      {/* SAMPLE MODAL */}
      {showCollection && selectedCase && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2>Field Sample Collection</h2>

                <p>
                  {selectedCase.id} •{" "}
                  {selectedCase.animal} •{" "}
                  {selectedCase.location}
                </p>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={() =>
                  setShowCollection(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={submitCollection}>
              <label style={styles.formLabel}>
                Sample Type

                <select
                  value={sampleType}
                  onChange={(e) =>
                    setSampleType(e.target.value)
                  }
                  style={styles.formInput}
                >
                  <option value="">
                    Select sample type
                  </option>

                  <option value="Blood">
                    Blood
                  </option>

                  <option value="Saliva">
                    Saliva
                  </option>

                  <option value="Nasal Swab">
                    Nasal Swab
                  </option>

                  <option value="Fecal">
                    Fecal
                  </option>

                  <option value="Urine">
                    Urine
                  </option>
                </select>
              </label>

              <label style={styles.formLabel}>
                Field Observation

                <textarea
                  value={observation}
                  onChange={(e) =>
                    setObservation(
                      e.target.value
                    )
                  }
                  placeholder="Describe field findings..."
                  style={styles.textarea}
                />
              </label>

              <label style={styles.uploadBox}>
                <Upload size={19} />

                <span>
                  {photoName
                    ? photoName
                    : "Upload field evidence / animal photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoName(
                      e.target.files?.[0]?.name ||
                        ""
                    )
                  }
                  style={{
                    display: "none",
                  }}
                />
              </label>

              {message && (
                <div style={styles.message}>
                  <CheckCircle2 size={16} />
                  <span>{message}</span>
                </div>
              )}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() =>
                    setShowCollection(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.primaryButton}
                >
                  Record Collection
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  meta,
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
        <span style={styles.statTitle}>
          {title}
        </span>

        <div style={styles.statValue}>
          {value}
        </div>

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

function ActionCard({
  icon,
  title,
  text,
  color,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={styles.actionCard}
    >
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

      <ArrowRight
        size={16}
        color="#64748b"
      />
    </button>
  );
}

function RiskBadge({ risk }) {
  const values = {
    Critical: {
      color: "#b91c1c",
      background: "#fee2e2",
    },
    High: {
      color: "#c2410c",
      background: "#ffedd5",
    },
    Medium: {
      color: "#a16207",
      background: "#fef3c7",
    },
    Low: {
      color: "#15803d",
      background: "#dcfce7",
    },
  };

  const current = values[risk] || values.Low;

  return (
    <span
      style={{
        ...styles.riskBadge,
        color: current.color,
        background: current.background,
      }}
    >
      {risk}
    </span>
  );
}

function StatusBadge({ status }) {
  const isDone = status === "Observation";

  return (
    <span
      style={{
        ...styles.statusBadge,
        color: isDone
          ? "#15803d"
          : "#475569",
        background: isDone
          ? "#f0fdf4"
          : "#f8fafc",
      }}
    >
      {status}
    </span>
  );
}

function RouteItem({
  number,
  location,
  caseId,
  priority,
  time,
}) {
  return (
    <div style={styles.routeItem}>
      <div style={styles.routeNumber}>
        {number}
      </div>

      <div style={styles.routeContent}>
        <strong>{location}</strong>

        <span>
          {caseId} • {priority} priority
        </span>
      </div>

      <div style={styles.routeTime}>
        {time}
      </div>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  text,
  color,
}) {
  return (
    <div style={styles.workflowStep}>
      <div
        style={{
          ...styles.workflowNumber,
          background: color,
        }}
      >
        {number}
      </div>

      <strong>{title}</strong>

      <span>{text}</span>
    </div>
  );
}

function WorkflowArrow() {
  return (
    <ArrowRight
      size={17}
      color="#cbd5e1"
    />
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
      <div style={styles.activityIcon}>
        {icon}
      </div>

      <div style={styles.activityContent}>
        <strong>{title}</strong>

        <span>{text}</span>
      </div>

      <small>{time}</small>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "28px 32px 40px",
    color: "#0f172a",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 23,
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
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  notificationButton: {
    position: "relative",
    width: 42,
    height: 42,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: "50%",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 800,
    border: "2px solid #ffffff",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 850,
  },

  profileName: {
    display: "block",
    fontSize: 12,
  },

  profileRole: {
    display: "block",
    color: "#64748b",
    fontSize: 10,
    marginTop: 2,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 14,
    marginBottom: 20,
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
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
    display: "block",
    color: "#64748b",
    fontSize: 10,
  },

  statValue: {
    marginTop: 2,
    fontSize: 23,
    fontWeight: 850,
  },

  statMeta: {
    display: "block",
    marginTop: 3,
    fontSize: 9,
    fontWeight: 700,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    marginBottom: 12,
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
    gap: 12,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 13,
    padding: 15,
    minHeight: 76,
    display: "flex",
    alignItems: "center",
    gap: 10,
    textAlign: "left",
    cursor: "pointer",
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
      "minmax(0, 1.35fr) minmax(320px, 1fr)",
    gap: 18,
    marginBottom: 18,
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 15,
    padding: 20,
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 16,
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

  viewButton: {
    border: 0,
    background: "transparent",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
  },

  searchBox: {
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 11px",
    marginBottom: 10,
  },

  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    fontSize: 11,
    color: "#334155",
  },

  caseList: {
    display: "flex",
    flexDirection: "column",
  },

  caseRow: {
    display: "grid",
    gridTemplateColumns:
      "40px 1fr auto",
    gap: 11,
    alignItems: "center",
    padding: "13px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  caseIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  caseInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  caseTop: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  animalName: {
    fontSize: 11,
  },

  caseDisease: {
    color: "#64748b",
    fontSize: 10,
  },

  caseLocation: {
    color: "#94a3b8",
    fontSize: 9,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  caseStatus: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },

  statusBadge: {
    padding: "5px 8px",
    borderRadius: 7,
    fontSize: 8,
    fontWeight: 800,
    textAlign: "right",
  },

  caseStatusSmall: {
    color: "#94a3b8",
  },

  collectButton: {
    border: 0,
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: 7,
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    fontSize: 8,
    fontWeight: 800,
  },

  riskBadge: {
    padding: "4px 7px",
    borderRadius: 999,
    fontSize: 8,
    fontWeight: 850,
  },

  emptyState: {
    padding: 25,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
  },

  routeItem: {
    display: "grid",
    gridTemplateColumns:
      "34px 1fr auto",
    gap: 10,
    alignItems: "center",
    padding: "13px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  routeNumber: {
    width: 31,
    height: 31,
    borderRadius: 8,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 850,
  },

  routeContent: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  routeTime: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: 700,
  },

  mapButton: {
    width: "100%",
    marginTop: 14,
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 8,
    padding: "9px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.35fr) minmax(320px, 1fr)",
    gap: 18,
    marginBottom: 18,
  },

  workflow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 0 18px",
  },

  workflowStep: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 5,
  },

  workflowNumber: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 850,
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
    background: "#eff6ff",
    color: "#2563eb",
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

  primaryButton: {
    border: 0,
    background: "#16a34a",
    color: "#ffffff",
    borderRadius: 8,
    padding: "9px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 850,
  },

  supportBanner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    borderRadius: 13,
    padding: "13px 16px",
  },

  supportIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  supportContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  supportButton: {
    border: 0,
    background: "#2563eb",
    color: "#ffffff",
    borderRadius: 8,
    padding: "8px 11px",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 850,
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.48)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 17,
    padding: 22,
    boxShadow:
      "0 25px 80px rgba(15,23,42,0.24)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },

  closeButton: {
    width: 34,
    height: 34,
    border: 0,
    borderRadius: 8,
    background: "#f8fafc",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  formLabel: {
    display: "block",
    color: "#334155",
    fontSize: 10,
    fontWeight: 800,
    marginBottom: 13,
  },

  formInput: {
    width: "100%",
    minHeight: 42,
    marginTop: 6,
    border: "1px solid #dbe5e1",
    borderRadius: 9,
    padding: "0 10px",
    outline: 0,
    fontSize: 11,
    boxSizing: "border-box",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    minHeight: 90,
    marginTop: 6,
    border: "1px solid #dbe5e1",
    borderRadius: 9,
    padding: 10,
    outline: 0,
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: 11,
    boxSizing: "border-box",
  },

  uploadBox: {
    minHeight: 48,
    border: "1px dashed #cbd5e1",
    borderRadius: 10,
    background: "#f8fafc",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  message: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginTop: 13,
    padding: "9px 10px",
    borderRadius: 8,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: 10,
    fontWeight: 700,
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 17,
  },

  cancelButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    borderRadius: 8,
    padding: "9px 12px",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },
};