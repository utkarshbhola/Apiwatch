"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter(); // ✅ FIX: Added this
  const { handleLogin, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl mb-4 font-semibold">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600 mt-3 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-indigo-600 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
