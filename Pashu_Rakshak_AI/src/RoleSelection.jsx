import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  Stethoscope,
  Building2,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "farm-admin",
      title: "Farm Admin",
      subtitle: "Livestock & Farm Management",
      description:
        "Manage animals, health records, AI screening, alerts, treatments and farm operations.",
      icon: PawPrint,
      color: "#16a34a",
      background: "#f0fdf4",
      route: "/",
    },
    {
      id: "veterinarian",
      title: "Veterinarian",
      subtitle: "Clinical Case Management",
      description:
        "Review assigned cases, examine AI screening results, add consultation notes and manage treatment.",
      icon: Stethoscope,
      color: "#2563eb",
      background: "#eff6ff",
      route: "/veterinarian",
    },
    {
      id: "government",
      title: "Government / Admin",
      subtitle: "Regional Disease Intelligence",
      description:
        "Monitor disease surveillance, outbreaks, analytics, users and system-wide livestock health.",
      icon: Building2,
      color: "#7c3aed",
      background: "#f5f3ff",
      route: "/admin",
    },
  ];

  const selectRole = (role) => {
    localStorage.setItem("pashuRole", role.id);
    localStorage.setItem("pashuRoleName", role.title);

    navigate(role.route);
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundCircleOne}></div>
      <div style={styles.backgroundCircleTwo}></div>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <PawPrint size={28} />
          </div>

          <h1 style={styles.title}>Pashu-Rakshak AI</h1>

          <p style={styles.subtitle}>
            Select your role to continue
          </p>

          <p style={styles.description}>
            Choose the role that matches how you use the livestock
            health surveillance platform.
          </p>
        </div>

        {/* ROLE CARDS */}
        <div style={styles.rolesGrid}>
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                onClick={() => selectRole(role)}
                style={styles.roleCard}
              >
                <div
                  style={{
                    ...styles.roleIcon,
                    background: role.background,
                    color: role.color,
                  }}
                >
                  <Icon size={32} />
                </div>

                <div style={styles.roleContent}>
                  <h2 style={styles.roleTitle}>
                    {role.title}
                  </h2>

                  <div
                    style={{
                      ...styles.roleSubtitle,
                      color: role.color,
                    }}
                  >
                    {role.subtitle}
                  </div>

                  <p style={styles.roleDescription}>
                    {role.description}
                  </p>
                </div>

                <div
                  style={{
                    ...styles.roleArrow,
                    color: role.color,
                  }}
                >
                  <ArrowRight size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {/* SECURITY */}
        <div style={styles.security}>
          <ShieldCheck size={19} />

          <span>
            Role-based access • Secure livestock health
            management
          </span>
        </div>

        {/* SYSTEM STATUS */}
        <div style={styles.status}>
          <span style={styles.statusDot}></span>

          <Activity size={15} />

          <span>System Operational</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 48%, #eff6ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "rgba(34,197,94,0.07)",
    top: -180,
    left: -150,
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "rgba(37,99,235,0.06)",
    bottom: -230,
    right: -180,
  },

  container: {
    width: "100%",
    maxWidth: 1000,
    position: "relative",
    zIndex: 2,
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    boxShadow: "0 10px 25px rgba(22,163,74,0.20)",
  },

  title: {
    margin: 0,
    fontSize: 29,
    fontWeight: 850,
    color: "#0f172a",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: 17,
    fontWeight: 700,
    color: "#334155",
  },

  description: {
    maxWidth: 560,
    margin: "8px auto 0",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.6,
  },

  rolesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: 17,
  },

  roleCard: {
    position: "relative",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 17,
    padding: 23,
    textAlign: "left",
    cursor: "pointer",
    minHeight: 270,
    boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  roleIcon: {
    width: 62,
    height: 62,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  roleContent: {
    paddingRight: 15,
  },

  roleTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: 19,
    fontWeight: 800,
  },

  roleSubtitle: {
    fontSize: 11,
    fontWeight: 800,
    marginTop: 5,
  },

  roleDescription: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.65,
    marginTop: 13,
  },

  roleArrow: {
    position: "absolute",
    right: 19,
    bottom: 19,
    width: 34,
    height: 34,
    borderRadius: 9,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  security: {
    margin: "22px auto 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    color: "#475569",
    fontSize: 11,
    fontWeight: 600,
  },

  status: {
    margin: "13px auto 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    color: "#15803d",
    fontSize: 11,
    fontWeight: 700,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },
};