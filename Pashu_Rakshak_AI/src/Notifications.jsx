import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
  Stethoscope,
  ClipboardList,
  Info,
  AlertTriangle,
  Clock3,
  Search,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("pashuAccessToken") || "";
}

async function loadNotifications(unreadOnly = false) {
  const token = getToken();

  const response = await fetch(
    `${API_BASE}/api/notifications?unread_only=${unreadOnly}`,
    {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("pashuAccessToken");
    localStorage.removeItem("pashuUser");
    localStorage.removeItem("pashuAllowedRole");
    localStorage.removeItem("pashuRole");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let message = "Could not load notifications.";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      // Keep default error.
    }
    throw new Error(message);
  }

  return response.json();
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTypeData(type) {
  const value = String(type || "info").toLowerCase();

  if (value === "escalation") {
    return {
      label: "Escalation",
      className: "notification-critical",
      icon: ShieldAlert,
    };
  }

  if (value === "case") {
    return {
      label: "Case",
      className: "notification-case",
      icon: ClipboardList,
    };
  }

  if (value === "alert") {
    return {
      label: "Alert",
      className: "notification-high",
      icon: AlertTriangle,
    };
  }

  if (value === "success") {
    return {
      label: "Success",
      className: "notification-success",
      icon: CheckCircle2,
    };
  }

  return {
    label: "Information",
    className: "notification-info",
    icon: Info,
  };
}

function Notifications() {
  const [items, setItems] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function refresh(firstLoad = false) {
    try {
      setError("");

      if (firstLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data = await loadNotifications(unreadOnly);
      setItems(normalizeItems(data));
    } catch (err) {
      setError(err?.message || "Could not load notifications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh(true);
  }, [unreadOnly]);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return items;

    return items.filter((item) => {
      const haystack = [
        item?.title,
        item?.message,
        item?.notification_type,
        item?.case_id,
        item?.target_role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [items, query]);

  const unreadCount = items.filter((item) => item?.read === false).length;

  return (
    <>
      <style>{`
        .notifications-page {
          max-width: 1100px;
          margin: 0 auto;
          padding-bottom: 35px;
          color: #173e35;
        }

        .notifications-page * {
          box-sizing: border-box;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 18px;
        }

        .notifications-header h1 {
          margin: 0;
          font-size: 29px;
          color: #173e35;
        }

        .notifications-header p {
          margin: 7px 0 0;
          color: #7f8e88;
          font-size: 12px;
          line-height: 1.55;
        }

        .notifications-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .notifications-search {
          height: 38px;
          min-width: 210px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          padding: 0 11px;
          outline: none;
          color: #39584f;
          font-size: 10px;
        }

        .notifications-search-wrap {
          display: flex;
          align-items: center;
          gap: 7px;
          padding-left: 10px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
        }

        .notifications-search-wrap svg {
          color: #91a19a;
          flex: 0 0 auto;
        }

        .notifications-search-wrap input {
          border: 0;
          outline: 0;
          height: 36px;
          width: 185px;
          font-size: 10px;
          color: #39584f;
        }

        .notifications-button {
          height: 38px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          color: #54736a;
          padding: 0 11px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 850;
        }

        .notifications-button.active {
          background: #eef6e2;
          border-color: #dbe9ce;
          color: #5f8435;
        }

        .notifications-refresh {
          width: 38px;
          height: 38px;
          border: 1px solid #dfe9e4;
          border-radius: 9px;
          background: #fff;
          color: #54736a;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .notifications-refresh.spinning svg {
          animation: notification-spin .75s linear infinite;
        }

        @keyframes notification-spin {
          to { transform: rotate(360deg); }
        }

        .notifications-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 15px;
        }

        .notification-summary-card {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 13px;
          padding: 14px;
        }

        .notification-summary-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #eef5e4;
          color: #698f38;
        }

        .notification-summary-card strong {
          display: block;
          margin-top: 11px;
          font-size: 22px;
          color: #2a5045;
        }

        .notification-summary-card span {
          display: block;
          margin-top: 5px;
          font-size: 10px;
          color: #7d8d86;
        }

        .notifications-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          padding: 11px 13px;
          border: 1px solid #f0d7d3;
          border-radius: 10px;
          background: #fff2f0;
          color: #a84f46;
          font-size: 10px;
        }

        .notifications-error button {
          margin-left: auto;
          border: 0;
          border-radius: 7px;
          background: #a84f46;
          color: #fff;
          padding: 6px 9px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
        }

        .notifications-card {
          background: #fff;
          border: 1px solid #e1ebe7;
          border-radius: 14px;
          overflow: hidden;
        }

        .notifications-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 15px 17px;
          border-bottom: 1px solid #edf2ef;
        }

        .notifications-card-head h2 {
          margin: 0;
          color: #274b41;
          font-size: 15px;
        }

        .notifications-card-head p {
          margin: 4px 0 0;
          color: #8b9893;
          font-size: 9px;
        }

        .notification-list {
          padding: 5px 16px 8px;
        }

        .notification-item {
          display: grid;
          grid-template-columns: 43px 1fr auto;
          gap: 11px;
          align-items: start;
          padding: 13px 0;
          border-bottom: 1px solid #edf2ef;
        }

        .notification-item:last-child {
          border-bottom: 0;
        }

        .notification-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 11px;
        }

        .notification-critical {
          background: #ffe8e5;
          color: #b4493f;
        }

        .notification-case {
          background: #eef6e2;
          color: #658735;
        }

        .notification-high {
          background: #fff0df;
          color: #b97625;
        }

        .notification-success {
          background: #e9f7ed;
          color: #3f8a58;
        }

        .notification-info {
          background: #e9f2f8;
          color: #38718f;
        }

        .notification-main strong {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #35564d;
          font-size: 11px;
        }

        .notification-main p {
          margin: 5px 0 0;
          max-width: 680px;
          color: #7c8b85;
          font-size: 10px;
          line-height: 1.55;
        }

        .notification-meta {
          text-align: right;
        }

        .notification-type {
          display: inline-block;
          padding: 4px 7px;
          border-radius: 999px;
          background: #f3f6f4;
          color: #72837b;
          font-size: 7px;
          font-weight: 900;
        }

        .notification-time {
          display: block;
          margin-top: 6px;
          color: #a0aaa6;
          font-size: 8px;
          white-space: nowrap;
        }

        .notification-unread {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #739d42;
        }

        .notification-empty,
        .notification-loading {
          padding: 50px 20px;
          text-align: center;
          color: #93a09b;
          font-size: 10px;
        }

        .notification-empty svg,
        .notification-loading svg {
          display: block;
          margin: 0 auto 9px;
        }

        .notification-loading svg {
          animation: notification-spin 1s linear infinite;
        }

        .notifications-note {
          margin-top: 13px;
          padding: 10px 12px;
          border-radius: 9px;
          background: #f2f6ec;
          color: #74836e;
          font-size: 8px;
          line-height: 1.55;
        }

        @media (max-width: 850px) {
          .notifications-header {
            flex-direction: column;
          }

          .notifications-actions {
            width: 100%;
          }

          .notifications-search-wrap {
            flex: 1;
          }

          .notifications-search-wrap input {
            width: 100%;
          }
        }

        @media (max-width: 650px) {
          .notifications-summary {
            grid-template-columns: 1fr;
          }

          .notification-item {
            grid-template-columns: 40px 1fr;
          }

          .notification-meta {
            grid-column: 2;
            text-align: left;
          }
        }
      `}</style>

      <div className="notifications-page">
        <div className="notifications-header">
          <div>
            <h1>Notifications & Alerts</h1>
            <p>
              Live role-based notifications from the FastAPI + MongoDB
              notification service.
            </p>
          </div>

          <div className="notifications-actions">
            <div className="notifications-search-wrap">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notifications..."
              />
            </div>

            <button
              className={`notifications-button ${
                unreadOnly ? "active" : ""
              }`}
              onClick={() => setUnreadOnly((value) => !value)}
            >
              <Bell size={15} />
              {unreadOnly ? "Unread only" : "All notifications"}
            </button>

            <button
              className={`notifications-refresh ${
                refreshing ? "spinning" : ""
              }`}
              onClick={() => refresh(false)}
              disabled={refreshing}
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="notifications-error">
            <AlertTriangle size={17} />
            <span>{error}</span>
            <button onClick={() => refresh(true)}>Retry</button>
          </div>
        )}

        <div className="notifications-summary">
          <div className="notification-summary-card">
            <div className="notification-summary-icon">
              <Bell size={17} />
            </div>
            <strong>{items.length}</strong>
            <span>Loaded notifications</span>
          </div>

          <div className="notification-summary-card">
            <div className="notification-summary-icon">
              <AlertTriangle size={17} />
            </div>
            <strong>{unreadCount}</strong>
            <span>Unread notifications</span>
          </div>

          <div className="notification-summary-card">
            <div className="notification-summary-icon">
              <Stethoscope size={17} />
            </div>
            <strong>
              {
                items.filter(
                  (item) =>
                    String(item?.notification_type || "").toLowerCase() ===
                    "case"
                ).length
              }
            </strong>
            <span>Case-related notifications</span>
          </div>
        </div>

        <section className="notifications-card">
          <div className="notifications-card-head">
            <div>
              <h2>Recent Notifications</h2>
              <p>
                {unreadOnly
                  ? "Showing unread notifications only."
                  : "Showing notifications available for your role."}
              </p>
            </div>

            <span style={{ color: "#789086", fontSize: 9 }}>
              {filteredItems.length} shown
            </span>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <RefreshCw size={25} />
                <div>Loading notifications from MongoDB...</div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="notification-empty">
                <CheckCircle2 size={27} />
                <div>
                  {query
                    ? "No notifications match your search."
                    : "No notifications found."}
                </div>
              </div>
            ) : (
              filteredItems.map((item) => {
                const typeData = getTypeData(item.notification_type);
                const TypeIcon = typeData.icon;

                return (
                  <article className="notification-item" key={item.id}>
                    <div
                      className={`notification-icon ${typeData.className}`}
                    >
                      <TypeIcon size={20} />
                    </div>

                    <div className="notification-main">
                      <strong>
                        {item.read === false && (
                          <span className="notification-unread" />
                        )}
                        {item.title || "Notification"}
                      </strong>

                      <p>{item.message || "New system update."}</p>
                    </div>

                    <div className="notification-meta">
                      <span className="notification-type">
                        {typeData.label}
                      </span>

                      <span className="notification-time">
                        <Clock3
                          size={10}
                          style={{ verticalAlign: "middle", marginRight: 3 }}
                        />
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <div className="notifications-note">
          Notifications are filtered on the backend according to the logged-in
          user's role. This screen reads live data from the notification API;
          clinical alerts remain decision-support signals and should be reviewed
          by the appropriate veterinary or administrative role.
        </div>
      </div>
    </>
  );
}

export default Notifications;
