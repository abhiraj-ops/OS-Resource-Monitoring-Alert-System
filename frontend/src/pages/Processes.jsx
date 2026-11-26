import { useState, useCallback, useMemo, useEffect } from "react";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import useDashboardData from "../hooks/useDashboardData.js";
import { AnnounceToScreenReader } from "../components/AnnounceToScreenReader.jsx";
import { Save, Plus, Trash2, Download, Play, RefreshCw, Timer, Cpu, BarChart3 } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

const initialProcesses = [
  { pid: "P1", arrival_time: 0, burst_time: 5, priority: 2 },
  { pid: "P2", arrival_time: 1, burst_time: 3, priority: 1 },
  { pid: "P3", arrival_time: 2, burst_time: 8, priority: 3 },
  { pid: "P4", arrival_time: 3, burst_time: 6, priority: 2 },
];

const ALGORITHMS = [
  { key: "fcfs", label: "FCFS (First Come First Served)", type: "non-preemptive" },
  { key: "sjf", label: "SJF (Shortest Job First)", type: "non-preemptive" },
  { key: "priority", label: "Priority Scheduling", type: "non-preemptive" },
  { key: "rr", label: "Round Robin", type: "preemptive" },
  { key: "srtf", label: "SRTF (Shortest Remaining Time First)", type: "preemptive" },
];

// ---------------------------------------------------------------------------
// Scheduling engines
// ---------------------------------------------------------------------------

function simulateFCFS(processes) {
  const proc = processes.map((p, i) => ({ ...p, index: i, remaining: p.burst_time }));
  proc.sort((a, b) => a.arrival_time - b.arrival_time || a.index - b.index);

  let time = 0;
  const gantt = [];
  const results = proc.map((p) => ({ ...p, start: null, end: null, rt: null }));

  for (const p of results) {
    if (time < p.arrival_time) time = p.arrival_time;
    p.start = time;
    p.rt = time - p.arrival_time;
    gantt.push({ pid: p.pid, start: time, end: time + p.burst_time });
    time += p.burst_time;
    p.end = time;
  }

  results.forEach((p) => {
    p.ct = p.end;
    p.tat = p.ct - p.arrival_time;
    p.wt = p.tat - p.burst_time;
  });

  return { results, gantt };
}

function simulateSJF(processes) {
  const proc = processes.map((p, i) => ({ ...p, index: i, remaining: p.burst_time }));
  let time = 0;
  const remaining = [...proc];
  const completed = [];
  const gantt = [];
  const results = proc.map((p) => ({ ...p, start: null, end: null, rt: null }));

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrival_time <= time);
    if (available.length === 0) {
      time = Math.min(...remaining.map((p) => p.arrival_time));
      continue;
    }
    available.sort((a, b) => a.burst_time - b.burst_time || a.index - b.index);
    const p = available[0];
    if (p.start === null) {
      p.start = time;
      p.rt = time - p.arrival_time;
    }
    gantt.push({ pid: p.pid, start: time, end: time + p.burst_time });
    time += p.burst_time;
    p.end = time;
    completed.push(p);
    remaining.splice(remaining.indexOf(p), 1);
  }

  completed.forEach((p) => {
    p.ct = p.end;
    p.tat = p.ct - p.arrival_time;
    p.wt = p.tat - p.burst_time;
  });

  return { results: completed, gantt };
}

function simulatePriority(processes) {
  const proc = processes.map((p, i) => ({ ...p, index: i, remaining: p.burst_time }));
  let time = 0;
  const remaining = [...proc];
  const completed = [];
  const gantt = [];
  const results = proc.map((p) => ({ ...p, start: null, end: null, rt: null }));

  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrival_time <= time);
    if (available.length === 0) {
      time = Math.min(...remaining.map((p) => p.arrival_time));
      continue;
    }
    available.sort((a, b) => a.priority - b.priority || a.index - b.index);
    const p = available[0];
    if (p.start === null) {
      p.start = time;
      p.rt = time - p.arrival_time;
    }
    gantt.push({ pid: p.pid, start: time, end: time + p.burst_time });
    time += p.burst_time;
    p.end = time;
    completed.push(p);
    remaining.splice(remaining.indexOf(p), 1);
  }

  completed.forEach((p) => {
    p.ct = p.end;
    p.tat = p.ct - p.arrival_time;
    p.wt = p.tat - p.burst_time;
  });

  return { results: completed, gantt };
}

function simulateRoundRobin(processes, quantum) {
  const proc = processes.map((p, i) => ({ ...p, index: i, remaining: p.burst_time, start: null, rt: null }));
  let time = 0;
  const queue = [];
  const remaining = [...proc].sort((a, b) => a.arrival_time - b.arrival_time || a.index - b.index);
  const completed = [];
  const gantt = [];
  let lastPid = null;

  const enqueueArrivals = (t) => {
    while (remaining.length > 0 && remaining[0].arrival_time <= t) {
      queue.push(remaining.shift());
    }
  };

  enqueueArrivals(time);

  while (queue.length > 0 || remaining.length > 0) {
    if (queue.length === 0) {
      time = remaining[0].arrival_time;
      enqueueArrivals(time);
      continue;
    }

    const p = queue.shift();
    if (p.start === null) {
      p.start = time;
      p.rt = time - p.arrival_time;
    }

    const slice = Math.min(quantum, p.remaining);
    if (lastPid !== p.pid) {
      gantt.push({ pid: p.pid, start: time, end: time + slice });
      lastPid = p.pid;
    } else {
      gantt[gantt.length - 1].end = time + slice;
    }

    time += slice;
    p.remaining -= slice;
    enqueueArrivals(time);

    if (p.remaining <= 0) {
      p.end = time;
      completed.push(p);
      lastPid = null;
    } else {
      queue.push(p);
    }
  }

  completed.forEach((p) => {
    p.ct = p.end;
    p.tat = p.ct - p.arrival_time;
    p.wt = p.tat - p.burst_time;
  });

  return { results: completed, gantt };
}

function simulateSRTF(processes) {
  const proc = processes.map((p, i) => ({ ...p, index: i, remaining: p.burst_time, start: null, rt: null }));
  let time = 0;
  const remaining = [...proc].sort((a, b) => a.arrival_time - b.arrival_time || a.index - b.index);
  const ready = [];
  const completed = [];
  const gantt = [];
  let current = null;
  let lastPid = null;

  const enqueueArrivals = (t) => {
    while (remaining.length > 0 && remaining[0].arrival_time <= t) {
      ready.push(remaining.shift());
    }
  };

  enqueueArrivals(time);

  while (ready.length > 0 || remaining.length > 0 || current) {
    if (current) ready.push(current);
    current = null;

    if (ready.length === 0) {
      time = remaining[0].arrival_time;
      enqueueArrivals(time);
      continue;
    }

    ready.sort((a, b) => a.remaining - b.remaining || a.index - b.index);
    current = ready.shift();

    if (current.start === null) {
      current.start = time;
      current.rt = time - current.arrival_time;
    }

    const nextArrival = remaining.length > 0 ? remaining[0].arrival_time : Infinity;
    const slice = Math.min(current.remaining, nextArrival - time);

    if (lastPid !== current.pid) {
      gantt.push({ pid: current.pid, start: time, end: time + slice });
      lastPid = current.pid;
    } else {
      gantt[gantt.length - 1].end = time + slice;
    }

    time += slice;
    current.remaining -= slice;
    enqueueArrivals(time);

    if (current.remaining <= 0) {
      current.end = time;
      completed.push(current);
      lastPid = null;
    }
  }

  completed.forEach((p) => {
    p.ct = p.end;
    p.tat = p.ct - p.arrival_time;
    p.wt = p.tat - p.burst_time;
  });

  return { results: completed, gantt };
}

function runSimulation(processes, algorithm, quantum = 2) {
  switch (algorithm) {
    case "fcfs": return simulateFCFS(processes);
    case "sjf": return simulateSJF(processes);
    case "priority": return simulatePriority(processes);
    case "rr": return simulateRoundRobin(processes, quantum);
    case "srtf": return simulateSRTF(processes);
    default: return simulateFCFS(processes);
  }
}

function formatTime(t) {
  return t != null ? t.toFixed(1) : "—";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Processes({ supabase = null, session = null }) {
  const data = useDashboardData(supabase, session?.user?.id);
  const { theme } = useTheme();

  const [processes, setProcesses] = useState(() => {
    const saved = localStorage.getItem("os_processes");
    return saved ? JSON.parse(saved) : [...initialProcesses];
  });
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [quantum, setQuantum] = useState(2);
  const [simulation, setSimulation] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [saveMessage, setSaveMessage] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem("os_processes", JSON.stringify(processes)); } catch {}
  }, [processes]);

  // Re-run simulation when inputs change
  const simResult = useMemo(() => {
    const valid = processes.every(p => p.pid && p.arrival_time != null && p.burst_time != null && p.priority != null);
    if (!valid) return null;
    return runSimulation(processes, algorithm, algorithm === "rr" ? quantum : 2);
  }, [processes, algorithm, quantum]);

  const validateProcesses = useCallback((rows) => {
    const errors = {};
    const pids = new Set();

    rows.forEach((row, index) => {
      const rowErrors = {};

      if (!row.pid || String(row.pid).trim() === "") {
        rowErrors.pid = "Process ID is required";
      } else if (pids.has(String(row.pid).trim())) {
        rowErrors.pid = "PID must be unique";
      } else {
        pids.add(String(row.pid).trim());
      }

      if (row.arrival_time === "" || row.arrival_time === null) {
        rowErrors.arrival_time = "Arrival time required";
      } else if (isNaN(Number(row.arrival_time)) || Number(row.arrival_time) < 0) {
        rowErrors.arrival_time = "Arrival time >= 0";
      }

      if (row.burst_time === "" || row.burst_time === null) {
        rowErrors.burst_time = "Burst time required";
      } else if (isNaN(Number(row.burst_time)) || Number(row.burst_time) <= 0) {
        rowErrors.burst_time = "Burst time > 0";
      }

      if (row.priority === "" || row.priority === null) {
        rowErrors.priority = "Priority required";
      } else if (isNaN(Number(row.priority)) || Number(row.priority) < 0) {
        rowErrors.priority = "Priority >= 0";
      }

      if (Object.keys(rowErrors).length > 0) errors[index] = rowErrors;
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
      next.push({ pid: `P${next.length + 1}`, arrival_time: 0, burst_time: 1, priority: 1 });
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
      setSaveMessage({ type: "error", text: "Please fix validation errors before simulating." });
      setTimeout(() => setSaveMessage(null), 4000);
      return;
    }
    setValidationErrors({});
    setSaveMessage({ type: "success", text: "Processes updated. Simulation recalculated." });
    setTimeout(() => setSaveMessage(null), 3000);
  }, [processes, validateProcesses]);

  const handleDownloadCSV = useCallback(() => {
    if (!simulation) return;
    const headers = ["PID", "Arrival", "Burst", "Priority", "CT", "TAT", "WT", "RT"];
    const rows = simulation.results.map(p => [
      p.pid, p.arrival_time, p.burst_time, p.priority,
      formatTime(p.ct), formatTime(p.tat), formatTime(p.wt), formatTime(p.rt),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "process-simulation.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [simulation]);

  const avgStats = useMemo(() => {
    if (!simulation) return null;
    const n = simulation.results.length;
    return {
      avgCT: simulation.results.reduce((s, p) => s + Number(p.ct || 0), 0) / n,
      avgTAT: simulation.results.reduce((s, p) => s + Number(p.tat || 0), 0) / n,
      avgWT: simulation.results.reduce((s, p) => s + Number(p.wt || 0), 0) / n,
      avgRT: simulation.results.reduce((s, p) => s + Number(p.rt || 0), 0) / n,
    };
  }, [simulation]);

  const algoInfo = ALGORITHMS.find(a => a.key === algorithm);
  const isPreemptive = algoInfo?.type === "preemptive";
  const showQuantum = algorithm === "rr";

  return (
    <main className="flex min-h-screen max-[720px]:block">
      <AnnounceToScreenReader announcement="CPU Scheduling Simulation page" />
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,58px)] pb-[26px] pt-9 max-[720px]:px-[15px] max-[720px]:py-[23px]">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">CPU SCHEDULING SIMULATOR</p>
            <h1 className="text-2xl font-bold">Process Scheduling</h1>
            <p className="text-xs text-[#64748b] mt-1">
              Edit any cell, add or delete rows, pick an algorithm, and view CT, WT, TAT, RT with Gantt chart.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${data.realtimeStatus === "online" ? "" : "amber"}`} />
            {data.realtimeStatus === "online" ? "Live" : "Offline"}
          </div>
        </div>

        {data.error && <ErrorMessage message={data.error} onDismiss={() => {}} />}

        {/* Controls */}
        <section className="mb-6 panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
          <div className="grid gap-4 md:grid-cols-12 items-end">
            <div className="md:col-span-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
              >
                {ALGORITHMS.map(a => (
                  <option key={a.key} value={a.key}>{a.label}</option>
                ))}
              </select>
            </div>
            {showQuantum && (
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">Time Quantum</label>
                <input
                  type="number"
                  value={quantum}
                  onChange={(e) => setQuantum(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-md border border-[#30405b] bg-[#0c1422] px-3 py-2 text-sm text-white outline-none focus:border-[#65e6bd]"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block mb-1">Mode</label>
              <span className="badge shrink-0" style={ { color: isPreemptive ? "var(--severity-high)" : "var(--severity-low)", borderColor: isPreemptive ? "var(--severity-high)" : "var(--severity-low)", background: isPreemptive ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)" } }>
                {isPreemptive ? "PREEMPTIVE" : "NON-PREEMPTIVE"}
              </span>
            </div>
            <div className="md:col-span-5 flex items-end gap-2">
              <button
                onClick={handleApply}
                className="btn btn-primary px-6 py-2.5"
              >
                <Save className="h-4 w-4" /> Apply & Simulate
              </button>
              <button
                onClick={handleDownloadCSV}
                disabled={!simulation}
                className="btn btn-ghost px-6 py-2.5"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
              <button
                onClick={() => setSimulation(null)}
                className="btn btn-ghost px-3 py-2.5"
                title="Reset simulation"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {saveMessage && (
          <div className="mb-4 rounded-xl border p-3 flex items-center gap-2"
            style={ saveMessage.type === "success"
              ? { borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.10)" }
              : { borderColor: "var(--severity-critical)", background: "rgba(239,68,68,0.10)" } }>
            <span className="h-5 w-5 rounded-full flex items-center justify-center" style={ { background: saveMessage.type === "success" ? "var(--severity-low)" : "var(--severity-critical)" } }>
              {saveMessage.type === "success" ? "✓" : "⚠"}
            </span>
            <span className="text-sm" style={ { color: saveMessage.type === "success" ? "var(--severity-low)" : "var(--severity-critical)" } }>
              {saveMessage.text}
            </span>
          </div>
        )}

        {/* Process Table - Fully Editable */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="eyebrow">PROCESS TABLE</p>
              <h2 className="section-title">Editable Process Inputs</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={addRow} className="btn btn-ghost flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Row
              </button>
            </div>
          </div>
          <p className="muted mt-2 text-xs mb-3">
            Double-click any cell to edit. PID must be unique; Arrival &gt;= 0; Burst &gt; 0; Priority &gt;= 0.
          </p>

          <div className="rounded-xl border overflow-hidden" style={ { borderColor: "var(--border)" } }>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">PID</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Arrival Time</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Burst Time</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Priority</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processes.length ? processes.map((row, index) => {
                  const rowErrors = validationErrors[index] || {};
                  const isRowEditing = isEditing[index] || {};
                  return (
                    <tr key={index} className="border-b border-[#1e293b] hover:bg-[#111c2e]/40 transition group">
                      <td className="px-4 py-3">
                        {isRowEditing.pid ? (
                          <input
                            autoFocus className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center font-mono"
                            value={row.pid}
                            onChange={(e) => handleCellChange(index, "pid", e.target.value)}
                            onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                          />
                        ) : (
                          <span
                            className="text-sm font-mono text-center"
                            style={ { color: rowErrors.pid ? "var(--severity-critical)" : "var(--text)" } }
                            onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { pid: true } }))}
                          >
                            {row.pid}
                          </span>
                        )}
                        {rowErrors.pid && <p className="text-[10px] text-[#ef4444] mt-1 text-center">{rowErrors.pid}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {isRowEditing.arrival_time ? (
                          <input type="number" className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
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
                        {rowErrors.arrival_time && <p className="text-[10px] text-[#ef4444] mt-1 text-center">{rowErrors.arrival_time}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {isRowEditing.burst_time ? (
                          <input type="number" className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center font-mono"
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
                        {rowErrors.burst_time && <p className="text-[10px] text-[#ef4444] mt-1 text-center">{rowErrors.burst_time}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {isRowEditing.priority ? (
                          <input type="number" className="w-full bg-transparent border-none text-sm outline-none focus:ring-1 focus:ring-[#65e6bd] rounded px-2 text-center"
                            value={row.priority}
                            onChange={(e) => handleCellChange(index, "priority", e.target.value)}
                            onBlur={() => setIsEditing((prev) => ({ ...prev, [index]: {} }))}
                          />
                        ) : (
                          <span
                            className="text-sm text-center badge"
                            style={ {
                              color: row.priority <= 1 ? "var(--severity-low)" : row.priority <= 3 ? "var(--severity-medium)" : "var(--severity-high)",
                              borderColor: row.priority <= 1 ? "var(--severity-low)" : row.priority <= 3 ? "var(--severity-medium)" : "var(--severity-high)",
                              background: row.priority <= 1 ? "rgba(34,197,94,0.12)" : row.priority <= 3 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)",
                            } }
                            onDoubleClick={() => setIsEditing((prev) => ({ ...prev, [index]: { priority: true } }))}
                          >
                            {row.priority}
                          </span>
                        )}
                        {rowErrors.priority && <p className="text-[10px] text-[#ef4444] mt-1 text-center">{rowErrors.priority}</p>}
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
                }) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-[#64748b]">No processes added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Simulation Results */}
        {simulation && (
          <>
            {/* Average Stats */}
            <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Avg CT", value: formatTime(avgStats?.avgCT), icon: <Timer className="h-5 w-5" /> },
                { label: "Avg TAT", value: formatTime(avgStats?.avgTAT), icon: <Cpu className="h-5 w-5" /> },
                { label: "Avg WT", value: formatTime(avgStats?.avgWT), icon: <BarChart3 className="h-5 w-5" /> },
                { label: "Avg RT", value: formatTime(avgStats?.avgRT), icon: <Timer className="h-5 w-5" /> },
              ].map((stat) => (
                <div key={stat.label} className="panel p-4 rounded-xl border" style={ { borderColor: "var(--border)" } }>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={ { background: "color-mix(in srgb, var(--accent) 15%, transparent)" } }>
                        {stat.icon}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={ { color: "var(--text-muted)" } }>{stat.label}</span>
                    </div>
                    <span className="text-xl font-extrabold font-mono" style={ { color: "var(--text)" } }>{stat.value}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* Gantt Chart */}
            <section className="mb-6 panel p-5 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="eyebrow">GANTT CHART</p>
                  <h2 className="section-title">Execution Timeline</h2>
                </div>
                <span className="badge shrink-0" style={ { color: "var(--accent)", borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 14%, transparent)" } }>
                  {algorithm.toUpperCase()}
                </span>
              </div>
              <div className="h-32 flex items-end gap-1 overflow-x-auto pb-4 no-scrollbar rounded-b-xl border border-[#1e293b] bg-[#0c1422]">
                {simulation.gantt.map((segment, i) => {
                  const width = segment.end - segment.start;
                  const totalTime = simulation.gantt[simulation.gantt.length - 1].end;
                  const pct = (width / totalTime) * 100;
                  const left = (segment.start / totalTime) * 100;
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <div
                        className="h-full shrink-0 rounded-t-lg border border-[#1e293b]/50 text-[10px] font-bold text-center flex items-center justify-center"
                        style={
                          {
                            width: `${Math.max(pct, 6)}%`,
                            left: `${left}%`,
                            background: `color-mix(in srgb, var(--accent) 20%, transparent)`,
                            color: "var(--accent)",
                          }
                        }
                      >
                        {segment.pid}
                      </div>
                      <div className="absolute -top-6 w-full text-[10px] text-[#64748b] text-left pl-1">
                        {segment.start}
                      </div>
                      {i === simulation.gantt.length - 1 && (
                        <div className="absolute -top-6 right-0 w-full text-[10px] text-[#64748b] text-right pr-1">{segment.end}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[#64748b]">
                Time axis: 0 → {simulation.gantt[simulation.gantt.length - 1]?.end}. Each block shows process execution.
              </p>
            </section>

            {/* Results Table */}
            <section className="mb-6 panel p-5 rounded-xl border" style={ { borderColor: "var(--border)" } }>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="eyebrow">RESULTS</p>
                  <h2 className="section-title">Process Completion Table</h2>
                </div>
                <span className="badge shrink-0" style={ { color: "var(--severity-low)", borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.12)" } }>
                  {simulation.results.length} completed
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">PID</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Arrival</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Burst</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">Priority</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">CT</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">TAT</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">WT</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] bg-[#0c1422]">RT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.results.map((p) => (
                      <tr key={p.pid} className="border-b border-[#1e293b] hover:bg-[#111c2e]/30 transition">
                        <td className="px-4 py-3 text-sm font-mono">{p.pid}</td>
                        <td className="px-4 py-3 text-sm text-center">{p.arrival_time}</td>
                        <td className="px-4 py-3 text-sm text-center">{p.burst_time}</td>
                        <td className="px-4 py-3 text-sm text-center">{p.priority}</td>
                        <td className="px-4 py-3 text-sm font-mono">{formatTime(p.ct)}</td>
                        <td className="px-4 py-3 text-sm font-mono">{formatTime(p.tat)}</td>
                        <td className="px-4 py-3 text-sm font-mono">{formatTime(p.wt)}</td>
                        <td className="px-4 py-3 text-sm font-mono">{formatTime(p.rt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {!processes.length && (
          <EmptyState title="No processes" message="Add processes to begin scheduling simulation." icon="⚙" actionLabel="Add Process" action={addRow} />
        )}
      </div>
    </main>
  );
}
