import React, { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FlaskConical,
  HeartPulse,
  PawPrint,
  Search,
  ShieldCheck,
  Syringe,
  Stethoscope,
  Pill,
  X,
} from "lucide-react";

function HealthRecords() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const animals = [
    {
      id: "AN-1024",
      name: "Gauri",
      type: "Cow",
      breed: "Gir",
      location: "Nashik",
      score: 92,
      risk: "Low",
      lastCheck: "Sep 24, 2026",
      records: 8,
    },
    {
      id: "AN-1025",
      name: "Moti",
      type: "Buffalo",
      breed: "Murrah",
      location: "Pune",
      score: 68,
      risk: "Medium",
      lastCheck: "Sep 23, 2026",
      records: 11,
    },
    {
      id: "AN-1026",
      name: "Laxmi",
      type: "Cow",
      breed: "Sahiwal",
      location: "Satara",
      score: 42,
      risk: "High",
      lastCheck: "Sep 25, 2026",
      records: 14,
    },
    {
      id: "AN-1027",
      name: "Raja",
      type: "Goat",
      breed: "Osmanabadi",
      location: "Ahmednagar",
      score: 31,
      risk: "Critical",
      lastCheck: "Sep 27, 2026",
      records: 17,
    },
    {
      id: "AN-1028",
      name: "Kali",
      type: "Sheep",
      breed: "Deccani",
      location: "Solapur",
      score: 81,
      risk: "Low",
      lastCheck: "Sep 22, 2026",
      records: 7,
    },
    {
      id: "AN-1029",
      name: "Maya",
      type: "Cow",
      breed: "Jersey",
      location: "Thane",
      score: 57,
      risk: "Medium",
      lastCheck: "Sep 21, 2026",
      records: 10,
    },
  ];

  const records = [
    {
      id: "REC-501",
      animal: "Raja",
      animalId: "AN-1027",
      category: "AI Screening",
      title: "High-risk respiratory screening",
      description:
        "Simulated AI screening identified elevated respiratory risk based on reported symptoms and observations.",
      date: "Sep 27, 2026",
      status: "Needs Review",
      icon: "ai",
    },
    {
      id: "REC-500",
      animal: "Raja",
      animalId: "AN-1027",
      category: "Veterinarian",
      title: "Veterinarian review requested",
      description:
        "Case assigned for clinical assessment and treatment planning.",
      date: "Sep 27, 2026",
      status: "Assigned",
      icon: "vet",
    },
    {
      id: "REC-499",
      animal: "Raja",
      animalId: "AN-1027",
      category: "Laboratory",
      title: "Respiratory panel requested",
      description:
        "Sample collected for laboratory investigation.",
      date: "Sep 26, 2026",
      status: "Processing",
      icon: "lab",
    },
    {
      id: "REC-498",
      animal: "Raja",
      animalId: "AN-1027",
      category: "Treatment",
      title: "Treatment started",
      description:
        "Treatment plan recorded by the veterinarian with follow-up monitoring.",
      date: "Sep 25, 2026",
      status: "Active",
      icon: "treatment",
    },
    {
      id: "REC-497",
      animal: "Raja",
      animalId: "AN-1027",
      category: "Vaccination",
      title: "FMD vaccination completed",
      description:
        "Vaccination record updated in the animal health history.",
      date: "Aug 18, 2026",
      status: "Completed",
      icon: "vaccine",
    },
    {
      id: "REC-496",
      animal: "Raja",
      animalId: "AN-1027",
      category: "Veterinarian",
      title: "Routine veterinary visit",
      description:
        "Routine health examination completed.",
      date: "Aug 12, 2026",
      status: "Completed",
      icon: "vet",
    },
  ];

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const text = (
        animal.name +
        " " +
        animal.id +
        " " +
        animal.type +
        " " +
        animal.breed +
        " " +
        animal.location
      ).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      return matchesSearch;
    });
  }, [search]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesType =
        typeFilter === "All" ||
        record.category === typeFilter;

      const text = (
        record.title +
        " " +
        record.description +
        " " +
        record.animal +
        " " +
        record.animalId +
        " " +
        record.category
      ).toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase()
      );

      return matchesType && matchesSearch;
    });
  }, [search, typeFilter]);

  function riskClass(risk) {
    return risk.toLowerCase();
  }

  function recordIcon(icon) {
    if (icon === "ai") {
      return <Activity size={18} />;
    }

    if (icon === "vet") {
      return <Stethoscope size={18} />;
    }

    if (icon === "lab") {
      return <FlaskConical size={18} />;
    }

    if (icon === "treatment") {
      return <Pill size={18} />;
    }

    if (icon === "vaccine") {
      return <Syringe size={18} />;
    }

    return <FileText size={18} />;
  }

  return (
    <>
      <style>{`
        .records-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .records-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .records-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .records-header p {
          margin: 6px 0 0;
          color: #7e8c85;
          font-size: 12px;
        }

        .header-action {
          height: 38px;
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

        .record-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .record-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          gap: 11px;
          align-items: center;
        }

        .record-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          background: #f1f6e9;
          color: #719335;
          display: grid;
          place-items: center;
        }

        .record-stat b {
          display: block;
          color: #284c42;
          font-size: 19px;
        }

        .record-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .records-toolbar {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .records-search {
          flex: 1;
          min-width: 220px;
          height: 38px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 10px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fbfdfc;
        }

        .records-search svg {
          color: #84928c;
        }

        .records-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #34574d;
          font-size: 11px;
        }

        .records-filter {
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

        .records-layout {
          display: grid;
          grid-template-columns: 0.85fr 1.55fr;
          gap: 16px;
        }

        .animals-panel,
        .timeline-panel {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .panel-header {
          padding: 16px;
          border-bottom: 1px solid #e8eeeb;
        }

        .panel-header h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .panel-header p {
          margin: 5px 0 0;
          color: #89958f;
          font-size: 10px;
        }

        .animal-record {
          padding: 13px;
          border-bottom: 1px solid #edf1ef;
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          transition: .18s;
        }

        .animal-record:hover {
          background: #fafcfb;
        }

        .animal-record.selected {
          background: #f5f9ed;
          border-left: 3px solid #91b63f;
        }

        .animal-record-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #edf4e2;
          color: #5f7f32;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 13px;
        }

        .animal-record-main {
          flex: 1;
          min-width: 0;
        }

        .animal-record-main b {
          display: block;
          color: #315248;
          font-size: 11px;
        }

        .animal-record-main span {
          display: block;
          margin-top: 3px;
          color: #85928c;
          font-size: 9px;
        }

        .record-risk {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
        }

        .record-risk.low {
          color: #5d8132;
          background: #eef8df;
        }

        .record-risk.medium {
          color: #89761d;
          background: #fff8d9;
        }

        .record-risk.high {
          color: #b36b1c;
          background: #fff0df;
        }

        .record-risk.critical {
          color: #b43e3e;
          background: #fde8e8;
        }

        .selected-animal {
          margin: 15px;
          padding: 13px;
          border-radius: 11px;
          background: #f7faf8;
          border: 1px solid #e4ece8;
        }

        .selected-animal-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .selected-animal-avatar {
          width: 42px;
          height: 42px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: #dfeecb;
          color: #55782d;
          font-weight: 900;
        }

        .selected-animal h3 {
          margin: 0;
          color: #2d5147;
          font-size: 13px;
        }

        .selected-animal p {
          margin: 4px 0 0;
          color: #829089;
          font-size: 9px;
        }

        .health-score-box {
          margin-top: 12px;
        }

        .health-score-line {
          display: flex;
          justify-content: space-between;
          color: #60766c;
          font-size: 9px;
          font-weight: 800;
        }

        .health-track {
          height: 6px;
          border-radius: 99px;
          background: #e8eee9;
          overflow: hidden;
          margin-top: 6px;
        }

        .health-track span {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: #91b63f;
        }

        .animal-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 12px;
        }

        .animal-info-box {
          background: #fff;
          padding: 8px;
          border-radius: 7px;
        }

        .animal-info-box span {
          display: block;
          color: #929d98;
          font-size: 7px;
          margin-bottom: 3px;
        }

        .animal-info-box b {
          color: #526a60;
          font-size: 9px;
        }

        .timeline-header {
          padding: 16px;
          border-bottom: 1px solid #e8eeeb;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .timeline-header h2 {
          margin: 0;
          color: #24483e;
          font-size: 16px;
        }

        .timeline-header span {
          color: #89958f;
          font-size: 9px;
        }

        .timeline {
          padding: 18px 20px;
        }

        .timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 26px 1fr;
          gap: 12px;
          padding-bottom: 22px;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-line {
          position: absolute;
          left: 12px;
          top: 25px;
          bottom: 0;
          width: 1px;
          background: #dce6e1;
        }

        .timeline-icon {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          position: relative;
          z-index: 2;
          background: #edf4e2;
          color: #6b8e34;
        }

        .timeline-content {
          padding-bottom: 2px;
        }

        .timeline-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .timeline-top h3 {
          margin: 0;
          color: #315248;
          font-size: 12px;
        }

        .timeline-date {
          color: #8a9791;
          font-size: 8px;
          white-space: nowrap;
        }

        .timeline-content p {
          margin: 5px 0 7px;
          color: #7d8b85;
          font-size: 9px;
          line-height: 1.55;
        }

        .record-category {
          display: inline-flex;
          padding: 4px 7px;
          border-radius: 999px;
          background: #f0f5f2;
          color: #63766e;
          font-size: 7px;
          font-weight: 900;
        }

        .record-status {
          display: inline-flex;
          margin-left: 5px;
          padding: 4px 7px;
          border-radius: 999px;
          background: #eef8df;
          color: #5d8132;
          font-size: 7px;
          font-weight: 900;
        }

        .timeline-actions {
          margin-top: 7px;
          display: flex;
          gap: 7px;
        }

        .timeline-actions button {
          height: 29px;
          padding: 0 9px;
          border-radius: 7px;
          border: 1px solid #dce6e1;
          background: #fff;
          color: #526b62;
          cursor: pointer;
          font-size: 8px;
          font-weight: 800;
        }

        .timeline-actions button:hover {
          background: #f5f8f6;
        }

        .empty-records {
          text-align: center;
          padding: 55px 20px;
          color: #89958f;
          font-size: 10px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(24, 47, 40, .4);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .record-modal {
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
          color: #61766d;
          border-radius: 8px;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .modal-content {
          padding: 18px;
        }

        .modal-icon {
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: #edf4e2;
          color: #668936;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
        }

        .modal-content h3 {
          margin: 0;
          color: #2e5147;
          font-size: 15px;
        }

        .modal-content p {
          color: #7b8983;
          font-size: 10px;
          line-height: 1.6;
        }

        .modal-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 14px;
        }

        .modal-detail {
          background: #f7faf8;
          border-radius: 9px;
          padding: 10px;
        }

        .modal-detail span {
          display: block;
          color: #8d9994;
          font-size: 7px;
          margin-bottom: 4px;
        }

        .modal-detail b {
          color: #49665d;
          font-size: 9px;
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
          border: 1px solid #dce6e1;
          border-radius: 8px;
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

        @media (max-width: 1000px) {
          .records-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .record-stats {
            grid-template-columns: 1fr 1fr;
          }

          .records-header {
            flex-direction: column;
          }

          .timeline-top {
            flex-direction: column;
            gap: 3px;
          }

          .modal-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="records-page">

        <div className="records-header">

          <div>
            <h1>Health Records</h1>
            <p>
              Complete animal health timelines,
              treatments, vaccinations and
              veterinary visits.
            </p>
          </div>

          <button className="header-action">
            <FileText size={15} />
            Export Records
          </button>

        </div>

        {/* STATS */}

        <div className="record-stats">

          <div className="record-stat">
            <div className="record-stat-icon">
              <HeartPulse size={18} />
            </div>
            <div>
              <b>1,248</b>
              <span>Total Records</span>
            </div>
          </div>

          <div className="record-stat">
            <div className="record-stat-icon">
              <Stethoscope size={18} />
            </div>
            <div>
              <b>286</b>
              <span>Vet Visits</span>
            </div>
          </div>

          <div className="record-stat">
            <div className="record-stat-icon">
              <FlaskConical size={18} />
            </div>
            <div>
              <b>94</b>
              <span>Lab Results</span>
            </div>
          </div>

          <div className="record-stat">
            <div className="record-stat-icon">
              <Syringe size={18} />
            </div>
            <div>
              <b>91%</b>
              <span>Vaccination Coverage</span>
            </div>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="records-toolbar">

          <div className="records-search">

            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search animal, record, case or location..."
            />

          </div>

          <select
            className="records-filter"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">
              All record types
            </option>
            <option value="AI Screening">
              AI Screening
            </option>
            <option value="Veterinarian">
              Veterinarian
            </option>
            <option value="Laboratory">
              Laboratory
            </option>
            <option value="Treatment">
              Treatment
            </option>
            <option value="Vaccination">
              Vaccination
            </option>
          </select>

        </div>

        {/* MAIN */}

        <div className="records-layout">

          {/* ANIMALS */}

          <section className="animals-panel">

            <div className="panel-header">

              <h2>Animal Records</h2>

              <p>
                Select an animal to view its
                complete health history.
              </p>

            </div>

            {filteredAnimals.map(
              (animal, index) => (
                <div
                  className={`animal-record ${
                    index === 3
                      ? "selected"
                      : ""
                  }`}
                  key={animal.id}
                >

                  <div className="animal-record-avatar">
                    {animal.name[0]}
                  </div>

                  <div className="animal-record-main">

                    <b>
                      {animal.name} ·{" "}
                      {animal.id}
                    </b>

                    <span>
                      {animal.type} ·{" "}
                      {animal.location}
                    </span>

                  </div>

                  <span
                    className={`record-risk ${riskClass(
                      animal.risk
                    )}`}
                  >
                    {animal.risk}
                  </span>

                  <ChevronRight
                    size={14}
                    color="#9aa7a1"
                  />

                </div>
              )
            )}

            {filteredAnimals.length === 0 && (
              <div className="empty-records">
                No animals found.
              </div>
            )}

            <div className="selected-animal">

              <div className="selected-animal-top">

                <div className="selected-animal-avatar">
                  R
                </div>

                <div>
                  <h3>
                    Raja · AN-1027
                  </h3>

                  <p>
                    Goat · Osmanabadi ·
                    Ahmednagar
                  </p>
                </div>

              </div>

              <div className="health-score-box">

                <div className="health-score-line">
                  <span>
                    Health Score
                  </span>

                  <b>31 / 100</b>
                </div>

                <div className="health-track">
                  <span
                    style={{
                      width: "31%",
                    }}
                  />
                </div>

              </div>

              <div className="animal-info-grid">

                <div className="animal-info-box">
                  <span>LAST CHECK</span>
                  <b>Sep 27, 2026</b>
                </div>

                <div className="animal-info-box">
                  <span>RECORDS</span>
                  <b>17 records</b>
                </div>

                <div className="animal-info-box">
                  <span>RISK</span>
                  <b>Critical</b>
                </div>

                <div className="animal-info-box">
                  <span>ACTIVE CASE</span>
                  <b>CS-2048</b>
                </div>

              </div>

            </div>

          </section>

          {/* TIMELINE */}

          <section className="timeline-panel">

            <div className="timeline-header">

              <div>
                <h2>
                  Raja's Health Timeline
                </h2>

                <span>
                  AN-1027 · 17 total records
                </span>
              </div>

              <ShieldCheck
                size={19}
                color="#719335"
              />

            </div>

            <div className="timeline">

              {filteredRecords.length === 0 ? (
                <div className="empty-records">
                  No health records found.
                </div>
              ) : (
                filteredRecords.map(
                  (record, index) => (
                    <div
                      className="timeline-item"
                      key={record.id}
                    >

                      {index !==
                        filteredRecords.length -
                          1 && (
                        <div className="timeline-line" />
                      )}

                      <div className="timeline-icon">
                        {recordIcon(record.icon)}
                      </div>

                      <div className="timeline-content">

                        <div className="timeline-top">

                          <h3>
                            {record.title}
                          </h3>

                          <span className="timeline-date">
                            {record.date}
                          </span>

                        </div>

                        <p>
                          {record.description}
                        </p>

                        <span className="record-category">
                          {record.category}
                        </span>

                        <span className="record-status">
                          {record.status}
                        </span>

                        <div className="timeline-actions">

                          <button
                            onClick={() =>
                              setSelectedRecord(
                                record
                              )
                            }
                          >
                            View details
                            <ChevronRight
                              size={11}
                              style={{
                                verticalAlign:
                                  "middle",
                                marginLeft: 3,
                              }}
                            />
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </section>

        </div>

      </div>

      {/* MODAL */}

      {selectedRecord && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedRecord(null)
          }
        >

          <div
            className="record-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-head">

              <h2>
                Health Record Details
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-content">

              <div className="modal-icon">
                {recordIcon(
                  selectedRecord.icon
                )}
              </div>

              <h3>
                {selectedRecord.title}
              </h3>

              <p>
                {selectedRecord.description}
              </p>

              <div className="modal-details">

                <div className="modal-detail">
                  <span>RECORD ID</span>
                  <b>
                    {selectedRecord.id}
                  </b>
                </div>

                <div className="modal-detail">
                  <span>DATE</span>
                  <b>
                    {selectedRecord.date}
                  </b>
                </div>

                <div className="modal-detail">
                  <span>ANIMAL</span>
                  <b>
                    {selectedRecord.animal}
                  </b>
                </div>

                <div className="modal-detail">
                  <span>ANIMAL ID</span>
                  <b>
                    {selectedRecord.animalId}
                  </b>
                </div>

                <div className="modal-detail">
                  <span>CATEGORY</span>
                  <b>
                    {selectedRecord.category}
                  </b>
                </div>

                <div className="modal-detail">
                  <span>STATUS</span>
                  <b>
                    {selectedRecord.status}
                  </b>
                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                Close
              </button>

              <button
                className="primary"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                Mark Reviewed
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default HealthRecords;