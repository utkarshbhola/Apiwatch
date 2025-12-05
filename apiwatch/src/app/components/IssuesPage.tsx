'use client";'
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  endpoint: string;
  serviceName: string;
  status: "pending" | "resolved";
  severity: "high" | "medium" | "low";
  createdAt: string;
  resolvedAt?: string;
}

export function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: "1",
      title: "Payment API Database Connection Failed",
      endpoint: "/api/v1/payments",
      serviceName: "Payment Service",
      status: "pending",
      severity: "high",
      createdAt: "2025-12-03 14:23:38",
    },
    {
      id: "2",
      title: "Search API Elasticsearch Timeout",
      endpoint: "/api/v1/search",
      serviceName: "Search Service",
      status: "pending",
      severity: "high",
      createdAt: "2025-12-03 14:23:10",
    },
    {
      id: "3",
      title: "User API Slow Response Time",
      endpoint: "/api/v1/users",
      serviceName: "User Service",
      status: "pending",
      severity: "medium",
      createdAt: "2025-12-03 14:23:45",
    },
    {
      id: "4",
      title: "Analytics API Performance Degradation",
      endpoint: "/api/v1/analytics",
      serviceName: "Analytics Service",
      status: "pending",
      severity: "medium",
      createdAt: "2025-12-03 14:23:42",
    },
    {
      id: "5",
      title: "Auth Service Rate Limit Configuration",
      endpoint: "/api/v1/auth/login",
      serviceName: "Auth Service",
      status: "resolved",
      severity: "medium",
      createdAt: "2025-12-03 13:15:20",
      resolvedAt: "2025-12-03 14:05:12",
    },
    {
      id: "6",
      title: "Export API Memory Leak",
      endpoint: "/api/v1/export",
      serviceName: "Export Service",
      status: "resolved",
      severity: "high",
      createdAt: "2025-12-03 12:30:15",
      resolvedAt: "2025-12-03 13:45:30",
    },
    {
      id: "7",
      title: "Notification Service Rate Limiting",
      endpoint: "/api/v1/notifications",
      serviceName: "Notification Service",
      status: "resolved",
      severity: "low",
      createdAt: "2025-12-03 11:20:45",
      resolvedAt: "2025-12-03 12:10:20",
    },
  ]);

  const handleMarkAsResolved = (issueId: string) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: "resolved" as const,
              resolvedAt: new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).replace(",", ""),
            }
          : issue
      )
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colors: { [key: string]: string } = {
      high: "bg-red-100 text-red-700 hover:bg-red-100",
      medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      low: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    };
    return (
      <Badge className={colors[severity]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "resolved" ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 w-fit">
        <CheckCircle2 className="w-3 h-3" />
        Resolved
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
    );
  };

  const pendingIssues = issues.filter((issue) => issue.status === "pending");
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Issues</h1>
          <p className="text-gray-600">Manage and track API issues</p>
        </div>

        {/* Pending Issues */}
        {pendingIssues.length > 0 && (
          <div className="mb-8">
            <h2 className="text-gray-900 mb-4">Pending Issues ({pendingIssues.length})</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="text-gray-900 max-w-xs">
                          {issue.title}
                        </TableCell>
                        <TableCell className="text-gray-600">{issue.serviceName}</TableCell>
                        <TableCell className="text-gray-600 text-sm font-mono">
                          {issue.endpoint}
                        </TableCell>
                        <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{issue.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleMarkAsResolved(issue.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          >
                            Mark as Resolved
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resolved Issues */}
        {resolvedIssues.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-4">Resolved Issues ({resolvedIssues.length})</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Resolved At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedIssues.map((issue) => (
                      <TableRow key={issue.id} className="opacity-60">
                        <TableCell className="text-gray-900 max-w-xs">
                          {issue.title}
                        </TableCell>
                        <TableCell className="text-gray-600">{issue.serviceName}</TableCell>
                        <TableCell className="text-gray-600 text-sm font-mono">
                          {issue.endpoint}
                        </TableCell>
                        <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                        <TableCell>{getStatusBadge(issue.status)}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{issue.createdAt}</TableCell>
                        <TableCell className="text-gray-600 text-sm">{issue.resolvedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssuesPage;
