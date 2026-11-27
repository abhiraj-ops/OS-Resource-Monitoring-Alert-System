import { useState, useCallback, useEffect } from "react";
import { captureError } from "../services/errorTracking.js";
import { track } from "../services/analytics.js";

// Local (non-Supabase) dashboard data persisted in localStorage.
// Runs fully without any Supabase configuration.

const SYSTEMS_KEY = "osm_systems";
const METRICS_KEY = "osm_metrics";
const ALERTS_KEY = "osm_alerts";
const PROCESSES_KEY = "osm_processes";

const now = () => new Date().toISOString();

const demoSystem = {
  id: "sys-001",
  user_id: "demo-user-001",
  hostname: "ubuntu-server-01",
  display_name: "Production Web Server",
  operating_system: "Ubuntu",
  os_version: "22.04 LTS",
  agent_version: "1.0.0",
  status: "online",
  last_seen_at: now(),
  created_at: now(),
  updated_at: now(),
};

const seedMetrics = (systemId) => {
  const base = Date.now();
  return Array.from({ length: 30 }, (_, i) => {
    const t = base - (29 - i) * 60 * 1000;
    const cpu = 20 + Math.sin(i / 5) * 25 + Math.random() * 10;
    const ram = 45 + Math.cos(i / 7) * 20 + Math.random() * 10;
    return {
      id: `m-${i}`,
      system_id: systemId,
      cpu_percent: Math.round(Math.max(0, Math.min(100, cpu)) * 100) / 100,
      memory_used_bytes: Math.floor((ram / 100) * 17179869184),
      memory_total_bytes: 17179869184,
      disk_used_bytes: 128849018880,
      disk_total_bytes: 512110190592,
      network_received_bytes: 1200000 + i * 50000,
      network_sent_bytes: 480000 + i * 30000,
      collected_at: new Date(t).toISOString(),
    };
  });
};

const seedAlerts = (systemId) => [
  {
    id: "alert-1",
    system_id: systemId,
    alert_type: "high_cpu_usage",
    severity: "warning",
    message: "CPU usage reached 78% on ubuntu-server-01",
    status: "active",
    details: { cpu_percent: 78, threshold: 70 },
    triggered_at: new Date(Date.now() - 300000).toISOString(),
    acknowledged_at: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "alert-2",
    system_id: systemId,
    alert_type: "system_scan_completed",
    severity: "info",
    message: "Weekly system scan completed - no issues found",
    status: "resolved",
    details: { scan_type: "weekly", issues: 0 },
    triggered_at: new Date(Date.now() - 3600000).toISOString(),
    acknowledged_at: null,
    resolved_at: new Date(Date.now() - 3500000).toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

const seedProcesses = (systemId) => [
  { id: "p-1", system_id: systemId, pid: 1840, process_name: "chrome.exe", cpu_percent: 12.4, memory_bytes: 1200000000, username: "demo-user", captured_at: now() },
  { id: "p-2", system_id: systemId, pid: 2316, process_name: "Code.exe", cpu_percent: 8.1, memory_bytes: 864000000, username: "demo-user", captured_at: now() },
  { id: "p-3", system_id: systemId, pid: 992, process_name: "System", cpu_percent: 3.2, memory_bytes: 420000000, username: "demo-user", captured_at: now() },
  { id: "p-4", system_id: systemId, pid: 3148, process_name: "explorer.exe", cpu_percent: 1.7, memory_bytes: 188000000, username: "demo-user", captured_at: now() },
  { id: "p-5", system_id: systemId, pid: 4420, process_name: "svchost.exe", cpu_percent: 2.5, memory_bytes: 310000000, username: "SYSTEM", captured_at: now() },
];

function getLocal(key, def) {
  if (typeof localStorage === "undefined") return def;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch {
    return def;
  }
}

function setLocal(key, val) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function useDashboardData(supabase, userId) {
  const [systems, setSystems] = useState([]);
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [snapshot, setSnapshot] = useState({ metrics: [], alerts: [], processes: [] });
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState("online");

  // Initialize seed data on first load
  useEffect(() => {
    const existing = getLocal(SYSTEMS_KEY, []);
    if (!existing.length) {
      setLocal(SYSTEMS_KEY, [demoSystem]);
      setLocal(METRICS_KEY, { [demoSystem.id]: seedMetrics(demoSystem.id) });
      setLocal(ALERTS_KEY, { [demoSystem.id]: seedAlerts(demoSystem.id) });
      setLocal(PROCESSES_KEY, { [demoSystem.id]: seedProcesses(demoSystem.id) });
    }
  }, []);

  const loadSystems = useCallback(async () => {
    setLoadingSystems(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const data = getLocal(SYSTEMS_KEY, []);
      setSystems(data);
      if (!data.length) {
        setSnapshot({ metrics: [], alerts: [], processes: [] });
        setRealtimeStatus("waiting");
      }
      setSelectedSystemId((current) =>
        data.some((s) => s.id === current) ? current : data[0]?.id ?? ""
      );
      setRealtimeStatus("online");
    } catch (err) {
      captureError(err, { context: "dashboard:loadSystems" });
      setError("Unable to load systems.");
      setRealtimeStatus("offline");
    } finally {
      setLoadingSystems(false);
    }
  }, []);

  const refreshSnapshot = useCallback(async () => {
    if (!selectedSystemId) {
      setLoadingSnapshot(false);
      return;
    }
    setLoadingSnapshot(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const metrics = getLocal(METRICS_KEY, {})[selectedSystemId] ?? [];
      const alerts = getLocal(ALERTS_KEY, {})[selectedSystemId] ?? [];
      const processes = getLocal(PROCESSES_KEY, {})[selectedSystemId] ?? [];
      setSnapshot({ metrics, alerts, processes });
      track("dashboard_data_refreshed", { systemId: selectedSystemId });
      setRealtimeStatus("online");
    } catch (err) {
      captureError(err, { context: "dashboard:refreshSnapshot" });
      setError("Unable to load dashboard data.");
      setRealtimeStatus("offline");
    } finally {
      setLoadingSnapshot(false);
    }
  }, [selectedSystemId]);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  useEffect(() => {
    refreshSnapshot();
  }, [refreshSnapshot]);

  return {
    systems,
    selectedSystemId,
    setSelectedSystemId,
    ...snapshot,
    loading: loadingSystems || loadingSnapshot,
    error,
    realtimeStatus,
    loadSystems,
    refreshSnapshot,
  };
}

export default useDashboardData;
