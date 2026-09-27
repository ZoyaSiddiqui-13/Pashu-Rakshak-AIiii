import React, { useMemo, useState } from "react";
import {
  FlaskConical,
  Search,
  Plus,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  X,
  PawPrint,
  MapPin,
} from "lucide-react";

function Laboratory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showRequest, setShowRequest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const [tests, setTests] = useState([
    {
      id: "LAB-8031",
      caseId: "CS-2048",
      animal: "Raja",
      animalId: "AN-1027",
      location: "Ahmednagar",
      test: "Respiratory Panel",
      sample: "Nasal Swab",
      requestedBy: "Dr. Mehta",
      date: "Sep 27, 2026",
      status: "Processing",
      result: null,
    },
    {
      id: "LAB-8030",
      caseId: "CS-2047",
      animal: "Laxmi",
      animalId: "AN-1026",
      location: "Satara",
      test: "Blood Test",
      sample: "Blood",
      requestedBy: "Dr. Patil",
      date: "Sep 26, 2026",
      status: "Report Ready",
      result: "Inflammatory markers elevated",
    },
    {
      id: "LAB-8029",
      caseId: "CS-2046",
      animal: "Moti",
      animalId: "AN-1025",
      location: "Pune",
      test: "Fever Panel",
      sample: "Blood",
      requestedBy: "Dr. Shah",
      date: "Sep 25, 2026",
      status: "Sample Collected",
      result: null,
    },
    {
      id: "LAB-8028",
      caseId: "CS-2045",
      animal: "Gauri",
      animalId: "AN-1024",
      location: "Nashik",
      test: "Parasite Screening",
      sample: "Stool",
      requestedBy: "Dr. Mehta",
      date: "Sep 24, 2026",
      status: "Completed",
      result: "No significant parasites detected",
    },
    {
      id: "LAB-8027",
      caseId: "CS-2044",
      animal: "Kali",
      animalId: "AN-1028",
      location: "Solapur",
      test: "FMD Screening",
      sample: "Blood",
      requestedBy: "Dr. Patil",
      date: "Sep 23, 2026",
      status: "Completed",
      result: "Negative",
    },
    {
      id: "LAB-8026",
      caseId: "CS-2043",
      animal: "Maya",
      animalId: "AN-1029",
      location: "Thane",
      test: "General Health Panel",
      sample: "Blood",
      requestedBy: "Dr. Shah",
      date: "Sep 22, 2026",
      status: "Processing",
      result: null,
    },
  ]);

  const filteredTests = useMemo(() => {
    return tests.filter((item) => {
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
        item.test +
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
  }, [tests, search, filter]);

  const counts = {
    total: tests.length,
    processing: tests.filter(
      (x) => x.status === "Processing"
    ).length,
    ready: tests.filter(
      (x) => x.status === "Report Ready"
    ).length,
    completed: tests.filter(
      (x) => x.status === "Completed"
    ).length,
  };

  function statusClass(status) {
    if (status === "Report Ready") {
      return "ready";
    }

    if (status === "Processing") {
      return "processing";
    }

    if (status === "Sample Collected") {
      return "collected";
    }

    return "completed";
  }

  function statusIcon(status) {
    if (status === "Report Ready") {
      return <FileText size={15} />;
    }

    if (status === "Processing") {
      return <Clock3 size={15} />;
    }

    if (status === "Sample Collected") {
      return <FlaskConical size={15} />;
    }

    return <CheckCircle2 size={15} />;
  }

  function addTest() {
    const newTest = {
      id: `LAB-${8032 + tests.length}`,
      caseId: "CS-2050",
      animal: "New Animal",
      animalId: "AN-1030",
      location: "Pune",
      test: "General Health Panel",
      sample: "Blood",
      requestedBy: "Farm Admin",
      date: "Sep 27, 2026",
      status: "Sample Collected",
      result: null,
    };

    setTests((current) => [
      newTest,
      ...current,
    ]);

    setShowRequest(false);
  }

  return (
    <>
      <style>{`
        .lab-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .lab-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .lab-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .lab-header p {
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

        .lab-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .lab-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .lab-stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #6d9135;
        }

        .lab-stat b {
          display: block;
          color: #284c42;
          font-size: 19px;
        }

        .lab-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .lab-toolbar {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .lab-search {
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

        .lab-search svg {
          color: #84928c;
        }

        .lab-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 11px;
          color: #34574d;
        }

        .lab-filter {
          height: 38px;
          min-width: 145px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fff;
          color: #526b62;
          padding: 0 10px;
          font-size: 10px;
          font-weight: 700;
          outline: none;
        }

        .lab-table-card {
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
          border-collapse: collapse;
          min-width: 850px;
        }

        th {
          text-align: left;
          padding: 12px 14px;
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

        .test-id {
          color: #4c695f;
          font-weight: 900;
        }

        .animal-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .animal-icon {
          width: 28px;
          height: 28px;
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

        .status-badge.processing {
          background: #fff8d9;
          color: #89751c;
        }

        .status-badge.ready {
          background: #e8f2ff;
          color: #4773a7;
        }

        .status-badge.collected {
          background: #fff0df;
          color: #b16a1d;
        }

        .status-badge.completed {
          background: #eef8df;
          color: #5d8132;
        }

        .view-btn {
          border: 1px solid #dce6e1;
          background: #fff;
          color: #526b62;
          height: 29px;
          padding: 0 8px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 8px;
          font-weight: 800;
        }

        .view-btn:hover {
          background: #f5f8f6;
        }

        .empty-lab {
          text-align: center;
          padding: 55px;
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

        .lab-modal {
          width: min(540px, 100%);
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(20,50,40,.2);
        }

        .modal-top {
          padding: 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-top h2 {
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

        .lab-title {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 15px;
        }

        .lab-big-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: #edf4e2;
          color: #688b37;
        }

        .lab-title h3 {
          margin: 0;
          color: #2d5147;
          font-size: 14px;
        }

        .lab-title span {
          display: block;
          color: #89958f;
          margin-top: 3px;
          font-size: 9px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .detail-box {
          background: #f7faf8;
          border-radius: 9px;
          padding: 10px;
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

        .result-box {
          margin-top: 12px;
          background: #eef8df;
          border-radius: 10px;
          padding: 12px;
        }

        .result-box strong {
          display: block;
          color: #55782e;
          font-size: 9px;
          margin-bottom: 5px;
        }

        .result-box p {
          margin: 0;
          color: #64775d;
          font-size: 9px;
          line-height: 1.5;
        }

        .upload-box {
          margin-top: 12px;
          border: 1px dashed #bfcfc7;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          color: #7e8c85;
          font-size: 9px;
        }

        .upload-box svg {
          display: block;
          margin: 0 auto 6px;
          color: #72963a;
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
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .modal-footer .primary {
          background: #dff46b;
          border-color: #dff46b;
          color: #29452e;
        }

        .request-form {
          display: grid;
          gap: 11px;
        }

        .request-form label {
          color: #60756c;
          font-size: 9px;
          font-weight: 800;
        }

        .request-form input,
        .request-form select {
          display: block;
          width: 100%;
          box-sizing: border-box;
          height: 37px;
          margin-top: 5px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          padding: 0 10px;
          outline: none;
          color: #405e55;
          background: #fbfdfc;
          font-size: 10px;
        }

        @media (max-width: 800px) {
          .lab-stats {
            grid-template-columns: 1fr 1fr;
          }

          .lab-header {
            flex-direction: column;
          }
        }

        @media (max-width: 550px) {
          .lab-stats {
            grid-template-columns: 1fr;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="lab-page">

        <div className="lab-header">

          <div>
            <h1>Laboratory</h1>

            <p>
              Track test requests, sample collection,
              processing and veterinary reports.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() =>
              setShowRequest(true)
            }
          >
            <Plus size={16} />
            Request Test
          </button>

        </div>

        {/* STATS */}

        <div className="lab-stats">

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <FlaskConical size={18} />
            </div>
            <div>
              <b>{counts.total}</b>
              <span>Total Tests</span>
            </div>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <Clock3 size={18} />
            </div>
            <div>
              <b>{counts.processing}</b>
              <span>Processing</span>
            </div>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <FileText size={18} />
            </div>
            <div>
              <b>{counts.ready}</b>
              <span>Reports Ready</span>
            </div>
          </div>

          <div className="lab-stat">
            <div className="lab-stat-icon">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <b>{counts.completed}</b>
              <span>Completed</span>
            </div>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="lab-toolbar">

          <div className="lab-search">

            <Search size={14} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search test, animal, case or location..."
            />

          </div>

          <select
            className="lab-filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">
              All statuses
            </option>
            <option value="Processing">
              Processing
            </option>
            <option value="Sample Collected">
              Sample Collected
            </option>
            <option value="Report Ready">
              Report Ready
            </option>
            <option value="Completed">
              Completed
            </option>
          </select>

        </div>

        {/* TABLE */}

        <section className="lab-table-card">

          <div className="table-head">

            <div>
              <h2>Test Requests</h2>
              <span>
                {filteredTests.length} records found
              </span>
            </div>

          </div>

          <div className="table-scroll">

            {filteredTests.length === 0 ? (
              <div className="empty-lab">
                No laboratory records found.
              </div>
            ) : (
              <table>

                <thead>
                  <tr>
                    <th>Sample ID</th>
                    <th>Animal</th>
                    <th>Case</th>
                    <th>Test</th>
                    <th>Location</th>
                    <th>Requested</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTests.map(
                    (item) => (
                      <tr key={item.id}>

                        <td>
                          <span className="test-id">
                            {item.id}
                          </span>
                        </td>

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
                                {item.animalId}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <strong>
                            {item.caseId}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {item.test}
                          </strong>
                          <br />
                          {item.sample}
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
                          {item.date}
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
                              setSelectedTest(
                                item
                              )
                            }
                          >
                            <Eye size={12} />
                            View
                          </button>

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

      {/* TEST DETAILS MODAL */}

      {selectedTest && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedTest(null)
          }
        >

          <div
            className="lab-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-top">

              <h2>
                Laboratory Test Details
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedTest(null)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="lab-title">

                <div className="lab-big-icon">
                  <FlaskConical size={21} />
                </div>

                <div>
                  <h3>
                    {selectedTest.test}
                  </h3>

                  <span>
                    {selectedTest.id} ·{" "}
                    {selectedTest.caseId}
                  </span>
                </div>

              </div>

              <div className="detail-grid">

                <div className="detail-box">
                  <span>ANIMAL</span>
                  <b>
                    {selectedTest.animal}
                  </b>
                </div>

                <div className="detail-box">
                  <span>ANIMAL ID</span>
                  <b>
                    {selectedTest.animalId}
                  </b>
                </div>

                <div className="detail-box">
                  <span>SAMPLE</span>
                  <b>
                    {selectedTest.sample}
                  </b>
                </div>

                <div className="detail-box">
                  <span>LOCATION</span>
                  <b>
                    {selectedTest.location}
                  </b>
                </div>

                <div className="detail-box">
                  <span>REQUESTED BY</span>
                  <b>
                    {selectedTest.requestedBy}
                  </b>
                </div>

                <div className="detail-box">
                  <span>DATE</span>
                  <b>
                    {selectedTest.date}
                  </b>
                </div>

              </div>

              <div
                style={{
                  marginTop: 13,
                }}
              >
                <span
                  className={`status-badge ${statusClass(
                    selectedTest.status
                  )}`}
                >
                  {statusIcon(
                    selectedTest.status
                  )}
                  {selectedTest.status}
                </span>
              </div>

              {selectedTest.result ? (
                <div className="result-box">

                  <strong>
                    LABORATORY RESULT
                  </strong>

                  <p>
                    {selectedTest.result}
                  </p>

                </div>
              ) : (
                <div className="upload-box">
                  <Upload size={19} />
                  Report will appear here when
                  laboratory processing is complete.
                </div>
              )}

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setSelectedTest(null)
                }
              >
                Close
              </button>

              {selectedTest.status ===
                "Report Ready" && (
                <button
                  className="primary"
                  onClick={() =>
                    alert(
                      "Report marked for veterinary review."
                    )
                  }
                >
                  Send to Veterinarian
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* REQUEST TEST MODAL */}

      {showRequest && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowRequest(false)
          }
        >

          <div
            className="lab-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-top">

              <h2>
                Request Laboratory Test
              </h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowRequest(false)
                }
              >
                <X size={17} />
              </button>

            </div>

            <div className="modal-body">

              <div className="request-form">

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
                  Test Type
                  <select>
                    <option>
                      Respiratory Panel
                    </option>
                    <option>
                      Blood Test
                    </option>
                    <option>
                      Fever Panel
                    </option>
                    <option>
                      Parasite Screening
                    </option>
                    <option>
                      FMD Screening
                    </option>
                    <option>
                      General Health Panel
                    </option>
                  </select>
                </label>

                <label>
                  Sample Type
                  <select>
                    <option>Blood</option>
                    <option>Nasal Swab</option>
                    <option>Stool</option>
                    <option>Urine</option>
                  </select>
                </label>

              </div>

            </div>

            <div className="modal-footer">

              <button
                onClick={() =>
                  setShowRequest(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary"
                onClick={addTest}
              >
                Submit Request
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Laboratory;