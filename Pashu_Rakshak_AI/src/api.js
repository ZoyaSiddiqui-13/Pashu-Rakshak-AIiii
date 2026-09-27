const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (isLocal ? "http://127.0.0.1:8000" : "");

async function request(path, options = {}) {
  const token = localStorage.getItem("pashuAccessToken");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("pashuAccessToken");
    localStorage.removeItem("pashuUser");
    localStorage.removeItem("pashuAllowedRole");
    localStorage.removeItem("pashuRole");

    window.location.href = "/login";

    throw new Error("Session expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  baseUrl: API_BASE,

  // AUTH
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request("/api/auth/me"),

  // DASHBOARD
  dashboardSummary: () =>
    request("/api/dashboard/summary"),

  // ANIMALS
  animals: {
    list: () =>
      request("/api/animals"),

    create: (payload) =>
      request("/api/animals", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/animals/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // CASES
  cases: {
    list: (params = {}) => {
      const query = new URLSearchParams();

      if (params.risk) {
        query.set("risk", params.risk);
      }

      if (params.stage) {
        query.set("stage", params.stage);
      }

      if (params.limit) {
        query.set("limit", params.limit);
      }

      const suffix = query.toString()
        ? `?${query.toString()}`
        : "";

      return request(`/api/cases${suffix}`);
    },

    create: (payload) =>
      request("/api/cases", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/cases/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // HEALTH RECORDS
  healthRecords: {
    list: () =>
      request("/api/health-records"),

    create: (payload) =>
      request("/api/health-records", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // VACCINATIONS
  vaccinations: {
    list: () =>
      request("/api/vaccinations"),

    create: (payload) =>
      request("/api/vaccinations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/vaccinations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // TREATMENTS
  treatments: {
    list: () =>
      request("/api/treatments"),

    create: (payload) =>
      request("/api/treatments", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/treatments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // FOLLOW-UPS
  followUps: {
    list: (status) => {
      const suffix = status
        ? `?status=${encodeURIComponent(status)}`
        : "";

      return request(`/api/follow-ups${suffix}`);
    },

    create: (payload) =>
      request("/api/follow-ups", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/follow-ups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // LAB
  labTests: {
    list: () =>
      request("/api/lab-tests"),

    create: (payload) =>
      request("/api/lab-tests", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id, payload) =>
      request(`/api/lab-tests/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  },

  // AI
  ai: {
    analyze: (payload) =>
      request("/api/ai/analyze", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // NOTIFICATIONS
  notifications: {
    list: (unreadOnly = false) =>
      request(
        `/api/notifications${
          unreadOnly
            ? "?unread_only=true"
            : ""
        }`
      ),

    create: (payload) =>
      request("/api/notifications", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  // OUTBREAKS
  outbreaks: {
    summary: () =>
      request("/api/outbreaks/summary"),
  },

  // ANALYTICS
  analytics: {
    summary: () =>
      request("/api/analytics/summary"),
  },

  // ADMIN
  admin: {
    users: (role) => {
      const suffix = role
        ? `?role=${encodeURIComponent(role)}`
        : "";

      return request(
        `/api/admin/users${suffix}`
      );
    },
  },
};

export default api;