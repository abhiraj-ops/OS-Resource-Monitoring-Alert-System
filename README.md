# ParindeOS — Supabase Database Setup

## Scope

This folder provides the PostgreSQL foundation for the ParindeOS monitoring dashboard:

- `systems`: registered machines and ownership
- `metrics`: time-series CPU, memory, disk and network measurements
- `alerts`: severity, message, status and optional JSON details
- `processes`: process snapshots (PID, name, CPU and memory)

The schema supports multiple monitored machines per Supabase Auth user. All telemetry rows belong to a system through `system_id`.

## Setup

1. Create a Supabase project at https://supabase.com/dashboard.
2. Open **SQL Editor** in the project dashboard.
3. Run `schema.sql`.
4. Run `policies.sql`.
5. In **Project Settings → API**, copy the Project URL and anon key into your local environment.
6. Keep the service-role key server-side only. Never commit real credentials or place the service-role key in a Vite `VITE_*` variable.
7. Sign up at least one test user if you want to use `seed_demo.sql`, then run that optional script.

## Environment

Copy the root `.env.example` to the environment file used by the trusted backend/agent. Fill in the values from Supabase Project Settings → API.

- `SUPABASE_URL`: project URL
- `SUPABASE_ANON_KEY`: public anon key; use with user authentication and RLS
- `SUPABASE_SERVICE_ROLE_KEY`: privileged key for trusted server-side ingestion only

Do not commit `.env` files.

## Data model

- One `auth.users` user can own many `systems`.
- One `systems` row can have many `metrics`, `alerts` and `processes` rows.
- Deleting a system cascades to its telemetry/history.
- `metrics` and `processes` are append-only snapshots in this initial foundation.
- Timestamps use `timestamptz` and default to the database time.

## Security / RLS

RLS is enabled on all four tables. Authenticated users can read their own systems and related records only. They can register, update and delete their own system records. Users can insert their own metrics, processes and alerts; alerts can also be updated by their owner.

The `owns_system(uuid)` helper checks ownership through `systems.user_id`. No anonymous access policies are created.

**Important ingestion decision:** the monitoring agent's authentication and ingestion API have not yet been specified. Do not let an unauthenticated machine write directly using the anon key. For production, send telemetry through a trusted backend endpoint that validates the machine/agent identity and uses the service-role key on the server. Never ship that key to the browser or commit it to Git.

## Realtime

`schema.sql` attempts to add all four tables to the `supabase_realtime` publication if they are not already present. In the Supabase dashboard, verify Database → Replication / Publications and enable the required tables if the project setup does not permit the SQL change.

Subscribe only to the tables and rows the signed-in user is authorized to view. RLS remains the access-control boundary.

## Suggested dashboard queries

- Latest metrics: filter `metrics` by `system_id`, order by `collected_at` descending, and limit the result.
- Recent alerts: filter by `system_id`, order by `triggered_at` descending.
- Current processes: select the latest snapshot for the selected system; a later agent contract may add a snapshot/batch identifier to make this exact.
- Systems list: filter by the authenticated user's `user_id` (RLS also enforces ownership).

## Validation checklist

- [ ] Run `schema.sql` without errors.
- [ ] Run `policies.sql` without errors.
- [ ] Confirm all four tables exist under Database → Tables.
- [ ] Confirm RLS is enabled for all four tables.
- [ ] Create two test users and verify neither can read the other's systems or telemetry.
- [ ] Run `seed_demo.sql` after creating a test user.
- [ ] Confirm Realtime publication includes the four tables.
- [ ] Confirm no real credentials are committed.

## Open integration decision

The team still needs to define how the monitoring agent sends metrics (direct authenticated client vs. backend ingestion API), its authentication method, and the expected collection interval. The current schema intentionally does not invent an agent-token design.
