import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const metrics = [
  { name: "CPU", value: "42%", detail: "Demo data" },
  { name: "RAM", value: "6.4 GB", detail: "of 16 GB · Demo data" },
  { name: "Disk", value: "58%", detail: "Demo data" },
  { name: "Network", value: "24 MB/s", detail: "Demo data" },
];

const processes = [
  { pid: 1840, name: "chrome.exe", cpu: "12.4%", memory: "1.2 GB", status: "Running" },
  { pid: 2316, name: "Code.exe", cpu: "8.1%", memory: "864 MB", status: "Running" },
  { pid: 992, name: "System", cpu: "3.2%", memory: "420 MB", status: "Running" },
  { pid: 3148, name: "explorer.exe", cpu: "1.7%", memory: "188 MB", status: "Running" },
];

const chartData = [
  { time: "10:00", cpu: 32, ram: 48 },
  { time: "10:05", cpu: 45, ram: 51 },
  { time: "10:10", cpu: 38, ram: 49 },
  { time: "10:15", cpu: 62, ram: 56 },
  { time: "10:20", cpu: 42, ram: 53 },
  { time: "10:25", cpu: 70, ram: 61 },
  { time: "10:30", cpu: 55, ram: 58 },
];

function App() {
  return (
    <main className="page">
      <aside className="sidebar">
        <h2 className="brand"><span>◈</span> ParindeOS</h2>
        <p className="demo-label"><span className="status-dot amber" /> DEMO MODE</p>

        <nav className="navigation" aria-label="Main navigation">
          {["Overview", "Processes", "Analytics", "Alerts", "Settings"].map(
            (item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`nav-item ${index === 0 ? "selected" : ""}`}
              >
                {item}
              </a>
            ),
          )}
        </nav>

        <div className="sidebar-footer">ParindeOS Monitor<br />Version 1.0 · Preview</div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SYSTEM MONITOR / OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>
          <span className="health-badge"><span className="status-dot" /> All systems operational</span>
        </header>

        <div className="demo-notice">
          <strong>Demo preview</strong>
          <span>Showing sample metrics. Live system data is not connected.</span>
        </div>

        <section className="metrics-grid" aria-label="System metrics">
          {metrics.map((metric) => (
            <article className="panel metric-card" key={metric.name}>
              <div className="metric-topline">
                <span className="metric-icon">{metric.name.slice(0, 1)}</span>
                <span className="metric-name">{metric.name}</span>
                <span className="metric-menu">•••</span>
              </div>
              <strong className="metric-value">{metric.value}</strong>
              <div className="metric-bottom">
                <span className="status-dot" />
                <span>{metric.detail}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="middle-grid">
          <article className="panel chart-panel" id="analytics">
            <div className="section-heading">
              <div>
                <p className="eyebrow">PERFORMANCE</p>
                <h2>Resource usage</h2>
              </div>
              <span className="demo-chip">DEMO DATA</span>
            </div>
            <p className="section-description">CPU and RAM utilization over the last 30 minutes</p>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#26334a" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="time" tick={{ fill: "#8795ad", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#8795ad", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#111b2d", border: "1px solid #30405b", borderRadius: 10, color: "#f2f5fb" }}
                    labelStyle={{ color: "#9caac0" }}
                    formatter={(value) => [`${value}%`]}
                  />
                  <Legend wrapperStyle={{ color: "#aebbd0", fontSize: 12 }} />
                  <Line type="monotone" dataKey="cpu" name="CPU" stroke="#65e6bd" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="ram" name="RAM" stroke="#7ca8ff" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-footnote"><span className="status-dot" /> Sample activity · Updates are not live</div>
          </article>

          <article className="panel alerts-panel" id="alerts">
            <div className="section-heading">
              <div>
                <p className="eyebrow">NOTIFICATIONS</p>
                <h2>Recent alerts</h2>
              </div>
              <span className="alert-count">2</span>
            </div>

            <div className="alert-item warning">
              <span className="alert-symbol">!</span>
              <div>
                <strong>CPU usage elevated</strong>
                <p>Demo alert · CPU reached 78%</p>
                <small>12 minutes ago</small>
              </div>
            </div>
            <div className="alert-item success">
              <span className="alert-symbol">✓</span>
              <div>
                <strong>System scan completed</strong>
                <p>Demo alert · No issues found</p>
                <small>34 minutes ago</small>
              </div>
            </div>
            <p className="muted-note">Sample alerts only · No live alerts connected</p>
          </article>
        </section>

        <section className="panel process-panel" id="processes">
          <div className="section-heading process-heading">
            <div>
              <p className="eyebrow">SYSTEM ACTIVITY</p>
              <h2>Running processes</h2>
            </div>
            <span className="demo-chip">DEMO DATA</span>
          </div>
          <p className="section-description">Example processes and resource usage</p>

          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>PROCESS</th><th>PID</th><th>CPU USAGE</th><th>MEMORY</th><th>STATUS</th></tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <tr key={process.pid}>
                    <td><span className="process-avatar">{process.name.slice(0, 1).toUpperCase()}</span>{process.name}</td>
                    <td className="muted-cell">{process.pid}</td>
                    <td>{process.cpu}</td>
                    <td>{process.memory}</td>
                    <td><span className="running"><span className="status-dot" />{process.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">Showing 4 sample processes <span>Data is for preview only</span></div>
        </section>

        <footer className="page-footer">ParindeOS Dashboard <span>Demo interface · Not connected to live metrics</span></footer>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #090e19; color: #edf2fb; font-family: Inter, "Segoe UI", Arial, sans-serif; }
        a { color: inherit; text-decoration: none; }
        .page { min-height: 100vh; display: flex; }
        .sidebar { width: 250px; flex: 0 0 250px; min-height: 100vh; padding: 30px 18px 22px; background: #0e1727; border-right: 1px solid #202c40; display: flex; flex-direction: column; }
        .brand { margin: 0 8px; font-size: 21px; letter-spacing: -.5px; }
        .brand span { color: #67e4bd; margin-right: 7px; }
        .demo-label { margin: 34px 10px 16px; color: #f1c875; font-size: 11px; letter-spacing: 1.2px; font-weight: 700; }
        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #62e4b9; margin-right: 8px; box-shadow: 0 0 10px #62e4b955; }
        .status-dot.amber { background: #f2bf60; box-shadow: 0 0 10px #f2bf6055; }
        .navigation { display: grid; gap: 6px; }
        .nav-item { padding: 12px 14px; border-radius: 9px; color: #9eacc3; font-size: 14px; transition: .18s ease; }
        .nav-item:hover, .nav-item.selected { color: #69e6c0; background: #19303b; }
        .sidebar-footer { margin-top: auto; padding: 14px 10px 0; border-top: 1px solid #202c40; color: #77869f; font-size: 11px; line-height: 1.8; }
        .content { width: min(1440px, 100%); margin: 0 auto; padding: 36px clamp(20px, 4vw, 58px) 26px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
        .eyebrow { margin: 0 0 8px; color: #7e91b2; font-size: 10px; font-weight: 700; letter-spacing: 1.3px; }
        h1 { margin: 0; font-size: clamp(30px, 3vw, 42px); letter-spacing: -1.4px; }
        h2 { margin: 0; font-size: 18px; letter-spacing: -.3px; }
        .health-badge { border: 1px solid #245047; background: #112b2a; padding: 10px 14px; border-radius: 30px; color: #76e8c4; font-size: 12px; white-space: nowrap; }
        .demo-notice { display: flex; gap: 10px; align-items: center; padding: 13px 16px; border: 1px solid #58482a; background: #282316; color: #eacb82; border-radius: 10px; font-size: 13px; margin-bottom: 18px; }
        .demo-notice strong { color: #ffd77e; }
        .panel { background: #111b2c; border: 1px solid #25334b; border-radius: 13px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 16px; }
        .metric-card { padding: 17px 18px; min-height: 132px; }
        .metric-topline { display: flex; align-items: center; gap: 9px; color: #9eacc3; font-size: 12px; }
        .metric-icon { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: #1b3040; color: #69e6c0; font-weight: 700; }
        .metric-menu { margin-left: auto; letter-spacing: 2px; color: #65748d; }
        .metric-value { display: block; margin: 12px 0 8px; font-size: 27px; letter-spacing: -.6px; }
        .metric-bottom { color: #8998b1; font-size: 11px; }
        .metric-bottom .status-dot { width: 6px; height: 6px; margin-right: 5px; }
        .middle-grid { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(270px, 1fr); gap: 16px; margin-bottom: 16px; }
        .chart-panel, .alerts-panel, .process-panel { padding: 20px; }
        .section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .section-heading .eyebrow { margin-bottom: 6px; }
        .section-description { margin: 8px 0 0; color: #8190a9; font-size: 12px; }
        .demo-chip { border: 1px solid #33425b; background: #182439; color: #9aabc4; padding: 6px 8px; border-radius: 6px; font-size: 9px; font-weight: 700; letter-spacing: .8px; white-space: nowrap; }
        .chart-wrap { width: 100%; height: 245px; margin-top: 16px; }
        .chart-footnote { padding-top: 10px; border-top: 1px solid #202d41; color: #7f8da5; font-size: 11px; }
        .chart-footnote .status-dot { width: 6px; height: 6px; }
        .alert-count { display: grid; place-items: center; width: 25px; height: 25px; border-radius: 8px; background: #342b1d; color: #efc56f; font-size: 12px; }
        .alert-item { display: flex; gap: 11px; padding: 14px 11px; margin-top: 13px; background: #182337; border: 1px solid #26344b; border-radius: 9px; }
        .alert-symbol { display: grid; place-items: center; flex: 0 0 23px; height: 23px; border-radius: 50%; font-weight: 700; font-size: 13px; }
        .warning .alert-symbol { background: #41351f; color: #f0c56d; }
        .success .alert-symbol { background: #18382f; color: #6ee1b4; }
        .alert-item strong { font-size: 12px; }
        .alert-item p { margin: 5px 0; color: #9aa8bd; font-size: 11px; line-height: 1.4; }
        .alert-item small { color: #75849d; font-size: 10px; }
        .muted-note { margin: 14px 2px 0; color: #77869e; font-size: 10px; }
        .process-panel { margin-bottom: 16px; }
        .table-scroll { overflow-x: auto; margin-top: 17px; }
        table { width: 100%; min-width: 600px; border-collapse: collapse; text-align: left; }
        th { padding: 11px 12px; color: #7f8da5; font-size: 9px; letter-spacing: 1px; font-weight: 700; border-bottom: 1px solid #2a374c; }
        td { padding: 13px 12px; color: #d8e0ed; font-size: 12px; border-bottom: 1px solid #202d41; }
        tbody tr:last-child td { border-bottom: 0; }
        td:first-child { font-weight: 600; }
        .process-avatar { display: inline-grid; place-items: center; width: 26px; height: 26px; margin-right: 10px; border-radius: 7px; background: #1c3041; color: #73dfc0; font-size: 11px; }
        .muted-cell { color: #8593aa; }
        .running { color: #7fe0bb; font-size: 11px; }
        .running .status-dot { width: 6px; height: 6px; margin-right: 6px; }
        .table-footer { display: flex; justify-content: space-between; gap: 10px; padding-top: 12px; border-top: 1px solid #202d41; color: #77869e; font-size: 10px; }
        .page-footer { display: flex; justify-content: space-between; gap: 12px; color: #738199; font-size: 10px; padding: 3px 2px; }
        .page-footer span { color: #5f6e85; }
        @media (max-width: 1000px) {
          .sidebar { width: 205px; flex-basis: 205px; }
          .content { padding-left: 24px; padding-right: 24px; }
          .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .middle-grid { grid-template-columns: minmax(0, 1.5fr) minmax(240px, 1fr); }
        }
        @media (max-width: 720px) {
          .page { display: block; }
          .sidebar { width: 100%; min-height: 0; padding: 14px 16px 10px; border-right: 0; border-bottom: 1px solid #202c40; }
          .brand { margin: 0 2px; font-size: 18px; }
          .demo-label, .sidebar-footer { display: none; }
          .navigation { display: flex; gap: 5px; overflow-x: auto; margin-top: 12px; padding-bottom: 3px; }
          .nav-item { flex: 0 0 auto; padding: 9px 11px; font-size: 12px; }
          .content { padding: 23px 15px 20px; }
          .topbar { align-items: flex-start; flex-direction: column; margin-bottom: 17px; }
          .health-badge { font-size: 11px; }
          .demo-notice { align-items: flex-start; flex-direction: column; gap: 4px; font-size: 12px; }
          .metrics-grid { gap: 10px; }
          .metric-card { min-height: 119px; padding: 14px; }
          .metric-value { font-size: 23px; }
          .middle-grid { grid-template-columns: 1fr; gap: 12px; }
          .chart-panel, .alerts-panel, .process-panel { padding: 16px; }
          .chart-wrap { height: 220px; }
          .page-footer { flex-direction: column; }
          .table-footer { flex-direction: column; }
        }
        @media (max-width: 380px) {
          .metrics-grid { grid-template-columns: 1fr; }
          .metric-card { min-height: 105px; }
        }
      `}</style>
    </main>
  );
}

export default App;