import React from "react";
import { motion } from "framer-motion";
import { Globe } from "@/components/magicui/globe";
import { AnimatedList } from "@/components/magicui/animated-list";
import { cn } from "@/lib/utils";

const globeChips = [
  { text: "65% rural population", top: "14%", left: "6%" },
  { text: "20.6/10k doctors", top: "48%", right: "6%" },
  { text: "58,000 snakebite deaths", bottom: "14%", left: "18%" },
  { text: "22 official languages", top: "32%", left: "72%" },
];

const listItems = [
  {
    icon: "🏘️",
    color: "#FFB800",
    title: "65% live in rural areas",
    subtitle: "Limited access to primary care & diagnostics",
  },
  {
    icon: "👨‍⚕️",
    color: "#1E86FF",
    title: "20.6 doctors per 10,000",
    subtitle: "Below WHO guideline of 44.5 per 10,000",
  },
  {
    icon: "🐍",
    color: "#FF3D71",
    title: "58,000 snakebite deaths/yr",
    subtitle: "Mostly preventable with timely first aid",
  },
  {
    icon: "🗣️",
    color: "#00C9A7",
    title: "22 official languages",
    subtitle: "Makes standardized guidance challenging",
  },
];

function ListCard({ icon, color, title, subtitle }: { icon: string; color: string; title: string; subtitle: string }) {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl" style={{ backgroundColor: color }}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="whitespace-pre text-base sm:text-lg font-medium dark:text-white">{title}</figcaption>
          <p className="text-sm text-muted-foreground dark:text-white/60">{subtitle}</p>
        </div>
      </div>
    </figure>
  );
}

export default function Problem() {
  return (
    <section id="problem" className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-sea/40 to-transparent"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">The Problem</h2>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Critical healthcare gaps create avoidable risk. Access, expertise,
              and timely guidance are uneven—especially outside urban centers.
            </p>
            <AnimatedList className="mt-6">
              {listItems.map((it, idx) => (
                <ListCard key={idx} icon={it.icon} color={it.color} title={it.title} subtitle={it.subtitle} />
              ))}
            </AnimatedList>
          </div>
          <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-background px-10 py-8 md:px-24 md:pt-8 md:pb-56">
            <span className="relative z-10 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl sm:text-6xl md:text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              The Problem
            </span>
            <Globe className="top-24 z-0" />
            <div className="pointer-events-none absolute inset-0 z-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.15),rgba(255,255,255,0))]" />

            <div className="pointer-events-none absolute inset-0 z-10">
              {globeChips.map((p, i) => (
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
