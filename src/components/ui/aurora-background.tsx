
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const AuroraBackground = ({
  children,
  className,
  showRadialGradient = true,
}: {
  children: React.ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-slate-950",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "linear-gradient(to right, #0ea5e9, #9b87f5, #0ea5e9)",
          filter: "blur(100px)",
          animation: "pulse 8s infinite",
        }}
      />
      {showRadialGradient && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(circle at top, transparent 30%, #000)",
          }}
        />
      )}
      <style>{`
        @keyframes pulse {
          0% {
            transform: translateX(-50%) translateY(-10%);
          }
          50% {
            transform: translateX(0%) translateY(10%);
          }
          100% {
            transform: translateX(-50%) translateY(-10%);
          }
        }
      `}</style>
    </div>
  );
};
