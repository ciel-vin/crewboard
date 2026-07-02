"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { COLUMNS, type Status, type Task } from "@/lib/types";
import { Plus, X, Bolt } from "./Icons";

const COLOR: Record<Status, string> = {
  todo: "var(--todo)",
  doing: "var(--doing)",
  done: "var(--done)",
};

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
  const reduce = useReducedMotion();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);
  const [live, setLive] = useState(false);

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
            return prev.some((t) => t.id === row.id)
              ? prev.map((t) => (t.id === row.id ? row : t))
              : [...prev, row];
          });
        }
      )
      .subscribe((s) => setLive(s === "SUBSCRIBED"));
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId]);

  const colTasks = (s: Status) =>
    tasks.filter((t) => t.status === s).sort((a, b) => a.position - b.position);

  async function move(id: string, to: Status) {
    const t = tasks.find((x) => x.id === id);
    if (!t || t.status === to) return;
    const inTarget = tasks.filter((x) => x.status === to);
    const pos = (inTarget.length ? Math.max(...inTarget.map((x) => x.position)) : 0) + 1000;
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, status: to, position: pos } : x)));
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
    if (data) setTasks((prev) => (prev.some((t) => t.id === data.id) ? prev : [...prev, data as Task]));
  }

  async function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  return (
    <main className="mx-auto max-w-shell px-6 py-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--faint)]">Project</div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{projectName}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Drag cards between columns — changes sync live across every session.
          </p>
        </div>
        <span className="chip" title="Supabase Realtime connection">
          <span className="relative flex h-2 w-2">
            {live && !reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{ background: "var(--done)" }} />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: live ? "var(--done)" : "var(--doing)" }} />
          </span>
          <Bolt className="h-3.5 w-3.5" style={{ color: "var(--brand)" }} />
          {live ? "Realtime connected" : "Connecting…"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = colTasks(col.key);
          const isOver = over === col.key;
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); if (over !== col.key) setOver(col.key); }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver((o) => (o === col.key ? null : o));
              }}
              onDrop={() => { if (dragId) move(dragId, col.key); setDragId(null); setOver(null); }}
              className="rounded-2xl border p-3 transition-colors"
              style={{
                background: isOver ? "var(--brand-soft)" : "#f7f7f9",
                borderColor: isOver ? "var(--brand)" : "var(--line)",
              }}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOR[col.key] }} />
                <span className="text-[13px] font-bold">{col.label}</span>
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[var(--muted)] shadow-[var(--shadow-sm)] tnum">
                  {items.length}
                </span>
              </div>

              <motion.div layout className="min-h-[8px] space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: dragId === t.id ? 0.4 : 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 34 }}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => { setDragId(null); setOver(null); }}
                      className="group card cursor-grab p-3 active:cursor-grabbing hover:border-[var(--line-2)]"
                      style={{ boxShadow: "var(--shadow-sm)" }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13.5px] font-semibold leading-snug">{t.title}</span>
                        <button
                          onClick={() => remove(t.id)}
                          aria-label="Delete task"
                          className="shrink-0 rounded-md p-0.5 text-[var(--faint)] opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-[var(--danger)]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#8b8bf5] to-[var(--brand)] text-[9px] font-bold text-white">
                          {t.assignee ? "A" : "·"}
                        </span>
                        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{ color: COLOR[col.key], background: "color-mix(in srgb, " + COLOR[col.key] + " 12%, transparent)" }}>
                          {col.label}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[var(--line-2)] py-6 text-center text-xs font-semibold text-[var(--faint)]">
                    Drop tasks here
                  </div>
                )}
              </motion.div>

              <AddCard onAdd={(title) => add(col.key, title)} />
            </div>
          );
        })}
      </div>
    </main>
  );
}

function AddCard({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-semibold text-[var(--faint)] transition hover:bg-white hover:text-[var(--muted)]"
      >
        <Plus className="h-4 w-4" /> Add a task
      </button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onAdd(v);
        setValue("");
      }}
      className="mt-2"
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => { if (!value.trim()) setOpen(false); }}
        placeholder="Task title, then Enter"
        className="input !py-2 text-[13px]"
      />
    </form>
  );
}
