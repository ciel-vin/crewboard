import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Icons";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id,name,plan")
    .limit(1);
  const org = orgs?.[0];
  const initial = (org?.name?.[0] ?? user.email?.[0] ?? "C").toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-7 text-[var(--brand)]" />
            <span className="h-5 w-px bg-[var(--line-2)]" />
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#8b8bf5] to-[var(--brand)] text-xs font-bold text-white">
                {initial}
              </span>
              <div className="leading-tight">
                <div className="text-[13.5px] font-bold">{org?.name ?? "CrewBoard"}</div>
                <div className="text-[11px] font-semibold text-[var(--faint)]">
                  {org?.plan === "pro" ? "Pro plan" : "Free plan"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[var(--muted)] sm:inline">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="btn btn-ghost" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
