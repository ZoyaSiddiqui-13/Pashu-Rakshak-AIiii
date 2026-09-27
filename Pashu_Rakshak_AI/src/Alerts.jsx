import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  PawPrint,
  Search,
  Stethoscope,
  Syringe,
  FlaskConical,
  X,
} from "lucide-react";

function Alerts() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState([
    {
      id: "ALT-1001",
      level: "Critical",
      title: "High-risk respiratory symptoms detected",
      description:
        "AI screening identified an elevated health risk requiring veterinary review.",
      animal: "Raja",
      animalId: "AN-1027",
      location: "Satara",
      caseId: "CS-2048",
      time: "12 min ago",
      type: "AI Screening",
      unread: true,
    },
    {
      id: "ALT-1002",
      level: "Critical",
      title: "Possible disease cluster detected",
      description:
        "Multiple related respiratory cases have been reported in the same region.",
      animal: "4 animals",
      animalId: "Regional",
      location: "Satara District",
      caseId: "OB-031",
      time: "18 min ago",
      type: "Outbreak",
      unread: true,
    },
    {
      id: "ALT-1003",
      level: "High",
      title: "Possible fever cluster",
      description:
        "Several animals in the monitored area show similar fever-related observations.",
      animal: "4 animals",
      animalId: "Regional",
      location: "Nashik",
      caseId: "CS-2047",
      time: "38 min ago",
      type: "Disease Watch",
      unread: true,
    },
    {
      id: "ALT-1004",
      level: "High",
      title: "Veterinarian review pending",
      description:
        "A high-risk case is waiting for veterinarian assessment.",
      animal: "Laxmi",
      animalId: "AN-1026",
      location: "Satara",
      caseId: "CS-2047",
      time: "1 hr ago",
      type: "Veterinarian",
      unread: false,
    },
    {
      id: "ALT-1005",
      level: "Medium",
      title: "Vaccination due tomorrow",
      description:
        "Scheduled vaccination is due for animals in the selected farm.",
      animal: "12 animals",
      animalId: "Farm-12",
      location: "Pune",
      caseId: "VAC-881",
      time: "2 hr ago",
      type: "Vaccination",
      unread: false,
    },
    {
      id: "ALT-1006",
      level: "Medium",
      title: "Laboratory report available",
      description:
        "A laboratory report has been completed and is ready for review.",
      animal: "Moti",
      animalId: "AN-1025",
      location: "Pune",
      caseId: "LAB-8030",
      time: "3 hr ago",
      type: "Laboratory",
      unread: false,
    },
    {
      id: "ALT-1007",
      level: "Normal",
      title: "Follow-up scheduled",
      description:
        "A follow-up consultation has been scheduled for an animal under treatment.",
      animal: "Gauri",
      animalId: "AN-1024",
      location: "Nashik",
      caseId: "CS-2045",
      time: "5 hr ago",
      type: "Follow-up",
      unread: false,
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);

  const counts = useMemo(() => {
    return {
      All: alerts.length,
      Critical: alerts.filter((a) => a.level === "Critical").length,
      High: alerts.filter((a) => a.level === "High").length,
      Medium: alerts.filter((a) => a.level === "Medium").length,
      Normal: alerts.filter((a) => a.level === "Normal").length,
    };
  }, [alerts]);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter =
      filter === "All" || alert.level === filter;

    const text = (
      alert.title +
      " " +
      alert.description +
      " " +
      alert.animal +
      " " +
      alert.location +
      " " +
      alert.caseId +
      " " +
      alert.type
    ).toLowerCase();

    return (
      matchesFilter &&
      text.includes(search.toLowerCase())
    );
  });

  function markAsRead(id) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, unread: false }
          : alert
      )
    );
  }

  function markAllRead() {
    setAlerts((current) =>
      current.map((alert) => ({
        ...alert,
        unread: false,
      }))
    );
  }

  function openAlert(alert) {
    markAsRead(alert.id);
    setSelectedAlert(alert);
  }

  function getIcon(type) {
    if (type === "Veterinarian") {
      return <Stethoscope size={19} />;
    }

    if (type === "Vaccination") {
      return <Syringe size={19} />;
    }

    if (type === "Laboratory") {
      return <FlaskConical size={19} />;
    }

    if (type === "Follow-up") {
      return <Clock3 size={19} />;
    }

    return <AlertTriangle size={19} />;
  }

  return (
    <>
      <style>{`
        .alerts-page {
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .alerts-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .alerts-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .alerts-header p {
          margin: 6px 0 0;
          color: #7d8c85;
          font-size: 12px;
        }

        .unread-count {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #eef8df;
          color: #5d7f32;
          padding: 10px 13px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
        }

        .filter-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .alert-search {
          height: 38px;
          flex: 1;
          min-width: 220px;
          border: 1px solid #dce6e1;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          background: #fbfdfc;
        }

        .alert-search svg {
          color: #8a9892;
        }

        .alert-search input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          color: #34574d;
          font-size: 11px;
        }

        .filter-btn {
          height: 36px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fff;
          color: #526b62;
          padding: 0 11px;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .filter-btn.active {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        .filter-btn.critical {
          color: #b53e3e;
        }

        .filter-btn.high {
          color: #b46a1d;
        }

        .filter-btn.medium {
          color: #88741c;
        }

        .mark-read-btn {
          height: 36px;
          border: 1px solid #dce6e1;
          background: #fff;
          color: #526b62;
          border-radius: 8px;
          padding: 0 11px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        .alerts-layout {
          display: grid;
          grid-template-columns: 1.65fr 0.8fr;
          gap: 15px;
        }

        .alerts-list {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .list-top {
          padding: 17px;
          border-bottom: 1px solid #e8eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-top h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .list-top span {
          color: #8a9791;
          font-size: 10px;
        }

        .alert-item {
          padding: 16px;
          border-bottom: 1px solid #edf1ef;
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: 0.18s;
          position: relative;
        }

        .alert-item:hover {
          background: #fbfdfc;
        }

        .alert-item.unread {
          background: #fcfef9;
        }

        .alert-item.unread::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #91b63f;
        }

        .alert-icon-box {
          min-width: 40px;
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: grid;
          place-items: center;
        }

        .alert-icon-box.critical {
          background: #fde8e8;
          color: #bd4242;
        }

        .alert-icon-box.high {
          background: #fff0df;
          color: #bd731f;
        }

        .alert-icon-box.medium {
          background: #fff8d9;
          color: #927d1b;
        }

        .alert-icon-box.normal {
          background: #eef8df;
          color: #648537;
        }

        .alert-main {
          min-width: 0;
          flex: 1;
        }

        .alert-title-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .alert-title-row h3 {
          margin: 0;
          color: #2d5147;
          font-size: 12px;
        }

        .alert-description {
          margin: 5px 0 8px;
          color: #7d8b85;
          font-size: 10px;
          line-height: 1.5;
        }

        .alert-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          color: #839089;
          font-size: 9px;
        }

        .alert-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .level-pill {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
        }

        .level-pill.critical {
          background: #fde8e8;
          color: #b53e3e;
        }

        .level-pill.high {
          background: #fff0df;
          color: #b46a1d;
        }

        .level-pill.medium {
          background: #fff8d9;
          color: #88741c;
        }

        .level-pill.normal {
          background: #eef8df;
          color: #5e8033;
        }

        .unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #91b63f;
          margin-top: 5px;
        }

        .empty-alerts {
          padding: 50px 20px;
          text-align: center;
          color: #8b9892;
        }

        .empty-alerts svg {
          margin-bottom: 8px;
        }

        .summary-panel {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          padding: 17px;
          height: fit-content;
        }

        .summary-panel h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .summary-panel > p {
          margin: 5px 0 16px;
          color: #89958f;
          font-size: 10px;
        }

        .summary-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px;
          border-radius: 10px;
          margin-bottom: 8px;
          background: #f8faf9;
        }

        .summary-box div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-box b {
          font-size: 15px;
          color: #2d5147;
        }

        .summary-box span {
          font-size: 10px;
          color: #718079;
        }

        .summary-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .summary-color.critical {
          background: #c84747;
        }

        .summary-color.high {
          background: #e49a38;
        }

        .summary-color.medium {
          background: #d5b84a;
        }

        .summary-color.normal {
          background: #78a654;
        }

        .selected-panel {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #e8eeeb;
        }

        .selected-panel h3 {
          margin: 0 0 10px;
          color: #315248;
          font-size: 12px;
        }

        .selected-card {
          background: #f8faf9;
          border-radius: 11px;
          padding: 12px;
        }

        .selected-card h4 {
          margin: 0;
          color: #2d5147;
          font-size: 12px;
        }

        .selected-card p {
          margin: 6px 0;
          color: #7e8c85;
          font-size: 9px;
          line-height: 1.5;
        }

        .selected-actions {
          display: flex;
          gap: 7px;
          margin-top: 10px;
        }

        .selected-actions button {
          flex: 1;
          height: 32px;
          border-radius: 7px;
          border: 1px solid #d9e4df;
          background: #fff;
          color: #4c685e;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .selected-actions button.primary-action {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(25, 48, 41, 0.38);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .alert-modal {
          width: min(520px, 100%);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(20,50,40,.2);
          overflow: hidden;
        }

        .modal-head {
          padding: 17px;
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

        .close-modal {
          border: 0;
          background: #f4f7f5;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: #60756c;
        }

        .modal-body {
          padding: 18px;
        }

        .modal-level {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .modal-body h3 {
          color: #315248;
          font-size: 14px;
          margin: 0 0 7px;
        }

        .modal-body p {
          color: #788780;
          font-size: 10px;
          line-height: 1.6;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 15px;
        }

        .detail-box {
          background: #f7faf8;
          padding: 11px;
          border-radius: 9px;
        }

        .detail-box span {
          display: block;
          color: #89958f;
          font-size: 8px;
          margin-bottom: 4px;
        }

        .detail-box b {
          color: #36574e;
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
          height: 35px;
          padding: 0 13px;
          border-radius: 8px;
          border: 1px solid #d9e4df;
          background: #fff;
          color: #526b62;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .modal-footer .primary-action {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        @media (max-width: 900px) {
          .alerts-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .alerts-header {
            flex-direction: column;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .alert-title-row {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="alerts-page">

        <div className="alerts-header">

          <div>
            <h1>Alerts & Early Warning</h1>

            <p>
              Prioritized alerts from AI screening,
              cases, vaccination and follow-ups.
            </p>
          </div>

          <div className="unread-count">
            <Bell size={14} />
            {
              alerts.filter(
                (alert) => alert.unread
              ).length
            } unread alerts
          </div>

        </div>

        <div className="filter-card">

          <div className="alert-search">
            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search alerts, animal, case or location..."
            />
          </div>

          {[
            "All",
            "Critical",
            "High",
            "Medium",
            "Normal",
          ].map((item) => (
            <button
              key={item}
              className={`filter-btn ${
                filter === item
                  ? "active"
                  : ""
              } ${item.toLowerCase()}`}
              onClick={() =>
                setFilter(item)
              }
            >
              {item} {counts[item]}
            </button>
          ))}

          <button
            className="mark-read-btn"
            onClick={markAllRead}
          >
            <CheckCircle2
              size={13}
              style={{
                verticalAlign: "middle",
                marginRight: 5,
              }}
            />
            Mark all read
          </button>

        </div>

        <div className="alerts-layout">

          <section className="alerts-list">

            <div className="list-top">

              <div>
                <h2>Active Alerts</h2>
                <span>
                  Showing {filteredAlerts.length} alerts
                </span>
              </div>

            </div>

            {filteredAlerts.length === 0 ? (
              <div className="empty-alerts">
                <CheckCircle2 size={35} />
                <div>No alerts found.</div>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  className={`alert-item ${
                    alert.unread
                      ? "unread"
                      : ""
                  }`}
                  key={alert.id}
                  onClick={() =>
                    openAlert(alert)
                  }
                >

                  <div
                    className={`alert-icon-box ${alert.level.toLowerCase()}`}
                  >
                    {getIcon(alert.type)}
                  </div>

                  <div className="alert-main">

                    <div className="alert-title-row">

                      <h3>
                        {alert.title}
                      </h3>

                      <span
                        className={`level-pill ${alert.level.toLowerCase()}`}
                      >
                        {alert.level}
                      </span>

                    </div>

                    <p className="alert-description">
                      {alert.description}
                    </p>

                    <div className="alert-meta">

                      <span>
                        <PawPrint size={11} />
                        {alert.animal}
                      </span>

                      <span>
                        <MapPin size={11} />
                        {alert.location}
                      </span>

                      <span>
                        <Clock3 size={11} />
                        {alert.time}
                      </span>

                      <span>
                        {alert.caseId}
                      </span>

                    </div>

                  </div>

                  {alert.unread && (
                    <span className="unread-dot"></span>
                  )}

                  <ChevronRight
                    size={15}
                    style={{
                      color: "#9aa7a1",
                      alignSelf: "center",
                    }}
                  />

                </div>
              ))
            )}

          </section>

          <aside className="summary-panel">

            <h2>Alert Overview</h2>

            <p>
              Current priority distribution
            </p>

            {[
              ["Critical", counts.Critical],
              ["High", counts.High],
              ["Medium", counts.Medium],
              ["Normal", counts.Normal],
            ].map(([level, count]) => (
              <div
                className="summary-box"
                key={level}
              >

                <div>

                  <span
                    className={`summary-color ${level.toLowerCase()}`}
                  />

                  <span>{level}</span>

                </div>

                <b>{count}</b>

              </div>
            ))}

            {selectedAlert && (
              <div className="selected-panel">

                <h3>Selected Alert</h3>

                <div className="selected-card">

                  <h4>
                    {selectedAlert.title}
                  </h4>

                  <p>
                    {selectedAlert.description}
                  </p>

                  <span
                    className={`level-pill ${selectedAlert.level.toLowerCase()}`}
                  >
                    {selectedAlert.level}
                  </span>

                  <div className="selected-actions">

                    <button
                      onClick={() =>
                        setSelectedAlert(null)
                      }
                    >
                      Close
                    </button>

                    <button
                      className="primary-action"
                      onClick={() =>
                        alert(
                          `Opening ${selectedAlert.caseId}`
                        )
                      }
                    >
                      Open Case
                    </button>

                  </div>

                </div>

              </div>
            )}

          </aside>

        </div>

      </div>

      {selectedAlert && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedAlert(null)
          }
        >

          <div
            className="alert-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>Alert Details</h2>

              <button
                className="close-modal"
                onClick={() =>
                  setSelectedAlert(null)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="modal-level">

                <span
                  className={`level-pill ${selectedAlert.level.toLowerCase()}`}
                >
                  {selectedAlert.level}
                </span>

                <span
                  style={{
                    color: "#8a9791",
                    fontSize: 9,
                  }}
                >
                  {selectedAlert.id}
                </span>

              </div>

              <h3>
                {selectedAlert.title}
              </h3>

              <p>
                {selectedAlert.description}
              </p>

              <div className="detail-grid">

                <div className="detail-box">
                  <span>ANIMAL</span>
                  <b>
                    {selectedAlert.animal}
                  </b>
                </div>

                <div className="detail-box">
                  <span>ANIMAL ID</span>
                  <b>
                    {selectedAlert.animalId}
                  </b>
                </div>

                <div className="detail-box">
                  <span>LOCATION</span>
                  <b>
                    {selectedAlert.location}
                  </b>
                </div>

                <div className="detail-box">
                  <span>RELATED CASE</span>
                  <b>
                    {selectedAlert.caseId}
                  </b>
                </div>

                <div className="detail-box">
                  <span>ALERT TYPE</span>
                  <b>
                    {selectedAlert.type}
                  </b>
                </div>

                <div className="detail-box">
                  <span>REPORTED</span>
                  <b>
                    {selectedAlert.time}
                  </b>
                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
              >
                Close
              </button>

              <button
                className="primary-action"
                onClick={() =>
                  alert(
                    `Case ${selectedAlert.caseId} selected`
                  )
                }
              >
                View Related Case
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Alerts;