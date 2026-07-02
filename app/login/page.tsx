"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { motion } from "motion/react";
import { signIn, signUp, type AuthState } from "./actions";
import { EASE } from "@/components/motion/variants";
import { Logo, ArrowRight, Shield, Bolt, Database } from "@/components/Icons";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary w-full" disabled={pending}>
      {pending ? "Working…" : label}
      {!pending && <ArrowRight />}
    </button>
  );
}

const PROOF = [
  { Icon: Shield, t: "Row Level Security keeps every workspace private" },
  { Icon: Bolt, t: "Realtime board — changes sync across tabs instantly" },
  { Icon: Database, t: "Relational Postgres schema with Supabase Auth" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const action = mode === "in" ? signIn : signUp;
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--line)] bg-[#fbfbfc] p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-80" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <Logo className="h-7 w-7 text-[var(--brand)]" />
          <span className="text-[15px] font-extrabold tracking-tight">CrewBoard</span>
        </Link>
        <div className="relative">
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">
            The team workspace that stays in sync.
          </h2>
          <ul className="mt-7 space-y-3.5">
            {PROOF.map((p) => (
              <li key={p.t} className="flex items-start gap-3 text-[15px] text-[var(--muted)]">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                  <p.Icon className="h-[17px] w-[17px]" />
                </span>
                {p.t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-[var(--faint)]">
          A Supabase build demo · Next.js · by Alvin Salim
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo className="h-7 w-7 text-[var(--brand)]" />
            <span className="text-[15px] font-extrabold tracking-tight">CrewBoard</span>
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight">
            {mode === "in" ? "Sign in to your workspace" : "Create your workspace"}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            {mode === "in"
              ? "Welcome back — pick up where your team left off."
              : "Sign up and we'll seed a private workspace for you."}
          </p>

          <form action={formAction} className="mt-7 space-y-3.5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label>
              <input id="email" name="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Password</label>
              <input id="password" name="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>

            {state.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
            )}
            {state.message && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.message}</p>
            )}

            <Submit label={mode === "in" ? "Sign in" : "Create workspace"} />
          </form>

          <button
            type="button"
            onClick={() => { setEmail("demo@crewboard.app"); setPassword("crewboard123"); setMode("in"); }}
            className="btn btn-ghost mt-3 w-full"
          >
            Use demo account
          </button>

          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="mt-5 w-full text-center text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            {mode === "in" ? "No account? Create one" : "Already have an account? Sign in"}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
