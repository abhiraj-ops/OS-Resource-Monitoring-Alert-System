-- Optional demo data. Run only after at least one user has signed up.
-- Inserts one demo system plus representative metrics, processes and an alert.
do $$
declare
  demo_user_id uuid;
  demo_system_id uuid;
begin
  select id into demo_user_id
  from auth.users
  order by created_at
  limit 1;

  if demo_user_id is null then
    raise exception 'Create a Supabase Auth user before running seed_demo.sql';
  end if;

  insert into public.systems (
    user_id, hostname, display_name, operating_system, os_version,
    agent_version, status, last_seen_at
  )
  values (
    demo_user_id, 'demo-workstation', 'Demo Workstation',
    'Windows', '11', 'demo-0.1.0', 'online', now()
  )
  returning id into demo_system_id;

  insert into public.metrics (
    system_id, cpu_percent, memory_used_bytes, memory_total_bytes,
    disk_used_bytes, disk_total_bytes, network_received_bytes,
    network_sent_bytes, collected_at
  )
  values
    (demo_system_id, 24.5, 8589934592, 17179869184, 128849018880, 512110190592, 1200000, 480000, now() - interval '2 minutes'),
    (demo_system_id, 31.2, 9126805504, 17179869184, 128849018880, 512110190592, 1380000, 520000, now() - interval '1 minute'),
    (demo_system_id, 18.7, 8858370048, 17179869184, 128849018880, 512110190592, 1510000, 610000, now());

  insert into public.processes (system_id, pid, process_name, cpu_percent, memory_bytes, username)
  values
    (demo_system_id, 1024, 'chrome.exe', 8.4, 1200000000, 'demo-user'),
    (demo_system_id, 2048, 'Code.exe', 5.1, 850000000, 'demo-user'),
    (demo_system_id, 3072, 'explorer.exe', 1.2, 180000000, 'demo-user');

  insert into public.alerts (system_id, alert_type, severity, message, details)
  values (
    demo_system_id, 'high_memory_usage', 'warning',
    'Memory usage crossed the demo warning threshold.',
    '{"threshold_percent": 80, "sample_percent": 82}'::jsonb
  );
end $$;
