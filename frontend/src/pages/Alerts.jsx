import { useState, useCallback } from "react";
import AlertPanel from "../components/AlertPanel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";
import { Check, ShieldCheck, Bell, Clock } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

export default function Alerts({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const { theme } = useTheme();
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  const alerts = data.alerts || [];

  const filtered = useCallback(() => {
    return alerts.filter((a) => {
      const sevMatch = sevFilter === "all" || a.severity === sevFilter;
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && a.status === "active") ||
        (statusFilter === "resolved" && a.status === "resolved");
      return sevMatch && statusMatch;
    });
  }, [alerts, sevFilter, statusFilter]);

  const handleAcknowledge = useCallback((id) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleResolve = useCallback((id) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading alerts…" : null)} />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / ALERTS</p>
            <h1 className="text-2xl font-bold">Alerts &amp; Notifications</h1>
            <p className="text-xs text-[#64748b] mt-1">
              Monitor, acknowledge, and resolve system alerts in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${data.realtimeStatus === "online" ? "" : "amber"}`} />
            {data.realtimeStatus === "online" ? "Live" : "Offline"}
          </div>
        </div>

        {data.loading && (
          <div className="rounded-lg border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading alerts…" />
          </div>
        )}

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {/* Alert Stats */}
        {!data.loading && !data.error && (
          <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <p className="eyebrow">TOTAL</p>
              <span className="text-2xl font-extrabold font-mono" style={ { color: "var(--text)" } }>{alerts.length}</span>
            </div>
            <div className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <p className="eyebrow">ACTIVE</p>
              <span className="text-2xl font-extrabold font-mono" style={ { color: "var(--severity-critical)" } }>{activeCount}</span>
            </div>
            <div className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <p className="eyebrow">RESOLVED</p>
              <span className="text-2xl font-extrabold font-mono" style={ { color: "var(--severity-low)" } }>{resolvedCount}</span>
            </div>
            <div className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <p className="eyebrow">CRITICAL</p>
              <span className="text-2xl font-extrabold font-mono" style={ { color: "var(--severity-high)" } }>{criticalCount}</span>
            </div>
          </section>
        )}

        {/* Filters */}
        {!data.loading && !data.error && alerts.length > 0 && (
          <section className="mb-6 panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" style={ { color: "var(--text-muted)" } } />
                <label className="text-xs font-semibold text-[#64748b]">Severity</label>
                <select
                  value={sevFilter}
                  onChange={(e) => setSevFilter(e.target.value)}
                  className="rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={ { color: "var(--text-muted)" } } />
                <label className="text-xs font-semibold text-[#64748b]">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {!data.loading && !data.error && alerts.length === 0 && (
          <EmptyState
            title="No recent alerts"
            message="There are no alerts for this system."
            icon="🚨"
          />
        )}

        {!data.loading && !data.error && alerts.length > 0 && (
          <section className="mb-6 panel p-5 rounded-xl border" style={ { borderColor: "var(--border)" } }>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="eyebrow">ALERT FEED</p>
                <h2 className="section-title">{filtered().length} alert(s)</h2>
              </div>
              <span className="badge shrink-0" style={ { color: criticalCount > 0 ? "var(--severity-critical)" : "var(--severity-low)", borderColor: criticalCount > 0 ? "var(--severity-critical)" : "var(--severity-low)", background: criticalCount > 0 ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)" } }>
                {criticalCount > 0 ? "ATTENTION REQUIRED" : "ALL CLEAR"}
              </span>
            </div>

            <div className="space-y-2">
              {filtered().length ? filtered().map((alert) => {
                const isAck = acknowledgedIds.has(alert.id);
                const type = alert.severity === "critical" || alert.severity === "warning" ? "warning" : alert.severity === "info" ? "info" : "low";
                const time = alert.triggered_at ? new Date(alert.triggered_at).toLocaleString() : "Recent alert";
                return (
                  <div key={alert.id} className="flex gap-3 rounded-xl border p-3 text-left transition"
                    style={ { borderColor: "var(--border)", background: "var(--panel)" } }>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={ { background: type === "warning" ? "var(--severity-high)" : type === "info" ? "var(--accent)" : "var(--severity-low)" } } />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] mb-1">
                        <span
                          className="badge shrink-0"
                          style={ { color: type === "warning" ? "var(--severity-high)" : "var(--severity-low)", borderColor: type === "warning" ? "var(--severity-high)" : "var(--severity-low)", background: "color-mix(in srgb, var(--severity-high) 14%, transparent)" } }>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                        {alert.aiGenerated && (
                          <span className="badge shrink-0" style={ { color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 22%, transparent)" } }>
                            AI
                          </span>
                        )}
                        <span className="text-[#64748b]">{alert.system_id?.slice(0, 8) || "system"}</span>
                        <span className="text-[#64748b]">·</span>
                        <span className="text-[#64748b]">{time}</span>
                      </div>
                      <h4 className="mt-0 block truncate text-[13px] font-semibold" style={ { color: "var(--text)" } }>
                        {alert.message}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-[#64748b]">{alert.alert_type.replaceAll("_", " ")} · {alert.status.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isAck && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="text-xs px-3 py-1.5 rounded border border-[#30405b] bg-[#0c1422] text-[#64748b] hover:bg-[#111c2e] hover:text-[#65e6bd] transition"
                          title="Acknowledge"
                        >
                          <Check className="h-3 w-3" /> Ack
                        </button>
                      )}
                      {alert.status === "active" && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="text-xs px-3 py-1.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20 transition"
                          title="Resolve"
                        >
                          <ShieldCheck className="h-3 w-3" /> Resolve
                        </button>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <span className="text-[#64748b]">🔍</span>
                  <p className="text-sm font-semibold" style={ { color: "var(--text)" } }>No alerts match this filter</p>
                  <p className="max-w-xs text-xs text-[#64748b]">Try a different severity or status filter.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
