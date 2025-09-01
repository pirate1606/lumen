import React from "react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "of Indians live in rural areas with poor healthcare access.",
    value: 65,
    suffix: "%",
  },
  {
    label: "Doctor density in India is 20.6 per 10,000 vs WHO’s 44.5.",
    value: 20.6,
    suffix: "/10k",
  },
  {
    label:
      "Snakebites cause 58,000 deaths annually, mostly preventable with first aid.",
    value: 58000,
    suffix: "",
  },
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
          <div className="relative">
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="card p-6 bg-white/80 backdrop-blur-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="text-4xl font-extrabold text-brand-blue"
                  >
                    {s.value.toLocaleString()}
                    <span className="text-2xl align-super">{s.suffix}</span>
                  </motion.div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Visual: AI-generated illustration showing the village–hospital
              gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
