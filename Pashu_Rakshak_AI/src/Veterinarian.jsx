import React, { useState } from "react";
import {
  Search,
  UserRound,
  Stethoscope,
  ClipboardList,
  Pill,
  CalendarDays,
  X,
  CheckCircle2,
} from "lucide-react";

const initialCases = [
  {
    id: "CS-2048",
    animal: "Raja",
    animalId: "AN-1027",
    type: "Goat",
    disease: "Respiratory infection",
    risk: "Critical",
    location: "Satara",
    status: "Assigned",
    symptoms: "Coughing, reduced appetite, nasal discharge",
    vet: "Dr. Mehta",
  },
  {
    id: "CS-2047",
    animal: "Laxmi",
    animalId: "AN-1026",
    type: "Cow",
    disease: "Possible fever",
    risk: "High",
    location: "Satara",
    status: "Under review",
    symptoms: "Reduced activity and feeding",
    vet: "Dr. Mehta",
  },
  {
    id: "CS-2046",
    animal: "Moti",
    animalId: "AN-1025",
    type: "Buffalo",
    disease: "Appetite reduction",
    risk: "Medium",
    location: "Pune",
    status: "Assigned",
    symptoms: "Reduced feeding for two days",
    vet: "Dr. Mehta",
  },
];

const riskClass = (risk) => `risk risk-${risk.toLowerCase()}`;

function Veterinarian() {
  const [cases, setCases] = useState(initialCases);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const [consultation, setConsultation] = useState("");
  const [treatment, setTreatment] = useState("");
  const [followUp, setFollowUp] = useState("");

  const filteredCases = cases.filter((item) => {
    const value =
      `${item.id} ${item.animal} ${item.animalId} ${item.disease} ${item.location}`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  const saveConsultation = () => {
    if (!selectedCase) return;

    setCases((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? {
              ...item,
              status: "Consultation completed",
            }
          : item
      )
    );

    setSelectedCase({
      ...selectedCase,
      status: "Consultation completed",
    });

    alert("Consultation saved successfully.");
  };

  const saveTreatment = () => {
    if (!selectedCase || !treatment.trim()) {
      alert("Please enter treatment details.");
      return;
    }

    setCases((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? {
              ...item,
              status: "Treatment active",
            }
          : item
      )
    );

    setSelectedCase({
      ...selectedCase,
      status: "Treatment active",
    });

    alert("Treatment plan saved successfully.");
  };

  const saveFollowUp = () => {
    if (!selectedCase || !followUp) {
      alert("Please select a follow-up date.");
      return;
    }

    alert(`Follow-up scheduled for ${followUp}.`);
  };

  const closeCase = () => {
    if (!selectedCase) return;

    setCases((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? {
              ...item,
              status: "Follow-up scheduled",
            }
          : item
      )
    );

    setSelectedCase({
      ...selectedCase,
      status: "Follow-up scheduled",
    });

    alert("Case moved to follow-up.");
  };

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Veterinarian</h1>
          <p>
            Review assigned cases, consult patients and manage treatment.
          </p>
        </div>

        <div className="card" style={{ padding: "9px 14px" }}>
          <div className="mini-stat">
            <Stethoscope size={19} />
            <b>{cases.length}</b>
            <span>Assigned Cases</span>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stats">
        <div className="card stat">
          <div className="stat-icon red">
            <Stethoscope size={18} />
          </div>
          <div>
            <span>Critical</span>
            <strong>1</strong>
            <small>Immediate review</small>
          </div>
        </div>

        <div className="card stat">
          <div className="stat-icon amber">
            <ClipboardList size={18} />
          </div>
          <div>
            <span>Under Review</span>
            <strong>1</strong>
            <small>Consultation pending</small>
          </div>
        </div>

        <div className="card stat">
          <div className="stat-icon green">
            <Pill size={18} />
          </div>
          <div>
            <span>Active Treatment</span>
            <strong>1</strong>
            <small>Follow-up required</small>
          </div>
        </div>

        <div className="card stat">
          <div className="stat-icon blue">
            <CalendarDays size={18} />
          </div>
          <div>
            <span>Follow-ups</span>
            <strong>4</strong>
            <small>This week</small>
          </div>
        </div>
      </div>

      {/* CASE QUEUE */}
      <div className="card">
        <div className="section-head">
          <div>
            <h2>Assigned Case Queue</h2>
            <p>Cases requiring veterinarian review.</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search inline">
            <Search size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case, animal, disease or location..."
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case</th>
                <th>Animal</th>
                <th>Concern</th>
                <th>Risk</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((item) => (
                <tr key={item.id}>
                  <td>
                    <b>{item.id}</b>
                  </td>

                  <td>
                    <b>{item.animal}</b>
                    <br />
                    <small>
                      {item.animalId} · {item.type}
                    </small>
                  </td>

                  <td>{item.disease}</td>

                  <td>
                    <span className={riskClass(item.risk)}>
                      {item.risk}
                    </span>
                  </td>

                  <td>{item.location}</td>

                  <td>
                    <span className="status">
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="small-btn"
                      onClick={() => {
                        setSelectedCase(item);
                        setConsultation("");
                        setTreatment("");
                        setFollowUp("");
                      }}
                    >
                      <UserRound size={14} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONSULTATION MODAL */}
      {selectedCase && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="case-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  VETERINARY CONSULTATION
                </span>

                <h2>{selectedCase.id}</h2>

                <p>
                  {selectedCase.animal} · {selectedCase.animalId} ·{" "}
                  {selectedCase.type}
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setSelectedCase(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* PATIENT SUMMARY */}
            <div className="case-summary">
              <div>
                <span>Risk</span>
                <b>
                  <span className={riskClass(selectedCase.risk)}>
                    {selectedCase.risk}
                  </span>
                </b>
              </div>

              <div>
                <span>Status</span>
                <b>{selectedCase.status}</b>
              </div>

              <div>
                <span>Location</span>
                <b>{selectedCase.location}</b>
              </div>

              <div>
                <span>Veterinarian</span>
                <b>{selectedCase.vet}</b>
              </div>
            </div>

            {/* SYMPTOMS */}
            <div className="case-section">
              <h3>Reported Symptoms</h3>
              <p>{selectedCase.symptoms}</p>
            </div>

            {/* AI INFORMATION */}
            <div className="case-section">
              <h3>AI Screening Summary</h3>

              <div className="result-risk">
                <div className="risk-gauge">
                  <b>72%</b>
                  <small>Risk</small>
                </div>

                <div>
                  <span className="simulated">
                    SIMULATED AI
                  </span>

                  <h3>
                    Possible {selectedCase.disease}
                  </h3>

                  <p>
                    AI screening is decision support only.
                    Veterinary confirmation is required.
                  </p>
                </div>
              </div>
            </div>

            {/* CONSULTATION */}
            <div className="case-section">
              <h3>Veterinarian Consultation</h3>

              <textarea
                value={consultation}
                onChange={(e) =>
                  setConsultation(e.target.value)
                }
                placeholder="Enter clinical observations, examination notes and findings..."
                style={{
                  width: "100%",
                  minHeight: "90px",
                  marginTop: "8px",
                  border: "1px solid #dfe8e4",
                  borderRadius: "8px",
                  padding: "10px",
                  resize: "vertical",
                  outline: "none",
                }}
              />

              <button
                className="secondary"
                style={{ marginTop: "9px" }}
                onClick={saveConsultation}
              >
                <CheckCircle2 size={15} />
                Save Consultation
              </button>
            </div>

            {/* TREATMENT */}
            <div className="case-section">
              <h3>Treatment Plan</h3>

              <textarea
                value={treatment}
                onChange={(e) =>
                  setTreatment(e.target.value)
                }
                placeholder="Medicine, dosage, duration and instructions..."
                style={{
                  width: "100%",
                  minHeight: "85px",
                  marginTop: "8px",
                  border: "1px solid #dfe8e4",
                  borderRadius: "8px",
                  padding: "10px",
                  resize: "vertical",
                  outline: "none",
                }}
              />

              <button
                className="secondary"
                style={{ marginTop: "9px" }}
                onClick={saveTreatment}
              >
                <Pill size={15} />
                Save Treatment
              </button>
            </div>

            {/* FOLLOW-UP */}
            <div className="case-section">
              <h3>Follow-up</h3>

              <input
                type="date"
                value={followUp}
                onChange={(e) =>
                  setFollowUp(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  border: "1px solid #dfe8e4",
                  borderRadius: "8px",
                  outline: "none",
                }}
              />

              <button
                className="secondary"
                style={{ marginTop: "9px" }}
                onClick={saveFollowUp}
              >
                <CalendarDays size={15} />
                Schedule Follow-up
              </button>
            </div>

            {/* ACTIONS */}
            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() =>
                  alert(
                    `Lab test requested for ${selectedCase.id}`
                  )
                }
              >
                Request Lab Test
              </button>

              <button
                className="primary"
                onClick={closeCase}
              >
                <CheckCircle2 size={16} />
                Move to Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Veterinarian;