-- ParindeOS Row Level Security policies
-- Run after schema.sql. Users can access data only for systems they own.
-- Service-role/server ingestion bypasses RLS; never expose the service-role key in a browser.

-- Helper predicate keeps ownership checks consistent across child tables.
create or replace function public.owns_system(target_system_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.systems s
    where s.id = target_system_id
      and s.user_id = (select auth.uid())
  );
$$;

revoke all on function public.owns_system(uuid) from public;
grant execute on function public.owns_system(uuid) to authenticated;

drop policy if exists "Users can view their systems" on public.systems;
create policy "Users can view their systems"
on public.systems for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can register their systems" on public.systems;
create policy "Users can register their systems"
on public.systems for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their systems" on public.systems;
create policy "Users can update their systems"
on public.systems for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Users can delete their systems" on public.systems;
create policy "Users can delete their systems"
on public.systems for delete to authenticated
using (user_id = (select auth.uid()));

-- Child records inherit access from ownership of their parent system.
drop policy if exists "Users can view metrics for their systems" on public.metrics;
create policy "Users can view metrics for their systems"
on public.metrics for select to authenticated
using (public.owns_system(system_id));

drop policy if exists "Users can insert metrics for their systems" on public.metrics;
create policy "Users can insert metrics for their systems"
on public.metrics for insert to authenticated
with check (public.owns_system(system_id));

drop policy if exists "Users can view alerts for their systems" on public.alerts;
create policy "Users can view alerts for their systems"
on public.alerts for select to authenticated
using (public.owns_system(system_id));

drop policy if exists "Users can insert alerts for their systems" on public.alerts;
create policy "Users can insert alerts for their systems"
on public.alerts for insert to authenticated
with check (public.owns_system(system_id));

drop policy if exists "Users can update alerts for their systems" on public.alerts;
create policy "Users can update alerts for their systems"
on public.alerts for update to authenticated
using (public.owns_system(system_id))
with check (public.owns_system(system_id));

drop policy if exists "Users can view processes for their systems" on public.processes;
create policy "Users can view processes for their systems"
on public.processes for select to authenticated
using (public.owns_system(system_id));

drop policy if exists "Users can insert processes for their systems" on public.processes;
create policy "Users can insert processes for their systems"
on public.processes for insert to authenticated
with check (public.owns_system(system_id));

-- No anonymous policies are created. Add a service-side ingestion endpoint or
-- authenticated agent flow before allowing machines to write telemetry.
