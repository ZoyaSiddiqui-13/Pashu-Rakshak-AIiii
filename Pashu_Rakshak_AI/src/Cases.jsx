import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  UserRound,
  FlaskConical,
  CheckCircle2,
  X,
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
    vet: "Dr. Mehta",
    status: "Open",
    created: "27 Sep 2026",
    symptoms: "Coughing, reduced appetite, nasal discharge",
  },
  {
    id: "CS-2047",
    animal: "Laxmi",
    animalId: "AN-1026",
    type: "Cow",
    disease: "Possible fever",
    risk: "High",
    location: "Satara",
    vet: "Dr. Khan",
    status: "Under review",
    created: "27 Sep 2026",
    symptoms: "Reduced activity and feeding",
  },
  {
    id: "CS-2046",
    animal: "Moti",
    animalId: "AN-1025",
    type: "Buffalo",
    disease: "Appetite reduction",
    risk: "Medium",
    location: "Pune",
    vet: "Dr. Mehta",
    status: "Lab pending",
    created: "26 Sep 2026",
    symptoms: "Reduced feeding for two days",
  },
  {
    id: "CS-2045",
    animal: "Gauri",
    animalId: "AN-1024",
    type: "Cow",
    disease: "Routine check",
    risk: "Low",
    location: "Nashik",
    vet: "Dr. Patil",
    status: "Closed",
    created: "25 Sep 2026",
    symptoms: "Routine health monitoring",
  },
];

const riskClass = (risk) => `risk risk-${risk.toLowerCase()}`;

function Cases() {
  const [cases, setCases] = useState(initialCases);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const text =
        `${item.id} ${item.animal} ${item.animalId} ${item.disease} ${item.location}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (riskFilter === "All" || item.risk === riskFilter) &&
        (statusFilter === "All" || item.status === statusFilter)
      );
    });
  }, [cases, search, riskFilter, statusFilter]);

  const updateStatus = (id, status) => {
    setCases((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedCase((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev
    );
  };

  const assignVet = () => {
    if (!selectedCase) return;

    const vet = window.prompt(
      "Enter veterinarian name:",
      selectedCase.vet
    );

    if (!vet) return;

    setCases((prev) =>
      prev.map((item) =>
        item.id === selectedCase.id
          ? { ...item, vet, status: "Under review" }
          : item
      )
    );

    setSelectedCase({
      ...selectedCase,
      vet,
      status: "Under review",
    });
  };

  const sendToLab = () => {
    if (!selectedCase) return;

    updateStatus(selectedCase.id, "Lab pending");

    window.alert(
      `Lab request created for ${selectedCase.id}`
    );
  };

  const closeCase = () => {
    if (!selectedCase) return;

    updateStatus(selectedCase.id, "Closed");
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Case Management</h1>
          <p>
            Track case ID, risk, assignment, timeline and closure.
          </p>
        </div>

        <button
          className="primary"
          onClick={() =>
            window.alert("Create Case form will open here.")
          }
        >
          + Create Case
        </button>
      </div>

      <div className="card toolbar">
        <div className="search inline">
          <Search size={17} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search case, animal, disease or location..."
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
        >
          <option value="All">All Risk</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Under review">Under review</option>
          <option value="Lab pending">Lab pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Animal</th>
              <th>Disease / Concern</th>
              <th>Risk</th>
              <th>Assigned</th>
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

                <td>{item.vet}</td>

                <td>
                  <span className="status">
                    {item.status}
                  </span>
                </td>

                <td>
                  <button
                    className="small-btn"
                    onClick={() => setSelectedCase(item)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredCases.length === 0 && (
              <tr>
                <td colSpan="7">
                  <div className="empty">
                    <Search size={30} />
                    <b>No cases found</b>
                    <span>
                      Try changing your search or filters.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="case-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  CASE MANAGEMENT
                </span>

                <h2>{selectedCase.id}</h2>

                <p>
                  {selectedCase.animal} ·{" "}
                  {selectedCase.animalId}
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={() => setSelectedCase(null)}
              >
                <X size={20} />
              </button>
            </div>

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

            <div className="case-section">
              <h3>Health Concern</h3>
              <p>{selectedCase.disease}</p>
            </div>

            <div className="case-section">
              <h3>Reported Symptoms</h3>
              <p>{selectedCase.symptoms}</p>
            </div>

            <div className="case-section">
              <h3>Case Timeline</h3>

              <div className="timeline">
                <div className="timeline-item">
                  <span></span>
                  <div>
                    <b>Case created</b>
                    <small>{selectedCase.created}</small>
                  </div>
                </div>

                <div className="timeline-item">
                  <span></span>
                  <div>
                    <b>AI screening completed</b>
                    <small>
                      Risk: {selectedCase.risk}
                    </small>
                  </div>
                </div>

                <div className="timeline-item">
                  <span></span>
                  <div>
                    <b>Veterinarian assigned</b>
                    <small>{selectedCase.vet}</small>
                  </div>
                </div>

                {selectedCase.status === "Lab pending" && (
                  <div className="timeline-item">
                    <span></span>
                    <div>
                      <b>Laboratory test requested</b>
                      <small>
                        Awaiting laboratory result
                      </small>
                    </div>
                  </div>
                )}

                {selectedCase.status === "Closed" && (
                  <div className="timeline-item">
                    <span></span>
                    <div>
                      <b>Case closed</b>
                      <small>Follow-up completed</small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={assignVet}
              >
                <UserRound size={16} />
                Assign Vet
              </button>

              <button
                className="secondary"
                onClick={sendToLab}
              >
                <FlaskConical size={16} />
                Send to Lab
              </button>

              {selectedCase.status !== "Closed" && (
                <button
                  className="primary"
                  onClick={closeCase}
                >
                  <CheckCircle2 size={16} />
                  Close Case
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cases;