import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  X,
  PawPrint,
  MapPin,
  CalendarDays,
  Activity,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const initialAnimals = [
  {
    id: "AN-1024",
    name: "Gauri",
    type: "Cow",
    breed: "Gir",
    age: 4,
    gender: "Female",
    location: "Nashik",
    score: 92,
    risk: "Low",
    vaccination: "Up to date",
    lastCheck: "25 Sep 2026",
    status: "Healthy",
  },
  {
    id: "AN-1025",
    name: "Moti",
    type: "Buffalo",
    breed: "Murrah",
    age: 6,
    gender: "Male",
    location: "Pune",
    score: 68,
    risk: "Medium",
    vaccination: "Due soon",
    lastCheck: "24 Sep 2026",
    status: "Observation",
  },
  {
    id: "AN-1026",
    name: "Laxmi",
    type: "Cow",
    breed: "Sahiwal",
    age: 3,
    gender: "Female",
    location: "Satara",
    score: 42,
    risk: "High",
    vaccination: "Up to date",
    lastCheck: "26 Sep 2026",
    status: "Under review",
  },
  {
    id: "AN-1027",
    name: "Raja",
    type: "Goat",
    breed: "Osmanabadi",
    age: 2,
    gender: "Male",
    location: "Ahmednagar",
    score: 31,
    risk: "Critical",
    vaccination: "Due",
    lastCheck: "27 Sep 2026",
    status: "Active case",
  },
  {
    id: "AN-1028",
    name: "Kali",
    type: "Sheep",
    breed: "Deccani",
    age: 5,
    gender: "Female",
    location: "Solapur",
    score: 81,
    risk: "Low",
    vaccination: "Up to date",
    lastCheck: "23 Sep 2026",
    status: "Healthy",
  },
  {
    id: "AN-1029",
    name: "Maya",
    type: "Cow",
    breed: "Jersey",
    age: 7,
    gender: "Female",
    location: "Thane",
    score: 57,
    risk: "Medium",
    vaccination: "Due soon",
    lastCheck: "22 Sep 2026",
    status: "Observation",
  },
];

const riskClass = (risk) =>
  `animal-risk animal-risk-${risk.toLowerCase()}`;

function Animals() {
  const [animals, setAnimals] =
    useState(initialAnimals);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] =
    useState("All");
  const [typeFilter, setTypeFilter] =
    useState("All");

  const [selectedAnimal, setSelectedAnimal] =
    useState(null);

  const [editingAnimal, setEditingAnimal] =
    useState(null);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const text =
        `${animal.id} ${animal.name} ${animal.type} ${animal.breed} ${animal.location}`
          .toLowerCase();

      const matchesSearch =
        text.includes(search.toLowerCase());

      const matchesRisk =
        riskFilter === "All" ||
        animal.risk === riskFilter;

      const matchesType =
        typeFilter === "All" ||
        animal.type === typeFilter;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesType
      );
    });
  }, [
    animals,
    search,
    riskFilter,
    typeFilter,
  ]);

  const counts = {
    total: animals.length,
    low: animals.filter(
      (a) => a.risk === "Low"
    ).length,
    medium: animals.filter(
      (a) => a.risk === "Medium"
    ).length,
    high: animals.filter(
      (a) => a.risk === "High"
    ).length,
    critical: animals.filter(
      (a) => a.risk === "Critical"
    ).length,
  };

  const updateAnimal = () => {
    if (!editingAnimal) return;

    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === editingAnimal.id
          ? editingAnimal
          : animal
      )
    );

    setEditingAnimal(null);
  };

  return (
    <>
      <style>{`
        .animals-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .animals-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .animals-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 30px;
        }

        .animals-header p {
          margin: 6px 0 0;
          color: #73827c;
          font-size: 13px;
        }

        .animal-add-btn {
          border: 0;
          background: #d8f25c;
          color: #173e35;
          border-radius: 10px;
          padding: 11px 16px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
        }

        .animal-summary {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 13px;
          margin-bottom: 18px;
        }

        .animal-summary-card {
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
        }

        .animal-summary-card span {
          display: block;
          color: #7b8984;
          font-size: 11px;
        }

        .animal-summary-card strong {
          display: block;
          margin-top: 3px;
          color: #183f35;
          font-size: 23px;
        }

        .animal-summary-card.critical strong {
          color: #d63e3e;
        }

        .animal-summary-card.high strong {
          color: #c37b21;
        }

        .animal-summary-card.medium strong {
          color: #98731e;
        }

        .animal-toolbar {
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .animal-search {
          flex: 1;
          position: relative;
        }

        .animal-search svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #899891;
        }

        .animal-search input,
        .animal-toolbar select {
          width: 100%;
          height: 42px;
          border: 1px solid #dce6e1;
          border-radius: 9px;
          background: #fbfdfc;
          outline: none;
          color: #25483f;
          font-size: 12px;
        }

        .animal-search input {
          padding: 0 12px 0 39px;
        }

        .animal-toolbar select {
          width: 180px;
          padding: 0 10px;
        }

        .animal-search input:focus,
        .animal-toolbar select:focus {
          border-color: #8daa4b;
        }

        .animal-grid-advanced {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .animal-card-advanced {
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          padding: 18px;
          transition: .2s ease;
        }

        .animal-card-advanced:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(20,65,53,.08);
          border-color: #cbdcab;
        }

        .animal-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .animal-avatar-big {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #edf7d8;
          color: #4e7425;
          font-size: 20px;
          font-weight: 800;
        }

        .animal-risk {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }

        .animal-risk-low {
          background: #edf8dc;
          color: #5d8527;
        }

        .animal-risk-medium {
          background: #fff6dc;
          color: #98721d;
        }

        .animal-risk-high {
          background: #fff0dc;
          color: #b7671d;
        }

        .animal-risk-critical {
          background: #ffebeb;
          color: #d23b3b;
        }

        .animal-card-advanced h3 {
          margin: 14px 0 3px;
          color: #183e35;
          font-size: 18px;
        }

        .animal-id {
          color: #82918b;
          font-size: 11px;
        }

        .animal-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 16px 0;
        }

        .animal-detail {
          background: #f7faf8;
          border-radius: 9px;
          padding: 9px;
        }

        .animal-detail span {
          display: block;
          color: #8a9892;
          font-size: 9px;
        }

        .animal-detail b {
          display: block;
          margin-top: 2px;
          color: #3d5b52;
          font-size: 11px;
        }

        .animal-score-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 11px;
        }

        .animal-score-header span {
          color: #7d8b85;
        }

        .animal-score-header b {
          color: #36594e;
        }

        .animal-progress {
          height: 7px;
          background: #edf1ef;
          border-radius: 999px;
          overflow: hidden;
        }

        .animal-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #8eaf3a;
        }

        .animal-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
        }

        .animal-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6f8079;
          font-size: 10px;
        }

        .animal-status i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7eaa32;
        }

        .animal-card-actions {
          display: flex;
          gap: 7px;
        }

        .animal-action {
          height: 32px;
          border: 1px solid #dce6e1;
          background: #ffffff;
          color: #45645a;
          border-radius: 8px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .animal-action:hover {
          background: #f2f7f4;
        }

        .animal-empty {
          grid-column: 1 / -1;
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          padding: 60px;
          text-align: center;
          color: #80908a;
        }

        .animal-modal-bg {
          position: fixed;
          inset: 0;
          background: rgba(10, 35, 29, .48);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
          backdrop-filter: blur(3px);
        }

        .animal-modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 25px 80px rgba(0,0,0,.2);
        }

        .animal-modal-header {
          padding: 20px;
          border-bottom: 1px solid #e8efec;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .animal-modal-header h2 {
          margin: 0;
          color: #173e35;
        }

        .animal-modal-header p {
          margin: 4px 0 0;
          color: #81908a;
          font-size: 11px;
        }

        .animal-close {
          width: 34px;
          height: 34px;
          border: 1px solid #dfe8e4;
          background: #ffffff;
          border-radius: 8px;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #62746c;
        }

        .animal-modal-body {
          padding: 20px;
        }

        .profile-top {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: #f7faf8;
          border-radius: 12px;
          margin-bottom: 18px;
        }

        .profile-avatar {
          width: 58px;
          height: 58px;
          border-radius: 15px;
          background: #eaf6ce;
          color: #527728;
          display: grid;
          place-items: center;
          font-size: 23px;
          font-weight: 800;
        }

        .profile-top h3 {
          margin: 0 0 3px;
          color: #173f35;
        }

        .profile-top span {
          color: #80908a;
          font-size: 11px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .profile-box {
          border: 1px solid #e5ece9;
          border-radius: 10px;
          padding: 12px;
        }

        .profile-box span {
          display: block;
          color: #899790;
          font-size: 10px;
        }

        .profile-box b {
          display: block;
          margin-top: 4px;
          color: #35574d;
          font-size: 13px;
        }

        .profile-section {
          margin-top: 18px;
        }

        .profile-section h3 {
          margin: 0 0 10px;
          color: #254a40;
          font-size: 14px;
        }

        .profile-health {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 15px;
          border-radius: 12px;
          background: #f7faf8;
        }

        .profile-score {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #e8f4cb;
          color: #507426;
          font-size: 22px;
          font-weight: 800;
        }

        .profile-health p {
          margin: 4px 0 0;
          color: #71827a;
          font-size: 11px;
        }

        .profile-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 20px;
        }

        .edit-form {
          display: grid;
          gap: 13px;
        }

        .edit-form label {
          display: grid;
          gap: 6px;
          color: #48645b;
          font-size: 11px;
          font-weight: 700;
        }

        .edit-form input,
        .edit-form select {
          height: 40px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          padding: 0 10px;
          outline: none;
          color: #294a41;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 6px;
        }

        @media (max-width: 1000px) {
          .animal-grid-advanced {
            grid-template-columns: repeat(2, 1fr);
          }

          .animal-summary {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .animal-grid-advanced {
            grid-template-columns: 1fr;
          }

          .animal-summary {
            grid-template-columns: repeat(2, 1fr);
          }

          .animals-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .animal-toolbar {
            flex-direction: column;
          }

          .animal-toolbar select {
            width: 100%;
          }
        }

        @media (max-width: 450px) {
          .animal-summary {
            grid-template-columns: 1fr 1fr;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="animals-page">

        {/* HEADER */}

        <div className="animals-header">
          <div>
            <h1>Animals</h1>
            <p>
              Manage animal profiles, health scores,
              vaccination and risk status.
            </p>
          </div>

          <button
            className="animal-add-btn"
            onClick={() =>
              alert(
                "Add Animal form will be connected next."
              )
            }
          >
            <Plus size={17} />
            Add Animal
          </button>
        </div>

        {/* SUMMARY */}

        <div className="animal-summary">

          <div className="animal-summary-card">
            <span>Total Animals</span>
            <strong>{counts.total}</strong>
          </div>

          <div className="animal-summary-card">
            <span>Low Risk</span>
            <strong>{counts.low}</strong>
          </div>

          <div className="animal-summary-card medium">
            <span>Medium Risk</span>
            <strong>{counts.medium}</strong>
          </div>

          <div className="animal-summary-card high">
            <span>High Risk</span>
            <strong>{counts.high}</strong>
          </div>

          <div className="animal-summary-card critical">
            <span>Critical</span>
            <strong>{counts.critical}</strong>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="animal-toolbar">

          <div className="animal-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search animal, ID, breed or location..."
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(e.target.value)
            }
          >
            <option value="All">
              All Risk Levels
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">
              Critical
            </option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">
              All Animal Types
            </option>
            <option value="Cow">Cow</option>
            <option value="Buffalo">
              Buffalo
            </option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
          </select>

        </div>

        {/* CARDS */}

        <div className="animal-grid-advanced">

          {filteredAnimals.length === 0 ? (
            <div className="animal-empty">
              <PawPrint size={35} />

              <h3>No animals found</h3>

              <p>
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredAnimals.map((animal) => (
              <div
                className="animal-card-advanced"
                key={animal.id}
              >

                <div className="animal-card-top">

                  <div className="animal-avatar-big">
                    {animal.name[0]}
                  </div>

                  <span
                    className={riskClass(
                      animal.risk
                    )}
                  >
                    {animal.risk}
                  </span>

                </div>

                <h3>{animal.name}</h3>

                <span className="animal-id">
                  {animal.id} · {animal.breed}
                </span>

                <div className="animal-details">

                  <div className="animal-detail">
                    <span>TYPE</span>
                    <b>{animal.type}</b>
                  </div>

                  <div className="animal-detail">
                    <span>AGE</span>
                    <b>{animal.age} yrs</b>
                  </div>

                  <div className="animal-detail">
                    <span>LOCATION</span>
                    <b>{animal.location}</b>
                  </div>

                </div>

                <div className="animal-score-header">
                  <span>Health Score</span>
                  <b>{animal.score}/100</b>
                </div>

                <div className="animal-progress">
                  <span
                    style={{
                      width: `${animal.score}%`,
                    }}
                  />
                </div>

                <div className="animal-status-row">

                  <div className="animal-status">
                    <i />
                    {animal.status}
                  </div>

                  <div className="animal-card-actions">

                    <button
                      className="animal-action"
                      onClick={() =>
                        setSelectedAnimal(
                          animal
                        )
                      }
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <button
                      className="animal-action"
                      onClick={() =>
                        setEditingAnimal({
                          ...animal,
                        })
                      }
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {/* VIEW MODAL */}

      {selectedAnimal && (
        <div
          className="animal-modal-bg"
          onClick={() =>
            setSelectedAnimal(null)
          }
        >
          <div
            className="animal-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="animal-modal-header">
              <div>
                <h2>Animal Profile</h2>

                <p>
                  Complete health overview
                </p>
              </div>

              <button
                className="animal-close"
                onClick={() =>
                  setSelectedAnimal(null)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="animal-modal-body">

              <div className="profile-top">

                <div className="profile-avatar">
                  {selectedAnimal.name[0]}
                </div>

                <div>
                  <h3>
                    {selectedAnimal.name}
                  </h3>

                  <span>
                    {selectedAnimal.id} ·{" "}
                    {selectedAnimal.type}
                  </span>
                </div>

                <span
                  className={riskClass(
                    selectedAnimal.risk
                  )}
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  {selectedAnimal.risk}
                </span>

              </div>

              <div className="profile-grid">

                <div className="profile-box">
                  <span>BREED</span>
                  <b>{selectedAnimal.breed}</b>
                </div>

                <div className="profile-box">
                  <span>AGE</span>
                  <b>{selectedAnimal.age} years</b>
                </div>

                <div className="profile-box">
                  <span>GENDER</span>
                  <b>{selectedAnimal.gender}</b>
                </div>

                <div className="profile-box">
                  <span>LOCATION</span>
                  <b>{selectedAnimal.location}</b>
                </div>

                <div className="profile-box">
                  <span>VACCINATION</span>
                  <b>{selectedAnimal.vaccination}</b>
                </div>

                <div className="profile-box">
                  <span>LAST CHECK</span>
                  <b>{selectedAnimal.lastCheck}</b>
                </div>

              </div>

              <div className="profile-section">

                <h3>Health Overview</h3>

                <div className="profile-health">

                  <div className="profile-score">
                    {selectedAnimal.score}
                  </div>

                  <div>
                    <b>
                      Health Score
                    </b>

                    <p>
                      Current health assessment based
                      on monitored data.
                    </p>
                  </div>

                </div>

              </div>

              <div className="profile-section">

                <h3>Current Status</h3>

                <div className="next">
                  {selectedAnimal.risk ===
                  "Critical" ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}

                  <div>
                    <b>
                      {selectedAnimal.status}
                    </b>

                    <p>
                      Vaccination:{" "}
                      {selectedAnimal.vaccination}
                      {" · "}
                      Last health check:{" "}
                      {selectedAnimal.lastCheck}
                    </p>
                  </div>
                </div>

              </div>

              <div className="profile-actions">

                <button
                  className="secondary"
                  onClick={() => {
                    setEditingAnimal({
                      ...selectedAnimal,
                    });

                    setSelectedAnimal(null);
                  }}
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>

                <button
                  className="primary"
                  onClick={() =>
                    setSelectedAnimal(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}

      {editingAnimal && (
        <div
          className="animal-modal-bg"
          onClick={() =>
            setEditingAnimal(null)
          }
        >
          <div
            className="animal-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="animal-modal-header">

              <div>
                <h2>Edit Animal</h2>

                <p>
                  Update animal profile information
                </p>
              </div>

              <button
                className="animal-close"
                onClick={() =>
                  setEditingAnimal(null)
                }
              >
                <X size={18} />
              </button>

            </div>

            <div className="animal-modal-body">

              <div className="edit-form">

                <label>
                  Animal Name

                  <input
                    value={editingAnimal.name}
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        name: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Breed

                  <input
                    value={editingAnimal.breed}
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        breed: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Location

                  <input
                    value={
                      editingAnimal.location
                    }
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        location:
                          e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Risk Level

                  <select
                    value={editingAnimal.risk}
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        risk: e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>

                <label>
                  Health Score

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingAnimal.score}
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        score: Number(
                          e.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label>
                  Vaccination

                  <select
                    value={
                      editingAnimal.vaccination
                    }
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        vaccination:
                          e.target.value,
                      })
                    }
                  >
                    <option>
                      Up to date
                    </option>
                    <option>
                      Due soon
                    </option>
                    <option>Due</option>
                  </select>
                </label>

                <div className="edit-actions">

                  <button
                    className="secondary"
                    onClick={() =>
                      setEditingAnimal(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary"
                    onClick={updateAnimal}
                  >
                    Save Changes
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Animals;