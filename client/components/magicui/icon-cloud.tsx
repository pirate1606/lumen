"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type IconCloudProps = {
  images: string[];
  radius?: number; // px
  className?: string;
  autoRotateSpeed?: number; // deg per second
};

export function IconCloud({ images, radius = 140, className, autoRotateSpeed = 12 }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rot, setRot] = useState({ x: -15, y: 0 });
  const vel = useRef({ x: 0, y: autoRotateSpeed / 60 });

  // Arrange points on a sphere using Golden Spiral
  const nodes = useMemo(() => {
    const n = images.length;
    const arr: { src: string; x: number; y: number; z: number }[] = [];
    for (let i = 0; i < n; i++) {
      const k = -1 + (2 * i + 1) / n;
      const phi = Math.acos(k);
      const theta = Math.sqrt(n * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      arr.push({ src: images[i], x, y, z });
    }
    return arr;
  }, [images]);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      setRot((r) => ({ x: r.x + vel.current.x, y: r.y + vel.current.y }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      vel.current.x = dy * -0.6;
      vel.current.y = dx * 0.8;
    }
    function onLeave() {
      vel.current.x = 0;
      vel.current.y = autoRotateSpeed / 60;
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [autoRotateSpeed]);

  return (
    <div ref={containerRef} className={cn("relative mx-auto h-[420px] w-full max-w-3xl perspective-[800px]", className)}>
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
        {nodes.map((n, i) => {
          // Project 3D point to 2D using CSS transforms
          const tx = n.x * radius;
          const ty = n.y * radius;
          const tz = (n.z + 1) * (radius * 0.7);
          const scale = 0.65 + (n.z + 1) * 0.35; // closer => bigger
          return (
            <img
              key={i}
              src={n.src}
              alt="tech"
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-md shadow-smooth"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${tx}px, ${ty}px, ${tz}px) scale(${scale})`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
