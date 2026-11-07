import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function ResourceChart({ data, demoMode }) {
  return <article className="panel p-5 max-[720px]:p-4" id="analytics">
    <div className="flex items-center justify-between gap-3"><div><p className="eyebrow !mb-1.5">PERFORMANCE</p><h2 className="section-title">Resource usage</h2></div><span className="demo-chip">DEMO DATA</span></div>
    <p className="muted mt-2 text-xs">CPU and RAM utilization over the last 30 minutes</p>
    <div className="chart-wrap">{data.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
      <CartesianGrid stroke="#26334a" strokeDasharray="3 5" vertical={false} />
      <XAxis dataKey="time" tick={{ fill: "#8795ad", fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#8795ad", fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ background: "#111b2d", border: "1px solid #30405b", borderRadius: 10, color: "#f2f5fb" }} labelStyle={{ color: "#9caac0" }} formatter={value => [`${value}%`]} />
      <Legend wrapperStyle={{ color: "#aebbd0", fontSize: 12 }} />
      <Line type="monotone" dataKey="cpu" name="CPU" stroke="#65e6bd" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
      <Line type="monotone" dataKey="ram" name="RAM" stroke="#7ca8ff" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
    </LineChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-center text-xs text-[#8190a9]">No metric history is available for this system yet.</div>}</div>
    <div className="border-t border-[#202d41] pt-2.5 text-[11px] text-[#7f8da5]"><span className={`status-dot !size-1.5 ${demoMode ? "amber" : ""}`} />{demoMode ? "Sample activity · Updates are not live" : "Live database history · Hover a point for details"}</div>
  </article>;
}
