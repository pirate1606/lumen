"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimatedListProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
};

export function AnimatedList({ children, className, stagger = 0.12 }: AnimatedListProps) {
  const items = React.Children.toArray(children);
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((child, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: i * stagger, duration: 0.45, ease: "easeOut" }}
        >
          {child}
        </motion.li>
      ))}
    </ul>
  );
}
