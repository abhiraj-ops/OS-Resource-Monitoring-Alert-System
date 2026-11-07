const processes = [
  { pid: 1840, name: "chrome.exe", cpu: "12.4%", memory: "1.2 GB" },
  { pid: 2316, name: "Code.exe", cpu: "8.1%", memory: "864 MB" },
  { pid: 992, name: "System", cpu: "3.2%", memory: "420 MB" },
  { pid: 3148, name: "explorer.exe", cpu: "1.7%", memory: "188 MB" },
];

export default function ProcessTable() {
  return <section className="panel mb-4 p-5 max-[720px]:p-4" id="processes">
    <div className="flex items-center justify-between gap-3"><div><p className="eyebrow !mb-1.5">SYSTEM ACTIVITY</p><h2 className="section-title">Running processes</h2></div><span className="demo-chip">DEMO DATA</span></div>
    <p className="muted mt-2 text-xs">Example processes and resource usage</p>
    <div className="table-scroll"><table><thead><tr><th>PROCESS</th><th>PID</th><th>CPU USAGE</th><th>MEMORY</th><th>STATUS</th></tr></thead>
      <tbody>{processes.map(p => <tr key={p.pid}><td><span className="mr-2.5 inline-grid size-[26px] place-items-center rounded-md bg-[#1c3041] text-[11px] text-[#73dfc0]">{p.name[0].toUpperCase()}</span>{p.name}</td><td className="text-[#8593aa]">{p.pid}</td><td>{p.cpu}</td><td>{p.memory}</td><td className="text-[11px] text-[#7fe0bb]"><span className="status-dot !mr-1.5 !size-1.5" />Running</td></tr>)}</tbody>
    </table></div>
    <div className="flex justify-between gap-3 border-t border-[#202d41] pt-3 text-[10px] text-[#77869e] max-[720px]:flex-col">Showing 4 sample processes<span>Data is for preview only</span></div>
  </section>;
}
