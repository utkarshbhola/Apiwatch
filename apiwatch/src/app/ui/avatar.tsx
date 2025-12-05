/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function Avatar({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-full overflow-hidden ${className} bg-gray-100 flex items-center justify-center`}>
      <img
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        alt="avatar"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
