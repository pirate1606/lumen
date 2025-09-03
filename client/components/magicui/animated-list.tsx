"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimatedListProps = {
  children: React.ReactNode;
  className?: string;
  intervalMs?: number; // speed of popping
};

export function AnimatedList({
  children,
  className,
  intervalMs = 1500,
}: AnimatedListProps) {
  const base = useMemo(() => React.Children.toArray(children), [children]);
  const counter = useRef(0);
  const [queue, setQueue] = useState(() =>
    base.map((c, i) => ({ node: c, id: `${i}-0` })),
  );

  useEffect(() => {
    setQueue(base.map((c, i) => ({ node: c, id: `${i}-0` })));
    counter.current = 0;
  }, [base]);

  useEffect(() => {
    if (queue.length <= 1) return;
    const t = setInterval(
      () => {
        setQueue((prev) => {
          if (prev.length <= 1) return prev;
          const [first, ...rest] = prev;
          counter.current += 1;
          return [
            ...rest,
            {
              node: first.node,
              id: `${first.id.split("-")[0]}-${counter.current}`,
            },
          ];
        });
      },
      Math.max(400, intervalMs),
    );
    return () => clearInterval(t);
  }, [intervalMs, queue.length]);

  return (
    <ul className={cn("relative flex flex-col gap-3", className)}>
      <AnimatePresence initial={false}>
        {queue.map((item) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            layout
          >
            {item.node}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
