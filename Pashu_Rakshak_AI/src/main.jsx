import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  PawPrint,
  Brain,
  MapPinned,
  Bell,
  FileText,
  Stethoscope,
  FlaskConical,
  Syringe,
  Pill,
  FolderOpen,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  UserCircle,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
  Clock3,
  Users,
  HeartPulse,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import Login from "./Login";
import RoleSelection from "./RoleSelection";
import Animals from "./Animals";
import AIDetection from "./AIDetection";
import Alerts from "./Alerts";
import Notifications from "./Notifications";
import HealthRecords from "./HealthRecords";
import Veterinarian from "./Veterinarian";
import Staff from "./Staff";
import SuperAdmin from "./SuperAdmin";
import Laboratory from "./Laboratory";
import Vaccination from "./Vaccination";
import Treatment from "./Treatment";
import FollowUp from "./FollowUp";
import Cases from "./Cases";
import Outbreaks from "./Outbreaks";
import Analytics from "./Analytics";
import Admin from "./Admin";
import Help from "./help";
import SurveillanceMap from "./SurveillanceMap";

import "./styles.css";
import { LanguageProvider, useLanguage } from "./LanguageContext";

/* =========================================================
   NAVIGATION
========================================================= */

const mainNavigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Animals",
    path: "/animals",
    icon: PawPrint,
  },
  {
    label: "AI Detection",
    path: "/ai-detection",
    icon: Brain,
  },
  {
    label: "Disease Map",
    path: "/map",
    icon: MapPinned,
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: Bell,
    badge: 6,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
];

const healthNavigation = [
  {
    label: "Health Records",
    path: "/records",
    icon: FileText,
  },
  {
    label: "Veterinarian",
    path: "/veterinarian",
    icon: Stethoscope,
  },
  {
    label: "Laboratory",
    path: "/laboratory",
    icon: FlaskConical,
  },
  {
    label: "Vaccination",
    path: "/vaccination",
    icon: Syringe,
  },
  {
    label: "Treatment",
    path: "/treatment",
    icon: Pill,
  },
  {
    label: "Follow-up",
    path: "/follow-up",
    icon: Clock3,
  },
  {
    label: "Cases",
    path: "/cases",
    icon: FolderOpen,
  },
  {
    label: "Outbreaks",
    path: "/outbreaks",
    icon: AlertTriangle,
  },
];

const insightNavigation = [
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Administration",
    path: "/admin",
    icon: ShieldCheck,
  },
];

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  const [selectedPeriod, setSelectedPeriod] =
    useState("This Week");

  const stats = [
    {
      title: "Total Farms",
      value: "128",
      change: "+12%",
      icon: Users,
      type: "green",
    },
    {
      title: "Total Animals",
      value: "1,842",
      change: "+8%",
      icon: PawPrint,
      type: "blue",
    },
    {
      title: "Active Cases",
      value: "24",
      change: "-6%",
      icon: FolderOpen,
      type: "orange",
    },
    {
      title: "Critical Cases",
      value: "6",
      change: "+2",
      icon: AlertTriangle,
      type: "red",
    },
  ];

  const recentCases = [
    {
      id: "CS-2048",
      animal: "Raja",
      type: "Goat",
      concern: "Respiratory infection",
      location: "Satara",
      risk: "Critical",
      time: "12 min ago",
    },
    {
      id: "CS-2047",
      animal: "Laxmi",
      type: "Cow",
      concern: "Possible fever",
      location: "Satara",
      risk: "High",
      time: "38 min ago",
    },
    {
      id: "CS-2046",
      animal: "Moti",
      type: "Buffalo",
      concern: "Appetite reduction",
      location: "Pune",
      risk: "Medium",
      time: "1 hr ago",
    },
    {
      id: "CS-2045",
      animal: "Gauri",
      type: "Cow",
      concern: "Parasite screening",
      location: "Nashik",
      risk: "Low",
      time: "2 hrs ago",
    },
  ];

  return (
    <div style={dashboardStyles.page}>
      {/* HEADER */}
      <div style={dashboardStyles.header}>
        <div>
          <h1 style={dashboardStyles.title}>
            Good afternoon, Farm Admin 👋
          </h1>

          <p style={dashboardStyles.subtitle}>
            Here is today's livestock health overview.
          </p>
        </div>

        <div style={dashboardStyles.periodBox}>
          <Clock3 size={15} />

          <select
            value={selectedPeriod}
            onChange={(e) =>
              setSelectedPeriod(e.target.value)
            }
            style={dashboardStyles.periodSelect}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div style={dashboardStyles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              style={dashboardStyles.statCard}
            >
              <div
                style={{
                  ...dashboardStyles.statIcon,
                  ...getDashboardIconStyle(stat.type),
                }}
              >
                <Icon size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={dashboardStyles.statTitle}>
                  {stat.title}
                </div>

                <div style={dashboardStyles.statValue}>
                  {stat.value}
                </div>

                <div style={dashboardStyles.statBottom}>
                  <span style={{ color: "#16a34a" }}>
                    {stat.change}
                  </span>

                  <span>
                    vs previous period
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div style={dashboardStyles.mainGrid}>
        {/* HEALTH OVERVIEW */}
        <section style={dashboardStyles.card}>
          <div style={dashboardStyles.cardHeader}>
            <div>
              <h2 style={dashboardStyles.cardTitle}>
                Livestock Health Overview
              </h2>

              <p style={dashboardStyles.cardSubtitle}>
                Current health distribution
              </p>
            </div>

            <HeartPulse
              size={21}
              color="#16a34a"
            />
          </div>

          <div style={dashboardStyles.healthRows}>
            <HealthRow
              label="Healthy"
              value="1,482"
              percent="80%"
              type="healthy"
            />

            <HealthRow
              label="Low Risk"
              value="216"
              percent="12%"
              type="low"
            />

            <HealthRow
              label="Medium Risk"
              value="92"
              percent="5%"
              type="medium"
            />

            <HealthRow
              label="High Risk"
              value="46"
              percent="2%"
              type="high"
            />

            <HealthRow
              label="Critical"
              value="6"
              percent="1%"
              type="critical"
            />
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section style={dashboardStyles.card}>
          <div style={dashboardStyles.cardHeader}>
            <div>
              <h2 style={dashboardStyles.cardTitle}>
                Quick Actions
              </h2>

              <p style={dashboardStyles.cardSubtitle}>
                Frequently used tools
              </p>
            </div>

            <Activity
              size={21}
              color="#2563eb"
            />
          </div>

          <div style={dashboardStyles.quickGrid}>
            <QuickAction
              icon={<PawPrint size={20} />}
              title="Add Animal"
              text="Register livestock"
              onClick={() =>
                navigate("/animals")
              }
            />

            <QuickAction
              icon={<Brain size={20} />}
              title="AI Detection"
              text="Screen symptoms"
              onClick={() =>
                navigate("/ai-detection")
              }
            />

            <QuickAction
              icon={<FolderOpen size={20} />}
              title="View Cases"
              text="Manage active cases"
              onClick={() =>
                navigate("/cases")
              }
            />

            <QuickAction
              icon={<MapPinned size={20} />}
              title="Disease Map"
              text="Monitor regions"
              onClick={() =>
                navigate("/map")
              }
            />
          </div>
        </section>
      </div>

      {/* RECENT CASES */}
      <section style={dashboardStyles.card}>
        <div style={dashboardStyles.cardHeader}>
          <div>
            <h2 style={dashboardStyles.cardTitle}>
              Recent Health Cases
            </h2>

            <p style={dashboardStyles.cardSubtitle}>
              Latest cases requiring attention
            </p>
          </div>

          <button
            style={dashboardStyles.viewAll}
            onClick={() =>
              navigate("/cases")
            }
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={dashboardStyles.caseTable}>
          <div style={dashboardStyles.caseHeader}>
            <span>Case</span>
            <span>Animal</span>
            <span>Concern</span>
            <span>Location</span>
            <span>Risk</span>
            <span>Time</span>
          </div>

          {recentCases.map((item) => (
            <div
              key={item.id}
              style={dashboardStyles.caseRow}
            >
              <strong>{item.id}</strong>

              <div>
                <strong>{item.animal}</strong>
                <small style={dashboardStyles.smallText}>
                  {item.type}
                </small>
              </div>

              <span>{item.concern}</span>

              <span>{item.location}</span>

              <RiskBadge risk={item.risk} />

              <span style={dashboardStyles.time}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM GRID */}
      <div style={dashboardStyles.bottomGrid}>
        <section style={dashboardStyles.card}>
          <div style={dashboardStyles.cardHeader}>
            <div>
              <h2 style={dashboardStyles.cardTitle}>
                System Activity
              </h2>

              <p style={dashboardStyles.cardSubtitle}>
                Recent platform events
              </p>
            </div>

            <TrendingUp
              size={20}
              color="#16a34a"
            />
          </div>

          <ActivityItem
            icon={<CheckCircle2 size={16} />}
            title="AI screening completed"
            text="Raja · CS-2048"
            time="12 min ago"
          />

          <ActivityItem
            icon={<Bell size={16} />}
            title="Critical alert generated"
            text="Respiratory infection suspected"
            time="18 min ago"
          />

          <ActivityItem
            icon={<Stethoscope size={16} />}
            title="Veterinarian review assigned"
            text="Dr. Mehta · CS-2048"
            time="25 min ago"
          />

          <ActivityItem
            icon={<Syringe size={16} />}
            title="Vaccination completed"
            text="Gauri · AN-1024"
            time="1 hr ago"
          />
        </section>

        <section style={dashboardStyles.card}>
          <div style={dashboardStyles.cardHeader}>
            <div>
              <h2 style={dashboardStyles.cardTitle}>
                Disease Surveillance
              </h2>

              <p style={dashboardStyles.cardSubtitle}>
                Regional risk monitoring
              </p>
            </div>

            <button
              style={dashboardStyles.smallButton}
              onClick={() =>
                navigate("/map")
              }
            >
              Open Map
            </button>
          </div>

          <RegionRisk
            name="Satara"
            cases="8"
            risk="Critical"
          />

          <RegionRisk
            name="Pune"
            cases="6"
            risk="High"
          />

          <RegionRisk
            name="Nashik"
            cases="5"
            risk="Medium"
          />

          <RegionRisk
            name="Ahmednagar"
            cases="3"
            risk="Low"
          />
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD COMPONENTS
========================================================= */

function HealthRow({
  label,
  value,
  percent,
  type,
}) {
  const colors = {
    healthy: "#16a34a",
    low: "#84cc16",
    medium: "#eab308",
    high: "#f97316",
    critical: "#dc2626",
  };

  return (
    <div style={dashboardStyles.healthRow}>
      <div style={dashboardStyles.healthTop}>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>

      <div style={dashboardStyles.healthTrack}>
        <div
          style={{
            width: percent,
            height: "100%",
            borderRadius: 20,
            background: colors[type],
          }}
        />
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      style={dashboardStyles.quickAction}
      onClick={onClick}
    >
      <div style={dashboardStyles.quickIcon}>
        {icon}
      </div>

      <div style={{ textAlign: "left" }}>
        <strong style={dashboardStyles.quickTitle}>
          {title}
        </strong>

        <span style={dashboardStyles.quickText}>
          {text}
        </span>
      </div>

      <ArrowRight
        size={15}
        style={{ marginLeft: "auto" }}
      />
    </button>
  );
}

function RiskBadge({ risk }) {
  const badgeStyles = {
    Critical: {
      background: "#fee2e2",
      color: "#b91c1c",
    },
    High: {
      background: "#ffedd5",
      color: "#c2410c",
    },
    Medium: {
      background: "#fef3c7",
      color: "#a16207",
    },
    Low: {
      background: "#dcfce7",
      color: "#15803d",
    },
  };

  return (
    <span
      style={{
        ...dashboardStyles.riskBadge,
        ...badgeStyles[risk],
      }}
    >
      {risk}
    </span>
  );
}

function ActivityItem({
  icon,
  title,
  text,
  time,
}) {
  return (
    <div style={dashboardStyles.activityItem}>
      <div style={dashboardStyles.activityIcon}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <strong style={dashboardStyles.activityTitle}>
          {title}
        </strong>

        <span style={dashboardStyles.activityText}>
          {text}
        </span>
      </div>

      <small style={dashboardStyles.activityTime}>
        {time}
      </small>
    </div>
  );
}

function RegionRisk({
  name,
  cases,
  risk,
}) {
  return (
    <div style={dashboardStyles.regionRisk}>
      <div>
        <strong style={dashboardStyles.regionName}>
          {name}
        </strong>

        <span style={dashboardStyles.regionCases}>
          {cases} active cases
        </span>
      </div>

      <RiskBadge risk={risk} />
    </div>
  );
}

function getDashboardIconStyle(type) {
  const values = {
    green: {
      background: "#dcfce7",
      color: "#15803d",
    },
    blue: {
      background: "#dbeafe",
      color: "#2563eb",
    },
    orange: {
      background: "#ffedd5",
      color: "#ea580c",
    },
    red: {
      background: "#fee2e2",
      color: "#dc2626",
    },
  };

  return values[type];
}

/* =========================================================
   APP LAYOUT
========================================================= */

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [profileMenu, setProfileMenu] =
    useState(false);

  const notifications = 6;

  const roleId = localStorage.getItem("pashuRole") || "farm-admin";
  const roleConfig = {
    "farm-admin": { name: t("farmAdmin"), short: "FA", subtitle: "Administrator" },
    "super-admin": { name: t("superAdmin"), short: "SA", subtitle: "System Administrator" },
    veterinarian: { name: t("veterinarian"), short: "VT", subtitle: "Clinical Specialist" },
    staff: { name: t("staff"), short: "ST", subtitle: "Field Operations" },
  }[roleId] || { name: t("farmAdmin"), short: "FA", subtitle: "Administrator" };

  const localizeNav = (items) =>
    items.map((item) => {
      const keyMap = {
        "Dashboard": "dashboard",
        "Animals": "animals",
        "AI Detection": "aiDetection",
        "Disease Map": "diseaseMap",
        "Alerts": "alerts",
        "Notifications": "notifications",
        "Health Records": "healthRecords",
        "Veterinarian": "veterinarian",
        "Laboratory": "laboratory",
        "Vaccination": "vaccination",
        "Treatment": "treatment",
        "Cases": "cases",
        "Outbreaks": "outbreaks",
        "Analytics": "analytics",
        "Administration": "administration",
      };

      return {
        ...item,
        label: t(keyMap[item.label] || item.label),
      };
    });

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={layoutStyles.app}>
      {mobileMenu && (
        <div
          style={layoutStyles.mobileOverlay}
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          ...layoutStyles.sidebar,
          ...(mobileMenu
            ? layoutStyles.sidebarMobile
            : {}),
        }}
      >
        <div style={layoutStyles.brand}>
          <div style={layoutStyles.logo}>
            <Activity size={25} />
          </div>

          <div>
            <strong style={layoutStyles.brandName}>
              Pashu-Rakshak
            </strong>

            <span style={layoutStyles.brandSub}>
              AI Livestock Health
            </span>
          </div>

          <button
            style={layoutStyles.mobileClose}
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <X size={19} />
          </button>
        </div>

        <div style={layoutStyles.sidebarContent}>
          <NavSection
            title="MAIN"
            items={localizeNav(mainNavigation)}
            isActive={isActive}
            closeMenu={() =>
              setMobileMenu(false)
            }
          />

          <NavSection
            title="HEALTH MANAGEMENT"
            items={localizeNav(healthNavigation)}
            isActive={isActive}
            closeMenu={() =>
              setMobileMenu(false)
            }
          />

          <NavSection
            title="INSIGHTS"
            items={localizeNav(insightNavigation)}
            isActive={isActive}
            closeMenu={() =>
              setMobileMenu(false)
            }
          />
        </div>

        <div style={layoutStyles.bottomNav}>
          <NavLink
            to="/profile"
            onClick={() =>
              setMobileMenu(false)
            }
            style={({ isActive }) => ({
              ...layoutStyles.navItem,
              ...(isActive
                ? layoutStyles.navItemActive
                : {}),
            })}
          >
            <UserCircle size={18} />
            <span>{t("profile")}</span>
          </NavLink>

          <NavLink
            to="/help"
            onClick={() =>
              setMobileMenu(false)
            }
            style={({ isActive }) => ({
              ...layoutStyles.navItem,
              ...(isActive
                ? layoutStyles.navItemActive
                : {}),
            })}
          >
            <HelpCircle size={18} />
            <span>{t("helpSupport")}</span>
          </NavLink>

          <button
            style={layoutStyles.logout}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={layoutStyles.main}>
        {/* TOPBAR */}
        <header style={layoutStyles.topbar}>
          <button
            style={layoutStyles.menuButton}
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={21} />
          </button>

          <div style={layoutStyles.breadcrumb}>
            <span>Pashu-Rakshak AI</span>

            <span style={layoutStyles.breadcrumbArrow}>
              /
            </span>

            <strong>
              {t(getPageTitleKey(location.pathname))}
            </strong>
          </div>

          <div style={layoutStyles.topActions}>
            <div style={layoutStyles.languageSelector}>
              <span style={layoutStyles.languageLabel}>{t("language")}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={layoutStyles.languageSelect}
                aria-label={t("language")}
              >
                <option value="en">{t("english")}</option>
                <option value="hi">{t("hindi")}</option>
                <option value="mr">{t("marathi")}</option>
              </select>
            </div>

            <button
              style={layoutStyles.notificationButton}
              onClick={() =>
                navigate("/notifications")
              }
            >
              <Bell size={20} />

              {notifications > 0 && (
                <span
                  style={layoutStyles.notificationDot}
                >
                  {notifications}
                </span>
              )}
            </button>

            <div style={layoutStyles.profileWrapper}>
              <button
                style={layoutStyles.profileButton}
                onClick={() =>
                  setProfileMenu(
                    !profileMenu
                  )
                }
              >
                <div style={layoutStyles.avatar}>
                  {roleConfig.short}
                </div>

                <div style={layoutStyles.profileText}>
                  <strong>{roleConfig.name}</strong>
                  <span>{roleConfig.subtitle}</span>
                </div>

                <ChevronDown size={15} />
              </button>

              {profileMenu && (
                <div
                  style={
                    layoutStyles.profileDropdown
                  }
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenu(false);
                    }}
                    style={
                      layoutStyles.dropdownButton
                    }
                  >
                    <UserCircle size={16} />
                    {t("profile")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/help");
                      setProfileMenu(false);
                    }}
                    style={
                      layoutStyles.dropdownButton
                    }
                  >
                    <HelpCircle size={16} />
                    {t("helpSupport")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/login");
                      setProfileMenu(false);
                    }}
                    style={{
                      ...layoutStyles.dropdownButton,
                      color: "#dc2626",
                    }}
                  >
                    <LogOut size={16} />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={layoutStyles.content}>
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/animals"
              element={<Animals />}
            />

            <Route
              path="/ai-detection"
              element={<AIDetection />}
            />

            <Route
              path="/map"
              element={<SurveillanceMap />}
            />

            <Route
              path="/alerts"
              element={<Alerts />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/records"
              element={<HealthRecords />}
            />

            <Route
              path="/veterinarian"
              element={<Veterinarian />}
            />

            <Route
              path="/staff"
              element={<Staff />}
            />

            <Route
              path="/admin"
              element={<SuperAdmin />}
            />

            <Route
              path="/government-admin"
              element={<Admin />}
            />

            <Route
              path="/laboratory"
              element={<Laboratory />}
            />

            <Route
              path="/vaccination"
              element={<Vaccination />}
            />

            <Route
              path="/treatment"
              element={<Treatment />}
            />

            <Route
              path="/follow-up"
              element={<FollowUp />}
            />

            <Route
              path="/cases"
              element={<Cases />}
            />

            <Route
              path="/outbreaks"
              element={<Outbreaks />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/help"
              element={<Help />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   NAV SECTION
========================================================= */

function NavSection({
  title,
  items,
  isActive,
  closeMenu,
}) {
  return (
    <div style={layoutStyles.navSection}>
      <div style={layoutStyles.sectionTitle}>
        {title}
      </div>

      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            style={{
              ...layoutStyles.navItem,
              ...(active
                ? layoutStyles.navItemActive
                : {}),
            }}
          >
            <Icon size={18} />

            <span>{item.label}</span>

            {item.badge && (
              <span style={layoutStyles.navBadge}>
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage() {
  const [editMode, setEditMode] =
    useState(false);

  const [name, setName] =
    useState("Farm Administrator");

  const [email, setEmail] =
    useState("admin@pashurakshak.ai");

  const [phone, setPhone] =
    useState("+91 98765 43210");

  const [farm, setFarm] =
    useState("Green Valley Dairy Farm");

  const [location, setLocation] =
    useState("Pune, Maharashtra");

  return (
    <div style={profileStyles.page}>
      <div style={profileStyles.header}>
        <div>
          <h1 style={profileStyles.title}>
            My Profile
          </h1>

          <p style={profileStyles.subtitle}>
            Manage your account and farm information.
          </p>
        </div>

        <button
          style={profileStyles.editButton}
          onClick={() =>
            setEditMode(!editMode)
          }
        >
          {editMode
            ? "Save Profile"
            : "Edit Profile"}
        </button>
      </div>

      <div style={profileStyles.grid}>
        <section style={profileStyles.card}>
          <div style={profileStyles.profileTop}>
            <div style={profileStyles.bigAvatar}>
              FA
            </div>

            <div>
              <h2 style={profileStyles.name}>
                {name}
              </h2>

              <p style={profileStyles.role}>
                Farm Administrator
              </p>

              <span style={profileStyles.active}>
                ● Active Account
              </span>
            </div>
          </div>

          <div style={profileStyles.divider} />

          <div style={profileStyles.infoGrid}>
            <InfoField
              label="Email"
              value={email}
              editMode={editMode}
              onChange={setEmail}
            />

            <InfoField
              label="Phone"
              value={phone}
              editMode={editMode}
              onChange={setPhone}
            />

            <InfoField
              label="Farm"
              value={farm}
              editMode={editMode}
              onChange={setFarm}
            />

            <InfoField
              label="Location"
              value={location}
              editMode={editMode}
              onChange={setLocation}
            />
          </div>
        </section>

        <section style={profileStyles.card}>
          <h2 style={profileStyles.cardTitle}>
            Personal Information
          </h2>

          <p style={profileStyles.cardSubtitle}>
            Account details
          </p>

          <div style={profileStyles.field}>
            <label>Full Name</label>

            {editMode ? (
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={profileStyles.input}
              />
            ) : (
              <div style={profileStyles.value}>
                {name}
              </div>
            )}
          </div>

          <div style={profileStyles.field}>
            <label>Role</label>

            <div style={profileStyles.value}>
              Farm Administrator
            </div>
          </div>

          <div style={profileStyles.field}>
            <label>Account Status</label>

            <div>
              <span style={profileStyles.status}>
                Active
              </span>
            </div>
          </div>
        </section>
      </div>

      <section style={profileStyles.card}>
        <div style={profileStyles.securityHeader}>
          <div>
            <h2 style={profileStyles.cardTitle}>
              Account Security
            </h2>

            <p style={profileStyles.cardSubtitle}>
              Keep your account protected.
            </p>
          </div>

          <ShieldCheck
            size={22}
            color="#16a34a"
          />
        </div>

        <div style={profileStyles.securityGrid}>
          <SecurityItem
            title="Password"
            text="Last changed 30 days ago"
            button="Change Password"
          />

          <SecurityItem
            title="Email Verification"
            text="Your email address is verified"
            button="Verified"
          />

          <SecurityItem
            title="Two-Factor Authentication"
            text="Additional account protection"
            button="Enable"
          />
        </div>
      </section>
    </div>
  );
}

function InfoField({
  label,
  value,
  editMode,
  onChange,
}) {
  return (
    <div>
      <label style={profileStyles.label}>
        {label}
      </label>

      {editMode ? (
        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={profileStyles.input}
        />
      ) : (
        <div style={profileStyles.value}>
          {value}
        </div>
      )}
    </div>
  );
}

function SecurityItem({
  title,
  text,
  button,
}) {
  return (
    <div style={profileStyles.securityItem}>
      <strong>{title}</strong>

      <p style={profileStyles.securityText}>
        {text}
      </p>

      <button
        style={profileStyles.securityButton}
      >
        {button}
      </button>
    </div>
  );
}

/* =========================================================
   PAGE TITLE
========================================================= */

function getPageTitleKey(pathname) {
  const titles = {
    "/": "dashboard",
    "/animals": "animals",
    "/ai-detection": "aiDetection",
    "/map": "diseaseMap",
    "/alerts": "alerts",
    "/notifications": "notifications",
    "/records": "healthRecords",
    "/veterinarian": "veterinarian",
    "/staff": "staff",
    "/laboratory": "laboratory",
    "/vaccination": "vaccination",
    "/treatment": "treatment",
    "/cases": "cases",
    "/outbreaks": "outbreaks",
    "/analytics": "analytics",
    "/admin": "superAdmin",
    "/government-admin": "governmentAdmin",
    "/profile": "profile",
    "/help": "helpSupport",
  };

  return titles[pathname] || "dashboard";
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/role-selection"
        element={<RoleSelection />}
      />

      <Route
        path="/*"
        element={<AppLayout />}
      />
    </Routes>
  );
}

/* =========================================================
   DASHBOARD STYLES
========================================================= */

const dashboardStyles = {
  page: {
    width: "100%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 25,
    fontWeight: 800,
    color: "#0f172a",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  periodBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 9,
    padding: "8px 10px",
    color: "#64748b",
  },

  periodSelect: {
    border: 0,
    outline: 0,
    color: "#475569",
    background: "transparent",
    fontSize: 11,
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
    gap: 12,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 17,
  },

  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    color: "#64748b",
    fontSize: 11,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0f172a",
    marginTop: 2,
  },

  statBottom: {
    display: "flex",
    gap: 5,
    fontSize: 9,
    marginTop: 2,
    color: "#94a3b8",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.2fr) minmax(330px, 1fr)",
    gap: 18,
    marginBottom: 18,
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 20,
    marginBottom: 18,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: "#0f172a",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  healthRows: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  healthRow: {
    width: "100%",
  },

  healthTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 11,
    color: "#475569",
  },

  healthTrack: {
    width: "100%",
    height: 7,
    borderRadius: 20,
    background: "#f1f5f9",
    overflow: "hidden",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },

  quickAction: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 10,
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
    color: "#334155",
  },

  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  quickTitle: {
    display: "block",
    fontSize: 11,
  },

  quickText: {
    display: "block",
    marginTop: 2,
    color: "#94a3b8",
    fontSize: 9,
  },

  caseTable: {
    width: "100%",
    overflowX: "auto",
  },

  caseHeader: {
    display: "grid",
    gridTemplateColumns:
      "100px 160px 1fr 100px 100px 90px",
    gap: 10,
    minWidth: 700,
    padding: "10px 12px",
    background: "#f8fafc",
    color: "#94a3b8",
    fontSize: 9,
    textTransform: "uppercase",
    fontWeight: 800,
  },

  caseRow: {
    display: "grid",
    gridTemplateColumns:
      "100px 160px 1fr 100px 100px 90px",
    gap: 10,
    minWidth: 700,
    alignItems: "center",
    padding: "13px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
    fontSize: 11,
  },

  smallText: {
    display: "block",
    color: "#94a3b8",
    fontSize: 9,
    marginTop: 2,
  },

  time: {
    color: "#94a3b8",
  },

  riskBadge: {
    display: "inline-flex",
    width: "fit-content",
    padding: "5px 8px",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 800,
  },

  viewAll: {
    border: 0,
    background: "transparent",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.2fr) minmax(330px, 1fr)",
    gap: 18,
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  activityTitle: {
    display: "block",
    fontSize: 11,
  },

  activityText: {
    display: "block",
    color: "#94a3b8",
    fontSize: 9,
    marginTop: 2,
  },

  activityTime: {
    color: "#94a3b8",
    fontSize: 9,
  },

  regionRisk: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  regionName: {
    display: "block",
    fontSize: 12,
  },

  regionCases: {
    display: "block",
    color: "#94a3b8",
    fontSize: 9,
    marginTop: 3,
  },

  smallButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 7,
    padding: "7px 10px",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  },
};

/* =========================================================
   LAYOUT STYLES
========================================================= */

const layoutStyles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    color: "#0f172a",
  },

  sidebar: {
    width: 264,
    background: "#fff",
    borderRight: "1px solid #e2e8f0",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
  },

  sidebarMobile: {
    transform: "translateX(0)",
  },

  mobileOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.4)",
    zIndex: 190,
  },

  brand: {
    height: 76,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 18px",
    borderBottom: "1px solid #f1f5f9",
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#16a34a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    display: "block",
    fontSize: 14,
  },

  brandSub: {
    display: "block",
    color: "#94a3b8",
    fontSize: 9,
    marginTop: 2,
  },

  mobileClose: {
    display: "none",
    marginLeft: "auto",
    border: 0,
    background: "transparent",
    cursor: "pointer",
  },

  sidebarContent: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 10px",
  },

  navSection: {
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: 800,
    padding: "8px 10px",
    letterSpacing: "0.05em",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "10px 12px",
    marginBottom: 3,
    borderRadius: 9,
    textDecoration: "none",
    color: "#475569",
    fontSize: 12,
    fontWeight: 500,
  },

  navItemActive: {
    background: "#dcfce7",
    color: "#15803d",
    fontWeight: 800,
  },

  navBadge: {
    marginLeft: "auto",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 9,
    fontWeight: 800,
  },

  bottomNav: {
    padding: "10px",
    borderTop: "1px solid #f1f5f9",
  },

  logout: {
    width: "100%",
    border: 0,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "10px 12px",
    borderRadius: 9,
    color: "#dc2626",
    cursor: "pointer",
    fontSize: 12,
  },

  main: {
    marginLeft: 264,
    width: "calc(100% - 264px)",
    minHeight: "100vh",
  },

  topbar: {
    height: 76,
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  menuButton: {
    display: "none",
    border: 0,
    background: "transparent",
    cursor: "pointer",
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#94a3b8",
    fontSize: 11,
  },

  breadcrumbArrow: {
    color: "#cbd5e1",
  },

  topActions: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  languageSelector: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 9,
    padding: "6px 8px",
  },

  languageLabel: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: 700,
  },

  languageSelect: {
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#334155",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  notificationButton: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  notificationDot: {
    position: "absolute",
    right: -4,
    top: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 20,
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 8,
    fontWeight: 800,
    border: "2px solid #fff",
  },

  profileWrapper: {
    position: "relative",
  },

  profileButton: {
    border: 0,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
  },

  profileText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  profileDropdown: {
    position: "absolute",
    right: 0,
    top: 48,
    width: 190,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.12)",
    padding: 6,
    zIndex: 300,
  },

  dropdownButton: {
    width: "100%",
    border: 0,
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 10px",
    borderRadius: 7,
    cursor: "pointer",
    color: "#475569",
    fontSize: 11,
    textAlign: "left",
  },

  content: {
    padding: 24,
    maxWidth: 1700,
    margin: "0 auto",
  },
};

/* =========================================================
   PROFILE STYLES
========================================================= */

const profileStyles = {
  page: {
    width: "100%",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 25,
    fontWeight: 800,
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  editButton: {
    border: 0,
    background: "#16a34a",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.3fr) minmax(300px, 1fr)",
    gap: 18,
    marginBottom: 0,
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 20,
    marginBottom: 18,
  },

  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  bigAvatar: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 800,
  },

  name: {
    margin: 0,
    fontSize: 18,
  },

  role: {
    margin: "4px 0",
    color: "#64748b",
    fontSize: 11,
  },

  active: {
    color: "#15803d",
    fontSize: 10,
    fontWeight: 700,
  },

  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "20px 0",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },

  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: 10,
    marginBottom: 5,
  },

  value: {
    fontSize: 12,
    fontWeight: 600,
    color: "#334155",
  },

  cardTitle: {
    margin: 0,
    fontSize: 16,
  },

  cardSubtitle: {
    margin: "4px 0 18px",
    color: "#94a3b8",
    fontSize: 11,
  },

  field: {
    marginBottom: 15,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "0 10px",
    outline: 0,
  },

  status: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: 999,
    background: "#dcfce7",
    color: "#15803d",
    fontSize: 10,
    fontWeight: 700,
  },

  securityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  securityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },

  /* ONLY ONE securityItem */
  securityItem: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 14,
  },

  securityText: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 10,
    lineHeight: 1.5,
  },

  securityButton: {
    marginTop: 10,
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 7,
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
  },
};

/* =========================================================
   RENDER
========================================================= */

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);