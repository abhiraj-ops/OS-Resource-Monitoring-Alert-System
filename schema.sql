-- ParindeOS database foundation
-- Run this in the Supabase SQL Editor. Safe to re-run for the objects defined here.

create extension if not exists pgcrypto;

do $$ begin
  create type public.system_status as enum ('online', 'offline', 'unknown');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.alert_severity as enum ('info', 'warning', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.alert_status as enum ('active', 'acknowledged', 'resolved');
exception when duplicate_object then null; end $$;

create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hostname text not null,
  display_name text,
  operating_system text,
  os_version text,
  agent_version text,
  status public.system_status not null default 'unknown',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint systems_hostname_not_blank check (length(trim(hostname)) > 0)
);

create table if not exists public.metrics (
  id bigint generated always as identity primary key,
  system_id uuid not null references public.systems(id) on delete cascade,
  cpu_percent numeric(5,2),
  memory_used_bytes bigint,
  memory_total_bytes bigint,
  disk_used_bytes bigint,
  disk_total_bytes bigint,
  network_received_bytes bigint,
  network_sent_bytes bigint,
  collected_at timestamptz not null default now(),
  constraint metrics_cpu_range check (cpu_percent is null or cpu_percent between 0 and 100),
  constraint metrics_memory_nonnegative check (
    (memory_used_bytes is null or memory_used_bytes >= 0) and
    (memory_total_bytes is null or memory_total_bytes >= 0)
  ),
  constraint metrics_disk_nonnegative check (
    (disk_used_bytes is null or disk_used_bytes >= 0) and
    (disk_total_bytes is null or disk_total_bytes >= 0)
  ),
  constraint metrics_network_nonnegative check (
    (network_received_bytes is null or network_received_bytes >= 0) and
    (network_sent_bytes is null or network_sent_bytes >= 0)
  )
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  alert_type text not null,
  severity public.alert_severity not null default 'warning',
  message text not null,
  status public.alert_status not null default 'active',
  details jsonb not null default '{}'::jsonb,
  triggered_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint alerts_type_not_blank check (length(trim(alert_type)) > 0),
  constraint alerts_message_not_blank check (length(trim(message)) > 0)
);

create table if not exists public.processes (
  id bigint generated always as identity primary key,
  system_id uuid not null references public.systems(id) on delete cascade,
  pid bigint not null,
  process_name text not null,
  cpu_percent numeric(5,2),
  memory_bytes bigint,
  username text,
  captured_at timestamptz not null default now(),
  constraint processes_pid_nonnegative check (pid >= 0),
  constraint processes_cpu_range check (cpu_percent is null or cpu_percent between 0 and 100),
  constraint processes_memory_nonnegative check (memory_bytes is null or memory_bytes >= 0),
  constraint processes_name_not_blank check (length(trim(process_name)) > 0)
);

-- Useful indexes for dashboard queries and time-series retrieval.
create index if not exists idx_systems_user_id on public.systems(user_id);
create index if not exists idx_systems_status on public.systems(status);
create index if not exists idx_metrics_system_collected on public.metrics(system_id, collected_at desc);
create index if not exists idx_alerts_system_triggered on public.alerts(system_id, triggered_at desc);
create index if not exists idx_alerts_status_severity on public.alerts(status, severity);
create index if not exists idx_processes_system_captured on public.processes(system_id, captured_at desc);
create index if not exists idx_processes_system_pid_captured on public.processes(system_id, pid, captured_at desc);

-- Keep updated_at current when a system record changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_systems_updated_at on public.systems;
create trigger trg_systems_updated_at
before update on public.systems
for each row execute function public.set_updated_at();

-- Enable RLS on every user-facing table. Policies are defined in policies.sql.
alter table public.systems enable row level security;
alter table public.metrics enable row level security;
alter table public.alerts enable row level security;
alter table public.processes enable row level security;

-- Realtime: add tables only if they are not already members of the publication.
do $$
declare
  tbl text;
begin
  foreach tbl in array array['systems', 'metrics', 'alerts', 'processes'] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
exception
  when undefined_object then
    raise notice 'supabase_realtime publication not found; enable Realtime in Supabase before adding tables.';
end $$;
