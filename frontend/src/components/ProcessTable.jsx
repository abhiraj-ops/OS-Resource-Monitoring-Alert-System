import { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Download, Save, Edit3 } from "lucide-react";

function formatMemory(bytes) {
  if (bytes == null) return "—";
  const value = Number(bytes);
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(0)} MB`;
  return `${(value / 1024).toFixed(0)} KB`;
}

function statusForCpu(cpu) {
  const c = Number(cpu ?? 0);
  if (c > 80) return { label: "CRITICAL", color: "var(--severity-critical)" };
  if (c > 60) return { label: "WARNING", color: "var(--severity-high)" };
  return { label: "OK", color: "var(--severity-low)" };
}

export default function ProcessTable({ processes: initialProcesses = [], readOnly = false, onProcessesChange }) {
  const [processes, setProcesses] = useState(() => [...initialProcesses]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);

  // Sync with external changes (e.g. system switcher in Dashboard)
  useEffect(() => {
    setProcesses([...initialProcesses]);
    setValidationErrors({});
  }, [JSON.stringify(initialProcesses)]);

  // Persist to localStorage so edits survive refresh (demo mode)
  useEffect(() => {
    if (!readOnly) {
      try {
        localStorage.setItem("osm_processes", JSON.stringify(processes));
      } catch {}
    }
  }, [processes, readOnly]);

  const validateProcesses = useCallback((rows) => {
    const errors = {};
    const pids = new Set();

    rows.forEach((row, index) => {
      const rowErrors = {};

      if (!row.process_name || String(row.process_name).trim() === "") {
        rowErrors.process_name = "Process name is required";
      }

      if (!row.pid || String(row.pid).trim() === "") {
        rowErrors.pid = "PID is required";
      } else if (pids.has(String(row.pid).trim())) {
        rowErrors.pid = "PID must be unique";
      } else {
        pids.add(String(row.pid).trim());
      }

      if (row.cpu_percent === "" || row.cpu_percent === null) {
        rowErrors.cpu_percent = "CPU is required";
      } else if (isNaN(Number(row.cpu_percent)) || Number(row.cpu_percent) < 0) {
        rowErrors.cpu_percent = "CPU must be >= 0";
      } else if (Number(row.cpu_percent) > 100) {
        rowErrors.cpu_percent = "CPU must be <= 100";
      }

      if (row.memory_bytes === "" || row.memory_bytes === null) {
        rowErrors.memory_bytes = "Memory is required";
      } else if (isNaN(Number(row.memory_bytes)) || Number(row.memory_bytes) < 0) {
        rowErrors.memory_bytes = "Memory must be >= 0";
      }

      if (Object.keys(rowErrors).length > 0) {
        errors[index] = rowErrors;
      }
    });

    return errors;
  }, []);

  const handleCellChange = useCallback((index, field, value) => {
    setProcesses((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setIsEditing((prev) => ({ ...prev, [index]: {} }));
    setSaveMessage(null);
    setValidationErrors({});
  }, []);

  const addRow = useCallback(() => {
    setProcesses((prev) => {
      const next = [...prev];
      next.push({
        id: `p-${Date.now()}`,
        process_name: "new-process",
        pid: prev.length + 1,
        cpu_percent: 0,
        memory_bytes: 0,
        username: "demo-user",
        captured_at: new Date().toISOString(),
      });
      return next;
    });
    setSaveMessage(null);
  }, []);

  const deleteRow = useCallback((index) => {
    setProcesses((prev) => prev.filter((_, i) => i !== index));
    setSaveMessage(null);
  }, []);

  const handleApply = useCallback(() => {
    const errors = validateProcesses(processes);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSaveMessage({ type: "error", text: "Please fix validation errors before applying." });
      setTimeout(() => setSaveMessage(null), 4000);
      return;
    }
    setValidationErrors({});
    if (onProcessesChange) onProcessesChange(processes);
    setSaveMessage({ type: "success", text: "Changes applied successfully!" });
    setTimeout(() => setSaveMessage(null), 3000);
  }, [processes, onProcessesChange, validateProcesses]);

  const handleDownloadCSV = useCallback(() => {
    const headers = ["Process", "PID", "CPU %", "Memory (bytes)", "Username", "Captured At"];
    const rows = processes.map(p => [
      p.process_name,
      p.pid,
      p.cpu_percent,
      p.memory_bytes,
      p.username || "",
      p.captured_at || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(c => (String(c).includes(",") || String(c).includes('"') || String(c).includes("\n")) ? `"${String(c).replace(/"/g, '""')}"` : c).join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processes]);

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
        <p className="muted mt-2 text-xs">
          {readOnly
            ? "Running processes and resource consumption (read-only)."
            : "Double-click any cell to edit. Add or delete rows. Click Apply to save."}
        </p>
      </div>

      {!readOnly && saveMessage && (
        <div
          className="mb-3 rounded-xl border p-3 flex items-center gap-2"
          style={
            saveMessage.type === "success"
              ? { borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.10)" }
              : { borderColor: "var(--severity-critical)", background: "rgba(239,68,68,0.10)" }
          }
        >
          <span className="h-5 w-5 rounded-full flex items-center justify-center" style={ { background: saveMessage.type === "success" ? "var(--severity-low)" : "var(--severity-critical)" } }>
            {saveMessage.type === "success" ? "✓" : "⚠"}
          </span>
          <span className="text-sm" style={ { color: saveMessage.type === "success" ? "var(--severity-low)" : "var(--severity-critical)" } }>
            {saveMessage.text}
          </span>
        </div>
      )}

      <div className="mt-3 rounded-xl border" style={ { borderColor: "var(--border)", overflow: "hidden" } }>
        <div className="!bg-[#0c1422] px-3 py-1 border-b border-[#1e293b] flex items-center justify-between gap-2">
          {!readOnly && (
            <div className="flex items-center gap-1">
              <button
                onClick={addRow}
                disabled={readOnly}
                className="text-xs px-2 py-1 rounded border border-[#1e293b] hover:bg-[#111c2e] text-[#64748b] transition"
                title="Add row"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                onClick={handleApply}
                disabled={readOnly}
                className="text-xs px-2 py-1 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20 transition"
                title="Apply changes"
              >
                <Save className="h-3 w-3" />
              </button>
              <button
                onClick={handleDownloadCSV}
                className="text-xs px-2 py-1 rounded border border-[#1e293b] hover:bg-[#111c2e] text-[#64748b] transition"
                title="Download CSV"
              >
                <Download className="h-3 w-3" />
              </button>
            </div>
          )}
          <span className="text-[10px] text-[#64748b]">Source: Local monitoring agent</span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">PROCESS</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">PID</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">CPU %</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">MEMORY</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">STATUS</th>
              {!readOnly && (
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">ACTIONS</th>
              )}
            </tr>
          </thead>
          <tbody>
            {processes.length ? processes.map((p, index) => {
              const rowErrors = validationErrors[index] || {};
              const isRowEditing = isEditing[index] || {};
              const { label: statusLabel, color: statusColor } = statusForCpu(p.cpu_percent);

              return (
                <tr
                  key={p.id ?? `${p.pid}-${p.captured_at}`}
                  className="border-b border-[#1e293b] hover:bg-[#111c2e]/40 transition group"
                >
                  <td className="px-4 py-3">
                    {isRowEditing.process_name ? (
                      <input
                        autoFocus
                        className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2"
                        value={p.process_name}
                        onChange={(e) => handleCellChange(index, "process_name", e.target.value)}
                        onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                      />
                    ) : (
                      <span
                        className="text-sm"
                        style={ { color: rowErrors.process_name ? "var(--severity-critical)" : "var(--text)" } }
                        onDoubleClick={readOnly ? undefined : () => setIsEditing((prev) => ({ ...prev, [index]: { process_name: true } }))}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 shrink-0 rounded-md bg-[#1c3041] flex items-center justify-center text-[10px] text-[#69e6c0] font-bold">
                            {String(p.process_name).charAt(0).toUpperCase()}
                          </span>
                          <span className="text-sm" style={ { color: "var(--text)" } }>{p.process_name}</span>
                        </div>
                      </span>
                    )}
                    {rowErrors.process_name && (
                      <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.process_name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isRowEditing.pid ? (
                      <input
                        type="number"
                        className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
                        value={p.pid}
                        onChange={(e) => handleCellChange(index, "pid", e.target.value)}
                        onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                      />
                    ) : (
                      <span
                        className="text-sm text-center font-mono"
                        style={ { color: rowErrors.pid ? "var(--severity-critical)" : "var(--text-muted)" } }
                        onDoubleClick={readOnly ? undefined : () => setIsEditing((prev) => ({ ...prev, [index]: { pid: true } }))}
                      >
                        {p.pid}
                      </span>
                    )}
                    {rowErrors.pid && <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.pid}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {isRowEditing.cpu_percent ? (
                      <input
                        type="number"
                        step="0.1"
                        className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center font-mono"
                        value={p.cpu_percent}
                        onChange={(e) => handleCellChange(index, "cpu_percent", e.target.value)}
                        onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                      />
                    ) : (
                      <span
                        className="text-sm text-center font-mono"
                        style={ { color: rowErrors.cpu_percent ? "var(--severity-critical)" : "var(--text)" } }
                        onDoubleClick={readOnly ? undefined : () => setIsEditing((prev) => ({ ...prev, [index]: { cpu_percent: true } }))}
                      >
                        {p.cpu_percent == null ? "—" : Number(p.cpu_percent).toFixed(1)}%
                      </span>
                    )}
                    {rowErrors.cpu_percent && <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.cpu_percent}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {isRowEditing.memory_bytes ? (
                      <input
                        type="number"
                        className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-right"
                        value={p.memory_bytes}
                        onChange={(e) => handleCellChange(index, "memory_bytes", e.target.value)}
                        onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                      />
                    ) : (
                      <span
                        className="text-sm text-right"
                        style={ { color: rowErrors.memory_bytes ? "var(--severity-critical)" : "var(--text-muted)" } }
                        onDoubleClick={readOnly ? undefined : () => setIsEditing((prev) => ({ ...prev, [index]: { memory_bytes: true } }))}
                      >
                        {formatMemory(p.memory_bytes)}
                      </span>
                    )}
                    {rowErrors.memory_bytes && <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.memory_bytes}</p>}
                  </td>
                  <td className="px-4 py-3 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={ { background: statusColor } } />
                      <span className="badge shrink-0" style={ { color: statusColor, borderColor: statusColor, background: "color-mix(in srgb, " + statusColor + " 14%, transparent)" } }>
                        {statusLabel}
                      </span>
                    </span>
                  </td>
                  {!readOnly && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteRow(index)}
                        className="text-[#64748b] hover:text-[#ef4444] hover:bg-[#111c2e] rounded p-1.5 transition"
                        title="Delete row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={readOnly ? 5 : 6} className="px-4 py-12 text-center text-[#64748b]">
                  No process samples are available for this system yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && processes.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={addRow}
              className="btn btn-ghost flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Row
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="btn btn-primary px-6 py-2.5"
            >
              <Save className="h-4 w-4" /> Apply Changes
            </button>
            <button
              onClick={handleDownloadCSV}
              className="btn btn-ghost px-6 py-2.5"
            >
              <Download className="h-4 w-4" /> Download CSV
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-between gap-3 text-[10px] text-[#64748b]">
        <span>Showing {processes.length} process samples</span>
        <span>Total CPU: {processes.reduce((sum, p) => sum + Number(p.cpu_percent ?? 0), 0).toFixed(1)}%</span>
      </div>
    </section>
  );
}
