import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  Search,
  Syringe,
} from "lucide-react";
import api from "./api";

const pageStyle = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "20px 0 50px",
};

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
};

const buttonStyle = {
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  outline: "none",
  background: "#ffffff",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 800,
  color: "#475569",
  marginBottom: 6,
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export default function Vaccination() {
  const [items, setItems] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    animal_id: "",
    vaccine: "",
    date: new Date().toISOString().slice(0, 10),
    next_due_date: "",
    status: "Scheduled",
  });

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [vaccinationResponse, animalResponse] = await Promise.all([
        api.vaccinations.list(),
        api.animals.list(),
      ]);

      setItems(vaccinationResponse?.items || []);
      setAnimals(animalResponse?.items || []);
    } catch (err) {
      setError(
        err?.message || "Unable to load vaccination records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) {
      return items;
    }

    return items.filter((item) => {
      const animal = animals.find(
        (animalItem) => animalItem.id === item.animal_id
      );

      const text = [
        item?.vaccine,
        item?.status,
        item?.animal_id,
        animal?.name,
        animal?.species,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [items, animals, search]);

  const totalCount = items.length;

  const completedCount = items.filter(
    (item) => item.status === "Completed"
  ).length;

  const scheduledCount = items.filter(
    (item) => item.status !== "Completed"
  ).length;

  const dueDateCount = items.filter(
    (item) => item.next_due_date
  ).length;

  function getAnimalName(animalId) {
    const animal = animals.find(
      (item) => item.id === animalId
    );

    if (!animal) {
      return "Unknown Animal";
    }

    return animal.name || animal.tag_id || "Animal";
  }

  function resetForm() {
    setForm({
      animal_id: "",
      vaccine: "",
      date: new Date().toISOString().slice(0, 10),
      next_due_date: "",
      status: "Scheduled",
    });
  }

  async function handleSave() {
    if (!form.animal_id) {
      setError("Please select an animal.");
      return;
    }

    if (!form.vaccine.trim()) {
      setError("Please enter the vaccine name.");
      return;
    }

    if (!form.date) {
      setError("Please select the vaccination date.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.vaccinations.create({
        animal_id: form.animal_id,
        vaccine: form.vaccine.trim(),
        date: form.date,
        next_due_date: form.next_due_date || null,
        status: form.status,
      });

      setSuccess("Vaccination record saved successfully.");
      setOpen(false);
      resetForm();

      await loadData();
    } catch (err) {
      setError(
        err?.message || "Unable to save vaccination record."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(id) {
    setError("");
    setSuccess("");

    try {
      await api.vaccinations.update(id, {
        status: "Completed",
      });

      setSuccess("Vaccination marked as completed.");
      await loadData();
    } catch (err) {
      setError(
        err?.message || "Unable to update vaccination."
      );
    }
  }

  return (
    <div style={pageStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: "#ecfeff",
                color: "#0f766e",
              }}
            >
              <Syringe size={21} />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                Vaccination Center
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Manage vaccination history, schedules and due dates.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setSuccess("");
            setOpen(true);
          }}
          style={{
            ...buttonStyle,
            background: "#0f766e",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Plus size={17} />
          Add Vaccination
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Total Records
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {totalCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Completed
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 900,
              color: "#15803d",
            }}
          >
            {completedCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Scheduled
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 900,
              color: "#b45309",
            }}
          >
            {scheduledCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Due Dates
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 900,
              color: "#2563eb",
            }}
          >
            {dueDateCount}
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            border: "1px solid #e5e7eb",
            borderRadius: 11,
            padding: "8px 11px",
          }}
        >
          <Search size={18} color="#64748b" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by animal, vaccine or status..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 14,
            borderColor: "#fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 14,
            borderColor: "#bbf7d0",
            background: "#f0fdf4",
            color: "#166534",
          }}
        >
          {success}
        </div>
      )}

      <div style={cardStyle}>
        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Loading vaccination records...
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            style={{
              padding: 35,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No vaccination records found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.3fr 1.1fr 1fr 1fr auto",
                  gap: 14,
                  alignItems: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    {getAnimalName(item.animal_id)}
                  </div>

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    ID: {item.animal_id || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 4,
                    }}
                  >
                    Vaccine
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {item.vaccine || "—"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 4,
                    }}
                  >
                    Vaccination Date
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 700,
                    }}
                  >
                    <CalendarDays size={15} />
                    {formatDate(item.date)}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 4,
                    }}
                  >
                    Next Due
                  </div>

                  <div style={{ fontWeight: 800 }}>
                    {formatDate(item.next_due_date)}
                  </div>
                </div>

                <div>
                  {item.status === "Completed" ? (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#15803d",
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <CheckCircle2 size={17} />
                      Completed
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleComplete(item.id)
                      }
                      style={{
                        ...buttonStyle,
                        background: "#111827",
                        color: "#ffffff",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: "min(620px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Add Vaccination
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  Create a vaccination schedule or record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  ...buttonStyle,
                  background: "#f1f5f9",
                  color: "#334155",
                  padding: "8px 11px",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 18,
              }}
            >
              <div>
                <label style={labelStyle}>
                  Animal
                </label>

                <select
                  value={form.animal_id}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      animal_id: event.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select animal
                  </option>

                  {animals.map((animal) => (
                    <option
                      key={animal.id}
                      value={animal.id}
                    >
                      {animal.name || "Animal"}{" "}
                      {animal.tag_id
                        ? `(${animal.tag_id})`
                        : ""}{" "}
                      — {animal.species || "Unknown"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Vaccine Name
                </label>

                <input
                  type="text"
                  value={form.vaccine}
                  placeholder="e.g. FMD Vaccine"
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      vaccine: event.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Vaccination Date
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        date: event.target.value,
                      }))
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Next Due Date
                  </label>

                  <input
                    type="date"
                    value={form.next_due_date}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        next_due_date:
                          event.target.value,
                      }))
                    }
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              style={{
                ...buttonStyle,
                width: "100%",
                marginTop: 18,
                background: "#0f766e",
                color: "#ffffff",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving
                ? "Saving..."
                : "Save Vaccination"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}