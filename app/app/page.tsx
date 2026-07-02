import { createClient } from "@/lib/supabase/server";
import { Board } from "@/components/Board";
import type { Task } from "@/lib/types";

export default async function AppHome() {
  const supabase = createClient();

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id,name")
    .limit(1);
  const org = orgs?.[0];

  const { data: projects } = org
    ? await supabase
        .from("projects")
        .select("id,name")
        .eq("org_id", org.id)
        .order("created_at")
        .limit(1)
    : { data: null };
  const project = projects?.[0];

  const { data: tasks } = project
    ? await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", project.id)
        .order("position")
    : { data: [] as Task[] };

  if (!org || !project) {
    return (
      <main className="mx-auto max-w-shell px-6 py-16 text-center text-muted">
        Setting up your workspace… if this persists, make sure the SQL migration
        ran (the signup trigger seeds your first board).
      </main>
    );
  }

  return (
    <Board
      projectId={project.id}
      projectName={project.name}
      initialTasks={(tasks as Task[]) ?? []}
    />
  );
}
