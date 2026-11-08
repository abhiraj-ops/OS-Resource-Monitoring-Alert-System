function formatMemory(bytes) {
  if (bytes == null) return "—";
  const value = Number(bytes);
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(0)} MB`;
  return `${(value / 1024).toFixed(0)} KB`;
}

export default function ProcessTable({ processes, demoMode }) {
  return <section className="panel mb-4 p-5 max-[720px]:p-4" id="processes">
    <div className="flex items-center justify-between gap-3"><div><p className="eyebrow !mb-1.5">SYSTEM ACTIVITY</p><h2 className="section-title">Running processes</h2></div><span className="demo-chip">{demoMode ? "DEMO DATA" : "LIVE DATA"}</span></div>
    <p className="muted mt-2 text-xs">Example processes and resource usage</p>
    <div className="table-scroll"><table><thead><tr><th>PROCESS</th><th>PID</th><th>CPU USAGE</th><th>MEMORY</th><th>STATUS</th></tr></thead>
      <tbody>{processes.length ? processes.map(p => <tr key={`${p.pid}-${p.captured_at}`}><td><span className="mr-2.5 inline-grid size-[26px] place-items-center rounded-md bg-[#1c3041] text-[11px] text-[#73dfc0]">{p.process_name[0].toUpperCase()}</span>{p.process_name}</td><td className="text-[#8593aa]">{p.pid}</td><td>{p.cpu_percent == null ? "—" : `${Number(p.cpu_percent).toFixed(1)}%`}</td><td>{formatMemory(p.memory_bytes)}</td><td className="text-[11px] text-[#7fe0bb]"><span className="status-dot !mr-1.5 !size-1.5" />{demoMode ? "Demo" : "Latest sample"}</td></tr>) : <tr><td colSpan="5" className="py-8 text-center text-[#8190a9]">No process samples are available for this system yet.</td></tr>}</tbody>
    </table></div>
    <div className="flex justify-between gap-3 border-t border-[#202d41] pt-3 text-[10px] text-[#77869e] max-[720px]:flex-col">Showing {processes.length} {demoMode ? "sample processes" : "latest process samples"}<span>{demoMode ? "Data is for preview only" : "Source: Supabase"}</span></div>
  </section>;
}
