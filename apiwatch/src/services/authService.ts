import api from "@/lib/api";

export async function login(username: string, password: string) {
  const res = await api.post("/auth/login", { username, password });
  const token = res.data.token;

  // Save token
  localStorage.setItem("jwt", token);

  return res.data;
}

export async function signup(username: string, password: string) {
  const res = await api.post("/auth/signup", { username, password });
  return res.data;
}

export function logout() {
  localStorage.removeItem("jwt");
}
