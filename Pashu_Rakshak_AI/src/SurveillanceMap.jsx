import React, { useState } from "react";
import {
  Map as MapIcon,
  Search,
  Layers,
  MapPin,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Navigation,
  Plus,
  Minus,
  Crosshair,
} from "lucide-react";

function SurveillanceMap() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const cases = [
    {
      id: "CS-2049",
      location: "Dahisar",
      animal: "Goat",
      disease: "Respiratory Infection",
      risk: "High",
      cases: 8,
      x: 28,
      y: 35,
    },
    {
      id: "CS-2048",
      location: "Borivali",
      animal: "Cow",
      disease: "Fever",
      risk: "Critical",
      cases: 4,
      x: 48,
      y: 23,
    },
    {
      id: "CS-2047",
      location: "Kandivali",
      animal: "Buffalo",
      disease: "Skin Infection",
      risk: "Medium",
      cases: 12,
      x: 64,
      y: 48,
    },
    {
      id: "CS-2046",
      location: "Malad",
      animal: "Cow",
      disease: "Respiratory Infection",
      risk: "High",
      cases: 7,
      x: 39,
      y: 67,
    },
    {
      id: "CS-2045",
      location: "Goregaon",
      animal: "Goat",
      disease: "Digestive Disorder",
      risk: "Low",
      cases: 3,
      x: 76,
      y: 72,
    },
  ];

  const filteredCases = cases.filter((item) => {
    const matchesFilter =
      filter === "All" || item.risk === filter;

    const matchesSearch =
      item.location
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.disease
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.id
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const riskClass = (risk) => {
    if (risk === "Critical") return "critical";
    if (risk === "High") return "high";
    if (risk === "Medium") return "medium";
    return "low";
  };

  return (
    <>
      <style>{`
        .surveillance-page {
          width: 100%;
          max-width: 1250px;
          margin: auto;
          padding-bottom: 30px;
        }

        .surveillance-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 20px;
        }

        .surveillance-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .surveillance-header p {
          margin: 6px 0 0;
          color: #7b8983;
          font-size: 12px;
        }

        .live-status {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #eef8df;
          color: #587a2c;
          border-radius: 9px;
          padding: 9px 12px;
          font-size: 10px;
          font-weight: 800;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #7ea93a;
          box-shadow: 0 0 0 4px rgba(126,169,58,.12);
        }

        .map-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .map-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .map-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #f1f6e9;
          color: #739535;
        }

        .map-stat b {
          display: block;
          color: #24483e;
          font-size: 19px;
        }

        .map-stat span {
          color: #87948e;
          font-size: 10px;
        }

        .surveillance-layout {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 16px;
        }

        .map-card,
        .cases-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(20,65,53,.04);
        }

        .map-toolbar {
          padding: 13px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .map-search {
          flex: 1;
          min-width: 180px;
          height: 38px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          background: #fbfdfc;
        }

        .map-search svg {
          color: #84928c;
        }

        .map-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #34574d;
          font-size: 11px;
        }

        .filter-button {
          height: 36px;
          border: 1px solid #dce6e1;
          background: #fff;
          color: #526b62;
          border-radius: 8px;
          padding: 0 10px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .filter-button.active {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        .map-area {
          height: 470px;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(32deg, transparent 46%, rgba(126,160,140,.18) 47%, transparent 48%),
            linear-gradient(112deg, transparent 45%, rgba(126,160,140,.13) 46%, transparent 47%),
            linear-gradient(0deg, rgba(255,255,255,.5), rgba(235,243,237,.8));
        }

        .map-area::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(91,126,108,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(91,126,108,.08) 1px, transparent 1px);
          background-size: 45px 45px;
        }

        .map-road {
          position: absolute;
          background: rgba(255,255,255,.8);
          border: 1px solid rgba(106,135,118,.12);
          transform-origin: center;
        }

        .road-one {
          width: 110%;
          height: 17px;
          top: 46%;
          left: -5%;
          transform: rotate(-10deg);
        }

        .road-two {
          width: 90%;
          height: 14px;
          top: 63%;
          left: 4%;
          transform: rotate(16deg);
        }

        .road-three {
          width: 15px;
          height: 110%;
          left: 47%;
          top: -5%;
          transform: rotate(13deg);
        }

        .map-label {
          position: absolute;
          color: rgba(57,91,76,.55);
          font-size: 10px;
          font-weight: 800;
        }

        .label-one {
          left: 13%;
          top: 17%;
        }

        .label-two {
          left: 58%;
          top: 17%;
        }

        .label-three {
          left: 69%;
          top: 57%;
        }

        .label-four {
          left: 20%;
          top: 76%;
        }

        .map-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 5;
        }

        .marker-circle {
          width: 31px;
          height: 31px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: grid;
          place-items: center;
          box-shadow: 0 5px 12px rgba(0,0,0,.15);
        }

        .marker-circle span {
          transform: rotate(45deg);
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .marker-high .marker-circle {
          background: #e49a38;
        }

        .marker-critical .marker-circle {
          background: #c84747;
        }

        .marker-medium .marker-circle {
          background: #d5b84a;
        }

        .marker-low .marker-circle {
          background: #78a654;
        }

        .marker-tooltip {
          position: absolute;
          left: 20px;
          bottom: 25px;
          min-width: 145px;
          padding: 9px;
          border-radius: 8px;
          background: rgba(255,255,255,.97);
          border: 1px solid #dfe9e4;
          box-shadow: 0 8px 22px rgba(25,60,48,.14);
          opacity: 0;
          pointer-events: none;
          transition: .2s;
        }

        .map-marker:hover .marker-tooltip {
          opacity: 1;
        }

        .marker-tooltip b {
          display: block;
          color: #315248;
          font-size: 11px;
        }

        .marker-tooltip span {
          color: #77867f;
          font-size: 9px;
        }

        .map-controls {
          position: absolute;
          right: 14px;
          top: 14px;
          z-index: 10;
          display: grid;
          gap: 5px;
        }

        .map-control {
          width: 35px;
          height: 35px;
          border: 1px solid #dbe5df;
          background: rgba(255,255,255,.94);
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: #4c685e;
          cursor: pointer;
        }

        .map-legend {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 10;
          background: rgba(255,255,255,.95);
          border: 1px solid #dce6e1;
          border-radius: 10px;
          padding: 10px;
        }

        .map-legend b {
          display: block;
          margin-bottom: 7px;
          color: #3c5a50;
          font-size: 10px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          color: #718079;
          font-size: 9px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .cases-header {
          padding: 17px;
          border-bottom: 1px solid #e7eeeb;
        }

        .cases-header h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .cases-header p {
          margin: 5px 0 0;
          color: #87938e;
          font-size: 10px;
        }

        .case-list {
          max-height: 505px;
          overflow-y: auto;
        }

        .case-item {
          padding: 14px 15px;
          border-bottom: 1px solid #edf1ef;
          cursor: pointer;
          transition: .15s;
        }

        .case-item:hover {
          background: #fafcfb;
        }

        .case-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .case-id {
          color: #49675c;
          font-size: 9px;
          font-weight: 800;
        }

        .risk-pill {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
        }

        .risk-pill.critical {
          background: #fde8e8;
          color: #b53e3e;
        }

        .risk-pill.high {
          background: #fff0df;
          color: #b46a1d;
        }

        .risk-pill.medium {
          background: #fff8d9;
          color: #8b771d;
        }

        .risk-pill.low {
          background: #eef8df;
          color: #5c8030;
        }

        .case-location {
          margin-top: 7px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #294d42;
          font-size: 12px;
          font-weight: 800;
        }

        .case-disease {
          margin-top: 4px;
          color: #7b8882;
          font-size: 10px;
        }

        .case-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 9px;
          color: #87938d;
          font-size: 9px;
        }

        .case-footer strong {
          color: #526c61;
        }

        .empty-cases {
          padding: 40px 20px;
          text-align: center;
          color: #87958f;
          font-size: 11px;
        }

        @media (max-width: 1000px) {
          .surveillance-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .map-stats {
            grid-template-columns: 1fr 1fr;
          }

          .surveillance-header {
            flex-direction: column;
          }

          .map-area {
            height: 400px;
          }
        }
      `}</style>

      <div className="surveillance-page">

        <div className="surveillance-header">
          <div>
            <h1>Disease Surveillance</h1>
            <p>
              GIS-based livestock disease intelligence and
              regional risk monitoring.
            </p>
          </div>

          <div className="live-status">
            <span className="live-dot"></span>
            LIVE SURVEILLANCE
          </div>
        </div>

        <div className="map-stats">

          <div className="map-stat">
            <div className="map-stat-icon">
              <MapPin size={18} />
            </div>
            <div>
              <b>34</b>
              <span>Active Locations</span>
            </div>
          </div>

          <div className="map-stat">
            <div className="map-stat-icon">
              <AlertTriangle size={18} />
            </div>
            <div>
              <b>19</b>
              <span>High Risk Cases</span>
            </div>
          </div>

          <div className="map-stat">
            <div className="map-stat-icon">
              <Activity size={18} />
            </div>
            <div>
              <b>127</b>
              <span>Animals Monitored</span>
            </div>
          </div>

          <div className="map-stat">
            <div className="map-stat-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <b>86%</b>
              <span>Cases Resolved</span>
            </div>
          </div>

        </div>

        <div className="surveillance-layout">

          <section className="map-card">

            <div className="map-toolbar">

              <div className="map-search">
                <Search size={14} />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search location, disease or case..."
                />
              </div>

              {["All", "Critical", "High", "Medium", "Low"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      "filter-button " +
                      (filter === item ? "active" : "")
                    }
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            <div className="map-area">

              <div className="road-one map-road"></div>
              <div className="road-two map-road"></div>
              <div className="road-three map-road"></div>

              <span className="map-label label-one">
                DAHISAR
              </span>

              <span className="map-label label-two">
                BORIVALI
              </span>

              <span className="map-label label-three">
                KANDIVALI
              </span>

              <span className="map-label label-four">
                MALAD
              </span>

              {filteredCases.map((item) => (
                <div
                  key={item.id}
                  className={
                    "map-marker marker-" +
                    riskClass(item.risk)
                  }
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                >
                  <div className="marker-circle">
                    <span>{item.cases}</span>
                  </div>

                  <div className="marker-tooltip">
                    <b>{item.location}</b>
                    <span>
                      {item.disease}
                    </span>
                    <br />
                    <span>
                      {item.cases} active cases
                    </span>
                  </div>
                </div>
              ))}

              <div className="map-controls">

                <button className="map-control">
                  <Plus size={16} />
                </button>

                <button className="map-control">
                  <Minus size={16} />
                </button>

                <button className="map-control">
                  <Crosshair size={15} />
                </button>

                <button className="map-control">
                  <Layers size={15} />
                </button>

              </div>

              <div className="map-legend">

                <b>RISK LEVEL</b>

                <div className="legend-row">
                  <span
                    className="legend-dot"
                    style={{ background: "#c84747" }}
                  />
                  Critical
                </div>

                <div className="legend-row">
                  <span
                    className="legend-dot"
                    style={{ background: "#e49a38" }}
                  />
                  High
                </div>

                <div className="legend-row">
                  <span
                    className="legend-dot"
                    style={{ background: "#d5b84a" }}
                  />
                  Medium
                </div>

                <div className="legend-row">
                  <span
                    className="legend-dot"
                    style={{ background: "#78a654" }}
                  />
                  Low
                </div>

              </div>

            </div>

          </section>

          <section className="cases-card">

            <div className="cases-header">
              <h2>Active Disease Cases</h2>
              <p>
                Cases detected across monitored regions.
              </p>
            </div>

            <div className="case-list">

              {filteredCases.length === 0 ? (
                <div className="empty-cases">
                  No cases found.
                </div>
              ) : (
                filteredCases.map((item) => (
                  <div
                    className="case-item"
                    key={item.id}
                  >

                    <div className="case-top">
                      <span className="case-id">
                        {item.id}
                      </span>

                      <span
                        className={
                          "risk-pill " +
                          riskClass(item.risk)
                        }
                      >
                        {item.risk.toUpperCase()}
                      </span>
                    </div>

                    <div className="case-location">
                      <MapPin size={13} />
                      {item.location}
                    </div>

                    <div className="case-disease">
                      {item.animal} · {item.disease}
                    </div>

                    <div className="case-footer">
                      <span>
                        Active cases:{" "}
                        <strong>{item.cases}</strong>
                      </span>

                      <span>
                        View case →
                      </span>
                    </div>

                  </div>
                ))
              )}

            </div>

          </section>

        </div>

      </div>
    </>
  );
}

export default SurveillanceMap;