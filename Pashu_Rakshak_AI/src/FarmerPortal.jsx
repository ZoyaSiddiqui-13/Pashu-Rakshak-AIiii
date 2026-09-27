import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  Bell,
  Plus,
  ArrowRight,
  Search,
  Camera,
  Upload,
  ShieldAlert,
  CheckCircle2,
  Clock3,
  Syringe,
  Pill,
  MapPinned,
  Phone,
  MessageCircle,
  X,
} from "lucide-react";

export default function FarmerPortal() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showReport, setShowReport] = useState(false);

  const [selectedAnimal, setSelectedAnimal] =
    useState("AN-1024");

  const [symptoms, setSymptoms] = useState("");
  const [observation, setObservation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const animals = [
    {
      id: "AN-1024",
      name: "Gauri",
      type: "Cow",
      breed: "Gir",
      age: "4 years",
      score: 92,
      risk: "Low",
      location: "Nashik",
    },
    {
      id: "AN-1025",
      name: "Moti",
      type: "Buffalo",
      breed: "Murrah",
      age: "6 years",
      score: 68,
      risk: "Medium",
      location: "Pune",
    },
    {
      id: "AN-1026",
      name: "Laxmi",
      type: "Cow",
      breed: "Sahiwal",
      age: "3 years",
      score: 42,
      risk: "High",
      location: "Satara",
    },
    {
      id: "AN-1027",
      name: "Raja",
      type: "Goat",
      breed: "Osmanabadi",
      age: "2 years",
      score: 31,
      risk: "Critical",
      location: "Ahmednagar",
    },
    {
      id: "AN-1028",
      name: "Kali",
      type: "Sheep",
      breed: "Deccani",
      age: "5 years",
      score: 81,
      risk: "Low",
      location: "Solapur",
    },
  ];

  const alerts = [
    {
      id: 1,
      title: "High-risk health case",
      text: "Laxmi requires veterinarian review.",
      time: "18 min ago",
      severity: "High",
    },
    {
      id: 2,
      title: "Vaccination reminder",
      text: "Gauri vaccination is due this week.",
      time: "2 hrs ago",
      severity: "Medium",
    },
    {
      id: 3,
      title: "Veterinarian response",
      text: "Dr. Mehta reviewed case CS-2048.",
      time: "Yesterday",
      severity: "Normal",
    },
  ];

  const filteredAnimals = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return animals;

    return animals.filter(
      (animal) =>
        animal.name.toLowerCase().includes(value) ||
        animal.id.toLowerCase().includes(value) ||
        animal.type.toLowerCase().includes(value) ||
        animal.location.toLowerCase().includes(value)
    );
  }, [search]);

  const currentAnimal =
    animals.find(
      (animal) => animal.id === selectedAnimal
    ) || animals[0];

  const openReport = () => {
    setReportMessage("");
    setShowReport(true);
  };

  const submitReport = (e) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      setReportMessage(
        "Please enter the animal symptoms."
      );
      return;
    }

    setReportMessage(
      "Symptoms submitted successfully. AI screening and veterinarian workflow can continue from this report."
    );
  };

  const openAI = () => {
    navigate("/ai-detection");
  };

  const openVet = () => {
    navigate("/veterinarian");
  };

  const openAlerts = () => {
    navigate("/alerts");
  };

  const openAnimals = () => {
    navigate("/animals");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            Pashu-Rakshak AI / Farmer Portal
          </div>

          <h1 style={styles.title}>
            Farmer Dashboard <span>👨‍🌾</span>
          </h1>

          <p style={styles.subtitle}>
            Monitor your livestock, report symptoms and get
            health support quickly.
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.notificationButton}
            onClick={openAlerts}
          >
            <Bell size={19} />

            <span style={styles.notificationBadge}>
              3
            </span>
          </button>

          <div style={styles.profile}>
            <div style={styles.avatar}>FA</div>

            <div>
              <strong style={styles.profileName}>
                Farm Owner
              </strong>

              <span style={styles.profileRole}>
                Farmer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FARM SUMMARY */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<PawPrint size={22} />}
          title="Total Animals"
          value="42"
          meta="5 currently monitored"
          color="#16a34a"
          background="#f0fdf4"
        />

        <StatCard
          icon={<HeartPulse size={22} />}
          title="Healthy Animals"
          value="34"
          meta="81% of your herd"
          color="#2563eb"
          background="#eff6ff"
        />

        <StatCard
          icon={<AlertTriangle size={22} />}
          title="Cases Requiring Attention"
          value="4"
          meta="1 high risk"
          color="#ea580c"
          background="#fff7ed"
        />

        <StatCard
          icon={<ShieldAlert size={22} />}
          title="Critical Cases"
          value="1"
          meta="Immediate review"
          color="#dc2626"
          background="#fef2f2"
        />
      </div>

      {/* PRIMARY ACTIONS */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              Quick Actions
            </h2>

            <p style={styles.sectionSubtitle}>
              Start an important livestock health task
            </p>
          </div>
        </div>

        <div style={styles.actionGrid}>
          <ActionCard
            icon={<Plus size={21} />}
            title="Report Symptoms"
            text="Tell us what you are observing"
            color="#16a34a"
            onClick={openReport}
          />

          <ActionCard
            icon={<PawPrint size={21} />}
            title="View Animals"
            text="Open your livestock records"
            color="#2563eb"
            onClick={openAnimals}
          />

          <ActionCard
            icon={<Stethoscope size={21} />}
            title="Vet Support"
            text="Review active veterinarian cases"
            color="#7c3aed"
            onClick={openVet}
          />

          <ActionCard
            icon={<AlertTriangle size={21} />}
            title="Emergency"
            text="Open critical health alerts"
            color="#dc2626"
            onClick={openAlerts}
          />
        </div>
      </section>

      {/* CURRENT HEALTH + ALERTS */}
      <div style={styles.mainGrid}>
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Livestock Health
              </h2>

              <p style={styles.panelSubtitle}>
                Search and review your animals
              </p>
            </div>

            <button
              type="button"
              style={styles.outlineButton}
              onClick={openAnimals}
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={styles.searchBox}>
            <Search
              size={17}
              color="#94a3b8"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search animal, ID or location..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.animalList}>
            {filteredAnimals.map((animal) => (
              <button
                key={animal.id}
                type="button"
                onClick={() =>
                  setSelectedAnimal(animal.id)
                }
                style={{
                  ...styles.animalRow,
                  ...(selectedAnimal === animal.id
                    ? styles.animalRowActive
                    : {}),
                }}
              >
                <div style={styles.animalIcon}>
                  <PawPrint size={18} />
                </div>

                <div style={styles.animalInfo}>
                  <strong>{animal.name}</strong>

                  <span>
                    {animal.id} • {animal.type} •{" "}
                    {animal.location}
                  </span>
                </div>

                <div style={styles.scoreColumn}>
                  <strong>{animal.score}</strong>
                  <span>Health Score</span>
                </div>

                <RiskBadge risk={animal.risk} />
              </button>
            ))}

            {filteredAnimals.length === 0 && (
              <div style={styles.empty}>
                No animals found.
              </div>
            )}
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Alerts & Notifications
              </h2>

              <p style={styles.panelSubtitle}>
                Important updates for your farm
              </p>
            </div>

            <Bell
              size={20}
              color="#ea580c"
            />
          </div>

          <div style={styles.alertList}>
            {alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                title={alert.title}
                text={alert.text}
                time={alert.time}
                severity={alert.severity}
              />
            ))}
          </div>

          <button
            type="button"
            style={styles.fullButton}
            onClick={openAlerts}
          >
            Open All Alerts
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      {/* SELECTED ANIMAL */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Selected Animal
            </h2>

            <p style={styles.panelSubtitle}>
              Current health information
            </p>
          </div>

          <div style={styles.selectedStatus}>
            <span style={styles.greenDot}></span>
            Monitored
          </div>
        </div>

        <div style={styles.animalProfile}>
          <div style={styles.largeAnimalIcon}>
            <PawPrint size={28} />
          </div>

          <div style={styles.profileDetails}>
            <h3>{currentAnimal.name}</h3>

            <span>
              {currentAnimal.id} •{" "}
              {currentAnimal.type} •{" "}
              {currentAnimal.breed}
            </span>

            <span>
              {currentAnimal.age} •{" "}
              {currentAnimal.location}
            </span>
          </div>

          <div style={styles.healthScore}>
            <div style={styles.scoreCircle}>
              {currentAnimal.score}
            </div>

            <span>
              Health Score
            </span>
          </div>

          <RiskBadge
            risk={currentAnimal.risk}
          />
        </div>

        <div style={styles.infoGrid}>
          <InfoCard
            icon={<HeartPulse size={19} />}
            title="Current Status"
            value={
              currentAnimal.risk ===
              "Critical"
                ? "Immediate attention"
                : currentAnimal.risk ===
                  "High"
                ? "Requires review"
                : "Stable"
            }
            color="#16a34a"
            background="#f0fdf4"
          />

          <InfoCard
            icon={<Syringe size={19} />}
            title="Vaccination"
            value="Next dose due this week"
            color="#2563eb"
            background="#eff6ff"
          />

          <InfoCard
            icon={<Pill size={19} />}
            title="Treatment"
            value={
              currentAnimal.risk ===
              "Critical"
                ? "Active treatment"
                : "No active treatment"
            }
            color="#7c3aed"
            background="#f5f3ff"
          />

          <InfoCard
            icon={<MapPinned size={19} />}
            title="Location"
            value={currentAnimal.location}
            color="#ea580c"
            background="#fff7ed"
          />
        </div>
      </section>

      {/* AI + VET SUPPORT */}
      <div style={styles.supportGrid}>
        <section style={styles.aiCard}>
          <div style={styles.aiIcon}>
            <HeartPulse size={24} />
          </div>

          <div style={styles.aiContent}>
            <h2>AI Health Screening</h2>

            <p>
              Report symptoms, observations and an image
              to begin AI-assisted disease-risk screening.
            </p>

            <small>
              AI output is decision support and not a
              definitive veterinary diagnosis.
            </small>

            <button
              type="button"
              onClick={openAI}
              style={styles.aiButton}
            >
              Open AI Detection
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section style={styles.vetCard}>
          <div style={styles.vetIcon}>
            <Stethoscope size={24} />
          </div>

          <div style={styles.vetContent}>
            <h2>Veterinarian Support</h2>

            <p>
              Your farm has an active veterinary workflow.
              Review case status and consultation updates.
            </p>

            <div style={styles.vetButtons}>
              <button
                type="button"
                onClick={openVet}
                style={styles.primarySmall}
              >
                Open Vet Cases
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                style={styles.secondarySmall}
                onClick={() =>
                  alert(
                    "Emergency veterinary contact: +91 1800 123 456"
                  )
                }
              >
                <Phone size={15} />
                Emergency Contact
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* FARM ACTIVITY */}
      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>
              Recent Farm Activity
            </h2>

            <p style={styles.panelSubtitle}>
              Latest health-related events
            </p>
          </div>

          <Clock3
            size={20}
            color="#16a34a"
          />
        </div>

        <ActivityRow
          icon={<CheckCircle2 size={16} />}
          title="Health record updated"
          text="Gauri • Routine health check completed"
          time="18 min ago"
        />

        <ActivityRow
          icon={<AlertTriangle size={16} />}
          title="High-risk alert received"
          text="Laxmi • Veterinarian review required"
          time="42 min ago"
        />

        <ActivityRow
          icon={<Syringe size={16} />}
          title="Vaccination reminder"
          text="Gauri • Next dose due this week"
          time="2 hrs ago"
        />

        <ActivityRow
          icon={<Stethoscope size={16} />}
          title="Veterinarian update"
          text="Case CS-2048 • Reviewed by Dr. Mehta"
          time="Yesterday"
        />
      </section>

      {/* EMERGENCY BANNER */}
      <div style={styles.emergencyBanner}>
        <div style={styles.emergencyIcon}>
          <ShieldAlert size={22} />
        </div>

        <div style={styles.emergencyContent}>
          <strong>
            Emergency livestock health concern?
          </strong>

          <span>
            For a critical animal, report symptoms immediately
            and contact a veterinarian.
          </span>
        </div>

        <button
          type="button"
          style={styles.emergencyButton}
          onClick={openReport}
        >
          Report Now
        </button>
      </div>

      {/* REPORT SYMPTOMS MODAL */}
      {showReport && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2>
                  Report Animal Symptoms
                </h2>

                <p>
                  Submit observations to continue the health
                  screening workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowReport(false)
                }
                style={styles.modalClose}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitReport}>
              <label style={styles.formLabel}>
                Select Animal

                <select
                  value={selectedAnimal}
                  onChange={(e) =>
                    setSelectedAnimal(
                      e.target.value
                    )
                  }
                  style={styles.formInput}
                >
                  {animals.map((animal) => (
                    <option
                      key={animal.id}
                      value={animal.id}
                    >
                      {animal.name} •{" "}
                      {animal.id}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.formLabel}>
                Symptoms

                <textarea
                  value={symptoms}
                  onChange={(e) =>
                    setSymptoms(
                      e.target.value
                    )
                  }
                  placeholder="Example: fever, low appetite, coughing..."
                  style={styles.textarea}
                />
              </label>

              <label style={styles.formLabel}>
                Observation

                <textarea
                  value={observation}
                  onChange={(e) =>
                    setObservation(
                      e.target.value
                    )
                  }
                  placeholder="Describe what you noticed..."
                  style={styles.textarea}
                />
              </label>

              <label style={styles.formLabel}>
                Temperature (optional)

                <input
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(
                      e.target.value
                    )
                  }
                  placeholder="e.g. 40.2 °C"
                  style={styles.formInput}
                />
              </label>

              <label style={styles.uploadBox}>
                <Upload size={20} />

                <span>
                  {photoName
                    ? photoName
                    : "Upload animal photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoName(
                      e.target.files?.[0]
                        ?.name || ""
                    )
                  }
                  style={{
                    display: "none",
                  }}
                />
              </label>

              {reportMessage && (
                <div
                  style={
                    styles.reportMessage
                  }
                >
                  <CheckCircle2 size={16} />

                  <span>
                    {reportMessage}
                  </span>
                </div>
              )}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() =>
                    setShowReport(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  Submit Symptoms
                  <ArrowRight size={16} />
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
        size={17}
        color="#64748b"
      />
    </button>
  );
}

function RiskBadge({ risk }) {
  const colors = {
    Low: {
      color: "#15803d",
      background: "#dcfce7",
    },
    Medium: {
      color: "#a16207",
      background: "#fef3c7",
    },
    High: {
      color: "#c2410c",
      background: "#ffedd5",
    },
    Critical: {
      color: "#b91c1c",
      background: "#fee2e2",
    },
  };

  const current =
    colors[risk] || colors.Low;

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

function AlertRow({
  title,
  text,
  time,
  severity,
}) {
  const color =
    severity === "High"
      ? "#dc2626"
      : severity === "Medium"
      ? "#ea580c"
      : "#16a34a";

  const background =
    severity === "High"
      ? "#fef2f2"
      : severity === "Medium"
      ? "#fff7ed"
      : "#f0fdf4";

  return (
    <div style={styles.alertRow}>
      <div
        style={{
          ...styles.alertIcon,
          color,
          background,
        }}
      >
        <AlertTriangle size={17} />
      </div>

      <div style={styles.alertContent}>
        <strong>{title}</strong>

        <span>{text}</span>
      </div>

      <small style={styles.alertTime}>
        {time}
      </small>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  color,
  background,
}) {
  return (
    <div style={styles.infoCard}>
      <div
        style={{
          ...styles.infoIcon,
          color,
          background,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={styles.infoTitle}>
          {title}
        </span>

        <strong style={styles.infoValue}>
          {value}
        </strong>
      </div>
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

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  notificationButton: {
    position: "relative",
    width: 42,
    height: 42,
    border:
      "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#ffffff",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
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
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
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
    border:
      "1px solid #e2e8f0",
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
    border:
      "1px solid #e2e8f0",
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
    border:
      "1px solid #e2e8f0",
    borderRadius: 15,
    padding: 20,
    marginBottom: 18,
    boxShadow:
      "0 4px 15px rgba(15,23,42,0.03)",
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

  outlineButton: {
    border:
      "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 8,
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  searchBox: {
    height: 40,
    border:
      "1px solid #e2e8f0",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 11px",
    marginBottom: 9,
  },

  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    background: "transparent",
    fontSize: 11,
    color: "#334155",
  },

  animalList: {
    display: "flex",
    flexDirection: "column",
  },

  animalRow: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "40px 1fr auto auto",
    alignItems: "center",
    gap: 10,
    border: 0,
    borderBottom:
      "1px solid #f1f5f9",
    background: "#ffffff",
    padding: "11px 4px",
    textAlign: "left",
    cursor: "pointer",
  },

  animalRowActive: {
    background: "#f8fafc",
  },

  animalIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
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

  scoreColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 68,
  },

  riskBadge: {
    padding: "5px 8px",
    borderRadius: 8,
    fontSize: 8,
    fontWeight: 850,
  },

  empty: {
    padding: 25,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 10,
  },

  alertList: {
    display: "flex",
    flexDirection: "column",
  },

  alertRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 0",
    borderBottom:
      "1px solid #f1f5f9",
  },

  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  alertContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  alertTime: {
    color: "#94a3b8",
    fontSize: 8,
  },

  fullButton: {
    width: "100%",
    marginTop: 12,
    border:
      "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    borderRadius: 8,
    padding: "9px 11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
  },

  selectedStatus: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 8,
    padding: "6px 9px",
    fontSize: 9,
    fontWeight: 800,
  },

  greenDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },

  animalProfile: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    paddingBottom: 18,
    borderBottom:
      "1px solid #f1f5f9",
  },

  largeAnimalIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    background: "#f0fdf4",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  profileDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  healthScore: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0fdf4",
    color: "#15803d",
    border:
      "4px solid #bbf7d0",
    fontWeight: 850,
    fontSize: 12,
  },

  infoGrid: {
    marginTop: 17,
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 11,
  },

  infoCard: {
    border:
      "1px solid #eef2f7",
    borderRadius: 11,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoTitle: {
    display: "block",
    color: "#94a3b8",
    fontSize: 8,
  },

  infoValue: {
    display: "block",
    marginTop: 3,
    fontSize: 9,
  },

  supportGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 18,
  },

  aiCard: {
    border:
      "1px solid #bbf7d0",
    borderRadius: 15,
    padding: 20,
    background:
      "linear-gradient(135deg, #f0fdf4, #ffffff)",
    display: "flex",
    gap: 15,
  },

  vetCard: {
    border:
      "1px solid #ddd6fe",
    borderRadius: 15,
    padding: 20,
    background:
      "linear-gradient(135deg, #f5f3ff, #ffffff)",
    display: "flex",
    gap: 15,
  },

  aiIcon: {
    width: 45,
    height: 45,
    borderRadius: 11,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  vetIcon: {
    width: 45,
    height: 45,
    borderRadius: 11,
    background: "#ede9fe",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  aiContent: {
    flex: 1,
  },

  vetContent: {
    flex: 1,
  },

  aiButton: {
    marginTop: 12,
    border: 0,
    background: "#15803d",
    color: "#ffffff",
    borderRadius: 8,
    padding: "8px 11px",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 9,
    fontWeight: 800,
    cursor: "pointer",
  },

  vetButtons: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  },

  primarySmall: {
    border: 0,
    background: "#7c3aed",
    color: "#ffffff",
    borderRadius: 8,
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
  },

  secondarySmall: {
    border:
      "1px solid #ddd6fe",
    background: "#ffffff",
    color: "#6d28d9",
    borderRadius: 8,
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 800,
  },

  activityRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 0",
    borderBottom:
      "1px solid #f1f5f9",
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

  emergencyBanner: {
    background: "#fff7ed",
    border:
      "1px solid #fed7aa",
    borderRadius: 14,
    padding: "14px 17px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#ffedd5",
    color: "#ea580c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  emergencyContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },

  emergencyButton: {
    border: 0,
    background: "#ea580c",
    color: "#ffffff",
    borderRadius: 8,
    padding: "9px 13px",
    cursor: "pointer",
    fontSize: 9,
    fontWeight: 850,
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.48)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 580,
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
    gap: 15,
    marginBottom: 18,
  },

  modalClose: {
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
    marginBottom: 13,
    color: "#334155",
    fontSize: 10,
    fontWeight: 800,
  },

  formInput: {
    width: "100%",
    marginTop: 6,
    minHeight: 42,
    border:
      "1px solid #dbe5e1",
    borderRadius: 9,
    padding: "0 10px",
    outline: 0,
    background: "#ffffff",
    fontSize: 11,
    color: "#334155",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: 90,
    marginTop: 6,
    border:
      "1px solid #dbe5e1",
    borderRadius: 9,
    padding: 10,
    outline: 0,
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: 11,
    color: "#334155",
    boxSizing: "border-box",
  },

  uploadBox: {
    minHeight: 48,
    border:
      "1px dashed #cbd5e1",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#64748b",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
  },

  reportMessage: {
    marginTop: 13,
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#f0fdf4",
    color: "#15803d",
    border:
      "1px solid #bbf7d0",
    borderRadius: 8,
    padding: "9px 10px",
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
    border:
      "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    borderRadius: 8,
    padding: "9px 12px",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },

  submitButton: {
    border: 0,
    background: "#16a34a",
    color: "#ffffff",
    borderRadius: 8,
    padding: "9px 12px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },
};