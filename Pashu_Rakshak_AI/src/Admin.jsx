import React, { useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  Activity,
  Search,
  Plus,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Settings,
  BarChart3,
  MapPinned,
  Bell,
  X,
  CheckCircle2,
  Building2,
  Stethoscope,
} from "lucide-react";

export default function Admin() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Mehta",
      email: "mehta@pashurakshak.ai",
      role: "Veterinarian",
      location: "Satara",
      status: "Active",
    },
    {
      id: 2,
      name: "Farm Admin",
      email: "admin@greenvalley.ai",
      role: "Farm Admin",
      location: "Pune",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Patil",
      email: "patil@pashurakshak.ai",
      role: "Veterinarian",
      location: "Nashik",
      status: "Active",
    },
    {
      id: 4,
      name: "Regional Officer",
      email: "officer@maha.gov.in",
      role: "Government",
      location: "Mumbai",
      status: "Active",
    },
    {
      id: 5,
      name: "Farm Manager",
      email: "manager@dairyfarm.ai",
      role: "Farm Admin",
      location: "Ahmednagar",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Farm Admin",
    location: "",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText =
        `${user.name} ${user.email} ${user.location}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const veterinarians = users.filter(
    (user) => user.role === "Veterinarian"
  ).length;

  const farmAdmins = users.filter(
    (user) => user.role === "Farm Admin"
  ).length;

  const toggleStatus = (id) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((current) =>
      current.filter((user) => user.id !== id)
    );
    setSelectedUser(null);
  };

  const addUser = (event) => {
    event.preventDefault();

    if (
      !newUser.name.trim() ||
      !newUser.email.trim() ||
      !newUser.location.trim()
    ) {
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      location: newUser.location,
      status: "Active",
    };

    setUsers((current) => [...current, user]);

    setNewUser({
      name: "",
      email: "",
      role: "Farm Admin",
      location: "",
    });

    setShowAdd(false);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.pageHeader}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 style={styles.title}>
              Administration
            </h1>

            <p style={styles.subtitle}>
              Manage users, system monitoring and livestock
              health operations.
            </p>
          </div>
        </div>

        <button
          style={styles.primaryButton}
          onClick={() => setShowAdd(true)}
        >
          <Plus size={17} />
          Add User
        </button>
      </div>

      {/* SYSTEM STATUS */}
      <div style={styles.statusBanner}>
        <div style={styles.statusLeft}>
          <div style={styles.statusIcon}>
            <Activity size={22} />
          </div>

          <div>
            <strong style={styles.statusTitle}>
              System Operational
            </strong>

            <p style={styles.statusText}>
              All Pashu-Rakshak AI monitoring services are
              currently active.
            </p>
          </div>
        </div>

        <div style={styles.live}>
          <span style={styles.liveDot}></span>
          LIVE
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={<Users size={22} />}
          title="Total Users"
          value={users.length}
          description="Registered users"
          type="blue"
        />

        <StatCard
          icon={<UserCheck size={22} />}
          title="Active Users"
          value={activeUsers}
          description="Currently active"
          type="green"
        />

        <StatCard
          icon={<Stethoscope size={22} />}
          title="Veterinarians"
          value={veterinarians}
          description="Clinical users"
          type="purple"
        />

        <StatCard
          icon={<Building2 size={22} />}
          title="Farm Admins"
          value={farmAdmins}
          description="Farm managers"
          type="orange"
        />
      </div>

      {/* OVERVIEW */}
      <div style={styles.overviewGrid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                System Overview
              </h2>

              <p style={styles.cardSubtitle}>
                Current platform activity
              </p>
            </div>

            <BarChart3
              size={21}
              color="#2563eb"
            />
          </div>

          <div style={styles.overviewRows}>
            <OverviewRow
              label="Animals Registered"
              value="1,842"
              percent="88%"
            />

            <OverviewRow
              label="Active Health Cases"
              value="24"
              percent="42%"
            />

            <OverviewRow
              label="AI Screenings"
              value="1,526"
              percent="76%"
            />

            <OverviewRow
              label="Vaccination Coverage"
              value="86%"
              percent="86%"
            />
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Regional Monitoring
              </h2>

              <p style={styles.cardSubtitle}>
                Disease surveillance status
              </p>
            </div>

            <MapPinned
              size={21}
              color="#16a34a"
            />
          </div>

          <div style={styles.regionList}>
            <Region
              name="Satara"
              cases="8"
              risk="Critical"
            />

            <Region
              name="Pune"
              cases="6"
              risk="High"
            />

            <Region
              name="Nashik"
              cases="5"
              risk="Medium"
            />

            <Region
              name="Ahmednagar"
              cases="3"
              risk="Low"
            />

            <Region
              name="Solapur"
              cases="2"
              risk="Low"
            />
          </div>
        </section>
      </div>

      {/* USER MANAGEMENT */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              User Management
            </h2>

            <p style={styles.cardSubtitle}>
              Manage platform users and access
            </p>
          </div>
        </div>

        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <Search
              size={18}
              color="#94a3b8"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name, email or location..."
              style={styles.searchInput}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">All roles</option>
            <option value="Farm Admin">
              Farm Admin
            </option>
            <option value="Veterinarian">
              Veterinarian
            </option>
            <option value="Government">
              Government
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={styles.select}
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <strong style={styles.userName}>
                          {user.name}
                        </strong>

                        <span style={styles.userEmail}>
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <RoleBadge role={user.role} />
                  </td>

                  <td>{user.location}</td>

                  <td>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(user.status === "Active"
                          ? styles.activeBadge
                          : styles.inactiveBadge),
                      }}
                    >
                      {user.status === "Active" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <UserX size={12} />
                      )}

                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div style={styles.actions}>
                      <button
                        style={styles.viewButton}
                        onClick={() =>
                          setSelectedUser(user)
                        }
                      >
                        <Edit3 size={14} />
                        View
                      </button>

                      <button
                        style={styles.actionButton}
                        onClick={() =>
                          toggleStatus(user.id)
                        }
                      >
                        {user.status === "Active" ? (
                          <UserX size={15} />
                        ) : (
                          <UserCheck size={15} />
                        )}
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteUser(user.id)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={styles.empty}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SETTINGS */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              System Settings
            </h2>

            <p style={styles.cardSubtitle}>
              Platform configuration
            </p>
          </div>

          <Settings
            size={21}
            color="#64748b"
          />
        </div>

        <div style={styles.settingsGrid}>
          <SettingCard
            icon={<Bell size={20} />}
            title="Critical Alerts"
            text="Immediate alerts for critical livestock cases."
          />

          <SettingCard
            icon={<ShieldCheck size={20} />}
            title="AI Screening"
            text="AI-assisted health screening is enabled."
          />

          <SettingCard
            icon={<MapPinned size={20} />}
            title="Disease Surveillance"
            text="Regional disease intelligence is enabled."
          />

          <SettingCard
            icon={<Activity size={20} />}
            title="System Monitoring"
            text="Platform health monitoring is active."
          />
        </div>
      </section>

      {/* USER MODAL */}
      {selectedUser && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  User Details
                </h2>

                <p style={styles.modalSubtitle}>
                  Account information
                </p>
              </div>

              <button
                style={styles.closeButton}
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div style={styles.detailProfile}>
              <div style={styles.bigAvatar}>
                {getInitials(selectedUser.name)}
              </div>

              <div>
                <h3 style={{ margin: 0 }}>
                  {selectedUser.name}
                </h3>

                <p style={styles.detailEmail}>
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <Detail
                label="Role"
                value={selectedUser.role}
              />

              <Detail
                label="Location"
                value={selectedUser.location}
              />

              <Detail
                label="Status"
                value={selectedUser.status}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.secondaryButton}
                onClick={() =>
                  toggleStatus(selectedUser.id)
                }
              >
                {selectedUser.status === "Active"
                  ? "Deactivate User"
                  : "Activate User"}
              </button>

              <button
                style={styles.dangerButton}
                onClick={() =>
                  deleteUser(selectedUser.id)
                }
              >
                <Trash2 size={15} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER */}
      {showAdd && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowAdd(false)}
        >
          <form
            style={styles.modal}
            onSubmit={addUser}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  Add New User
                </h2>

                <p style={styles.modalSubtitle}>
                  Create a platform account
                </p>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={() =>
                  setShowAdd(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div style={styles.formGrid}>
              <label style={styles.field}>
                <span>Name</span>

                <input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span>Email</span>

                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter email"
                  style={styles.input}
                />
              </label>

              <label style={styles.field}>
                <span>Role</span>

                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  <option>Farm Admin</option>
                  <option>Veterinarian</option>
                  <option>Government</option>
                </select>
              </label>

              <label style={styles.field}>
                <span>Location</span>

                <input
                  value={newUser.location}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter location"
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() =>
                  setShowAdd(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.primaryButton}
              >
                <Plus size={16} />
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  const colors = {
    blue: {
      color: "#2563eb",
      background: "#eff6ff",
    },
    green: {
      color: "#16a34a",
      background: "#f0fdf4",
    },
    purple: {
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    orange: {
      color: "#ea580c",
      background: "#fff7ed",
    },
  };

  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          background: colors[type].background,
          color: colors[type].color,
        }}
      >
        {icon}
      </div>

      <div>
        <div style={styles.statTitle}>
          {title}
        </div>

        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statDescription}>
          {description}
        </div>
      </div>
    </div>
  );
}

function OverviewRow({
  label,
  value,
  percent,
}) {
  return (
    <div style={styles.overviewRow}>
      <div style={styles.overviewTop}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progress,
            width: percent,
          }}
        />
      </div>
    </div>
  );
}

function Region({
  name,
  cases,
  risk,
}) {
  const riskColors = {
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
    <div style={styles.region}>
      <div>
        <strong>{name}</strong>

        <span style={styles.regionCases}>
          {cases} active cases
        </span>
      </div>

      <span
        style={{
          ...styles.riskBadge,
          ...riskColors[risk],
        }}
      >
        {risk}
      </span>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    "Farm Admin": {
      background: "#dcfce7",
      color: "#15803d",
    },
    Veterinarian: {
      background: "#dbeafe",
      color: "#1d4ed8",
    },
    Government: {
      background: "#ede9fe",
      color: "#6d28d9",
    },
  };

  return (
    <span
      style={{
        ...styles.roleBadge,
        ...colors[role],
      }}
    >
      {role}
    </span>
  );
}

function SettingCard({
  icon,
  title,
  text,
}) {
  return (
    <div style={styles.settingCard}>
      <div style={styles.settingIcon}>
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <strong>{title}</strong>

        <p style={styles.settingText}>
          {text}
        </p>
      </div>

      <div style={styles.toggle}>
        <div style={styles.toggleCircle}></div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong style={styles.detailValue}>
        {value}
      </strong>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    width: "100%",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  titleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  primaryButton: {
    border: 0,
    background: "#16a34a",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  },

  statusBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    marginBottom: 18,
  },

  statusLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statusTitle: {
    color: "#166534",
    fontSize: 13,
  },

  statusText: {
    margin: "3px 0 0",
    color: "#4d7c0f",
    fontSize: 11,
  },

  live: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#15803d",
    fontSize: 10,
    fontWeight: 800,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 18,
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 17,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    fontSize: 11,
    color: "#64748b",
  },

  statValue: {
    fontSize: 23,
    fontWeight: 800,
    marginTop: 2,
  },

  statDescription: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.4fr) minmax(320px, 1fr)",
    gap: 18,
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
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  overviewRows: {
    display: "flex",
    flexDirection: "column",
    gap: 17,
  },

  overviewRow: {
    width: "100%",
  },

  overviewTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#475569",
    marginBottom: 7,
  },

  progressTrack: {
    height: 7,
    borderRadius: 20,
    background: "#f1f5f9",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    background: "#16a34a",
    borderRadius: 20,
  },

  regionList: {
    display: "flex",
    flexDirection: "column",
  },

  region: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  regionCases: {
    display: "block",
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 3,
  },

  riskBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "minmax(250px, 1fr) 170px 170px",
    gap: 10,
    marginBottom: 15,
  },

  searchBox: {
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 11px",
  },

  searchInput: {
    width: "100%",
    border: 0,
    outline: 0,
    fontSize: 12,
  },

  select: {
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "0 10px",
    background: "#fff",
    color: "#475569",
    outline: 0,
    fontSize: 12,
  },

  tableWrap: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
    minWidth: 750,
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
  },

  userName: {
    display: "block",
  },

  userEmail: {
    display: "block",
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 2,
  },

  roleBadge: {
    display: "inline-flex",
    padding: "5px 8px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 8px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#15803d",
  },

  inactiveBadge: {
    background: "#f1f5f9",
    color: "#64748b",
  },

  actions: {
    display: "flex",
    gap: 5,
  },

  viewButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 7,
    padding: "7px 9px",
    display: "flex",
    alignItems: "center",
    gap: 5,
    cursor: "pointer",
    fontSize: 11,
  },

  actionButton: {
    width: 30,
    height: 30,
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  deleteButton: {
    width: 30,
    height: 30,
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: 30,
    color: "#94a3b8",
  },

  settingsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },

  settingCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 13,
    display: "flex",
    alignItems: "center",
    gap: 11,
  },

  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    background: "#f1f5f9",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  settingText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: 10,
  },

  toggle: {
    width: 34,
    height: 19,
    borderRadius: 20,
    background: "#16a34a",
    padding: 2,
    display: "flex",
    justifyContent: "flex-end",
  },

  toggleCircle: {
    width: 15,
    height: 15,
    borderRadius: "50%",
    background: "#fff",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 500,
  },

  modal: {
    width: "100%",
    maxWidth: 600,
    background: "#fff",
    borderRadius: 15,
    padding: 22,
    boxShadow:
      "0 25px 70px rgba(15,23,42,0.22)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  modalTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 800,
  },

  modalSubtitle: {
    margin: "4px 0 0",
    fontSize: 11,
    color: "#94a3b8",
  },

  closeButton: {
    width: 34,
    height: 34,
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  detailProfile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 13,
    background: "#f8fafc",
    borderRadius: 10,
    marginBottom: 17,
  },

  bigAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },

  detailEmail: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: 11,
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: 15,
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 10,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 12,
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 9,
    marginTop: 22,
  },

  secondaryButton: {
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#475569",
    padding: "9px 13px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
  },

  dangerButton: {
    border: 0,
    background: "#dc2626",
    color: "#fff",
    padding: "9px 13px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 11,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#475569",
    fontSize: 11,
    fontWeight: 700,
  },

  input: {
    height: 40,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "0 10px",
    outline: 0,
    background: "#fff",
    color: "#0f172a",
  },
};