"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navigation from "./components/Navigation";
import DashboardPage from "./components/DashboardPage";
import LogsPage from "./components/LogsPage";
import AlertsPage from "./components/AlertsPage";
import IssuesPage from "./components/IssuesPage";
import SettingsPage from "./components/SettingsPage";

export default function Page() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  //
  // STEP 1 — Check JWT on the client (safe from SSR)
  //
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      setIsLoggedIn(!!token);
    }
  }, []);

  //
  // STEP 2 — While checking login, show loading state
  //
  if (isLoggedIn === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  //
  // STEP 3 — If user is NOT logged in → redirect to login page
  //
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow p-6 rounded w-80 text-center">
          <h2 className="text-lg font-semibold mb-3">You are not logged in</h2>

          <button
            onClick={() => router.push("/login")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  //
  // STEP 4 — Render the selected dashboard page
  //
  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <DashboardPage />;
      case "Logs":
        return <LogsPage />;
      case "Alerts":
        return <AlertsPage />;
      case "Issues":
        return <IssuesPage />;
      case "Settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  //
  // STEP 5 — Authenticated UI layout
  //
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="p-6">
        {renderPage()}
      </main>
    </div>
  );
}
