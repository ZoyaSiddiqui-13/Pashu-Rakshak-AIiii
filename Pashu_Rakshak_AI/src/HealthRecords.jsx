import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  MapPinned,
  PawPrint,
  RefreshCw,
  Search,
  ShieldAlert,
  Syringe,
  Stethoscope,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("pashuAccessToken") || "";
}

async function apiGet(path) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("pashuAccessToken");
    localStorage.removeItem("pashuUser");
    localStorage.removeItem("pashuAllowedRole");
    localStorage.removeItem("pashuRole");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let message = "Unable to load health records.";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      // Keep default.
    }
    throw new Error(message);
  }

  return response.json();
}

function itemsFrom(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function riskClass(risk) {
  const value = String(risk || "Low").toLowerCase();

  if (value === "critical") return "critical";
  if (value === "high") return "high";
  if (value === "medium") return "medium";
  return "low";
}

function HealthRecords() {
  const [animals, setAnimals] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadRecords(firstLoad = false) {
    try {
      setError("");

      if (firstLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [animalsData, casesData] = await Promise.all([
        apiGet("/api/animals?limit=100"),
        apiGet("/api/cases?limit=200"),
      ]);

      setAnimals(itemsFrom(animalsData));
      setCases(itemsFrom(casesData));
    } catch (err) {
      setError(err?.message || "Unable to load health records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadRecords(true);
  }, []);

  const selectedAnimal = useMemo(() => {
    if (selectedAnimalId === "all") return null;

    return (
      animals.find((animal) => String(animal.id) === String(selectedAnimalId)) ||
      null
    );
  }, [animals, selectedAnimalId]);

  const filteredCases = useMemo(() => {
    const search = query.trim().toLowerCase();

    return cases
      .filter((item) => {
        if (
          selectedAnimalId !== "all" &&
          String(item?.animal_id || "") !== String(selectedAnimalId)
        ) {
          return false;
        }

        if (!search) return true;

        const text = [
          item?.animal_name,
          item?.condition,
          item?.village,
          item?.risk,
          item?.stage,
          item?.status,
          item?.notes,
          ...(Array.isArray(item?.symptoms) ? item.symptoms : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(search);
      })
      .sort((a, b) => {
        const aTime = new Date(a?.created_at || 0).getTime();
        const bTime = new Date(b?.created_at || 0).getTime();
        return bTime - aTime;
      });
  }, [cases, selectedAnimalId, query]);

  const stats = useMemo(() => {
    const selectedCases =
      selectedAnimalId === "all"
        ? cases
        : cases.filter(
            (item) =>
              String(item?.animal_id || "") === String(selectedAnimalId)
          );

    const active = selectedCases.filter(
      (item) =>
        String(item?.stage || "").toLowerCase() !== "resolved" &&
        String(item?.status || "").toLowerCase() !== "closed"
    ).length;

    const highRisk = selectedCases.filter((item) =>
      ["high", "critical"].includes(
        String(item?.risk || "").toLowerCase()
      )
    ).length;

    return {
      records: selectedCases.length,
      active,
      highRisk,
      animals: selectedAnimalId === "all" ? animals.length : 1,
    };
  }, [animals.length, cases, selectedAnimalId]);

  return (
    <>
      <style>{`
        .health-records-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 36px;
          color: #173e35;
        }

        .health-records-page * {
          box-sizing: border-box;
        }

        .hr-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 18px;
        }

        .hr-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .hr-header p {
          margin: 7px 0 0;
          max-width: 680px;
          color: #7e8e87;
          font-size: 12px;
          line-height: 1.55;
        }

        .hr-header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .hr-select,
        .hr-search {
          height: 38px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          color: #506d63;
          outline: none;
          font-size: 9px;
          font-weight: 700;
        }

        .hr-select {
          min-width: 190px;
          padding: 0 10px;
        }

        .hr-search-wrap {
          display: flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding-left: 10px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
        }

        .hr-search-wrap svg {
          color: #93a19b;
        }

        .hr-search {
          width: 190px;
          border: 0;
          padding: 0 10px 0 0;
        }

        .hr-refresh {
          width: 38px;
          height: 38px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          color: #55736a;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .hr-refresh.spinning svg {
          animation: hr-spin .8s linear infinite;
        }

        @keyframes hr-spin {
          to { transform: rotate(360deg); }
        }

        .hr-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 15px;
        }

        .hr-stat {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 13px;
          padding: 14px;
        }

        .hr-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
        }

        .hr-stat-icon.green {
          background: #edf7e3;
          color: #668b37;
        }

        .hr-stat-icon.blue {
          background: #e8f3fa;
          color: #397793;
        }

        .hr-stat-icon.orange {
          background: #fff0dc;
          color: #b87523;
        }

        .hr-stat-icon.red {
          background: #ffe8e5;
          color: #b44b41;
        }

        .hr-stat strong {
          display: block;
          margin-top: 11px;
          color: #294d43;
          font-size: 23px;
        }

        .hr-stat span {
          display: block;
          margin-top: 5px;
          color: #7f8e88;
          font-size: 10px;
        }

        .hr-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          padding: 11px 13px;
          border-radius: 10px;
          border: 1px solid #f0d7d3;
          background: #fff2f0;
          color: #a64b43;
          font-size: 10px;
        }

        .hr-error button {
          margin-left: auto;
          border: 0;
          border-radius: 7px;
          background: #a64b43;
          color: #fff;
          padding: 6px 9px;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .hr-layout {
          display: grid;
          grid-template-columns: .75fr 1.25fr;
          gap: 15px;
        }

        .hr-card {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(44, 69, 59, .04);
          overflow: hidden;
        }

        .hr-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding: 15px 17px 12px;
          border-bottom: 1px solid #edf2ef;
        }

        .hr-card-head h2 {
          margin: 0;
          color: #294d43;
          font-size: 15px;
        }

        .hr-card-head p {
          margin: 4px 0 0;
          color: #89958f;
          font-size: 9px;
        }

        .hr-animal-list {
          max-height: 570px;
          overflow: auto;
          padding: 7px 10px;
        }

        .hr-animal-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          margin: 2px 0;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .hr-animal-item:hover {
          background: #f7faf7;
        }

        .hr-animal-item.active {
          background: #eef6e3;
          border-color: #dde9d2;
        }

        .hr-animal-avatar {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eef4e8;
          color: #6b8d3d;
        }

        .hr-animal-copy {
          flex: 1;
          min-width: 0;
        }

        .hr-animal-copy strong {
          display: block;
          color: #405e55;
          font-size: 10px;
        }

        .hr-animal-copy span {
          display: block;
          margin-top: 3px;
          color: #899690;
          font-size: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hr-mini-risk {
          display: inline-block;
          padding: 4px 6px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
        }

        .hr-mini-risk.low {
          background: #eef8df;
          color: #5f8235;
        }

        .hr-mini-risk.medium {
          background: #fff8df;
          color: #91772b;
        }

        .hr-mini-risk.high {
          background: #fff0df;
          color: #b36e24;
        }

        .hr-mini-risk.critical {
          background: #ffe8e5;
          color: #b1483e;
        }

        .hr-timeline {
          padding: 9px 17px 16px;
        }

        .hr-selected-animal {
          margin: 13px 0 5px;
          padding: 12px;
          border-radius: 10px;
          background: #f4f8f2;
          border: 1px solid #e3ece0;
        }

        .hr-selected-animal strong {
          display: block;
          color: #35584d;
          font-size: 11px;
        }

        .hr-selected-animal span {
          display: block;
          margin-top: 4px;
          color: #85938d;
          font-size: 9px;
        }

        .hr-timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 11px;
          padding: 12px 0;
        }

        .hr-timeline-item:not(:last-child)::before {
          content: "";
          position: absolute;
          left: 17px;
          top: 42px;
          bottom: -3px;
          width: 1px;
          background: #dfe9e4;
        }

        .hr-timeline-icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          position: relative;
          z-index: 1;
          background: #eef6e3;
          color: #698d39;
        }

        .hr-timeline-copy strong {
          display: block;
          color: #3d5c52;
          font-size: 10px;
        }

        .hr-timeline-copy p {
          margin: 4px 0 0;
          color: #7e8d87;
          font-size: 9px;
          line-height: 1.5;
        }

        .hr-meta-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 5px;
          flex-wrap: wrap;
        }

        .hr-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #9aa6a1;
          font-size: 8px;
        }

        .hr-stage {
          color: #6b7e76;
          background: #f3f6f4;
          border-radius: 999px;
          padding: 4px 6px;
          font-size: 7px;
          font-weight: 800;
        }

        .hr-empty {
          padding: 50px 20px;
          text-align: center;
          color: #96a19d;
          font-size: 10px;
        }

        .hr-empty svg {
          display: block;
          margin: 0 auto 9px;
        }

        .hr-loading {
          padding: 50px 20px;
          text-align: center;
          color: #8d9b95;
          font-size: 10px;
        }

        .hr-loading svg {
          display: block;
          margin: 0 auto 9px;
          animation: hr-spin 1s linear infinite;
        }

        .hr-note {
          margin-top: 13px;
          padding: 10px 12px;
          border-radius: 9px;
          background: #f2f6ec;
          color: #74836e;
          font-size: 8px;
          line-height: 1.55;
        }

        @media (max-width: 950px) {
          .hr-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .hr-header {
            flex-direction: column;
          }

          .hr-header-actions {
            width: 100%;
          }

          .hr-select {
            flex: 1;
          }

          .hr-search-wrap {
            flex: 1;
          }

          .hr-search {
            width: 100%;
          }

          .hr-stats {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .hr-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="health-records-page">
        <div className="hr-header">
          <div>
            <h1>Health Records</h1>
            <p>
              Animal-centred health history built from live animal and case
              data. Review disease concerns, risk, workflow stage and recorded
              observations in one timeline.
            </p>
          </div>

          <div className="hr-header-actions">
            <select
              className="hr-select"
              value={selectedAnimalId}
              onChange={(event) => setSelectedAnimalId(event.target.value)}
            >
              <option value="all">All animals</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name || "Unnamed"} · {animal.species || "Animal"}
                </option>
              ))}
            </select>

            <div className="hr-search-wrap">
              <Search size={15} />
              <input
                className="hr-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search records..."
              />
            </div>

            <button
              className={`hr-refresh ${refreshing ? "spinning" : ""}`}
              onClick={() => loadRecords(false)}
              disabled={refreshing}
              title="Refresh health records"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="hr-error">
            <AlertTriangle size={17} />
            <span>{error}</span>
            <button onClick={() => loadRecords(true)}>Retry</button>
          </div>
        )}

        <div className="hr-stats">
          <div className="hr-stat">
            <div className="hr-stat-icon green">
              <FileText size={17} />
            </div>
            <strong>{stats.records}</strong>
            <span>Recorded health events</span>
          </div>

          <div className="hr-stat">
            <div className="hr-stat-icon blue">
              <Activity size={17} />
            </div>
            <strong>{stats.active}</strong>
            <span>Active health cases</span>
          </div>

          <div className="hr-stat">
            <div className="hr-stat-icon orange">
              <ShieldAlert size={17} />
            </div>
            <strong>{stats.highRisk}</strong>
            <span>High / critical events</span>
          </div>

          <div className="hr-stat">
            <div className="hr-stat-icon red">
              <PawPrint size={17} />
            </div>
            <strong>{stats.animals}</strong>
            <span>Animals in selection</span>
          </div>
        </div>

        <div className="hr-layout">
          <section className="hr-card">
            <div className="hr-card-head">
              <div>
                <h2>Animal Profiles</h2>
                <p>Select an animal to view its health timeline.</p>
              </div>

              <PawPrint size={18} color="#739044" />
            </div>

            {loading ? (
              <div className="hr-loading">
                <RefreshCw size={25} />
                <div>Loading animal records...</div>
              </div>
            ) : animals.length === 0 ? (
              <div className="hr-empty">
                <PawPrint size={27} />
                <div>No animals have been recorded yet.</div>
              </div>
            ) : (
              <div className="hr-animal-list">
                <button
                  className={`hr-animal-item ${
                    selectedAnimalId === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedAnimalId("all")}
                >
                  <div className="hr-animal-avatar">
                    <Activity size={18} />
                  </div>

                  <div className="hr-animal-copy">
                    <strong>All animals</strong>
                    <span>Show the complete health activity</span>
                  </div>
                </button>

                {animals.map((animal) => {
                  const matchingCase = cases.find(
                    (item) =>
                      String(item?.animal_id || "") === String(animal.id)
                  );

                  const currentRisk =
                    matchingCase?.risk ||
                    animal?.risk ||
                    animal?.health_status ||
                    "Low";

                  return (
                    <button
                      className={`hr-animal-item ${
                        String(selectedAnimalId) === String(animal.id)
                          ? "active"
                          : ""
                      }`}
                      key={animal.id}
                      onClick={() => setSelectedAnimalId(String(animal.id))}
                    >
                      <div className="hr-animal-avatar">
                        <PawPrint size={18} />
                      </div>

                      <div className="hr-animal-copy">
                        <strong>{animal.name || "Unnamed animal"}</strong>
                        <span>
                          {animal.species || "Animal"} ·{" "}
                          {animal.breed || "Breed not recorded"} ·{" "}
                          {animal.village || "Location not recorded"}
                        </span>
                      </div>

                      <span
                        className={`hr-mini-risk ${riskClass(currentRisk)}`}
                      >
                        {currentRisk}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="hr-card">
            <div className="hr-card-head">
              <div>
                <h2>Health Timeline</h2>
                <p>
                  {selectedAnimal
                    ? `${selectedAnimal.name || "Selected animal"}'s recorded case activity`
                    : "Latest recorded case activity across animals"}
                </p>
              </div>

              <HeartPulse size={18} color="#739044" />
            </div>

            <div className="hr-timeline">
              {selectedAnimal && (
                <div className="hr-selected-animal">
                  <strong>
                    {selectedAnimal.name || "Unnamed animal"} ·{" "}
                    {selectedAnimal.species || "Animal"}
                  </strong>
                  <span>
                    ID: {selectedAnimal.id || "—"} · Breed:{" "}
                    {selectedAnimal.breed || "—"} · Age:{" "}
                    {selectedAnimal.age ?? "—"} · Location:{" "}
                    {selectedAnimal.village || "—"}
                  </span>
                </div>
              )}

              {loading ? (
                <div className="hr-loading">
                  <RefreshCw size={25} />
                  <div>Loading health activity...</div>
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="hr-empty">
                  <ClipboardList size={27} />
                  <div>
                    {query
                      ? "No health records match your search."
                      : selectedAnimalId === "all"
                      ? "No health cases have been recorded yet."
                      : "No case history is available for this animal yet."}
                  </div>
                </div>
              ) : (
                filteredCases.map((item) => {
                  const risk = item?.risk || "Low";

                  return (
                    <div className="hr-timeline-item" key={item.id}>
                      <div className="hr-timeline-icon">
                        {riskClass(risk) === "critical" ||
                        riskClass(risk) === "high" ? (
                          <ShieldAlert size={17} />
                        ) : (
                          <Stethoscope size={17} />
                        )}
                      </div>

                      <div className="hr-timeline-copy">
                        <strong>
                          {item?.animal_name || "Animal health event"} ·{" "}
                          {item?.condition || "Health review"}
                        </strong>

                        <p>
                          {item?.observations ||
                            (Array.isArray(item?.symptoms) &&
                            item.symptoms.length
                              ? `Symptoms: ${item.symptoms.join(", ")}`
                              : "No additional observation recorded.")}
                        </p>

                        <div className="hr-meta-line">
                          <span
                            className={`hr-mini-risk ${riskClass(risk)}`}
                          >
                            {risk}
                          </span>

                          <span className="hr-stage">
                            {String(item?.stage || "reported")
                              .replaceAll("_", " ")
                              .replaceAll("-", " ")
                              .replace(/\b\w/g, (letter) =>
                                letter.toUpperCase()
                              )}
                          </span>

                          <span className="hr-date">
                            <CalendarDays size={10} />
                            {formatDate(item?.created_at)}
                          </span>

                          {item?.village && (
                            <span className="hr-date">
                              <MapPinned size={10} />
                              {item.village}
                            </span>
                          )}

                          {item?.follow_up_date && (
                            <span className="hr-date">
                              <CalendarDays size={10} />
                              Follow-up {formatDate(item.follow_up_date)}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            color: "#a0aaa5",
                            fontSize: 8,
                          }}
                        >
                          Updated {formatDateTime(item?.updated_at)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <div className="hr-note">
          <Activity
            size={11}
            style={{ verticalAlign: "middle", marginRight: 5 }}
          />
          This screen uses the live animal and case records available through
          the current API. Dedicated vaccination, treatment and laboratory
          history endpoints can be layered into the same timeline next.
        </div>
      </div>
    </>
  );
}

export default HealthRecords;
