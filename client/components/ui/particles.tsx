import React from "react";

export type ParticlesProps = {
  className?: string;
  particleCount?: number;
  maxVelocity?: number;
  lineDistance?: number;
  color?: string; // CSS color
  opacity?: number;
};

function useAnimationFrame(callback: (t: number) => void) {
  const cbRef = React.useRef(callback);
  cbRef.current = callback;
  React.useEffect(() => {
    let raf = 0;
    let start = performance.now();
    const loop = (t: number) => {
      cbRef.current(t - start);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

export default function Particles({
  className,
  particleCount = 120,
  maxVelocity = 0.4,
  lineDistance = 110,
  color = "#74c0fc",
  opacity = 0.8,
}: ParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const dprRef = React.useRef<number>(1);
  const sizeRef = React.useRef({ w: 0, h: 0 });
  const mouseRef = React.useRef<{ x: number; y: number } | null>(null);
  const particlesRef = React.useRef<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);

  const resize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const rect = canvas.getBoundingClientRect();
    sizeRef.current = { w: rect.width, h: rect.height };
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }, []);

  React.useEffect(() => {
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resize]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = sizeRef.current;
    const arr: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() * 2 - 1) * maxVelocity,
        vy: (Math.random() * 2 - 1) * maxVelocity,
      });
    }
    particlesRef.current = arr;
  }, [particleCount, maxVelocity]);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouseRef.current = null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const { w, h } = sizeRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const parts = particlesRef.current;

    // Update
    for (let p of parts) {
      p.x += p.vx;
      p.y += p.vy;

      // bounce on edges
      if (p.x <= 0 || p.x >= w) p.vx *= -1;
      if (p.y <= 0 || p.y >= h) p.vy *= -1;

      // gentle mouse repulsion
      const m = mouseRef.current;
      if (m) {
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 16000) {
          const f = 20 / Math.max(60, Math.sqrt(dist2));
          p.vx += (dx / (Math.sqrt(dist2) + 1)) * f * 0.02;
          p.vy += (dy / (Math.sqrt(dist2) + 1)) * f * 0.02;
        }
      }

      // clamp velocity
      const speed = Math.hypot(p.vx, p.vy);
      const max = maxVelocity * 1.5;
      if (speed > max) {
        p.vx = (p.vx / speed) * max;
        p.vy = (p.vy / speed) * max;
      }
    }

    // Draw lines
    ctx.save();
    ctx.globalAlpha = opacity * 0.6;
    ctx.strokeStyle = color;
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i];
        const b = parts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= lineDistance) {
          const alpha = (1 - dist / lineDistance) * (opacity * 0.6);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(a.x * dpr, a.y * dpr);
          ctx.lineTo(b.x * dpr, b.y * dpr);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Draw particles
    ctx.fillStyle = color;
    for (let p of parts) {
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, 1.8 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
