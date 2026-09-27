import React, { useMemo, useState } from "react";
import {
  Pill,
  Search,
  Plus,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CalendarDays,
  PawPrint,
  Stethoscope,
  MapPin,
  X,
  FileText,
} from "lucide-react";

function Treatment() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [treatments, setTreatments] = useState([
    {
      id: "TRT-601",
      caseId: "CS-2048",
      animal: "Raja",
      animalId: "AN-1027",
      location: "Ahmednagar",
      condition: "Respiratory infection suspected",
      medicine: "Supportive respiratory treatment",
      dosage: "As prescribed",
      frequency: "Twice daily",
      vet: "Dr. Mehta",
      startDate: "Sep 27, 2026",
      followUp: "Sep 30, 2026",
      status: "Active",
      notes: "Monitor breathing, appetite and temperature.",
    },
    {
      id: "TRT-600",
      caseId: "CS-2047",
      animal: "Laxmi",
      animalId: "AN-1026",
      location: "Satara",
      condition: "Fever / inflammation",
      medicine: "Supportive therapy",
      dosage: "As prescribed",
      frequency: "Once daily",
      vet: "Dr. Patil",
      startDate: "Sep 26, 2026",
      followUp: "Sep 29, 2026",
      status: "Active",
      notes: "Review laboratory findings during follow-up.",
    },
    {
      id: "TRT-599",
      caseId: "CS-2046",
      animal: "Moti",
      animalId: "AN-1025",
      location: "Pune",
      condition: "Fever",
      medicine: "Supportive treatment",
      dosage: "As prescribed",
      frequency: "Twice daily",
      vet: "Dr. Shah",
      startDate: "Sep 24, 2026",
      followUp: "Sep 28, 2026",
      status: "Follow-up Due",
      notes: "Follow-up examination pending.",
    },
    {
      id: "TRT-598",
      caseId: "CS-2045",
      animal: "Gauri",
      animalId: "AN-1024",
      location: "Nashik",
      condition: "Parasite screening",
      medicine: "Veterinary treatment",
      dosage: "As prescribed",
      frequency: "Once daily",
      vet: "Dr. Mehta",
      startDate: "Sep 20, 2026",
      followUp: "Sep 27, 2026",
      status: "Completed",
      notes: "Treatment completed and health status improved.",
    },
    {
      id: "TRT-597",
      caseId: "CS-2044",
      animal: "Kali",
      animalId: "AN-1028",
      location: "Solapur",
      condition: "Routine treatment",
      medicine: "Supportive care",
      dosage: "As prescribed",
      frequency: "Once daily",
      vet: "Dr. Patil",
      startDate: "Sep 18, 2026",
      followUp: "Sep 22, 2026",
      status: "Completed",
      notes: "No further treatment required.",
    },
  ]);

  const counts = {
    total: treatments.length,
    active: treatments.filter(
      (x) => x.status === "Active"
    ).length,
    followUp: treatments.filter(
      (x) => x.status === "Follow-up Due"
    ).length,
    completed: treatments.filter(
      (x) => x.status === "Completed"
    ).length,
  };

  const filteredTreatments = useMemo(() => {
    return treatments.filter((item) => {
      const text = (
        item.id +
        " " +
        item.caseId +
        " " +
        item.animal +
        " " +
        item.animalId +
        " " +
        item.location +
        " " +
        item.condition +
        " " +
        item.medicine +
        " " +
        item.vet
      ).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All" ||
        item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [treatments, search, filter]);

  function statusClass(status) {
    if (status === "Follow-up Due") return "followup";
    if (status === "Completed") return "completed";
    return "active";
  }

  function statusIcon(status) {
    if (status === "Follow-up Due") {
      return <AlertTriangle size={14} />;
    }

    if (status === "Completed") {
      return <CheckCircle2 size={14} />;
    }

    return <Clock3 size={14} />;
  }

  function markCompleted(id) {
    setTreatments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

    setSelected(null);
  }

  function addTreatment() {
    const newTreatment = {
      id: `TRT-${601 + treatments.length}`,
      caseId: "CS-2050",
      animal: "New Animal",
      animalId: "AN-1031",
      location: "Pune",
      condition: "Under veterinary observation",
      medicine: "Supportive treatment",
      dosage: "As prescribed",
      frequency: "Once daily",
      vet: "Dr. Mehta",
      startDate: "Sep 27, 2026",
      followUp: "Oct 01, 2026",
      status: "Active",
      notes: "New treatment plan recorded.",
    };

    setTreatments((current) => [
      newTreatment,
      ...current,
    ]);

    setShowAdd(false);
  }

  return (
    <>
      <style>{`
        .treatment-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .treatment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .treatment-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .treatment-header p {
          margin: 6px 0 0;
          color: #7d8b85;
          font-size: 12px;
        }

        .primary-btn {
          height: 39px;
          border: 0;
          border-radius: 9px;
          background: #dff46b;
          color: #29452e;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
        }

        .treatment-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .treatment-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .treatment-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #6d9135;
        }

        .treatment-stat b {
          display: block;
          color: #284c42;
          font-size: 19px;
        }

        .treatment-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .treatment-toolbar {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .treatment-search {
          flex: 1;
          min-width: 220px;
          height: 38px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          background: #fbfdfc;
        }

        .treatment-search svg {
          color: #84928c;
        }

        .treatment-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #34574d;
          font-size: 11px;
        }

        .treatment-filter {
          height: 38px;
          min-width: 145px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fff;
          color: #526b62;
          padding: 0 10px;
          outline: none;
          font-size: 10px;
          font-weight: 700;
        }

        .treatment-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-header {
          padding: 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .card-header span {
          color: #89958f;
          font-size: 9px;
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
        }

        th {
          padding: 12px 14px;
          text-align: left;
          background: #f8faf9;
          color: #7c8a84;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        td {
          padding: 13px 14px;
          border-top: 1px solid #edf1ef;
          color: #63766e;
          font-size: 9px;
        }

        td strong {
          color: #36584e;
          font-size: 10px;
        }

        .animal-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .animal-icon {
          width: 29px;
          height: 29px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #edf4e2;
          color: #668936;
        }

        .animal-cell b {
          display: block;
          color: #36584e;
          font-size: 9px;
        }

        .animal-cell span {
          display: block;
          color: #8a9791;
          margin-top: 2px;
          font-size: 7px;
        }

        .condition {
          color: #36584e;
          font-weight: 900;
        }

        .medicine {
          color: #61766d;
          font-size: 9px;
        }

        .frequency {
          color: #89958f;
          margin-top: 3px;
          font-size: 8px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          white-space: nowrap;
        }

        .status-badge.active {
          background: #fff8d9;
          color: #89751c;
        }

        .status-badge.followup {
          background: #fff0df;
          color: #b36a1c;
        }

        .status-badge.completed {
          background: #eef8df;
          color: #5d8132;
        }

        .view-btn {
          height: 29px;
          border: 1px solid #dce6e1;
          background: #fff;
          border-radius: 7px;
          color: #526b62;
          padding: 0 8px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 800;
        }

        .complete-btn {
          height: 29px;
          border: 0;
          background: #dff46b;
          color: #29452e;
          border-radius: 7px;
          padding: 0 8px;
          margin-left: 5px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
        }

        .empty-treatment {
          padding: 55px;
          text-align: center;
          color: #89958f;
          font-size: 10px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(25,48,41,.4);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .treatment-modal {
          width: min(570px, 100%);
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(20,50,40,.2);
        }

        .modal-head {
          padding: 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-head h2 {
          margin: 0;
          color: #24483e;
          font-size: 17px;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: 0;
          background: #f3f7f5;
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: #60756c;
          cursor: pointer;
        }

        .modal-body {
          padding: 18px;
        }

        .treatment-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 15px;
        }

        .treatment-heading-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: #edf4e2;
          color: #688b37;
          display: grid;
          place-items: center;
        }

        .treatment-heading h3 {
          margin: 0;
          color: #2d5147;
          font-size: 14px;
        }

        .treatment-heading span {
          display: block;
          margin-top: 3px;
          color: #89958f;
          font-size: 9px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .detail-box {
          background: #f7faf8;
          padding: 10px;
          border-radius: 9px;
        }

        .detail-box span {
          display: block;
          color: #8d9994;
          font-size: 7px;
          margin-bottom: 4px;
        }

        .detail-box b {
          color: #4c675e;
          font-size: 9px;
        }

        .notes-box {
          margin-top: 12px;
          background: #f7faf8;
          border-radius: 10px;
          padding: 12px;
        }

        .notes-box strong {
          display: block;
          color: #56766d;
          font-size: 9px;
          margin-bottom: 5px;
        }

        .notes-box p {
          margin: 0;
          color: #74847d;
          font-size: 9px;
          line-height: 1.5;
        }

        .followup-box {
          margin-top: 12px;
          background: #f0f6e6;
          border-radius: 10px;
          padding: 11px;
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .followup-box svg {
          color: #6d9135;
        }

        .followup-box div {
          color: #63775c;
          font-size: 9px;
        }

        .followup-box b {
          color: #55772f;
        }

        .add-form {
          display: grid;
          gap: 11px;
        }

        .add-form label {
          color: #60756c;
          font-size: 9px;
          font-weight: 800;
        }

        .add-form input,
        .add-form select {
          display: block;
          width: 100%;
          box-sizing: border-box;
          height: 37px;
          margin-top: 5px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          padding: 0 10px;
          background: #fbfdfc;
          outline: none;
          color: #405e55;
          font-size: 10px;
        }

        .modal-footer {
          padding: 13px 17px;
          border-top: 1px solid #e7eeeb;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .modal-footer button {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid #dce6e1;
          background: #fff;
          color: #526b62;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
        }

        .modal-footer .primary {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        @media (max-width: 800px) {
          .treatment-stats {
            grid-template-columns: 1fr 1fr;
          }

          .treatment-header {
            flex-direction: column;
          }
        }

        @media (max-width: 550px) {
          .treatment-stats {
            grid-template-columns: 1fr;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="treatment-page">

        <div className="treatment-header">

          <div>
            <h1>Treatment</h1>

            <p>
              Manage veterinary treatment plans,
              medicines, follow-ups and recovery.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() =>
              setShowAdd(true)
            }
          >
            <Plus size={16} />
            Add Treatment
          </button>

        </div>

        {/* STATS */}

        <div className="treatment-stats">

          <div className="treatment-stat">
            <div className="treatment-stat-icon">
              <Pill size={18} />
            </div>

            <div>
              <b>{counts.total}</b>
              <span>Total Treatments</span>
            </div>
          </div>

          <div className="treatment-stat">
            <div className="treatment-stat-icon">
              <Clock3 size={18} />
            </div>

            <div>
              <b>{counts.active}</b>
              <span>Active Treatment</span>
            </div>
          </div>

          <div className="treatment-stat">
            <div className="treatment-stat-icon">
              <AlertTriangle size={18} />
            </div>

            <div>
              <b>{counts.followUp}</b>
              <span>Follow-up Due</span>
            </div>
          </div>

          <div className="treatment-stat">
            <div className="treatment-stat-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <b>{counts.completed}</b>
              <span>Completed</span>
            </div>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="treatment-toolbar">

          <div className="treatment-search">

            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search animal, condition, medicine or case..."
            />

          </div>

          <select
            className="treatment-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Follow-up Due">
              Follow-up Due
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

        </div>

        {/* TABLE */}

        <section className="treatment-card">

          <div className="card-header">

            <div>
              <h2>
                Treatment Plans
              </h2>

              <span>
                {filteredTreatments.length} records
              </span>
            </div>

          </div>

          <div className="table-scroll">

            {filteredTreatments.length === 0 ? (
              <div className="empty-treatment">
                No treatment records found.
              </div>
            ) : (
              <table>

                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Condition</th>
                    <th>Medicine</th>
                    <th>Veterinarian</th>
                    <th>Follow-up</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTreatments.map(
                    (item) => (
                      <tr key={item.id}>

                        <td>

                          <div className="animal-cell">

                            <div className="animal-icon">
                              <PawPrint size={14} />
                            </div>

                            <div>
                              <b>
                                {item.animal}
                              </b>

                              <span>
                                {item.animalId} ·{" "}
                                {item.caseId}
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>
                          <div className="condition">
                            {item.condition}
                          </div>
                        </td>

                        <td>

                          <div className="medicine">
                            {item.medicine}
                          </div>

                          <div className="frequency">
                            {item.frequency} ·{" "}
                            {item.dosage}
                          </div>

                        </td>

                        <td>

                          <Stethoscope
                            size={10}
                            style={{
                              verticalAlign:
                                "middle",
                              marginRight: 3,
                            }}
                          />

                          {item.vet}

                        </td>

                        <td>

                          <CalendarDays
                            size={10}
                            style={{
                              verticalAlign:
                                "middle",
                              marginRight: 3,
                            }}
                          />

                          {item.followUp}

                        </td>

                        <td>

                          <span
                            className={`status-badge ${statusClass(
                              item.status
                            )}`}
                          >
                            {statusIcon(
                              item.status
                            )}
                            {item.status}
                          </span>

                        </td>

                        <td>

                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelected(item)
                            }
                          >
                            View
                          </button>

                          {item.status !==
                            "Completed" && (
                            <button
                              className="complete-btn"
                              onClick={() =>
                                markCompleted(
                                  item.id
                                )
                              }
                            >
                              Complete
                            </button>
                          )}

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>
            )}

          </div>

        </section>

      </div>

      {/* DETAILS MODAL */}

      {selected && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="treatment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>
                Treatment Details
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setSelected(null)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="treatment-heading">

                <div className="treatment-heading-icon">
                  <Pill size={21} />
                </div>

                <div>
                  <h3>
                    {selected.animal}
                  </h3>

                  <span>
                    {selected.animalId} ·{" "}
                    {selected.caseId}
                  </span>
                </div>

              </div>

              <div className="detail-grid">

                <div className="detail-box">
                  <span>CONDITION</span>
                  <b>
                    {selected.condition}
                  </b>
                </div>

                <div className="detail-box">
                  <span>MEDICINE</span>
                  <b>
                    {selected.medicine}
                  </b>
                </div>

                <div className="detail-box">
                  <span>DOSAGE</span>
                  <b>
                    {selected.dosage}
                  </b>
                </div>

                <div className="detail-box">
                  <span>FREQUENCY</span>
                  <b>
                    {selected.frequency}
                  </b>
                </div>

                <div className="detail-box">
                  <span>START DATE</span>
                  <b>
                    {selected.startDate}
                  </b>
                </div>

                <div className="detail-box">
                  <span>VETERINARIAN</span>
                  <b>
                    {selected.vet}
                  </b>
                </div>

              </div>

              <div className="notes-box">

                <strong>
                  VETERINARY NOTES
                </strong>

                <p>
                  {selected.notes}
                </p>

              </div>

              <div className="followup-box">

                <CalendarDays size={18} />

                <div>
                  Follow-up scheduled for{" "}
                  <b>
                    {selected.followUp}
                  </b>
                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setSelected(null)
                }
              >
                Close
              </button>

              <button
                className="primary"
                onClick={() =>
                  markCompleted(
                    selected.id
                  )
                }
              >
                Mark Completed
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ADD TREATMENT MODAL */}

      {showAdd && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowAdd(false)
          }
        >

          <div
            className="treatment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>
                Add Treatment Plan
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowAdd(false)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="add-form">

                <label>
                  Animal ID
                  <input
                    placeholder="e.g. AN-1027"
                  />
                </label>

                <label>
                  Case ID
                  <input
                    placeholder="e.g. CS-2048"
                  />
                </label>

                <label>
                  Condition
                  <input
                    placeholder="Enter condition"
                  />
                </label>

                <label>
                  Medicine / Treatment
                  <input
                    placeholder="Enter treatment"
                  />
                </label>

                <label>
                  Frequency
                  <select>
                    <option>
                      Once daily
                    </option>
                    <option>
                      Twice daily
                    </option>
                    <option>
                      As prescribed
                    </option>
                  </select>
                </label>

                <label>
                  Veterinarian
                  <select>
                    <option>
                      Dr. Mehta
                    </option>
                    <option>
                      Dr. Patil
                    </option>
                    <option>
                      Dr. Shah
                    </option>
                  </select>
                </label>

                <label>
                  Follow-up Date
                  <input
                    type="date"
                    defaultValue="2026-10-01"
                  />
                </label>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setShowAdd(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={addTreatment}
              >
                Save Treatment
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Treatment;