function Alert({ type, symbol, title, message, time }) {
  return <div className="mt-3 flex gap-3 rounded-lg border border-[#26344b] bg-[#182337] p-3.5">
    <span className={`grid size-[23px] shrink-0 place-items-center rounded-full text-[13px] font-bold ${type === "warning" ? "bg-[#41351f] text-[#f0c56d]" : "bg-[#18382f] text-[#6ee1b4]"}`}>{symbol}</span>
    <div><strong className="text-xs">{title}</strong><p className="my-1 text-[11px] leading-snug text-[#9aa8bd]">{message}</p><small className="text-[10px] text-[#75849d]">{time}</small></div>
  </div>;
}

export default function AlertPanel() {
  return <article className="panel p-5 max-[720px]:p-4" id="alerts">
    <div className="flex items-center justify-between"><div><p className="eyebrow !mb-1.5">NOTIFICATIONS</p><h2 className="section-title">Recent alerts</h2></div><span className="grid size-[25px] place-items-center rounded-lg bg-[#342b1d] text-xs text-[#efc56f]">2</span></div>
    <Alert type="warning" symbol="!" title="CPU usage elevated" message="Demo alert · CPU reached 78%" time="12 minutes ago" />
    <Alert type="success" symbol="✓" title="System scan completed" message="Demo alert · No issues found" time="34 minutes ago" />
    <p className="mt-3.5 text-[10px] text-[#77869e]">Sample alerts only · No live alerts connected</p>
  </article>;
}
