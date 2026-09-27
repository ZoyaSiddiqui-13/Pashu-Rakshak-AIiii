import React, { useMemo, useState } from "react";
import {
  Syringe,
  Search,
  Plus,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  PawPrint,
  MapPin,
  UserRound,
  X,
  Bell,
} from "lucide-react";

function Vaccination() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const [vaccinations, setVaccinations] = useState([
    {
      id: "VAC-881",
      animal: "Raja",
      animalId: "AN-1027",
      type: "Goat",
      location: "Ahmednagar",
      vaccine: "PPR",
      dose: "1st Dose",
      dueDate: "Sep 28, 2026",
      vet: "Dr. Mehta",
      status: "Due Soon",
      lastDose: "Mar 28, 2026",
      nextDose: "Sep 28, 2026",
    },
    {
      id: "VAC-880",
      animal: "Laxmi",
      animalId: "AN-1026",
      type: "Cow",
      location: "Satara",
      vaccine: "FMD",
      dose: "Booster",
      dueDate: "Sep 29, 2026",
      vet: "Dr. Patil",
      status: "Scheduled",
      lastDose: "Mar 29, 2026",
      nextDose: "Sep 29, 2026",
    },
    {
      id: "VAC-879",
      animal: "Moti",
      animalId: "AN-1025",
      type: "Buffalo",
      location: "Pune",
      vaccine: "HS",
      dose: "Booster",
      dueDate: "Sep 27, 2026",
      vet: "Dr. Shah",
      status: "Due Today",
      lastDose: "Mar 27, 2026",
      nextDose: "Sep 27, 2026",
    },
    {
      id: "VAC-878",
      animal: "Gauri",
      animalId: "AN-1024",
      type: "Cow",
      location: "Nashik",
      vaccine: "FMD",
      dose: "Booster",
      dueDate: "Sep 25, 2026",
      vet: "Dr. Mehta",
      status: "Completed",
      lastDose: "Sep 25, 2026",
      nextDose: "Mar 25, 2027",
    },
    {
      id: "VAC-877",
      animal: "Kali",
      animalId: "AN-1028",
      type: "Sheep",
      location: "Solapur",
      vaccine: "PPR",
      dose: "1st Dose",
      dueDate: "Sep 23, 2026",
      vet: "Dr. Patil",
      status: "Overdue",
      lastDose: "Mar 23, 2026",
      nextDose: "Sep 23, 2026",
    },
    {
      id: "VAC-876",
      animal: "Maya",
      animalId: "AN-1029",
      type: "Cow",
      location: "Thane",
      vaccine: "Brucellosis",
      dose: "Booster",
      dueDate: "Oct 02, 2026",
      vet: "Dr. Shah",
      status: "Scheduled",
      lastDose: "Apr 02, 2026",
      nextDose: "Oct 02, 2026",
    },
    {
      id: "VAC-875",
      animal: "Sita",
      animalId: "AN-1030",
      type: "Cow",
      location: "Nashik",
      vaccine: "FMD",
      dose: "Booster",
      dueDate: "Sep 20, 2026",
      vet: "Dr. Mehta",
      status: "Completed",
      lastDose: "Sep 20, 2026",
      nextDose: "Mar 20, 2027",
    },
  ]);

  const counts = {
    total: vaccinations.length,
    due: vaccinations.filter(
      (x) =>
        x.status === "Due Soon" ||
        x.status === "Due Today"
    ).length,
    overdue: vaccinations.filter(
      (x) => x.status === "Overdue"
    ).length,
    completed: vaccinations.filter(
      (x) => x.status === "Completed"
    ).length,
  };

  const filteredVaccinations = useMemo(() => {
    return vaccinations.filter((item) => {
      const text = (
        item.id +
        " " +
        item.animal +
        " " +
        item.animalId +
        " " +
        item.vaccine +
        " " +
        item.location +
        " " +
        item.vet +
        " " +
        item.status
      ).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All" ||
        item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [vaccinations, search, filter]);

  function statusClass(status) {
    if (status === "Overdue") return "overdue";
    if (status === "Due Today") return "today";
    if (status === "Due Soon") return "due";
    if (status === "Scheduled") return "scheduled";
    return "completed";
  }

  function statusIcon(status) {
    if (status === "Overdue") {
      return <AlertTriangle size={14} />;
    }

    if (
      status === "Due Today" ||
      status === "Due Soon"
    ) {
      return <Clock3 size={14} />;
    }

    if (status === "Scheduled") {
      return <CalendarDays size={14} />;
    }

    return <CheckCircle2 size={14} />;
  }

  function markCompleted(id) {
    setVaccinations((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
              lastDose: item.dueDate,
              nextDose: "Mar 2027",
            }
          : item
      )
    );

    setSelected(null);
  }

  function createSchedule() {
    const newItem = {
      id: `VAC-${881 + vaccinations.length}`,
      animal: "New Animal",
      animalId: "AN-1031",
      type: "Cow",
      location: "Pune",
      vaccine: "FMD",
      dose: "Booster",
      dueDate: "Oct 05, 2026",
      vet: "Dr. Mehta",
      status: "Scheduled",
      lastDose: "Apr 05, 2026",
      nextDose: "Oct 05, 2026",
    };

    setVaccinations((current) => [
      newItem,
      ...current,
    ]);

    setShowSchedule(false);
  }

  return (
    <>
      <style>{`
        .vacc-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .vacc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .vacc-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .vacc-header p {
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

        .vacc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .vacc-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .vacc-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #6d9135;
        }

        .vacc-stat b {
          display: block;
          color: #284c42;
          font-size: 19px;
        }

        .vacc-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .vacc-toolbar {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .vacc-search {
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

        .vacc-search svg {
          color: #84928c;
        }

        .vacc-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #34574d;
          font-size: 11px;
        }

        .vacc-filter {
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

        .vacc-table-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .table-head {
          padding: 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-head h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .table-head span {
          color: #89958f;
          font-size: 9px;
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
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

        .vaccine-name {
          color: #36584e;
          font-weight: 900;
        }

        .vaccine-dose {
          color: #8a9791;
          font-size: 8px;
          margin-top: 3px;
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

        .status-badge.overdue {
          background: #fde8e8;
          color: #b43e3e;
        }

        .status-badge.today {
          background: #fff0df;
          color: #b36a1c;
        }

        .status-badge.due {
          background: #fff8d9;
          color: #89751c;
        }

        .status-badge.scheduled {
          background: #e8f2ff;
          color: #4773a7;
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
          display: inline-flex;
          align-items: center;
          gap: 4px;
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

        .empty-vacc {
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

        .vacc-modal {
          width: min(540px, 100%);
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

        .animal-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 15px;
        }

        .animal-heading-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: #edf4e2;
          color: #688b37;
          display: grid;
          place-items: center;
        }

        .animal-heading h3 {
          margin: 0;
          color: #2d5147;
          font-size: 14px;
        }

        .animal-heading span {
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

        .reminder-box {
          margin-top: 12px;
          background: #f0f6e6;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          gap: 9px;
          align-items: flex-start;
        }

        .reminder-box svg {
          color: #6d9135;
          flex-shrink: 0;
        }

        .reminder-box strong {
          display: block;
          color: #56772f;
          font-size: 9px;
        }

        .reminder-box p {
          margin: 4px 0 0;
          color: #718064;
          font-size: 8px;
          line-height: 1.5;
        }

        .schedule-form {
          display: grid;
          gap: 11px;
        }

        .schedule-form label {
          color: #60756c;
          font-size: 9px;
          font-weight: 800;
        }

        .schedule-form input,
        .schedule-form select {
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
          .vacc-stats {
            grid-template-columns: 1fr 1fr;
          }

          .vacc-header {
            flex-direction: column;
          }
        }

        @media (max-width: 550px) {
          .vacc-stats {
            grid-template-columns: 1fr;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="vacc-page">

        <div className="vacc-header">

          <div>
            <h1>Vaccination</h1>

            <p>
              Manage vaccination schedules,
              reminders, completed doses and
              overdue animals.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() =>
              setShowSchedule(true)
            }
          >
            <Plus size={16} />
            Schedule Vaccine
          </button>

        </div>

        {/* STATS */}

        <div className="vacc-stats">

          <div className="vacc-stat">
            <div className="vacc-stat-icon">
              <Syringe size={18} />
            </div>

            <div>
              <b>{counts.total}</b>
              <span>Total Schedules</span>
            </div>
          </div>

          <div className="vacc-stat">
            <div className="vacc-stat-icon">
              <Clock3 size={18} />
            </div>

            <div>
              <b>{counts.due}</b>
              <span>Due Soon / Today</span>
            </div>
          </div>

          <div className="vacc-stat">
            <div className="vacc-stat-icon">
              <AlertTriangle size={18} />
            </div>

            <div>
              <b>{counts.overdue}</b>
              <span>Overdue</span>
            </div>
          </div>

          <div className="vacc-stat">
            <div className="vacc-stat-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <b>{counts.completed}</b>
              <span>Completed</span>
            </div>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="vacc-toolbar">

          <div className="vacc-search">

            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search animal, vaccine, location or vet..."
            />

          </div>

          <select
            className="vacc-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All statuses
            </option>

            <option value="Due Today">
              Due Today
            </option>

            <option value="Due Soon">
              Due Soon
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Overdue">
              Overdue
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

        </div>

        {/* TABLE */}

        <section className="vacc-table-card">

          <div className="table-head">

            <div>
              <h2>
                Vaccination Schedule
              </h2>

              <span>
                {filteredVaccinations.length} records
              </span>
            </div>

          </div>

          <div className="table-scroll">

            {filteredVaccinations.length === 0 ? (
              <div className="empty-vacc">
                No vaccination records found.
              </div>
            ) : (
              <table>

                <thead>
                  <tr>
                    <th>Animal</th>
                    <th>Vaccine</th>
                    <th>Due Date</th>
                    <th>Location</th>
                    <th>Veterinarian</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredVaccinations.map(
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
                                {item.id}
                              </span>
                            </div>

                          </div>

                        </td>

                        <td>

                          <div className="vaccine-name">
                            {item.vaccine}
                          </div>

                          <div className="vaccine-dose">
                            {item.dose}
                          </div>

                        </td>

                        <td>
                          <strong>
                            {item.dueDate}
                          </strong>
                        </td>

                        <td>

                          <MapPin
                            size={10}
                            style={{
                              verticalAlign:
                                "middle",
                              marginRight: 3,
                            }}
                          />

                          {item.location}

                        </td>

                        <td>
                          {item.vet}
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
            className="vacc-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>
                Vaccination Details
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

              <div className="animal-heading">

                <div className="animal-heading-icon">
                  <PawPrint size={21} />
                </div>

                <div>
                  <h3>
                    {selected.animal}
                  </h3>

                  <span>
                    {selected.animalId} ·{" "}
                    {selected.type} ·{" "}
                    {selected.location}
                  </span>
                </div>

              </div>

              <div className="detail-grid">

                <div className="detail-box">
                  <span>VACCINE</span>
                  <b>{selected.vaccine}</b>
                </div>

                <div className="detail-box">
                  <span>DOSE</span>
                  <b>{selected.dose}</b>
                </div>

                <div className="detail-box">
                  <span>DUE DATE</span>
                  <b>{selected.dueDate}</b>
                </div>

                <div className="detail-box">
                  <span>VETERINARIAN</span>
                  <b>{selected.vet}</b>
                </div>

                <div className="detail-box">
                  <span>LAST DOSE</span>
                  <b>{selected.lastDose}</b>
                </div>

                <div className="detail-box">
                  <span>NEXT DOSE</span>
                  <b>{selected.nextDose}</b>
                </div>

              </div>

              <div
                style={{
                  marginTop: 13,
                }}
              >
                <span
                  className={`status-badge ${statusClass(
                    selected.status
                  )}`}
                >
                  {statusIcon(selected.status)}
                  {selected.status}
                </span>
              </div>

              <div className="reminder-box">

                <Bell size={17} />

                <div>
                  <strong>
                    Vaccination Reminder
                  </strong>

                  <p>
                    The system can notify the farm
                    admin and assigned veterinarian
                    before the vaccination due date.
                  </p>
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

              {selected.status !==
                "Completed" && (
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
              )}

            </div>

          </div>

        </div>
      )}

      {/* SCHEDULE MODAL */}

      {showSchedule && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowSchedule(false)
          }
        >

          <div
            className="vacc-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>
                Schedule Vaccination
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowSchedule(false)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="schedule-form">

                <label>
                  Animal ID
                  <input
                    placeholder="e.g. AN-1027"
                  />
                </label>

                <label>
                  Vaccine
                  <select>
                    <option>FMD</option>
                    <option>HS</option>
                    <option>PPR</option>
                    <option>Brucellosis</option>
                    <option>Rabies</option>
                  </select>
                </label>

                <label>
                  Dose
                  <select>
                    <option>1st Dose</option>
                    <option>2nd Dose</option>
                    <option>Booster</option>
                  </select>
                </label>

                <label>
                  Due Date
                  <input
                    type="date"
                    defaultValue="2026-10-05"
                  />
                </label>

                <label>
                  Veterinarian
                  <select>
                    <option>Dr. Mehta</option>
                    <option>Dr. Patil</option>
                    <option>Dr. Shah</option>
                  </select>
                </label>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setShowSchedule(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={createSchedule}
              >
                Schedule Vaccine
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Vaccination;