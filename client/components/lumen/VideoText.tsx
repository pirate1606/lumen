"use client";
import React from "react";
import { cn } from "@/lib/utils";

export default function VideoText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <h1 className={cn("relative font-extrabold leading-tight tracking-tight", className)}>
      <span className="video-text inline-block align-top">{text}</span>
    </h1>
  );
}
