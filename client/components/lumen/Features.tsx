import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Mic, Image as ImageIcon, Upload, BadgeAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function RotatingCube() {
  return (
    <mesh rotation={[0.4, 0.7, 0]}>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial color="#1B8EE6" metalness={0.4} roughness={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
    </mesh>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="group card p-6 hover:-translate-y-1 transition will-change-transform [transform-style:preserve-3d]">
      {children}
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Powerful Features
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Each module includes interactive examples and micro‑interactions.
        </p>

        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* 5.1 Symptoms-Based Diagnosis & Guidance */}
          <Card>
            <h3 className="font-semibold">
              Symptoms-Based Diagnosis & Guidance
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Input via text, audio, or image. Output includes urgency.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs">
                <Mic className="size-3.5" />
                Audio
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs">
                <ImageIcon className="size-3.5" />
                Image
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs">
                Text
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-semibold shadow-sm">
                Green
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-600 px-3 py-1 text-xs font-semibold shadow-sm">
                Yellow
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-semibold shadow-sm animate-pulse">
                Red
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Pulse effect indicates severity.
            </p>
          </Card>

          {/* 5.2 AI Specialist Modules */}
          <Card>
            <h3 className="font-semibold">AI Specialist Modules</h3>
            <Tabs defaultValue="derm" className="mt-3">
              <TabsList className="grid grid-cols-3 gap-2 bg-secondary rounded-lg p-1">
                <TabsTrigger
                  value="derm"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                >
                  Dermatology
                </TabsTrigger>
                <TabsTrigger
                  value="radio"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                >
                  Radiology
                </TabsTrigger>
                <TabsTrigger
                  value="cardio"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                >
                  Cardiology
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="derm"
                className="mt-3 text-sm text-muted-foreground"
              >
                Skin rash analysis with explanation and care steps.
              </TabsContent>
              <TabsContent
                value="radio"
                className="mt-3 text-sm text-muted-foreground"
              >
                X-ray/CT hints with structured findings in plain language.
              </TabsContent>
              <TabsContent
                value="cardio"
                className="mt-3 text-sm text-muted-foreground"
              >
                Chest pain triage with risk factors and lifestyle advice.
              </TabsContent>
            </Tabs>
          </Card>

          {/* 5.3 PEARL CT Reconstruction */}
          <Card>
            <h3 className="font-semibold">PEARL CT Reconstruction</h3>
            <div className="mt-3 h-48 rounded-xl bg-secondary overflow-hidden">
              <Suspense
                fallback={
                  <div className="h-full grid place-items-center text-sm text-muted-foreground">
                    Loading 3D…
                  </div>
                }
              >
                <Canvas camera={{ position: [2.8, 2.8, 2.8] }}>
                  <ambientLight intensity={0.6} />
                  <RotatingCube />
                  <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={1.2}
                  />
                </Canvas>
              </Suspense>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Interactive 3D model preview (placeholder).
            </p>
          </Card>

          {/* 5.4 Lab Report Analyzer */}
          <Card>
            <h3 className="font-semibold">Lab Report Analyzer & Follow‑Up</h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              className="mt-3 grid place-items-center h-32 rounded-xl border-2 border-dashed border-brand-blue/40 bg-secondary text-sm text-muted-foreground"
            >
              <Upload className="mr-2" /> Drag & drop report here
            </div>
            <div className="mt-3 text-sm">
              <div className="flex items-center gap-2">
                <BadgeAlert className="text-amber-500" /> Hemoglobin low → Eat
                spinach, dal, jaggery. Severity: Moderate (Follow‑up in 1–2
                weeks).
              </div>
            </div>
          </Card>

          {/* 5.5 Government Schemes Assistant */}
          <Card>
            <h3 className="font-semibold">
              Government Schemes & Benefits Assistant
            </h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="rounded-xl bg-secondary p-3">
                User: Dialysis help in UP?
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                LUMEN: Eligible under ABC scheme — steps 1–3…
              </div>
            </div>
          </Card>

          {/* 5.6 Preliminary Triage & Emergency Education */}
          <Card>
            <h3 className="font-semibold">
              Preliminary Triage & Emergency Education
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              {["Snakebite", "Drowning", "Burns", "Electric Shock"].map((t) => (
                <div
                  key={t}
                  className="rounded-xl bg-secondary p-3 hover:bg-white transition shadow-sm"
                >
                  {t}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tiles flip into pictorial sequence on interaction.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
