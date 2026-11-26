"""
OS Resource Monitoring & Alert System — Streamlit App
Deploy on Streamlit Cloud: https://share.streamlit.io/
Repo: https://github.com/abhiraj-ops/OS-Resource-Monitoring-Alert-System
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import json
import os

# ---------------------------------------------------------------------------
# Page config
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="OS Resource Monitor",
    page_icon="🖥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------------------------------------------------------------------------
# Theme CSS (4 themes: midnight, aurora, frost, graphite)
# ---------------------------------------------------------------------------
THEME_CSS = {
    "midnight": """
        :root {
            --bg: #0a0f1d; --panel: #0f172a; --panel-inner: #111c2e;
            --border: #1e293b; --text: #f1f5f9; --text-muted: #94a3b8;
            --accent: #0ea5e9; --accent-strong: #0284c7;
            --severity-low: #22c55e; --severity-high: #f59e0b;
            --severity-critical: #ef4444;
        }
    """,
    "aurora": """
        :root {
            --bg: #060b16; --panel: #0f172a; --panel-inner: #111c2e;
            --border: #1e293b; --text: #f1f5f9; --text-muted: #94a3b8;
            --accent: #10b981; --accent-strong: #059669;
            --severity-low: #22c55e; --severity-high: #f59e0b;
            --severity-critical: #ef4444;
        }
    """,
    "frost": """
        :root {
            --bg: #eef4fb; --panel: #ffffff; --panel-inner: #f8fafc;
            --border: #cbd5e1; --text: #0f172a; --text-muted: #64748b;
            --accent: #0369a1; --accent-strong: #0284c7;
            --severity-low: #16a34a; --severity-high: #d97706;
            --severity-critical: #dc2626;
        }
    """,
    "graphite": """
        :root {
            --bg: #050607; --panel: #0a0a0a; --panel-inner: #0f0f0f;
            --border: #27272a; --text: #fafafa; --text-muted: #a1a1aa;
            --accent: #a1a1aa; --accent-strong: #d4d4d8;
            --severity-low: #22c55e; --severity-high: #f59e0b;
            --severity-critical: #ef4444;
        }
    """,
}

THEME_INFO = {
    "midnight": {"label": "Midnight", "hint": "Deep navy with cyan glows"},
    "aurora": {"label": "Aurora", "hint": "Teal and violet gradients"},
    "frost": {"label": "Frost", "hint": "Light glass, soft blue and white"},
    "graphite": {"label": "Graphite", "hint": "Near-black, high contrast"},
}

THEMES = list(THEME_INFO.keys())

# ---------------------------------------------------------------------------
# Session state init
# ---------------------------------------------------------------------------
def init_state():
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False
    if "user" not in st.session_state:
        st.session_state.user = None
    if "theme" not in st.session_state:
        st.session_state.theme = "midnight"
    if "page" not in st.session_state:
        st.session_state.page = "Dashboard"
    if "live" not in st.session_state:
        st.session_state.live = False
    if "metrics" not in st.session_state:
        st.session_state.metrics = []
    if "alerts" not in st.session_state:
        st.session_state.alerts = []
    if "processes" not in st.session_state:
        st.session_state.processes = []
    if "systems" not in st.session_state:
        st.session_state.systems = []
    if "selected_system" not in st.session_state:
        st.session_state.selected_system = None

init_state()

# ---------------------------------------------------------------------------
# Demo data seed
# ---------------------------------------------------------------------------
def seed_data():
    now = datetime.now()
    if not st.session_state.systems:
        st.session_state.systems = [{
            "id": "sys-001",
            "hostname": "ubuntu-server-01",
            "display_name": "Production Web Server",
            "operating_system": "Ubuntu",
            "os_version": "22.04 LTS",
            "status": "online",
            "last_seen_at": now.isoformat(),
        }]
    if not st.session_state.metrics:
        base = now
        metrics = []
        for i in range(30):
            t = base - timedelta(minutes=29 - i)
            cpu = 20 + 25 * np.sin(i / 5) + 10 * np.random.rand()
            ram = 45 + 20 * np.cos(i / 7) + 10 * np.random.rand()
            metrics.append({
                "time": t.strftime("%H:%M"),
                "cpu": round(max(0, min(100, cpu)), 1),
                "ram": round(max(0, min(100, ram)), 1),
                "collected_at": t.isoformat(),
            })
        st.session_state.metrics = metrics
    if not st.session_state.alerts:
        st.session_state.alerts = [
            {
                "id": "a-1", "alert_type": "high_cpu_usage", "severity": "warning",
                "message": "CPU usage reached 78% on ubuntu-server-01",
                "status": "active", "triggered_at": (now - timedelta(minutes=5)).isoformat(),
                "system_id": "sys-001", "aiGenerated": True,
            },
            {
                "id": "a-2", "alert_type": "system_scan_completed", "severity": "info",
                "message": "Weekly system scan completed - no issues found",
                "status": "resolved", "triggered_at": (now - timedelta(hours=1)).isoformat(),
                "system_id": "sys-001", "aiGenerated": False,
            },
        ]
    if not st.session_state.processes:
        st.session_state.processes = [
            {"pid": 1840, "process_name": "chrome.exe", "cpu_percent": 12.4, "memory_bytes": 1200000000, "username": "demo-user"},
            {"pid": 2316, "process_name": "Code.exe", "cpu_percent": 8.1, "memory_bytes": 864000000, "username": "demo-user"},
            {"pid": 992, "process_name": "System", "cpu_percent": 3.2, "memory_bytes": 420000000, "username": "SYSTEM"},
            {"pid": 3148, "process_name": "explorer.exe", "cpu_percent": 1.7, "memory_bytes": 188000000, "username": "demo-user"},
            {"pid": 4420, "process_name": "svchost.exe", "cpu_percent": 2.5, "memory_bytes": 310000000, "username": "SYSTEM"},
        ]

seed_data()

# ---------------------------------------------------------------------------
# Auth helpers (localStorage-free, session-based demo auth)
# ---------------------------------------------------------------------------
DEMO_USER = {
    "email": "admin@os-resource-monitoring.example.com",
    "password": "admin123",
    "name": "Admin User",
}

def login(email, password):
    if email == DEMO_USER["email"] and password == DEMO_USER["password"]:
        st.session_state.authenticated = True
        st.session_state.user = {"email": email, "name": DEMO_USER["name"]}
        return True
    return False

def logout():
    st.session_state.authenticated = False
    st.session_state.user = None
    st.session_state.page = "Dashboard"

# ---------------------------------------------------------------------------
# Theme CSS injection
# ---------------------------------------------------------------------------
def inject_theme():
    theme = st.session_state.theme
    css = THEME_CSS.get(theme, THEME_CSS["midnight"])
    st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
    # Streamlit theme overrides via config.toml are not dynamic, so we inject
    # custom CSS for containers
    if theme == "frost":
        bg = "#eef4fb"; panel = "#ffffff"; text = "#0f172a"; muted = "#64748b"
    elif theme == "graphite":
        bg = "#050607"; panel = "#0a0a0a"; text = "#fafafa"; muted = "#a1a1aa"
    elif theme == "aurora":
        bg = "#060b16"; panel = "#0f172a"; text = "#f1f5f9"; muted = "#94a3b8"
    else:
        bg = "#0a0f1d"; panel = "#0f172a"; text = "#f1f5f9"; muted = "#94a3b8"

    st.markdown(f"""
    <style>
    .stApp {{ background-color: {bg}; color: {text}; }}
    .main .block-container {{ background-color: {bg}; }}
    .stMetric {{ background-color: {panel}; border: 1px solid var(--border, #1e293b);
                 border-radius: 12px; padding: 1rem; }}
    .stButton>button {{ border-radius: 8px; font-weight: 600; }}
    .stSelectbox, .stTextInput, .stNumberInput {{ border-radius: 8px; }}
    .glass {{
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 1rem;
        backdrop-filter: blur(10px);
    }}
    .status-badge {{
        display: inline-flex; align-items: center; gap: 6px;
        padding: 2px 8px; border-radius: 6px; font-size: 11px;
        font-weight: 700; text-transform: uppercase;
    }}
    .status-ok {{ background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }}
    .status-warn {{ background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }}
    .status-crit {{ background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }}
    </style>
    """, unsafe_allow_html=True)

inject_theme()

# ---------------------------------------------------------------------------
# Sidebar navigation
# ---------------------------------------------------------------------------
st.sidebar.markdown("""
<div style="display:flex; align-items:center; gap:10px; padding:1rem 0; border-bottom:1px solid var(--border);">
    <div style="width:36px;height:36px;background:linear-gradient(135deg,var(--accent-strong),var(--accent));
        border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;">OS</div>
    <div style="font-weight:700; font-size:1.1rem;">OS<span style="color:var(--accent)">Monitor</span></div>
</div>
""", unsafe_allow_html=True)

if not st.session_state.authenticated:
    st.sidebar.info("Please log in to continue.")
else:
    st.sidebar.success(f"Logged in as {st.session_state.user['email']}")

st.sidebar.markdown("### Navigation")
nav_options = ["Dashboard", "Processes", "Analytics", "Alerts", "Settings"]
for opt in nav_options:
    if st.sidebar.button(opt, key=f"nav_{opt}", use_container_width=True,
                        type="primary" if st.session_state.page == opt else "secondary"):
        st.session_state.page = opt
        st.rerun()

st.sidebar.divider()
st.sidebar.markdown("### Theme")
theme_cols = st.sidebar.columns(len(THEMES))
for i, t in enumerate(THEMES):
    if theme_cols[i].button(THEME_INFO[t]["label"], key=f"theme_{t}",
                           use_container_width=True,
                           type="primary" if st.session_state.theme == t else "secondary"):
        st.session_state.theme = t
        st.rerun()

st.sidebar.divider()
st.sidebar.markdown("### Live Simulation")
live_btn = "Stop Live" if st.session_state.live else "Start Live"
if st.sidebar.button(live_btn, key="toggle_live", use_container_width=True):
    st.session_state.live = not st.session_state.live
    st.rerun()

if st.session_state.live:
    st.sidebar.success("🟢 Live: ON")
else:
    st.sidebar.error("⚪ Live: OFF")

st.sidebar.divider()
if st.session_state.authenticated:
    if st.sidebar.button("Logout", key="btn_logout", use_container_width=True):
        logout()
        st.rerun()

# ---------------------------------------------------------------------------
# Auth screens
# ---------------------------------------------------------------------------
def show_login():
    st.markdown("## 🔐 Login")
    st.markdown("Welcome to OS Resource Monitoring & Alert System")
    with st.form("login_form"):
        email = st.text_input("Email", placeholder="admin@os-resource-monitoring.example.com")
        password = st.text_input("Password", type="password", placeholder="••••••••")
        submit = st.form_submit_button("Sign In", use_container_width=True)
        if submit:
            if not email or not password:
                st.error("Please enter both email and password.")
            elif login(email, password):
                st.success("Login successful!")
                st.rerun()
            else:
                st.error("Invalid email or password.")
    st.info("Demo credentials: admin@os-resource-monitoring.example.com / admin123")

def show_signup():
    st.markdown("## 📝 Sign Up")
    with st.form("signup_form"):
        name = st.text_input("Full Name")
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        confirm = st.text_input("Confirm Password", type="password")
        terms = st.checkbox("I agree to the Terms of Service and Privacy Policy")
        submit = st.form_submit_button("Create Account", use_container_width=True)
        if submit:
            if not all([name, email, password, confirm]):
                st.error("All fields are required.")
            elif password != confirm:
                st.error("Passwords do not match.")
            elif not terms:
                st.error("You must accept the terms and privacy policy.")
            else:
                st.success("Account created! You can now log in.")
                st.session_state.page = "Dashboard"
                st.rerun()

# ---------------------------------------------------------------------------
# Helper formatters
# ---------------------------------------------------------------------------
def format_bytes(b):
    if b is None: return "—"
    b = float(b)
    if b >= 1024**3: return f"{b/1024**3:.1f} GB"
    if b >= 1024**2: return f"{b/1024**2:.0f} MB"
    return f"{b/1024:.0f} KB"

def status_badge(severity):
    if severity in ("critical", "high"):
        return "status-crit", "CRITICAL"
    if severity in ("warning",):
        return "status-warn", "WARNING"
    return "status-ok", "OK"

# ---------------------------------------------------------------------------
# Dashboard page
# ---------------------------------------------------------------------------
def show_dashboard():
    st.markdown("## 🖥 Dashboard")
    st.markdown("Real-time system resource monitoring")

    # Live toggle status
    if st.session_state.live:
        st.success("🟢 Live simulation is running — metrics update automatically.")

    # Systems selector
    if st.session_state.systems:
        sys_options = {s["id"]: f"{s['display_name']} ({s['hostname']})" for s in st.session_state.systems}
        sel = st.selectbox("Select System", options=list(sys_options.keys()),
                           format_func=lambda x: sys_options[x],
                           index=0 if st.session_state.selected_system is None
                           else list(sys_options.keys()).index(st.session_state.selected_system)
                           if st.session_state.selected_system in sys_options else 0)
        st.session_state.selected_system = sel
    else:
        st.warning("No systems connected.")
        return

    system = next(s for s in st.session_state.systems if s["id"] == st.session_state.selected_system)
    status_class, status_label = status_badge("low")
    col_sys1, col_sys2, col_sys3 = st.columns([3, 1, 1])
    with col_sys1:
        st.markdown(f"**System:** {system['display_name']}  ·  `{system['hostname']}`")
        st.markdown(f"**OS:** {system['operating_system']} {system['os_version']}")
    with col_sys2:
        st.markdown(f"<span class='status-badge {status_class}'>{status_label}</span>", unsafe_allow_html=True)
    with col_sys3:
        if st.button("🔄 Refresh", key="refresh_dash"):
            st.rerun()

    # Metrics
    metrics = st.session_state.metrics
    if metrics:
        latest = metrics[-1]
        first = metrics[0]
        m1, m2, m3, m4 = st.columns(4)
        cpu_val = latest["cpu"]
        ram_val = latest["ram"]
        cpu_delta = cpu_val - first["cpu"]
        ram_delta = ram_val - first["ram"]

        with m1:
            st.metric("CPU", f"{cpu_val}%", delta=f"{cpu_delta:+.1f}%",
                      delta_color="inverse" if cpu_delta > 0 else "normal")
        with m2:
            st.metric("RAM", f"{ram_val}%", delta=f"{ram_delta:+.1f}%",
                      delta_color="inverse" if ram_delta > 0 else "normal")
        with m3:
            st.metric("Disk", "58%", delta="0%", delta_color="off")
        with m4:
            st.metric("Network", "24 MB/s", delta="0%", delta_color="off")

        # Resource chart
        st.markdown("### Resource Usage Over Time")
        df = pd.DataFrame(metrics)
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df["time"], y=df["cpu"], mode="lines",
                                 name="CPU %", line=dict(color="#0ea5e9", width=3),
                                 fill="tozeroy", fillcolor="rgba(14,165,233,0.2)"))
        fig.add_trace(go.Scatter(x=df["time"], y=df["ram"], mode="lines",
                                 name="RAM %", line=dict(color="#7ca8ff", width=3),
                                 fill="tozeroy", fillcolor="rgba(124,168,255,0.2)"))
        fig.update_layout(
            height=320,
            margin=dict(l=10, r=10, t=10, b=10),
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(size=11),
            legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
            xaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.1)"),
            yaxis=dict(range=[0, 100], showgrid=True, gridcolor="rgba(255,255,255,0.1)", suffix="%"),
        )
        st.plotly_chart(fig, use_container_width=True)

        # Live simulation
        if st.session_state.live:
            import time as _time
            # Simulate new metric
            last_cpu = metrics[-1]["cpu"]
            last_ram = metrics[-1]["ram"]
            new_cpu = max(0, min(100, last_cpu + (np.random.rand() - 0.5) * 12))
            new_ram = max(0, min(100, last_ram + (np.random.rand() - 0.5) * 8))
            new_time = (datetime.now()).strftime("%H:%M")
            st.session_state.metrics.append({
                "time": new_time, "cpu": round(new_cpu, 1), "ram": round(new_ram, 1),
                "collected_at": datetime.now().isoformat(),
            })
            # Keep last 60
            st.session_state.metrics = st.session_state.metrics[-60:]
            _time.sleep(2)
            st.rerun()

    # Alerts
    st.markdown("### 🚨 Alerts & Notifications")
    alerts = st.session_state.alerts
    if alerts:
        for a in alerts:
            cls, label = status_badge(a.get("severity", "info"))
            ai_tag = " <span style='color:var(--accent); font-weight:bold;'>[AI]</span>" if a.get("aiGenerated") else ""
            st.markdown(f"""
            <div class="glass" style="margin-bottom:0.75rem; padding:0.85rem; border-radius:8px;
                 border-left:4px solid {'#ef4444' if a.get('severity') in ('critical','high') else '#f59e0b' if a.get('severity')=='warning' else '#22c55e'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <div style="font-weight:700; color:var(--text);">{a.get('message','Alert')}{ai_tag}</div>
                        <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
                            {a.get('alert_type','').replace('_',' ')} · {a.get('system_id','system')[:8]} · {a.get('status','active').upper()}
                        </div>
                    </div>
                    <span class="status-badge {cls}">{label}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No active alerts.")

    # Processes preview
    st.markdown("### ⚙ Running Processes (preview)")
    procs = st.session_state.processes
    if procs:
        dfp = pd.DataFrame(procs)
        dfp["memory"] = dfp["memory_bytes"].apply(format_bytes)
        dfp["cpu"] = dfp["cpu_percent"].apply(lambda x: f"{x}%")
        st.dataframe(dfp[["process_name", "pid", "cpu", "memory", "username"]],
                     use_container_width=True, hide_index=True)
    else:
        st.info("No process data available.")

    # CSV export
    if st.button("📥 Export Dashboard CSV", key="export_dash"):
        csv = pd.DataFrame(metrics).to_csv(index=False)
        st.download_button("Download metrics.csv", data=csv,
                           file_name="os-metrics.csv", mime="text/csv")

# ---------------------------------------------------------------------------
# Processes page (fully editable)
# ---------------------------------------------------------------------------
def show_processes():
    st.markdown("## ⚙ Process Table")
    st.markdown("Edit any cell, add or delete rows. Click **Apply Changes** to save.")

    if "proc_edit" not in st.session_state:
        st.session_state.proc_edit = pd.DataFrame(st.session_state.processes)

    df = st.session_state.proc_edit.copy()

    # Validation
    errors = {}
    pids = set()
    for idx, row in df.iterrows():
        row_errs = {}
        pid = str(row.get("pid", "")).strip()
        if not pid:
            row_errs["pid"] = "PID is required"
        elif pid in pids:
            row_errs["pid"] = "PID must be unique"
        else:
            pids.add(pid)
        cpu = row.get("cpu_percent")
        if cpu is None or str(cpu) == "":
            row_errs["cpu_percent"] = "CPU is required"
        else:
            try:
                c = float(cpu)
                if c < 0: row_errs["cpu_percent"] = "CPU must be >= 0"
                elif c > 100: row_errs["cpu_percent"] = "CPU must be <= 100"
            except:
                row_errs["cpu_percent"] = "Invalid CPU value"
        mem = row.get("memory_bytes")
        if mem is None or str(mem) == "":
            row_errs["memory_bytes"] = "Memory is required"
        else:
            try:
                if float(mem) < 0: row_errs["memory_bytes"] = "Memory must be >= 0"
            except:
                row_errs["memory_bytes"] = "Invalid memory value"
        if row_errs:
            errors[idx] = row_errs

    edited = st.data_editor(
        df,
        num_rows="dynamic",
        use_container_width=True,
        hide_index=True,
        column_config={
            "process_name": st.column_config.TextColumn("Process", required=True),
            "pid": st.column_config.NumberColumn("PID", required=True, min_value=1),
            "cpu_percent": st.column_config.NumberColumn("CPU %", min_value=0, max_value=100, step=0.1),
            "memory_bytes": st.column_config.NumberColumn("Memory (bytes)", min_value=0, step=1),
            "username": st.column_config.TextColumn("User"),
        },
        key="proc_editor",
    )
    st.session_state.proc_edit = edited

    col1, col2, col3 = st.columns([1, 1, 2])
    with col1:
        if st.button("➕ Add Row", key="proc_add"):
            new_row = {"process_name": "new-process", "pid": len(edited) + 1,
                       "cpu_percent": 0.0, "memory_bytes": 0, "username": "demo-user"}
            st.session_state.proc_edit = pd.concat([edited, pd.DataFrame([new_row])],
                                                   ignore_index=True)
            st.rerun()
    with col2:
        if st.button("💾 Apply Changes", key="proc_apply", type="primary"):
            if errors:
                st.error("Please fix validation errors before applying.")
                for idx, errs in errors.items():
                    for field, msg in errs.items():
                        st.error(f"Row {idx} — {field}: {msg}")
            else:
                st.session_state.processes = edited.to_dict("records")
                st.success("Changes applied successfully!")
    with col3:
        csv = edited.to_csv(index=False)
        st.download_button("📥 Download CSV", data=csv,
                           file_name="processes.csv", mime="text/csv",
                           key="proc_download")

    if errors:
        st.warning(f"{sum(len(v) for v in errors.values())} validation error(s) found.")

# ---------------------------------------------------------------------------
# Analytics page
# ---------------------------------------------------------------------------
def show_analytics():
    st.markdown("## 📊 Performance Analytics")
    metrics = st.session_state.metrics
    if not metrics:
        st.info("No metric data available yet.")
        return

    df = pd.DataFrame(metrics)
    latest = df.iloc[-1]
    first = df.iloc[0]

    # KPI cards
    k1, k2, k3, k4 = st.columns(4)
    cpu_val = latest["cpu"]; ram_val = latest["ram"]
    with k1:
        st.metric("CPU", f"{cpu_val}%", delta=f"{cpu_val - first['cpu']:+.1f}%")
    with k2:
        st.metric("RAM", f"{ram_val}%", delta=f"{ram_val - first['ram']:+.1f}%")
    with k3:
        st.metric("Disk", "58%")
    with k4:
        st.metric("Network", "24 MB/s")

    st.divider()

    # Charts row
    c1, c2 = st.columns([2, 1])
    with c1:
        st.markdown("### CPU & RAM Trend")
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df["time"], y=df["cpu"], name="CPU %",
                                 line=dict(color="#0ea5e9", width=3),
                                 fill="tozeroy", fillcolor="rgba(14,165,233,0.15)"))
        fig.add_trace(go.Scatter(x=df["time"], y=df["ram"], name="RAM %",
                                 line=dict(color="#7ca8ff", width=3),
                                 fill="tozeroy", fillcolor="rgba(124,168,255,0.15)"))
        fig.update_layout(height=350, margin=dict(l=10, r=10, t=10, b=10),
                          plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)",
                          xaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.1)"),
                          yaxis=dict(range=[0, 100], showgrid=True,
                                     gridcolor="rgba(255,255,255,0.1)", suffix="%"))
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        st.markdown("### Disk Usage")
        fig2 = go.Figure(go.Indicator(
            mode="gauge+number", value=58,
            domain={"x": [0, 1], "y": [0, 1]},
            title={"text": "Disk Used %"},
            gauge={"axis": {"range": [0, 100]},
                   "bar": {"color": "#f59e0b"},
                   "bgcolor": "rgba(255,255,255,0.05)",
                   "bordercolor": "rgba(255,255,255,0.1)"}))
        fig2.update_layout(height=350, margin=dict(l=10, r=10, t=40, b=10),
                           paper_bgcolor="rgba(0,0,0,0)", font=dict(size=12))
        st.plotly_chart(fig2, use_container_width=True)

    st.markdown("### Resource Distribution")
    fig3 = px.pie(values=[cpu_val, ram_val, 58], names=["CPU", "RAM", "Disk"],
                  color_discrete_sequence=["#0ea5e9", "#7ca8ff", "#f59e0b"])
    fig3.update_layout(height=350, margin=dict(l=10, r=10, t=10, b=10),
                       paper_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig3, use_container_width=True)

# ---------------------------------------------------------------------------
# Alerts page
# ---------------------------------------------------------------------------
def show_alerts():
    st.markdown("## 🚨 Alerts & Notifications")
    alerts = st.session_state.alerts
    if not alerts:
        st.info("No alerts found.")
        return

    sev_filter = st.selectbox("Filter by Severity", ["All", "Critical", "Warning", "Info"])
    status_filter = st.selectbox("Filter by Status", ["All", "Active", "Resolved"])

    filtered = alerts
    if sev_filter != "All":
        filtered = [a for a in filtered if a.get("severity", "").lower() == sev_filter.lower()]
    if status_filter != "All":
        filtered = [a for a in filtered if a.get("status", "").lower() == status_filter.lower()]

    st.markdown(f"**{len(filtered)} alert(s)**")

    for a in filtered:
        cls, label = status_badge(a.get("severity", "info"))
        ai_tag = " <span style='color:var(--accent); font-weight:bold;'>[AI]</span>" if a.get("aiGenerated") else ""
        st.markdown(f"""
        <div class="glass" style="margin-bottom:0.75rem; padding:0.85rem; border-radius:8px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:700; color:var(--text);">{a.get('message','Alert')}{ai_tag}</div>
                    <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
                        {a.get('alert_type','').replace('_',' ')} · {a.get('system_id','system')[:8]} · {a.get('status','active').upper()}
                    </div>
                </div>
                <span class="status-badge {cls}">{label}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Settings page
# ---------------------------------------------------------------------------
def show_settings():
    st.markdown("## ⚙ Settings")
    tab1, tab2, tab3, tab4 = st.tabs(["Account", "Appearance", "Data & Privacy", "Compliance"])

    with tab1:
        st.markdown("### Account")
        st.text_input("Email", value=st.session_state.user.get("email", ""), disabled=True)
        st.text_input("Name", value=st.session_state.user.get("name", ""))
        if st.button("Change Password", key="chg_pw"):
            st.info("Password change would be handled via secure email flow.")
        st.divider()
        st.markdown("### Danger Zone")
        if st.button("Delete My Account", key="del_acct", type="secondary"):
            st.session_state.show_delete = True
        if st.session_state.get("show_delete"):
            st.error("Are you sure? This action cannot be undone.")
            col1, col2 = st.columns(2)
            with col1:
                if st.button("Yes, Delete Account", key="confirm_del"):
                    logout()
                    st.session_state.page = "Dashboard"
                    st.rerun()
            with col2:
                if st.button("Cancel", key="cancel_del"):
                    st.session_state.show_delete = False
                    st.rerun()

    with tab2:
        st.markdown("### Appearance")
        st.markdown("Select your preferred theme:")
        t_cols = st.columns(len(THEMES))
        for i, t in enumerate(THEMES):
            if t_cols[i].button(THEME_INFO[t]["label"], key=f"setting_theme_{t}",
                               use_container_width=True,
                               type="primary" if st.session_state.theme == t else "secondary"):
                st.session_state.theme = t
                st.rerun()
        st.info("Theme changes apply immediately.")

    with tab3:
        st.markdown("### Data & Privacy")
        st.markdown("All data is stored locally in your browser session (Streamlit session state).")
        if st.button("Request Data Deletion", key="req_del"):
            st.success("Data deletion request submitted. We will process it within 30 days.")
        if st.button("Export My Data", key="exp_data"):
            data = json.dumps({
                "systems": st.session_state.systems,
                "metrics": st.session_state.metrics,
                "alerts": st.session_state.alerts,
                "processes": st.session_state.processes,
            }, indent=2)
            st.download_button("Download data.json", data=data,
                               file_name="os-monitor-data.json", mime="application/json")

    with tab4:
        st.markdown("### Compliance Documents")
        st.markdown("""
        - [Privacy Policy](#privacy) — How we collect and use your data
        - [Terms of Service](#terms) — Terms of using this platform
        - [Refund Policy](#refund) — Refund and cancellation terms
        - [Cookie Consent](#cookies) — Our cookie usage policy
        """)
        st.info("Full policy pages are available in the web version at /privacy, /terms, /refund.")

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
if not st.session_state.authenticated:
    col1, col2 = st.columns([1, 1])
    with col1:
        show_login()
    with col2:
        show_signup()
else:
    if st.session_state.page == "Dashboard":
        show_dashboard()
    elif st.session_state.page == "Processes":
        show_processes()
    elif st.session_state.page == "Analytics":
        show_analytics()
    elif st.session_state.page == "Alerts":
        show_alerts()
    elif st.session_state.page == "Settings":
        show_settings()

# Footer
st.divider()
st.markdown("""
<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:1rem 0;">
    OS Resource Monitoring & Alert System · ParindeOS<br>
    Demo deployment on Streamlit Cloud · All data is local session storage
</div>
""", unsafe_allow_html=True)
