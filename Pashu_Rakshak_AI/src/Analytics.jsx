import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  ShieldAlert,
  Syringe,
  Brain,
  MapPinned,
  CalendarDays,
  Download,
  CheckCircle2,
} from "lucide-react";

function Analytics() {
  const [period, setPeriod] = useState("Last 30 Days");

  const riskData = [
    { label: "Low Risk", value: 62 },
    { label: "Medium Risk", value: 23 },
    { label: "High Risk", value: 11 },
    { label: "Critical", value: 4 },
  ];

  const monthlyCases = [
    { month: "Apr", value: 22 },
    { month: "May", value: 31 },
    { month: "Jun", value: 27 },
    { month: "Jul", value: 42 },
    { month: "Aug", value: 51 },
    { month: "Sep", value: 64 },
  ];

  const regions = [
    { name: "Ahmednagar", cases: 38, risk: "Critical", farms: 24 },
    { name: "Satara", cases: 29, risk: "High", farms: 19 },
    { name: "Pune", cases: 21, risk: "Medium", farms: 27 },
    { name: "Nashik", cases: 16, risk: "Medium", farms: 18 },
    { name: "Solapur", cases: 11, risk: "Low", farms: 14 },
  ];

  const maxCases = Math.max(...monthlyCases.map((item) => item.value));

  function riskClass(risk) {
    if (risk === "Critical") return "critical";
    if (risk === "High") return "high";
    if (risk === "Medium") return "medium";
    return "low";
  }

  function exportReport() {
    alert("Analytics report prepared for export.");
  }

  return (
    <>
      <style>{`
        .analytics-page {
          max-width: 1250px;
          margin: 0 auto;
          padding-bottom: 35px;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .analytics-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 29px;
        }

        .analytics-header p {
          margin: 6px 0 0;
          color: #7d8b85;
          font-size: 12px;
        }

        .analytics-actions {
          display: flex;
          gap: 8px;
        }

        .period-select {
          height: 38px;
          border: 1px solid #dce6e1;
          border-radius: 8px;
          background: #fff;
          color: #526b62;
          padding: 0 10px;
          outline: none;
          font-size: 9px;
          font-weight: 800;
        }

        .export-btn {
          height: 38px;
          border: 0;
          border-radius: 8px;
          background: #dff46b;
          color: #29452e;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .analytics-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          margin-bottom: 16px;
        }

        .analytics-stat {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 13px;
          padding: 15px;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-icon {
          width: 37px;
          height: 37px;
          border-radius: 10px;
          background: #eef5e4;
          color: #6d9135;
          display: grid;
          place-items: center;
        }

        .stat-change {
          color: #68903a;
          background: #eef8df;
          border-radius: 999px;
          padding: 4px 6px;
          font-size: 7px;
          font-weight: 900;
        }

        .analytics-stat b {
          display: block;
          color: #284c42;
          font-size: 21px;
          margin-top: 12px;
        }

        .analytics-stat span {
          color: #87938d;
          font-size: 9px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .analytics-card {
          background: #fff;
          border: 1px solid #e2ebe7;
          border-radius: 15px;
          overflow: hidden;
        }

        .analytics-card-head {
          padding: 15px 16px;
          border-bottom: 1px solid #e7eeeb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .analytics-card-head h2 {
          margin: 0;
          color: #24483e;
          font-size: 15px;
        }

        .analytics-card-head span {
          color: #89958f;
          font-size: 8px;
        }

        .chart-body {
          padding: 18px;
        }

        .bar-chart {
          height: 230px;
          display: flex;
          align-items: flex-end;
          gap: 18px;
          border-bottom: 1px solid #dfe8e3;
          position: relative;
        }

        .chart-grid-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: #edf2ef;
        }

        .grid-one {
          bottom: 25%;
        }

        .grid-two {
          bottom: 50%;
        }

        .grid-three {
          bottom: 75%;
        }

        .bar-column {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .bar-value {
          color: #688a39;
          font-size: 8px;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .bar {
          width: min(38px, 70%);
          min-height: 5px;
          border-radius: 6px 6px 0 0;
          background: #c7dc76;
        }

        .bar-month {
          color: #87948e;
          font-size: 8px;
          margin-top: 7px;
        }

        .risk-chart {
          padding: 20px;
        }

        .donut-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 20px;
        }

        .donut {
          width: 145px;
          height: 145px;
          border-radius: 50%;
          background:
            conic-gradient(
              #83a94c 0deg 223deg,
              #c7a83c 223deg 306deg,
              #dc8a3b 306deg 346deg,
              #c94d43 346deg 360deg
            );
          display: grid;
          place-items: center;
        }

        .donut-inner {
          width: 92px;
          height: 92px;
          border-radius: 50%;
          background: white;
          display: grid;
          place-items: center;
          text-align: center;
        }

        .donut-inner b {
          display: block;
          color: #315349;
          font-size: 19px;
        }

        .donut-inner span {
          color: #89958f;
          font-size: 7px;
        }

        .risk-legend {
          display: grid;
          gap: 9px;
          flex: 1;
        }

        .risk-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .risk-name {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #62766e;
          font-size: 8px;
        }

        .risk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .risk-number {
          color: #3f5d54;
          font-size: 8px;
          font-weight: 900;
        }

        .health-score {
          margin-top: 5px;
          padding: 13px;
          background: #f7faf8;
          border-radius: 10px;
        }

        .health-score-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
        }

        .health-score-top span {
          color: #74847d;
          font-size: 8px;
        }

        .health-score-top b {
          color: #5f8434;
          font-size: 10px;
        }

        .progress {
          height: 7px;
          background: #e3ebe5;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          width: 86%;
          height: 100%;
          background: #9fbe58;
          border-radius: inherit;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 15px;
        }

        .ai-metrics {
          padding: 15px;
          display: grid;
          gap: 10px;
        }

        .ai-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          background: #f7faf8;
          border-radius: 9px;
        }

        .ai-row-icon {
          width: 33px;
          height: 33px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #6d9135;
        }

        .ai-row-content {
          flex: 1;
        }

        .ai-row-content b {
          display: block;
          color: #405f55;
          font-size: 10px;
        }

        .ai-row-content span {
          color: #89958f;
          font-size: 7px;
        }

        .ai-value {
          color: #5e8036;
          font-size: 11px;
          font-weight: 900;
        }

        .region-table {
          padding: 8px;
        }

        .region-row {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr 0.7fr 0.8fr;
          align-items: center;
          gap: 10px;
          padding: 12px 9px;
          border-bottom: 1px solid #edf1ef;
        }

        .region-row:last-child {
          border-bottom: 0;
        }

        .region-head {
          color: #89958f;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .region-name {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #456359;
          font-size: 9px;
          font-weight: 900;
        }

        .region-name svg {
          color: #789449;
        }

        .region-value {
          color: #63766e;
          font-size: 9px;
        }

        .region-risk {
          justify-self: start;
          border-radius: 999px;
          padding: 4px 7px;
          font-size: 7px;
          font-weight: 900;
        }

        .region-risk.critical {
          background: #ffe7e4;
          color: #b43d35;
        }

        .region-risk.high {
          background: #fff0df;
          color: #b76a1d;
        }

        .region-risk.medium {
          background: #fff8d8;
          color: #89751c;
        }

        .region-risk.low {
          background: #eef8df;
          color: #5e8132;
        }

        .analytics-note {
          margin-top: 15px;
          padding: 11px 13px;
          border-radius: 9px;
          background: #f0f6e6;
          color: #62765a;
          font-size: 8px;
          line-height: 1.5;
        }

        @media (max-width: 950px) {
          .analytics-stats {
            grid-template-columns: 1fr 1fr;
          }

          .analytics-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .analytics-stats {
            grid-template-columns: 1fr;
          }

          .analytics-header {
            flex-direction: column;
          }

          .analytics-actions {
            width: 100%;
          }

          .period-select,
          .export-btn {
            flex: 1;
          }

          .donut-wrap {
            flex-direction: column;
          }

          .region-row {
            grid-template-columns: 1.2fr 0.6fr 0.7fr;
          }

          .region-row > :last-child {
            display: none;
          }
        }
      `}</style>

      <div className="analytics-page">
        <div className="analytics-header">
          <div>
            <h1>Analytics</h1>
            <p>
              Monitor animal health, disease patterns, AI screening and
              regional surveillance.
            </p>
          </div>

          <div className="analytics-actions">
            <select
              className="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>

            <button className="export-btn" onClick={exportReport}>
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        <div className="analytics-stats">
          <div className="analytics-stat">
            <div className="stat-top">
              <div className="stat-icon">
                <Activity size={17} />
              </div>
              <div className="stat-change">+12.4%</div>
            </div>
            <b>86%</b>
            <span>Average Health Score</span>
          </div>

          <div className="analytics-stat">
            <div className="stat-top">
              <div className="stat-icon">
                <ShieldAlert size={17} />
              </div>
              <div className="stat-change">-8.2%</div>
            </div>
            <b>12</b>
            <span>Critical Cases</span>
          </div>

          <div className="analytics-stat">
            <div className="stat-top">
              <div className="stat-icon">
                <Brain size={17} />
              </div>
              <div className="stat-change">+15.7%</div>
            </div>
            <b>94%</b>
            <span>AI Screening Coverage</span>
          </div>

          <div className="analytics-stat">
            <div className="stat-top">
              <div className="stat-icon">
                <Syringe size={17} />
              </div>
              <div className="stat-change">+6.1%</div>
            </div>
            <b>91%</b>
            <span>Vaccination Coverage</span>
          </div>
        </div>

        <div className="analytics-grid">
          <section className="analytics-card">
            <div className="analytics-card-head">
              <div>
                <h2>Disease Cases Trend</h2>
                <span>{period}</span>
              </div>
              <TrendingUp size={17} color="#739044" />
            </div>

            <div className="chart-body">
              <div className="bar-chart">
                <div className="chart-grid-line grid-one"></div>
                <div className="chart-grid-line grid-two"></div>
                <div className="chart-grid-line grid-three"></div>

                {monthlyCases.map((item) => (
                  <div className="bar-column" key={item.month}>
                    <div className="bar-value">{item.value}</div>

                    <div
                      className="bar"
                      style={{
                        height: `${(item.value / maxCases) * 78}%`,
                      }}
                    ></div>

                    <div className="bar-month">{item.month}</div>
                  </div>
                ))}
              </div>

              <div className="analytics-note">
                Disease reports have increased over the selected period.
                Regional clusters should continue to be reviewed through the
                surveillance workflow.
              </div>
            </div>
          </section>

          <section className="analytics-card">
            <div className="analytics-card-head">
              <div>
                <h2>Risk Distribution</h2>
                <span>Current animal population</span>
              </div>
              <ShieldAlert size={17} color="#739044" />
            </div>

            <div className="risk-chart">
              <div className="donut-wrap">
                <div className="donut">
                  <div className="donut-inner">
                    <div>
                      <b>300</b>
                      <span>Animals</span>
                    </div>
                  </div>
                </div>

                <div className="risk-legend">
                  {riskData.map((item, index) => (
                    <div className="risk-row" key={item.label}>
                      <div className="risk-name">
                        <span
                          className="risk-dot"
                          style={{
                            background:
                              index === 0
                                ? "#83a94c"
                                : index === 1
                                ? "#c7a83c"
                                : index === 2
                                ? "#dc8a3b"
                                : "#c94d43",
                          }}
                        ></span>
                        {item.label}
                      </div>

                      <div className="risk-number">{item.value}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="health-score">
                <div className="health-score-top">
                  <span>Overall population health</span>
                  <b>86 / 100</b>
                </div>

                <div className="progress">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bottom-grid">
          <section className="analytics-card">
            <div className="analytics-card-head">
              <div>
                <h2>System Performance</h2>
                <span>AI & health monitoring</span>
              </div>
              <Brain size={17} color="#739044" />
            </div>

            <div className="ai-metrics">
              <div className="ai-row">
                <div className="ai-row-icon">
                  <Brain size={16} />
                </div>

                <div className="ai-row-content">
                  <b>AI Screening</b>
                  <span>Cases screened by AI workflow</span>
                </div>

                <div className="ai-value">284</div>
              </div>

              <div className="ai-row">
                <div className="ai-row-icon">
                  <Activity size={16} />
                </div>

                <div className="ai-row-content">
                  <b>Health Assessments</b>
                  <span>Animal assessments completed</span>
                </div>

                <div className="ai-value">391</div>
              </div>

              <div className="ai-row">
                <div className="ai-row-icon">
                  <Syringe size={16} />
                </div>

                <div className="ai-row-content">
                  <b>Vaccinations</b>
                  <span>Vaccination records updated</span>
                </div>

                <div className="ai-value">273</div>
              </div>

              <div className="ai-row">
                <div className="ai-row-icon">
                  <CheckCircle2 size={16} />
                </div>

                <div className="ai-row-content">
                  <b>Resolved Cases</b>
                  <span>Cases completed after review</span>
                </div>

                <div className="ai-value">178</div>
              </div>
            </div>
          </section>

          <section className="analytics-card">
            <div className="analytics-card-head">
              <div>
                <h2>Regional Disease Intelligence</h2>
                <span>Highest activity regions</span>
              </div>
              <MapPinned size={17} color="#739044" />
            </div>

            <div className="region-table">
              <div className="region-row">
                <div className="region-head">Region</div>
                <div className="region-head">Cases</div>
                <div className="region-head">Risk</div>
                <div className="region-head">Farms</div>
              </div>

              {regions.map((region) => (
                <div className="region-row" key={region.name}>
                  <div className="region-name">
                    <MapPinned size={11} />
                    {region.name}
                  </div>

                  <div className="region-value">{region.cases}</div>

                  <div className={`region-risk ${riskClass(region.risk)}`}>
                    {region.risk}
                  </div>

                  <div className="region-value">{region.farms}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="analytics-note">
          <CalendarDays
            size={11}
            style={{
              verticalAlign: "middle",
              marginRight: 5,
            }}
          />
          Analytics are based on recorded animal health, screening,
          treatment, vaccination and surveillance data. AI outputs are
          intended as decision-support signals and should be reviewed by
          veterinary professionals where required.
        </div>
      </div>
    </>
  );
}

export default Analytics;