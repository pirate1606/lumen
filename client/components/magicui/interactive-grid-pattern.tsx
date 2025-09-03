"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type InteractiveGridPatternProps = {
  className?: string;
  width?: number; // cell width in viewBox units
  height?: number; // cell height in viewBox units
  squares?: [number, number]; // [cols, rows]
  squaresClassName?: string; // class applied to hovered square(s)
  color?: string;
  opacity?: number;
  highlightColor?: string; // fallback when no class provided
};

export function InteractiveGridPattern({
  className,
  width = 36,
  height = 36,
  squares = [72, 96],
  squaresClassName,
  color = "#CBD5E1",
  opacity = 0.45,
  highlightColor = "#60A5FA",
}: InteractiveGridPatternProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hoverPx, setHoverPx] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Track mouse globally so the background can be pointer-events-none
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        setHoverPx(null);
        return;
      }
      setHoverPx({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    function onLeave() {
      setHoverPx(null);
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
    if (!hoverPx || size.w === 0 || size.h === 0) return -1;
    // Map from CSS pixels to viewBox units
    const scaleX = viewW / size.w;
    const scaleY = viewH / size.h;
    const vx = hoverPx.x * scaleX;
    const vy = hoverPx.y * scaleY;
    const cx = Math.floor(vx / width);
    const cy = Math.floor(vy / height);
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return -1;
    return cy * cols + cx;
  }, [hoverPx, size.w, size.h, viewW, viewH, width, height, cols, rows]);

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
    <div
      ref={wrapperRef}
      className={cn("absolute inset-0 -z-10 pointer-events-none", className)}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
      >
        {cells.map((c) => {
          const isHover = c.i === hoveredIndex;
          return (
            <rect
              key={c.i}
              x={c.x * width + 0.5}
              y={c.y * height + 0.5}
              width={width - 1}
              height={height - 1}
              rx={3}
              ry={3}
              opacity={isHover ? 0.95 : opacity}
              className={cn(isHover ? squaresClassName : undefined)}
              fill={isHover && !squaresClassName ? highlightColor : color}
            />
          );
        })}
      </svg>
    </div>
  );
}
