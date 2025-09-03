"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type DotPatternProps = {
  className?: string;
  glow?: boolean;
  size?: number; // grid size in px
  color?: string; // CSS color for dots
  opacity?: number; // 0..1
};

export function DotPattern({
  className,
  glow = false,
  size = 24,
  color = "#9CA3AF",
  opacity = 0.45,
}: DotPatternProps) {
  const style: React.CSSProperties = {
    color,
    opacity,
    backgroundImage: "radial-gradient(currentColor 1.25px, transparent 1.25px)",
    backgroundSize: `${size}px ${size}px`,
  };

  return (
    <div
      className={cn("absolute inset-0 -z-10 pointer-events-none", className)}
    >
      <div className="h-full w-full" style={style} />
      {glow && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(500px 500px at 50% 20%, rgba(56,124,255,0.18), rgba(56,124,255,0) 60%)",
            filter: "blur(0.5px)",
          }}
        />
      )}
    </div>
  );
}
