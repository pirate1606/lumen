import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  { title: "User Input", desc: "Text, audio, or image" },
  { title: "AI Processing", desc: "Triage + models" },
  { title: "Clear Outputs", desc: "Diagnosis, severity, next steps" },
  { title: "User Action", desc: "Care, follow‑up, scheme" },
];

export default function HowItWorks() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          How it Works
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Interactive timeline highlights as you scroll.
        </p>

        <div className="mt-10 relative">
          <div className="h-1 bg-secondary rounded-full" />
          <motion.div
            style={{ x }}
            className="absolute left-0 top-0 h-1 w-1/4 bg-cta rounded-full origin-left"
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mx-auto h-10 w-10 rounded-full bg-cta/15 grid place-items-center text-cta font-bold">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
