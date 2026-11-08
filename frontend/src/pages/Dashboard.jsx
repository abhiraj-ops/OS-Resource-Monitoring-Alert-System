import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ResourceChart from "../components/ResourceChart.jsx";
import ProcessTable from "../components/ProcessTable.jsx";
import AlertPanel from "../components/AlertPanel.jsx";
import useDashboardData from "../hooks/useDashboardData.js";

const demoMetrics = [
  { name: "CPU", value: "42%", detail: "Demo data" },
  { name: "RAM", value: "6.4 GB", detail: "of 16 GB · Demo data" },
  { name: "Disk", value: "58%", detail: "Demo data" },
  { name: "Network", value: "24 MB/s", detail: "Demo data" },
];
const demoChartData = [
  { time: "10:00", cpu: 32, ram: 48 }, { time: "10:05", cpu: 45, ram: 51 },
  { time: "10:10", cpu: 38, ram: 49 }, { time: "10:15", cpu: 62, ram: 56 },
  { time: "10:20", cpu: 42, ram: 53 }, { time: "10:25", cpu: 70, ram: 61 },
  { time: "10:30", cpu: 55, ram: 58 },
];
const demoProcesses = [
  { id: "demo-1", pid: 1840, process_name: "chrome.exe", cpu_percent: 12.4, memory_bytes: 1200000000 },
  { id: "demo-2", pid: 2316, process_name: "Code.exe", cpu_percent: 8.1, memory_bytes: 864000000 },
  { id: "demo-3", pid: 992, process_name: "System", cpu_percent: 3.2, memory_bytes: 420000000 },
  { id: "demo-4", pid: 3148, process_name: "explorer.exe", cpu_percent: 1.7, memory_bytes: 188000000 },
];
const demoAlerts = [
  { id: "demo-alert-1", alert_type: "CPU usage elevated", severity: "warning", message: "Demo alert · CPU reached 78%", status: "active", triggered_at: null },
  { id: "demo-alert-2", alert_type: "System scan completed", severity: "info", message: "Demo alert · No issues found", status: "resolved", triggered_at: null },
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

function buildMetrics(metrics, demoMode) {
  if (demoMode) return demoMetrics;
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
    { name: "CPU", value: latest?.cpu_percent == null ? "—" : `${Number(latest.cpu_percent).toFixed(1)}%`, detail: latest ? "Latest sample" : "No samples yet" },
    { name: "RAM", value: latest ? formatBytes(latest.memory_used_bytes) : "—", detail: ramPercent == null ? "Waiting for memory data" : `${ramPercent.toFixed(0)}% of ${formatBytes(latest.memory_total_bytes)}` },
    { name: "Disk", value: diskPercent == null ? "—" : `${diskPercent.toFixed(0)}%`, detail: latest ? `${formatBytes(latest.disk_used_bytes)} of ${formatBytes(latest.disk_total_bytes)}` : "No samples yet" },
    { name: "Network", value: networkRate == null ? "—" : `${(networkRate / 1024 ** 2).toFixed(2)} MB/s`, detail: networkRate == null ? "Awaiting two byte-counter samples" : "Estimated from counter delta" },
  ];
}

function latestProcesses(processes, demoMode) {
  if (demoMode) return demoProcesses;
  const seen = new Set();
  return processes.filter(process => {
    if (seen.has(process.pid)) return false;
    seen.add(process.pid);
    return true;
  });
}

function chartPoints(metrics, demoMode) {
  if (demoMode) return demoChartData;
  return [...metrics].reverse().map(metric => ({
    time: new Date(metric.collected_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: metric.cpu_percent == null ? null : Number(metric.cpu_percent),
    ram: percent(metric.memory_used_bytes, metric.memory_total_bytes),
  }));
}

export default function Dashboard({ supabase = null, session = null, demoMode = false }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const metrics = buildMetrics(data.metrics, demoMode);
  const processes = latestProcesses(data.processes, demoMode);
  const alerts = demoMode ? demoAlerts : data.alerts;
  const chartData = chartPoints(data.metrics, demoMode);
  const selectedSystem = data.systems.find(system => system.id === data.selectedSystemId);

  async function handleSignOut() {
    await supabase?.auth.signOut();
  }

  return <main className="flex min-h-screen max-[720px]:block">
    <Sidebar />
    <section className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
      <Navbar userEmail={session?.user?.email} realtimeStatus={demoMode ? "demo" : data.realtimeStatus} onSignOut={session ? handleSignOut : null} />
      {!demoMode && selectedSystem && <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#25334b] bg-[#111b2c] px-4 py-3">
        <label htmlFor="system-select" className="text-xs font-semibold text-[#9eacc3]">Monitored system</label>
        <select id="system-select" value={data.selectedSystemId} onChange={event => data.setSelectedSystemId(event.target.value)} className="min-w-56 rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]">
          {data.systems.map(system => <option key={system.id} value={system.id}>{system.display_name || system.hostname}</option>)}
        </select>
        <span className="text-xs text-[#8d9ab1]">{selectedSystem.operating_system || "Operating system unknown"} · {selectedSystem.status}</span>
      </div>}
      {demoMode ? <div className="mb-[18px] flex flex-wrap items-center gap-2.5 rounded-[10px] border border-[#58482a] bg-[#282316] px-4 py-3 text-[13px] text-[#eacb82] max-[520px]:flex-col max-[520px]:items-start"><strong className="text-[#ffd77e]">Demo preview</strong><span>Showing sample metrics. Live system data is not connected.</span></div> : data.loading && <p className="mb-4 rounded-lg border border-[#25334b] bg-[#111b2c] p-3 text-xs text-[#9eacc3]">Loading data from Supabase…</p>}
      {!demoMode && data.error && <p role="alert" className="mb-4 rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-200">Could not load dashboard data: {data.error}</p>}
      {!demoMode && !data.loading && !data.error && !data.systems.length && <p className="mb-4 rounded-lg border border-[#58482a] bg-[#282316] p-4 text-sm text-[#eacb82]">No systems are linked to this account yet. Ask the backend developer to confirm that the demo system belongs to your signed-in Supabase user.</p>}
      <section className="mb-4 grid grid-cols-4 gap-3.5 max-[1000px]:grid-cols-2 max-[380px]:grid-cols-1" aria-label="System metrics">
        {metrics.map(metric => <MetricCard key={metric.name} {...metric} />)}
      </section>
      <section className="mb-4 grid grid-cols-[minmax(0,1.8fr)_minmax(270px,1fr)] gap-4 max-[1000px]:grid-cols-[minmax(0,1.5fr)_minmax(230px,1fr)] max-[720px]:grid-cols-1">
        <ResourceChart data={chartData} demoMode={demoMode} />
        <AlertPanel alerts={alerts} demoMode={demoMode} />
      </section>
      <ProcessTable processes={processes} demoMode={demoMode} />
      <footer className="flex justify-between gap-3 px-0.5 text-[10px] text-[#738199] max-[520px]:flex-col">ParindeOS Dashboard <span className="text-[#5f6e85]">{demoMode ? "Demo interface · Not connected to live metrics" : "Supabase · Access enforced with Row Level Security"}</span></footer>
    </section>
  </main>;
}
