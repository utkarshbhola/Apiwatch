import api from "@/lib/api";

export const getLogs = async (params?: {
  serviceName?: string;
  level?: string;
  limit?: number;
}) => {
  const res = await api.get("/collector/logs", { params });
  return res.data;
};

export const createLog = async (logData: unknown) => {
  const res = await api.post("/collector/logs", logData);
  return res.data;
};
