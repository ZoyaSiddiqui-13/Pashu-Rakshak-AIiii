import React, { useState } from "react";
import {
  ScanSearch,
  Upload,
  Camera,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  FileText,
  RotateCcw,
} from "lucide-react";

function AIDetection() {
  const [animal, setAnimal] = useState("AN-1027");
  const [symptoms, setSymptoms] = useState("");
  const [observation, setObservation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [image, setImage] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const runAnalysis = () => {
    if (!symptoms.trim()) {
      alert("Please enter at least one symptom.");
      return;
    }

    setLoading(true);
    setAnalyzed(false);

    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1000);
  };

  const resetAnalysis = () => {
    setSymptoms("");
    setObservation("");
    setTemperature("");
    setImage(null);
    setAnalyzed(false);
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  return (
    <>
      <style>{`
        .ai-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 22px;
        }

        .ai-header h1 {
          margin: 0;
          color: #173e35;
          font-size: 30px;
        }

        .ai-header p {
          margin: 6px 0 0;
          color: #71817b;
          font-size: 13px;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 10px;
          background: #edf7d7;
          color: #527728;
          font-size: 11px;
          font-weight: 800;
        }

        .ai-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .ai-card {
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 6px 22px rgba(20,65,53,.045);
        }

        .ai-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .ai-card-header h2 {
          margin: 0;
          color: #193f36;
          font-size: 18px;
        }

        .ai-card-header p {
          margin: 4px 0 0;
          color: #84918c;
          font-size: 11px;
        }

        .ai-form {
          display: grid;
          gap: 15px;
        }

        .ai-field {
          display: grid;
          gap: 7px;
        }

        .ai-field label {
          color: #45635a;
          font-size: 11px;
          font-weight: 800;
        }

        .ai-field select,
        .ai-field input,
        .ai-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dce6e1;
          border-radius: 9px;
          outline: none;
          background: #fbfdfc;
          color: #294a41;
          font-size: 12px;
        }

        .ai-field select,
        .ai-field input {
          height: 42px;
          padding: 0 11px;
        }

        .ai-field textarea {
          min-height: 88px;
          padding: 11px;
          resize: vertical;
          font-family: inherit;
        }

        .ai-field select:focus,
        .ai-field input:focus,
        .ai-field textarea:focus {
          border-color: #8ca94d;
          box-shadow: 0 0 0 3px rgba(140,169,77,.08);
        }

        .ai-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .upload-box {
          min-height: 150px;
          border: 1.5px dashed #cbdad3;
          border-radius: 12px;
          background: #f9fcfa;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          position: relative;
        }

        .upload-content {
          display: grid;
          justify-items: center;
          gap: 6px;
          color: #71827b;
        }

        .upload-content svg {
          color: #6e9831;
        }

        .upload-content b {
          color: #3c5c52;
          font-size: 12px;
        }

        .upload-content span {
          font-size: 10px;
        }

        .upload-button {
          margin-top: 5px;
          border: 1px solid #d7e4de;
          background: #ffffff;
          color: #315b4e;
          border-radius: 8px;
          padding: 7px 11px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .upload-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .upload-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border: 0;
          border-radius: 7px;
          background: rgba(255,255,255,.9);
          color: #b33a3a;
          cursor: pointer;
        }

        .ai-submit {
          width: 100%;
          height: 46px;
          border: 0;
          border-radius: 10px;
          background: #d8f25c;
          color: #193f35;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        .ai-submit:hover {
          box-shadow: 0 8px 20px rgba(116,153,42,.18);
        }

        .ai-submit:disabled {
          opacity: .7;
          cursor: wait;
        }

        .ai-reset {
          border: 1px solid #dce6e1;
          background: #ffffff;
          color: #49655c;
          border-radius: 9px;
          height: 40px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .empty-analysis {
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #87958f;
        }

        .empty-analysis-inner {
          max-width: 300px;
          display: grid;
          justify-items: center;
          gap: 9px;
        }

        .empty-analysis-inner svg {
          color: #91ad4e;
        }

        .empty-analysis-inner b {
          color: #34564c;
          font-size: 14px;
        }

        .empty-analysis-inner span {
          font-size: 11px;
          line-height: 1.5;
        }

        .analysis-result {
          display: grid;
          gap: 16px;
        }

        .risk-result {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 13px;
          background: #fff8ed;
          border: 1px solid #f1dfbd;
        }

        .risk-circle {
          width: 82px;
          height: 82px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #fff0d4;
          color: #ad701b;
          display: grid;
          place-items: center;
          text-align: center;
        }

        .risk-circle b {
          display: block;
          font-size: 25px;
          line-height: 22px;
        }

        .risk-circle span {
          font-size: 9px;
        }

        .risk-result h3 {
          margin: 8px 0 4px;
          color: #3b4f46;
          font-size: 16px;
        }

        .risk-result p {
          margin: 0;
          color: #78857f;
          font-size: 11px;
          line-height: 1.5;
        }

        .risk-label {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          background: #fff0dc;
          color: #b76c1e;
          font-size: 9px;
          font-weight: 800;
        }

        .result-section {
          border: 1px solid #e7eeeb;
          border-radius: 12px;
          padding: 14px;
        }

        .result-section h3 {
          margin: 0 0 10px;
          color: #315248;
          font-size: 13px;
        }

        .factor-list {
          display: grid;
          gap: 8px;
        }

        .factor {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #60746c;
          font-size: 11px;
        }

        .factor svg {
          color: #7da238;
        }

        .recommendation {
          display: flex;
          gap: 10px;
          padding: 13px;
          border-radius: 11px;
          background: #eef8df;
          color: #315c40;
        }

        .recommendation svg {
          flex: 0 0 auto;
          margin-top: 2px;
        }

        .recommendation b {
          display: block;
          font-size: 12px;
        }

        .recommendation p {
          margin: 4px 0 0;
          color: #65766d;
          font-size: 10px;
          line-height: 1.5;
        }

        .result-actions {
          display: flex;
          gap: 9px;
        }

        .result-action {
          flex: 1;
          height: 41px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .result-action.primary {
          border: 0;
          background: #d8f25c;
          color: #193f35;
        }

        .result-action.secondary {
          border: 1px solid #dce6e1;
          background: #ffffff;
          color: #3d5e54;
        }

        .ai-disclaimer {
          grid-column: 1 / -1;
          padding: 13px 15px;
          border-radius: 11px;
          background: #f5f8f6;
          border: 1px solid #e4ece8;
          color: #74847d;
          font-size: 10px;
          line-height: 1.5;
        }

        .ai-disclaimer b {
          color: #48645a;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(25,63,53,.25);
          border-top-color: #193f35;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .ai-layout {
            grid-template-columns: 1fr;
          }

          .ai-disclaimer {
            grid-column: auto;
          }
        }

        @media (max-width: 600px) {
          .ai-header {
            flex-direction: column;
          }

          .ai-two {
            grid-template-columns: 1fr;
          }

          .risk-result {
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="ai-page">

        <div className="ai-header">
          <div>
            <h1>AI Disease Detection</h1>
            <p>
              AI-assisted livestock health screening using
              symptoms, observations and animal images.
            </p>
          </div>

          <div className="ai-badge">
            <Activity size={15} />
            AI Screening · Demo
          </div>
        </div>

        <div className="ai-layout">

          {/* INPUT */}

          <section className="ai-card">

            <div className="ai-card-header">
              <div>
                <h2>Health Screening</h2>
                <p>
                  Enter available animal health information.
                </p>
              </div>

              {analyzed && (
                <button
                  className="ai-reset"
                  onClick={resetAnalysis}
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>

            <div className="ai-form">

              <div className="ai-field">
                <label>SELECT ANIMAL</label>

                <select
                  value={animal}
                  onChange={(e) =>
                    setAnimal(e.target.value)
                  }
                >
                  <option value="AN-1027">
                    AN-1027 · Raja · Goat
                  </option>

                  <option value="AN-1026">
                    AN-1026 · Laxmi · Cow
                  </option>

                  <option value="AN-1025">
                    AN-1025 · Moti · Buffalo
                  </option>

                  <option value="AN-1024">
                    AN-1024 · Gauri · Cow
                  </option>
                </select>
              </div>

              <div className="ai-field">
                <label>SYMPTOMS *</label>

                <textarea
                  value={symptoms}
                  onChange={(e) =>
                    setSymptoms(e.target.value)
                  }
                  placeholder="Example: coughing, reduced appetite, nasal discharge, weakness..."
                />
              </div>

              <div className="ai-field">
                <label>OBSERVATION</label>

                <textarea
                  value={observation}
                  onChange={(e) =>
                    setObservation(e.target.value)
                  }
                  placeholder="Describe activity, feeding behaviour, visible changes or other observations..."
                />
              </div>

              <div className="ai-two">

                <div className="ai-field">
                  <label>
                    TEMPERATURE
                  </label>

                  <input
                    value={temperature}
                    onChange={(e) =>
                      setTemperature(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 103.2°F"
                  />
                </div>

                <div className="ai-field">
                  <label>
                    RECENT HISTORY
                  </label>

                  <select>
                    <option>
                      No recent illness
                    </option>

                    <option>
                      Previous illness
                    </option>

                    <option>
                      Recent treatment
                    </option>

                    <option>
                      Recent vaccination
                    </option>
                  </select>
                </div>

              </div>

              <div className="ai-field">
                <label>
                  ANIMAL PHOTO
                </label>

                <div className="upload-box">

                  {image ? (
                    <>
                      <img
                        src={image.url}
                        alt="Animal"
                        className="upload-image"
                      />

                      <button
                        className="upload-remove"
                        onClick={() =>
                          setImage(null)
                        }
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="upload-content">

                      <Camera size={26} />

                      <b>
                        Upload animal photo
                      </b>

                      <span>
                        JPG / PNG · Optional
                      </span>

                      <label className="upload-button">
                        <Upload size={12} />
                        Choose photo

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage}
                          style={{
                            display: "none",
                          }}
                        />
                      </label>

                    </div>
                  )}

                </div>
              </div>

              <button
                className="ai-submit"
                onClick={runAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Analyzing health...
                  </>
                ) : (
                  <>
                    <ScanSearch size={17} />
                    Run AI Analysis
                  </>
                )}
              </button>

            </div>

          </section>

          {/* RESULT */}

          <section className="ai-card">

            <div className="ai-card-header">
              <div>
                <h2>Analysis Result</h2>
                <p>
                  Screening output and recommended next steps.
                </p>
              </div>

              {analyzed && (
                <span className="ai-badge">
                  SIMULATED AI
                </span>
              )}
            </div>

            {!analyzed ? (
              <div className="empty-analysis">

                <div className="empty-analysis-inner">

                  <ScanSearch size={45} />

                  <b>
                    Ready for health screening
                  </b>

                  <span>
                    Enter symptoms and observations
                    on the left and run AI Analysis.
                  </span>

                </div>

              </div>
            ) : (
              <div className="analysis-result">

                <div className="risk-result">

                  <div className="risk-circle">
                    <div>
                      <b>72</b>
                      <span>Risk Score</span>
                    </div>
                  </div>

                  <div>
                    <span className="risk-label">
                      HIGH RISK
                    </span>

                    <h3>
                      Possible respiratory infection
                    </h3>

                    <p>
                      The screening indicates elevated
                      risk based on the entered symptoms
                      and observations.
                    </p>
                  </div>

                </div>

                <div className="result-section">

                  <h3>
                    Detected Risk Factors
                  </h3>

                  <div className="factor-list">

                    <div className="factor">
                      <CheckCircle2 size={14} />
                      Persistent coughing
                    </div>

                    <div className="factor">
                      <CheckCircle2 size={14} />
                      Reduced appetite
                    </div>

                    <div className="factor">
                      <CheckCircle2 size={14} />
                      Nasal discharge
                    </div>

                    <div className="factor">
                      <CheckCircle2 size={14} />
                      Activity level reduced
                    </div>

                  </div>

                </div>

                <div className="result-section">

                  <h3>
                    AI Screening Summary
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#71827b",
                      fontSize: "11px",
                      lineHeight: 1.6,
                    }}
                  >
                    The available information is
                    consistent with a potentially
                    significant respiratory health
                    concern. Further clinical evaluation
                    is recommended.
                  </p>

                </div>

                <div className="recommendation">

                  <Stethoscope size={19} />

                  <div>
                    <b>
                      Veterinarian review recommended
                    </b>

                    <p>
                      Create a case and send it to a
                      veterinarian for clinical examination.
                      Laboratory testing may be considered
                      if required.
                    </p>
                  </div>

                </div>

                <div className="result-actions">

                  <button
                    className="result-action primary"
                    onClick={() =>
                      alert(
                        "Case created successfully: CS-2049"
                      )
                    }
                  >
                    <FileText size={15} />
                    Create Case
                  </button>

                  <button
                    className="result-action secondary"
                    onClick={() =>
                      alert(
                        "Veterinarian review requested."
                      )
                    }
                  >
                    <Stethoscope size={15} />
                    Send to Vet
                  </button>

                </div>

              </div>
            )}

          </section>

          <div className="ai-disclaimer">
            <b>AI safety notice:</b>{" "}
            This prototype provides AI-assisted decision
            support only. It does not provide a definitive
            veterinary diagnosis. Clinical decisions should
            remain with a qualified veterinarian.
          </div>

        </div>

      </div>
    </>
  );
}

export default AIDetection;