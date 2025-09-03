import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export type FlickeringGridProps = {
  className?: string;
  style?: React.CSSProperties;
  color?: string; // any CSS color
  maxOpacity?: number; // 0..1
  flickerChance?: number; // 0..1 probability per cell per frame
  squareSize?: number; // px
  gridGap?: number; // px gap between squares
  width?: number; // optional fixed drawing width
  height?: number; // optional fixed drawing height
  speed?: number; // multiplier for decay/frequency
};

export function FlickeringGrid({
  className,
  style,
  color = "#6B7280",
  maxOpacity = 0.5,
  flickerChance = 0.08,
  squareSize = 4,
  gridGap = 6,
  width,
  height,
  speed = 1,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: width ?? 0, h: height ?? 0 });

  const spacing = Math.max(1, squareSize + gridGap);

  const colorRGBA = useMemo(() => {
    // convert color to rgba( r,g,b, a ) base without alpha
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return { r: 107, g: 114, b: 128 };
    ctx.fillStyle = color;
    // @ts-expect-error using private API for computed color
    const computed = ctx.fillStyle as string;
    // computed is rgb(a) or hex; use browser to parse
    const d = document.createElement("div");
    d.style.color = computed;
    document.body.appendChild(d);
    const rgb = getComputedStyle(d).color;
    document.body.removeChild(d);
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return { r: 107, g: 114, b: 128 };
    return {
      r: parseInt(m[1], 10),
      g: parseInt(m[2], 10),
      b: parseInt(m[3], 10),
    };
  }, [color]);

  useEffect(() => {
    const parent = parentRef.current;
    const canvas = canvasRef.current;
    if (!parent || !canvas) return;

    const resize = () => {
      const targetW = width ?? parent.clientWidth;
      const targetH = height ?? parent.clientHeight;
      sizeRef.current = { w: targetW, h: targetH };
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(targetW * dpr));
      canvas.height = Math.max(1, Math.floor(targetH * dpr));
      canvas.style.width = `${targetW}px`;
      canvas.style.height = `${targetH}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const ro = new ResizeObserver(() => {
      if (width == null || height == null) resize();
    });
    ro.observe(parent);

    return () => {
      ro.disconnect();
    };
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const decay = Math.pow(0.92, speed); // higher speed => faster decay
    let lastTime = performance.now();

    const getGridDims = () => {
      const { w, h } = sizeRef.current;
      const cols = Math.max(1, Math.ceil(w / spacing));
      const rows = Math.max(1, Math.ceil(h / spacing));
      return { cols, rows };
    };

    let { cols, rows } = getGridDims();
    let opacities = new Float32Array(cols * rows).fill(0);

    const draw = () => {
      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Handle resize-driven grid changes
      const dims = getGridDims();
      if (dims.cols !== cols || dims.rows !== rows) {
        const next = new Float32Array(dims.cols * dims.rows).fill(0);
        // Best-effort copy of intersection area
        for (let y = 0; y < Math.min(rows, dims.rows); y++) {
          for (let x = 0; x < Math.min(cols, dims.cols); x++) {
            next[y * dims.cols + x] = opacities[y * cols + x];
          }
        }
        opacities = next;
        cols = dims.cols;
        rows = dims.rows;
      }

      const now = performance.now();
      const dt = Math.min(64, now - lastTime); // clamp
      lastTime = now;

      // Update opacities
      const effectiveChance = Math.min(1, flickerChance * (dt / 16) * speed);
      for (let i = 0; i < opacities.length; i++) {
        // decay
        opacities[i] *= decay;
        // random flicker
        if (Math.random() < effectiveChance) {
          opacities[i] = Math.random() * Math.max(0, Math.min(1, maxOpacity));
        }
      }

      // Clear and draw
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = opacities[y * cols + x];
          if (a <= 0.002) continue;
          ctx.fillStyle = `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${a})`;
          const px = x * spacing + (gridGap > 0 ? gridGap / 2 : 0);
          const py = y * spacing + (gridGap > 0 ? gridGap / 2 : 0);
          ctx.fillRect(px, py, squareSize, squareSize);
        }
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [
    colorRGBA.r,
    colorRGBA.g,
    colorRGBA.b,
    flickerChance,
    gridGap,
    maxOpacity,
    spacing,
    speed,
    squareSize,
  ]);

  return (
    <div
      ref={parentRef}
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
