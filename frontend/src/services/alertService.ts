import api from "@/lib/api";

export const getAlerts = async () => {
  const res = await api.get("/alerts");
  return res.data;
};

export const createAlert = async (alert: unknown) => {
  const res = await api.post("/alerts", alert);
  return res.data;
};
