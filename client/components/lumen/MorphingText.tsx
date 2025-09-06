"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MorphingText({
  words,
  interval = 1600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (!words.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);

  const current = words[index];

  return (
    <div className={cn("relative h-[1.2em] leading-none", className)} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(6px)", y: -6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block font-extrabold tracking-tight"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
