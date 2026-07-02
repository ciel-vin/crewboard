import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">
              C
            </span>
            <div className="leading-tight">
              <div className="text-[14px] font-700">
                {org?.name ?? "CrewBoard"}
              </div>
              <div className="text-[11px] text-muted">
                {org?.plan === "pro" ? "Pro workspace" : "Free workspace"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button className="btn btn-ghost" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
