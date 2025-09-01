import React from "react";
import { motion } from "framer-motion";

const milestones = [
  { year: "2024", text: "Concept born from student innovation" },
  { year: "2025", text: "Prototype with triage and CT module" },
  { year: "Next", text: "Multi‑language rollout and real‑world pilots" },
];

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">About LUMEN</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">Story of student innovation with AI-generated group illustration.</p>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="card aspect-video grid place-items-center text-sm text-muted-foreground">AI group illustration</div>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                className="card p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-brand-blue font-bold">{m.year}</div>
                <div>{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
