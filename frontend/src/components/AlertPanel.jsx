function Alert({ type, symbol, title, message, time, status, source, ai }) {
  const severityColors = {
    critical: "var(--severity-critical)",
    high: "var(--severity-high)",
    medium: "var(--severity-medium)",
    low: "var(--severity-low)",
  };
  const color = severityColors[type] || "var(--severity-low)";

  return (
    <button
      type="button"
      className="mt-3 flex gap-3 rounded-xl border p-3 text-left transition"
      style={ {
        borderColor: "var(--border)",
        background: "var(--panel)",
      } }
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--panel-inner)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--panel)"; }}
    >
      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={ { background: color } } />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span
            className="badge shrink-0"
            style={ {
              color,
              borderColor: color,
              background: "color-mix(in srgb, " + color + " 14%, transparent)",
            } }
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          {ai && (
            <span className="badge shrink-0" style={ { color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 22%, transparent)" } }>
              AI
            </span>
          )}
          <span className="text-[#64748b]">{source}</span>
          <span className="text-[#64748b]">·</span>
          <span className="text-[#64748b]">{title.split(" ")[0]}</span>
          <span className="text-[#64748b]">{time}</span>
        </div>
        <h4 className="mt-0.5 block truncate text-[13px] font-semibold" style={ { color: "var(--text)" } }>
          {message}
        </h4>
        <p className="mt-0.5 text-[10px] text-[#64748b]">{status}</p>
      </div>
      <span className={`badge shrink-0 ${status === "active" ? "text-[#ef4444] border-[#ef4444] bg-[rgba(239,68,68,0.12)]" : "text-[#22c55e] border-[#22c55e] bg-[rgba(34,197,94,0.12)]"}`}>
        {status === "active" ? "ACTIVE" : "RESOLVED"}
      </span>
    </button>
  );
}

export default function AlertPanel({ alerts }) {
  return (
    <article className="panel p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="eyebrow">NOTIFICATIONS</p>
            <h2 className="section-title">Alerts & Notifications</h2>
          </div>
          <span
            className={`badge shrink-0 ${alerts.filter(a => a.severity === "critical" || a.severity === "high").length > 0 ? "text-[#ef4444] border-[#ef4444] bg-[rgba(239,68,68,0.12)]" : "text-[#22c55e] border-[#22c55e] bg-[rgba(34,197,94,0.12)]"}`}
          >
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="mt-4 relative h-72 overflow-hidden rounded-2xl border" style={ { borderColor: "var(--border)", background: "color-mix(in srgb, var(--panel) 45%, transparent)" } } tabIndex={0} aria-label="Live alert feed">
        <div className="feed-track space-y-2 p-2.5">
          {alerts.length ? alerts.map(alert => {
            const type = alert.severity === "critical" || alert.severity === "warning" ? "warning" : alert.severity === "info" ? "info" : "low";
            const time = alert.triggered_at ? new Date(alert.triggered_at).toLocaleString() : "Recent alert";
            return (
              <Alert
                key={alert.id}
                type={type}
                symbol={type === "warning" ? "!" : "✓"}
                title={alert.alert_type.replaceAll("_", " ")}
                message={alert.message}
                time={time}
                status={alert.status}
                source={alert.system_id?.slice(0, 8) || "system"}
                ai={alert.aiGenerated}
              />
            );
          }) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <span className="text-[#64748b]">🚨</span>
              <p className="text-sm font-semibold" style={ { color: "var(--text)" } }>No alerts match this filter</p>
              <p className="max-w-xs text-xs text-[#64748b]">Try a different system, or widen the severity filter.</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
