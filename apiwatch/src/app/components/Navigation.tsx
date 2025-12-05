"use client";
import { Activity } from "lucide-react";
import Avatar from "../ui/avatar";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = ["Dashboard", "Logs", "Alerts", "Issues", "Settings"];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
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

          {/* User Profile */}
          <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-gray-100 hover:ring-gray-200 transition-all" />
        </div>
      </div>
    </nav>
  );
}

