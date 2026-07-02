import Link from "next/link";

const PROOF = [
  { t: "Supabase Auth", d: "Email + password sign-in, protected server routes via @supabase/ssr." },
  { t: "Relational Postgres", d: "orgs → members → projects → tasks → comments, with foreign keys." },
  { t: "Row Level Security", d: "Every workspace is isolated at the database — you only ever see your org's rows." },
  { t: "Realtime", d: "Move a card in one tab and it moves in another, live, via Supabase Realtime." },
];

export default function Landing() {
  return (
    <main className="mx-auto max-w-shell px-6">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">
            C
          </span>
          <span className="text-[15px] font-700">CrewBoard</span>
        </div>
        <Link href="/login" className="btn btn-primary">
          Try the demo
        </Link>
      </header>

      <section className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs font-600 text-brand">
            Supabase · Next.js · RLS · Realtime
          </span>
          <h1 className="mt-5 text-4xl font-700 leading-[1.1] md:text-5xl">
            A multi-tenant team board, built the way a SaaS should be.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            CrewBoard is a working demo: sign up and you get your own isolated
            workspace with a live kanban board. It exists to show a real
            Supabase build — auth, a relational schema, database-level Row Level
            Security, and realtime sync.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-primary">
              Open the board →
            </Link>
            <a
              href="https://github.com/ciel-vin"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              View source
            </a>
          </div>
          <p className="mt-6 text-sm text-muted">
            Tip: open the board in two browsers to see realtime sync, and sign up
            with a second email to see RLS isolation.
          </p>
        </div>

        <div className="grid gap-3">
          {PROOF.map((p) => (
            <div key={p.t} className="card p-5">
              <div className="text-[15px] font-700">{p.t}</div>
              <div className="mt-1 text-sm text-muted">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-6 text-sm text-muted">
        CrewBoard — a Supabase build demo by Alvin Salim · Next.js · Supabase ·
        Tailwind
      </footer>
    </main>
  );
}
