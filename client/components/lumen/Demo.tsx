import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import LabAnalyzer from "./LabAnalyzer";
import HealthcareChatbot from "./HealthcareChatbot";

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
  return (
    <section id="demo" className="py-20 scroll-mt-28 md:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Live Demo / Prototype
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Interactive AI-powered healthcare tools powered by working models.
        </p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* CT Viewer */}
          <a
            href="/pearl"
            className="card p-6 block focus:outline-none focus:ring-2 focus:ring-brand-blue/40 rounded-xl"
          >
            <h3 className="font-semibold">3D CT Viewer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Interactive 3D visualization
            </p>
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
            <p className="mt-3 text-sm text-muted-foreground">Open PEARL →</p>
          </a>

          {/* Lab Report Analyzer */}
          <div className="card p-6">
            <h3 className="font-semibold">Lab Report Analyzer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upload lab reports for AI analysis
            </p>
            <div className="mt-3">
              <LabAnalyzer />
            </div>
          </div>

          {/* AI Healthcare Assistant */}
          <div className="card p-6">
            <h3 className="font-semibold">AI Healthcare Assistant</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Powered by Microsoft DialoGPT
            </p>
            <div className="mt-3">
              <HealthcareChatbot />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
