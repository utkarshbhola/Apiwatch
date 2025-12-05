"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(username: string, password: string) {
    try {
      setLoading(true);

      const token = await login(username, password);

      console.log("TOKEN FROM login():", token);

      if (!token) {
        alert("Invalid username or password");
        return;
      }

      // save token here (not inside login.ts)
      localStorage.setItem("jwt", token);

      console.log("JWT SAVED TO localStorage:", localStorage.getItem("jwt"));

      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading };
}
