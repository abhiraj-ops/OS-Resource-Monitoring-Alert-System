import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ResourceChart from "../components/ResourceChart.jsx";
import ProcessTable from "../components/ProcessTable.jsx";
import AlertPanel from "../components/AlertPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";
import { Download, Search, MoreHorizontal } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

const demoMetrics = [
  { name: "CPU", value: "42%", detail: "System load nominal", status: "normal" },
  { name: "RAM", value: "6.4 GB", detail: "of 16 GB · 40% used", status: "normal" },
  { name: "Disk", value: "58%", detail: "512 GB SSD", status: "warning" },
  { name: "Network", value: "24 MB/s", detail: "Uplink stable", status: "normal" },
];
const demoChartData = [
  { time: "10:00", cpu: 32, ram: 48 }, { time: "10:05", cpu: 45, ram: 51 },
  { time: "10:10", cpu: 38, ram: 49 }, { time: "10:15", cpu: 62, ram: 56 },
  { time: "10:20", cpu: 42, ram: 53 }, { time: "10:25", cpu: 70, ram: 61 },
  { time: "10:30", cpu: 55, ram: 58 },
];
const demoProcesses = [
  { id: "p-1", pid: 1840, process_name: "chrome.exe", cpu_percent: 12.4, memory_bytes: 1200000000, username: "user", captured_at: new Date().toISOString() },
  { id: "p-2", pid: 2316, process_name: "Code.exe", cpu_percent: 8.1, memory_bytes: 864000000, username: "user", captured_at: new Date().toISOString() },
  { id: "p-3", pid: 992, process_name: "System", cpu_percent: 3.2, memory_bytes: 420000000, username: "SYSTEM", captured_at: new Date().toISOString() },
  { id: "p-4", pid: 3148, process_name: "explorer.exe", cpu_percent: 1.7, memory_bytes: 188000000, username: "user", captured_at: new Date().toISOString() },
  { id: "p-5", pid: 4420, pid_label: "svchost.exe", process_name: "svchost.exe", cpu_percent: 2.5, memory_bytes: 310000000, username: "SYSTEM", captured_at: new Date().toISOString() },
];
const demoAlerts = [
  { id: "a-1", alert_type: "high_cpu_usage", severity: "warning", message: "CPU usage reached 78% on ubuntu-server-01", status: "active", triggered_at: new Date(Date.now() - 300000).toISOString(), system_id: "sys-001", aiGenerated: true },
  { id: "a-2", alert_type: "system_scan_completed", severity: "info", message: "Weekly system scan completed - no issues found", status: "resolved", triggered_at: new Date(Date.now() - 3600000).toISOString(), system_id: "sys-001", aiGenerated: false },
];

function formatBytes(bytes) {
  if (bytes == null) return "—";
  const value = Number(bytes);
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(0)} MB`;
  return `${(value / 1024).toFixed(0)} KB`;
}

function percent(part, total) {
  if (part == null || !total) return null;
  return Math.max(0, Math.min(100, Number(part) / Number(total) * 100));
}

function buildMetrics(metrics) {
  const latest = metrics[0];
  const previous = metrics[1];
  const ramPercent = percent(latest?.memory_used_bytes, latest?.memory_total_bytes);
  const diskPercent = percent(latest?.disk_used_bytes, latest?.disk_total_bytes);
  let networkRate = null;
  if (latest && previous) {
    const seconds = (new Date(latest.collected_at) - new Date(previous.collected_at)) / 1000;
    const bytes = Number(latest.network_received_bytes ?? 0) + Number(latest.network_sent_bytes ?? 0)
      - Number(previous.network_received_bytes ?? 0) - Number(previous.network_sent_bytes ?? 0);
    if (seconds > 0 && bytes >= 0) networkRate = bytes / seconds;
  }

  return [
    { name: "CPU", value: latest?.cpu_percent == null ? "—" : `${Number(latest.cpu_percent).toFixed(1)}%`, detail: latest ? "Latest sample" : "No samples yet", status: latest?.cpu_percent != null && latest.cpu_percent > 80 ? "critical" : latest?.cpu_percent != null && latest.cpu_percent > 60 ? "warning" : "normal" },
    { name: "RAM", value: latest ? formatBytes(latest.memory_used_bytes) : "—", detail: ramPercent == null ? "Waiting for memory data" : `${ramPercent.toFixed(0)}% of ${formatBytes(latest.memory_total_bytes)}`, status: ramPercent != null && ramPercent > 80 ? "critical" : ramPercent != null && ramPercent > 60 ? "warning" : "normal" },
    { name: "Disk", value: diskPercent == null ? "—" : `${diskPercent.toFixed(0)}%`, detail: latest ? `${formatBytes(latest.disk_used_bytes)} of ${formatBytes(latest.disk_total_bytes)}` : "No samples yet", status: diskPercent != null && diskPercent > 80 ? "critical" : diskPercent != null && diskPercent > 60 ? "warning" : "normal" },
    { name: "Network", value: networkRate == null ? "—" : `${(networkRate / 1024 ** 2).toFixed(2)} MB/s`, detail: networkRate == null ? "Awaiting two byte-counter samples" : "Estimated from counter delta", status: "normal" },
  ];
}

function latestProcesses(processes) {
  const seen = new Set();
  return processes.filter(process => {
    if (seen.has(process.pid)) return false;
    seen.add(process.pid);
    return true;
  });
}

function chartPoints(metrics) {
  return [...metrics].reverse().map(metric => ({
    time: new Date(metric.collected_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: metric.cpu_percent == null ? null : Number(metric.cpu_percent),
    ram: percent(metric.memory_used_bytes, metric.memory_total_bytes),
  }));
}

export default function Dashboard({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const { theme, cycleTheme } = useTheme();
  const { liveEnabled, toggleLive } = data;
  const metrics = buildMetrics(data.metrics);
  const [processes, setProcesses] = useState(() => latestProcesses(data.processes));
  const alerts = data.alerts;
  const chartData = chartPoints(data.metrics);
  const selectedSystem = data.systems.find(system => system.id === data.selectedSystemId);

  // Re-sync local process state when the system or underlying data changes
  useEffect(() => {
    setProcesses(latestProcesses(data.processes));
  }, [data.processes, data.selectedSystemId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = searchQuery === "" || a.alert_type.toLowerCase().includes(searchQuery.toLowerCase()) || a.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const hasData = data.systems.length > 0;

  async function handleSignOut() {
    await supabase?.auth.signOut();
  }

  function exportCSV() {
    const rows = [
      ["Metric", "Value", "Detail", "Status"],
      ...metrics.map(m => [m.name, m.value, m.detail, m.status]),
      [],
      ["Process", "PID", "CPU", "Memory"],
      ...processes.map(p => [p.process_name, p.pid, (p.cpu_percent ?? 0).toFixed(1) + "%", formatMemory(p.memory_bytes)]),
    ];
    const csv = rows.map(r => r.map(c => /[",\n\r]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "os-monitor-report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleProcessesChange = useCallback((next) => {
    setProcesses(next);
    // Persist to localStorage so the edit survives refresh
    try {
      const key = `osm_processes`;
      const existing = localStorage.getItem(key);
      const map = existing ? JSON.parse(existing) : {};
      map[data.selectedSystemId] = next;
      localStorage.setItem(key, JSON.stringify(map));
    } catch {}
  }, [data.selectedSystemId]);

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading data…" : null)} />
      <Sidebar />
      <section className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]" id="main">
        <Navbar userEmail={session?.user?.email} realtimeStatus={data.realtimeStatus} onSignOut={session ? handleSignOut : null} />

        {!hasData && selectedSystem === "" && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#25334b] bg-[#111b2c] px-4 py-3">
            <span className="status-dot amber" /> No systems connected. Install the monitoring agent to begin.
          </div>
        )}

        {!hasData && selectedSystem !== "" && (
          <div className="mb-4 rounded-xl border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading data…" />
          </div>
        )}

        {data.error && (
          <ErrorMessage message={data.error} onDismiss={() => data.setSelectedSystemId("")} />
        )}

        {!hasData && !data.loading && !data.error && (
          <EmptyState
            title="No systems linked yet"
            message="No monitored systems are connected to this account. Install the Python monitoring agent on your Ubuntu machine and register it to begin monitoring CPU, memory, disk, and network usage."
            actionLabel="View Setup Guide"
            icon="🖥"
          />
        )}

        {hasData && (
          <>
            {/* Header controls */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="system-select" className="text-xs font-semibold text-[#94a3b8]">System</label>
                <select
                  id="system-select"
                  value={data.selectedSystemId}
                  onChange={(event) => data.setSelectedSystemId(event.target.value)}
                  className="rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                  aria-label="Select monitored system"
                >
                  {data.systems.map(system => (
                    <option key={system.id} value={system.id}>{system.display_name || system.hostname}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="text"
                    placeholder="Search alerts…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                  />
                </div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={toggleLive}
                  className={`btn btn-ghost flex items-center gap-2 ${liveEnabled ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40" : ""}`}
                  title={liveEnabled ? "Stop live simulation" : "Start live simulation"}
                  aria-pressed={liveEnabled}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${liveEnabled ? "bg-[#10b981] animate-pulse" : "bg-[#334155]"}`} aria-hidden="true" />
                  {liveEnabled ? "Live: ON" : "Live: OFF"}
                </button>
                <button
                  onClick={exportCSV}
                  className="btn btn-ghost"
                  title="Export CSV report"
                >
                  <Download className="h-4 w-4" /> Export
                </button>
                <button
                  className="btn btn-ghost"
                  title="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Metrics grid */}
            <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="System metrics">
              {metrics.map(metric => (
                <MetricCard key={metric.name} {...metric} />
              ))}
            </section>

            {/* Chart + Alerts */}
            <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_320px]">
              <ResourceChart data={chartData} />
              <AlertPanel alerts={filteredAlerts} />
            </section>

            {/* Processes */}
            {!data.processes.length === 0 && (
              <EmptyState
                title="No process samples"
                message="No process data is available for this system yet."
                icon="⚙"
                actionLabel="Add Process"
                action={() => setProcesses((prev) => [
                  ...prev,
                  {
                    id: `p-${Date.now()}`,
                    process_name: "new-process",
                    pid: prev.length + 1,
                    cpu_percent: 0,
                    memory_bytes: 0,
                    username: "demo-user",
                    captured_at: new Date().toISOString(),
                  },
                ])}
              />
            )}
            {data.processes.length > 0 && (
              <ProcessTable
                processes={processes}
                readOnly={false}
                onProcessesChange={handleProcessesChange}
              />
            )}
          </>
        )}

        <footer className="flex justify-between gap-3 px-0.5 text-[10px] text-[#64748b] max-[520px]:flex-col">
          <span>OS Monitor</span>
          <span className="text-[#5f6e85]">{hasData ? "Local monitoring agent · Row Level Security enforced" : "Not connected to monitoring agent"}</span>
        </footer>
      </section>
    </main>
  );
}

