export type Role = "owner" | "admin" | "member";
export type Status = "todo" | "doing" | "done";

export type Organization = { id: string; name: string; plan: "free" | "pro" };
export type Project = { id: string; org_id: string; name: string };
export type Task = {
  id: string;
  project_id: string;
  title: string;
  status: Status;
  assignee: string | null;
  position: number;
  created_at: string;
};

export const COLUMNS: { key: Status; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];
