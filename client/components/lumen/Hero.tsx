import React from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DNAHelix from "./DNAHelix";

class R3FErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError)
      return (
        <div className="h-80 sm:h-96 lg:h-[440px] grid place-items-center text-muted-foreground">
          3D preview unavailable
        </div>
      );
    return this.props.children as any;
  }
}

export default function Hero() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <section id="top" className="relative pt-28">
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
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="block font-sans font-extrabold">LUMEN</span>
            </h1>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Local Unified Medical Engine for triage
            </div>
            <div className="mt-3 text-2xl sm:text-3xl lg:text-4xl text-brand-blue">
              <MorphingText
                words={[
                  "TRIAGE",
                  "PEARL",
                  "LAB PARSER",
                  "AI SPECIALISTS",
                  "GOV SCHEMES EDUCATOR",
                ]}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://82c8d44512bf43d7bb1e5ba388a30246-6f358a16-2e59-4a47-811a-d9dc9f.fly.dev/#demo"
                className="btn-cta"
              >
                Try LUMEN
              </a>
              <a
                href="#about"
                className="px-6 py-3 rounded-lg border border-input bg-background font-semibold hover:bg-accent"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <div className="relative">
            <div className="relative mx-auto max-w-md w-full">
              <div className="card p-0 overflow-hidden">
                <div className="h-80 sm:h-96 lg:h-[440px] bg-secondary">
                  {mounted ? (
                    <R3FErrorBoundary>
                      <Canvas camera={{ position: [1.8, 1.8, 2.2], fov: 45 }}>
                        <ambientLight intensity={0.6} />
                        <directionalLight
                          position={[3, 4, 2]}
                          intensity={0.7}
                        />
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
                    </R3FErrorBoundary>
                  ) : null}
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
