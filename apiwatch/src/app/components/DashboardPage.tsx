"use client";

import { useEffect, useState } from "react";
import { getStats, getLogs } from "@/lib/api";
import {
  AlertTriangle,
  XCircle,
  ShieldAlert,
  TrendingUp
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({ slow: 0, broken: 0, rate: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const statsRes = await getStats();
        setStats(statsRes);

        const logRes = await getLogs(0, 300);
        setLogs(logRes.content || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  const totalRequests = logs.length;

  const latencyData = logs.slice(0, 40).map((log) => ({
    time: new Date(log.timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    latency: log.latency
  }));

  const slowEndpoints = logs
    .sort((a, b) => b.latency - a.latency)
    .slice(0, 5)
    .map((l) => ({
      endpoint: l.endpoint,
      latency: l.latency
    }));

  const summaryCards = [
    {
      title: "Slow APIs",
      value: stats.slow,
      icon: AlertTriangle,
      color: "text-yellow-700",
      bg: "bg-yellow-100"
    },
    {
      title: "Broken APIs",
      value: stats.broken,
      icon: XCircle,
      color: "text-red-700",
      bg: "bg-red-100"
    },
    {
      title: "Rate Limits",
      value: stats.rate,
      icon: ShieldAlert,
      color: "text-orange-700",
      bg: "bg-orange-100"
    },
    {
      title: "Total Requests",
      value: totalRequests,
      icon: TrendingUp,
      color: "text-indigo-700",
      bg: "bg-indigo-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mb-8">Realtime API monitoring overview</p>

        {/* ============================
            SUMMARY CARDS
        ============================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {summaryCards.map((item) => (
            <Card
              key={item.title}
              className="shadow-sm border rounded-xl hover:shadow-md transition"
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm">{item.title}</p>
                    <h3 className="text-3xl font-semibold">{item.value}</h3>
                  </div>
                  <div className={`${item.bg} ${item.color} p-3 rounded-lg`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ============================
            LATENCY CHART + REQUESTS CARD
        ============================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card className="lg:col-span-2 shadow-sm border rounded-xl">
            <CardHeader>
              <CardTitle>Latency Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="latency"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border rounded-xl">
            <CardHeader>
              <CardTitle>Request Volume</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full mb-3">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold">{totalRequests}</h3>
              <p className="text-gray-600 text-sm">today</p>
            </CardContent>
          </Card>
        </div>

        {/* ============================
            TOP SLOW ENDPOINTS
        ============================ */}
        <Card className="shadow-sm border rounded-xl">
          <CardHeader>
            <CardTitle>Top 5 Slow Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={slowEndpoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="endpoint" width={150} />
                <Tooltip />
                <Bar dataKey="latency" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
