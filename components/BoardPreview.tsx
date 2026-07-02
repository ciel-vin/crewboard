"use client";

import { motion } from "motion/react";
import { EASE } from "./motion/variants";
import { Bolt } from "./Icons";

const COLS: { label: string; color: string; cards: string[] }[] = [
  { label: "To do", color: "var(--todo)", cards: ["Design onboarding flow", "Draft Q3 roadmap"] },
  { label: "Doing", color: "var(--doing)", cards: ["Ship realtime board"] },
  { label: "Done", color: "var(--done)", cards: ["Set up RLS policies"] },
];

/* A polished, static product shot of the board for the hero — pure CSS/motion,
   no data. Signals the product at a glance. */
export function BoardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[#fcfcfd] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e6ea]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e6ea]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e6ea]" />
          <span className="ml-2 text-xs font-semibold text-[var(--faint)]">crewboard.app / Acme workspace</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--brand)]">
            <Bolt className="h-3 w-3" /> Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 bg-[#fbfbfc] p-3.5">
          {COLS.map((col, ci) => (
            <div key={col.label} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5">
              <div className="mb-2 flex items-center gap-1.5 px-0.5">
                <span className="h-2 w-2 rounded-full" style={{ background: col.color }} />
                <span className="text-[11px] font-bold text-[var(--ink)]">{col.label}</span>
                <span className="ml-auto text-[11px] font-semibold text-[var(--faint)]">{col.cards.length}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.5 + ci * 0.1 + i * 0.08 }}
                    className="rounded-lg border border-[var(--line)] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(20,21,26,0.05)]"
                  >
                    <div className="text-[12px] font-semibold leading-snug text-[var(--ink)]">{c}</div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-[#8b8bf5] to-[var(--brand)]" />
                      <span className="h-1.5 w-8 rounded-full bg-[var(--line-2)]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* floating realtime pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: EASE }}
        className="absolute -bottom-3 -right-3 flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 shadow-[var(--shadow-md)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--done)] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--done)]" />
        </span>
        <span className="text-xs font-bold">Synced just now</span>
      </motion.div>
    </motion.div>
  );
}
