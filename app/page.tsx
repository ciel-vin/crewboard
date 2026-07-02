import Link from "next/link";
import { MaskedText } from "@/components/motion/MaskedText";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { BoardPreview } from "@/components/BoardPreview";
import { Logo, ArrowRight, Github, Shield, Bolt, Database, Layers } from "@/components/Icons";

const PROOF = [
  { Icon: Layers, t: "Supabase Auth", d: "Email + password with protected server routes via @supabase/ssr and middleware." },
  { Icon: Database, t: "Relational Postgres", d: "orgs → members → projects → tasks → comments, modelled with real foreign keys." },
  { Icon: Shield, t: "Row Level Security", d: "Every workspace is isolated at the database — you only ever read your org's rows." },
  { Icon: Bolt, t: "Realtime", d: "Move a card in one tab and it moves in another, instantly, over Supabase Realtime." },
];

export default function Landing() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] grid-bg" />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <Logo className="h-7 w-7 text-[var(--brand)]" />
            <span className="text-[15px] font-extrabold tracking-tight">CrewBoard</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-subtle">Sign in</Link>
            <Link href="/login" className="btn btn-primary">Open the demo <ArrowRight /></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-shell items-center gap-12 px-6 pb-10 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:pt-24">
        <div>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Supabase · Next.js · RLS · Realtime
          </span>
          <MaskedText
            lines={["The team workspace", "that stays in sync."]}
            className="mt-5 font-extrabold leading-[1.04] tracking-tight text-[2.6rem] sm:text-5xl md:text-[3.4rem]"
            delay={0.05}
          />
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[var(--muted)]">
            CrewBoard is a working demo of a multi-tenant SaaS: sign in and you
            get your own isolated workspace with a live kanban board. Built to
            show a real Supabase stack — auth, a relational schema, database-level
            security, and realtime sync.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn btn-primary">Open the board <ArrowRight /></Link>
            <a href="https://github.com/ciel-vin/crewboard" target="_blank" rel="noreferrer" className="btn btn-ghost">
              <Github className="h-[18px] w-[18px]" /> View source
            </a>
          </div>
          <p className="mt-5 text-sm text-[var(--faint)]">
            Try it free — sign up seeds a private workspace in one click.
          </p>
        </div>

        <BoardPreview />
      </section>

      {/* Proof */}
      <section className="mx-auto max-w-shell px-6 py-16 lg:py-24">
        <Reveal>
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.14em] text-[var(--faint)]">
            A real Supabase build — not a mockup
          </h2>
        </Reveal>
        <Reveal group className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((p) => (
            <RevealItem key={p.t} className="card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <p.Icon className="h-[20px] w-[20px]" />
              </div>
              <div className="mt-4 text-[15px] font-bold">{p.t}</div>
              <div className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{p.d}</div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-shell px-6 pb-24">
        <Reveal className="card relative overflow-hidden px-8 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">
              See the whole thing in <span className="text-gradient">under a minute</span>.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--muted)]">
              Open two browsers to watch realtime sync, and sign up with a second
              email to see Row Level Security keep each workspace private.
            </p>
            <div className="mt-7 flex justify-center">
              <Link href="/login" className="btn btn-primary">Open the demo <ArrowRight /></Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-shell flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-[var(--faint)]">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5 text-[var(--brand)]" />
            <span className="font-semibold text-[var(--muted)]">CrewBoard</span>
            <span>— a Supabase build demo by Alvin Salim</span>
          </div>
          <span>Next.js · Supabase · Tailwind</span>
        </div>
      </footer>
    </main>
  );
}
