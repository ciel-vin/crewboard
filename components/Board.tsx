"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { COLUMNS, type Status, type Task } from "@/lib/types";

export function Board({
  projectId,
  projectName,
  initialTasks,
}: {
  projectId: string;
  projectName: string;
  initialTasks: Task[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);
  const [live, setLive] = useState(false);

  // Realtime — reflect INSERT/UPDATE/DELETE from any session (RLS-scoped).
  useEffect(() => {
    const channel = supabase
      .channel(`board-${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `project_id=eq.${projectId}` },
        (payload) => {
          setTasks((prev) => {
            if (payload.eventType === "DELETE") {
              return prev.filter((t) => t.id !== (payload.old as Task).id);
            }
            const row = payload.new as Task;
            const exists = prev.some((t) => t.id === row.id);
            return exists
              ? prev.map((t) => (t.id === row.id ? row : t))
              : [...prev, row];
          });
        }
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId]);

  const colTasks = (s: Status) =>
    tasks.filter((t) => t.status === s).sort((a, b) => a.position - b.position);

  async function move(id: string, to: Status) {
    const inTarget = tasks.filter((t) => t.status === to);
    const pos = (inTarget.length ? Math.max(...inTarget.map((t) => t.position)) : 0) + 1000;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: to, position: pos } : t)));
    await supabase.from("tasks").update({ status: to, position: pos }).eq("id", id);
  }

  async function add(status: Status, title: string) {
    const inCol = tasks.filter((t) => t.status === status);
    const pos = (inCol.length ? Math.max(...inCol.map((t) => t.position)) : 0) + 1000;
    const { data } = await supabase
      .from("tasks")
      .insert({ project_id: projectId, title, status, position: pos })
      .select("*")
      .single();
    if (data) {
      setTasks((prev) => (prev.some((t) => t.id === data.id) ? prev : [...prev, data as Task]));
    }
  }

  async function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  return (
    <main className="mx-auto max-w-shell px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-700">{projectName}</h1>
          <p className="text-sm text-muted">Drag cards between columns — changes sync live.</p>
        </div>
        <span
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-600"
          title="Supabase Realtime connection"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: live ? "var(--ok)" : "var(--warn)" }}
          />
          {live ? "Realtime connected" : "Connecting…"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.key);
            }}
            onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
            onDrop={() => {
              if (dragId) move(dragId, col.key);
              setDragId(null);
              setOver(null);
            }}
            className="rounded-2xl border p-3 transition-colors"
            style={{
              background: over === col.key ? "rgba(79,70,229,0.06)" : "var(--surface)",
              borderColor: over === col.key ? "var(--brand)" : "var(--line)",
            }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-700">{col.label}</span>
              <span className="rounded-full bg-bg px-2 py-0.5 text-xs font-600 text-muted">
                {colTasks(col.key).length}
              </span>
            </div>

            <div className="min-h-[60px] space-y-2">
              <AnimatePresence initial={false}>
                {colTasks(col.key).map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => setDragId(null)}
                    className="group card cursor-grab p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm leading-snug">{t.title}</span>
                      <button
                        onClick={() => remove(t.id)}
                        className="shrink-0 text-muted opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                        aria-label="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AddCard onAdd={(title) => add(col.key, title)} />
          </div>
        ))}
      </div>
    </main>
  );
}

function AddCard({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (!v) return;
        onAdd(v);
        setValue("");
      }}
      className="mt-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="+ Add a task"
        className="input !py-2 text-sm"
      />
    </form>
  );
}
