import React from "react";

interface ScratchRevealProps {
  imageSrc: string;
  className?: string;
  brushRadius?: number; // in CSS px
  overlay?: string; // any CSS color/gradient for the scratchable layer
  onRevealThreshold?: (percentCleared: number) => void;
  revealThreshold?: number; // 0..1
}

// A lightweight, dependency-free scratch-to-reveal canvas.
// It draws an overlay on a <canvas> and erases with destination-out as the user scratches.
export default function ScratchReveal({
  imageSrc,
  className,
  brushRadius = 26,
  overlay = "rgba(2,6,23,0.85)",
  onRevealThreshold,
  revealThreshold = 0.5,
}: ScratchRevealProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const isDrawingRef = React.useRef(false);
  const dprRef = React.useRef(1);
  const clearedRef = React.useRef(0);
  const hasFiredThresholdRef = React.useRef(false);

  const resize = React.useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const rect = container.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    // Repaint overlay after resize
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(1, 1); // keep scale neutral per draw call
    paintOverlay();
  }, []);

  const paintOverlay = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "source-over";
    // Fill overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (overlay.startsWith("linear-gradient") || overlay.startsWith("radial-gradient")) {
      // For gradients, draw to a temp canvas via CSS paint using DOM background.
      // Simpler approach: solid fill as fallback for gradient string.
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    hasFiredThresholdRef.current = false;
    clearedRef.current = 0;
  }, [overlay]);

  const drawCircle = React.useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x * dpr, y * dpr, brushRadius * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [brushRadius]);

  const getPointer = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const me = e as React.MouseEvent;
    return { x: me.clientX - rect.left, y: me.clientY - rect.top };
  };

  const estimateCleared = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return 0;
    const { width, height } = canvas;
    const sample = ctx.getImageData(0, 0, width, height);
    let cleared = 0;
    // Count pixels with alpha < 10
    for (let i = 3; i < sample.data.length; i += 4) {
      if (sample.data[i] < 10) cleared++;
    }
    const percent = cleared / (width * height);
    clearedRef.current = percent;
    if (!hasFiredThresholdRef.current && percent >= revealThreshold) {
      hasFiredThresholdRef.current = true;
      onRevealThreshold?.(percent);
    }
    return percent;
  }, [onRevealThreshold, revealThreshold]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    const p = getPointer(e);
    drawCircle(p.x, p.y);
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const p = getPointer(e);
    drawCircle(p.x, p.y);
  };

  const endDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    estimateCleared();
  };

  React.useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  React.useEffect(() => {
    // repaint overlay whenever image loads (ensures canvas matches size)
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => paintOverlay();
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [paintOverlay]);

  return (
    <div ref={containerRef} className={className}>
      <div className="relative overflow-hidden rounded-xl">
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Scratch reveal"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={endDrawing}
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium"
          onClick={paintOverlay}
        >
          Reset
        </button>
        <span className="text-xs text-muted-foreground self-center">
          Scratch to reveal the photo
        </span>
      </div>
    </div>
  );
}
