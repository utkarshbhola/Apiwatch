"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // LOGIN -----------------------------
  async function handleLogin(username: string, password: string) {
    try {
      setLoading(true);

      const token = await login(username, password);

      if (!token) {
        alert("Invalid username or password");
        return;
      }

      // Save JWT
      localStorage.setItem("jwt", token);

      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  // LOGOUT ----------------------------
  function handleLogout() {
    localStorage.removeItem("jwt"); // remove token
    router.push("/login");          // send user to login screen
  }

  return { handleLogin, handleLogout, loading };
}
