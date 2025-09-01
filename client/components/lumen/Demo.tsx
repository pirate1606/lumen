import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import LabAnalyzer from "./LabAnalyzer";

function Cube() {
  return (
    <mesh rotation={[0.6, 0.8, 0]}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#19bfb2" metalness={0.4} roughness={0.2} />
      <pointLight position={[4, 4, 4]} intensity={1.2} />
    </mesh>
  );
}

export default function Demo() {
  const [msg, setMsg] = useState("");
  return (
    <section id="demo" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Live Demo / Prototype
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Interactive cards: CT viewer, Lab upload, Chatbot.
        </p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold">CT Viewer</h3>
            <div className="mt-3 h-48 rounded-xl bg-secondary overflow-hidden">
              <Canvas camera={{ position: [2.8, 2.8, 2.8] }}>
                <ambientLight intensity={0.6} />
                <Cube />
                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={1.4}
                />
              </Canvas>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Lab Report Upload</h3>
            <label className="mt-3 grid place-items-center h-48 rounded-xl border-2 border-dashed border-brand-blue/40 bg-secondary cursor-pointer">
              <input type="file" className="hidden" />
              <span>Click to choose a report</span>
            </label>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Chatbot</h3>
            <div className="mt-3 h-36 rounded-xl bg-secondary p-3 text-sm overflow-auto">
              <div className="mb-2 rounded-lg bg-white p-2 shadow-sm">
                Hello! Ask a health question.
              </div>
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type here…"
                className="flex-1 rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-cta"
              />
              <button className="btn-cta">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
