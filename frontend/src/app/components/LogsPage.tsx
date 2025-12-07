"use client";

import { useState, useEffect } from "react";
import { getLogs } from "@/lib/api";

interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  endpoint: string;
  method: string;
  status: number;
  latency: number;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load Logs
  useEffect(() => {
    async function load() {
      try {
        const response = await getLogs(0, 50);

        // backend returns { content: [...] }
        const data: LogEntry[] = response.content || [];

        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    }
    load();
  }, []);

  // Unique services for dropdown
  const services = Array.from(new Set(logs.map((l) => l.service)));

  // Filters
  const filteredLogs = logs.filter((log) => {
    if (serviceFilter !== "all" && log.service !== serviceFilter) return false;

    if (statusFilter !== "all") {
      if (statusFilter === "2xx" && (log.status < 200 || log.status >= 300)) return false;
      if (statusFilter === "4xx" && (log.status < 400 || log.status >= 500)) return false;
      if (statusFilter === "5xx" && (log.status < 500 || log.status >= 600)) return false;
    }

    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Logs</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Services</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Status</option>
          <option value="2xx">2xx</option>
          <option value="4xx">4xx</option>
          <option value="5xx">5xx</option>
        </select>
      </div>

      {/* Logs Table */}
      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Service</th>
            <th className="border p-2">Endpoint</th>
            <th className="border p-2">Method</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Latency</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.timestamp}</td>
              <td className="border p-2">{log.service}</td>
              <td className="border p-2">{log.endpoint}</td>
              <td className="border p-2">{log.method}</td>
              <td className="border p-2">{log.status}</td>
              <td className="border p-2">{log.latency} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
