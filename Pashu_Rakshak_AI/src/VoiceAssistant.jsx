import React, { useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff, Volume2, X, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

const speechLanguages = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

const pageCommands = [
  { path: "/", keys: ["dashboard", "home", "मुख्य", "डैशबोर्ड", "डॅशबोर्ड"] },
  { path: "/animals", keys: ["animals", "animal", "पशु", "जानवर", "प्राणी"] },
  { path: "/ai-detection", keys: ["ai detection", "ai", "screening", "ai जांच", "ai तपासणी"] },
  { path: "/map", keys: ["disease map", "map", "सर्वेक्षण", "मानचित्र", "रोग नकाशा", "नकाशा"] },
  { path: "/alerts", keys: ["alerts", "alert", "अलर्ट", "इशारे", "अॅलर्ट"] },
  { path: "/notifications", keys: ["notifications", "notification", "सूचनाएं", "सूचना", "नोटिफिकेशन"] },
  { path: "/records", keys: ["health records", "records", "स्वास्थ्य रिकॉर्ड", "आरोग्य नोंदी"] },
  { path: "/veterinarian", keys: ["veterinarian", "vet", "doctor", "पशु चिकित्सक", "पशुवैद्य"] },
  { path: "/laboratory", keys: ["laboratory", "lab", "लैब", "प्रयोगशाला", "प्रयोगशाळा"] },
  { path: "/vaccination", keys: ["vaccination", "vaccine", "टीकाकरण", "लसीकरण"] },
  { path: "/treatment", keys: ["treatment", "उपचार"] },
  { path: "/cases", keys: ["cases", "case", "केस", "केसेस"] },
  { path: "/outbreaks", keys: ["outbreaks", "outbreak", "रोग प्रकोप", "प्रादुर्भाव"] },
  { path: "/analytics", keys: ["analytics", "reports", "विश्लेषण"] },
  { path: "/admin", keys: ["administration", "admin", "super admin", "प्रशासन"] },
  { path: "/profile", keys: ["profile", "प्रोफ़ाइल", "प्रोफाइल"] },
  { path: "/help", keys: ["help", "support", "सहायता", "मदत"] },
];

function includesAny(text, keys) {
  return keys.some((key) => text.includes(key));
}

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  const recognitionRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setSupported(false);
      return undefined;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setResponse(getMessages(language).micDenied);
      } else {
        setResponse(getMessages(language).notHeard);
      }
    };

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript?.trim() || "";
      setTranscript(text);

      if (text) {
        processCommand(text);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [language]);

  const speak = (text) => {
    setResponse(text);

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguages[language] || "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (rawText) => {
    const text = rawText.toLowerCase().trim();
    const messages = getMessages(language);

    if (includesAny(text, ["stop", "mute", "बंद", "थांबा"])) {
      window.speechSynthesis?.cancel();
      setResponse(messages.stopped);
      return;
    }

    if (
      includesAny(text, [
        "english",
        "अंग्रेजी",
        "इंग्लिश",
        "इंग्रजी",
      ]) &&
      includesAny(text, ["language", "भाषा"])
    ) {
      setLanguage("en");
      speak(messages.languageEnglish);
      return;
    }

    if (
      includesAny(text, ["hindi", "हिंदी", "हिन्दी"])
    ) {
      setLanguage("hi");
      speak(getMessages("hi").languageHindi);
      return;
    }

    if (
      includesAny(text, ["marathi", "मराठी"])
    ) {
      setLanguage("mr");
      speak(getMessages("mr").languageMarathi);
      return;
    }

    if (includesAny(text, ["help", "what can you do", "मदद", "सहायता", "मदत"])) {
      speak(messages.help);
      return;
    }

    if (
      includesAny(text, [
        "my role",
        "current role",
        "मेरा रोल",
        "मेरी भूमिका",
        "माझी भूमिका",
      ])
    ) {
      const role = localStorage.getItem("pashuRoleName") || messages.user;
      speak(messages.role(role));
      return;
    }

    if (
      includesAny(text, [
        "voice assistant",
        "assistant",
        "आवाज़ सहायक",
        "व्हॉइस असिस्टंट",
      ])
    ) {
      speak(messages.ready);
      return;
    }

    const command = pageCommands.find((item) =>
      includesAny(text, item.keys)
    );

    if (command) {
      navigate(command.path);
      const title = getPageTitle(command.path, language);
      speak(messages.opened(title));
      return;
    }

    speak(messages.notRecognized);
  };

  const startListening = () => {
    if (!supported) {
      setOpen(true);
      setResponse(getMessages(language).unsupported);
      return;
    }

    setOpen(true);
    setTranscript("");
    setResponse(getMessages(language).listening);

    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = speechLanguages[language] || "en-IN";

    try {
      recognition.start();
    } catch (error) {
      setListening(false);
      setResponse(getMessages(language).alreadyListening);
    }
  };

  const closeAssistant = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setListening(false);
    setOpen(false);
  };

  const hiddenOnAuthPages =
    location.pathname === "/login" ||
    location.pathname === "/role-selection";

  if (hiddenOnAuthPages) return null;

  const messages = getMessages(language);

  return (
    <>
      {open && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.headerIdentity}>
              <div style={styles.botIcon}>
                <Bot size={20} />
              </div>
              <div>
                <strong>{messages.title}</strong>
                <span>{messages.subtitle}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAssistant}
              style={styles.closeButton}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div style={styles.content}>
            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusDot,
                  background: listening ? "#dc2626" : "#22c55e",
                }}
              />
              <span>
                {listening ? messages.listening : messages.ready}
              </span>
            </div>

            {transcript && (
              <div style={styles.transcriptBox}>
                <span style={styles.boxLabel}>{messages.youSaid}</span>
                <strong>{transcript}</strong>
              </div>
            )}

            {response && (
              <div style={styles.responseBox}>
                <span style={styles.boxLabel}>{messages.assistant}</span>
                <span>{response}</span>
              </div>
            )}

            <div style={styles.commandHint}>
              <strong>{messages.tryThese}</strong>
              <span>{messages.examples}</span>
            </div>

            <div style={styles.controls}>
              <button
                type="button"
                onClick={startListening}
                style={listening ? styles.micButtonActive : styles.micButton}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>
                  {listening ? messages.stopListening : messages.speak}
                </span>
              </button>

              <button
                type="button"
                onClick={() => speak(messages.help)}
                style={styles.helpButton}
              >
                <Volume2 size={17} />
              </button>
            </div>

            {!supported && (
              <div style={styles.warning}>
                {messages.unsupported}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={styles.floatingButton}
        aria-label={messages.title}
      >
        {open ? (
          <X size={22} />
        ) : (
          <MessageCircle size={23} />
        )}
      </button>

      <button
        type="button"
        onClick={startListening}
        style={styles.miniMic}
        aria-label={messages.speak}
      >
        <Mic size={17} />
      </button>
    </>
  );
}

function getPageTitle(path, language) {
  const names = {
    en: {
      "/": "Dashboard",
      "/animals": "Animals",
      "/ai-detection": "AI Detection",
      "/map": "Disease Map",
      "/alerts": "Alerts",
      "/notifications": "Notifications",
      "/records": "Health Records",
      "/veterinarian": "Veterinarian",
      "/laboratory": "Laboratory",
      "/vaccination": "Vaccination",
      "/treatment": "Treatment",
      "/cases": "Cases",
      "/outbreaks": "Outbreaks",
      "/analytics": "Analytics",
      "/admin": "Administration",
      "/profile": "Profile",
      "/help": "Help & Support",
    },
    hi: {
      "/": "डैशबोर्ड",
      "/animals": "पशु",
      "/ai-detection": "AI जांच",
      "/map": "रोग मानचित्र",
      "/alerts": "अलर्ट",
      "/notifications": "सूचनाएँ",
      "/records": "स्वास्थ्य रिकॉर्ड",
      "/veterinarian": "पशु चिकित्सक",
      "/laboratory": "प्रयोगशाला",
      "/vaccination": "टीकाकरण",
      "/treatment": "उपचार",
      "/cases": "केस",
      "/outbreaks": "रोग प्रकोप",
      "/analytics": "विश्लेषण",
      "/admin": "प्रशासन",
      "/profile": "प्रोफ़ाइल",
      "/help": "सहायता",
    },
    mr: {
      "/": "डॅशबोर्ड",
      "/animals": "प्राणी",
      "/ai-detection": "AI तपासणी",
      "/map": "रोग नकाशा",
      "/alerts": "अलर्ट",
      "/notifications": "सूचना",
      "/records": "आरोग्य नोंदी",
      "/veterinarian": "पशुवैद्य",
      "/laboratory": "प्रयोगशाळा",
      "/vaccination": "लसीकरण",
      "/treatment": "उपचार",
      "/cases": "केसेस",
      "/outbreaks": "रोगाचा प्रादुर्भाव",
      "/analytics": "विश्लेषण",
      "/admin": "प्रशासन",
      "/profile": "प्रोफाइल",
      "/help": "मदत",
    },
  };

  return names[language]?.[path] || names.en[path] || "Dashboard";
}

function getMessages(language) {
  const all = {
    en: {
      title: "Voice Assistant",
      subtitle: "Hands-free navigation",
      ready: "Ready for your command.",
      listening: "Listening...",
      stopListening: "Stop",
      speak: "Speak",
      youSaid: "You said",
      assistant: "Assistant",
      tryThese: "Try saying:",
      examples: "open animals • open alerts • open veterinarian • change language to Hindi • my role",
      help: "You can say open dashboard, open animals, open AI detection, open alerts, open veterinarian, open laboratory, open analytics, my role, or change language to Hindi or Marathi.",
      role: (role) => `Your current role is ${role}.`,
      opened: (title) => `${title} is open now.`,
      notRecognized: "I didn't recognize that command. Say help to hear available commands.",
      notHeard: "I couldn't hear that clearly. Please try again.",
      micDenied: "Microphone permission was not granted.",
      unsupported: "Voice recognition is not available in this browser. You can still use the assistant's navigation panel.",
      alreadyListening: "The microphone is already active.",
      stopped: "Voice output stopped.",
      languageEnglish: "Language changed to English.",
      languageHindi: "भाषा हिंदी में बदल दी गई है।",
      languageMarathi: "भाषा मराठीमध्ये बदलली आहे.",
      user: "authenticated user",
    },
    hi: {
      title: "वॉइस असिस्टेंट",
      subtitle: "आवाज़ से नेविगेशन",
      ready: "मैं आपके आदेश के लिए तैयार हूँ।",
      listening: "सुन रहा हूँ...",
      stopListening: "रोकें",
      speak: "बोलें",
      youSaid: "आपने कहा",
      assistant: "असिस्टेंट",
      tryThese: "ऐसा बोलें:",
      examples: "पशु खोलें • अलर्ट खोलें • पशु चिकित्सक खोलें • भाषा हिंदी करें • मेरा रोल",
      help: "आप डैशबोर्ड खोलें, पशु खोलें, AI जांच खोलें, अलर्ट खोलें, पशु चिकित्सक खोलें, लैब खोलें, विश्लेषण खोलें, मेरा रोल, या भाषा हिंदी और मराठी कह सकते हैं।",
      role: (role) => `आपकी वर्तमान भूमिका ${role} है।`,
      opened: (title) => `${title} अब खुल गया है।`,
      notRecognized: "मैं इस कमांड को समझ नहीं पाया। उपलब्ध कमांड सुनने के लिए मदद बोलें।",
      notHeard: "मैं ठीक से सुन नहीं पाया। कृपया दोबारा बोलें।",
      micDenied: "माइक्रोफ़ोन की अनुमति नहीं मिली।",
      unsupported: "इस ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है।",
      alreadyListening: "माइक्रोफ़ोन पहले से चालू है।",
      stopped: "वॉइस आउटपुट रोक दिया गया है।",
      languageEnglish: "Language changed to English.",
      languageHindi: "भाषा हिंदी में बदल दी गई है।",
      languageMarathi: "भाषा मराठीमध्ये बदलली आहे.",
      user: "लॉगिन यूज़र",
    },
    mr: {
      title: "व्हॉइस असिस्टंट",
      subtitle: "आवाजाने नेव्हिगेशन",
      ready: "तुमच्या आदेशासाठी तयार आहे.",
      listening: "ऐकत आहे...",
      stopListening: "थांबवा",
      speak: "बोला",
      youSaid: "तुम्ही म्हणालात",
      assistant: "असिस्टंट",
      tryThese: "असे बोला:",
      examples: "प्राणी उघडा • अलर्ट उघडा • पशुवैद्य उघडा • भाषा मराठी करा • माझी भूमिका",
      help: "तुम्ही डॅशबोर्ड उघडा, प्राणी उघडा, AI तपासणी उघडा, अलर्ट उघडा, पशुवैद्य उघडा, प्रयोगशाळा उघडा, विश्लेषण उघडा, माझी भूमिका किंवा भाषा हिंदी आणि इंग्रजी करा असे म्हणू शकता.",
      role: (role) => `तुमची सध्याची भूमिका ${role} आहे.`,
      opened: (title) => `${title} आता उघडले आहे.`,
      notRecognized: "ही कमांड समजली नाही. उपलब्ध कमांड ऐकण्यासाठी मदत म्हणा.",
      notHeard: "मला नीट ऐकू आले नाही. पुन्हा प्रयत्न करा.",
      micDenied: "मायक्रोफोनची परवानगी मिळाली नाही.",
      unsupported: "या ब्राउझरमध्ये व्हॉइस रिकग्निशन उपलब्ध नाही.",
      alreadyListening: "मायक्रोफोन आधीच सुरू आहे.",
      stopped: "व्हॉइस आउटपुट थांबवला आहे.",
      languageEnglish: "Language changed to English.",
      languageHindi: "भाषा हिंदीमध्ये बदलली आहे.",
      languageMarathi: "भाषा मराठीमध्ये बदलली आहे.",
      user: "लॉगिन वापरकर्ता",
    },
  };

  return all[language] || all.en;
}

const styles = {
  panel: {
    position: "fixed",
    right: 20,
    bottom: 82,
    width: 360,
    maxWidth: "calc(100vw - 32px)",
    background: "#ffffff",
    border: "1px solid #dfe7e3",
    borderRadius: 17,
    boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
    zIndex: 1500,
    overflow: "hidden",
  },

  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 14px",
    borderBottom: "1px solid #edf2ef",
    background: "#f8fbf9",
  },

  headerIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  botIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 14,
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 12,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },

  transcriptBox: {
    borderRadius: 10,
    padding: "10px 11px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: 9,
  },

  responseBox: {
    borderRadius: 10,
    padding: "10px 11px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 9,
  },

  boxLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: 800,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  commandHint: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#64748b",
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 12,
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  micButton: {
    flex: 1,
    minHeight: 42,
    border: 0,
    borderRadius: 10,
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
  },

  micButtonActive: {
    flex: 1,
    minHeight: 42,
    border: 0,
    borderRadius: 10,
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
  },

  helpButton: {
    width: 42,
    height: 42,
    border: "1px solid #dbe5e1",
    borderRadius: 10,
    background: "#ffffff",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  warning: {
    marginTop: 10,
    padding: "8px 9px",
    borderRadius: 8,
    background: "#fff7ed",
    color: "#9a3412",
    fontSize: 9,
    lineHeight: 1.45,
  },

  floatingButton: {
    position: "fixed",
    right: 20,
    bottom: 20,
    width: 52,
    height: 52,
    border: 0,
    borderRadius: "50%",
    background: "#0b5d50",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(11,93,80,0.28)",
    zIndex: 1501,
  },

  miniMic: {
    position: "fixed",
    right: 80,
    bottom: 20,
    width: 42,
    height: 42,
    border: "1px solid #bbf7d0",
    borderRadius: "50%",
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(15,23,42,0.10)",
    zIndex: 1501,
  },
};
