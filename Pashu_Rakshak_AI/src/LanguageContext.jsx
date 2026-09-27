import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    language: "Language",
    english: "English",
    hindi: "Hindi",
    marathi: "Marathi",

    dashboard: "Dashboard",
    animals: "Animals",
    aiDetection: "AI Detection",
    diseaseMap: "Disease Map",
    alerts: "Alerts",
    notifications: "Notifications",
    healthRecords: "Health Records",
    veterinarian: "Veterinarian",
    laboratory: "Laboratory",
    vaccination: "Vaccination",
    treatment: "Treatment",
    cases: "Cases",
    outbreaks: "Outbreaks",
    analytics: "Analytics",
    administration: "Administration",
    profile: "Profile",
    helpSupport: "Help & Support",
    logout: "Logout",

    farmAdmin: "Farm Admin",
    superAdmin: "Super Admin",
    staff: "Staff",
    governmentAdmin: "Government / Admin",

    selectRole: "Select your role to continue",
    systemOperational: "System Operational",
    roleBasedAccess: "Role-based access",
    secureLivestock: "Secure livestock health management",

    totalFarms: "Total Farms",
    totalAnimals: "Total Animals",
    activeCases: "Active Cases",
    criticalCases: "Critical Cases",

    healthy: "Healthy",
    lowRisk: "Low Risk",
    mediumRisk: "Medium Risk",
    highRisk: "High Risk",
    critical: "Critical",

    quickActions: "Quick Actions",
    addAnimal: "Add Animal",
    aiScreening: "AI Screening",
    viewCases: "View Cases",
    monitorRegions: "Monitor Regions",
    recentCases: "Recent Health Cases",
    viewAll: "View All",

    search: "Search",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    next: "Next",
    back: "Back",

    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",

    thisWeek: "This Week",
    thisMonth: "This Month",
    last30Days: "Last 30 Days",

    healthOverview: "Livestock Health Overview",
    currentHealthDistribution: "Current health distribution",

    email: "Email",
    mobileNumber: "Mobile Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",

    login: "Login",
    register: "Register",
    signIn: "Sign in",
    createAccount: "Create account",
    welcomeBack: "Welcome back",
    createYourAccount: "Create your account",

    settings: "Settings",
    notificationsSettings: "Notification Settings",
    accountSecurity: "Account Security",

    veterinarianReview: "Veterinarian Review",
    requestLabTest: "Request Lab Test",
    treatmentPlan: "Treatment Plan",
    followUp: "Follow-up",

    noData: "No data available",
    noResults: "No results found",
    loading: "Loading...",
    success: "Success",
    error: "Something went wrong",

    aiDisclaimer:
      "AI screening is decision support only and is not a definitive veterinary diagnosis.",
  },

  hi: {
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",

    dashboard: "डैशबोर्ड",
    animals: "पशु",
    aiDetection: "AI जांच",
    diseaseMap: "रोग मानचित्र",
    alerts: "अलर्ट",
    notifications: "सूचनाएँ",
    healthRecords: "स्वास्थ्य रिकॉर्ड",
    veterinarian: "पशु चिकित्सक",
    laboratory: "प्रयोगशाला",
    vaccination: "टीकाकरण",
    treatment: "उपचार",
    cases: "केस",
    outbreaks: "रोग प्रकोप",
    analytics: "विश्लेषण",
    administration: "प्रशासन",
    profile: "प्रोफ़ाइल",
    helpSupport: "सहायता और सपोर्ट",
    logout: "लॉगआउट",

    farmAdmin: "फार्म एडमिन",
    superAdmin: "सुपर एडमिन",
    staff: "स्टाफ",
    governmentAdmin: "सरकार / एडमिन",

    selectRole: "जारी रखने के लिए अपनी भूमिका चुनें",
    systemOperational: "सिस्टम चालू है",
    roleBasedAccess: "भूमिका-आधारित एक्सेस",
    secureLivestock: "सुरक्षित पशु स्वास्थ्य प्रबंधन",

    totalFarms: "कुल फार्म",
    totalAnimals: "कुल पशु",
    activeCases: "सक्रिय केस",
    criticalCases: "गंभीर केस",

    healthy: "स्वस्थ",
    lowRisk: "कम जोखिम",
    mediumRisk: "मध्यम जोखिम",
    highRisk: "उच्च जोखिम",
    critical: "गंभीर",

    quickActions: "त्वरित कार्य",
    addAnimal: "पशु जोड़ें",
    aiScreening: "AI जांच",
    viewCases: "केस देखें",
    monitorRegions: "क्षेत्रों की निगरानी",
    recentCases: "हाल के स्वास्थ्य केस",
    viewAll: "सभी देखें",

    search: "खोजें",
    save: "सहेजें",
    cancel: "रद्द करें",
    close: "बंद करें",
    submit: "जमा करें",
    edit: "संपादित करें",
    delete: "हटाएँ",
    next: "अगला",
    back: "वापस",

    goodMorning: "सुप्रभात",
    goodAfternoon: "नमस्कार",
    goodEvening: "शुभ संध्या",

    thisWeek: "इस सप्ताह",
    thisMonth: "इस महीने",
    last30Days: "पिछले 30 दिन",

    healthOverview: "पशु स्वास्थ्य अवलोकन",
    currentHealthDistribution: "वर्तमान स्वास्थ्य वितरण",

    email: "ईमेल",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    fullName: "पूरा नाम",

    login: "लॉगिन",
    register: "रजिस्टर",
    signIn: "साइन इन",
    createAccount: "अकाउंट बनाएँ",
    welcomeBack: "वापसी पर स्वागत है",
    createYourAccount: "अपना अकाउंट बनाएँ",

    settings: "सेटिंग्स",
    notificationsSettings: "सूचना सेटिंग्स",
    accountSecurity: "अकाउंट सुरक्षा",

    veterinarianReview: "पशु चिकित्सक समीक्षा",
    requestLabTest: "लैब टेस्ट अनुरोध करें",
    treatmentPlan: "उपचार योजना",
    followUp: "फॉलो-अप",

    noData: "कोई डेटा उपलब्ध नहीं है",
    noResults: "कोई परिणाम नहीं मिला",
    loading: "लोड हो रहा है...",
    success: "सफल",
    error: "कुछ गलत हो गया",

    aiDisclaimer:
      "AI जांच केवल निर्णय सहायता है और यह अंतिम पशु चिकित्सा निदान नहीं है।",
  },

  mr: {
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",
    marathi: "मराठी",

    dashboard: "डॅशबोर्ड",
    animals: "प्राणी",
    aiDetection: "AI तपासणी",
    diseaseMap: "रोग नकाशा",
    alerts: "अलर्ट",
    notifications: "सूचना",
    healthRecords: "आरोग्य नोंदी",
    veterinarian: "पशुवैद्य",
    laboratory: "प्रयोगशाळा",
    vaccination: "लसीकरण",
    treatment: "उपचार",
    cases: "केसेस",
    outbreaks: "रोगाचा प्रादुर्भाव",
    analytics: "विश्लेषण",
    administration: "प्रशासन",
    profile: "प्रोफाइल",
    helpSupport: "मदत आणि सपोर्ट",
    logout: "लॉगआउट",

    farmAdmin: "फार्म अॅडमिन",
    superAdmin: "सुपर अॅडमिन",
    staff: "स्टाफ",
    governmentAdmin: "सरकार / अॅडमिन",

    selectRole: "पुढे जाण्यासाठी तुमची भूमिका निवडा",
    systemOperational: "सिस्टम कार्यरत आहे",
    roleBasedAccess: "भूमिका-आधारित प्रवेश",
    secureLivestock: "सुरक्षित पशुधन आरोग्य व्यवस्थापन",

    totalFarms: "एकूण फार्म",
    totalAnimals: "एकूण प्राणी",
    activeCases: "सक्रिय केसेस",
    criticalCases: "गंभीर केसेस",

    healthy: "निरोगी",
    lowRisk: "कमी धोका",
    mediumRisk: "मध्यम धोका",
    highRisk: "जास्त धोका",
    critical: "गंभीर",

    quickActions: "त्वरित कृती",
    addAnimal: "प्राणी जोडा",
    aiScreening: "AI तपासणी",
    viewCases: "केसेस पहा",
    monitorRegions: "प्रदेशांचे निरीक्षण",
    recentCases: "अलीकडील आरोग्य केसेस",
    viewAll: "सर्व पहा",

    search: "शोधा",
    save: "जतन करा",
    cancel: "रद्द करा",
    close: "बंद करा",
    submit: "सबमिट करा",
    edit: "संपादित करा",
    delete: "हटवा",
    next: "पुढे",
    back: "मागे",

    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्या",

    thisWeek: "या आठवड्यात",
    thisMonth: "या महिन्यात",
    last30Days: "मागील 30 दिवस",

    healthOverview: "पशुधन आरोग्य आढावा",
    currentHealthDistribution: "सध्याचे आरोग्य वितरण",

    email: "ईमेल",
    mobileNumber: "मोबाइल नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डची पुष्टी करा",
    fullName: "पूर्ण नाव",

    login: "लॉगिन",
    register: "नोंदणी",
    signIn: "साइन इन",
    createAccount: "अकाउंट तयार करा",
    welcomeBack: "पुन्हा स्वागत आहे",
    createYourAccount: "तुमचे अकाउंट तयार करा",

    settings: "सेटिंग्ज",
    notificationsSettings: "सूचना सेटिंग्ज",
    accountSecurity: "अकाउंट सुरक्षा",

    veterinarianReview: "पशुवैद्यकीय पुनरावलोकन",
    requestLabTest: "लॅब टेस्ट मागवा",
    treatmentPlan: "उपचार योजना",
    followUp: "फॉलो-अप",

    noData: "डेटा उपलब्ध नाही",
    noResults: "परिणाम सापडला नाही",
    loading: "लोड होत आहे...",
    success: "यशस्वी",
    error: "काहीतरी चूक झाली",

    aiDisclaimer:
      "AI तपासणी ही फक्त निर्णय सहाय्य आहे आणि अंतिम पशुवैद्यकीय निदान नाही.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("pashuLanguage") || "en";
  });

  useEffect(() => {
    localStorage.setItem("pashuLanguage", language);

    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (!translations[newLanguage]) return;
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      changeLanguage,
      t,
      translations,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

export default LanguageContext;