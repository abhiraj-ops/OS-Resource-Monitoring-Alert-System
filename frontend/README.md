# ParindeOS Dashboard

React + Vite frontend for the ParindeOS resource monitor. The dashboard stays in clearly labeled demo mode until Supabase configuration is supplied.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite.

## Connect to Supabase

1. Copy `.env.example` to `.env.local` in this `frontend` directory.
2. Set `VITE_SUPABASE_URL` to the project URL, without `/rest/v1/` (for this project: `https://frjczezgdxxkgftkovgo.supabase.co`).
3. Set `VITE_SUPABASE_PUBLISHABLE_KEY` to the project's publishable/anon key.
4. Restart Vite after changing environment variables.
5. Sign in with the Supabase test user's email and password. Ask the backend developer for those credentials through the team's secure channel.

`.env.local` is ignored by Git. Never put a service-role or secret key in a `VITE_*` variable or browser code. The frontend uses the publishable key with the signed-in user's session; Row Level Security enforces access.

## Live dashboard data

After sign-in, the frontend reads the authenticated user's systems and then queries `metrics`, `alerts`, and `processes` for the selected `system_id`. It listens for Postgres Changes on those tables and refreshes the dashboard after changes. The systems list also refreshes from its Realtime channel.

CPU comes from `metrics.cpu_percent`; RAM and disk percentages are derived from their used and total byte columns. Network speed is estimated from the difference between the two newest received/sent byte counters. Process rows show the newest sample for each PID. Values remain blank when the database has not received a sample yet.

If no project variables are present, the dashboard displays sample data marked as demo. If only one variable is present, the app displays a configuration notice instead of attempting a partial connection.
