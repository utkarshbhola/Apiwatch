import api from "@/lib/api";

export const getHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};
