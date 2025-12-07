"use client";

import { useEffect, useState } from "react";
import { getAlerts } from "@/lib/api";
import { AlertTriangle, XCircle, ShieldAlert, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface AlertItem {
  id: string;
  type: string;
  timestamp: string;
  service: string;
  endpoint: string;
  data: any;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const raw = await getAlerts();

        const mapped = raw.map((a: any) => ({
          id: a.id,
          type: a.type,
          timestamp: a.data.timestamp,
          service: a.data.serviceName,
          endpoint: a.data.endpoint,
          data: a.data,
        }));

        setAlerts(mapped);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-8">Loading alerts...</p>;
  if (alerts.length === 0) return <p className="p-8 text-gray-600">No alerts found.</p>;

  const getIcon = (type: string) => {
    if (type.includes("slow")) return <AlertTriangle className="w-5 h-5" />;
    if (type.includes("broken")) return <XCircle className="w-5 h-5" />;
    if (type.includes("rate-limit")) return <ShieldAlert className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const prettifyType = (type: string) => {
    if (type === "slow-api") return "Slow API Detected";
    if (type === "broken-api") return "API Returning 5xx";
    if (type === "rate-limit-hit") return "Rate Limit Triggered";
    return type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-gray-900 mb-4">Alerts</h1>

        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-100">
                    {getIcon(alert.type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2 font-medium">
                      {prettifyType(alert.type)}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {alert.timestamp}
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Service:</strong> {alert.service}
                      </div>

                      <div className="text-sm text-gray-600 font-mono">
                        <strong>Endpoint:</strong> {alert.endpoint}
                      </div>
                    </div>

                    {/* Dynamic Details */}
                    <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 space-y-1">
                      {alert.type.includes("slow") && (
                        <p>
                          <strong>Latency:</strong> {alert.data.latency} ms (Threshold: 500ms)
                        </p>
                      )}

                      {alert.type.includes("broken") && (
                        <p>
                          <strong>Status Code:</strong> {alert.data.status}
                        </p>
                      )}

                      {alert.type.includes("rate-limit") && (
                        <p>
                          <strong>Hits Exceeded:</strong> {alert.data.count}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
