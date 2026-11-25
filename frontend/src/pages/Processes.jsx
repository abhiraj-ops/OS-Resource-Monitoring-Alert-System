import { useState, useCallback } from "react";
import ProcessTable from "../components/ProcessTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";
import { Save, Plus, Trash2, Download } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

const initialProcesses = [
  { pid: "P1", arrival_time: 2, burst_time: 5, priority: 2 },
  { pid: "P2", arrival_time: 1, burst_time: 3, priority: 1 },
  { pid: "P3", arrival_time: 2, burst_time: 8, priority: 3 },
  { pid: "P4", arrival_time: 3, burst_time: 6, priority: 2 },
];

export default function Processes({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const { theme } = useTheme();

  const [processes, setProcesses] = useState(() => {
    const saved = localStorage.getItem("os_processes");
    return saved ? JSON.parse(saved) : [...initialProcesses];
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);

  useState(() => {
    localStorage.setItem("os_processes", JSON.stringify(processes));
  }, [processes]);

  const validateProcesses = useCallback((rows) => {
    const errors = {};
    const pids = new Set();

    rows.forEach((row, index) => {
      const rowErrors = {};

      // Validate PID uniqueness and non-empty
      if (!row.pid || String(row.pid).trim() === "") {
        rowErrors.pid = "Process ID is required";
      } else if (pids.has(String(row.pid).trim())) {
        rowErrors.pid = "Process ID must be unique";
      } else {
        pids.add(String(row.pid).trim());
      }

      // Validate arrival time >= 0
      if (row.arrival_time === "" || row.arrival_time === null) {
        rowErrors.arrival_time = "Arrival time is required";
      } else if (isNaN(Number(row.arrival_time)) || Number(row.arrival_time) < 0) {
        rowErrors.arrival_time = "Arrival time must be >= 0";
      }

      // Validate burst time > 0
      if (row.burst_time === "" || row.burst_time === null) {
        rowErrors.burst_time = "Burst time is required";
      } else if (isNaN(Number(row.burst_time)) || Number(row.burst_time) <= 0) {
        rowErrors.burst_time = "Burst time must be > 0";
      }

      // Validate priority >= 0
      if (row.priority === "" || row.priority === null) {
        rowErrors.priority = "Priority is required";
      } else if (isNaN(Number(row.priority)) || Number(row.priority) < 0) {
        rowErrors.priority = "Priority must be >= 0";
      }

      if (Object.keys(rowErrors).length > 0) {
        errors[index] = rowErrors;
      }
    });

    return errors;
  }, []);

  const handleCellChange = useCallback((rowIndex, field, value) => {
    setProcesses((prev) => {
      const newRows = [...prev];
      newRows[rowIndex] = { ...newRows[rowIndex], [field]: value };
      return newRows;
    });
    setIsEditing((prev) => ({ ...prev, [rowIndex]: {} }));
    setSaveMessage(null);
  }, []);

  const addRow = useCallback(() => {
    setProcesses((prev) => {
      const newPid = `P${prev.length + 1}`;
      return [...prev, { pid: newPid, arrival_time: 0, burst_time: 1, priority: 1 }];
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
      return;
    }

    setValidationErrors({});
    setSaveMessage({
      type: "success",
      text: "Changes applied & recalculated successfully!",
    });
    setTimeout(() => setSaveMessage(null), 3000);
  }, [processes, validateProcesses]);

  const handleDownloadCSV = useCallback(() => {
    const headers = ["Process", "Arrival Time", "Burst Time", "Priority"];
    const rows = processes.map(p => [p.pid, p.arrival_time, p.burst_time, p.priority]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workload.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processes]);

  const sortProcesses = useCallback((field) => {
    setProcesses((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (typeof valA === "string") return valA.localeCompare(valB);
        return Number(valA) - Number(valB);
      });
      return sorted;
    });
  }, []);

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement={data.error || (data.loading ? "Loading processes…" : null)} />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / PROCESSES</p>
            <h1 className="text-2xl font-bold">Process Table</h1>
            <p className="text-xs text-[#64748b] mt-1">
              Edit any cell, add rows, or delete rows. Process IDs must be unique; arrival &gt;= 0 and burst &gt; 0. Click Apply to recalculate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${data.realtimeStatus === "online" ? "" : "amber"}`} />
            {data.realtimeStatus === "online" ? "Live" : "Offline"}
          </div>
        </div>

        {data.loading && (
          <div className="rounded-xl border border-[#25334b] bg-[#111b2c] p-4">
            <LoadingSpinner message="Loading processes…" />
          </div>
        )}

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {!data.loading && !data.error && processes.length === 0 && (
          <EmptyState
            title="No process samples"
            message="No process data is available for this system yet."
            icon="⚙"
            actionLabel="Add Process"
            action={addRow}
          />
        )}

        {!data.loading && !data.error && processes.length > 0 && (
          <>
            {saveMessage && (
              <div
                className={`mb-4 rounded-xl border p-3 flex items-center gap-2 ${
                  saveMessage.type === "success"
                    ? "border-[#22c55e]/30 bg-[#22c55e]/10"
                    : "border-[#ef4444]/30 bg-[#ef4444]/10"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center"
                  style={
                    saveMessage.type === "success"
                      ? { background: "var(--severity-low)" }
                      : { background: "var(--severity-critical)" }
                  }
                >
                  {saveMessage.type === "success" ? "✓" : "⚠"}
                </span>
                <span className="text-sm" style={ { color: saveMessage.type === "success" ? "var(--severity-low)" : "var(--severity-critical)" } }>
                  {saveMessage.text}
                </span>
              </div>
            )}

            <div className="relative overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th
                      onClick={() => sortProcesses("pid")}
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422] cursor-pointer hover:bg-[#111b2c] transition select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>Process</span>
                        <span className="text-[10px]">↕</span>
                      </div>
                    </th>
                    <th
                      onClick={() => sortProcesses("arrival_time")}
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422] cursor-pointer hover:bg-[#111b2c] transition select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>Arrival Time</span>
                        <span className="text-[10px]">↕</span>
                      </div>
                    </th>
                    <th
                      onClick={() => sortProcesses("burst_time")}
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422] cursor-pointer hover:bg-[#111b2c] transition select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>Burst Time</span>
                        <span className="text-[10px]">↕</span>
                      </div>
                    </th>
                    <th
                      onClick={() => sortProcesses("priority")}
                      className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422] cursor-pointer hover:bg-[#111b2c] transition select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>Priority</span>
                        <span className="text-[10px]">↕</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((row, index) => {
                    const rowErrors = validationErrors[index] || {};
                    const isRowEditing = isEditing[index] || {};
                    return (
                      <tr
                        key={index}
                        className="border-b border-[#1e293b] hover:bg-[#111c2e]/30 transition group"
                      >
                        <td className="px-4 py-3">
                          {isRowEditing.pid ? (
                            <input
                              autoFocus
                              className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2"
                              value={row.pid}
                              onChange={(e) => handleCellChange(index, "pid", e.target.value)}
                              onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                            />
                          ) : (
                            <span
                              className="text-sm font-mono"
                              style={ { color: rowErrors.pid ? "var(--severity-critical)" : "var(--text)" } }
                              onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { pid: true } }))}
                            >
                              {row.pid}
                            </span>
                          )}
                          {rowErrors.pid && (
                            <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.pid}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isRowEditing.arrival_time ? (
                            <input
                              type="number"
                              className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
                              value={row.arrival_time}
                              onChange={(e) => handleCellChange(index, "arrival_time", e.target.value)}
                              onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                            />
                          ) : (
                            <span
                              className="text-sm text-center"
                              style={ { color: rowErrors.arrival_time ? "var(--severity-critical)" : "var(--text-muted)" } }
                              onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { arrival_time: true } }))}
                            >
                              {row.arrival_time}
                            </span>
                          )}
                          {rowErrors.arrival_time && (
                            <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.arrival_time}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isRowEditing.burst_time ? (
                            <input
                              type="number"
                              className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
                              value={row.burst_time}
                              onChange={(e) => handleCellChange(index, "burst_time", e.target.value)}
                              onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                            />
                          ) : (
                            <span
                              className="text-sm text-center font-mono"
                              style={ { color: rowErrors.burst_time ? "var(--severity-critical)" : "var(--text)" } }
                              onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { burst_time: true } }))}
                            >
                              {row.burst_time}
                            </span>
                          )}
                          {rowErrors.burst_time && (
                            <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.burst_time}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isRowEditing.priority ? (
                            <input
                              type="number"
                              className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
                              value={row.priority}
                              onChange={(e) => handleCellChange(index, "priority", e.target.value)}
                              onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                            />
                          ) : (
                            <span
                              className="text-sm text-center badge"
                              style={
                                {
                                  color:
                                    row.priority <= 1 ? "var(--severity-low)" :
                                    row.priority <= 3 ? "var(--severity-medium)" :
                                    "var(--severity-high)",
                                  borderColor:
                                    row.priority <= 1 ? "var(--severity-low)" :
                                    row.priority <= 3 ? "var(--severity-medium)" :
                                    "var(--severity-high)",
                                  background:
                                    row.priority <= 1 ? "rgba(34,197,94,0.12)" :
                                    row.priority <= 3 ? "rgba(234,179,8,0.12)" :
                                    "rgba(239,68,68,0.12)",
                                }
                              }
                              onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { priority: true } }))}
                            >
                              {row.priority}
                            </span>
                          )}
                          {rowErrors.priority && (
                            <p className="text-[10px] text-[#ef4444] mt-1">{rowErrors.priority}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteRow(index)}
                            className="text-[#64748b] hover:text-[#ef4444] hover:bg-[#111c2e] rounded p-1.5 transition"
                            title="Delete row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <Save className="h-4 w-4" /> Apply Changes & Recalculate
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="btn btn-ghost px-6 py-2.5"
                >
                  <Download className="h-4 w-4" /> Download workload CSV
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
