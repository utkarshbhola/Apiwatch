"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Activity, LogOut } from "lucide-react";
import Avatar from "../ui/avatar";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = ["Dashboard", "Logs", "Alerts", "Issues"];
  const [open, setOpen] = useState(false);
  const { handleLogout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-900 font-medium">APIWatch</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative">
            <div
              className="cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Avatar className="w-9 h-9 ring-2 ring-gray-100 hover:ring-gray-200 transition-all" />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-md py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
