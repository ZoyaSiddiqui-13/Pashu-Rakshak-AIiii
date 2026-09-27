import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  PawPrint,
  Globe2,
  User,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";


export default function Login() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("error");

  const loginText = {
    en: {
      welcome: "Welcome back",
      create: "Create your account",
      loginSubtitle:
        "Sign in with your authorized role credentials.",
      registerSubtitle:
        "Create an account for the demo platform.",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      mobile: "Mobile Number",
      mobilePlaceholder: "+91 98765 43210",
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPassword: "Confirm Password",
      confirmPlaceholder: "Confirm your password",
      remember: "Remember me",
      forgot: "Forgot password?",
      signIn: "Sign in",
      createAccount: "Create account",
      protected:
        "Role-based demo access is enabled for this prototype.",
      demo:
        "Demo prototype • Use the credentials shown below.",
      invalid:
        "Invalid email or password. Please use an authorized demo account.",
      fillAll:
        "Please fill all required fields.",
      mismatch:
        "Passwords do not match.",
      accountCreated:
        "Demo account details saved. Continue to role selection.",
      recovery:
        "For the demo, use the credentials shown below.",
      smallHeading: "SMART LIVESTOCK HEALTH",
      heroTitle1: "Protect every animal.",
      heroTitle2: "Detect risk early.",
      heroText:
        "A centralized livestock health platform for AI-assisted screening, alerts, veterinary review, laboratory testing and follow-up management.",
      feature1: "AI-assisted health screening",
      feature2: "Early-warning disease alerts",
      feature3: "Veterinarian and laboratory workflow",
      feature4: "Health records and surveillance",
      footer: "PASHU-RAKSHAK AI • Demo Prototype",
      brandSub: "Livestock Health Command Center",
    },

    hi: {
      welcome: "वापसी पर स्वागत है",
      create: "अपना अकाउंट बनाएँ",
      loginSubtitle:
        "अपनी अधिकृत भूमिका के ईमेल और पासवर्ड से साइन इन करें।",
      registerSubtitle:
        "डेमो प्लेटफॉर्म के लिए अकाउंट बनाएँ।",
      email: "ईमेल पता",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      mobile: "मोबाइल नंबर",
      mobilePlaceholder: "+91 98765 43210",
      name: "पूरा नाम",
      namePlaceholder: "अपना पूरा नाम दर्ज करें",
      password: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      confirmPlaceholder:
        "अपना पासवर्ड दोबारा दर्ज करें",
      remember: "मुझे याद रखें",
      forgot: "पासवर्ड भूल गए?",
      signIn: "साइन इन",
      createAccount: "अकाउंट बनाएँ",
      protected:
        "इस प्रोटोटाइप में भूमिका-आधारित डेमो एक्सेस सक्षम है।",
      demo:
        "डेमो प्रोटोटाइप • नीचे दिए गए क्रेडेंशियल का उपयोग करें।",
      invalid:
        "ईमेल या पासवर्ड गलत है। अधिकृत डेमो अकाउंट का उपयोग करें।",
      fillAll: "कृपया सभी आवश्यक फ़ील्ड भरें।",
      mismatch: "पासवर्ड मेल नहीं खाते।",
      accountCreated:
        "डेमो अकाउंट जानकारी सेव हो गई। अब भूमिका चयन पर जाएँ।",
      recovery:
        "डेमो के लिए नीचे दिए गए क्रेडेंशियल का उपयोग करें।",
      smallHeading: "स्मार्ट पशुधन स्वास्थ्य",
      heroTitle1: "हर पशु की रक्षा करें।",
      heroTitle2: "जोखिम जल्दी पहचानें।",
      heroText:
        "AI-सहायित जांच, अलर्ट, पशु चिकित्सक समीक्षा, लैब टेस्ट और फॉलो-अप प्रबंधन के लिए केंद्रीकृत पशुधन स्वास्थ्य प्लेटफॉर्म।",
      feature1: "AI-सहायित स्वास्थ्य जांच",
      feature2: "शुरुआती रोग चेतावनी",
      feature3: "पशु चिकित्सक और लैब वर्कफ्लो",
      feature4: "स्वास्थ्य रिकॉर्ड और निगरानी",
      footer: "PASHU-RAKSHAK AI • डेमो प्रोटोटाइप",
      brandSub: "पशुधन स्वास्थ्य कमांड सेंटर",
    },

    mr: {
      welcome: "पुन्हा स्वागत आहे",
      create: "तुमचे अकाउंट तयार करा",
      loginSubtitle:
        "तुमच्या अधिकृत भूमिकेच्या ईमेल आणि पासवर्डने साइन इन करा.",
      registerSubtitle:
        "डेमो प्लॅटफॉर्मसाठी अकाउंट तयार करा.",
      email: "ईमेल पत्ता",
      emailPlaceholder: "तुमचा ईमेल लिहा",
      mobile: "मोबाइल नंबर",
      mobilePlaceholder: "+91 98765 43210",
      name: "पूर्ण नाव",
      namePlaceholder: "तुमचे पूर्ण नाव लिहा",
      password: "पासवर्ड",
      passwordPlaceholder: "तुमचा पासवर्ड लिहा",
      confirmPassword: "पासवर्डची पुष्टी करा",
      confirmPlaceholder:
        "तुमचा पासवर्ड पुन्हा लिहा",
      remember: "मला लक्षात ठेवा",
      forgot: "पासवर्ड विसरलात?",
      signIn: "साइन इन",
      createAccount: "अकाउंट तयार करा",
      protected:
        "या प्रोटोटाइपमध्ये भूमिका-आधारित डेमो प्रवेश सक्षम आहे.",
      demo:
        "डेमो प्रोटोटाइप • खाली दिलेले क्रेडेंशियल वापरा.",
      invalid:
        "ईमेल किंवा पासवर्ड चुकीचा आहे. अधिकृत डेमो अकाउंट वापरा.",
      fillAll: "कृपया सर्व आवश्यक माहिती भरा.",
      mismatch: "पासवर्ड जुळत नाहीत.",
      accountCreated:
        "डेमो अकाउंट माहिती जतन झाली. आता भूमिका निवडाकडे जा.",
      recovery:
        "डेमोसाठी खाली दिलेले क्रेडेंशियल वापरा.",
      smallHeading: "स्मार्ट पशुधन आरोग्य",
      heroTitle1: "प्रत्येक प्राण्याचे संरक्षण करा.",
      heroTitle2: "धोका लवकर ओळखा.",
      heroText:
        "AI सहाय्यित तपासणी, अलर्ट, पशुवैद्यकीय पुनरावलोकन, प्रयोगशाळा चाचणी आणि फॉलो-अप व्यवस्थापनासाठी केंद्रीकृत पशुधन आरोग्य प्लॅटफॉर्म.",
      feature1: "AI सहाय्यित आरोग्य तपासणी",
      feature2: "लवकर रोग इशारे",
      feature3: "पशुवैद्य आणि प्रयोगशाळा वर्कफ्लो",
      feature4: "आरोग्य नोंदी आणि निगराणी",
      footer: "PASHU-RAKSHAK AI • डेमो प्रोटोटाइप",
      brandSub: "पशुधन आरोग्य कमांड सेंटर",
      useCredentials:
        "अकाउंटवर क्लिक करून लॉगिन माहिती आपोआप भरा.",
    },
  };

  const text = loginText[language] || loginText.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (mode === "register") {
      if (
        !fullName.trim() ||
        !email.trim() ||
        !mobile.trim() ||
        !password ||
        !confirmPassword
      ) {
        setMessage(text.fillAll);
        setMessageType("error");
        return;
      }

      if (password !== confirmPassword) {
        setMessage(text.mismatch);
        setMessageType("error");
        return;
      }

      const apiBase =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

      try {
        setLoading(true);

        const response = await fetch(`${apiBase}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.trim(),
            password,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.detail || "Registration failed.");
        }

        if (!data?.access_token || !data?.user?.role) {
          throw new Error("The backend returned an incomplete registration response.");
        }

        const registeredUser = data.user;

        localStorage.setItem("pashuAccessToken", data.access_token);
        localStorage.setItem("pashuUser", JSON.stringify(registeredUser));
        localStorage.setItem("pashuUserEmail", registeredUser.email);
        localStorage.setItem("pashuUserName", registeredUser.name);
        localStorage.setItem("pashuAllowedRole", registeredUser.role);
        localStorage.setItem("pashuRoleName", registeredUser.name);
        localStorage.setItem("pashuRole", registeredUser.role);

        setMessage("Account created successfully");
        setMessageType("success");

        setTimeout(() => {
          navigate("/role-selection", { replace: true });
        }, 250);
      } catch (error) {
        const messageText =
          error?.message?.includes("Failed to fetch")
            ? "Cannot reach the FastAPI server. Make sure uvicorn is running on port 8000."
            : error?.message || "Registration failed.";

        setMessage(messageText);
        setMessageType("error");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!email.trim() || !password) {
      setMessage(text.fillAll);
      setMessageType("error");
      return;
    }

    const apiBase =
      import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    try {
      setLoading(true);

      const response = await fetch(
        `${apiBase}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || text.invalid
        );
      }

      if (!data?.access_token || !data?.user?.role) {
        throw new Error(
          "The backend returned an incomplete login response."
        );
      }

      const loggedInUser = data.user;

      localStorage.setItem(
        "pashuAccessToken",
        data.access_token
      );
      localStorage.setItem(
        "pashuUser",
        JSON.stringify(loggedInUser)
      );
      localStorage.setItem(
        "pashuUserEmail",
        loggedInUser.email
      );
      localStorage.setItem(
        "pashuUserName",
        loggedInUser.name
      );
      localStorage.setItem(
        "pashuAllowedRole",
        loggedInUser.role
      );
      localStorage.setItem(
        "pashuRoleName",
        loggedInUser.name
      );
      localStorage.setItem(
        "pashuRole",
        loggedInUser.role
      );

      setMessage(
        `Login successful • ${loggedInUser.name}`
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/role-selection", {
          replace: true,
        });
      }, 250);
    } catch (error) {
      const messageText =
        error?.message?.includes("Failed to fetch")
          ? "Cannot reach the FastAPI server. Make sure uvicorn is running on port 8000."
          : error?.message || text.invalid;

      setMessage(messageText);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <PawPrint size={28} />
          </div>

          <div>
            <div style={styles.brandTitle}>
              PASHU-RAKSHAK AI
            </div>

            <div style={styles.brandSub}>
              {text.brandSub}
            </div>
          </div>
        </div>

        <div style={styles.hero}>
          <div style={styles.smallHeading}>
            {text.smallHeading}
          </div>

          <h1 style={styles.heroTitle}>
            {text.heroTitle1}
            <br />
            {text.heroTitle2}
          </h1>

          <p style={styles.heroText}>
            {text.heroText}
          </p>

          <div style={styles.features}>
            <Feature text={text.feature1} />
            <Feature text={text.feature2} />
            <Feature text={text.feature3} />
            <Feature text={text.feature4} />
          </div>
        </div>

        <div style={styles.footerText}>
          {text.footer}
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.languageBox}>
          <Globe2 size={18} color="#475569" />

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            style={styles.languageSelect}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {mode === "login"
                ? text.welcome
                : text.create}
            </h2>

            <p style={styles.formSubtitle}>
              {mode === "login"
                ? text.loginSubtitle
                : text.registerSubtitle}
            </p>
          </div>

          <div style={styles.tabs}>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
              style={{
                ...styles.tab,
                ...(mode === "login"
                  ? styles.activeTab
                  : {}),
              }}
            >
              {t("login")}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
              style={{
                ...styles.tab,
                ...(mode === "register"
                  ? styles.activeTab
                  : {}),
              }}
            >
              {t("register")}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <FieldLabel label={text.name}>
                <div style={styles.inputWrap}>
                  <User size={18} color="#94a3b8" />

                  <input
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder={text.namePlaceholder}
                    style={styles.input}
                  />
                </div>
              </FieldLabel>
            )}

            <FieldLabel label={text.email}>
              <div style={styles.inputWrap}>
                <Mail size={18} color="#94a3b8" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={text.emailPlaceholder}
                  style={styles.input}
                />
              </div>
            </FieldLabel>

            {mode === "register" && (
              <FieldLabel label={text.mobile}>
                <div style={styles.inputWrap}>
                  <Phone size={18} color="#94a3b8" />

                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value)
                    }
                    placeholder={text.mobilePlaceholder}
                    style={styles.input}
                  />
                </div>
              </FieldLabel>
            )}

            <FieldLabel label={text.password}>
              <div style={styles.inputWrap}>
                <Lock size={18} color="#94a3b8" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder={text.passwordPlaceholder}
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      color="#94a3b8"
                    />
                  ) : (
                    <Eye
                      size={18}
                      color="#94a3b8"
                    />
                  )}
                </button>
              </div>
            </FieldLabel>

            {mode === "register" && (
              <FieldLabel
                label={text.confirmPassword}
              >
                <div style={styles.inputWrap}>
                  <Lock size={18} color="#94a3b8" />

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder={text.confirmPlaceholder}
                    style={styles.input}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(
                        !showConfirm
                      )
                    }
                    style={styles.eyeButton}
                  >
                    {showConfirm ? (
                      <EyeOff
                        size={18}
                        color="#94a3b8"
                      />
                    ) : (
                      <Eye
                        size={18}
                        color="#94a3b8"
                      />
                    )}
                  </button>
                </div>
              </FieldLabel>
            )}

            {mode === "login" && (
              <div style={styles.loginOptions}>
                <label style={styles.remember}>
                  <input
                    type="checkbox"
                    defaultChecked
                  />
                  <span>{text.remember}</span>
                </label>

                <button
                  type="button"
                  style={styles.forgot}
                  onClick={() =>
                    setMessage(text.recovery)
                  }
                >
                  {text.forgot}
                </button>
              </div>
            )}

            {message && (
              <div
                style={{
                  ...styles.message,
                  ...(messageType === "success"
                    ? styles.successMessage
                    : {}),
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
              }}
            >
              <span>
                {loading
                  ? "Connecting..."
                  : mode === "login"
                    ? text.signIn
                    : text.createAccount}
              </span>

              <ArrowRight
                size={19}
                style={
                  loading
                    ? { animation: "spin 1s linear infinite" }
                    : undefined
                }
              />
            </button>
          </form>

          <div style={styles.securityNotice}>
            <ShieldCheck
              size={18}
              color="#65a30d"
            />

            <span>{text.protected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ label, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function Feature({ text }) {
  return (
    <div style={styles.feature}>
      <CheckCircle2
        size={19}
        color="#d7ff39"
      />
      <span>{text}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    background: "#f8fafc",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  leftPanel: {
    minHeight: "100vh",
    padding: "55px 7%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, #0d4f43 0%, #086150 55%, #08715d 100%)",
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    position: "relative",
    zIndex: 2,
  },

  logo: {
    width: 59,
    height: 59,
    borderRadius: 17,
    background: "#d7ff39",
    color: "#0b5d50",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandTitle: {
    fontSize: 19,
    fontWeight: 850,
  },

  brandSub: {
    marginTop: 4,
    color: "#d4ebe5",
    fontSize: 12,
  },

  hero: {
    position: "relative",
    zIndex: 2,
    maxWidth: 650,
    marginTop: 45,
    marginBottom: 50,
  },

  smallHeading: {
    color: "#d7ff39",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "1.3px",
    marginBottom: 20,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(36px, 4vw, 62px)",
    lineHeight: 1.04,
    fontWeight: 850,
    letterSpacing: "-1.5px",
  },

  heroText: {
    marginTop: 22,
    maxWidth: 650,
    color: "#cce4df",
    fontSize: 14,
    lineHeight: 1.7,
  },

  features: {
    marginTop: 27,
    display: "flex",
    flexDirection: "column",
    gap: 13,
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "#edf9f6",
  },

  footerText: {
    position: "relative",
    zIndex: 2,
    color: "#a9d0c8",
    fontSize: 11,
  },

  rightPanel: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 35,
    background:
      "radial-gradient(circle at top right, #ecfdf5 0%, #f8fafc 45%, #f1f5f9 100%)",
  },

  languageBox: {
    position: "absolute",
    top: 19,
    right: 22,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 10px",
    border: "1px solid #dbe5e1",
    borderRadius: 9,
    background: "#ffffff",
    boxShadow:
      "0 5px 15px rgba(15,23,42,0.05)",
  },

  languageSelect: {
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#334155",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },

  formCard: {
    width: "100%",
    maxWidth: 560,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: "30px 34px 27px",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.09)",
    marginTop: 20,
  },

  formHeader: {
    marginBottom: 20,
  },

  formTitle: {
    margin: 0,
    fontSize: 30,
    fontWeight: 850,
    color: "#0f172a",
  },

  formSubtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.6,
  },

  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "#f1f5f3",
    borderRadius: 11,
    padding: 3,
    marginBottom: 20,
  },

  tab: {
    border: 0,
    background: "transparent",
    padding: "10px",
    borderRadius: 8,
    color: "#64748b",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  activeTab: {
    background: "#ffffff",
    color: "#0b5d50",
    boxShadow:
      "0 2px 10px rgba(15,23,42,0.07)",
  },

  field: {
    marginBottom: 13,
  },

  label: {
    display: "block",
    marginBottom: 6,
    color: "#1e293b",
    fontSize: 11,
    fontWeight: 800,
  },

  inputWrap: {
    minHeight: 47,
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "0 12px",
    border: "1px solid #dbe5e1",
    borderRadius: 10,
    background: "#ffffff",
  },

  input: {
    flex: 1,
    border: 0,
    outline: 0,
    fontSize: 12,
    color: "#0f172a",
    minWidth: 0,
    background: "transparent",
  },

  eyeButton: {
    border: 0,
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  loginOptions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    margin: "1px 0 14px",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#64748b",
    fontSize: 10,
  },

  forgot: {
    border: 0,
    background: "transparent",
    color: "#0b5d50",
    fontSize: 10,
    fontWeight: 800,
    cursor: "pointer",
  },

  message: {
    marginBottom: 11,
    padding: "9px 11px",
    borderRadius: 8,
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 10,
    fontWeight: 700,
  },

  successMessage: {
    background: "#f0fdf4",
    color: "#15803d",
  },

  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "wait",
  },

  submitButton: {
    width: "100%",
    minHeight: 49,
    border: 0,
    borderRadius: 10,
    background: "#d7ff39",
    color: "#0b3f36",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 850,
  },















  securityNotice: {
    marginTop: 17,
    paddingTop: 14,
    borderTop: "1px solid #edf2ef",
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#7c8c86",
    fontSize: 9,
    lineHeight: 1.5,
  },
};
