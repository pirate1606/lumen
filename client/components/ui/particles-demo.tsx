import React from "react";
import Particles from "./particles";

export default function ParticlesDemo() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl">
      <Particles className="absolute inset-0" />
      <div className="relative z-10 h-full grid place-items-center">
        <div className="px-4 py-2 rounded-lg bg-white/70 shadow text-sm text-slate-700">
          Particle effect demo
        </div>
      </div>
    </div>
  );
}
