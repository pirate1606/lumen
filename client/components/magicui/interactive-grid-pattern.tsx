"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type InteractiveGridPatternProps = {
  className?: string;
  width?: number; // cell width
  height?: number; // cell height
  squares?: [number, number]; // [cols, rows]
  squaresClassName?: string; // class applied to hovered square(s)
  color?: string;
  opacity?: number;
};

export function InteractiveGridPattern({
  className,
  width = 24,
  height = 24,
  squares = [64, 64],
  squaresClassName,
  color = "#CBD5E1",
  opacity = 0.5,
}: InteractiveGridPatternProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  // Track mouse globally so the background can be pointer-events-none
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        setHover(null);
        return;
      }
      setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    function onLeave() {
      setHover(null);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onLeave, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onLeave as any);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const cols = Math.max(1, squares[0]);
  const rows = Math.max(1, squares[1]);
  const viewW = cols * width;
  const viewH = rows * height;

  const hoveredIndex = useMemo(() => {
    if (!hover) return -1;
    const cx = Math.floor(hover.x / width);
    const cy = Math.floor(hover.y / height);
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return -1;
    return cy * cols + cx;
  }, [hover, width, height, cols, rows]);

  const cells = useMemo(() => {
    const arr: { x: number; y: number; i: number }[] = [];
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        arr.push({ x, y, i: i++ });
      }
    }
    return arr;
  }, [cols, rows]);

  return (
    <div ref={wrapperRef} className={cn("absolute inset-0 -z-10 pointer-events-none", className)}>
      <svg className="h-full w-full" viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="none">
        {cells.map((c) => {
          const isHover = c.i === hoveredIndex;
          return (
            <rect
              key={c.i}
              x={c.x * width + 0.5}
              y={c.y * height + 0.5}
              width={width - 1}
              height={height - 1}
              rx={2}
              ry={2}
              opacity={isHover ? 0.95 : opacity}
              className={cn(isHover ? squaresClassName : undefined)}
              fill={isHover ? undefined : color}
            />
          );
        })}
      </svg>
    </div>
  );
}
