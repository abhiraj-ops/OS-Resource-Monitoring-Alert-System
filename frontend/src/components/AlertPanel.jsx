function Alert({ type, symbol, title, message, time, status }) {
  return <div className="mt-3 flex gap-3 rounded-lg border border-[#26344b] bg-[#182337] p-3.5">
    <span className={`grid size-[23px] shrink-0 place-items-center rounded-full text-[13px] font-bold ${type === "warning" ? "bg-[#41351f] text-[#f0c56d]" : "bg-[#18382f] text-[#6ee1b4]"}`}>{symbol}</span>
    <div><strong className="text-xs">{title}</strong><p className="my-1 text-[11px] leading-snug text-[#9aa8bd]">{message}</p><small className="text-[10px] text-[#75849d]">{time}{status ? ` · ${status}` : ""}</small></div>
  </div>;
}

export default function AlertPanel({ alerts, demoMode }) {
  return <article className="panel p-5 max-[720px]:p-4" id="alerts">
    <div className="flex items-center justify-between"><div><p className="eyebrow !mb-1.5">NOTIFICATIONS</p><h2 className="section-title">Recent alerts</h2></div><div className="flex items-center gap-2"><span className="grid size-[25px] place-items-center rounded-lg bg-[#342b1d] text-xs text-[#efc56f]">{alerts.length}</span><span className="demo-chip">{demoMode ? "DEMO DATA" : "LIVE DATA"}</span></div></div>
    {alerts.length ? alerts.map(alert => {
      const type = alert.severity === "critical" || alert.severity === "warning" ? "warning" : "success";
      const time = alert.triggered_at ? new Date(alert.triggered_at).toLocaleString() : "Demo alert";
      return <Alert key={alert.id} type={type} symbol={type === "warning" ? "!" : "✓"} title={alert.alert_type.replaceAll("_", " ")} message={alert.message} time={time} status={alert.status} />;
    }) : <p className="mt-4 rounded-lg bg-[#182337] p-4 text-xs text-[#8190a9]">No recent alerts for this system.</p>}
    <p className="mt-3.5 text-[10px] text-[#77869e]">{demoMode ? "Sample alerts only · No live alerts connected" : "Updates from Supabase"}</p>
  </article>;
}
