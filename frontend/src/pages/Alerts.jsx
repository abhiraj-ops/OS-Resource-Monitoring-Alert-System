import AlertPanel from "../components/AlertPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";

export default function Alerts({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading alerts…" : null)} />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / ALERTS</p>
            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
          </div>
          <span className={`status-dot ${data.realtimeStatus === "online" ? "" : "amber"}`} />
          {data.realtimeStatus === "online" ? "Live" : "Offline"}
        </div>

        {data.loading && (
          <div className="rounded-lg border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading alerts…" />
          </div>
        )}

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {!data.loading && !data.error && data.alerts.length === 0 && (
          <EmptyState
            title="No recent alerts"
            message="There are no active alerts for this system."
            icon="🚨"
          />
        )}

        {!data.loading && !data.error && data.alerts.length > 0 && (
          <AlertPanel alerts={data.alerts} />
        )}
      </div>
    </main>
  );
}
