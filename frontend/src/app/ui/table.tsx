import React, { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}
export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>;
}
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}
export function TableRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}
export function TableHead({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 text-left text-sm text-gray-600">{children}</th>;
}
export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
