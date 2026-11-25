import ResourceChart from "../components/ResourceChart.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";

export default function Analytics({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const chartData = [...data.metrics].reverse().map(metric => ({
    time: new Date(metric.collected_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    cpu: metric.cpu_percent == null ? null : Number(metric.cpu_percent),
    ram: metric.memory_used_bytes != null && metric.memory_total_bytes
      ? Math.round((metric.memory_used_bytes / metric.memory_total_bytes) * 100)
      : null,
  }));

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading analytics…" : null)} />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / ANALYTICS</p>
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
          <span className="status-dot" /> {data.realtimeStatus === "online" ? "Live" : "Offline"}
        </div>

        {data.loading && (
          <div className="rounded-lg border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading analytics…" />
          </div>
        )}

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {!data.loading && !data.error && data.metrics.length === 0 && (
          <EmptyState
            title="No metric history"
            message="No performance data is available yet. Connect a system to begin monitoring."
            icon="📊"
          />
        )}

        {!data.loading && !data.error && data.metrics.length > 0 && (
          <ResourceChart data={chartData} />
        )}
      </div>
    </main>
  );
}
