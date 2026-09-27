import React, { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit3,
  Filter,
  HeartPulse,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Stethoscope,
  X,
} from "lucide-react";

const EMPTY_FORM = {
  name: "",
  species: "Cow",
  breed: "",
  age: "",
  gender: "Female",
  village: "",
  health_status: "Healthy",
};

const RISK = ["Healthy", "Observation", "High Risk", "Critical"];

export default function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.animals.list();
      setAnimals(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message || "Unable to load animals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return animals.filter((animal) => {
      const status = animal.health_status || "Healthy";
      const filterMatch =
        healthFilter === "All" || status === healthFilter;
      const searchMatch =
        !q ||
        [
          animal.name,
          animal.species,
          animal.breed,
          animal.village,
          animal.gender,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return filterMatch && searchMatch;
    });
  }, [animals, search, healthFilter]);

  const stats = useMemo(() => {
    const healthy = animals.filter(
      (a) => (a.health_status || "Healthy") === "Healthy"
    ).length;
    const observation = animals.filter(
      (a) => (a.health_status || "Healthy") === "Observation"
    ).length;
    const highRisk = animals.filter((a) =>
      ["High Risk", "Critical"].includes(a.health_status)
    ).length;
    return { total: animals.length, healthy, observation, highRisk };
  }, [animals]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (animal) => {
    setEditingId(animal.id);
    setForm({
      name: animal.name || "",
      species: animal.species || "Cow",
      breed: animal.breed || "",
      age: animal.age ?? "",
      gender: animal.gender || "Female",
      village: animal.village || "",
      health_status: animal.health_status || "Healthy",
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.species.trim()) {
      setError("Animal name and species are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed.trim() || null,
        age: form.age === "" ? null : Number(form.age),
        gender: form.gender || null,
        village: form.village.trim() || null,
        health_status: form.health_status,
      };

      if (editingId) {
        await api.animals.update(editingId, payload);
        setNotice("Animal updated successfully.");
      } else {
        await api.animals.create(payload);
        setNotice("Animal added to MongoDB successfully.");
      }

      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadAnimals();
    } catch (err) {
      setError(err.message || "Unable to save animal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <span style={styles.eyebrow}>LIVESTOCK MANAGEMENT</span>
          <h1 style={styles.title}>Animals</h1>
          <p style={styles.subtitle}>
            Live animal records stored in your PASHU-RAKSHAK AI database.
          </p>
        </div>

        <button style={styles.primary} onClick={openCreate}>
          <Plus size={17} />
          Add Animal
        </button>
      </header>

      {notice && (
        <Banner tone="success" onClose={() => setNotice("")}>
          {notice}
        </Banner>
      )}
      {error && (
        <Banner tone="error" onClose={() => setError("")}>
          {error}
        </Banner>
      )}

      <div style={styles.kpiGrid}>
        <Kpi icon={Activity} label="Total Animals" value={stats.total} />
        <Kpi icon={CheckCircle2} label="Healthy" value={stats.healthy} />
        <Kpi icon={HeartPulse} label="Observation" value={stats.observation} />
        <Kpi icon={ShieldAlert} label="High Risk / Critical" value={stats.highRisk} danger />
      </div>

      <section style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={17} color="#94a3b8" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search animal, breed, village..."
            style={styles.input}
          />
        </div>

        <div style={styles.filterWrap}>
          <Filter size={16} color="#64748b" />
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            style={styles.select}
          >
            <option>All</option>
            {RISK.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.sectionHead}>
          <div>
            <h2 style={styles.sectionTitle}>Animal Registry</h2>
            <p style={styles.sectionSub}>{filtered.length} records shown</p>
          </div>
          <button style={styles.ghost} onClick={loadAnimals}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <Loader2 size={23} style={{ animation: "spin 1s linear infinite" }} />
            Loading animals...
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <HeartPulse size={34} color="#94a3b8" />
            <h3 style={styles.emptyTitle}>No animals found</h3>
            <p style={styles.emptyText}>
              Add your first animal and it will be saved in MongoDB.
            </p>
            <button style={styles.primary} onClick={openCreate}>
              <Plus size={17} />
              Add Animal
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((animal) => (
              <article key={animal.id} style={styles.animalCard}>
                <div style={styles.animalTop}>
                  <div style={styles.avatar}>
                    {String(animal.name || "?").slice(0, 1).toUpperCase()}
                  </div>
                  <button
                    type="button"
                    style={styles.iconButton}
                    onClick={() => openEdit(animal)}
                    title="Edit animal"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>

                <h3 style={styles.animalName}>{animal.name}</h3>
                <p style={styles.species}>
                  {animal.species}
                  {animal.breed ? ` • ${animal.breed}` : ""}
                </p>

                <div style={styles.metaRow}>
                  <Tag icon={Calendar} text={animal.age != null ? `${animal.age} yrs` : "Age —"} />
                  <Tag icon={Stethoscope} text={animal.gender || "Gender —"} />
                </div>

                <div style={styles.metaRow}>
                  <Tag icon={MapPin} text={animal.village || "Location —"} />
                </div>

                <div style={styles.statusRow}>
                  <span style={statusStyle(animal.health_status)}>
                    {animal.health_status || "Healthy"}
                  </span>
                  <span style={styles.idText}>
                    ID {String(animal.id).slice(-6).toUpperCase()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHead}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editingId ? "Edit Animal" : "Add Animal"}
                </h2>
                <p style={styles.modalSub}>
                  Save the record directly to the backend database.
                </p>
              </div>
              <button style={styles.iconButton} onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit}>
              <div style={styles.formGrid}>
                <Field label="Animal Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Gauri"
                    style={styles.formInput}
                  />
                </Field>
                <Field label="Species">
                  <input
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    placeholder="Cow"
                    style={styles.formInput}
                  />
                </Field>
                <Field label="Breed">
                  <input
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    placeholder="Gir"
                    style={styles.formInput}
                  />
                </Field>
                <Field label="Age">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="4"
                    style={styles.formInput}
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    style={styles.formInput}
                  >
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </Field>
                <Field label="Village / Location">
                  <input
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                    placeholder="Palghar"
                    style={styles.formInput}
                  />
                </Field>
                <Field label="Health Status">
                  <select
                    value={form.health_status}
                    onChange={(e) => setForm({ ...form, health_status: e.target.value })}
                    style={styles.formInput}
                  >
                    {RISK.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.ghost}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primary} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {editingId ? "Save Changes" : "Add Animal"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .animal-page-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .animal-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .animal-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, danger = false }) {
  return (
    <div style={styles.kpi}>
      <div style={{ ...styles.kpiIcon, ...(danger ? styles.kpiDanger : {}) }}>
        <Icon size={19} />
      </div>
      <div>
        <div style={styles.kpiValue}>{value}</div>
        <div style={styles.kpiLabel}>{label}</div>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, text }) {
  return (
    <span style={styles.tag}>
      <Icon size={13} />
      {text}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function Banner({ tone, onClose, children }) {
  const success = tone === "success";
  return (
    <div
      style={{
        ...styles.banner,
        ...(success ? styles.bannerSuccess : styles.bannerError),
      }}
    >
      {success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      <span style={{ flex: 1 }}>{children}</span>
      <button style={styles.closeBanner} onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

function statusStyle(status = "Healthy") {
  const map = {
    Healthy: { background: "#ecfdf5", color: "#047857", border: "1px solid #bbf7d0" },
    Observation: { background: "#fffbeb", color: "#a16207", border: "1px solid #fde68a" },
    "High Risk": { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" },
    Critical: { background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" },
  };
  return {
    ...styles.status,
    ...(map[status] || map.Healthy),
  };
}

const styles = {
  page: { minHeight: "100vh", background: "#f5f8f6", padding: "28px 30px", color: "#0f172a", fontFamily: "Inter,system-ui,sans-serif" },
  header: { maxWidth: 1200, margin: "0 auto 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 },
  eyebrow: { display: "inline-block", fontSize: 11, fontWeight: 900, letterSpacing: "1px", color: "#059669", marginBottom: 7 },
  title: { margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: "-1px" },
  subtitle: { margin: "7px 0 0", fontSize: 13, color: "#64748b" },
  primary: { border: 0, background: "#059669", color: "#fff", borderRadius: 12, padding: "11px 15px", display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 850, cursor: "pointer", boxShadow: "0 8px 22px rgba(5,150,105,.18)" },
  ghost: { border: "1px solid #dbe5df", background: "#fff", color: "#334155", borderRadius: 11, padding: "10px 13px", fontSize: 11, fontWeight: 800, cursor: "pointer" },
  banner: { maxWidth: 1200, margin: "0 auto 15px", borderRadius: 14, padding: "11px 13px", display: "flex", alignItems: "center", gap: 9, fontSize: 12, fontWeight: 700 },
  bannerSuccess: { background: "#ecfdf5", border: "1px solid #bbf7d0", color: "#166534" },
  bannerError: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" },
  closeBanner: { border: 0, background: "transparent", cursor: "pointer", color: "currentColor" },
  kpiGrid: { maxWidth: 1200, margin: "0 auto 18px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 13 },
  kpi: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 17, padding: 14, display: "flex", alignItems: "center", gap: 11, boxShadow: "0 8px 22px rgba(15,23,42,.04)" },
  kpiIcon: { width: 40, height: 40, borderRadius: 12, background: "#ecfdf5", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center" },
  kpiDanger: { background: "#fef2f2", color: "#dc2626" },
  kpiValue: { fontSize: 24, fontWeight: 900 },
  kpiLabel: { marginTop: 2, color: "#64748b", fontSize: 10, fontWeight: 800 },
  toolbar: { maxWidth: 1200, margin: "0 auto 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 17, padding: 12, display: "flex", gap: 9, justifyContent: "space-between" },
  searchWrap: { flex: 1, maxWidth: 560, display: "flex", alignItems: "center", gap: 8, padding: "0 11px", border: "1px solid #e2e8f0", borderRadius: 11, background: "#f8fafc" },
  input: { width: "100%", border: 0, outline: 0, background: "transparent", padding: "10px 0", fontSize: 12 },
  filterWrap: { display: "flex", alignItems: "center", gap: 7, border: "1px solid #e2e8f0", borderRadius: 11, padding: "0 10px", background: "#f8fafc" },
  select: { border: 0, outline: 0, background: "transparent", padding: "10px 3px", fontSize: 12, fontWeight: 700, color: "#334155" },
  card: { maxWidth: 1200, margin: "0 auto", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 17, boxShadow: "0 10px 30px rgba(15,23,42,.04)" },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 },
  sectionTitle: { margin: 0, fontSize: 17, fontWeight: 900 },
  sectionSub: { margin: "3px 0 0", fontSize: 10, color: "#94a3b8" },
  loading: { minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#64748b", fontSize: 12, fontWeight: 700 },
  empty: { minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 8 },
  emptyTitle: { margin: 0, fontSize: 15, fontWeight: 900 },
  emptyText: { margin: 0, maxWidth: 420, fontSize: 11, lineHeight: 1.6, color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 13 },
  animalCard: { border: "1px solid #e2e8f0", borderRadius: 17, padding: 15, background: "#fbfdfc" },
  animalTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  avatar: { width: 42, height: 42, borderRadius: 13, background: "#ecfdf5", color: "#047857", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 },
  iconButton: { width: 33, height: 33, border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", color: "#64748b", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  animalName: { margin: "13px 0 4px", fontSize: 17, fontWeight: 900 },
  species: { margin: 0, fontSize: 11, color: "#64748b", fontWeight: 700 },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 },
  tag: { display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 8px", borderRadius: 9, background: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 700 },
  statusRow: { marginTop: 14, paddingTop: 12, borderTop: "1px solid #edf2ef", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  status: { display: "inline-flex", padding: "6px 8px", borderRadius: 999, fontSize: 9, fontWeight: 900 },
  idText: { fontSize: 9, color: "#94a3b8", fontWeight: 800 },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,.48)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 15, zIndex: 1000 },
  modal: { width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 22, boxShadow: "0 30px 80px rgba(15,23,42,.22)" },
  modalHead: { display: "flex", justifyContent: "space-between", gap: 15, padding: "18px 19px", borderBottom: "1px solid #e2e8f0" },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 900 },
  modalSub: { margin: "4px 0 0", color: "#64748b", fontSize: 10 },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 13, padding: 19 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 10, color: "#475569", fontWeight: 800 },
  formInput: { width: "100%", boxSizing: "border-box", border: "1px solid #dbe5df", borderRadius: 10, padding: "10px 11px", outline: 0, fontSize: 11, background: "#fbfdfc" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 19px 19px" },
};
