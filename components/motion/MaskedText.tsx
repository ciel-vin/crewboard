"use client";

import { motion } from "motion/react";
import { EASE } from "./variants";

/* Masked per-word reveal (reused from OLEA) — each word slides up from
   behind a clip mask. Kept under ~1.4s so the reader never reads mid-anim. */
export function MaskedText({
  lines,
  className,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const words = lines.map((line) => line.split(" "));
  let index = 0;
  return (
    <h1 className={className}>
      {words.map((lineWords, li) => (
        <span key={li} className="block">
          {lineWords.map((word) => {
            const i = index++;
            return (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.12em" }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: EASE, delay: delay + i * 0.06 }}
                >
                  {word}
                  <span className="inline-block">&nbsp;</span>
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
