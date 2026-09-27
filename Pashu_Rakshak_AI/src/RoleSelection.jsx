import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Beaker,
  CheckCircle2,
  ClipboardList,
  Globe2,
  Leaf,
  LogOut,
  MapPinned,
  ShieldCheck,
  Stethoscope,
  Tractor,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

const ROLE_CONFIG = [
  {
    id: "farmer",
    title: "Farmer",
    subtitle: "Manage your farm and animal health",
    hindi: "अपना फार्म और पशु स्वास्थ्य प्रबंधित करें",
    marathi: "तुमचा फार्म आणि पशुधन आरोग्य व्यवस्थापित करा",
    route: "/farmer",
    icon: Tractor,
  },
  {
    id: "farm-admin",
    title: "Farm Admin",
    subtitle: "Manage farm operations and records",
    hindi: "फार्म संचालन और रिकॉर्ड प्रबंधित करें",
    marathi: "फार्म ऑपरेशन्स आणि रेकॉर्ड व्यवस्थापित करा",
    route: "/",
    icon: UserCog,
  },
  {
    id: "veterinarian",
    title: "Veterinarian",
    subtitle: "Review cases and manage treatment",
    hindi: "केस की समीक्षा और उपचार प्रबंधित करें",
    marathi: "केस तपासा आणि उपचार व्यवस्थापित करा",
    route: "/veterinarian",
    icon: Stethoscope,
  },
  {
    id: "field-worker",
    title: "Field Worker",
    subtitle: "Investigate field cases and collect samples",
    hindi: "फील्ड केस की जांच और सैंपल कलेक्शन करें",
    marathi: "फील्ड केस तपासा आणि नमुने गोळा करा",
    route: "/field-worker",
    icon: Wrench,
  },
  {
    id: "lab-staff",
    title: "Lab Staff",
    subtitle: "Process samples and submit lab reports",
    hindi: "सैंपल प्रोसेस करें और लैब रिपोर्ट सबमिट करें",
    marathi: "नमुने तपासा आणि प्रयोगशाळा अहवाल सादर करा",
    route: "/lab-staff",
    icon: Beaker,
  },
  {
    id: "staff",
    title: "Staff",
    subtitle: "Handle assigned animals and daily tasks",
    hindi: "असाइन किए गए पशु और दैनिक कार्य संभालें",
    marathi: "असाइन केलेले पशुधन आणि दैनंदिन कामे सांभाळा",
    route: "/staff",
    icon: ClipboardList,
  },
  {
    id: "state-admin",
    title: "State Admin",
    subtitle: "Monitor statewide disease intelligence and response",
    hindi: "राज्य स्तर पर रोग निगरानी और प्रतिक्रिया प्रबंधित करें",
    marathi: "राज्यस्तरीय रोग निरीक्षण आणि प्रतिसाद व्यवस्थापित करा",
    route: "/state-admin",
    icon: Globe2,
  },
  {
    id: "district-admin",
    title: "District Admin",
    subtitle: "Coordinate district cases and outbreak response",
    hindi: "जिला स्तर के केस और प्रकोप प्रतिक्रिया समन्वित करें",
    marathi: "जिल्हास्तरीय केस आणि उद्रेक प्रतिसाद समन्वित करा",
    route: "/district-admin",
    icon: MapPinned,
  },
  {
    id: "super-admin",
    title: "Super Admin",
    subtitle: "Control system-wide administration",
    hindi: "पूरे सिस्टम का प्रशासन नियंत्रित करें",
    marathi: "संपूर्ण सिस्टमचे प्रशासन नियंत्रित करा",
    route: "/admin",
    icon: ShieldCheck,
  },
];

const TEXT = {
  en: {
    title: "Choose your role",
    subtitle: "Select the workspace connected to your account.",
    authorized: "Authorized role",
    notDetected: "Not detected",
    continue: "Continue",
    locked: "Locked",
    active: "Authorized",
    logout: "Logout",
    back: "Back to login",
    noticeText:
      "Only the role assigned to your account can be opened from this screen.",
    noRoleText:
      "Please log in again so the system can load the role assigned to your account.",
    footer: "PASHU-RAKSHAK AI • Livestock Health Intelligence",
  },
  hi: {
    title: "अपना रोल चुनें",
    subtitle: "अपने अकाउंट से जुड़ा वर्कस्पेस चुनें।",
    authorized: "अधिकृत रोल",
    notDetected: "पता नहीं चला",
    continue: "आगे बढ़ें",
    locked: "लॉक्ड",
    active: "अधिकृत",
    logout: "लॉगआउट",
    back: "लॉगिन पर वापस जाएँ",
    noticeText:
      "इस स्क्रीन से केवल आपके अकाउंट को दिया गया रोल ही खोला जा सकता है।",
    noRoleText:
      "कृपया दोबारा लॉगिन करें ताकि आपके अकाउंट का रोल लोड हो सके।",
    footer: "PASHU-RAKSHAK AI • पशु स्वास्थ्य इंटेलिजेंस",
  },
  mr: {
    title: "तुमचा रोल निवडा",
    subtitle: "तुमच्या अकाउंटशी जोडलेले वर्कस्पेस निवडा.",
    authorized: "अधिकृत रोल",
    notDetected: "आढळले नाही",
    continue: "पुढे जा",
    locked: "लॉक",
    active: "अधिकृत",
    logout: "लॉगआउट",
    back: "लॉगिनवर परत जा",
    noticeText:
      "या स्क्रीनवरून फक्त तुमच्या अकाउंटला दिलेला रोल उघडता येतो.",
    noRoleText:
      "तुमच्या अकाउंटचा रोल लोड करण्यासाठी पुन्हा लॉगिन करा.",
    footer: "PASHU-RAKSHAK AI • पशुधन आरोग्य इंटेलिजन्स",
  },
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 5% 5%, rgba(16,185,129,.12), transparent 28%), radial-gradient(circle at 95% 95%, rgba(132,204,22,.10), transparent 30%), #f4f8f6",
    color: "#0f172a",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "22px",
    boxSizing: "border-box",
  },
  shell: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    minHeight: "calc(100vh - 44px)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
  },
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "46px",
    height: "46px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #059669, #16a34a)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 28px rgba(5,150,105,.22)",
    flexShrink: 0,
  },
  brandTitle: {
    fontSize: "16px",
    fontWeight: 900,
    letterSpacing: "-.02em",
  },
  brandSub: {
    marginTop: "2px",
    fontSize: "11px",
    color: "#64748b",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  languageWrap: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    padding: "4px",
    border: "1px solid #dbe5df",
    borderRadius: "999px",
    background: "#fff",
    boxShadow: "0 5px 18px rgba(15,23,42,.05)",
  },
  languageButton: {
    border: 0,
    borderRadius: "999px",
    padding: "7px 11px",
    fontSize: "11px",
    fontWeight: 800,
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
  },
  logout: {
    border: "1px solid #dbe5df",
    borderRadius: "12px",
    padding: "9px 12px",
    background: "#fff",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "38px 0 30px",
  },
  content: {
    width: "100%",
  },
  hero: {
    textAlign: "center",
    marginBottom: "24px",
  },
  heroIcon: {
    width: "56px",
    height: "56px",
    margin: "0 auto 12px",
    borderRadius: "18px",
    background: "#dcfce7",
    color: "#047857",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 44px)",
    fontWeight: 950,
    letterSpacing: "-.04em",
    lineHeight: 1.05,
  },
  heroSubtitle: {
    margin: "10px auto 0",
    maxWidth: "620px",
    fontSize: "14px",
    lineHeight: 1.7,
    color: "#64748b",
  },
  userName: {
    display: "inline-block",
    marginTop: "8px",
    color: "#047857",
    fontSize: "13px",
    fontWeight: 800,
  },
  authBar: {
    marginBottom: "18px",
    border: "1px solid #bbf7d0",
    background: "rgba(236,253,245,.9)",
    borderRadius: "18px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },
  authLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  check: {
    color: "#059669",
    flexShrink: 0,
    marginTop: "1px",
  },
  authTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 900,
    color: "#064e3b",
  },
  authText: {
    margin: "4px 0 0",
    fontSize: "11px",
    lineHeight: 1.6,
    color: "#166534",
  },
  backButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    padding: "9px 12px",
    background: "#fff",
    color: "#0f172a",
    fontSize: "11px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },
  card: {
    position: "relative",
    minHeight: "210px",
    borderRadius: "22px",
    border: "1px solid #dfe8e3",
    background: "rgba(255,255,255,.96)",
    padding: "18px",
    textAlign: "left",
    boxSizing: "border-box",
    boxShadow: "0 10px 30px rgba(15,23,42,.055)",
    transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
  },
  cardActive: {
    cursor: "pointer",
    border: "1px solid #86efac",
  },
  cardLocked: {
    opacity: 0.56,
    cursor: "not-allowed",
  },
  iconBox: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ecfdf5",
    color: "#047857",
  },
  iconBoxLocked: {
    background: "#f1f5f9",
    color: "#94a3b8",
  },
  badge: {
    position: "absolute",
    right: "15px",
    top: "15px",
    padding: "5px 8px",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: 900,
    letterSpacing: ".03em",
  },
  badgeActive: {
    background: "#dcfce7",
    color: "#15803d",
  },
  badgeLocked: {
    background: "#f1f5f9",
    color: "#64748b",
  },
  cardTitle: {
    margin: "17px 0 6px",
    fontSize: "17px",
    fontWeight: 900,
    letterSpacing: "-.02em",
  },
  cardSubtitle: {
    margin: 0,
    minHeight: "40px",
    fontSize: "11px",
    lineHeight: 1.65,
    color: "#64748b",
  },
  cardFooter: {
    marginTop: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  cardAction: {
    fontSize: "11px",
    fontWeight: 900,
    color: "#047857",
  },
  cardActionLocked: {
    color: "#94a3b8",
  },
  arrow: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ecfdf5",
    color: "#047857",
  },
  arrowLocked: {
    background: "#f8fafc",
    color: "#cbd5e1",
  },
  noRole: {
    marginTop: "17px",
    border: "1px solid #fde68a",
    background: "#fffbeb",
    borderRadius: "16px",
    padding: "13px",
    textAlign: "center",
    color: "#92400e",
    fontSize: "11px",
    lineHeight: 1.6,
  },
  footer: {
    textAlign: "center",
    padding: "12px 0 4px",
    fontSize: "10px",
    color: "#94a3b8",
  },
};

function getLanguage() {
  const saved = localStorage.getItem("pashuLanguage");
  return ["en", "hi", "mr"].includes(saved) ? saved : "en";
}

function normalizeRole(role) {
  if (!role) return "";
  const value = role.toLowerCase().trim();

  const aliases = {
    farmer: "farmer",
    "farm-admin": "farm-admin",
    farmadmin: "farm-admin",
    "farm admin": "farm-admin",
    "super-admin": "super-admin",
    superadmin: "super-admin",
    "super admin": "super-admin",
    veterinarian: "veterinarian",
    vet: "veterinarian",
    staff: "staff",
    "field-worker": "field-worker",
    fieldworker: "field-worker",
    "field worker": "field-worker",
    "lab-staff": "lab-staff",
    labstaff: "lab-staff",
    "lab staff": "lab-staff",
    "district-admin": "district-admin",
    districtadmin: "district-admin",
    "district admin": "district-admin",
    "state-admin": "state-admin",
    stateadmin: "state-admin",
    "state admin": "state-admin",
  };

  return aliases[value] || value;
}

export default function RoleSelection() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(getLanguage);
  const [allowedRole, setAllowedRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const sync = () => {
      setLanguage(getLanguage());
      setAllowedRole(normalizeRole(localStorage.getItem("pashuAllowedRole")));

      try {
        const rawUser = localStorage.getItem("pashuUser");
        const parsed = rawUser ? JSON.parse(rawUser) : null;
        setUserName(parsed?.name || parsed?.fullName || "");
      } catch {
        setUserName("");
      }
    };

    sync();

    const onStorage = () => sync();
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const t = useMemo(() => TEXT[language] || TEXT.en, [language]);

  const authorizedRole =
    ROLE_CONFIG.find((role) => role.id === allowedRole) || null;

  const getRoleSubtitle = (role) => {
    if (language === "hi") return role.hindi;
    if (language === "mr") return role.marathi;
    return role.subtitle;
  };

  const handleRoleOpen = (role) => {
    if (!allowedRole || role.id !== allowedRole) return;

    localStorage.setItem("pashuRole", role.id);
    localStorage.setItem("pashuCurrentWorkspace", role.id);
    navigate(role.route);
  };

  const handleLogout = () => {
    localStorage.removeItem("pashuUser");
    localStorage.removeItem("pashuAccessToken");
    localStorage.removeItem("pashuAllowedRole");
    localStorage.removeItem("pashuRole");
    localStorage.removeItem("pashuCurrentWorkspace");
    navigate("/login", { replace: true });
  };

  const switchLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("pashuLanguage", nextLanguage);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 1050px) {
          .role-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 680px) {
          .role-page {
            padding: 14px !important;
          }

          .role-header {
            align-items: flex-start !important;
          }

          .role-lang {
            display: none !important;
          }

          .role-auth {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .role-grid {
            grid-template-columns: 1fr !important;
          }

          .role-card {
            min-height: 190px !important;
          }
        }
      `}</style>

      <div className="role-page" style={styles.shell}>
        <header className="role-header" style={styles.header}>
          <div style={styles.brandWrap}>
            <div style={styles.logo}>
              <Leaf size={23} strokeWidth={2.4} />
            </div>

            <div>
              <div style={styles.brandTitle}>PASHU-RAKSHAK AI</div>
              <div style={styles.brandSub}>
                Livestock Health Intelligence
              </div>
            </div>
          </div>

          <div style={styles.headerActions}>
            <div className="role-lang" style={styles.languageWrap}>
              {[
                ["en", "EN"],
                ["hi", "हि"],
                ["mr", "मर"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchLanguage(id)}
                  style={{
                    ...styles.languageButton,
                    ...(language === id
                      ? {
                          background: "#059669",
                          color: "#fff",
                        }
                      : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <button type="button" onClick={handleLogout} style={styles.logout}>
              <LogOut size={15} />
              {t.logout}
            </button>
          </div>
        </header>

        <main style={styles.main}>
          <div style={styles.content}>
            <div style={styles.hero}>
              <div style={styles.heroIcon}>
                <Users size={27} />
              </div>

              <h1 style={styles.heroTitle}>{t.title}</h1>

              <p style={styles.heroSubtitle}>{t.subtitle}</p>

              {userName && (
                <div style={styles.userName}>{userName}</div>
              )}
            </div>

            <div className="role-auth" style={styles.authBar}>
              <div style={styles.authLeft}>
                <CheckCircle2 size={20} style={styles.check} />

                <div>
                  <p style={styles.authTitle}>
                    {t.authorized}:{" "}
                    <span>
                      {authorizedRole?.title || t.notDetected}
                    </span>
                  </p>

                  <p style={styles.authText}>
                    {allowedRole ? t.noticeText : t.noRoleText}
                  </p>
                </div>
              </div>

              {!allowedRole && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={styles.backButton}
                >
                  {t.back}
                </button>
              )}
            </div>

            <div className="role-grid" style={styles.grid}>
              {ROLE_CONFIG.map((role) => {
                const Icon = role.icon;
                const isAuthorized = allowedRole === role.id;

                return (
                  <button
                    key={role.id}
                    className="role-card"
                    type="button"
                    disabled={!isAuthorized}
                    onClick={() => handleRoleOpen(role)}
                    style={{
                      ...styles.card,
                      ...(isAuthorized
                        ? styles.cardActive
                        : styles.cardLocked),
                    }}
                    onMouseEnter={(e) => {
                      if (isAuthorized) {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow =
                          "0 18px 38px rgba(5,150,105,.12)";
                        e.currentTarget.style.borderColor = "#34d399";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = styles.card.boxShadow;
                      e.currentTarget.style.borderColor = isAuthorized
                        ? "#86efac"
                        : "#dfe8e3";
                    }}
                  >
                    <span
                      style={{
                        ...styles.badge,
                        ...(isAuthorized
                          ? styles.badgeActive
                          : styles.badgeLocked),
                      }}
                    >
                      {isAuthorized ? t.active : t.locked}
                    </span>

                    <div
                      style={{
                        ...styles.iconBox,
                        ...(isAuthorized ? {} : styles.iconBoxLocked),
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <div style={styles.cardTitle}>{role.title}</div>

                    <p style={styles.cardSubtitle}>
                      {getRoleSubtitle(role)}
                    </p>

                    <div style={styles.cardFooter}>
                      <span
                        style={{
                          ...styles.cardAction,
                          ...(isAuthorized
                            ? {}
                            : styles.cardActionLocked),
                        }}
                      >
                        {isAuthorized ? t.continue : t.locked}
                      </span>

                      <span
                        style={{
                          ...styles.arrow,
                          ...(isAuthorized ? {} : styles.arrowLocked),
                        }}
                      >
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!allowedRole && (
              <div style={styles.noRole}>{t.noRoleText}</div>
            )}
          </div>
        </main>

        <footer style={styles.footer}>{t.footer}</footer>
      </div>
    </div>
  );
}
