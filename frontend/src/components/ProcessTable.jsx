function formatMemory(bytes) {
  if (bytes == null) return "—";
  const value = Number(bytes);
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(0)} MB`;
  return `${(value / 1024).toFixed(0)} KB`;
}

export default function ProcessTable({ processes }) {
  return (
    <section className="panel p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="eyebrow">SYSTEM ACTIVITY</p>
            <h2 className="section-title">Running Processes</h2>
          </div>
          <span className="badge shrink-0" style={ { color: "var(--severity-low)", borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.12)" } }>
            {processes.length} active
          </span>
        </div>
        <p className="muted mt-2 text-xs">Running processes and resource consumption</p>
      </div>

      <div className="mt-4 rounded-xl border" style={ { borderColor: "var(--border)", overflow: "hidden" } }>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b]">PROCESS</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b]">PID</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b]">CPU USAGE</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b]">MEMORY</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {processes.length ? processes.map(p => (
              <tr key={`${p.pid}-${p.captured_at}`} className="border-b border-[#1e293b] hover:bg-[#111c2e]/50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 shrink-0 rounded-md bg-[#1c3041] flex items-center justify-center text-[10px] text-[#69e6c0] font-bold">
                      {p.process_name[0].toUpperCase()}
                    </span>
                    <span className="text-sm" style={ { color: "var(--text)" } }>{p.process_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#94a3b8] text-sm">{p.pid}</td>
                <td className="px-4 py-3 text-sm font-mono">
                  {p.cpu_percent == null ? "—" : `${Number(p.cpu_percent).toFixed(1)}%`}
                </td>
                <td className="px-4 py-3 text-sm">{formatMemory(p.memory_bytes)}</td>
                <td className="px-4 py-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="status-dot !mr-1 !size-1.5" style={ { background: "var(--severity-low)" } } />
                    Latest sample
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-[#64748b]">
                  No process samples are available for this system yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-between gap-3 text-[10px] text-[#64748b]">
        <span>Showing {processes.length} process samples</span>
        <span>Source: Local monitoring agent</span>
      </div>
    </section>
  );
}
