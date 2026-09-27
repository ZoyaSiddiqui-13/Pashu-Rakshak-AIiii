import React, { useState } from "react";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  ShieldCheck,
  Brain,
  PawPrint,
  Stethoscope,
  MapPinned,
} from "lucide-react";

export default function Help() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      question: "How do I add a new animal?",
      answer:
        "Open the Animals section from the sidebar and use the Add Animal option. Enter the animal details such as name, type, age, gender and farm information, then save the record.",
    },
    {
      question: "How does AI Disease Detection work?",
      answer:
        "Select an animal, enter symptoms and observations, and optionally upload a photo. The AI screening module analyzes the submitted information and provides a risk level and recommended next steps.",
    },
    {
      question: "Can AI provide a final veterinary diagnosis?",
      answer:
        "No. AI screening is designed as decision support. A veterinarian should review important or high-risk cases before clinical decisions are made.",
    },
    {
      question: "How can I create a case?",
      answer:
        "Cases can be created from the AI Detection workflow or from the Cases section. Add the animal, concern, symptoms, risk information and required notes.",
    },
    {
      question: "Where can I see disease activity by region?",
      answer:
        "Open Disease Map from the sidebar. It provides regional disease surveillance information, case counts and risk indicators.",
    },
    {
      question: "How do I manage vaccinations?",
      answer:
        "Open Vaccination from the Health Management section. You can review upcoming vaccinations, overdue schedules, completed vaccinations and add new schedules.",
    },
    {
      question: "How do I request a laboratory test?",
      answer:
        "Veterinarians can request laboratory tests from the case review workflow. Laboratory staff can then process the request and update the test result.",
    },
    {
      question: "Where can I view an animal's health history?",
      answer:
        "Open Health Records to search for an animal and review its screening, veterinary, laboratory, treatment and vaccination history.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setSent(true);
    setMessage("");

    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Help & Support</h1>

          <p style={styles.subtitle}>
            Find answers, learn how the platform works, or contact support.
          </p>
        </div>

        <div style={styles.headerIcon}>
          <HelpCircle size={24} />
        </div>
      </div>

      {/* SEARCH */}
      <section style={styles.searchCard}>
        <div style={styles.searchIcon}>
          <Search size={21} />
        </div>

        <input
          type="text"
          placeholder="Search help articles, features or questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </section>

      {/* SUPPORT CARDS */}
      <div style={styles.supportGrid}>
        <SupportCard
          icon={<MessageCircle size={23} />}
          title="Live Support"
          text="Get help with platform issues and workflows."
          button="Start Chat"
        />

        <SupportCard
          icon={<Mail size={23} />}
          title="Email Support"
          text="Send your question to our support team."
          button="Send Email"
        />

        <SupportCard
          icon={<Phone size={23} />}
          title="Support Hotline"
          text="Contact the technical support team."
          button="Call Support"
        />
      </div>

      {/* QUICK GUIDES */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Quick Guides</h2>

            <p style={styles.cardSubtitle}>
              Learn the main Pashu-Rakshak AI workflows.
            </p>
          </div>

          <BookOpen size={21} color="#15803d" />
        </div>

        <div style={styles.guidesGrid}>
          <GuideCard
            icon={<PawPrint size={20} />}
            title="Animal Management"
            text="Register animals and maintain livestock information."
          />

          <GuideCard
            icon={<Brain size={20} />}
            title="AI Screening"
            text="Submit symptoms and observations for AI screening."
          />

          <GuideCard
            icon={<Stethoscope size={20} />}
            title="Veterinary Review"
            text="Review cases and manage veterinary consultations."
          />

          <GuideCard
            icon={<MapPinned size={20} />}
            title="Disease Surveillance"
            text="Monitor regional disease activity and risk."
          />
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>
              Frequently Asked Questions
            </h2>

            <p style={styles.cardSubtitle}>
              Common questions about using the platform.
            </p>
          </div>

          <HelpCircle size={21} color="#2563eb" />
        </div>

        {filteredFaqs.length === 0 ? (
          <div style={styles.empty}>
            <Search size={25} />

            <strong>No matching questions found</strong>

            <span>
              Try searching with a different keyword.
            </span>
          </div>
        ) : (
          <div style={styles.faqList}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  style={styles.faqItem}
                >
                  <button
                    style={styles.faqButton}
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                  >
                    <span>{faq.question}</span>

                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {isOpen && (
                    <div style={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CONTACT FORM */}
      <section style={styles.contactCard}>
        <div style={styles.contactInfo}>
          <div style={styles.contactIcon}>
            <MessageCircle size={25} />
          </div>

          <div>
            <h2 style={styles.contactTitle}>
              Still need help?
            </h2>

            <p style={styles.contactText}>
              Send us a message and our support team can
              help you with your issue.
            </p>

            <div style={styles.contactPoints}>
              <span>
                <CheckCircle2 size={14} />
                Platform support
              </span>

              <span>
                <CheckCircle2 size={14} />
                Technical issues
              </span>

              <span>
                <CheckCircle2 size={14} />
                Account assistance
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <label style={styles.label}>
            Your Message
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Describe your issue..."
            style={styles.textarea}
          />

          <button
            type="submit"
            style={styles.sendButton}
          >
            <Send size={16} />

            {sent ? "Message Sent" : "Send Message"}
          </button>

          {sent && (
            <div style={styles.success}>
              <CheckCircle2 size={15} />
              Your support request has been submitted.
            </div>
          )}
        </form>
      </section>

      {/* SAFETY NOTE */}
      <div style={styles.notice}>
        <ShieldCheck size={20} />

        <div>
          <strong>Important</strong>

          <p style={styles.noticeText}>
            AI screening results are intended for decision
            support and should not replace professional
            veterinary evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUPPORT CARD
========================================================= */

function SupportCard({
  icon,
  title,
  text,
  button,
}) {
  return (
    <div style={styles.supportCard}>
      <div style={styles.supportIcon}>
        {icon}
      </div>

      <h3 style={styles.supportTitle}>
        {title}
      </h3>

      <p style={styles.supportText}>
        {text}
      </p>

      <button style={styles.supportButton}>
        {button}
      </button>
    </div>
  );
}

/* =========================================================
   GUIDE CARD
========================================================= */

function GuideCard({
  icon,
  title,
  text,
}) {
  return (
    <div style={styles.guideCard}>
      <div style={styles.guideIcon}>
        {icon}
      </div>

      <div>
        <h3 style={styles.guideTitle}>
          {title}
        </h3>

        <p style={styles.guideText}>
          {text}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    width: "100%",
    maxWidth: 1500,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 14,
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  searchIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchInput: {
    flex: 1,
    border: 0,
    outline: 0,
    fontSize: 13,
    color: "#334155",
    background: "transparent",
  },

  supportGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: 15,
    marginBottom: 18,
  },

  supportCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 20,
  },

  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: "#f0fdf4",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  supportTitle: {
    margin: 0,
    fontSize: 15,
    color: "#0f172a",
  },

  supportText: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 1.5,
    minHeight: 34,
  },

  supportButton: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#15803d",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 20,
    marginBottom: 18,
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 800,
    color: "#0f172a",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  guidesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },

  guideCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: 14,
    display: "flex",
    gap: 10,
  },

  guideIcon: {
    flexShrink: 0,
    width: 36,
    height: 36,
    borderRadius: 9,
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  guideTitle: {
    margin: 0,
    fontSize: 11,
    color: "#0f172a",
  },

  guideText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: 9,
    lineHeight: 1.5,
  },

  faqList: {
    borderTop: "1px solid #f1f5f9",
  },

  faqItem: {
    borderBottom: "1px solid #f1f5f9",
  },

  faqButton: {
    width: "100%",
    border: 0,
    background: "transparent",
    padding: "15px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
  },

  faqAnswer: {
    padding: "0 35px 16px 4px",
    color: "#64748b",
    fontSize: 11,
    lineHeight: 1.7,
  },

  empty: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    color: "#94a3b8",
    fontSize: 11,
  },

  contactCard: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 13,
    padding: 20,
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(330px, 1fr)",
    gap: 25,
    marginBottom: 18,
  },

  contactInfo: {
    display: "flex",
    gap: 13,
    alignItems: "flex-start",
  },

  contactIcon: {
    width: 45,
    height: 45,
    borderRadius: 11,
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  contactTitle: {
    margin: 0,
    fontSize: 17,
    color: "#14532d",
  },

  contactText: {
    color: "#4d7c5c",
    fontSize: 11,
    lineHeight: 1.6,
    maxWidth: 500,
  },

  contactPoints: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  form: {
    background: "#fff",
    borderRadius: 10,
    padding: 15,
  },

  label: {
    display: "block",
    fontSize: 10,
    color: "#475569",
    fontWeight: 700,
    marginBottom: 6,
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 100,
    resize: "vertical",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: 10,
    outline: 0,
    fontFamily: "inherit",
    fontSize: 11,
  },

  sendButton: {
    marginTop: 10,
    border: 0,
    background: "#16a34a",
    color: "#fff",
    borderRadius: 8,
    padding: "9px 13px",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
  },

  success: {
    marginTop: 8,
    color: "#15803d",
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },

  notice: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    padding: 15,
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 11,
    color: "#92400e",
  },

  noticeText: {
    margin: "4px 0 0",
    fontSize: 10,
    lineHeight: 1.5,
  },
};