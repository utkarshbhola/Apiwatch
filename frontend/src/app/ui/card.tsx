import React, { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border ${className}`}>{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-medium ${className}`}>{children}</h3>;
}

export default Card;
