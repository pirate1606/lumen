import React from "react";
import { motion } from "framer-motion";

const problems = [
  "Confusing symptoms without guidance",
  "Scattered diagnostics and reports",
  "Expensive, high-dose imaging",
  "Hard-to-navigate health schemes",
];

const features = [
  "Smart triage and clear next steps",
  "Unified lab and imaging analysis",
  "PEARL CT low-dose reconstruction",
  "Eligibility guidance for government schemes",
];

export default function Solution() {
  return (
    <section id="solution" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          One Unified AI Healthcare Companion
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          LUMEN integrates triage, diagnostics, CT reconstruction, lab analysis,
          and health schemes — built for India.
        </p>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-semibold text-brand-blue">Problems</h3>
            <ul className="mt-3 space-y-3">
              {problems.map((p, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.12 }}
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-destructive"></span>
                  <span>{p}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-brand-teal">LUMEN Lights Up</h3>
            <ul className="mt-3 space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.12 }}
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-cta animate-pulse"></span>
                  <span>{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
