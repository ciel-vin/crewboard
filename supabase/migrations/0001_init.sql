-- CrewBoard — schema + Row Level Security + Realtime + signup seeding.
-- Run this in the Supabase SQL editor (or `supabase db push`) after creating the project.

-- gen_random_uuid() lives in pgcrypto (preinstalled on Supabase).
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────  TABLES
create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  plan       text not null default 'free' check (plan in ('free','pro')),
  created_at timestamptz not null default now()
);

create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table if not exists projects (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title      text not null,
  status     text not null default 'todo' check (status in ('todo','doing','done')),
  assignee   uuid references auth.users(id) on delete set null,
  position   double precision not null default 1000,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references tasks(id) on delete cascade,
  author     uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────  HELPERS (SECURITY DEFINER bypasses RLS → no policy recursion)
create or replace function is_member(org uuid)
  returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from members m where m.org_id = org and m.user_id = auth.uid());
$$;

create or replace function is_admin(org uuid)
  returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from members m
    where m.org_id = org and m.user_id = auth.uid() and m.role in ('owner','admin'));
$$;

create or replace function org_of_project(p uuid)
  returns uuid language sql security definer stable set search_path = public as $$
  select org_id from projects where id = p;
$$;

create or replace function org_of_task(t uuid)
  returns uuid language sql security definer stable set search_path = public as $$
  select org_of_project(project_id) from tasks where id = t;
$$;

-- ─────────────────────────────────────────────  RLS
alter table organizations enable row level security;
alter table members       enable row level security;
alter table projects      enable row level security;
alter table tasks         enable row level security;
alter table comments      enable row level security;

-- organizations: see/manage only your own
drop policy if exists org_select on organizations;
create policy org_select on organizations for select using (is_member(id));
drop policy if exists org_update on organizations;
create policy org_update on organizations for update using (is_admin(id));

-- members: see co-members; admins manage
drop policy if exists mem_select on members;
create policy mem_select on members for select using (is_member(org_id));
drop policy if exists mem_write on members;
create policy mem_write  on members for all    using (is_admin(org_id)) with check (is_admin(org_id));

-- projects: read if member, write if admin
drop policy if exists proj_select on projects;
create policy proj_select on projects for select using (is_member(org_id));
drop policy if exists proj_write on projects;
create policy proj_write  on projects for all    using (is_admin(org_id)) with check (is_admin(org_id));

-- tasks: any member reads/writes tasks in their org's projects
drop policy if exists task_select on tasks;
create policy task_select on tasks for select using (is_member(org_of_project(project_id)));
drop policy if exists task_write on tasks;
create policy task_write  on tasks for all    using (is_member(org_of_project(project_id)))
  with check (is_member(org_of_project(project_id)));

-- comments: members of the task's org
drop policy if exists cmt_select on comments;
create policy cmt_select on comments for select using (is_member(org_of_task(task_id)));
drop policy if exists cmt_write on comments;
create policy cmt_write  on comments for all    using (is_member(org_of_task(task_id)))
  with check (author = auth.uid() and is_member(org_of_task(task_id)));

-- ─────────────────────────────────────────────  RPC: create an org + owner membership atomically
create or replace function create_org(org_name text)
  returns uuid language plpgsql security definer set search_path = public as $$
declare new_org uuid;
begin
  insert into organizations(name) values (org_name) returning id into new_org;
  insert into members(org_id, user_id, role) values (new_org, auth.uid(), 'owner');
  return new_org;
end; $$;

-- ─────────────────────────────────────────────  Seed a fresh workspace for every new signup
create or replace function handle_new_user()
  returns trigger language plpgsql security definer set search_path = public as $$
declare new_org uuid; new_proj uuid; uname text;
begin
  uname := coalesce(split_part(new.email, '@', 1), 'My');
  insert into organizations(name) values (uname || '''s Workspace') returning id into new_org;
  insert into members(org_id, user_id, role) values (new_org, new.id, 'owner');
  insert into projects(org_id, name) values (new_org, 'Getting Started') returning id into new_proj;
  insert into tasks(project_id, title, status, position, assignee) values
    (new_proj, 'Welcome to CrewBoard 👋 — drag me to Doing', 'todo', 1000, new.id),
    (new_proj, 'Open a second browser to see realtime sync', 'todo', 2000, null),
    (new_proj, 'Invite a teammate (role-based access)', 'doing', 1000, new.id),
    (new_proj, 'Row Level Security keeps this workspace private', 'done', 1000, new.id);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- ─────────────────────────────────────────────  Realtime for the board (guarded so re-runs don't error)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table tasks;
  end if;
end $$;
