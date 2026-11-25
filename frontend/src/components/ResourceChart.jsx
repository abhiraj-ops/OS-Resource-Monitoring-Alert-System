import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer as RC } from "recharts";

export default function ResourceChart({ data }) {
  return (
    <article className="panel p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="eyebrow">PERFORMANCE</p>
            <h2 className="section-title">Resource usage</h2>
          </div>
          <span className="badge shrink-0" style={ { color: "var(--severity-low)", borderColor: "var(--severity-low)", background: "rgba(34,197,94,0.12)" } }>
            LIVE
          </span>
        </div>
        <p className="muted mt-2 text-xs">CPU and RAM utilization over time</p>
      </div>

      <div className="mt-4 h-72">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#65e6bd" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#65e6bd" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7ca8ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7ca8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                unit="%"
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--panel-inner)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--text)",
                }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [`${value}%`]}
              />
              <Legend wrapperStyle={{ color: "#aebbd0", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke="#65e6bd"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#65e6bd" }}
                fillOpacity={1}
                fill="url(#colorCpu)"
              />
              <Line
                type="monotone"
                dataKey="ram"
                name="RAM"
                stroke="#7ca8ff"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#7ca8ff" }}
                fillOpacity={1}
                fill="url(#colorRam)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[#334155] p-4 text-center">
            <span className="text-xs text-[#64748b]">No metric history available yet.</span>
          </div>
        )}
      </div>
    </article>
  );
}
