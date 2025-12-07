import api from "@/lib/api";

export const getIssues = async () => {
  const res = await api.get("/issues");
  return res.data;
};

export const createIssue = async (issue: any) => {
  const res = await api.post("/issues", issue);
  return res.data;
};
