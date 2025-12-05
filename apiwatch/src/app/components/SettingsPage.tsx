'use client";'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Settings, Bell, Lock, Database } from "lucide-react";

export function SettingsPage() {
  const settingsSections = [
    {
      icon: Settings,
      title: "General Settings",
      description: "Configure your application preferences",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Bell,
      title: "Notification Settings",
      description: "Manage alert notifications and preferences",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Lock,
      title: "Security Settings",
      description: "API keys, authentication, and access control",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Configure data retention and export settings",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your application settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <Card
              key={section.title}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${section.bgColor} ${section.color} p-3 rounded-lg`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-sm mt-8">
          <CardHeader>
            <CardTitle>About APIWatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="text-gray-900">Version:</span> 2.5.0
              </p>
              <p>
                <span className="text-gray-900">Last Updated:</span> December 3, 2025
              </p>
              <p>
                <span className="text-gray-900">Environment:</span> Production
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;