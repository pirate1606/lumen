import React from "react";
import { motion } from "framer-motion";
import { Globe } from "@/components/magicui/globe";

const problems = [
  { text: "Rural access gaps", top: "14%", left: "6%" },
  { text: "Low doctor density", top: "48%", right: "6%" },
  { text: "Snakebite mortality", bottom: "14%", left: "18%" },
  { text: "Language barriers", top: "32%", left: "72%" },
  { text: "Delayed triage", bottom: "8%", right: "22%" },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-sea/40 to-transparent"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">The Problem</h2>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Critical healthcare gaps create avoidable risk. Access, expertise,
              and timely guidance are uneven—especially outside urban centers.
            </p>
          </div>
          <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-background px-10 py-8 md:px-24 md:pt-8 md:pb-56">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl sm:text-6xl md:text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              The Problem
            </span>
            <Globe className="top-24" />
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.15),rgba(255,255,255,0))]" />

            <div className="pointer-events-none absolute inset-0">
              {problems.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ top: p.top as string | undefined, left: (p as any).left, right: (p as any).right, bottom: (p as any).bottom }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 rounded-full border border-input bg-white/90 dark:bg-slate-900/70 backdrop-blur px-3 py-1 text-sm shadow-smooth">
                    <span className="inline-block h-2 w-2 rounded-full bg-cta" />
                    <span className="font-medium">{p.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
