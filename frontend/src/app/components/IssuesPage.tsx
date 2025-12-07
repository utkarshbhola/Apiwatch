"use client";

import { useState, useEffect } from "react";
import { getIssues, resolveIssue } from "@/lib/api";
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";

interface Issue {
  id: string;
  type: string;
  serviceName: string;
  endpoint: string;
  description: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

/* Severity based on type (your project has no severity field)
   So we decide dynamic severity:
   - broken-api = high
   - slow-api = medium
   - rate-limit-hit = low
*/
const getSeverity = (type: string): "high" | "medium" | "low" => {
  if (type === "broken-api") return "high";
  if (type === "slow-api") return "medium";
  return "low";
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getIssues(); // <-- backend /issue
        setIssues(data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const updated = await resolveIssue(id); // calls PUT /issue/{id}/resolve

      // Optimistically update UI
      setIssues((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, resolved: true, resolvedAt: updated.resolvedAt } : i
        )
      );
    } catch (err) {
      console.error("Failed to resolve:", err);
    }
  };

  const getSeverityBadge = (type: string) => {
    const severity = getSeverity(type);

    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-blue-100 text-blue-700",
    };

    return (
      <Badge className={colors[severity]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (resolved: boolean) => {
    return resolved ? (
      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Resolved
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
    );
  };

  const pending = issues.filter((i) => !i.resolved);
  const resolved = issues.filter((i) => i.resolved);

  if (loading) return <p className="p-8">Loading issues...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-gray-900 mb-2">Issues</h1>
        <p className="text-gray-600 mb-8">Manage and track API issues</p>

        {/* Pending Issues */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-gray-900 mb-4">Pending Issues ({pending.length})</h2>
            <Card>
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
                    {pending.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="text-gray-900 max-w-xs">
                          {issue.description}
                        </TableCell>
                        <TableCell>{issue.serviceName}</TableCell>
                        <TableCell className="font-mono text-sm">{issue.endpoint}</TableCell>
                        <TableCell>{getSeverityBadge(issue.type)}</TableCell>
                        <TableCell>{getStatusBadge(issue.resolved)}</TableCell>
                        <TableCell>{issue.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleResolve(issue.id)}
                            className="text-green-600 border-green-300 hover:bg-green-50"
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
        {resolved.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-4">Resolved Issues ({resolved.length})</h2>

            <Card>
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
                    {resolved.map((issue) => (
                      <TableRow key={issue.id} className="opacity-75">
                        <TableCell>{issue.description}</TableCell>
                        <TableCell>{issue.serviceName}</TableCell>
                        <TableCell className="font-mono text-sm">{issue.endpoint}</TableCell>
                        <TableCell>{getSeverityBadge(issue.type)}</TableCell>
                        <TableCell>{getStatusBadge(issue.resolved)}</TableCell>
                        <TableCell>{issue.createdAt}</TableCell>
                        <TableCell>{issue.resolvedAt ?? "-"}</TableCell>
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
