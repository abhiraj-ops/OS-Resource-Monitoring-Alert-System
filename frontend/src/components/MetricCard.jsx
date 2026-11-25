export default function MetricCard({ name, value, detail, status = "normal" }) {
  const statusColors = {
    normal: "text-[#69e6c0]",
    warning: "text-[#f59e0b]",
    critical: "text-[#ef4444]",
    info: "text-[#3b82f6]",
  };

  return (
    <article className="panel p-5 min-h-[150px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#1b3040]/30 rounded-bl-full blur-3xl group-hover:bg-[#1b3040]/50 transition" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="h-7 w-7 shrink-0 rounded-lg bg-[#1b3040] flex items-center justify-center"
              style={ { color: "var(--accent)" } }
            >
              {name.slice(0, 1)}
            </span>
            <span className="text-xs font-semibold">{name}</span>
          </div>
          <span
            className={`badge shrink-0 ${statusColors[status]}`}
            style={ {
              color: status === "normal" ? "var(--severity-low)" : status === "warning" ? "var(--severity-high)" : "var(--severity-critical)",
              borderColor: status === "normal" ? "var(--severity-low)" : status === "warning" ? "var(--severity-high)" : "var(--severity-critical)",
              background: status === "normal" ? "rgba(34,197,94,0.12)" : status === "warning" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
            } }
          >
            {status === "normal" ? "OK" : status === "warning" ? "WARN" : "CRIT"}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight">{value}</span>
          <span className="text-xs text-[#64748b]">{detail}</span>
        </div>
        <div className="mt-3 h-1 w-1/3 bg-[#1e293b]/50 rounded-full overflow-hidden">
          <div
            className="h-full"
            style={ {
              background: `linear-gradient(90deg, var(--accent) 0%, var(--accent-strong) 100%)`,
              width: status === "normal" ? "65%" : status === "warning" ? "85%" : "95%",
            } }
          />
        </div>
      </div>
    </article>
  );
}
