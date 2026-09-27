import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
  Syringe,
  ClipboardList,
  CheckCircle2,
  Check,
  X,
  ArrowRight,
  Clock3,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    type: "critical",
    title: "Critical health alert",
    message:
      "Respiratory symptoms detected in Raja (AN-1027). Immediate veterinarian review is recommended.",
    time: "12 min ago",
    page: "/veterinarian",
    read: false,
  },
  {
    id: 2,
    type: "vet",
    title: "Veterinarian review pending",
    message:
      "Case CS-2048 has been assigned to Dr. Mehta and is waiting for clinical review.",
    time: "1 hour ago",
    page: "/veterinarian",
    read: false,
  },
  {
    id: 3,
    type: "lab",
    title: "Lab report available",
    message:
      "Blood test report for case CS-2047 is now available for review.",
    time: "3 hours ago",
    page: "/laboratory",
    read: false,
  },
  {
    id: 4,
    type: "vaccination",
    title: "Vaccination reminder",
    message:
      "12 animals in Pune are due for vaccination tomorrow.",
    time: "5 hours ago",
    page: "/vaccination",
    read: true,
  },
  {
    id: 5,
    type: "case",
    title: "Case status updated",
    message:
      "Case CS-2046 has moved to laboratory testing.",
    time: "Yesterday",
    page: "/cases",
    read: true,
  },
  {
    id: 6,
    type: "alert",
    title: "Possible outbreak cluster",
    message:
      "Four related respiratory cases have been detected in Satara district.",
    time: "Yesterday",
    page: "/outbreaks",
    read: true,
  },
];

const iconMap = {
  critical: AlertTriangle,
  vet: Stethoscope,
  lab: FlaskConical,
  vaccination: Syringe,
  case: ClipboardList,
  alert: Bell,
};

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const criticalCount = notifications.filter(
    (item) =>
      item.type === "critical" ||
      item.type === "alert"
  ).length;

  const filteredNotifications =
    notifications.filter((item) => {
      if (filter === "unread") {
        return !item.read;
      }

      if (filter === "critical") {
        return (
          item.type === "critical" ||
          item.type === "alert"
        );
      }

      return true;
    });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const openNotification = (item) => {
    markAsRead(item.id);
    navigate(item.page);
  };

  return (
    <>
      <style>{`
        .notification-page {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .notification-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .notification-hero h1 {
          margin: 0 0 7px;
          font-size: 30px;
          letter-spacing: -0.5px;
        }

        .notification-hero p {
          margin: 0;
          color: #6b7b75;
          font-size: 14px;
        }

        .notification-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-unread-box {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 15px;
          background: #ffffff;
          border: 1px solid #e2ebe7;
          border-radius: 12px;
          box-shadow: 0 5px 18px rgba(22, 65, 53, 0.06);
        }

        .notification-unread-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f0f9d8;
          color: #275b4e;
        }

        .notification-unread-box strong {
          display: block;
          font-size: 18px;
          line-height: 18px;
          color: #173e34;
        }

        .notification-unread-box span {
          display: block;
          margin-top: 3px;
          font-size: 11px;
          color: #7b8c85;
        }

        .notification-mark-all {
          border: 1px solid #d8e4df;
          background: #ffffff;
          color: #164d40;
          border-radius: 10px;
          padding: 10px 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .notification-mark-all:hover {
          background: #f1f8f5;
          transform: translateY(-1px);
        }

        .notification-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .notification-stat {
          background: #ffffff;
          border: 1px solid #e4ece8;
          border-radius: 14px;
          padding: 17px;
          display: flex;
          align-items: center;
          gap: 13px;
          box-shadow: 0 5px 18px rgba(22, 65, 53, 0.045);
        }

        .notification-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
        }

        .notification-stat-icon.red {
          background: #fff0f0;
          color: #dc3c3c;
        }

        .notification-stat-icon.blue {
          background: #edf5ff;
          color: #3777c9;
        }

        .notification-stat-icon.amber {
          background: #fff7e7;
          color: #c98920;
        }

        .notification-stat-icon.green {
          background: #eff9e0;
          color: #6c9d22;
        }

        .notification-stat span {
          display: block;
          color: #71817b;
          font-size: 12px;
        }

        .notification-stat strong {
          display: block;
          margin-top: 2px;
          color: #183e35;
          font-size: 22px;
        }

        .notification-stat small {
          display: block;
          margin-top: 2px;
          color: #8a9994;
          font-size: 11px;
        }

        .notification-panel {
          background: #ffffff;
          border: 1px solid #e3ebe7;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(20, 67, 54, 0.055);
        }

        .notification-toolbar {
          padding: 14px 18px;
          border-bottom: 1px solid #e8efec;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .notification-filters {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .notification-filter {
          border: 0;
          background: transparent;
          color: #687b74;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
        }

        .notification-filter span {
          margin-left: 5px;
          padding: 2px 6px;
          border-radius: 999px;
          background: #edf2ef;
          color: #66756f;
          font-size: 10px;
        }

        .notification-filter:hover {
          background: #f5f8f7;
        }

        .notification-filter.active {
          background: #ecf7d1;
          color: #174d40;
        }

        .notification-filter.active span {
          background: #d8efa0;
          color: #285d50;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          position: relative;
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 14px;
          padding: 18px 20px;
          border-bottom: 1px solid #edf1ef;
          transition: background 0.2s ease;
        }

        .notification-item:last-child {
          border-bottom: 0;
        }

        .notification-item:hover {
          background: #fbfdfc;
        }

        .notification-item.unread {
          background: #fbfff8;
        }

        .notification-item.unread:hover {
          background: #f7fdec;
        }

        .notification-icon {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: grid;
          place-items: center;
        }

        .notification-icon.critical {
          background: #fff0f0;
          color: #df4141;
        }

        .notification-icon.vet {
          background: #edf5ff;
          color: #3979ca;
        }

        .notification-icon.lab {
          background: #fff6e7;
          color: #bf8423;
        }

        .notification-icon.vaccination {
          background: #f0f8df;
          color: #6b9727;
        }

        .notification-icon.case {
          background: #f2efff;
          color: #7157bd;
        }

        .notification-icon.alert {
          background: #fff1e8;
          color: #d66d27;
        }

        .notification-content {
          cursor: pointer;
          min-width: 0;
        }

        .notification-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-title-row h3 {
          margin: 0;
          color: #173d34;
          font-size: 15px;
        }

        .notification-unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8fbd2f;
          flex: 0 0 auto;
        }

        .notification-content p {
          margin: 7px 0 9px;
          color: #657770;
          font-size: 13px;
          line-height: 1.55;
          max-width: 800px;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #92a09b;
          font-size: 11px;
        }

        .notification-time {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .notification-open {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #2d6a5b;
          font-weight: 700;
        }

        .notification-actions {
          display: flex;
          align-items: center;
          gap: 5px;
          align-self: center;
        }

        .notification-action {
          width: 32px;
          height: 32px;
          border: 1px solid #dfe8e4;
          background: #ffffff;
          color: #63746d;
          border-radius: 8px;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .notification-action:hover {
          background: #f2f7f4;
          color: #245b4d;
        }

        .notification-action.delete:hover {
          background: #fff1f1;
          color: #d53e3e;
          border-color: #ffd5d5;
        }

        .notification-empty {
          padding: 70px 20px;
          text-align: center;
          color: #7b8c85;
        }

        .notification-empty svg {
          color: #7fac35;
          margin-bottom: 8px;
        }

        .notification-empty h3 {
          margin: 5px 0;
          color: #234b40;
        }

        .notification-empty p {
          margin: 0;
          font-size: 13px;
        }

        .notification-info {
          margin-top: 16px;
          padding: 17px 19px;
          border-radius: 14px;
          border: 1px solid #dce9c5;
          background: linear-gradient(
            135deg,
            #f8fce9,
            #f2f9df
          );
          display: flex;
          gap: 13px;
          align-items: flex-start;
          color: #315f4e;
        }

        .notification-info svg {
          margin-top: 2px;
          flex: 0 0 auto;
        }

        .notification-info b {
          display: block;
          font-size: 14px;
        }

        .notification-info p {
          margin: 5px 0 0;
          color: #65796f;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .notification-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .notification-hero {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .notification-page {
            padding-bottom: 20px;
          }

          .notification-stats {
            grid-template-columns: 1fr;
          }

          .notification-hero-actions {
            width: 100%;
            justify-content: space-between;
          }

          .notification-item {
            grid-template-columns: 42px 1fr;
            padding: 15px;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
          }

          .notification-actions {
            grid-column: 2;
            justify-content: flex-start;
          }

          .notification-toolbar {
            overflow-x: auto;
          }

          .notification-filters {
            min-width: max-content;
          }

          .notification-hero h1 {
            font-size: 25px;
          }
        }
      `}</style>

      <div className="notification-page">

        {/* HEADER */}

        <div className="notification-hero">
          <div>
            <h1>Notifications</h1>

            <p>
              Alerts, case updates, veterinarian responses,
              lab reports and reminders.
            </p>
          </div>

          <div className="notification-hero-actions">

            <div className="notification-unread-box">
              <div className="notification-unread-icon">
                <Bell size={18} />
              </div>

              <div>
                <strong>{unreadCount}</strong>
                <span>Unread</span>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                className="notification-mark-all"
                onClick={markAllAsRead}
              >
                <Check size={15} />
                Mark all as read
              </button>
            )}

          </div>
        </div>

        {/* STATS */}

        <div className="notification-stats">

          <div className="notification-stat">
            <div className="notification-stat-icon red">
              <AlertTriangle size={19} />
            </div>

            <div>
              <span>Critical Alerts</span>
              <strong>{criticalCount}</strong>
              <small>Immediate attention</small>
            </div>
          </div>

          <div className="notification-stat">
            <div className="notification-stat-icon blue">
              <Stethoscope size={19} />
            </div>

            <div>
              <span>Vet Updates</span>
              <strong>3</strong>
              <small>Review required</small>
            </div>
          </div>

          <div className="notification-stat">
            <div className="notification-stat-icon amber">
              <FlaskConical size={19} />
            </div>

            <div>
              <span>Lab Updates</span>
              <strong>1</strong>
              <small>Report available</small>
            </div>
          </div>

          <div className="notification-stat">
            <div className="notification-stat-icon green">
              <Syringe size={19} />
            </div>

            <div>
              <span>Reminders</span>
              <strong>8</strong>
              <small>This week</small>
            </div>
          </div>

        </div>

        {/* NOTIFICATION PANEL */}

        <div className="notification-panel">

          <div className="notification-toolbar">

            <div className="notification-filters">

              <button
                className={
                  filter === "all"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() => setFilter("all")}
              >
                All
                <span>{notifications.length}</span>
              </button>

              <button
                className={
                  filter === "unread"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() => setFilter("unread")}
              >
                Unread
                <span>{unreadCount}</span>
              </button>

              <button
                className={
                  filter === "critical"
                    ? "notification-filter active"
                    : "notification-filter"
                }
                onClick={() => setFilter("critical")}
              >
                Critical
                <span>{criticalCount}</span>
              </button>

            </div>

          </div>

          <div className="notification-list">

            {filteredNotifications.length === 0 ? (

              <div className="notification-empty">
                <CheckCircle2 size={44} />

                <h3>
                  You're all caught up
                </h3>

                <p>
                  There are no notifications matching this filter.
                </p>
              </div>

            ) : (

              filteredNotifications.map((item) => {

                const Icon =
                  iconMap[item.type] || Bell;

                return (
                  <div
                    key={item.id}
                    className={`notification-item ${
                      item.read ? "read" : "unread"
                    }`}
                  >

                    {/* ICON */}

                    <div
                      className={`notification-icon ${item.type}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* CONTENT */}

                    <div
                      className="notification-content"
                      onClick={() =>
                        openNotification(item)
                      }
                    >

                      <div className="notification-title-row">

                        <h3>
                          {item.title}
                        </h3>

                        {!item.read && (
                          <span className="notification-unread-dot"></span>
                        )}

                      </div>

                      <p>
                        {item.message}
                      </p>

                      <div className="notification-meta">

                        <span className="notification-time">
                          <Clock3 size={12} />
                          {item.time}
                        </span>

                        <span className="notification-open">
                          Open
                          <ArrowRight size={13} />
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="notification-actions">

                      {!item.read && (
                        <button
                          className="notification-action"
                          title="Mark as read"
                          onClick={() =>
                            markAsRead(item.id)
                          }
                        >
                          <Check size={15} />
                        </button>
                      )}

                      <button
                        className="notification-action delete"
                        title="Delete notification"
                        onClick={() =>
                          deleteNotification(item.id)
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

        {/* INFO */}

        <div className="notification-info">

          <Bell size={20} />

          <div>
            <b>
              Early-warning notification system
            </b>

            <p>
              Notifications can be generated from AI screening,
              critical risk cases, veterinarian reviews, laboratory
              reports, vaccination schedules and follow-up events.
            </p>
          </div>

        </div>

      </div>
    </>
  );
}

export default Notifications;