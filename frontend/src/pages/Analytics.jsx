import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../hooks/useTheme.jsx";
import ResourceChart from "../components/ResourceChart.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";
import MetricCard from "../components/MetricCard.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

const COLORS = {
  cpu: "#65e6bd",
  ram: "#7ca8ff",
  disk: "#f59e0b",
  network: "#a78bfa",
};

export default function Analytics({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const { theme } = useTheme();
  const [range, setRange] = useState("1h");

  const metrics = data.metrics || [];
  const latest = metrics[metrics.length - 1];
  const first = metrics[0];

  const chartData = metrics.map((m) => ({
    time: new Date(m.collected_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: m.cpu_percent == null ? null : Number(m.cpu_percent),
    ram: m.memory_used_bytes != null && m.memory_total_bytes
      ? Math.round((m.memory_used_bytes / m.memory_total_bytes) * 100)
      : null,
    disk: m.disk_used_bytes != null && m.disk_total_bytes
      ? Math.round((m.disk_used_bytes / m.disk_total_bytes) * 100)
      : null,
    network: m.network_received_bytes != null && m.network_sent_bytes != null
      ? Math.round(((m.network_received_bytes + m.network_sent_bytes) / 1024 / 1024) * 100) / 100
      : null,
  }));

  const cpuPercent = latest && latest.cpu_percent != null ? Number(latest.cpu_percent).toFixed(1) : "—";
  const ramPercent = latest && latest.memory_used_bytes != null && latest.memory_total_bytes
    ? Math.round((Number(latest.memory_used_bytes) / Number(latest.memory_total_bytes)) * 100)
    : null;
  const diskPercent = latest && latest.disk_used_bytes != null && latest.disk_total_bytes
    ? Math.round((Number(latest.disk_used_bytes) / Number(latest.disk_total_bytes)) * 100)
    : null;

  const cpuTrend = metrics.length > 1
    ? ((Number(metrics[metrics.length - 1].cpu_percent ?? 0) - Number(metrics[0].cpu_percent ?? 0)) / Math.max(Number(metrics[0].cpu_percent ?? 1), 1) * 100).toFixed(1)
    : "0";

  const handleRangeChange = useCallback((val) => setRange(val), []);

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading analytics…" : null)} />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / ANALYTICS</p>
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${data.realtimeStatus === "online" ? "" : "amber"}`} />
            {data.realtimeStatus === "online" ? "Live" : "Offline"}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[#1e293b] bg-[#0c1422] px-2">
            {["1h", "6h", "24h", "7d"].map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1 text-xs rounded transition ${range === r ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40" : "text-[#64748b] hover:text-[#10b981]"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {data.loading && (
          <div className="rounded-lg border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading analytics…" />
          </div>
        )}

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {!data.loading && !data.error && metrics.length === 0 && (
          <EmptyState
            title="No metric history"
            message="No performance data is available yet. Connect a system to begin monitoring."
            icon="📊"
          />
        )}

        {!data.loading && !data.error && metrics.length > 0 && (
          <>
            {/* Key metrics */}
            <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MetricCard
                name="CPU"
                value={`${cpuPercent}%`}
                detail={cpuTrend.startsWith("-") ? `↓${cpuTrend.replace("-", "")}% vs start` : `↑${cpuTrend}% vs start`}
                status={Number(cpuPercent) > 80 ? "critical" : Number(cpuPercent) > 60 ? "warning" : "normal"}
                icon={<Cpu className="h-5 w-5" />}
              />
              <MetricCard
                name="RAM"
                value={ramPercent == null ? "—" : `${ramPercent}%`}
                detail={latest && latest.memory_used_bytes != null ? `${(Number(latest.memory_used_bytes) / 1024 ** 3).toFixed(1)} GB / 16 GB` : "— GB / 16 GB"}
                status={ramPercent != null && ramPercent > 80 ? "critical" : ramPercent != null && ramPercent > 60 ? "warning" : "normal"}
                icon={<Activity className="h-5 w-5" />}
              />
              <MetricCard
                name="Disk"
                value={diskPercent == null ? "—" : `${diskPercent}%`}
                detail={latest ? `${(Number(latest.disk_used_bytes) / 1024 ** 3).toFixed(1)} GB / ${(Number(latest.disk_total_bytes) / 1024 ** 3).toFixed(0)} GB` : "No data"}
                status={diskPercent != null && diskPercent > 80 ? "critical" : diskPercent != null && diskPercent > 60 ? "warning" : "normal"}
                icon={<HardDrive className="h-5 w-5" />}
              />
              <MetricCard
                name="Network"
                value={latest && latest.network_received_bytes != null ? `${((Number(latest.network_received_bytes) + Number(latest.network_sent_bytes)) / 1024 / 1024).toFixed(2)} MB` : "—"}
                detail="Total transferred"
                status="normal"
                icon={<Wifi className="h-5 w-5" />}
              />
            </section>

            {/* Charts grid */}
            <section className="mb-6 grid gap-6 lg:grid-cols-3">
              {/* CPU & RAM trend */}
              <div className="lg:col-span-2 panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="eyebrow">RESOURCE TRENDS</p>
                      <h2 className="section-title">CPU & RAM Usage</h2>
                    </div>
                    <span className="badge shrink-0" style={ { color: "var(--severity-low)", borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.12)" } }>
                      {range}
                    </span>
                  </div>
                  <p className="muted mt-2 text-xs">CPU and RAM utilization over the selected time range.</p>
                </div>
                <div className="mt-4 h-72">
                  <ResourceChart data={chartData} />
                </div>
              </div>

              {/* Disk donut */}
              <div className="panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full blur-3xl" />
                <div className="relative z-10 flex flex-col items-center justify-center h-72">
                  <p className="eyebrow mb-1">DISK USAGE</p>
                  <PieChart width={260} height={260}>
                    <Pie
                      data={[
                        { name: "Used", value: diskPercent ?? 0, fill: COLORS.disk },
                        { name: "Free", value: Math.max(0, 100 - (diskPercent ?? 0)), fill: "#1e293b" },
                      ]}
                      cx={130}
                      cy={130}
                      innerRadius={90}
                      outerRadius={110}
                      startAngle={180}
                      endAngle={0}
                    >
                      <Cell dataKey="fill" fill={COLORS.disk} />
                      <Cell dataKey="fill" fill="#1e293b" />
                    </Pie>
                  </PieChart>
                  <div className="mt-4 text-center">
                    <span className="text-2xl font-extrabold" style={ { color: "var(--text)" } }>
                      {diskPercent == null ? "—" : diskPercent}%
                    </span>
                    <p className="text-xs text-[#64748b]">of disk used</p>
                  </div>
                </div>
              </div>

              {/* Network line */}
              <div className="panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="eyebrow">NETWORK</p>
                      <h2 className="section-title">Throughput</h2>
                    </div>
                    <span className="badge shrink-0" style={ { color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 14%, transparent)" } }>
                      LIVE
                    </span>
                  </div>
                  <p className="muted mt-2 text-xs">Network traffic (MB) over time.</p>
                </div>
                <div className="mt-4 h-72">
                  {chartData.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "var(--panel-inner)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }}
                          formatter={(value) => [`${value} MB`]}
                        />
                        <Legend wrapperStyle={{ color: "#aebbd0", fontSize: 12 }} />
                        <Line
                          type="monotone"
                          dataKey="network"
                          name="Network"
                          stroke="#a78bfa"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: "#a78bfa" }}
                          fillOpacity={1}
                          fill="url(#colorNet)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#334155] p-4 text-center">
                      <span className="text-xs text-[#64748b]">No network data available yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Activity sparkline row */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "CPU", icon: <Cpu className="h-5 w-5" />, color: COLORS.cpu, value: cpuPercent },
                { label: "RAM", icon: <Activity className="h-5 w-5" />, color: COLORS.ram, value: ramPercent == null ? "—" : ramPercent + "%" },
                { label: "DISK", icon: <HardDrive className="h-5 w-5" />, color: COLORS.disk, value: diskPercent == null ? "—" : diskPercent + "%" },
                { label: "NET", icon: <Wifi className="h-5 w-5" />, color: COLORS.network, value: latest && latest.network_received_bytes != null ? "live" : "—" },
              ].map((item) => (
                <div key={item.label} className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={ { background: "color-mix(in srgb, " + item.color + " 15%, transparent)" } }>
                        {item.icon}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={ { color: "var(--text-muted)" } }>{item.label}</span>
                    </div>
                    <span className="text-xs font-mono" style={ { color: item.color } }>{item.value}</span>
                  </div>
                  <div className="h-1 w-full bg-[#1e293b]/40 rounded-full overflow-hidden">
                    <div
                      className="h-full animate-pulse"
                      style={ { background: item.color, width: item.label === "NET" ? "50%" : Math.min(Number(item.value.replace("%", "")) || 0, 100) + "%" } }
                    />
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
