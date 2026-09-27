import React, { useMemo, useState } from "react";
import {
  MapPinned,
  Search,
  AlertTriangle,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Clock3,
  X,
  Eye,
  MapPin,
} from "lucide-react";

function Outbreaks() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const [outbreaks, setOutbreaks] = useState([
    {
      id: "OB-101",
      disease: "Respiratory Disease Cluster",
      region: "Ahmednagar",
      state: "Maharashtra",
      cases: 18,
      animals: 31,
      risk: "Critical",
      status: "Active",
      detected: "Sep 27, 2026",
      lastUpdate: "15 min ago",
      source: "AI Surveillance",
      description:
        "Multiple animals reported with respiratory symptoms in nearby farms.",
      action:
        "Veterinary verification and field investigation recommended.",
    },
    {
      id: "OB-100",
      disease: "Fever Pattern",
      region: "Satara",
      state: "Maharashtra",
      cases: 11,
      animals: 19,
      risk: "High",
      status: "Monitoring",
      detected: "Sep 26, 2026",
      lastUpdate: "1 hr ago",
      source: "Health Records",
      description:
        "Increasing fever-related cases detected across multiple farms.",
      action:
        "Continue monitoring and review recent laboratory results.",
    },
    {
      id: "OB-099",
      disease: "Digestive Health Cluster",
      region: "Pune",
      state: "Maharashtra",
      cases: 7,
      animals: 12,
      risk: "Medium",
      status: "Monitoring",
      detected: "Sep 25, 2026",
      lastUpdate: "3 hrs ago",
      source: "AI Surveillance",
      description:
        "Several animals showing similar digestive symptoms.",
      action:
        "Observe affected animals and schedule veterinary review.",
    },
    {
      id: "OB-098",
      disease: "Parasite Risk Cluster",
      region: "Nashik",
      state: "Maharashtra",
      cases: 5,
      animals: 9,
      risk: "Medium",
      status: "Resolved",
      detected: "Sep 20, 2026",
      lastUpdate: "Yesterday",
      source: "Veterinarian",
      description:
        "Previously reported parasite-related cases have been resolved.",
      action:
        "Continue routine health surveillance.",
    },
  ]);

  const counts = {
    total: outbreaks.length,
    critical: outbreaks.filter(
      (item) => item.risk === "Critical"
    ).length,
    active: outbreaks.filter(
      (item) => item.status === "Active"
    ).length,
    monitoring: outbreaks.filter(
      (item) => item.status === "Monitoring"
    ).length,
  };

  const filtered = useMemo(() => {
    return outbreaks.filter((item) => {
      const text = (
        item.id +
        " " +
        item.disease +
        " " +
        item.region +
        " " +
        item.state +
        " " +
        item.risk +
        " " +
        item.status
      ).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All" ||
        item.risk === filter ||
        item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [outbreaks, search, filter]);

  function riskClass(risk) {
    if (risk === "Critical") return "critical";
    if (risk === "High") return "high";
    if (risk === "Medium") return "medium";
    return "low";
  }

  function statusClass(status) {
    if (status === "Resolved") return "resolved";
    if (status === "Monitoring") return "monitoring";
    return "active";
  }

  function resolveOutbreak(id) {
    setOutbreaks((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Resolved",
              lastUpdate: "Just now",
            }
          : item
      )
    );

    setSelected(null);
  }

  return (
    <>
      <style>{`
        .outbreak-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .outbreak-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .outbreak-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .outbreak-header p {
          margin: 6px 0 0;
          color: #7d8b85;
          font-size: 12px;
        }

        .surveillance-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #eef7df;
          color: #648536;
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 9px;
          font-weight: 900;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #78a33c;
          box-shadow: 0 0 0 4px rgba(120,163,60,.12);
        }

        .outbreak-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .outbreak-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .outbreak-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #6d9135;
        }

        .outbreak-stat b {
          display: block;
          color: #284c42;
          font-size: 19px;
        }

        .outbreak-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .outbreak-toolbar {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .outbreak-search {
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

        .outbreak-search svg {
          color: #84928c;
        }

        .outbreak-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #34574d;
          font-size: 11px;
        }

        .outbreak-filter {
          height: 38px;
          min-width: 150px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fff;
          color: #526b62;
          padding: 0 10px;
          outline: none;
          font-size: 10px;
          font-weight: 700;
        }

        .outbreak-layout {
          display: grid;
          grid-template-columns: 1.5fr .8fr;
          gap: 15px;
        }

        .outbreak-card,
        .map-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-head {
          padding: 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-head h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .card-head span {
          color: #89958f;
          font-size: 9px;
        }

        .outbreak-list {
          padding: 8px;
        }

        .outbreak-item {
          padding: 14px;
          border-bottom: 1px solid #edf1ef;
          cursor: pointer;
          transition: .15s;
        }

        .outbreak-item:last-child {
          border-bottom: 0;
        }

        .outbreak-item:hover {
          background: #fbfdfb;
        }

        .outbreak-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }

        .disease-title {
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .disease-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: #fff2e7;
          color: #c56e28;
        }

        .disease-title h3 {
          margin: 0;
          color: #36584e;
          font-size: 11px;
        }

        .disease-title p {
          margin: 3px 0 0;
          color: #8a9791;
          font-size: 8px;
        }

        .risk-badge,
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

        .risk-badge.critical {
          background: #ffe7e4;
          color: #b43d35;
        }

        .risk-badge.high {
          background: #fff0df;
          color: #b76a1d;
        }

        .risk-badge.medium {
          background: #fff8d8;
          color: #89751c;
        }

        .risk-badge.low {
          background: #eef8df;
          color: #5e8132;
        }

        .status-badge.active {
          background: #ffe8e5;
          color: #ae433c;
        }

        .status-badge.monitoring {
          background: #fff8dc;
          color: #8c761e;
        }

        .status-badge.resolved {
          background: #eef8df;
          color: #5d8132;
        }

        .outbreak-meta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 13px;
        }

        .meta-box {
          background: #f7faf8;
          border-radius: 8px;
          padding: 8px;
        }

        .meta-box span {
          display: block;
          color: #929d98;
          font-size: 7px;
          margin-bottom: 3px;
        }

        .meta-box b {
          color: #526b62;
          font-size: 9px;
        }

        .map-preview {
          height: 285px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(135deg, #eef5e9 25%, transparent 25%) -20px 0/40px 40px,
            linear-gradient(225deg, #eef5e9 25%, transparent 25%) -20px 0/40px 40px,
            linear-gradient(315deg, #eef5e9 25%, transparent 25%) 0 0/40px 40px,
            linear-gradient(45deg, #eef5e9 25%, #f8faf7 25%) 0 0/40px 40px;
        }

        .map-line {
          position: absolute;
          height: 2px;
          background: #d5e0d8;
          transform-origin: left;
        }

        .line1 {
          width: 260px;
          left: 30px;
          top: 70px;
          transform: rotate(22deg);
        }

        .line2 {
          width: 240px;
          left: 80px;
          top: 190px;
          transform: rotate(-17deg);
        }

        .line3 {
          width: 210px;
          left: 170px;
          top: 120px;
          transform: rotate(62deg);
        }

        .map-marker {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: grid;
          place-items: center;
          box-shadow: 0 5px 15px rgba(70,80,50,.18);
        }

        .map-marker::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .marker-critical {
          background: #c94d43;
          left: 31%;
          top: 25%;
        }

        .marker-high {
          background: #dc8a3b;
          left: 62%;
          top: 45%;
        }

        .marker-medium {
          background: #c7a83c;
          left: 48%;
          top: 68%;
        }

        .marker-green {
          background: #75a33c;
          left: 74%;
          top: 24%;
        }

        .map-label {
          position: absolute;
          background: white;
          border: 1px solid #dfe8e2;
          padding: 5px 7px;
          border-radius: 6px;
          font-size: 7px;
          color: #557066;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(30,60,45,.08);
        }

        .label1 {
          left: 27%;
          top: 39%;
        }

        .label2 {
          left: 58%;
          top: 58%;
        }

        .label3 {
          left: 42%;
          top: 79%;
        }

        .map-footer {
          padding: 12px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          border-top: 1px solid #e7eeeb;
        }

        .legend {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #7c8b84;
          font-size: 8px;
        }

        .legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .empty-outbreak {
          padding: 50px;
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

        .outbreak-modal {
          width: min(600px, 100%);
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

        .modal-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 15px;
        }

        .modal-title-row h3 {
          margin: 0;
          color: #305349;
          font-size: 15px;
        }

        .modal-title-row p {
          margin: 4px 0 0;
          color: #8a9791;
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

        .description-box {
          margin-top: 12px;
          padding: 12px;
          background: #f7faf8;
          border-radius: 10px;
        }

        .description-box strong {
          display: block;
          color: #55746b;
          font-size: 9px;
          margin-bottom: 5px;
        }

        .description-box p {
          margin: 0;
          color: #74847d;
          font-size: 9px;
          line-height: 1.5;
        }

        .action-box {
          margin-top: 10px;
          padding: 11px;
          border-radius: 9px;
          background: #fff6df;
          color: #806d32;
          font-size: 9px;
          line-height: 1.4;
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

        .modal-footer .resolve {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        @media (max-width: 900px) {
          .outbreak-layout {
            grid-template-columns: 1fr;
          }

          .outbreak-stats {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .outbreak-stats {
            grid-template-columns: 1fr;
          }

          .outbreak-meta {
            grid-template-columns: 1fr 1fr;
          }

          .outbreak-header {
            flex-direction: column;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="outbreak-page">

        <div className="outbreak-header">

          <div>
            <h1>Outbreak Surveillance</h1>
            <p>
              Monitor disease patterns, regional clusters
              and emerging animal-health risks.
            </p>
          </div>

          <div className="surveillance-badge">
            <span className="pulse"></span>
            Live Surveillance
          </div>

        </div>

        <div className="outbreak-stats">

          <div className="outbreak-stat">
            <div className="outbreak-stat-icon">
              <MapPinned size={18} />
            </div>
            <div>
              <b>{counts.total}</b>
              <span>Total Clusters</span>
            </div>
          </div>

          <div className="outbreak-stat">
            <div className="outbreak-stat-icon">
              <ShieldAlert size={18} />
            </div>
            <div>
              <b>{counts.critical}</b>
              <span>Critical Risk</span>
            </div>
          </div>

          <div className="outbreak-stat">
            <div className="outbreak-stat-icon">
              <Activity size={18} />
            </div>
            <div>
              <b>{counts.active}</b>
              <span>Active Clusters</span>
            </div>
          </div>

          <div className="outbreak-stat">
            <div className="outbreak-stat-icon">
              <Clock3 size={18} />
            </div>
            <div>
              <b>{counts.monitoring}</b>
              <span>Under Monitoring</span>
            </div>
          </div>

        </div>

        <div className="outbreak-toolbar">

          <div className="outbreak-search">
            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search disease, region, outbreak ID..."
            />
          </div>

          <select
            className="outbreak-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All outbreaks
            </option>
            <option value="Critical">
              Critical Risk
            </option>
            <option value="High">
              High Risk
            </option>
            <option value="Medium">
              Medium Risk
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Monitoring">
              Monitoring
            </option>
            <option value="Resolved">
              Resolved
            </option>
          </select>

        </div>

        <div className="outbreak-layout">

          <section className="outbreak-card">

            <div className="card-head">
              <div>
                <h2>Disease Clusters</h2>
                <span>
                  {filtered.length} detected clusters
                </span>
              </div>
            </div>

            <div className="outbreak-list">

              {filtered.length === 0 ? (
                <div className="empty-outbreak">
                  No outbreak records found.
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    className="outbreak-item"
                    key={item.id}
                    onClick={() =>
                      setSelected(item)
                    }
                  >

                    <div className="outbreak-top">

                      <div className="disease-title">

                        <div className="disease-icon">
                          <AlertTriangle size={17} />
                        </div>

                        <div>
                          <h3>
                            {item.disease}
                          </h3>

                          <p>
                            {item.id} ·{" "}
                            {item.region},{" "}
                            {item.state}
                          </p>
                        </div>

                      </div>

                      <div
                        className={`risk-badge ${riskClass(
                          item.risk
                        )}`}
                      >
                        {item.risk}
                      </div>

                    </div>

                    <div className="outbreak-meta">

                      <div className="meta-box">
                        <span>CASES</span>
                        <b>{item.cases}</b>
                      </div>

                      <div className="meta-box">
                        <span>ANIMALS</span>
                        <b>{item.animals}</b>
                      </div>

                      <div className="meta-box">
                        <span>STATUS</span>
                        <b>{item.status}</b>
                      </div>

                      <div className="meta-box">
                        <span>UPDATED</span>
                        <b>{item.lastUpdate}</b>
                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </section>

          <section className="map-card">

            <div className="card-head">
              <div>
                <h2>Risk Map</h2>
                <span>Regional disease activity</span>
              </div>

              <MapPinned
                size={17}
                color="#789449"
              />
            </div>

            <div className="map-preview">

              <div className="map-line line1"></div>
              <div className="map-line line2"></div>
              <div className="map-line line3"></div>

              <div className="map-marker marker-critical"></div>
              <div className="map-marker marker-high"></div>
              <div className="map-marker marker-medium"></div>
              <div className="map-marker marker-green"></div>

              <div className="map-label label1">
                Ahmednagar
              </div>

              <div className="map-label label2">
                Satara
              </div>

              <div className="map-label label3">
                Pune
              </div>

            </div>

            <div className="map-footer">

              <div className="legend">
                <span
                  className="legend-dot"
                  style={{
                    background: "#c94d43",
                  }}
                ></span>
                Critical
              </div>

              <div className="legend">
                <span
                  className="legend-dot"
                  style={{
                    background: "#dc8a3b",
                  }}
                ></span>
                High
              </div>

              <div className="legend">
                <span
                  className="legend-dot"
                  style={{
                    background: "#c7a83c",
                  }}
                ></span>
                Medium
              </div>

              <div className="legend">
                <span
                  className="legend-dot"
                  style={{
                    background: "#75a33c",
                  }}
                ></span>
                Resolved
              </div>

            </div>

          </section>

        </div>

      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="outbreak-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>Outbreak Details</h2>

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

              <div className="modal-title-row">

                <div>
                  <h3>
                    {selected.disease}
                  </h3>

                  <p>
                    {selected.id} ·{" "}
                    {selected.region},{" "}
                    {selected.state}
                  </p>
                </div>

                <div
                  className={`risk-badge ${riskClass(
                    selected.risk
                  )}`}
                >
                  {selected.risk}
                </div>

              </div>

              <div className="detail-grid">

                <div className="detail-box">
                  <span>CASES</span>
                  <b>{selected.cases}</b>
                </div>

                <div className="detail-box">
                  <span>AFFECTED ANIMALS</span>
                  <b>{selected.animals}</b>
                </div>

                <div className="detail-box">
                  <span>DETECTED</span>
                  <b>{selected.detected}</b>
                </div>

                <div className="detail-box">
                  <span>SOURCE</span>
                  <b>{selected.source}</b>
                </div>

                <div className="detail-box">
                  <span>STATUS</span>
                  <b>{selected.status}</b>
                </div>

                <div className="detail-box">
                  <span>LAST UPDATE</span>
                  <b>{selected.lastUpdate}</b>
                </div>

              </div>

              <div className="description-box">

                <strong>OBSERVATION</strong>

                <p>
                  {selected.description}
                </p>

              </div>

              <div className="action-box">
                <strong>Recommended workflow:</strong>{" "}
                {selected.action}
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
                "Resolved" && (
                <button
                  className="resolve"
                  onClick={() =>
                    resolveOutbreak(
                      selected.id
                    )
                  }
                >
                  <CheckCircle2
                    size={13}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 4,
                    }}
                  />
                  Mark Resolved
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Outbreaks;