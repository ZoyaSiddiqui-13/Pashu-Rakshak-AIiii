import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "register") {
      if (
        !form.name ||
        !form.email ||
        !form.mobile ||
        !form.password ||
        !form.confirmPassword
      ) {
        setMessage("Please fill all required fields.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      setMessage("Account created successfully.");
      setTimeout(() => navigate("/"), 700);
      return;
    }

    if (!form.email || !form.password) {
      setMessage("Please enter email and password.");
      return;
    }

    setMessage("Login successful.");
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          background: #f5f8f6;
        }

        .auth-visual {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(207, 239, 92, 0.20),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              #063f34,
              #075445 55%,
              #0b6654
            );
          color: #ffffff;
          padding: 55px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .auth-visual::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          right: -180px;
          bottom: -130px;
        }

        .auth-visual::after {
          content: "";
          position: absolute;
          width: 240px;
          height: 240px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 50%;
          left: -100px;
          top: 35%;
        }

        .auth-brand {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .auth-brand-mark {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          background: #d9f55d;
          color: #174b3f;
          display: grid;
          place-items: center;
        }

        .auth-brand strong {
          display: block;
          font-size: 17px;
          letter-spacing: 0.5px;
        }

        .auth-brand span {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,0.66);
          font-size: 12px;
        }

        .auth-hero {
          position: relative;
          z-index: 2;
          max-width: 590px;
        }

        .auth-hero .eyebrow {
          color: #d9f55d;
          letter-spacing: 1.5px;
          font-size: 11px;
          font-weight: 800;
        }

        .auth-hero h1 {
          margin: 14px 0;
          font-size: clamp(36px, 4vw, 58px);
          line-height: 1.05;
          letter-spacing: -1.8px;
        }

        .auth-hero p {
          max-width: 500px;
          color: rgba(255,255,255,0.72);
          font-size: 15px;
          line-height: 1.7;
        }

        .auth-feature-list {
          margin-top: 28px;
          display: grid;
          gap: 12px;
        }

        .auth-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.85);
          font-size: 13px;
        }

        .auth-feature svg {
          color: #d9f55d;
        }

        .auth-footer {
          position: relative;
          z-index: 2;
          color: rgba(255,255,255,0.5);
          font-size: 11px;
        }

        .auth-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 35px;
        }

        .auth-card {
          width: 100%;
          max-width: 475px;
          background: #ffffff;
          border: 1px solid #e4ece8;
          border-radius: 22px;
          padding: 34px;
          box-shadow: 0 20px 55px rgba(18, 59, 48, 0.10);
        }

        .auth-card-header h2 {
          margin: 0;
          color: #173e35;
          font-size: 28px;
        }

        .auth-card-header p {
          margin: 7px 0 22px;
          color: #77857f;
          font-size: 13px;
          line-height: 1.5;
        }

        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          padding: 5px;
          margin-bottom: 22px;
          background: #f1f5f3;
          border-radius: 11px;
        }

        .auth-tab {
          border: 0;
          padding: 10px;
          border-radius: 8px;
          background: transparent;
          color: #718079;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-tab.active {
          background: #ffffff;
          color: #164d40;
          box-shadow: 0 2px 8px rgba(20,60,48,0.08);
        }

        .auth-form {
          display: grid;
          gap: 15px;
        }

        .auth-field {
          display: grid;
          gap: 7px;
        }

        .auth-field label {
          color: #38574e;
          font-size: 12px;
          font-weight: 700;
        }

        .auth-input {
          position: relative;
        }

        .auth-input > svg:first-child {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #82918b;
          pointer-events: none;
        }

        .auth-input input {
          width: 100%;
          box-sizing: border-box;
          height: 45px;
          border: 1px solid #dce6e1;
          border-radius: 10px;
          padding: 0 42px;
          outline: none;
          color: #183f36;
          background: #fbfdfc;
          font-size: 13px;
          transition: 0.2s;
        }

        .auth-input input:focus {
          border-color: #88aa42;
          box-shadow: 0 0 0 3px rgba(136,170,66,0.10);
          background: #ffffff;
        }

        .password-toggle {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          width: 31px;
          height: 31px;
          border: 0;
          background: transparent;
          color: #7b8b85;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .auth-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #71817a;
          font-size: 11px;
        }

        .remember input {
          accent-color: #7da82d;
        }

        .forgot {
          border: 0;
          background: transparent;
          color: #34705f;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-submit {
          height: 46px;
          border: 0;
          border-radius: 10px;
          background: #d8f25c;
          color: #183f35;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.2s;
        }

        .auth-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(121, 157, 43, 0.20);
        }

        .auth-message {
          padding: 10px 12px;
          border-radius: 9px;
          background: #f0f8e2;
          color: #476a27;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .auth-security {
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid #edf1ef;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #83918c;
          font-size: 10px;
        }

        .auth-security svg {
          color: #6d9830;
        }

        .auth-demo {
          margin-top: 15px;
          padding: 11px;
          border-radius: 9px;
          background: #f6f9f7;
          color: #718079;
          text-align: center;
          font-size: 10px;
        }

        @media (max-width: 850px) {
          .auth-page {
            grid-template-columns: 1fr;
          }

          .auth-visual {
            min-height: 330px;
            padding: 30px;
          }

          .auth-hero h1 {
            font-size: 38px;
          }

          .auth-feature-list {
            display: none;
          }

          .auth-form-side {
            padding: 25px 15px;
          }
        }

        @media (max-width: 500px) {
          .auth-card {
            padding: 24px;
            border-radius: 16px;
          }

          .auth-visual {
            padding: 24px;
          }

          .auth-hero h1 {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="auth-page">

        {/* LEFT SIDE */}

        <section className="auth-visual">

          <div className="auth-brand">
            <div className="auth-brand-mark">
              <PawPrint size={26} />
            </div>

            <div>
              <strong>PASHU-RAKSHAK AI</strong>
              <span>
                Livestock Health Command Center
              </span>
            </div>
          </div>

          <div className="auth-hero">

            <span className="eyebrow">
              SMART LIVESTOCK HEALTH
            </span>

            <h1>
              Protect every animal.
              <br />
              Detect risk early.
            </h1>

            <p>
              A centralized livestock health platform for
              AI-assisted screening, alerts, veterinary review,
              laboratory testing and follow-up management.
            </p>

            <div className="auth-feature-list">

              <div className="auth-feature">
                <CheckCircle2 size={17} />
                AI-assisted health screening
              </div>

              <div className="auth-feature">
                <CheckCircle2 size={17} />
                Early-warning disease alerts
              </div>

              <div className="auth-feature">
                <CheckCircle2 size={17} />
                Veterinarian and laboratory workflow
              </div>

              <div className="auth-feature">
                <CheckCircle2 size={17} />
                Health records and surveillance
              </div>

            </div>

          </div>

          <div className="auth-footer">
            PASHU-RAKSHAK AI · Demo Prototype
          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="auth-form-side">

          <div className="auth-card">

            <div className="auth-card-header">

              <h2>
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p>
                {mode === "login"
                  ? "Sign in to access your livestock health dashboard."
                  : "Create an account to manage farms, animals and health cases."}
              </p>

            </div>

            {/* TABS */}

            <div className="auth-tabs">

              <button
                className={
                  mode === "login"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Login
              </button>

              <button
                className={
                  mode === "register"
                    ? "auth-tab active"
                    : "auth-tab"
                }
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                Register
              </button>

            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              {mode === "register" && (
                <div className="auth-field">

                  <label>
                    Full Name
                  </label>

                  <div className="auth-input">

                    <UserIcon />

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateForm(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                </div>
              )}

              {/* EMAIL */}

              <div className="auth-field">

                <label>
                  Email Address
                </label>

                <div className="auth-input">

                  <Mail size={17} />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateForm(
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="you@example.com"
                  />

                </div>

              </div>

              {/* MOBILE */}

              {mode === "register" && (
                <div className="auth-field">

                  <label>
                    Mobile Number
                  </label>

                  <div className="auth-input">

                    <Phone size={17} />

                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) =>
                        updateForm(
                          "mobile",
                          e.target.value
                        )
                      }
                      placeholder="+91 98765 43210"
                    />

                  </div>

                </div>
              )}

              {/* PASSWORD */}

              <div className="auth-field">

                <label>
                  Password
                </label>

                <div className="auth-input">

                  <Lock size={17} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={(e) =>
                      updateForm(
                        "password",
                        e.target.value
                      )
                    }
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              {mode === "register" && (
                <div className="auth-field">

                  <label>
                    Confirm Password
                  </label>

                  <div className="auth-input">

                    <Lock size={17} />

                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateForm(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Confirm your password"
                    />

                  </div>

                </div>
              )}

              {/* LOGIN OPTIONS */}

              {mode === "login" && (
                <div className="auth-row">

                  <label className="remember">

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                    Remember me

                  </label>

                  <button
                    type="button"
                    className="forgot"
                    onClick={() =>
                      setMessage(
                        "Password reset is available in the demo flow."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>
              )}

              {/* MESSAGE */}

              {message && (
                <div className="auth-message">
                  <CheckCircle2 size={15} />
                  {message}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-submit"
              >
                {mode === "login"
                  ? "Sign in"
                  : "Create account"}

                <ArrowRight size={17} />
              </button>

            </form>

            {/* SECURITY */}

            <div className="auth-security">

              <ShieldCheck size={17} />

              <span>
                Your account information is protected
                in this demo interface.
              </span>

            </div>

            <div className="auth-demo">
              Demo prototype · No real account is created
            </div>

          </div>

        </section>

      </div>
    </>
  );
}

function UserIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default Login;