import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("ATTACHED JWT →", token);
    }
  }
  return config;
});


export default api;

/* ============================
   AUTH
============================ */
export async function signup(username: string, password: string) {
  const res = await api.post("/auth/signup", { username, password });
  return res.data;
}

export async function login(username: string, password: string) {
  const res = await api.post("/auth/login", { username, password });
  const token = res.data.data?.token;

  if (typeof window !== "undefined" && token) {
    localStorage.setItem("jwt", token);
  }

  return token;
}

/* ============================
   LOGS
============================ */


export async function getLogs(page = 0, size = 50, service?: string, status?: number, slowOnly?: boolean) {
  const params: {
  page: number;
  size: number;
  service?: string;
  status?: number;
  slowOnly?: boolean;
} = { page, size };

  if (service) params.service = service;
  if (status) params.status = status;
  if (slowOnly) params.slowOnly = slowOnly;

  const res = await api.get("/logs", { params });
  return res.data;
}

/* ============================
   ALERTS
============================ */

export async function getAlerts() {
  const res = await api.get("/alerts");
  return res.data;
}

/* ============================
   STATS
============================ */

export async function getStats() {
  const res = await api.get("/stats");
  return res.data;
}

/* ============================
   ISSUES
============================ */

export async function resolveIssue(id: string) {
  const res = await api.put(`/issue/${id}/resolve`);
  return res.data;
}

export async function getIssues() {
  const res = await api.get("/issue");
  return res.data;
}

