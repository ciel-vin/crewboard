"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "./variants";

/* Scroll-triggered fade-up (reused from OLEA). `group` staggers children
   that are <RevealItem>. */
export function Reveal({
  children,
  className,
  group = false,
}: {
  children: ReactNode;
  className?: string;
  group?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={group ? stagger : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
