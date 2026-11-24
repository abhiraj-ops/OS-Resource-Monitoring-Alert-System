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

const demoMetrics = [
  { name: "CPU", value: "0%", detail: "No data" },
  { name: "RAM", value: "0 GB", detail: "No data" },
  { name: "Disk", value: "0%", detail: "No data" },
  { name: "Network", value: "0 MB/s", detail: "No data" },
];
const demoChartData = [
  { time: "00:00", cpu: 0, ram: 0 },
];
const demoProcesses = [];
const demoAlerts = [];

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
    { name: "CPU", value: latest?.cpu_percent == null ? "—" : `${Number(latest.cpu_percent).toFixed(1)}%`, detail: latest ? "Latest sample" : "No samples yet" },
    { name: "RAM", value: latest ? formatBytes(latest.memory_used_bytes) : "—", detail: ramPercent == null ? "Waiting for memory data" : `${ramPercent.toFixed(0)}% of ${formatBytes(latest.memory_total_bytes)}` },
    { name: "Disk", value: diskPercent == null ? "—" : `${diskPercent.toFixed(0)}%`, detail: latest ? `${formatBytes(latest.disk_used_bytes)} of ${formatBytes(latest.disk_total_bytes)}` : "No samples yet" },
    { name: "Network", value: networkRate == null ? "—" : `${(networkRate / 1024 ** 2).toFixed(2)} MB/s`, detail: networkRate == null ? "Awaiting two byte-counter samples" : "Estimated from counter delta" },
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
  const metrics = buildMetrics(data.metrics);
  const processes = latestProcesses(data.processes);
  const alerts = data.alerts;
  const chartData = chartPoints(data.metrics);
  const selectedSystem = data.systems.find(system => system.id === data.selectedSystemId);

  async function handleSignOut() {
    await supabase?.auth.signOut();
  }

  const hasData = data.systems.length > 0;

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading data…" : null)} />
      <Sidebar />
      <section className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        <Navbar userEmail={session?.user?.email} realtimeStatus={data.realtimeStatus} onSignOut={session ? handleSignOut : null} />

        {!hasData && selectedSystem === "" && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#25334b] bg-[#111b2c] px-4 py-3">
            <span className="status-dot amber" /> No systems connected. Install the monitoring agent to begin.
          </div>
        )}

        {!hasData && selectedSystem !== "" && (
          <div className="mb-4 rounded-lg border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading data from Supabase…" />
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
            <section className="mb-4 grid grid-cols-4 gap-3.5 max-[1000px]:grid-cols-2 max-[380px]:grid-cols-1" aria-label="System metrics">
              {metrics.map(metric => (
                <MetricCard key={metric.name} {...metric} />
              ))}
            </section>

            <section className="mb-4 grid grid-cols-[minmax(0,1.8fr)_minmax(270px,1fr)] gap-4 max-[1000px]:grid-cols-[minmax(0,1.5fr)_minmax(230px,1fr)] max-[720px]:grid-cols-1">
              <ResourceChart data={chartData} />
              <AlertPanel alerts={alerts} />
            </section>

            {data.processes.length === 0 && (
              <EmptyState
                title="No process samples"
                message="No process data is available for this system yet."
                icon="⚙"
              />
            )}
            {data.processes.length > 0 && (
              <ProcessTable processes={processes} />
            )}
          </>
        )}

        <footer className="flex justify-between gap-3 px-0.5 text-[10px] text-[#738199] max-[520px]:flex-col">
          ParindeOS Dashboard
          <span className="text-[#5f6e85]">{hasData ? "Supabase · Access enforced with Row Level Security" : "Not connected to Supabase"}</span>
        </footer>
      </section>
    </main>
  );
}
