import React from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DNAHelix from "./DNAHelix";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="top" className="relative pt-28">
      <div className="absolute inset-0 wave-bg"></div>
      <div className="absolute -z-10 left-1/2 top-24 -translate-x-1/2 h-[520px] w-[520px] gradient-orb rounded-full blur-2xl opacity-40"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-sea bg-white/60 px-3 py-1 text-xs font-medium text-brand-blue shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cta animate-pulse" />
              Now launching in India
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="block font-surgena">LUMEN</span>
              <span className="block mt-1">Smarter, Safer, Accessible Healthcare for Everyday India</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              AI-powered triage, lab analysis, CT reconstruction, and healthcare
              guidance — in your language.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/#demo" className="btn-cta">
                Try LUMEN
              </Link>
              <Link
                to="/#about"
                className="px-6 py-3 rounded-lg border border-input bg-background font-semibold hover:bg-accent"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <div className="relative">
            <div className="relative mx-auto max-w-md w-full">
              <div className="card p-0 overflow-hidden">
                <div className="h-80 sm:h-96 lg:h-[440px] bg-secondary">
                  <Canvas camera={{ position: [1.8, 1.8, 2.2], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[3, 4, 2]} intensity={0.7} />
                    <DNAHelix />
                    <OrbitControls
                      enablePan={false}
                      enableZoom={false}
                      autoRotate
                      autoRotateSpeed={0.6}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={(2 * Math.PI) / 3}
                    />
                  </Canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center" aria-hidden>
          <div className="flex flex-col items-center text-muted-foreground">
            <span className="text-xs">Scroll</span>
            <span className="mt-1 inline-block h-8 w-[2px] rounded-full bg-muted animate-scroll-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
